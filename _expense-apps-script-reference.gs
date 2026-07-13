// Reference copy of the Larna "Expenses" sheet's Google Apps Script — NOT deployed
// from here. This is a brand-new, STANDALONE Apps Script project (script.google.com
// → New project), separate from the Orders sheet's script (_apps-script-reference.gs).
// Kept standalone on purpose so this file's doPost/doGet can never collide with or
// accidentally break the live Orders script, which isn't versioned anywhere in this
// repo. Deploy: paste this whole file in, set SHEET_ID below, Deploy → New deployment
// → Web app → Execute as Me, Who has access Anyone → copy the URL into the Worker's
// EXPENSES_SHEET_URL secret.

const SHEET_ID = "1xisQcDei86iD0a4E6_gtw41zaf1OQXMLjzlO3YREVtU"; // สเปรดชีตเดียวกับ Orders
const SHEET_NAME = "Expenses"; // คนละแท็บกับ Orders — ต้องมีแท็บนี้อยู่แล้วก่อน deploy

// เปิดสเปรดชีตด้วย ID ตรงๆ แทน getActiveSpreadsheet() (ดูเหตุผลใน _apps-script-reference.gs)
function getSheet() {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
}

// แปลง Date object เป็น "D/M/YYYY H:MM:SS" ปีพ.ศ. — ให้ตรงกับ parseTimestamp() ฝั่ง
// accounting.html/dashboard.html ที่ใช้อยู่แล้ว (ดู formatThaiTimestamp ใน
// _apps-script-reference.gs — ฟังก์ชันเดียวกัน คัดลอกมาเพราะโปรเจกต์ Apps Script
// แยกกัน ไม่มี shared module ให้ import ข้ามโปรเจกต์)
function formatThaiTimestamp(date) {
  const pad = n => String(n).padStart(2, "0");
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear() + 543;
  return `${d}/${m}/${y} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// แปลง Date object เป็น "YYYY-MM-DD" ด้วย local date getters (ไม่ใช้ toISOString()
// เพราะจะเลื่อนวันผิดได้ถ้า timezone ของสคริปต์ไม่ใช่ UTC) — ใช้กับคอลัมน์ "date"
// ซึ่ง Sheets อาจ auto-parse เป็น Date object เองถ้าค่าที่เขียนลงไปหน้าตาเหมือนวันที่
function formatISODate(date) {
  const pad = n => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function doGet() {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map(h => h.toString().trim().toLowerCase());
  const expenses = rows.slice(1).map(r => {
    const e = {};
    headers.forEach((h, j) => e[h] = r[j]);
    if (e.timestamp instanceof Date) e.timestamp = formatThaiTimestamp(e.timestamp);
    if (e.date instanceof Date) e.date = formatISODate(e.date);
    return e;
  });
  return ContentService
    .createTextOutput(JSON.stringify({ expenses }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      .map(h => h.toString().trim().toLowerCase());

    if (data.action === "update") return updateExpense(sheet, headers, data);
    if (data.action === "delete") return deleteExpense(sheet, headers, data);

    // action ไม่ระบุ หรือ "add" → เพิ่มแถวใหม่
    const values = {
      timestamp: new Date(),
      id: data.id || Utilities.getUuid(), // ปกติ client จะ generate id มาเองแล้ว (ต้องใช้แก้ไข/ลบทันทีในเซสชันเดียวกัน) — เผื่อไว้กรณีไม่มีมา
      type: data.type || "opex", // "cogs" = ต้นทุนขาย, "opex" = ค่าใช้จ่ายดำเนินงาน
      category: data.category || "",
      description: data.description || "",
      amount: data.amount || 0,
      date: data.date || "", // วันที่เกิดรายการจริง YYYY-MM-DD ใช้จัดกลุ่มรายเดือน
      note: data.note || "",
    };
    const row = headers.map(h => (h in values) ? values[h] : "");
    sheet.appendRow(row);

    return jsonOut({ success: true, id: values.id });
  } catch (err) {
    return jsonOut({ success: false, error: err.message });
  }
}

function updateExpense(sheet, headers, data) {
  const colId = headers.indexOf("id") + 1;
  if (!colId) return jsonOut({ success: false, error: "id column not found" });

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return jsonOut({ success: false, error: "No data rows" });

  const editable = ["type", "category", "description", "amount", "date", "note"];
  const ids = sheet.getRange(2, colId, lastRow - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(data.id)) {
      editable.forEach(field => {
        const col = headers.indexOf(field) + 1;
        if (col && (field in data)) sheet.getRange(i + 2, col).setValue(data[field]);
      });
      return jsonOut({ success: true });
    }
  }
  return jsonOut({ success: false, error: "Expense id not found" });
}

function deleteExpense(sheet, headers, data) {
  const colId = headers.indexOf("id") + 1;
  if (!colId) return jsonOut({ success: false, error: "id column not found" });

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return jsonOut({ success: false, error: "No data rows" });

  const ids = sheet.getRange(2, colId, lastRow - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(data.id)) {
      sheet.deleteRow(i + 2);
      return jsonOut({ success: true });
    }
  }
  return jsonOut({ success: false, error: "Expense id not found" });
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
