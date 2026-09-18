// Larna Cake — ปฏิทินยอดขายรายวัน (จำนวนชิ้น) — Scriptable widget
//
// วิธีใช้:
//   1. เปิดแอป Scriptable (ฟรีจาก App Store) → New Script
//   2. ลบโค้ดเปล่าเริ่มต้นทิ้ง แล้ว paste ไฟล์นี้ทั้งหมดแทน
//   3. ตั้งชื่อสคริปต์ (มุมบนซ้าย) เช่น "Larna Cake Widget" แล้วกด Done
//   4. กด Run (▶) หนึ่งครั้งตรงๆ ในแอป — จะมีกล่องให้กรอก WIDGET_TOKEN (ค่าเดียวกับที่ตั้งไว้บน
//      Worker ด้วย `wrangler secret put WIDGET_TOKEN --name larnaapi`) เก็บไว้ใน Keychain ของเครื่อง
//      ให้ครั้งเดียว ไม่ต้องกรอกซ้ำอีก
//   5. ออกไปหน้าโฮมสกรีน → กดค้าง → (+) เพิ่ม widget → หา Scriptable → เลือกขนาด "Large"
//   6. แตะที่ widget ที่วางไว้ → Edit Widget → Script เลือก "Larna Cake Widget" ที่ตั้งชื่อไว้
//
// ใช้ endpoint /api/widget/daily-sales-calendar ตัวเดียวกับ Android widget (ดู cloudflare-worker.js
// และ android-widget/) ต่างกันแค่ตัวแสดงผล (Scriptable แทน RemoteViews) — WIDGET_TOKEN ไม่ฝังเป็น
// plaintext ในไฟล์นี้เพราะ repo นี้ push ขึ้น GitHub แบบ public เก็บผ่าน Keychain.set() แทน (เข้ารหัส
// โดย iOS เอง อยู่ในเครื่องเท่านั้น ไม่ sync ไปที่ไหน) เหมือนที่ Android widget เก็บผ่าน
// widget.secrets.properties ที่ไม่ commit ขึ้น git
//
// iOS ควบคุมความถี่การรีเฟรช widget เอง (ต่างจาก Android ที่กำหนด updatePeriodMillis ตายตัวได้)
// โค้ดด้านล่างแค่ "ขอ" ให้รีเฟรชทุก 30 นาทีผ่าน refreshAfterDate แต่ระบบอาจถี่/ห่างกว่านั้นตาม
// battery/usage — ถ้าอยากดูเลขสดๆ ทันที เปิดแอป Scriptable แล้วกด Run สคริปต์นี้ตรงๆ

const WORKER_BASE_URL = "https://larnaapi.yai-taweewoot.workers.dev";
const WIDGET_TOKEN_KEYCHAIN_KEY = "larnacake_widget_token";
const UNIT_LABEL = "ชิ้น";

// อ่าน WIDGET_TOKEN จาก Keychain ถ้ามีแล้ว — ถ้ายังไม่มีและกำลังรันตรงๆ ในแอป (ไม่ใช่จาก widget
// ซึ่งไม่มี UI ให้กรอก) จะเด้งกล่องถามครั้งเดียวแล้วจำไว้ให้ รันจาก widget เองตอนยังไม่เคยตั้งค่า
// จะคืน null แล้วไปเข้า fallback "โหลดข้อมูลไม่สำเร็จ" ของ buildWidget ที่บอกให้เปิดแอปมารันตรงๆ ก่อน
async function getWidgetToken() {
  if (Keychain.contains(WIDGET_TOKEN_KEYCHAIN_KEY)) {
    return Keychain.get(WIDGET_TOKEN_KEYCHAIN_KEY);
  }
  if (config.runsInWidget) return null;

  const alert = new Alert();
  alert.title = "ตั้งค่า Larna Cake Widget";
  alert.message = "กรอก WIDGET_TOKEN (ค่าเดียวกับที่ตั้งไว้บน Worker ด้วย wrangler secret put WIDGET_TOKEN --name larnaapi) — กรอกครั้งเดียว เครื่องจะจำให้เอง";
  alert.addSecureTextField("WIDGET_TOKEN");
  alert.addAction("บันทึก");
  alert.addCancelAction("ยกเลิก");
  const choice = await alert.presentAlert();
  if (choice === -1) return null;

  const token = alert.textFieldValue(0).trim();
  if (!token) return null;
  Keychain.set(WIDGET_TOKEN_KEYCHAIN_KEY, token);
  return token;
}

const COLORS = {
  bg: "#FDF6EE",
  textPrimary: "#2B1F1A",
  textMuted: "#B3A091",
  accent: "#D4A64A",
  heat0: "#F2E6D8",
  heat1: "#EAD1A0",
  heat2: "#E0B96E",
  heat3: "#D4A64A",
  heat4: "#B3822E",
  today: "#2B1810",
};

// ปรับตัวเลขนี้ถ้ากริดล้นขอบ/เล็กไปบน widget ขนาด Large ของเครื่องคุณ (ขนาด widget จริงต่างกันไปตาม
// รุ่น iPhone เล็กน้อย ผมกะประมาณไว้ให้พอดีกับรุ่นทั่วไป)
const CELL_SIZE = 34;
const CELL_SPACING = 2;

async function fetchCalendar(token) {
  try {
    const req = new Request(`${WORKER_BASE_URL}/api/widget/daily-sales-calendar`);
    req.method = "GET";
    req.headers = { "X-Widget-Token": token };
    req.timeoutInterval = 10;
    const data = await req.loadJSON();
    if (req.response.statusCode !== 200) return null;
    return data;
  } catch (e) {
    return null;
  }
}

function colorForCount(count, maxCount) {
  if (count <= 0) return new Color(COLORS.heat0);
  const ratio = maxCount > 0 ? count / maxCount : 0;
  if (ratio >= 0.75) return new Color(COLORS.heat4);
  if (ratio >= 0.5) return new Color(COLORS.heat3);
  if (ratio >= 0.25) return new Color(COLORS.heat2);
  return new Color(COLORS.heat1);
}

function addCell(row, text, bgColor, textColor, bold) {
  const cell = row.addStack();
  cell.size = new Size(CELL_SIZE, CELL_SIZE);
  cell.backgroundColor = bgColor;
  cell.cornerRadius = 6;
  cell.centerAlignContent();
  if (text) {
    const t = cell.addText(text);
    t.font = bold ? Font.boldSystemFont(12) : Font.systemFont(12);
    t.textColor = textColor;
    t.centerAlignText();
  }
}

function buildWidget(data) {
  const widget = new ListWidget();
  widget.backgroundColor = new Color(COLORS.bg);
  widget.setPadding(12, 12, 12, 12);

  if (!data) {
    const title = widget.addText("โหลดข้อมูลไม่สำเร็จ");
    title.font = Font.boldSystemFont(14);
    title.textColor = new Color(COLORS.textPrimary);
    widget.addSpacer(6);
    const retry = widget.addText("เปิดแอป Scriptable แล้วรันสคริปต์นี้เพื่อลองใหม่");
    retry.font = Font.systemFont(11);
    retry.textColor = new Color(COLORS.textMuted);
    widget.refreshAfterDate = new Date(Date.now() + 5 * 60 * 1000);
    return widget;
  }

  // แถวหัวข้อ: เดือน + จำนวนชิ้นรวมเดือนนี้
  const titleRow = widget.addStack();
  titleRow.layoutHorizontally();
  const monthText = titleRow.addText(data.monthLabel);
  monthText.font = Font.boldSystemFont(15);
  monthText.textColor = new Color(COLORS.textPrimary);
  titleRow.addSpacer();
  const totalText = titleRow.addText(`${data.monthCups} ${UNIT_LABEL}`);
  totalText.font = Font.boldSystemFont(14);
  totalText.textColor = new Color(COLORS.accent);

  widget.addSpacer(8);

  // กึ่งกลางกริดทั้งก้อนในแนวนอน ไม่ว่า widget จริงจะกว้างแค่ไหน
  const outerRow = widget.addStack();
  outerRow.layoutHorizontally();
  outerRow.addSpacer();
  const grid = outerRow.addStack();
  grid.layoutVertically();
  grid.spacing = CELL_SPACING;
  outerRow.addSpacer();

  // หัวตาราง อา-ส
  const weekdayLabels = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
  const headerRow = grid.addStack();
  headerRow.layoutHorizontally();
  headerRow.spacing = CELL_SPACING;
  weekdayLabels.forEach((label) => {
    const cell = headerRow.addStack();
    cell.size = new Size(CELL_SIZE, 14);
    cell.centerAlignContent();
    const t = cell.addText(label);
    t.font = Font.systemFont(9);
    t.textColor = new Color(COLORS.textMuted);
    t.centerAlignText();
  });

  const maxCount = Math.max(0, ...Object.values(data.cups));

  // ตาราง 6 แถว x 7 คอลัมน์ — ไม่โชว์เลขวันที่ในช่อง เอาแค่จำนวนชิ้น เหมือน Android widget
  for (let r = 0; r < 6; r++) {
    const row = grid.addStack();
    row.layoutHorizontally();
    row.spacing = CELL_SPACING;
    for (let c = 0; c < 7; c++) {
      const idx = r * 7 + c;
      const day = idx - data.firstWeekday + 1;
      if (day < 1 || day > data.daysInMonth) {
        addCell(row, "", new Color(COLORS.heat0), new Color(COLORS.textPrimary), false);
        continue;
      }
      const key = String(day).padStart(2, "0");
      const count = data.cups[key] || 0;
      const isToday = data.today === key;
      if (isToday) {
        addCell(row, count > 0 ? String(count) : "", new Color(COLORS.today), Color.white(), true);
      } else {
        addCell(row, count > 0 ? String(count) : "", colorForCount(count, maxCount), new Color(COLORS.textPrimary), false);
      }
    }
  }

  widget.addSpacer(6);
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const footerRow = widget.addStack();
  footerRow.layoutHorizontally();
  footerRow.addSpacer();
  const updated = footerRow.addText(`อัปเดต ${hh}:${mm} น.`);
  updated.font = Font.systemFont(9);
  updated.textColor = new Color(COLORS.textMuted);

  widget.refreshAfterDate = new Date(Date.now() + 30 * 60 * 1000);
  return widget;
}

const widgetToken = await getWidgetToken();
const data = widgetToken ? await fetchCalendar(widgetToken) : null;
const widget = buildWidget(data);

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentLarge();
}
Script.complete();
