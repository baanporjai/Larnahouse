// Reference copy of the Larna order sheet's Google Apps Script — NOT deployed
// from here. This file exists only so the code is versioned somewhere; paste
// it into the Sheet's actual Extensions > Apps Script editor to deploy it.
//
// รวม 5 แท็บของสเปรดชีตเดียวกัน (Orders, Stock, Log, Expenses, inbox) เข้าเป็น Apps Script
// โปรเจกต์เดียว deploy เป็น Web App เดียว — เดิมแยกเป็นหลายโปรเจกต์คนละไฟล์ (Orders,
// Stock, Expenses) ทำให้ตั้ง URL secret ผิดตัวกันได้ง่าย (คนละ Apps Script แต่ดูคล้ายกัน
// — Cloudflare's EXPENSES_SHEET_URL เคยลืมตั้งไปเลยจนกดบันทึกรายจ่ายไม่ได้เลย) พอรวมเป็น
// ตัวเดียวแล้ว SHEETS_URL / INVENTORY_API_URL ใช้ค่าเดียวกันได้ตรงๆ ไม่ต้องมี
// EXPENSES_SHEET_URL แยกอีกต่อไป — แยกแยะการทำงานด้วย action ที่ส่งมาแทน
// (update_status/new_order → Orders, adjustStock/setStock → Stock,
// stock/log/stockAdmin → อ่านข้อมูล Stock/Log, expense_add/expense_update/
// expense_delete → เขียน Expenses, expenses → อ่าน Expenses,
// machine-sales → อ่าน inbox (ยอดขายตู้จาก Ksher) แบบอ่านเท่านั้น ไม่มี action เขียน
// เพราะแท็บนี้ Ksher เป็นคนเติมข้อมูลเข้ามาเอง เราไม่ควรไปเขียนทับ)
//
// ต้องตั้ง Project Settings > Script Properties > ADMIN_KEY ด้วย (ค่าเดียวกับ
// INVENTORY_ADMIN_KEY ใน Cloudflare Worker) — ใช้ป้องกัน action adjustStock/setStock/
// log/stockAdmin เท่านั้น (update_status/new_order/expense_* ไม่ต้องมี key เหมือนเดิม
// เพราะ Worker เป็นคนเช็ค auth ให้ก่อนแล้วในชั้นนั้น — dashboard.html/accounting.html
// ไม่ได้ยิงตรงมาที่นี่โดยไม่ผ่าน Worker)

const SHEET_ID = "1xisQcDei86iD0a4E6_gtw41zaf1OQXMLjzlO3YREVtU";
const SHEET_NAME_ORDERS = "Orders";
const SHEET_NAME_STOCK = "Stock";
const SHEET_NAME_LOG = "Log";
const SHEET_NAME_EXPENSES = "Expenses";
// แท็บ "inbox" — รายการขายจริงจากตู้ (Ksher payment gateway ส่งเข้ามาเอง ไม่มีใครกรอกมือ)
// 1 แถว = 1 บรรทัดสินค้า ไม่ใช่ 1 บิล — บิลเดียวที่ซื้อ 2 อย่างจะมี 2 แถวที่ "Transaction ID"
// ซ้ำกัน (ดู machine-sales.html ที่นับจำนวนบิลจาก Transaction ID ไม่ใช่จำนวนแถว)
const SHEET_NAME_INBOX = "inbox";

function getSpreadsheet_() {
  // เปิดสเปรดชีตด้วย ID ตรงๆ แทน getActiveSpreadsheet() เพราะ getActiveSpreadsheet()
  // คืนค่า null ได้ถ้ารันจาก Apps Script editor โดยตรง (ไม่ได้มาจาก trigger ของสเปรดชีต
  // นั้นๆ) — เจอปัญหานี้ตอนรัน backfillMissingIds() แล้ว error "Cannot read properties
  // of null (reading 'getRange')" เพราะ sheet เป็น null
  return SpreadsheetApp.openById(SHEET_ID);
}
function getOrdersSheet_() { return getSpreadsheet_().getSheetByName(SHEET_NAME_ORDERS); }
function getStockSheet_() { return getSpreadsheet_().getSheetByName(SHEET_NAME_STOCK); }
function getLogSheet_() { return getSpreadsheet_().getSheetByName(SHEET_NAME_LOG); }
function getExpensesSheet_() { return getSpreadsheet_().getSheetByName(SHEET_NAME_EXPENSES); }
function getInboxSheet_() { return getSpreadsheet_().getSheetByName(SHEET_NAME_INBOX); }

function getAdminKey_() {
  return PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// แปลง Date object เป็น "D/M/YYYY H:MM:SS" ปีพ.ศ. (เช่น "10/7/2569 10:35:47") —
// ให้ตรงกับ format ที่ dashboard ฝั่ง parseTimestamp() รองรับอยู่แล้ว (แปลงปีพ.ศ.
// กลับเป็น ค.ศ. ให้) ใช้ตอน "อ่าน" ข้อมูลออกไปแสดงผลเท่านั้น — ตอน "เขียน" ลงชีต
// ให้เก็บเป็น Date object จริงๆ เสมอ (ดู doPost) เพราะถ้าเขียนเป็น string
// "10/7/2569 ..." ตรงๆ, Sheets จะพยายาม auto-parse เป็นวันที่ให้เอง แต่ไม่รู้จัก
// ปีพ.ศ. เลยตีความ "2569" เป็นปี ค.ศ. ตรงๆ กลายเป็นวันที่ผิดไปกว่า 500 ปี
function formatThaiTimestamp(date) {
  const pad = n => String(n).padStart(2, "0");
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear() + 543;
  return `${d}/${m}/${y} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// แปลง Date object เป็น "YYYY-MM-DD" ด้วย local date getters (ไม่ใช้ toISOString()
// เพราะจะเลื่อนวันผิดได้ถ้า timezone ของสคริปต์ไม่ใช่ UTC) — ใช้กับคอลัมน์ "date" ของ
// Expenses ซึ่ง Sheets อาจ auto-parse เป็น Date object เองถ้าค่าที่เขียนลงไปหน้าตาเหมือนวันที่
function formatISODate_(date) {
  const pad = n => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// แปลง Date object เป็น "YYYY-MM-DD HH:MM:SS" ปีค.ศ. — ใช้กับคอลัมน์ "Transaction Date" ของแท็บ
// inbox เท่านั้น จงใจไม่ใช้ formatThaiTimestamp() (ปีพ.ศ. + D/M) เพราะข้อมูลแท็บนี้มาจาก Ksher
// ไม่ใช่จากเว็บเรา บางแถวเป็น text "16/08/2026 23:02:34" บางแถว Sheets auto-parse เป็น Date object
// ให้แล้ว — ส่งออกเป็นรูปแบบที่ไม่กำกวมเรื่องลำดับ วัน/เดือน (ISO) ตัดปัญหาฝั่งเบราว์เซอร์เดา D/M
// สลับเป็น M/D เองเงียบๆ (บั๊กเดียวกับที่ parseTimestamp() ฝั่ง dashboard ต้องมาดักไว้)
function formatSheetDateTime_(date) {
  const pad = n => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// ── ROUTING ──────────────────────────────────────────────────────────────

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || null;

  if (action === 'stock') {
    return jsonOutput_(getStockData_());
  }
  if (action === 'log') {
    if (!e.parameter.key || e.parameter.key !== getAdminKey_()) return jsonOutput_({ error: 'unauthorized' });
    return jsonOutput_(getLogData_());
  }
  if (action === 'stockAdmin') {
    if (!e.parameter.key || e.parameter.key !== getAdminKey_()) return jsonOutput_({ error: 'unauthorized' });
    return jsonOutput_(getStockData_(true));
  }
  if (action === 'expenses') {
    // ไม่เช็ค key ตรงนี้ — เหมือน action อื่นๆ ที่ Worker เป็นคนกรอง auth (PIN token)
    // ให้แล้วก่อนยิงมาถึงนี่ (ดู handleAdminExpenses ใน cloudflare-worker.js)
    return jsonOutput_(getExpensesData_());
  }
  if (action === 'machine-sales') {
    // เหมือน expenses — Worker เช็ค PIN token ให้แล้ว (ดู handleAdminMachineSales)
    return jsonOutput_(getMachineSalesData_());
  }

  // ไม่มี action หรือ action ไม่รู้จัก — พฤติกรรมเดิม: คืนรายการออเดอร์ทั้งหมด
  // (SHEETS_URL ฝั่ง Worker ยิง GET เปล่าๆ ไม่มี query param เลย)
  return jsonOutput_(getOrdersData_());
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === "adjustStock" || data.action === "setStock") {
      if (data.key !== getAdminKey_()) return jsonOutput_({ error: 'unauthorized' });
      if (data.action === "setStock") {
        const cost = data.cost !== undefined && data.cost !== null && data.cost !== '' ? Number(data.cost) : undefined;
        return jsonOutput_(setStock_(data.id, Number(data.newStock), data.note || '', cost, data.name || ''));
      }
      return jsonOutput_(adjustStock_(data.id, Number(data.delta), data.note || ''));
    }

    if (data.action === "update_status") {
      return jsonOutput_(updateOrderStatus_(data));
    }

    if (data.action === "update_order") {
      return jsonOutput_(updateOrder_(data));
    }

    if (data.action === "expense_add" || data.action === "expense_update" || data.action === "expense_delete") {
      // ไม่เช็ค key ตรงนี้เหมือนกัน — Worker เช็ค PIN token ก่อนแล้ว (ดู
      // handleAdminExpenseWrite) เป็นระดับความเสี่ยงเดียวกับ update_status
      if (data.action === "expense_delete") return jsonOutput_(deleteExpense_(data));
      if (data.action === "expense_update") return jsonOutput_(updateExpense_(data));
      return jsonOutput_(addExpense_(data));
    }

    // ปฏิเสธ request ที่ไม่ได้หน้าตาเหมือนออเดอร์จริงๆ ก่อนสร้างแถวใหม่ — กันเหตุการณ์ที่ request
    // ซึ่งตั้งใจส่งไปทำ action อื่น (เช่น พิมพ์ชื่อ action ผิด) ดันตกไปสร้างเป็น "ออเดอร์ใหม่" เงียบๆ
    // ด้วยฟิลด์เพี้ยนๆ (เคยเกิดจริงตอนยังแยกเป็น 2 Apps Script คนละไฟล์ — ดู comment บนสุดของไฟล์)
    if (data.action && data.action !== "new_order") {
      return jsonOutput_({ ok: false, error: "Unknown action: " + data.action });
    }

    return jsonOutput_(createOrder_(data));
  } catch (err) {
    return jsonOutput_({ ok: false, error: err.message });
  }
}

// ── ORDERS ───────────────────────────────────────────────────────────────

function getOrdersData_() {
  const sheet = getOrdersSheet_();
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map(h => h.toString().trim().toLowerCase());
  const orders = rows.slice(1).map((r, i) => {
    const o = { _row: i + 2 };
    headers.forEach((h, j) => o[h] = r[j]);
    if (!o.status) o.status = "รอยืนยัน";
    // ถ้า Sheets เก็บ timestamp เป็น Date object จริง (ปกติของคอลัมน์ date/time) ให้
    // แปลงเป็น string แบบไทยตรงนี้ก่อนส่งออกไป — ถ้าเป็น string อยู่แล้ว (แถวเก่าที่
    // เคยพิมพ์มือ) ปล่อยผ่านตามเดิม
    if (o.timestamp instanceof Date) o.timestamp = formatThaiTimestamp(o.timestamp);
    return o;
  });
  return { orders };
}

function updateOrderStatus_(data) {
  const sheet = getOrdersSheet_();
  // อ่านหัวคอลัมน์จริงแล้วหา column ของ "id" กับ "status" แบบไดนามิก แทนเลขคอลัมน์ตายตัว (9)
  // เดิม — กันปัญหาถ้ามีคนแทรก/สลับ/เพิ่มคอลัมน์ในชีตภายหลัง แล้วเลขคอลัมน์เพี้ยน
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(h => h.toString().trim().toLowerCase());
  const idCol = headers.indexOf("id") + 1;
  const statusCol = headers.indexOf("status") + 1;

  if (!statusCol) {
    return { ok: false, error: "Status column not found" };
  }

  // หา row ด้วย "id" ก่อน (แม่นยำแม้แถวถูกแทรก/เรียงลำดับใหม่) — ถ้าหาไม่เจอ
  // (เช่น แถวเก่าที่ยังไม่มี id) ค่อย fallback ไปใช้เลข row ที่ส่งมาแทน
  let sheetRow = null;
  if (idCol && data.id) {
    const lastRow = sheet.getLastRow();
    if (lastRow >= 2) {
      const ids = sheet.getRange(2, idCol, lastRow - 1, 1).getValues();
      const idx = ids.findIndex(r => String(r[0]) === String(data.id));
      if (idx !== -1) sheetRow = idx + 2;
    }
  }
  if (!sheetRow && data.row) sheetRow = Number(data.row);

  if (!sheetRow) {
    return { ok: false, error: "Order not found" };
  }

  sheet.getRange(sheetRow, statusCol).setValue(data.status);
  return { ok: true };
}

// แก้ไขรายละเอียดออเดอร์ (จากปุ่มแก้ไขในหน้า dashboard.html) — หาแถวด้วย id ก่อน (เหมือน
// updateExpense_ ด้านล่าง) ถ้าหาไม่เจอ (แถวเก่าที่ยังไม่มี id) ค่อย fallback ไปใช้เลข row ที่
// ส่งมาแทน เหมือน updateOrderStatus_ ด้านบน — ไม่งั้นปุ่มแก้ไขจะใช้กับแถวเก่าไม่ได้เลย
function updateOrder_(data) {
  const sheet = getOrdersSheet_();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(h => h.toString().trim().toLowerCase());
  const idCol = headers.indexOf("id") + 1;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { ok: false, error: "No data rows" };

  const editable = ["name", "phone", "address", "date", "items", "total", "note"];

  let sheetRow = null;
  if (idCol && data.id) {
    const ids = sheet.getRange(2, idCol, lastRow - 1, 1).getValues();
    const idx = ids.findIndex(r => String(r[0]) === String(data.id));
    if (idx !== -1) sheetRow = idx + 2;
  }
  if (!sheetRow && data.row) sheetRow = Number(data.row);

  if (!sheetRow) return { ok: false, error: "Order not found" };

  editable.forEach(field => {
    const col = headers.indexOf(field) + 1;
    if (col && (field in data)) sheet.getRange(sheetRow, col).setValue(data[field]);
  });
  return { ok: true };
}

function createOrder_(data) {
  const sheet = getOrdersSheet_();
  // New order — data.id ใช้ตอนมาจาก LINE bot เท่านั้น (ต้องรู้ id ทันทีสำหรับปุ่มยกเลิก)
  // order.html ปกติไม่ส่ง id มาเลย เลย generate ให้เองเหมือนเดิม (backward compatible)
  const items = (data.items || []).map(i => `${i.name} x${i.qty}`).join(", ");
  sheet.appendRow([
    new Date(),
    data.name || "",
    data.phone || "",
    data.address || "",
    data.date || "-",
    items,
    data.total,
    data.note || "-",
    "รอยืนยัน",
    data.id || Utilities.getUuid(),
  ]);
  return { ok: true };
}

// ── STOCK / LOG ──────────────────────────────────────────────────────────
// "cost" (ต้นทุนต่อหน่วย) ตั้งใจไม่ใส่ในผล action=stock (สาธารณะ) เพราะเป็นข้อมูล
// อ่อนไหวด้านมาร์จิ้น — อ่านได้เฉพาะผ่าน action=stockAdmin ที่ต้องมี key เท่านั้น

var STOCK_NEW_PRODUCT_DEFAULT_THRESHOLD = 5; // เหมือน LOW_STOCK_DEFAULT_THRESHOLD ใน stock.html

function getStockData_(includeCost) {
  const sheet = getStockSheet_();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIdx = headers.indexOf('id');
  const nameIdx = headers.indexOf('name');
  const stockIdx = headers.indexOf('stock');
  const thresholdIdx = headers.indexOf('threshold');
  const updatedIdx = headers.indexOf('lastUpdated');
  const costIdx = headers.indexOf('cost');
  const result = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row[idIdx]) continue;
    const item = {
      id: row[idIdx],
      name: row[nameIdx],
      stock: Number(row[stockIdx]) || 0,
      threshold: Number(row[thresholdIdx]) || 0,
      lastUpdated: row[updatedIdx] ? new Date(row[updatedIdx]).toISOString() : ''
    };
    if (includeCost) {
      item.cost = costIdx > -1 ? (Number(row[costIdx]) || 0) : 0;
    }
    result.push(item);
  }
  return { products: result };
}

function setStock_(id, newStock, note, cost, name) {
  if (isNaN(newStock)) {
    return { error: 'invalid stock value' };
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getStockSheet_();
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const idIdx = headers.indexOf('id');
    const nameIdx = headers.indexOf('name');
    const stockIdx = headers.indexOf('stock');
    const thresholdIdx = headers.indexOf('threshold');
    const updatedIdx = headers.indexOf('lastUpdated');
    const costIdx = headers.indexOf('cost');
    let rowIndex = -1;
    let oldStock = null;
    for (let i = 1; i < values.length; i++) {
      if (values[i][idIdx] === id) {
        rowIndex = i + 1;
        oldStock = Number(values[i][stockIdx]) || 0;
        break;
      }
    }
    const now = new Date();
    if (rowIndex === -1) {
      // สินค้าใหม่ที่ยังไม่เคยมีแถวในชีต Stock — สร้างแถวใหม่ให้เลยแทนที่จะ error ทิ้ง
      oldStock = 0;
      const newRow = [];
      newRow[idIdx] = id;
      newRow[nameIdx] = name || id;
      newRow[stockIdx] = newStock;
      newRow[thresholdIdx] = STOCK_NEW_PRODUCT_DEFAULT_THRESHOLD;
      newRow[updatedIdx] = now;
      if (costIdx > -1) newRow[costIdx] = (cost !== undefined && !isNaN(cost)) ? cost : '';
      sheet.appendRow(newRow);
      appendLog_(id, oldStock, newStock, note, now);
      return { success: true, id: id, oldStock: oldStock, newStock: newStock, created: true };
    }
    sheet.getRange(rowIndex, stockIdx + 1).setValue(newStock);
    sheet.getRange(rowIndex, updatedIdx + 1).setValue(now);
    if (name && nameIdx > -1) sheet.getRange(rowIndex, nameIdx + 1).setValue(name);
    if (cost !== undefined && !isNaN(cost) && costIdx > -1) {
      sheet.getRange(rowIndex, costIdx + 1).setValue(cost);
    }
    appendLog_(id, oldStock, newStock, note, now);
    return { success: true, id: id, oldStock: oldStock, newStock: newStock };
  } finally {
    lock.releaseLock();
  }
}

// เหมือน setStock_ แต่รับค่าเปลี่ยนแปลง (delta) แทนค่าตัวเลขสุดท้าย ใช้ตอนตัดสต็อกจากออเดอร์
// เพื่อกันปัญหา race condition เวลามีออเดอร์เข้าพร้อมกันหลายรายการ (ต้อง lock อ่าน-เขียนเป็นก้อนเดียว)
function adjustStock_(id, delta, note) {
  if (isNaN(delta)) {
    return { error: 'invalid delta value' };
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getStockSheet_();
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const idIdx = headers.indexOf('id');
    const stockIdx = headers.indexOf('stock');
    const updatedIdx = headers.indexOf('lastUpdated');
    let rowIndex = -1;
    let oldStock = null;
    for (let i = 1; i < values.length; i++) {
      if (values[i][idIdx] === id) {
        rowIndex = i + 1;
        oldStock = Number(values[i][stockIdx]) || 0;
        break;
      }
    }
    if (rowIndex === -1) {
      return { error: 'product not found' };
    }
    const newStock = oldStock + delta;
    const now = new Date();
    sheet.getRange(rowIndex, stockIdx + 1).setValue(newStock);
    sheet.getRange(rowIndex, updatedIdx + 1).setValue(now);
    appendLog_(id, oldStock, newStock, note, now);
    return { success: true, id: id, oldStock: oldStock, newStock: newStock };
  } finally {
    lock.releaseLock();
  }
}

function appendLog_(id, oldStock, newStock, note, timestamp) {
  const sheet = getLogSheet_();
  sheet.appendRow([timestamp, id, oldStock, newStock, newStock - oldStock, note]);
}

function getLogData_() {
  const sheet = getLogSheet_();
  const values = sheet.getDataRange().getValues();
  const result = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row[0]) continue;
    result.push({
      timestamp: row[0] instanceof Date ? row[0].toISOString() : row[0],
      id: row[1],
      oldStock: row[2],
      newStock: row[3],
      delta: row[4],
      note: row[5]
    });
  }
  result.reverse();
  return { log: result };
}

// ── EXPENSES ─────────────────────────────────────────────────────────────
// ใช้โดย accounting.html (ผ่าน Worker's /api/admin/expenses proxy) — type เป็น
// "cogs" (ต้นทุนขาย) หรือ "opex" (ค่าใช้จ่ายดำเนินงาน), id generate ฝั่ง client
// (accounting.html's generateId()) ส่งมาเสมอ เพื่อให้แก้ไข/ลบได้ทันทีในเซสชันเดียวกัน
// โดยไม่ต้องรอ round-trip กลับมาก่อน

function getExpensesData_() {
  const sheet = getExpensesSheet_();
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map(h => h.toString().trim().toLowerCase());
  const expenses = rows.slice(1).map(r => {
    const e = {};
    headers.forEach((h, j) => e[h] = r[j]);
    if (e.timestamp instanceof Date) e.timestamp = formatThaiTimestamp(e.timestamp);
    if (e.date instanceof Date) e.date = formatISODate_(e.date);
    return e;
  });
  return { expenses };
}

// อ่านยอดขายตู้จากแท็บ inbox (Ksher เติมข้อมูลเข้ามาเอง) → machine-sales.html
//
// คืน key เป็นชื่อคอลัมน์ตัวพิมพ์เล็กแบบเดียวกับ getExpensesData_ แต่ตัดช่องว่างในชื่อออกด้วย
// ("Transaction Date" → "transactiondate") เพราะชื่อคอลัมน์ของ Ksher มีเว้นวรรคเกือบทุกตัว
// การอ้าง r["transaction date"] ฝั่งเบราว์เซอร์อ่านยากและพลาดง่ายกว่า r.transactiondate
//
// ไม่กรอง status ที่นี่ — ส่งทั้ง paid/pending ออกไปให้หน้าเว็บเป็นคนตัดสินใจ (หน้าเว็บนับยอดขาย
// จากแถว paid เท่านั้น แต่ก็ยังอยากรู้จำนวนบิลที่ค้าง pending เพื่อดูว่าตู้มีปัญหาจ่ายเงินไหม)
function getMachineSalesData_() {
  const sheet = getInboxSheet_();
  if (!sheet) return { sales: [], error: 'sheet "' + SHEET_NAME_INBOX + '" not found' };

  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return { sales: [] };

  const headers = rows[0].map(h => h.toString().trim().toLowerCase().replace(/\s+/g, ''));
  const sales = rows.slice(1).map(r => {
    const s = {};
    headers.forEach((h, j) => s[h] = r[j]);
    if (s.transactiondate instanceof Date) s.transactiondate = formatSheetDateTime_(s.transactiondate);
    return s;
  }).filter(s => s.transactionid || s.transactiondate); // ข้ามแถวว่างท้ายชีต

  return { sales };
}

function addExpense_(data) {
  const sheet = getExpensesSheet_();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(h => h.toString().trim().toLowerCase());
  const values = {
    timestamp: new Date(),
    id: data.id || Utilities.getUuid(),
    type: data.type || "opex",
    category: data.category || "",
    description: data.description || "",
    amount: data.amount || 0,
    date: data.date || "",
    note: data.note || "",
  };
  const row = headers.map(h => (h in values) ? values[h] : "");
  sheet.appendRow(row);
  return { success: true, id: values.id };
}

function updateExpense_(data) {
  const sheet = getExpensesSheet_();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(h => h.toString().trim().toLowerCase());
  const idCol = headers.indexOf("id") + 1;
  if (!idCol) return { success: false, error: "id column not found" };

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { success: false, error: "No data rows" };

  const editable = ["type", "category", "description", "amount", "date", "note"];
  const ids = sheet.getRange(2, idCol, lastRow - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(data.id)) {
      editable.forEach(field => {
        const col = headers.indexOf(field) + 1;
        if (col && (field in data)) sheet.getRange(i + 2, col).setValue(data[field]);
      });
      return { success: true };
    }
  }
  return { success: false, error: "Expense id not found" };
}

function deleteExpense_(data) {
  const sheet = getExpensesSheet_();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(h => h.toString().trim().toLowerCase());
  const idCol = headers.indexOf("id") + 1;
  if (!idCol) return { success: false, error: "id column not found" };

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { success: false, error: "No data rows" };

  const ids = sheet.getRange(2, idCol, lastRow - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(data.id)) {
      sheet.deleteRow(i + 2);
      return { success: true };
    }
  }
  return { success: false, error: "Expense id not found" };
}

// ── ONE-TIME HELPER ──────────────────────────────────────────────────────
// Run this once (manually, from the Apps Script editor's function dropdown)
// after adding the "id" column header, to backfill ids for existing rows
// that don't have one yet. Safe to run multiple times — skips rows that
// already have an id.
function backfillMissingIds() {
  const sheet = getOrdersSheet_();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(h => h.toString().trim().toLowerCase());
  const idCol = headers.indexOf("id") + 1;
  if (!idCol) throw new Error('Add an "id" header to the sheet first, then run this again.');
  const lastRow = sheet.getLastRow();
  for (let row = 2; row <= lastRow; row++) {
    const cell = sheet.getRange(row, idCol);
    if (!cell.getValue()) cell.setValue(Utilities.getUuid());
  }
}
