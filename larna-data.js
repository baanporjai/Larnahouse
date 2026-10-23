/**
 * Larna House — data layer on Cloudflare D1 (replaces the Google Sheet + Apps Script).
 *
 * Every function returns exactly the JSON shape the old Apps Script returned (see
 * _apps-script-reference.gs), so dashboard.html / accounting.html / stock.html /
 * machine-sales.html and the widgets keep working without changes.
 *
 * Times: stored as unix seconds (UTC). Shown to people as Thailand time, D/M/พ.ศ. H:MM:SS,
 * which is the format the pages already parse.
 */

const BANGKOK_OFFSET_S = 7 * 3600;

// ---------------------------------------------------------------- time helpers
/** unix seconds -> "10/7/2569 10:35:47" (Thailand time, พ.ศ.) */
export function formatThaiTimestamp(unix) {
  if (unix == null) return '';
  const d = new Date((unix + BANGKOK_OFFSET_S) * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCDate()}/${d.getUTCMonth() + 1}/${d.getUTCFullYear() + 543} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

/** "10/7/2569 10:35:47" (Thailand time, พ.ศ. or ค.ศ.) -> unix seconds, or null */
export function parseThaiTimestamp(s) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(String(s ?? '').trim());
  if (!m) return null;
  const year = +m[3] > 2400 ? +m[3] - 543 : +m[3];
  return Math.floor(Date.UTC(year, +m[2] - 1, +m[1], +m[4], +m[5], +(m[6] || 0)) / 1000) - BANGKOK_OFFSET_S;
}

/** any date-ish value from the old sheet (ISO string, Date, Thai string) -> unix seconds, or null */
function toUnix(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return value > 1e11 ? Math.floor(value / 1000) : Math.floor(value);
  const thai = parseThaiTimestamp(value);
  if (thai != null) return thai;
  const t = Date.parse(String(value));
  return Number.isNaN(t) ? null : Math.floor(t / 1000);
}

const nowS = () => Math.floor(Date.now() / 1000);
const text = (v) => (v == null ? '' : String(v));

// ---------------------------------------------------------------- orders
export async function listOrders(db) {
  const rows = await db.prepare(
    'SELECT id, row_no, created_at, name, phone, address, date, items, total, note, status FROM orders ORDER BY row_no',
  ).all();
  return {
    orders: rows.results.map((r) => ({
      _row: r.row_no,
      timestamp: formatThaiTimestamp(r.created_at),
      name: r.name,
      phone: r.phone,
      address: r.address,
      date: r.date,
      items: r.items,
      total: r.total,
      note: r.note,
      status: r.status || 'รอยืนยัน',
      id: r.id,
    })),
  };
}

/** order.html / LINE bot payload -> a new row. Returns the order id. */
export async function createOrder(db, data) {
  const items = (data.items || []).map((i) => `${i.name} x${i.qty}`).join(', ');
  const id = data.id || crypto.randomUUID();
  // row_no continues the old sheet's row numbers; computed inside the INSERT so two orders at once cannot share one
  await db.prepare(
    `INSERT INTO orders (id, row_no, created_at, name, phone, address, date, items, total, note, status)
     VALUES (?1, (SELECT COALESCE(MAX(row_no), 1) + 1 FROM orders), ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 'รอยืนยัน')`,
  ).bind(id, nowS(), text(data.name), text(data.phone), text(data.address), text(data.date || '-'), items, Number(data.total) || 0, text(data.note || '-')).run();
  return id;
}

async function findOrderRow(db, id, row) {
  if (id) {
    const r = await db.prepare('SELECT row_no FROM orders WHERE id = ?').bind(String(id)).first();
    if (r) return r.row_no;
  }
  if (row) {
    const r = await db.prepare('SELECT row_no FROM orders WHERE row_no = ?').bind(Number(row)).first();
    if (r) return r.row_no;
  }
  return null;
}

export async function updateOrderStatus(db, { id, row, status }) {
  const rowNo = await findOrderRow(db, id, row);
  if (!rowNo) return { ok: false, error: 'Order not found' };
  await db.prepare('UPDATE orders SET status = ? WHERE row_no = ?').bind(text(status), rowNo).run();
  return { ok: true };
}

const EDITABLE_ORDER_FIELDS = ['name', 'phone', 'address', 'date', 'items', 'total', 'note'];
export async function updateOrder(db, data) {
  const rowNo = await findOrderRow(db, data.id, data.row);
  if (!rowNo) return { ok: false, error: 'Order not found' };
  const sets = [], binds = [];
  for (const f of EDITABLE_ORDER_FIELDS) {
    if (f in data) { sets.push(`${f} = ?`); binds.push(f === 'total' ? Number(data[f]) || 0 : text(data[f])); }
  }
  if (sets.length) await db.prepare(`UPDATE orders SET ${sets.join(', ')} WHERE row_no = ?`).bind(...binds, rowNo).run();
  return { ok: true };
}

export async function getOrderById(db, id) {
  return db.prepare('SELECT id, name, items, status FROM orders WHERE id = ?').bind(String(id)).first();
}

/** customer history for the LINE bot: latest phone/address per name, newest order first */
export async function customerHistory(db) {
  const rows = await db.prepare('SELECT name, phone, address FROM orders ORDER BY created_at DESC, row_no DESC').all();
  const byName = new Map();
  for (const r of rows.results) {
    const name = text(r.name).trim();
    if (!name) continue;
    const e = byName.get(name);
    if (e) e.orderCount += 1;
    else byName.set(name, { name, phone: text(r.phone), address: text(r.address), orderCount: 1 });
  }
  return [...byName.values()];
}

// ---------------------------------------------------------------- stock
export async function getStock(db, includeCost) {
  const rows = await db.prepare('SELECT id, name, stock, threshold, cost, last_updated FROM stock_products ORDER BY rowid').all();
  return {
    products: rows.results.map((r) => {
      const item = {
        id: r.id,
        name: r.name,
        stock: r.stock,
        threshold: r.threshold,
        lastUpdated: r.last_updated ? new Date(r.last_updated * 1000).toISOString() : '',
      };
      if (includeCost) item.cost = Number(r.cost) || 0;
      return item;
    }),
  };
}

const NEW_PRODUCT_DEFAULT_THRESHOLD = 5;

/** Sets stock to an exact number (stock.html "save"). Creates the product row if it is new. */
export async function setStock(db, { id, newStock, note, cost, name }) {
  if (!id || Number.isNaN(Number(newStock))) return { error: 'invalid stock value' };
  newStock = Math.trunc(Number(newStock));
  const t = nowS();
  const existing = await db.prepare('SELECT stock FROM stock_products WHERE id = ?').bind(id).first();
  const hasCost = cost !== undefined && cost !== null && cost !== '' && !Number.isNaN(Number(cost));
  if (!existing) {
    await db.batch([
      db.prepare('INSERT INTO stock_products (id, name, stock, threshold, cost, last_updated) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(id, name || id, newStock, NEW_PRODUCT_DEFAULT_THRESHOLD, hasCost ? Number(cost) : null, t),
      db.prepare('INSERT INTO stock_log (ts, product_id, old_stock, new_stock, delta, note) VALUES (?, ?, 0, ?, ?, ?)').bind(t, id, newStock, newStock, text(note)),
    ]);
    return { success: true, id, oldStock: 0, newStock, created: true };
  }
  const oldStock = existing.stock;
  await db.batch([
    db.prepare('UPDATE stock_products SET stock = ?, last_updated = ?, name = COALESCE(NULLIF(?, \'\'), name), cost = CASE WHEN ? THEN ? ELSE cost END WHERE id = ?')
      .bind(newStock, t, text(name), hasCost ? 1 : 0, hasCost ? Number(cost) : null, id),
    db.prepare('INSERT INTO stock_log (ts, product_id, old_stock, new_stock, delta, note) VALUES (?, ?, ?, ?, ?, ?)').bind(t, id, oldStock, newStock, newStock - oldStock, text(note)),
  ]);
  return { success: true, id, oldStock, newStock };
}

/**
 * Adds `delta` (negative = take out) to a product. Done as one UPDATE so two orders arriving
 * at the same moment cannot overwrite each other's change, and the log row is written in the
 * same batch from the row's own new value.
 */
export async function adjustStock(db, { id, delta, note }) {
  delta = Math.trunc(Number(delta));
  if (!id || Number.isNaN(delta)) return { error: 'invalid delta value' };
  const t = nowS();
  const res = await db.batch([
    db.prepare('UPDATE stock_products SET stock = stock + ?1, last_updated = ?2 WHERE id = ?3 RETURNING stock').bind(delta, t, id),
    db.prepare('INSERT INTO stock_log (ts, product_id, old_stock, new_stock, delta, note) SELECT ?1, id, stock - ?2, stock, ?2, ?3 FROM stock_products WHERE id = ?4 AND last_updated = ?1')
      .bind(t, delta, text(note), id),
  ]);
  const row = res[0].results[0];
  if (!row) return { error: 'product not found' };
  return { success: true, id, oldStock: row.stock - delta, newStock: row.stock };
}

export async function getStockLog(db) {
  const rows = await db.prepare('SELECT ts, product_id, old_stock, new_stock, delta, note FROM stock_log ORDER BY ts DESC, id DESC').all();
  return {
    log: rows.results.map((r) => ({
      timestamp: new Date(r.ts * 1000).toISOString(),
      id: r.product_id,
      oldStock: r.old_stock,
      newStock: r.new_stock,
      delta: r.delta,
      note: r.note,
    })),
  };
}

// ---------------------------------------------------------------- expenses
export async function listExpenses(db) {
  const rows = await db.prepare('SELECT created_at, id, type, category, description, amount, date, note FROM expenses ORDER BY seq').all();
  return {
    expenses: rows.results.map((r) => ({
      timestamp: formatThaiTimestamp(r.created_at),
      id: r.id, type: r.type, category: r.category, description: r.description, amount: r.amount, date: r.date, note: r.note,
    })),
  };
}

export async function addExpense(db, data) {
  const id = data.id || crypto.randomUUID();
  await db.prepare('INSERT INTO expenses (id, created_at, type, category, description, amount, date, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, nowS(), text(data.type || 'opex'), text(data.category), text(data.description), Number(data.amount) || 0, text(data.date), text(data.note)).run();
  return { success: true, id };
}

const EDITABLE_EXPENSE_FIELDS = ['type', 'category', 'description', 'amount', 'date', 'note'];
export async function updateExpense(db, data) {
  const sets = [], binds = [];
  for (const f of EDITABLE_EXPENSE_FIELDS) {
    if (f in data) { sets.push(`${f} = ?`); binds.push(f === 'amount' ? Number(data[f]) || 0 : text(data[f])); }
  }
  if (!sets.length) {
    const found = await db.prepare('SELECT 1 FROM expenses WHERE id = ?').bind(String(data.id)).first();
    return found ? { success: true } : { success: false, error: 'Expense id not found' };
  }
  const r = await db.prepare(`UPDATE expenses SET ${sets.join(', ')} WHERE id = ?`).bind(...binds, String(data.id)).run();
  return r.meta.changes ? { success: true } : { success: false, error: 'Expense id not found' };
}

export async function deleteExpense(db, data) {
  const r = await db.prepare('DELETE FROM expenses WHERE id = ?').bind(String(data.id)).run();
  return r.meta.changes ? { success: true } : { success: false, error: 'Expense id not found' };
}

// ---------------------------------------------------------------- machine sales (kiosk, filled into the sheet by Ksher)
// Ksher still appends rows to the "inbox" tab of the Google Sheet, so the sheet remains the intake. A cron job
// (and the page's refresh button) copies new/changed rows into D1; every page reads D1, never the sheet.
const SALE_FIELDS = ['transactiondate', 'transactionid', 'ksherorderno', 'merchantid', 'kioskid', 'kioskname', 'paymentmethod', 'coupon', 'promotion', 'cartenable', 'status', 'productname', 'subtotal', 'discount', 'grandtotal'];
const SYNC_TIMEOUT_MS = 25 * 1000;

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36) + s.length.toString(36);
}

export async function listMachineSales(db) {
  // newest 400 days — the pages show months/calendars, not the whole history
  const cutoff = new Date(Date.now() + BANGKOK_OFFSET_S * 1000 - 400 * 86400 * 1000).toISOString().slice(0, 10);
  const rows = await db.prepare(
    `SELECT ${SALE_FIELDS.join(', ')} FROM machine_sales WHERE transactiondate >= ? OR transactiondate IS NULL OR transactiondate = '' ORDER BY transactiondate, seq`,
  ).bind(cutoff).all();
  return { sales: rows.results };
}

/** Reads the sheet's inbox tab through the Apps Script and upserts only the rows that are new or changed. */
export async function syncMachineSales(env) {
  if (!env.SHEETS_URL) return { ok: false, error: 'SHEETS_URL not configured' };
  const t0 = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SYNC_TIMEOUT_MS);
  let sales;
  try {
    const res = await fetch(env.SHEETS_URL + '?action=machine-sales', { signal: controller.signal, redirect: 'follow' });
    const body = await res.json();
    if (!Array.isArray(body.sales)) return { ok: false, error: body.error || 'unexpected sheet response' };
    sales = body.sales;
  } catch (e) {
    return { ok: false, error: e.name === 'AbortError' ? `sheet did not answer within ${SYNC_TIMEOUT_MS / 1000}s` : String(e.message || e) };
  } finally {
    clearTimeout(timer);
  }

  const db = env.DB;
  const existing = new Map();
  const have = await db.prepare('SELECT txn_id, line_no, row_hash FROM machine_sales').all();
  for (const r of have.results) existing.set(`${r.txn_id}\u0000${r.line_no}`, r.row_hash);
  let seq = (await db.prepare('SELECT COALESCE(MAX(seq), 0) AS m FROM machine_sales').first()).m;

  const lineCounter = new Map();
  const stmts = [];
  let added = 0, changed = 0;
  for (const s of sales) {
    const txn = text(s.transactionid) || `d:${text(s.transactiondate)}`;
    if (!text(s.transactionid) && !text(s.transactiondate)) continue; // blank row at the end of the sheet
    const line = lineCounter.get(txn) ?? 0;
    lineCounter.set(txn, line + 1);
    const values = SALE_FIELDS.map((f) => (s[f] === undefined ? null : s[f]));
    const hash = hashString(JSON.stringify(values));
    const key = `${txn}\u0000${line}`;
    const prev = existing.get(key);
    if (prev === hash) continue;
    if (prev === undefined) { added++; seq++; } else changed++;
    stmts.push(db.prepare(
      `INSERT INTO machine_sales (txn_id, line_no, seq, ${SALE_FIELDS.join(', ')}, row_hash)
       VALUES (?, ?, ?, ${SALE_FIELDS.map(() => '?').join(', ')}, ?)
       ON CONFLICT (txn_id, line_no) DO UPDATE SET ${SALE_FIELDS.map((f) => `${f} = excluded.${f}`).join(', ')}, row_hash = excluded.row_hash`,
    ).bind(txn, line, seq, ...values, hash));
  }
  for (let i = 0; i < stmts.length; i += 80) await db.batch(stmts.slice(i, i + 80));
  await db.prepare("INSERT INTO meta (key, value) VALUES ('machine_sales_synced_at', ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value").bind(String(nowS())).run();
  return { ok: true, rowsInSheet: sales.length, added, changed, ms: Date.now() - t0 };
}

// ---------------------------------------------------------------- one-off import from the old Google Sheet
async function callSheet(url, init) {
  const res = await fetch(url, { redirect: 'follow', ...init });
  return res.json();
}

/**
 * Copies Orders, Stock (+cost), Log and Expenses from the old Apps Script into D1, then syncs machine sales.
 * Safe to run twice: orders/expenses are matched by id, stock by product id, and the log is only imported
 * while the log table is still empty.
 */
export async function importFromSheet(env) {
  const db = env.DB;
  const report = {};
  const sheet = (q) => callSheet(env.SHEETS_URL + q);
  const inventory = (q) => callSheet(env.INVENTORY_API_URL + q);

  // orders
  const orders = (await sheet('')).orders || [];
  // Orders that arrived in D1 between switching the Worker over and running this import (not in the sheet) would
  // collide with the sheet's row numbers. Park them out of the way, import, then number them after the sheet's last row.
  const sheetIds = new Set(orders.map((o) => text(o.id)));
  const early = (await db.prepare('SELECT id FROM orders ORDER BY created_at, row_no').all()).results.map((r) => r.id).filter((id) => !sheetIds.has(id));
  if (early.length) await db.batch(early.map((id, i) => db.prepare('UPDATE orders SET row_no = ? WHERE id = ?').bind(-1 - i, id)));
  const orderStmts = orders.map((o) => db.prepare(
    'INSERT OR IGNORE INTO orders (id, row_no, created_at, name, phone, address, date, items, total, note, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  ).bind(text(o.id), Number(o._row), toUnix(o.timestamp) ?? nowS(), text(o.name), text(o.phone), text(o.address), text(o.date), text(o.items), Number(o.total) || 0, text(o.note), text(o.status || 'รอยืนยัน')));
  for (let i = 0; i < orderStmts.length; i += 80) await db.batch(orderStmts.slice(i, i + 80));
  if (early.length) {
    const top = (await db.prepare('SELECT COALESCE(MAX(row_no), 1) AS m FROM orders').first()).m;
    await db.batch(early.map((id, i) => db.prepare('UPDATE orders SET row_no = ? WHERE id = ?').bind(top + 1 + i, id)));
  }
  report.orders = { sheet: orders.length, inD1: (await db.prepare('SELECT COUNT(*) n FROM orders').first()).n, keptFromBeforeImport: early.length };

  // stock (with cost)
  const stock = (await inventory(`?action=stockAdmin&key=${encodeURIComponent(env.INVENTORY_ADMIN_KEY)}`)).products || [];
  const stockStmts = stock.map((p) => db.prepare(
    `INSERT INTO stock_products (id, name, stock, threshold, cost, last_updated) VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT (id) DO NOTHING`,
  ).bind(text(p.id), text(p.name), Number(p.stock) || 0, Number(p.threshold) || 0, p.cost == null || p.cost === '' ? null : Number(p.cost), toUnix(p.lastUpdated)));
  if (stockStmts.length) await db.batch(stockStmts);
  report.stock = { sheet: stock.length, inD1: (await db.prepare('SELECT COUNT(*) n FROM stock_products').first()).n };

  // stock log (history) — only while empty so a re-run never duplicates it
  const logCount = (await db.prepare('SELECT COUNT(*) n FROM stock_log').first()).n;
  const log = (await inventory(`?action=log&key=${encodeURIComponent(env.INVENTORY_ADMIN_KEY)}`)).log || [];
  if (logCount === 0 && log.length) {
    const oldestFirst = [...log].reverse(); // the sheet API returns newest first
    const logStmts = oldestFirst.map((l) => db.prepare('INSERT INTO stock_log (ts, product_id, old_stock, new_stock, delta, note) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(toUnix(l.timestamp) ?? nowS(), text(l.id), Number(l.oldStock) || 0, Number(l.newStock) || 0, Number(l.delta) || 0, text(l.note)));
    for (let i = 0; i < logStmts.length; i += 80) await db.batch(logStmts.slice(i, i + 80));
  }
  report.stockLog = { sheet: log.length, inD1: (await db.prepare('SELECT COUNT(*) n FROM stock_log').first()).n };

  // expenses
  const expenses = (await sheet('?action=expenses')).expenses || [];
  const expStmts = expenses.map((e) => db.prepare(
    'INSERT OR IGNORE INTO expenses (id, created_at, type, category, description, amount, date, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  ).bind(text(e.id), toUnix(e.timestamp) ?? nowS(), text(e.type), text(e.category), text(e.description), Number(e.amount) || 0, text(e.date), text(e.note)));
  for (let i = 0; i < expStmts.length; i += 80) await db.batch(expStmts.slice(i, i + 80));
  report.expenses = { sheet: expenses.length, inD1: (await db.prepare('SELECT COUNT(*) n FROM expenses').first()).n };

  report.machineSales = await syncMachineSales(env);
  report.machineSalesInD1 = (await db.prepare('SELECT COUNT(*) n FROM machine_sales').first()).n;
  return report;
}
