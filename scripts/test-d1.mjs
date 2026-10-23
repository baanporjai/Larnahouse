// Offline tests for the D1 data layer + Worker routes. Uses node:sqlite as a stand-in for D1 and a snapshot of the old
// Google Sheet taken before the migration (SNAPSHOT_DIR, default ../.. /tmp/larna-export, never committed — it has customer data).
//   node --no-warnings scripts/test-d1.mjs
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const SNAP = process.env.SNAPSHOT_DIR ?? "D:/Demo/VSCode/Maysa/tmp/larna-export/";
let pass = 0, fail = 0;
const ok = (c, msg) => { if (c) pass++; else { fail++; console.log("FAIL:", msg); } };

// ---------------------------------------------------------------- D1 stand-in
function makeDb() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(fs.readFileSync(root + "migrations/0001_init.sql", "utf8"));
  class Stmt {
    constructor(sql) { this.sql = sql; this.v = []; }
    bind(...v) { const s = new Stmt(this.sql); s.v = v; return s; }
    all() { const rows = sqlite.prepare(this.sql).all(...this.v).map((r) => ({ ...r })); return { results: rows, meta: {} }; }
    first() { const r = sqlite.prepare(this.sql).get(...this.v); return r ? { ...r } : null; }
    run() { const i = sqlite.prepare(this.sql).run(...this.v); return { meta: { changes: Number(i.changes), last_row_id: Number(i.lastInsertRowid) } }; }
  }
  const exec = (s) => (/^\s*select/i.test(s.sql) || /returning/i.test(s.sql) ? s.all() : s.run());
  return {
    prepare: (sql) => new Stmt(sql),
    async batch(stmts) { sqlite.exec("BEGIN"); try { const out = stmts.map(exec); sqlite.exec("COMMIT"); return out; } catch (e) { sqlite.exec("ROLLBACK"); throw e; } },
    raw: sqlite,
  };
}
// the D1 methods are awaited in the code under test; make the stand-ins thenable-friendly
for (const m of ["all", "first", "run"]) {
  const orig = Object.getOwnPropertyDescriptor; void orig; // keep lint quiet
}

// ---------------------------------------------------------------- the old sheet, served from the snapshot
const snap = (n) => JSON.parse(fs.readFileSync(SNAP + n + ".json", "utf8"));
const sheetOrders = snap("orders").orders, sheetExpenses = snap("expenses").expenses, sheetSales = snap("machine-sales").sales, sheetStock = snap("stock").products;
let salesServed = structuredClone(sheetSales);
const lineCalls = [];
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
  const u = String(url);
  const json = (o) => new Response(JSON.stringify(o), { headers: { "content-type": "application/json" } });
  if (u.startsWith("https://sheet.test/exec")) {
    const action = new URL(u).searchParams.get("action");
    if (!action) return json({ orders: sheetOrders });
    if (action === "expenses") return json({ expenses: sheetExpenses });
    if (action === "machine-sales") return json({ sales: salesServed });
    if (action === "stockAdmin") return json({ products: sheetStock.map((p, i) => ({ ...p, cost: 10 + i })) });
    if (action === "log") return json({ log: [
      { timestamp: "2026-10-02T03:00:00.000Z", id: "mini-larna", oldStock: 5, newStock: 12, delta: 7, note: "รับเข้า" },
      { timestamp: "2026-10-01T03:00:00.000Z", id: "mini-larna", oldStock: 0, newStock: 5, delta: 5, note: "ตั้งต้น" }] });
  }
  if (u.startsWith("https://api.line.me/")) { lineCalls.push(JSON.parse(init.body)); return new Response("{}", { status: 200 }); }
  return realFetch(url, init);
};
globalThis.caches = { default: { store: new Map(), async match(k) { const v = this.store.get(k.url); return v ? v.clone() : undefined; }, async put(k, v) { this.store.set(k.url, v); } } };

const larna = await import(new URL("../larna-data.js", import.meta.url));
const worker = (await import(new URL("../cloudflare-worker.js", import.meta.url))).default;

const db = makeDb();
// D1's prepared statements return promises; wrap the stand-in so `await` works the same
const asyncify = (d) => ({
  prepare: (sql) => { const s = d.prepare(sql); const wrap = (st) => ({ bind: (...v) => wrap(st.bind(...v)), all: async () => st.all(), first: async () => st.first(), run: async () => st.run(), _s: st }); return wrap(s); },
  batch: async (stmts) => d.batch(stmts.map((s) => s._s)),
});
const D1 = asyncify(db);
const env = {
  DB: D1, SHEETS_URL: "https://sheet.test/exec", INVENTORY_API_URL: "https://sheet.test/exec", INVENTORY_ADMIN_KEY: "k",
  ADMIN_PIN: "123456", SESSION_SECRET: "test-secret-test-secret-test-secret", MIGRATE_TOKEN: "mig-token-1234567890",
  LINE_CHANNEL_ACCESS_TOKEN: "t", LINE_TARGET_ID: "u",
};
const ctx = { waitUntil() {} };
const call = (path, init = {}) => worker.fetch(new Request("https://larnaapi.test" + path, init), env, ctx);

// ---------------------------------------------------------------- import + parity with the sheet
let r = await call("/api/migrate/from-sheets", { method: "POST" });
ok(r.status === 401, "migrate refuses without the token");
r = await call("/api/migrate/from-sheets", { method: "POST", headers: { "X-Migrate-Token": "wrong" } });
ok(r.status === 401, "migrate refuses a wrong token");
r = await call("/api/migrate/from-sheets", { method: "POST", headers: { "X-Migrate-Token": env.MIGRATE_TOKEN } });
const rep = (await r.json()).report;
ok(rep.orders.sheet === sheetOrders.length && rep.orders.inD1 === sheetOrders.length, "all orders imported " + JSON.stringify(rep.orders));
ok(rep.stock.inD1 === sheetStock.length, "all stock rows imported");
ok(rep.stockLog.inD1 === 2, "stock log imported");
ok(rep.expenses.inD1 === sheetExpenses.length, "all expenses imported");
ok(rep.machineSalesInD1 === sheetSales.length && rep.machineSales.ok, "all kiosk sales imported " + JSON.stringify(rep.machineSales));

// login
r = await call("/api/admin/login", { method: "POST", body: JSON.stringify({ pin: "000000" }) });
ok(r.status === 401, "wrong PIN refused");
r = await call("/api/admin/login", { method: "POST", body: JSON.stringify({ pin: env.ADMIN_PIN }) });
const token = (await r.json()).token;
const auth = { headers: { Authorization: `Bearer ${token}` } };
ok(!!token, "PIN login gives a token");
for (const p of ["/api/admin/orders", "/api/admin/expenses", "/api/admin/machine-sales", "/api/admin/stock-log", "/api/admin/stock-cost"]) {
  ok((await call(p)).status === 401, `${p} needs the token`);
  ok((await call(p, auth)).status === 200, `${p} works with the token`);
}

// orders: same rows, same fields, same order as the sheet
const got = (await (await call("/api/admin/orders", auth)).json()).orders;
ok(got.length === sheetOrders.length, "order count matches the sheet");
let diffs = 0;
sheetOrders.forEach((s, i) => {
  const g = got[i];
  for (const k of ["_row", "timestamp", "name", "address", "date", "items", "total", "note", "status", "id"]) if (String(g[k]) !== String(s[k])) { diffs++; if (diffs < 4) console.log("  order diff", i, k, JSON.stringify(s[k]), "->", JSON.stringify(g[k])); }
  if (String(g.phone) !== String(s.phone)) diffs++;
});
ok(diffs === 0, `every order field identical to the sheet (${diffs} differences)`);

// expenses
const gotExp = (await (await call("/api/admin/expenses", auth)).json()).expenses;
ok(gotExp.length === sheetExpenses.length && gotExp.every((e, i) => ["timestamp", "id", "type", "category", "description", "amount", "date", "note"].every((k) => String(e[k]) === String(sheetExpenses[i][k]))), "expenses identical to the sheet");

// kiosk sales: same rows (order inside the same timestamp may differ, so compare as sets), same types
const gotSales = (await (await call("/api/admin/machine-sales", auth)).json()).sales;
const norm = (s) => JSON.stringify(["transactiondate", "transactionid", "ksherorderno", "merchantid", "kioskid", "kioskname", "paymentmethod", "coupon", "promotion", "cartenable", "status", "productname", "subtotal", "discount", "grandtotal"].map((k) => s[k] ?? null));
const a = sheetSales.map(norm).sort(), b = gotSales.map(norm).sort();
ok(a.length === b.length && a.every((x, i) => x === b[i]), "kiosk sales identical to the sheet (values and types)");

// stock: public hides cost, admin shows it
const pub = await (await call("/api/stock")).json();
ok(pub.products.length === sheetStock.length && pub.products.every((p) => !("cost" in p)), "public stock has no cost");
ok(pub.products.every((p, i) => p.id === sheetStock[i].id && p.stock === sheetStock[i].stock && p.threshold === sheetStock[i].threshold), "public stock equals the sheet");
const adm = await (await call("/api/admin/stock-cost", auth)).json();
ok(adm.products.every((p) => typeof p.cost === "number"), "admin stock includes cost");
ok((await call("/api/stock")).headers.get("X-Larna-Cache") === "HIT", "public stock is edge-cached after the first read");

// ---------------------------------------------------------------- import twice does not duplicate
await call("/api/migrate/from-sheets", { method: "POST", headers: { "X-Migrate-Token": env.MIGRATE_TOKEN } });
const cnt = (t) => db.raw.prepare(`select count(*) n from ${t}`).get().n;
ok(cnt("orders") === sheetOrders.length && cnt("expenses") === sheetExpenses.length && cnt("stock_log") === 2 && cnt("machine_sales") === sheetSales.length, "a second import adds nothing");

// ---------------------------------------------------------------- new order from the website
const before = (await (await call("/api/stock?fresh=1")).json()).products.find((p) => p.id === "mini-larna").stock;
r = await call("/api/order", { method: "POST", body: JSON.stringify({
  name: "ลูกค้าทดสอบ", phone: "0800000000", address: "1 ถนนทดสอบ", date: "2026-11-02", note: "ทดสอบ",
  items: [{ id: "mini-larna", name: "มินิ ลาร์นา เค้ก (ออริจินัล)", qty: 3 }], total: 180 }) });
ok(r.status === 200 && lineCalls.length === 1, "order accepted and LINE notified");
const after = (await (await call("/api/stock?fresh=1")).json()).products.find((p) => p.id === "mini-larna").stock;
ok(after === before - 3, `stock reduced by the ordered quantity (${before} -> ${after})`);
let ords = (await (await call("/api/admin/orders", auth)).json()).orders;
const mine = ords[ords.length - 1];
ok(ords.length === sheetOrders.length + 1 && mine.name === "ลูกค้าทดสอบ" && mine.items === "มินิ ลาร์นา เค้ก (ออริจินัล) x3" && mine.status === "รอยืนยัน" && mine._row === sheetOrders.length + 2, "new order appears last with the next row number");
ok(/^\d{1,2}\/\d{1,2}\/25\d{2} \d{1,2}:\d{2}:\d{2}$/.test(mine.timestamp), "timestamp is Thai พ.ศ. format " + mine.timestamp);
const logAfter = (await (await call("/api/admin/stock-log", auth)).json()).log;
ok(logAfter[0].id === "mini-larna" && logAfter[0].delta === -3 && /ออเดอร์เว็บไซต์/.test(logAfter[0].note), "stock log records the sale");

// invalid orders
ok((await call("/api/order", { method: "POST", body: JSON.stringify({ name: "x" }) })).status === 400, "incomplete order refused");

// status + edit, by id and by row fallback
r = await call("/api/admin/update-status", { method: "POST", ...auth, body: JSON.stringify({ id: mine.id, status: "ยืนยันแล้ว" }) });
ok(r.status === 200, "status update by id");
r = await call("/api/admin/update-status", { method: "POST", ...auth, body: JSON.stringify({ row: mine._row, status: "จัดส่งแล้ว" }) });
ords = (await (await call("/api/admin/orders", auth)).json()).orders;
ok(ords[ords.length - 1].status === "จัดส่งแล้ว", "status update by row number fallback");
r = await call("/api/admin/update-status", { method: "POST", ...auth, body: JSON.stringify({ id: "nope", status: "x" }) });
ok(r.status === 404, "status update on a missing order is reported, not silently OK");
r = await call("/api/admin/update-order", { method: "POST", ...auth, body: JSON.stringify({ id: mine.id, name: "แก้ชื่อ", total: 200, items: "มินิ ลาร์นา เค้ก (ออริจินัล) x2" }) });
ords = (await (await call("/api/admin/orders", auth)).json()).orders;
ok(ords[ords.length - 1].name === "แก้ชื่อ" && ords[ords.length - 1].total === 200 && ords[ords.length - 1].phone === "0800000000", "order edit changes only the sent fields");
ok((await call("/api/admin/update-order", { method: "POST", ...auth, body: JSON.stringify({ name: "x" }) })).status === 400, "edit without id/row refused");

// stock: set / adjust / concurrency / unknown product
r = await call("/api/admin/stock-update", { method: "POST", ...auth, body: JSON.stringify({ action: "setStock", id: "mini-larna", newStock: 50, note: "นับสต็อก", cost: 21.5 }) });
let res = await r.json();
ok(res.success && res.newStock === 50 && res.oldStock === after, "setStock returns old/new");
ok((await (await call("/api/admin/stock-cost", auth)).json()).products.find((p) => p.id === "mini-larna").cost === 21.5, "setStock updates the cost");
await Promise.all(Array.from({ length: 10 }, () => call("/api/admin/stock-update", { method: "POST", ...auth, body: JSON.stringify({ action: "adjustStock", id: "mini-larna", delta: -1, note: "พร้อมกัน" }) })));
const finalStock = (await (await call("/api/stock?fresh=1")).json()).products.find((p) => p.id === "mini-larna").stock;
ok(finalStock === 40, `10 simultaneous adjustments all count (50 -> ${finalStock})`);
ok(db.raw.prepare("select count(*) n from stock_log where note='พร้อมกัน'").get().n === 10, "each simultaneous adjustment is logged");
r = await call("/api/admin/stock-update", { method: "POST", ...auth, body: JSON.stringify({ action: "adjustStock", id: "no-such", delta: -1 }) });
ok((await r.json()).error === "product not found", "adjusting an unknown product is an error");
r = await call("/api/admin/stock-update", { method: "POST", ...auth, body: JSON.stringify({ action: "setStock", id: "new-item", name: "สินค้าใหม่", newStock: 7, note: "เพิ่มใหม่" }) });
res = await r.json();
ok(res.created === true && (await (await call("/api/stock?fresh=1")).json()).products.some((p) => p.id === "new-item" && p.threshold === 5), "setStock creates a new product with the default threshold");
r = await call("/api/admin/stock-update", { method: "POST", ...auth, body: JSON.stringify({ action: "setStock", id: "mini-larna", newStock: "abc" }) });
ok((await r.json()).error, "non-numeric stock refused");

// expenses add / edit / delete
r = await call("/api/admin/expenses", { method: "POST", ...auth, body: JSON.stringify({ id: "exp-test-1", type: "opex", category: "ค่าเช่า", description: "ทดสอบ", amount: 1000, date: "2026-10-23" }) });
ok((await r.json()).success, "expense added");
r = await call("/api/admin/expenses", { method: "POST", ...auth, body: JSON.stringify({ action: "update", id: "exp-test-1", amount: 1200, note: "แก้" }) });
ok((await r.json()).success, "expense updated");
let exps = (await (await call("/api/admin/expenses", auth)).json()).expenses;
ok(exps[exps.length - 1].amount === 1200 && exps[exps.length - 1].description === "ทดสอบ", "expense edit keeps untouched fields");
ok((await call("/api/admin/expenses", { method: "POST", ...auth, body: JSON.stringify({ id: "x", type: "bad", category: "c", amount: 1, date: "2026-10-23" }) })).status === 400, "bad expense type refused");
r = await call("/api/admin/expenses", { method: "POST", ...auth, body: JSON.stringify({ action: "delete", id: "exp-test-1" }) });
ok((await r.json()).success, "expense deleted");
r = await call("/api/admin/expenses", { method: "POST", ...auth, body: JSON.stringify({ action: "delete", id: "exp-test-1" }) });
ok(r.status === 404, "deleting twice is reported");

// ---------------------------------------------------------------- kiosk sales sync: incremental
let s1 = await larna.syncMachineSales(env);
ok(s1.ok && s1.added === 0 && s1.changed === 0, "re-sync with no change writes nothing " + JSON.stringify(s1));
const pend = salesServed.findIndex((x) => x.status === "pending");
salesServed[pend] = { ...salesServed[pend], status: "paid" };
salesServed.push({ transactiondate: "2026-10-23 13:00:00", transactionid: "newtxn0001", ksherorderno: "9", merchantid: "m", kioskid: "larnacake01", kioskname: "larnacake01", paymentmethod: "Promptpay", coupon: "", promotion: "", cartenable: "Yes", status: "paid", productname: "2 x มินิ ลาร์นา เค้ก (ออริจินัล)", subtotal: 120, discount: 0, grandtotal: 120 });
s1 = await larna.syncMachineSales(env);
ok(s1.ok && s1.added === 1 && s1.changed === 1, "sync picks up one new row and one status change " + JSON.stringify(s1));
const salesNow = (await (await call("/api/admin/machine-sales", auth)).json()).sales;
ok(salesNow.length === sheetSales.length + 1 && salesNow.some((x) => x.transactionid === "newtxn0001"), "new kiosk sale visible");
r = await call("/api/admin/machine-sales?fresh=1", auth);
ok(r.headers.get("X-Larna-Sync") === "ok", "refresh button triggers a sync");
// sheet unreachable: pages still serve from D1
const saved = env.SHEETS_URL; env.SHEETS_URL = "https://down.invalid/exec";
const savedFetch = globalThis.fetch; globalThis.fetch = async (u, i) => { if (String(u).startsWith("https://down.invalid")) throw new Error("network down"); return savedFetch(u, i); };
r = await call("/api/admin/machine-sales?fresh=1", auth);
ok(r.status === 200 && r.headers.get("X-Larna-Sync") === "failed" && (await r.json()).sales.length === salesNow.length, "sheet outage does not break the page");
globalThis.fetch = savedFetch; env.SHEETS_URL = saved;

// widget calendar reads D1
env.WIDGET_TOKEN = "widget-token-1234567890";
r = await call("/api/widget/daily-sales-calendar?month=2026-9", { headers: { "X-Widget-Token": env.WIDGET_TOKEN } });
const cal = await r.json();
ok(r.status === 200 && cal.month === "2026-10" && cal.monthCups > 0, "widget calendar computed from D1 " + JSON.stringify({ m: cal.month, cups: cal.monthCups }));
ok((await call("/api/widget/daily-sales-calendar")).status === 401, "widget needs its token");

// cron entry point
await worker.scheduled({}, env, ctx);
ok(true, "scheduled handler runs");

// ---------------------------------------------------------------- LINE bot helpers read D1
const hist = await larna.customerHistory(D1);
ok(hist.length > 0 && hist.every((h) => h.name && typeof h.orderCount === "number"), "customer history for the bot comes from D1 (" + hist.length + " customers)");

// ---------------------------------------------------------------- an order that arrives before the import runs is kept
{
  const db2 = makeDb();
  const D2 = asyncify(db2);
  const id = await larna.createOrder(D2, { name: "มาก่อนนำเข้า", phone: "0811111111", address: "x", items: [{ name: "สินค้า", qty: 1 }], total: 60 });
  ok(db2.raw.prepare("select row_no n from orders where id=?").get(id).n === 2, "first order on an empty D1 takes row 2");
  const rep2 = await larna.importFromSheet({ ...env, DB: D2 });
  ok(rep2.orders.keptFromBeforeImport === 1 && rep2.orders.inD1 === sheetOrders.length + 1, "import keeps the order that arrived first " + JSON.stringify(rep2.orders));
  const maxSheetRow = Math.max(...sheetOrders.map((o) => o._row));
  ok(db2.raw.prepare("select row_no n from orders where id=?").get(id).n === maxSheetRow + 1, "…and numbers it after the sheet's last row");
  ok(db2.raw.prepare("select count(*) n from orders where row_no < 0").get().n === 0, "no parked rows left over");
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
