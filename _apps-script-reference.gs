// Reference copy of the Larna order sheet's Google Apps Script — NOT deployed
// from here. This file exists only so the code is versioned somewhere; paste
// it into the Sheet's actual Extensions > Apps Script editor to deploy it.

const SHEET_NAME = "Orders";

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map(h => h.toString().toLowerCase());
  const orders = rows.slice(1).map((r, i) => {
    const o = { _row: i + 2 };
    headers.forEach((h, j) => o[h] = r[j]);
    if (!o.status) o.status = "รอยืนยัน";
    return o;
  });
  return ContentService
    .createTextOutput(JSON.stringify({ orders }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (data.action === "update_status") {
      // อ่านหัวคอลัมน์จริงแล้วหา column ของ "id" กับ "status" แบบไดนามิก แทนเลขคอลัมน์ตายตัว (9)
      // เดิม — กันปัญหาถ้ามีคนแทรก/สลับ/เพิ่มคอลัมน์ในชีตภายหลัง แล้วเลขคอลัมน์เพี้ยน
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
        .map(h => h.toString().trim().toLowerCase());
      const idCol = headers.indexOf("id") + 1;
      const statusCol = headers.indexOf("status") + 1;

      if (!statusCol) {
        return ContentService
          .createTextOutput(JSON.stringify({ ok: false, error: "Status column not found" }))
          .setMimeType(ContentService.MimeType.JSON);
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
        return ContentService
          .createTextOutput(JSON.stringify({ ok: false, error: "Order not found" }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      sheet.getRange(sheetRow, statusCol).setValue(data.status);
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // New order
    const items = (data.items || []).map(i => `${i.name} x${i.qty}`).join(", ");
    sheet.appendRow([
      new Date().toISOString(),
      data.name || "",
      data.phone || "",
      data.address || "",
      data.date || "-",
      items,
      data.total + " THB",
      data.note || "-",
      "รอยืนยัน",
      Utilities.getUuid(),
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── ONE-TIME HELPER ──────────────────────────────────────────────────────
// Run this once (manually, from the Apps Script editor's function dropdown)
// after adding the "id" column header, to backfill ids for existing rows
// that don't have one yet. Safe to run multiple times — skips rows that
// already have an id.
function backfillMissingIds() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
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
