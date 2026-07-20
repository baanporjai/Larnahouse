/**
 * Larna Cake — Inventory backend (Google Apps Script Web App)
 * Reads/writes stock counts from a Google Sheet with two tabs: "Stock" and "Log".
 *
 * Stock sheet headers (row 1): id | name | stock | threshold | lastUpdated
 * Log sheet headers (row 1):   timestamp | id | oldStock | newStock | delta | note
 *
 * Deploy: Extensions > Apps Script > paste this file > Deploy > New deployment
 *   Type: Web app · Execute as: Me · Who has access: Anyone
 * Then set Project Settings > Script Properties > ADMIN_KEY to a secret string.
 *
 * Updating an existing deployment: after editing this file in the Apps Script
 * editor, changes only go live once you create a new version — Deploy > Manage
 * deployments > pick the existing deployment > Edit (pencil) > Version: New
 * version > Deploy. Saving the file alone does NOT update the live /exec URL.
 */

var SHEET_STOCK = 'Stock';
var SHEET_LOG = 'Log';

function getAdminKey_() {
  return PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var action = (e.parameter && e.parameter.action) || 'stock';
  if (action === 'stock') {
    return jsonResponse_(getStockData_());
  }
  if (action === 'log') {
    if (e.parameter.key !== getAdminKey_()) {
      return jsonResponse_({ error: 'unauthorized' });
    }
    return jsonResponse_(getLogData_());
  }
  return jsonResponse_({ error: 'unknown action' });
}

function doPost(e) {
  var payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse_({ error: 'invalid json' });
  }
  if (payload.key !== getAdminKey_()) {
    return jsonResponse_({ error: 'unauthorized' });
  }
  if (payload.action === 'setStock') {
    return jsonResponse_(setStock_(payload.id, Number(payload.newStock), payload.note || ''));
  }
  if (payload.action === 'adjustStock') {
    return jsonResponse_(adjustStock_(payload.id, Number(payload.delta), payload.note || ''));
  }
  return jsonResponse_({ error: 'unknown action' });
}

function getStockSheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_STOCK);
}
function getLogSheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_LOG);
}

function getStockData_() {
  var sheet = getStockSheet_();
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var idIdx = headers.indexOf('id');
  var nameIdx = headers.indexOf('name');
  var stockIdx = headers.indexOf('stock');
  var thresholdIdx = headers.indexOf('threshold');
  var updatedIdx = headers.indexOf('lastUpdated');
  var result = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (!row[idIdx]) continue;
    result.push({
      id: row[idIdx],
      name: row[nameIdx],
      stock: Number(row[stockIdx]) || 0,
      threshold: Number(row[thresholdIdx]) || 0,
      lastUpdated: row[updatedIdx] ? new Date(row[updatedIdx]).toISOString() : ''
    });
  }
  return { products: result };
}

function setStock_(id, newStock, note) {
  if (isNaN(newStock)) {
    return { error: 'invalid stock value' };
  }
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getStockSheet_();
    var values = sheet.getDataRange().getValues();
    var headers = values[0];
    var idIdx = headers.indexOf('id');
    var stockIdx = headers.indexOf('stock');
    var updatedIdx = headers.indexOf('lastUpdated');
    var rowIndex = -1;
    var oldStock = null;
    for (var i = 1; i < values.length; i++) {
      if (values[i][idIdx] === id) {
        rowIndex = i + 1;
        oldStock = Number(values[i][stockIdx]) || 0;
        break;
      }
    }
    if (rowIndex === -1) {
      return { error: 'product not found' };
    }
    var now = new Date();
    sheet.getRange(rowIndex, stockIdx + 1).setValue(newStock);
    sheet.getRange(rowIndex, updatedIdx + 1).setValue(now);
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
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getStockSheet_();
    var values = sheet.getDataRange().getValues();
    var headers = values[0];
    var idIdx = headers.indexOf('id');
    var stockIdx = headers.indexOf('stock');
    var updatedIdx = headers.indexOf('lastUpdated');
    var rowIndex = -1;
    var oldStock = null;
    for (var i = 1; i < values.length; i++) {
      if (values[i][idIdx] === id) {
        rowIndex = i + 1;
        oldStock = Number(values[i][stockIdx]) || 0;
        break;
      }
    }
    if (rowIndex === -1) {
      return { error: 'product not found' };
    }
    var newStock = oldStock + delta;
    var now = new Date();
    sheet.getRange(rowIndex, stockIdx + 1).setValue(newStock);
    sheet.getRange(rowIndex, updatedIdx + 1).setValue(now);
    appendLog_(id, oldStock, newStock, note, now);
    return { success: true, id: id, oldStock: oldStock, newStock: newStock };
  } finally {
    lock.releaseLock();
  }
}

function appendLog_(id, oldStock, newStock, note, timestamp) {
  var sheet = getLogSheet_();
  sheet.appendRow([timestamp, id, oldStock, newStock, newStock - oldStock, note]);
}

function getLogData_() {
  var sheet = getLogSheet_();
  var values = sheet.getDataRange().getValues();
  var result = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
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
