// Browser test of the .xlsx upload box on machine-sales.html, with real Ksher exports.
// The page is served from this folder; its API calls are answered by the real Worker code running against a node:sqlite stand-in
// for D1 (seeded from the pre-migration sheet snapshot). Needs Playwright (borrowed from AlwaysRunner3) and internet (SheetJS CDN).
//   node --no-warnings scripts/e2e-upload.mjs [folder-with-xlsx-files]   (default: ~/Downloads, files named 01a1*.xlsx)
import { DatabaseSync } from "node:sqlite";
import { createRequire } from "node:module";
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const SNAP = process.env.SNAPSHOT_DIR ?? "D:/Demo/VSCode/Maysa/tmp/larna-export/";
const XLSX_DIR = process.argv[2] ?? path.join(os.homedir(), "Downloads");
const API = "https://larnaapi.yai-taweewoot.workers.dev";
let pass = 0, fail = 0;
const ok = (c, msg) => { if (c) { pass++; console.log("  ok  ", msg); } else { fail++; console.log("FAIL:", msg); } };

// ---- D1 stand-in + the real Worker
const sqlite = new DatabaseSync(":memory:");
for (const f of fs.readdirSync(root + "migrations").filter((x) => x.endsWith(".sql")).sort()) sqlite.exec(fs.readFileSync(root + "migrations/" + f, "utf8"));
const wrap = (st) => ({ bind: (...v) => wrap({ ...st, v }), all: async () => ({ results: sqlite.prepare(st.sql).all(...(st.v ?? [])).map((r) => ({ ...r })), meta: {} }), first: async () => { const r = sqlite.prepare(st.sql).get(...(st.v ?? [])); return r ? { ...r } : null; }, run: async () => { const i = sqlite.prepare(st.sql).run(...(st.v ?? [])); return { meta: { changes: Number(i.changes), last_row_id: Number(i.lastInsertRowid) } }; }, _s: st });
const D1 = {
  prepare: (sql) => wrap({ sql }),
  batch: async (stmts) => { sqlite.exec("BEGIN"); try { const out = stmts.map((s) => { const q = s._s; return /^\s*select/i.test(q.sql) ? { results: sqlite.prepare(q.sql).all(...(q.v ?? [])) } : sqlite.prepare(q.sql).run(...(q.v ?? [])); }); sqlite.exec("COMMIT"); return out; } catch (e) { sqlite.exec("ROLLBACK"); throw e; } },
};
const sheetSales = JSON.parse(fs.readFileSync(SNAP + "machine-sales.json", "utf8")).sales;
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => String(url).startsWith("https://sheet.test") ? new Response(JSON.stringify({ sales: sheetSales }), { headers: { "content-type": "application/json" } }) : realFetch(url, init);
globalThis.caches = { default: { async match() { return undefined; }, async put() {} } };
const larna = await import(new URL("../larna-data.js", import.meta.url));
const worker = (await import(new URL("../cloudflare-worker.js", import.meta.url))).default;
const env = { DB: D1, SHEETS_URL: "https://sheet.test/exec", ADMIN_PIN: "123456", SESSION_SECRET: "test-secret-test-secret-test-secret" };
await larna.syncMachineSales(env);
const n = (sql, ...p) => sqlite.prepare(sql).get(...p).n;
console.log("seeded", n("select count(*) n from machine_sales"), "kiosk lines from the sheet snapshot");
const loginRes = await worker.fetch(new Request("https://x.test/api/admin/login", { method: "POST", body: JSON.stringify({ pin: env.ADMIN_PIN }) }), env, { waitUntil() {} });
const TOKEN = (await loginRes.json()).token;

// ---- static server for the page
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = path.join(root, p === "/" ? "index.html" : p);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png", ".gif": "image/gif", ".json": "application/json" }[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const { chromium } = createRequire("D:/Demo/VSCode/AlwaysRunner3/")("playwright");
const browser = await chromium.launch();
// the page registers a service worker (admin-sw.js) whose fetches Playwright cannot route; block it so the API stub sees every call
const context = await browser.newContext({ viewport: { width: 1100, height: 1000 }, serviceWorkers: "block" });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
if (process.env.DEBUG_E2E) { page.on("request", (r) => console.log("   req", r.method(), r.url().slice(0, 110))); page.on("response", (r) => console.log("   res", r.status(), r.url().slice(0, 90))); page.on("console", (m) => console.log("   console", m.text().slice(0, 150))); }
await page.route(API + "/**", async (route) => {
  const req = route.request();
  if (process.env.DEBUG_E2E) console.log("   api", req.method(), req.url().replace(API, ""));
  const r = await worker.fetch(new Request(req.url(), { method: req.method(), headers: req.headers(), body: ["GET", "HEAD", "OPTIONS"].includes(req.method()) ? undefined : req.postData() }), env, { waitUntil() {} });
  await route.fulfill({ status: r.status, headers: Object.fromEntries(r.headers), body: Buffer.from(await r.arrayBuffer()) });
});
await page.addInitScript((t) => sessionStorage.setItem("dash_token", t), TOKEN);
await page.goto(base + "/machine-sales.html", { waitUntil: "networkidle" });

ok(await page.locator("#uploadToggle").isVisible(), "header shows the upload button");
ok(await page.locator("#uploadPanel").isHidden(), "upload box is closed at first");
await page.click("#uploadToggle");
ok(await page.locator("#uploadPanel").isVisible(), "button opens the upload box");

const files = fs.readdirSync(XLSX_DIR).filter((f) => /^01a1.*\.xlsx$/i.test(f)).map((f) => path.join(XLSX_DIR, f)).sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs);
console.log("real Ksher exports found:", files.map((f) => path.basename(f)));
const salesNow = () => n("select count(*) n from machine_sales");

// wrong kind of file first
const wrongFile = path.join(os.tmpdir(), "not-ksher.txt");
fs.writeFileSync(wrongFile, "hello");
await page.setInputFiles("#uploadFile", wrongFile);
await page.waitForSelector("#uploadMsg .err");
ok(/.xlsx/.test(await page.locator("#uploadMsg").innerText()), "a non-.xlsx file is refused with a clear message");

let lastSummary = null;
for (const f of files) {
  const before = salesNow();
  await page.setInputFiles("#uploadFile", f);
  await page.waitForSelector("#uploadPreview .up-stats, #uploadMsg .err", { timeout: 60000 });
  const err = await page.locator("#uploadMsg .err").count();
  ok(err === 0, `${path.basename(f)}: preview shown (${err ? await page.locator("#uploadMsg").innerText() : "no error"})`);
  if (err) continue;
  const stats = (await page.locator(".up-stat").allInnerTexts()).map((t) => t.replace(/\s+/g, " "));
  console.log("   preview:", stats.join(" | "), "—", (await page.locator("#uploadPreview .up-msg").first().innerText()).replace(/\s+/g, " "));
  ok(salesNow() === before, "preview wrote nothing");
  await page.screenshot({ path: path.join(os.tmpdir(), "e2e-upload-preview.png"), fullPage: false });
  const go = page.locator("#uploadGo");
  if (await go.count()) {
    await go.click();
    await page.waitForSelector("#uploadMsg .ok", { timeout: 30000 });
    console.log("   done:", (await page.locator("#uploadMsg").innerText()).replace(/\s+/g, " "));
    ok(salesNow() >= before, "import finished");
    ok(n("select count(*) n from machine_sales where src='upload'") > 0, "uploaded bills are marked src=upload");
    ok(await page.locator("#uploadHistory li").count() >= 1, "history list shows the upload");
    ok(await page.locator("#content .stats, #content #statsGrid").count() > 0, "dashboard redrawn after the import");
  } else {
    ok(/ตรงกับที่มีอยู่แล้วทั้งหมด/.test(await page.locator("#uploadPreview").innerText()), "nothing to do: the file already matches");
  }
  lastSummary = f;
}

// the same file again: nothing to do
if (lastSummary) {
  await page.setInputFiles("#uploadFile", lastSummary);
  await page.waitForSelector("#uploadPreview .up-stats", { timeout: 60000 });
  ok(/ตรงกับที่มีอยู่แล้วทั้งหมด/.test(await page.locator("#uploadPreview").innerText()) && (await page.locator("#uploadGo").count()) === 0, "re-uploading the same file offers nothing to import");
}
await page.screenshot({ path: path.join(os.tmpdir(), "e2e-upload-final.png"), fullPage: true });

// an .xlsx that is not a sales export
const other = path.join(XLSX_DIR, "PTA_Statement.xlsx");
if (fs.existsSync(other)) {
  await page.setInputFiles("#uploadFile", other);
  await page.waitForSelector("#uploadMsg .err", { timeout: 30000 });
  ok(/Transaction ID/.test(await page.locator("#uploadMsg").innerText()), "another kind of .xlsx is refused: " + (await page.locator("#uploadMsg").innerText()).replace(/\s+/g, " ").slice(0, 120));
}

ok(errors.length === 0, "no JavaScript errors on the page " + JSON.stringify(errors));
await browser.close();
server.close();
console.log(`\ne2e upload: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
