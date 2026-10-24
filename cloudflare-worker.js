/**
 * Frozen Larna Cake — Order Backend (Cloudflare Worker)
 *
 * Receives order submissions from order.html and pushes a notification
 * to the shop's LINE via the LINE Messaging API. Also serves the admin
 * dashboard (dashboard.html): PIN check and Google Sheet access happen
 * here so neither the PIN nor the Sheet's Apps Script URL are exposed
 * in client-side code.
 *
 * Required secrets (set in Cloudflare dashboard → Worker → Settings → Variables):
 *   LINE_CHANNEL_ACCESS_TOKEN  — long-lived channel access token from a
 *                                LINE Messaging API channel
 *   LINE_TARGET_ID             — userId or groupId that should receive
 *                                the order notification
 *   SHEETS_URL                 — Apps Script Web App URL, see _apps-script-reference.gs.
 *                                One Apps Script project serves Orders, Stock, Log,
 *                                Expenses (accounting.html), and inbox
 *                                (machine-sales.html — ยอดขายตู้จาก Ksher) tabs, routed
 *                                by an `action` parameter — SHEETS_URL and
 *                                INVENTORY_API_URL should both be set to this same URL.
 *   ADMIN_PIN                  — PIN for dashboard.html
 *   SESSION_SECRET             — long random string, signs admin session tokens
 *   INVENTORY_API_URL          — same Apps Script Web App URL as SHEETS_URL — used
 *                                to deduct stock when an order comes in, to proxy
 *                                stock.html's log/edit calls (below) so the ADMIN_KEY
 *                                never ships in client-side code, and to serve the
 *                                public GET /api/stock (cached — see SHEET_READ_CACHE_TTL_SECONDS)
 *                                that index.html/product.html/order.html read via js/inventory.js
 *   INVENTORY_ADMIN_KEY        — ADMIN_KEY Script Property set on that same
 *                                Apps Script project
 *   LINE_CHANNEL_SECRET        — Channel secret (คนละค่ากับ LINE_CHANNEL_ACCESS_TOKEN)
 *                                จาก channel เดิม (Basic settings tab) — ใช้ตรวจลายเซ็น
 *                                webhook ที่ยิงเข้ามา กันคนปลอม request มาสั่งงานบอท
 *   GEMINI_API_KEY             — API key จาก aistudio.google.com/apikey — ใช้ให้ Gemini
 *                                ช่วยอ่าน/แปลงข้อความแอดมินในกลุ่มเป็นออเดอร์ที่มีโครงสร้าง
 *   WIDGET_TOKEN               — ค่าสุ่มยาวๆ (ตั้งเองได้ ไม่ต้องเป็นรูปแบบพิเศษ) ให้แอป Android
 *                                widget ปฏิทินยอดขายตู้ส่งมาแนบ header X-Widget-Token ยืนยันตัวก่อน
 *                                อ่าน /api/widget/daily-sales-calendar — คนละค่ากับ ADMIN_PIN เพราะ
 *                                widget รีเฟรชพื้นหลังเอง ไม่มีคนกดล็อกอินซ้ำทุก 12 ชม. แบบหน้าแอดมิน
 *                                ตั้งด้วย `wrangler secret put WIDGET_TOKEN --name larnaapi`
 *
 * Data lives in Cloudflare D1 (binding DB, schema in migrations/, code in larna-data.js). The old Google Sheet is
 * only read for (1) kiosk sales that Ksher still writes into its "inbox" tab — copied into D1 every 5 minutes —
 * and (2) importFromSheet() in larna-data.js, the one-off import that was run on 23/10/2569 (kept for the tests).
 *
 * See LINE-ORDER-BACKEND-SETUP.md for full setup steps.
 */

import * as larna from './larna-data.js';

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 ชั่วโมง
const PUBLIC_STOCK_CACHE_TTL_SECONDS = 15;

// ── AI order assistant (กลุ่มไลน์แอดมิน) ──
// แอดมินพิมพ์ออเดอร์แบบข้อความอิสระในกลุ่มนี้ บอทจะให้ Gemini แปลงเป็นออเดอร์แล้วบันทึกลงชีตทันที
// ใส่ group ID ของกลุ่มแอดมินที่นี่ (ไม่ใช่ข้อมูลลับ ไม่ต้องเก็บเป็น secret) — รองรับได้หลายกลุ่ม
const ADMIN_GROUP_IDS = [
  'C61a4161fd7df0c9dc420fd16f7083bcb', // Larnacake_admin
];

// Product catalog แบบย่อ (id/ชื่อไทย/ราคา) — คัดมาจาก js/products.js ด้วยมือ สำหรับให้ Gemini
// จับคู่ชื่อสินค้าที่แอดมินพิมพ์ ไม่ได้ import ตรงจาก products.js เพราะไฟล์นั้นเป็นของฝั่งเว็บ (browser)
// **ถ้า products.js เปลี่ยนราคา/เพิ่มสินค้าใหม่ ต้องมาอัปเดต list นี้ด้วยมือ**
const PRODUCT_CATALOG = [
  { id: 'mini-larna', name: 'มินิ ลาร์นา เค้ก (ออริจินัล)', price: 60 },
  { id: 'mini-white', name: 'มินิ ไวท์ ลาร์นา เค้ก', price: 60 },
  { id: 'mini-matcha', name: 'มินิ มัทฉะ ลาร์นา เค้ก', price: 60 },
  { id: 'mini-thai-tea', name: 'มินิ ชาไทย ลาร์นา เค้ก', price: 60 },
  { id: 'mini-espresso', name: 'มินิ เอสเพรสโซ่ ลาร์นา เค้ก', price: 60 },
  { id: 'mini-mango', name: 'มินิ มะม่วง ลาร์นา เค้ก', price: 80 },
  { id: 'mini-dubai-pistachio', name: 'มินิ ดูไบ ลาร์นา เค้ก พิสตาชิโอ', price: 80 },
  { id: 'mini-crispy-larna', name: 'มินิ ครันชี่ ลาร์นา เค้ก', price: 80 },
  { id: 'marshmallow-cookie', name: 'คุกกี้มาร์ชเมลโล่ ลาร์นา', price: 60 },
  { id: 'marshmallow-cookie-nibs', name: 'คุกกี้มาร์ชเมลโล่คาเคานิบส์ ลาร์นา', price: 60 },
  { id: 'marshmallow-cookie-almond', name: 'คุกกี้มาร์ชเมลโล่อัลมอนด์ ลาร์นา', price: 60 },
  { id: 'dubai-pistachio-cookie', name: 'คุกกี้ดูไบ ลาร์นา ไส้พิสตาชิโอ', price: 80 },
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  // every 5 minutes: copy new kiosk sales from the Google Sheet into D1
  async scheduled(event, env, ctx) {
    if (!env.DB) return;
    ctx.waitUntil(larna.syncMachineSales(env).then((r) => console.log('machine sales sync', JSON.stringify(r))));
  },

  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method === 'POST' && url.pathname === '/api/order') {
      return handleOrder(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/login') {
      return handleAdminLogin(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/api/admin/orders') {
      return handleAdminOrders(request, env, ctx);
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/update-status') {
      return handleAdminUpdateStatus(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/update-order') {
      return handleAdminUpdateOrder(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/api/admin/expenses') {
      return handleAdminExpenses(request, env, ctx);
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/expenses') {
      return handleAdminExpenseWrite(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/api/admin/machine-sales') {
      return handleAdminMachineSales(request, env, ctx);
    }

    // อัปโหลดไฟล์ .xlsx ยอดขายตู้ที่ export จาก Ksher (กล่องอัปโหลดในหน้า machine-sales.html)
    if (request.method === 'POST' && url.pathname === '/api/admin/machine-sales/upload') {
      return handleAdminMachineSalesUpload(request, env);
    }

    // ปฏิทินจำนวนชิ้นที่ขายได้รายวันสำหรับ Android home-screen widget — ต่างจาก
    // /api/admin/machine-sales ตรงที่นี่สรุปเป็นตัวเลขต่อวันแล้ว (ไม่ใช่ raw แถวธุรกรรม) และผ่าน
    // WIDGET_TOKEN แทน session/PIN เพราะ widget รีเฟรชพื้นหลังเอง ไม่มีคนกดล็อกอินซ้ำทุก 12 ชม.
    if (request.method === 'GET' && url.pathname === '/api/widget/daily-sales-calendar') {
      return handleWidgetDailySales(request, env, ctx);
    }

    if (request.method === 'GET' && url.pathname === '/api/admin/stock-log') {
      return handleAdminStockLog(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/api/admin/stock-cost') {
      return handleAdminStockCost(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/stock-update') {
      return handleAdminStockUpdate(request, env);
    }

    // อ่านสต็อกสาธารณะ — index.html/product.html/order.html เดิมยิงตรงไปหา Apps Script
    // จากเบราว์เซอร์ลูกค้าทุกครั้งที่เปิดหน้า (ดู js/inventory.js) ทำให้ Apps Script ทำงาน
    // หนักและหน้าเว็บโหลดช้าเวลา Apps Script ตอบช้า/โควต้าตัน ย้ายมาพร็อกซีผ่าน Worker แล้ว
    // ใช้ Cache API เดียวกับ endpoint แอดมิน ให้ผู้ชมหลายคนพร้อมกันแชร์ผลลัพธ์ที่ cache ไว้
    if (request.method === 'GET' && url.pathname === '/api/stock') {
      return handlePublicStock(request, env, ctx);
    }

    if (request.method === 'POST' && url.pathname === '/api/line/webhook') {
      return handleLineWebhook(request, env, ctx);
    }

    return json({ ok: false, error: 'Not found' }, 404, CORS_HEADERS);
  },
};

async function handleOrder(request, env) {
  let order;
  try {
    order = await request.json();
  } catch (e) {
    return json({ ok: false, error: 'Invalid JSON' }, 400, CORS_HEADERS);
  }

  if (
    !order ||
    !Array.isArray(order.items) ||
    order.items.length === 0 ||
    !order.name ||
    !order.phone
  ) {
    return json({ ok: false, error: 'Missing required fields' }, 400, CORS_HEADERS);
  }

  if (!env.LINE_CHANNEL_ACCESS_TOKEN || !env.LINE_TARGET_ID) {
    return json({ ok: false, error: 'Server not configured' }, 500, CORS_HEADERS);
  }

  const text = buildLineText(order);

  try {
    const lineRes = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: env.LINE_TARGET_ID,
        messages: [{ type: 'text', text }],
      }),
    });

    if (!lineRes.ok) {
      const errBody = await lineRes.text();
      console.log('LINE push failed:', lineRes.status, errBody);
      return json({ ok: false, error: 'Failed to notify via LINE' }, 502, CORS_HEADERS);
    }
  } catch (e) {
    console.log('LINE push network error:', e);
    return json({ ok: false, error: 'Network error contacting LINE' }, 502, CORS_HEADERS);
  }

  // Save the order (the LINE notification above already went out, so a database hiccup must not fail the request)
  try {
    await larna.createOrder(env.DB, order);
  } catch (e) {
    console.log('D1 order save failed (non-fatal):', e);
  }

  await deductStock(env, order, 'ออเดอร์เว็บไซต์');

  return json({ ok: true }, 200, CORS_HEADERS);
}

// ตัดสต็อกสินค้าตามรายการที่สั่ง — ไม่ทำให้ order ล้มเหลวถ้าตัดสต็อกไม่สำเร็จ (เช่น item ไม่มี id
// เพราะสั่งก่อนอัปเดตเว็บ หรือ Apps Script ล่มชั่วคราว) ใช้ร่วมกันทั้ง order.html (handleOrder) และ
// LINE bot (handleIncomingText) — sourceLabel ใส่ต่างกันแค่บอกว่าออเดอร์มาจากช่องทางไหนใน log ของ stock.html
async function deductStock(env, order, sourceLabel) {
  await adjustStockForItems(env, order.items, -1, `${sourceLabel} — ${order.name || ''}`.trim());
}

// คืนสต็อกกลับ (ใช้ตอนยกเลิกออเดอร์) — items ต้องเป็น [{id,qty}] ที่ resolve กับ PRODUCT_CATALOG แล้ว
async function restoreStock(env, items, sourceLabel) {
  await adjustStockForItems(env, items, 1, sourceLabel);
}

// แกนกลางของทั้ง deductStock/restoreStock — sign: -1 = ตัด, +1 = คืน
// ตอนนี้ปรับใน D1 โดยตรง (UPDATE ครั้งเดียวต่อสินค้า) ออเดอร์ที่เข้าพร้อมกันจึงไม่ทับกัน และบันทึก log ให้ในครั้งเดียวกัน
async function adjustStockForItems(env, items, sign, note) {
  await Promise.all(
    (items || []).map(async (it) => {
      if (!it.id) return;
      const qty = Number(it.qty) || 0;
      if (qty <= 0) return;
      const delta = sign * qty;
      try {
        const result = await larna.adjustStock(env.DB, { id: it.id, delta, note });
        if (result.error) console.log('Stock adjust rejected:', it.id, 'delta=' + delta, result.error);
      } catch (e) {
        console.log('Stock adjust failed (non-fatal):', it.id, e);
      }
    })
  );
}

async function handleAdminLogin(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid JSON' }, 400, CORS_HEADERS);
  }

  const pin = (data.pin || '').toString();
  if (!env.ADMIN_PIN || !timingSafeEqual(pin, env.ADMIN_PIN)) {
    return json({ success: false, error: 'Invalid PIN' }, 401, CORS_HEADERS);
  }

  const token = await createToken(env.SESSION_SECRET);
  return json({ success: true, token }, 200, CORS_HEADERS);
}



async function handleAdminOrders(request, env, ctx) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);

  try {
    return json(await larna.listOrders(env.DB), 200, CORS_HEADERS);
  } catch (err) {
    console.log('Orders read error:', err);
    return json({ error: 'Failed to read orders' }, 502, CORS_HEADERS);
  }
}

async function handleAdminUpdateStatus(request, env) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400, CORS_HEADERS);
  }

  try {
    const result = await larna.updateOrderStatus(env.DB, { id: body.id, row: body.row, status: body.status });
    if (!result.ok) return json(result, 404, CORS_HEADERS);
    return json({ ok: true }, 200, CORS_HEADERS);
  } catch (err) {
    console.log('Status update error:', err);
    return json({ ok: false, error: 'Failed to update status' }, 502, CORS_HEADERS);
  }
}

// แก้ไขรายละเอียดออเดอร์ (ชื่อ/เบอร์/ที่อยู่/วันที่จัดส่ง/รายการ/ยอดรวม/หมายเหตุ) — ต้องผ่าน PIN token
async function handleAdminUpdateOrder(request, env) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400, CORS_HEADERS);
  }
  if (!body.id && !body.row) return json({ error: 'Missing id/row' }, 400, CORS_HEADERS);

  try {
    const result = await larna.updateOrder(env.DB, body);
    if (!result.ok) return json(result, 404, CORS_HEADERS);
    return json({ ok: true }, 200, CORS_HEADERS);
  } catch (err) {
    console.log('Order update error:', err);
    return json({ ok: false, error: 'Failed to update order' }, 502, CORS_HEADERS);
  }
}

// อ่านรายการต้นทุน/ค่าใช้จ่าย (หน้า accounting.html)
async function handleAdminExpenses(request, env, ctx) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);

  try {
    return json(await larna.listExpenses(env.DB), 200, CORS_HEADERS);
  } catch (err) {
    console.log('Expenses read error:', err);
    return json({ error: 'Failed to read expenses' }, 502, CORS_HEADERS);
  }
}

// ยอดขายตู้ (หน้า machine-sales.html) — อ่านจาก D1 เสมอ Ksher ยังเติมข้อมูลลงแท็บ inbox ของชีต
// ปุ่มรีเฟรช (?fresh=1) จะดึงแถวใหม่จากชีตเข้า D1 ก่อนตอบ ส่วนปกติ cron คัดลอกให้ทุก 5 นาที
async function handleAdminMachineSales(request, env, ctx) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);

  try {
    const url = new URL(request.url);
    let syncedNow = null;
    if (url.searchParams.has('fresh')) syncedNow = await larna.syncMachineSales(env);
    const result = await larna.listMachineSales(env.DB);
    return new Response(JSON.stringify(result), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'X-Larna-Sync': syncedNow ? (syncedNow.ok ? 'ok' : 'failed') : 'skipped' },
    });
  } catch (err) {
    console.log('Machine sales read error:', err);
    return json({ error: 'Failed to read machine sales' }, 502, CORS_HEADERS);
  }
}

// รับแถวจากไฟล์ .xlsx ที่เบราว์เซอร์อ่านแล้ว ({ filename, rows, confirm }) — confirm เป็น false = แค่ตรวจและสรุปให้ดูก่อน
// (ไม่เขียนอะไร) true = เขียนบิลที่ใหม่/ต่างจากที่มีอยู่ลง D1 ตรวจสิทธิ์ด้วย PIN session เหมือนเอนด์พอยต์แอดมินอื่น
async function handleAdminMachineSalesUpload(request, env) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);

  if (Number(request.headers.get('content-length') || 0) > 8 * 1024 * 1024) {
    return json({ ok: false, error: 'ไฟล์ใหญ่เกินไป (ไม่เกิน 6,000 แถว)' }, 413, CORS_HEADERS);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400, CORS_HEADERS);
  }
  if (!body || !Array.isArray(body.rows) || !body.rows.length) {
    return json({ ok: false, error: 'ไม่พบแถวข้อมูลในไฟล์' }, 400, CORS_HEADERS);
  }
  if (body.rows.length > larna.UPLOAD_MAX_ROWS) {
    return json({ ok: false, error: `ไฟล์มี ${body.rows.length} แถว เกินกำหนด ${larna.UPLOAD_MAX_ROWS} แถวต่อครั้ง กรุณาแบ่งไฟล์` }, 413, CORS_HEADERS);
  }
  if (!body.rows.every((r) => r && typeof r === 'object' && !Array.isArray(r))) {
    return json({ ok: false, error: 'รูปแบบข้อมูลไม่ถูกต้อง' }, 400, CORS_HEADERS);
  }

  try {
    const result = await larna.importMachineSalesUpload(env.DB, {
      filename: body.filename,
      rows: body.rows,
      confirm: body.confirm === true,
    });
    return json(result, result.ok ? 200 : 422, CORS_HEADERS);
  } catch (err) {
    console.log('Machine sales upload error:', err);
    return json({ ok: false, error: 'นำเข้าไม่สำเร็จ ลองใหม่อีกครั้ง' }, 502, CORS_HEADERS);
  }
}

// เอนด์พอยต์สำหรับ Android home-screen widget (ปฏิทินจำนวนชิ้นที่ขายได้รายวันจากตู้) — ต้องแนบ header
// X-Widget-Token ให้ตรงกับ secret WIDGET_TOKEN เพราะ machine-sales.html เดิมมีแค่ raw ต้องผ่าน PIN
// session เท่านั้น ?month=YYYY-M (M เป็นเลข 0-11) — ไม่ระบุ = เดือนปัจจุบัน
async function handleWidgetDailySales(request, env, ctx) {

  const token = request.headers.get('X-Widget-Token') || '';
  if (!env.WIDGET_TOKEN || !timingSafeEqual(token, env.WIDGET_TOKEN)) {
    return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);
  }

  try {
    const url = new URL(request.url);
    const monthParam = url.searchParams.get('month');

    const sales = await larna.listMachineSales(env.DB);
    const rows = parseMachineSalesRows_(sales.sales || []);
    const calendar = computeDailyCalendarCake_(rows, monthParam);

    return json(calendar, 200, CORS_HEADERS);
  } catch (err) {
    console.log('Widget daily sales error:', err);
    return json({ error: 'Failed to compute calendar' }, 502, CORS_HEADERS);
  }
}

// แปลงแถวดิบจาก action=machine-sales (ดู _apps-script-reference.gs / machine-sales.html
// normalizeRow) ให้เหลือแค่ { datetime (UTC instant ที่ถูกต้อง), qty, status } ที่ต้องใช้คำนวณปฏิทิน
// — จงใจไม่ใช้ new Date(y, mo, d, hr, mn, sec) แบบใน machine-sales.html เพราะโค้ดนั้นรันในเบราว์เซอร์
// ที่ (สมมติว่า) ตั้ง timezone เป็นไทย ส่วน Worker รันด้วย timezone UTC เสมอ ต้องแปลงเวลาไทยดิบเป็น
// UTC ให้ถูกต้องด้วยมือผ่าน bangkokTimeToUtc เหมือน OFresh
function parseMachineSalesRows_(sales) {
  return sales
    .map(r => {
      const datetime = parseSaleDateBangkok_(r.transactiondate);
      const { qty } = parseProductQty_(r.productname);
      const status = String(r.status || '').trim().toLowerCase();
      return { datetime, qty, status };
    })
    .filter(r => r.datetime && !isNaN(r.datetime) && r.status === 'paid');
}

// รูปแบบหลักที่ชีตส่งมาคือ "YYYY-MM-DD HH:MM:SS" (formatSheetDateTime_ ใน Apps Script) แต่กันไว้เผื่อ
// เป็น text ดิบจาก Ksher แบบ "16/08/2026 23:02:34" เหมือนฝั่ง machine-sales.html — ทั้งสองแบบถือเป็น
// เวลาไทยเสมอ (ไม่มี timezone suffix)
function parseSaleDateBangkok_(raw) {
  if (!raw) return null;
  const s = String(raw).trim();

  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (m) return bangkokTimeToUtc(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0));

  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (m) {
    const year = +m[3] > 2500 ? +m[3] - 543 : +m[3]; // เผื่อปีพ.ศ.
    return bangkokTimeToUtc(year, +m[2] - 1, +m[1], +m[4], +m[5], +(m[6] || 0));
  }

  const d = new Date(s);
  return isNaN(d) ? null : d;
}

// "3 x มินิ ลาร์นา เค้ก (ออริจินัล)" → { qty: 3 } — รองรับ "ชื่อ x3" ด้วยเหมือน machine-sales.html
function parseProductQty_(raw) {
  const s = String(raw == null ? '' : raw).trim();
  if (!s) return { qty: 1 };
  let m = s.match(/^(\d+)\s*[x×]\s*(.+)$/i);
  if (m) return { qty: +m[1] };
  m = s.match(/^(.+?)\s*[x×]\s*(\d+)$/i);
  if (m) return { qty: +m[2] };
  return { qty: 1 };
}

// คำนวณจำนวนชิ้นที่ขายได้แยกรายวันของเดือนที่ระบุ (ค่าเริ่มต้น = เดือนปัจจุบัน เวลาไทย) จากแถวที่
// กรอง status === paid มาแล้ว — โครงเดียวกับ computeDailyCalendar_ ของ OFresh (ดูคอมเมนต์ที่นั่น)
function computeDailyCalendarCake_(rows, monthParam) {
  let targetYear, targetMonth;
  if (monthParam && /^\d{4}-\d{1,2}$/.test(monthParam)) {
    const [y, m] = monthParam.split('-').map(Number);
    targetYear = y; targetMonth = m;
  } else {
    const cur = toBangkokParts(new Date());
    targetYear = cur.year; targetMonth = cur.month;
  }

  const daysInMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const dayCups = {};
  for (let d = 1; d <= daysInMonth; d++) dayCups[String(d).padStart(2, '0')] = 0;

  let monthCups = 0;
  rows.forEach(r => {
    const p = toBangkokParts(r.datetime);
    if (p.year === targetYear && p.month === targetMonth) {
      const key = String(p.day).padStart(2, '0');
      dayCups[key] += r.qty;
      monthCups += r.qty;
    }
  });

  const cur = toBangkokParts(new Date());
  const isCurrentMonth = cur.year === targetYear && cur.month === targetMonth;
  const todayKey = isCurrentMonth ? String(cur.day).padStart(2, '0') : null;

  const firstWeekday = new Date(Date.UTC(targetYear, targetMonth, 1)).getUTCDay();

  return {
    month: `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`,
    monthLabel: thaiMonthYearLabel_(targetYear, targetMonth),
    daysInMonth,
    firstWeekday,
    cups: dayCups,
    monthCups,
    today: todayKey,
    todayCups: todayKey ? dayCups[todayKey] : 0,
  };
}

// ── เวลาไทย ── Worker รันด้วย timezone UTC เสมอ ต้องแปลงเวลาไทยดิบ (ไม่มี timezone suffix)
// เป็น UTC instant ที่ถูกต้องด้วยมือทุกครั้ง (pattern เดียวกับ order-api-worker.js ของ OFresh)
const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;

function bangkokTimeToUtc(y, mo, d, hr, mn, sec) {
  return new Date(Date.UTC(y, mo, d, hr, mn, sec || 0) - BANGKOK_OFFSET_MS);
}

function toBangkokParts(date) {
  const shifted = new Date(date.getTime() + BANGKOK_OFFSET_MS);
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth(), day: shifted.getUTCDate() };
}

const TH_MONTH_NAMES_ = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
function thaiMonthYearLabel_(year, month) {
  return `${TH_MONTH_NAMES_[month]} ${year + 543}`;
}

// เขียนรายการต้นทุน/ค่าใช้จ่าย (เพิ่ม/แก้ไข/ลบ) — ต้องผ่าน PIN token เพราะเป็นข้อมูลการเงินที่กระทบยอดกำไร
async function handleAdminExpenseWrite(request, env) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid JSON' }, 400, CORS_HEADERS);
  }

  const action = (body.action === 'update' || body.action === 'delete') ? body.action : 'add';

  if (action === 'add') {
    if (!body.id || !body.type || !body.category || !body.amount || !body.date) {
      return json({ success: false, error: 'Missing required fields' }, 400, CORS_HEADERS);
    }
    if (body.type !== 'cogs' && body.type !== 'opex') {
      return json({ success: false, error: 'Invalid type' }, 400, CORS_HEADERS);
    }
  } else if (!body.id) {
    return json({ success: false, error: 'Missing id' }, 400, CORS_HEADERS);
  }

  try {
    const result = action === 'add' ? await larna.addExpense(env.DB, body)
      : action === 'update' ? await larna.updateExpense(env.DB, body)
      : await larna.deleteExpense(env.DB, body);
    return json(result, result.success === false ? 404 : 200, CORS_HEADERS);
  } catch (err) {
    console.log('Expense write error:', err);
    return json({ success: false, error: 'Failed to save expense' }, 502, CORS_HEADERS);
  }
}

// ประวัติการปรับสต็อก (หน้า stock.html) — ต้องผ่าน PIN token
async function handleAdminStockLog(request, env) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);

  try {
    return json(await larna.getStockLog(env.DB), 200, CORS_HEADERS);
  } catch (err) {
    console.log('Stock log read error:', err);
    return json({ error: 'Failed to read stock log' }, 502, CORS_HEADERS);
  }
}

// สต็อกพร้อมต้นทุนต่อหน่วย (คอลัมน์ "ต้นทุน" ในหน้า stock.html) — ต้นทุนเป็นข้อมูลอ่อนไหวด้านมาร์จิ้น
// จึงต้องผ่าน PIN token เท่านั้น (GET /api/stock สาธารณะไม่มีต้นทุน)
async function handleAdminStockCost(request, env) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);

  try {
    return json(await larna.getStock(env.DB, true), 200, CORS_HEADERS);
  } catch (err) {
    console.log('Stock cost read error:', err);
    return json({ error: 'Failed to read stock cost' }, 502, CORS_HEADERS);
  }
}

// แก้ไขจำนวนสต็อก (ปุ่ม "บันทึก" ในหน้า stock.html) — client ส่ง {action, id, newStock/delta, note}
async function handleAdminStockUpdate(request, env) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400, CORS_HEADERS);
  }

  try {
    const result = body.action === 'adjustStock'
      ? await larna.adjustStock(env.DB, { id: body.id, delta: body.delta, note: body.note })
      : body.action === 'setStock'
        ? await larna.setStock(env.DB, { id: body.id, newStock: body.newStock, note: body.note, cost: body.cost, name: body.name })
        : { error: 'unknown action' };
    return json(result, 200, CORS_HEADERS);
  } catch (err) {
    console.log('Stock update error:', err);
    return json({ error: 'Failed to update stock' }, 502, CORS_HEADERS);
  }
}

// สต็อกสำหรับหน้าร้าน (ไม่มีต้นทุน/ยอดขาย ไม่ต้อง auth) — แคชที่ edge ไว้สั้นๆ เพราะทุกคนที่เปิดหน้าเว็บเรียกอันนี้
async function handlePublicStock(request, env, ctx) {
  const url = new URL(request.url);
  const forceFresh = url.searchParams.has('fresh');
  const cache = caches.default;
  const cacheKey = new Request('https://larna-cache.local/public-stock', { method: 'GET' });

  if (!forceFresh) {
    const cached = await cache.match(cacheKey);
    if (cached) {
      return new Response(cached.body, { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'X-Larna-Cache': 'HIT' } });
    }
  }

  try {
    const body = JSON.stringify(await larna.getStock(env.DB, false));
    if (ctx) {
      ctx.waitUntil(cache.put(cacheKey, new Response(body, {
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': `public, max-age=${PUBLIC_STOCK_CACHE_TTL_SECONDS}` },
      })));
    }
    return new Response(body, { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'X-Larna-Cache': forceFresh ? 'BYPASS' : 'MISS' } });
  } catch (err) {
    console.log('Public stock read error:', err);
    return json({ error: 'Failed to read stock' }, 502, CORS_HEADERS);
  }
}

// ══════════════════════════════════════════════════════════════════════
// AI order assistant (กลุ่มไลน์แอดมิน) — พอร์ตมาจาก OFresh's order-api-worker.js
// บันทึกออเดอร์ลงชีตทันทีที่ parse ได้ ไม่มีขั้นตอนยืนยัน — ถ้า AI parse ผิด แก้ไขได้ทันที
// ด้วยปุ่ม "ยกเลิกออเดอร์นี้" ที่แนบมาด้วยทุกครั้ง หรือแก้สถานะในแดชบอร์ด (dashboard.html)
// ══════════════════════════════════════════════════════════════════════

async function handleLineWebhook(request, env, ctx) {
  // ต้องอ่านเป็น text ดิบก่อน (ไม่ใช่ .json()) เพราะลายเซ็นคำนวณจาก raw body bytes
  const bodyText = await request.text();
  const signature = request.headers.get('X-Line-Signature') || '';

  const validSig = await verifyLineSignature(bodyText, signature, env.LINE_CHANNEL_SECRET);
  if (!validSig) return new Response('Invalid signature', { status: 401 });

  let payload;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const events = Array.isArray(payload.events) ? payload.events : [];
  for (const event of events) {
    // log group id ของทุกข้อความที่เข้ามา (ไม่ใช่แค่กลุ่มที่อยู่ใน ADMIN_GROUP_IDS แล้ว) — ใช้หา
    // group id ตอน setup ครั้งแรก ผ่าน Cloudflare dashboard → Worker → Logs → Begin log stream
    // เอาออกได้ทีหลังเมื่อไม่ต้องใช้แล้ว (ไม่ใช่ข้อมูลลับ ทิ้งไว้ก็ไม่เป็นไร)
    if (event.source && event.source.type === 'group') {
      console.log('LINE group message from groupId:', event.source.groupId);
    }

    const isAdminGroup = event.source && event.source.type === 'group' && ADMIN_GROUP_IDS.includes(event.source.groupId);
    if (!isAdminGroup) continue;

    // ตอบ LINE ให้เร็วที่สุด (200 ทันที) แล้วประมวลผลจริงต่อเบื้องหลังผ่าน waitUntil
    // เพราะเรียก Gemini + เขียนชีตอาจใช้เวลาหลายวินาที ไม่ควรให้ LINE รอ
    if (event.type === 'message' && event.message && event.message.type === 'text') {
      ctx.waitUntil(handleIncomingText(event, env).catch(err => console.log('handleIncomingText error:', err)));
    } else if (event.type === 'postback') {
      ctx.waitUntil(handlePostback(event, env).catch(err => console.log('handlePostback error:', err)));
    }
  }

  return new Response('OK', { status: 200 });
}

// LINE เซ็นลายเซ็นเป็น base64(HMAC-SHA256(channelSecret, rawBody)) มาตรฐาน (ไม่ใช่ base64url)
async function verifyLineSignature(bodyText, signatureB64, channelSecret) {
  if (!channelSecret || !signatureB64) return false;
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(channelSecret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(bodyText));
  const expected = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return timingSafeEqual(expected, signatureB64);
}

async function handleIncomingText(event, env) {
  const text = (event.message.text || '').trim();
  const replyToken = event.replyToken;

  // ดึงประวัติลูกค้าจากชีตเดิม มาช่วย Gemini เดาเบอร์/ที่อยู่ให้ถ้าลูกค้าเคยสั่งมาก่อน — ไม่ cache
  // (LarnaCake's Worker ไม่มี KV binding) ยิงสดทุกครั้ง ถ้าดึงไม่สำเร็จก็แค่ไม่มี auto-fill เฉยๆ
  // ไม่ทำให้ทั้งฟีเจอร์พังไปด้วย
  let customers = [];
  try {
    customers = await getCustomerHistory(env);
  } catch (err) {
    console.log('getCustomerHistory failed (non-fatal):', err);
  }

  let parsed;
  try {
    parsed = await parseOrderFromMessage(text, customers, env);
  } catch (err) {
    console.log('parseOrderFromMessage failed:', err);
    await replyToLine(env, replyToken, [{ type: 'text', text: '⚠️ อ่านข้อความไม่สำเร็จ (AI error) รบกวนลองพิมพ์ใหม่อีกครั้งครับ' }]);
    return;
  }

  if (!parsed.isOrder) return; // ข้อความคุยเล่นทั่วไป ไม่ใช่ออเดอร์ — เงียบไว้ ไม่ต้องตอบ

  const { items, unknownItemNames } = resolveOrderItems(parsed.items);
  if (items.length === 0) {
    await replyToLine(env, replyToken, [{
      type: 'text',
      text: `⚠️ ไม่พบสินค้าที่พิมพ์มาในเมนูเลยครับ (${unknownItemNames.join(', ') || 'ไม่ระบุ'}) รบกวนตรวจชื่อสินค้าอีกครั้ง`,
    }]);
    return;
  }

  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const id = crypto.randomUUID();
  const order = {
    id,
    name: parsed.name || '',
    phone: parsed.phone || '',
    address: parsed.address || '',
    date: parsed.date || '',
    items,
    total,
    fulfillment: parsed.fulfillment === 'delivery' ? 'delivery' : 'pickup',
    note: [parsed.note, unknownItemNames.length ? `(พิมพ์มาแต่ไม่พบในเมนู: ${unknownItemNames.join(', ')})` : null].filter(Boolean).join(' '),
  };

  try {
    await saveOrderToSheet(env, order);
  } catch (err) {
    console.log('saveOrderToSheet failed:', err);
    await replyToLine(env, replyToken, [{ type: 'text', text: '⚠️ บันทึกออเดอร์ไม่สำเร็จ รบกวนกรอกในแดชบอร์ดเองหรือลองพิมพ์ใหม่อีกครั้งครับ' }]);
    return;
  }

  await deductStock(env, order, 'ออเดอร์จาก LINE bot');

  await replyToLine(env, replyToken, [
    { type: 'text', text: buildOrderSummaryText(order, parsed) },
    { type: 'text', text: '✅ บันทึกออเดอร์นี้แล้วครับ', quickReply: cancelQuickReply(id) },
  ]);
}

// ประวัติลูกค้า group ตามชื่อจากออเดอร์เดิม — ใช้ล่าสุดต่อคนมาเป็นเบอร์/ที่อยู่ default ให้ Gemini เดา
// ถ้าแอดมินพิมพ์แค่ชื่อลูกค้าเก่าไม่ครบทุกฟิลด์
async function getCustomerHistory(env) {
  return larna.customerHistory(env.DB);
}

// เลือกเฉพาะลูกค้าที่มีแนวโน้มเกี่ยวข้องกับข้อความนี้ (ชื่อ/เบอร์ปรากฏในข้อความ) ส่งให้ Gemini
// แทนที่จะส่งประวัติทั้งหมด — ประหยัด token และลดโอกาส Gemini สับสนจับคู่ผิดคนจากลูกค้าที่ไม่เกี่ยวข้อง
// (พอร์ตมาจาก O'Fresh's order-api-worker.js แบบเดียวกันเป๊ะๆ)
function prefilterCustomers(text, customers, limit = 8) {
  const lower = text.toLowerCase();
  const digitRuns = text.match(/\d{4,}/g) || [];
  const scored = customers.map(c => {
    let score = 0;
    // เผื่อ c.name/c.phone/c.address ไม่ใช่ string จริงๆ (เช่น Google Sheets คืนเซลล์ตัวเลขล้วนเป็น
    // JS number) — แปลงเป็น string ตรงนี้ซ้ำอีกชั้น กัน .slice()/.split() พังแม้ getCustomerHistory
    // จะแปลงไว้ให้แล้วก็ตาม (defense in depth เผื่อมีจุดอื่นเรียก prefilterCustomers ตรงๆ ในอนาคต)
    const name = String(c.name || '');
    const phone = String(c.phone || '');
    const address = String(c.address || '');
    const nameLower = name.toLowerCase();
    if (nameLower && lower.includes(nameLower)) score += 3;
    else if (nameLower) {
      const parts = nameLower.split(/\s+/).filter(p => p.length >= 2);
      if (parts.some(p => lower.includes(p))) score += 2;
    }
    if (phone) {
      const tail = phone.slice(-4);
      if (digitRuns.some(run => run.includes(tail))) score += 3;
    }
    if (address) {
      const addrWords = address.split(/\s+/).filter(w => w.length >= 3);
      if (addrWords.some(w => lower.includes(w.toLowerCase()))) score += 1;
    }
    return { c, score };
  });
  const matched = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.c);
  if (matched.length > 0) return matched.slice(0, limit);
  return customers.slice().sort((a, b) => b.orderCount - a.orderCount).slice(0, 3);
}

// จับคู่ items[].id ที่ Gemini ตอบมา กับ PRODUCT_CATALOG จริง — ไม่เชื่อชื่อ/ราคาที่ Gemini ตอบมาตรงๆ
// (กัน hallucinate ตัวเลข) id ไหนไม่ตรงกับ catalog เลยจะถูกตัดออก แล้วรายงานชื่อที่พิมพ์มาแยกต่างหาก
function resolveOrderItems(rawItems) {
  const items = [];
  const unknownItemNames = [];
  (rawItems || []).forEach(ri => {
    const qty = Number(ri.qty) || 0;
    if (qty <= 0) return;
    const product = PRODUCT_CATALOG.find(p => p.id === ri.id);
    if (!product) {
      unknownItemNames.push(String(ri.id || '').slice(0, 50));
      return;
    }
    items.push({ id: product.id, name: product.name, qty, price: product.price });
  });
  return { items, unknownItemNames };
}

async function parseOrderFromMessage(text, customers, env) {
  const catalogText = PRODUCT_CATALOG.map(p => `${p.id}: ${p.name} (${p.price} บาท)`).join('\n');
  const knownCustomers = prefilterCustomers(text, customers);

  const systemPrompt = [
    'คุณคือผู้ช่วยแปลงข้อความแจ้งออเดอร์เค้กที่แอดมินพิมพ์ในแชทกลุ่ม ให้เป็นออเดอร์แบบมีโครงสร้าง',
    'ตอบกลับเป็น JSON ล้วนๆ เท่านั้น ห้ามมีข้อความอื่นนอก JSON และห้ามใช้ markdown code fence',
    'รูปแบบ JSON ที่ต้องตอบ:',
    '{"isOrder":boolean,"name":string,"phone":string,"items":[{"id":string,"qty":number}],"fulfillment":"pickup"|"delivery","address":string,"date":string|null,"note":string,"confidence":number,"missingFields":string[],"matchedCustomer":string|null}',
    '- isOrder: false ถ้าข้อความนี้ไม่ได้พูดถึงการสั่งซื้อเค้กเลย (เช่น ทักทาย คุยเรื่องอื่น) — ฟิลด์อื่นใส่ค่าว่าง/0 ได้',
    '- items[].id: ต้องเลือกจาก id ในเมนูด้านล่างเท่านั้น ห้ามสร้าง id ขึ้นเอง ถ้าจับคู่สินค้าที่พิมพ์มากับเมนูไม่ได้เลย ให้ใส่ข้อความที่แอดมินพิมพ์มาแทนที่ id ตรงๆ (โค้ดฝั่งเราจะตรวจจับว่าไม่ตรงกับเมนูเอง)',
    '- ห้ามคำนวณราคา/total เอง (ไม่มีฟิลด์ total หรือ price ในผลลัพธ์) — ฝั่งโค้ดจะคำนวณจากราคาจริงในเมนูเอง',
    '- fulfillment: "delivery" ถ้าขอให้จัดส่ง มีที่อยู่ ไม่งั้นถือเป็น "pickup" (รับที่ร้าน)',
    '- date: แปลงเป็น YYYY-MM-DD ถ้าระบุมา (เช่น "พรุ่งนี้" ให้คำนวณจากวันที่ปัจจุบันที่ให้ไว้) ไม่งั้นใส่ null',
    '- confidence (0-1): มั่นใจแค่ไหนว่า parse ถูกต้องครบถ้วนและจับคู่ลูกค้าถูกคน ถ้าชื่อ/เบอร์กำกวมหรือจับคู่ได้หลายคน ให้ confidence ต่ำ',
    '- missingFields: รายชื่อฟิลด์ที่จำเป็น (name, phone, items) ที่ยังขาดหรือไม่ชัดเจน',
    '- ถ้าชื่อที่พิมพ์มาตรง/ใกล้เคียงกับลูกค้าในประวัติด้านล่าง ให้เติม phone/address ให้อัตโนมัติจากประวัติคนนั้น (เว้นแต่ข้อความจะระบุเบอร์/ที่อยู่ใหม่มาเอง ให้ใช้ค่าใหม่แทน) แล้วใส่ชื่อลูกค้าตามประวัติเป๊ะๆ ใน matchedCustomer ถ้าไม่ได้จับคู่กับใครเลยให้ matchedCustomer เป็น null',
    `วันที่ปัจจุบัน (เวลาไทย): ${new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Bangkok' })}`,
    'เมนูสินค้า (id: ชื่อ (ราคา)):',
    catalogText,
  ].join('\n');

  const userContent = JSON.stringify({
    message: text,
    customerHistory: knownCustomers,
  });

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
    method: 'POST',
    headers: {
      'x-goog-api-key': env.GEMINI_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userContent }] }],
      // บังคับให้ตอบเป็น JSON ล้วนๆ ที่ฝั่ง API เลย กันปัญหาโมเดลพันด้วย markdown fence หรือพูดนำ/พูดต่อท้าย
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const candidate = data.candidates && data.candidates[0];
  const raw = (candidate && candidate.content && candidate.content.parts && candidate.content.parts[0] && candidate.content.parts[0].text) || '';
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Gemini response did not contain JSON: ' + raw.slice(0, 200));

  const parsed = JSON.parse(match[0]);
  return {
    isOrder: !!parsed.isOrder,
    name: parsed.name || '',
    phone: parsed.phone || '',
    items: Array.isArray(parsed.items) ? parsed.items : [],
    fulfillment: parsed.fulfillment || 'pickup',
    address: parsed.address || '',
    date: parsed.date || '',
    note: parsed.note || '',
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
    missingFields: Array.isArray(parsed.missingFields) ? parsed.missingFields : [],
    matchedCustomer: parsed.matchedCustomer || null,
  };
}

// บันทึกออเดอร์จากบอท (ส่ง id ของเราเองไปด้วย เพื่อให้รู้ id ทันทีสำหรับปุ่มยกเลิก)
async function saveOrderToSheet(env, order) {
  await larna.createOrder(env.DB, order);
}

async function cancelOrderInSheet(env, id) {
  const result = await larna.updateOrderStatus(env.DB, { id, status: 'ยกเลิก' });
  if (!result.ok) throw new Error('Cancel rejected: ' + (result.error || 'unknown'));

  // สถานะเปลี่ยนสำเร็จแล้ว — คืนสต็อกกลับด้วย (แค่เส้นทางยกเลิกผ่านปุ่มไลน์นี้เท่านั้น ยังไม่ครอบคลุม
  // การเปลี่ยนสถานะเป็น "ยกเลิก" จากแดชบอร์ด) ไม่ทำให้การยกเลิกล้มเหลวถ้าคืนสต็อกไม่สำเร็จ เพราะสถานะ
  // อัปเดตไปแล้วจริง แค่ log ไว้เฉยๆ ให้ตามไปแก้สต็อกเองได้ทีหลัง
  try {
    await restoreStockForCancelledOrder(env, id);
  } catch (err) {
    console.log('restoreStockForCancelledOrder failed (non-fatal, status already updated):', err);
  }
}

// หาออเดอร์นี้เพื่อรู้ว่ามีสินค้าอะไรบ้างแล้วคืนสต็อกให้
async function restoreStockForCancelledOrder(env, id) {
  const order = await larna.getOrderById(env.DB, id);
  if (!order) return;

  const items = parseItemsStringToProducts(order.items);
  if (items.length === 0) return;
  await restoreStock(env, items, `ยกเลิกออเดอร์ (LINE bot) — ${order.name || ''}`.trim());
}

// แปลงข้อความในคอลัมน์ "items" ของชีต (เช่น "มินิ ลาร์นา เค้ก (ออริจินัล) x3, มินิ ดูไบ ลาร์นา เค้ก พิสตาชิโอ x2")
// กลับเป็น [{id,qty}] โดยจับคู่ชื่อกับ PRODUCT_CATALOG — ใช้ได้เพราะชื่อที่เขียนลงชีตมาจาก catalog เป๊ะๆ
// อยู่แล้วทั้งจากบอทและจากเว็บไซต์ (product.js ชื่อเดียวกัน) ถ้าจับคู่ไม่ได้ (เช่นชื่อสินค้าถูกแก้ทีหลัง)
// แค่ข้าม item นั้นไปเงียบๆ ไม่ throw
function parseItemsStringToProducts(itemsStr) {
  if (!itemsStr) return [];
  return String(itemsStr).split(',').map(part => {
    const m = part.trim().match(/^(.+?)\s+x(\d+)$/);
    if (!m) return null;
    const name = m[1].trim();
    const qty = Number(m[2]) || 0;
    const product = PRODUCT_CATALOG.find(p => p.name === name);
    if (!product || qty <= 0) return null;
    return { id: product.id, qty };
  }).filter(Boolean);
}

async function replyToLine(env, replyToken, messages) {
  const res = await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ replyToken, messages }),
  });
  if (!res.ok) {
    console.log('LINE reply error:', await res.text());
  }
}

function buildOrderSummaryText(order, parsed) {
  const itemLines = order.items.map(it => `- ${it.name} x${it.qty} = ${it.price * it.qty} บาท`);
  return [
    '🍰 บันทึกออเดอร์จากข้อความ',
    '─────────────────',
    `👤 ชื่อ: ${order.name || '(ไม่ระบุ)'}`,
    order.phone ? `📞 เบอร์: ${order.phone}` : null,
    ...itemLines,
    `💰 ยอดรวม: ${order.total} บาท`,
    `รับสินค้า: ${order.fulfillment === 'delivery' ? '🚚 จัดส่ง' : '🏠 รับที่ร้าน'}`,
    order.fulfillment === 'delivery' && order.address ? `📍 ที่อยู่: ${order.address}` : null,
    order.date ? `📅 วันที่ต้องการ: ${order.date}` : null,
    order.note ? `📝 หมายเหตุ: ${order.note}` : null,
    parsed.matchedCustomer ? `✅ จับคู่กับลูกค้าเดิม: ${parsed.matchedCustomer}` : null,
    parsed.missingFields && parsed.missingFields.length ? `⚠️ ข้อมูลที่ยังขาด: ${parsed.missingFields.join(', ')}` : null,
  ].filter(Boolean).join('\n');
}

// ปุ่มเดียวแนบไปกับข้อความสรุปหลังบันทึกทุกครั้ง — ทางแก้เร็วสุดถ้า AI parse ผิด
// (แก้รายละเอียดอื่นๆ นอกจากยกเลิก ทำในแดชบอร์ด dashboard.html แทน)
function cancelQuickReply(id) {
  return {
    items: [
      { type: 'action', action: { type: 'postback', label: '↩️ ยกเลิกออเดอร์นี้', data: `cancel:${id}`, displayText: 'ยกเลิกออเดอร์นี้' } },
    ],
  };
}

async function handlePostback(event, env) {
  const data = event.postback.data || '';
  const sep = data.indexOf(':');
  if (sep === -1) return;
  const action = data.slice(0, sep);
  const id = data.slice(sep + 1);
  const replyToken = event.replyToken;

  if (action === 'cancel') {
    try {
      await cancelOrderInSheet(env, id);
      await replyToLine(env, replyToken, [{ type: 'text', text: '↩️ ยกเลิกออเดอร์นี้แล้วครับ' }]);
    } catch (err) {
      console.log('cancelOrderInSheet failed:', err);
      await replyToLine(env, replyToken, [{ type: 'text', text: '⚠️ ยกเลิกไม่สำเร็จ รบกวนแก้สถานะในแดชบอร์ดแทนครับ' }]);
    }
  }
}

async function verifyAuthHeader(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return false;
  return verifyToken(token, env.SESSION_SECRET);
}

// ── Token: base64url(payload) + "." + base64url(HMAC-SHA256(payload)) ──
// Worker เป็น stateless เลยเซ็นชื่อ expiry ไว้ในตัว token เอง แทนที่จะเก็บ session ไว้ที่ server

async function createToken(secret) {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_TTL_MS });
  const payloadB64 = toBase64Url(payload);
  const sig = await hmac(secret, payloadB64);
  return `${payloadB64}.${sig}`;
}

async function verifyToken(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadB64, sig] = parts;

  const expectedSig = await hmac(secret, payloadB64);
  if (!timingSafeEqual(sig, expectedSig)) return false;

  try {
    const payload = JSON.parse(fromBase64Url(payloadB64));
    return typeof payload.exp === 'number' && Date.now() < payload.exp;
  } catch {
    return false;
  }
}

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return toBase64Url(String.fromCharCode(...new Uint8Array(sig)));
}

function toBase64Url(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str) {
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function buildLineText(order) {
  const lines = [];
  lines.push('🆕 คำสั่งซื้อใหม่ — Frozen Larna Cake');
  lines.push('');
  order.items.forEach((it) => {
    const name = String(it.name || '').slice(0, 100);
    const qty = Number(it.qty) || 0;
    const price = Number(it.price) || 0;
    lines.push(`- ${name} x${qty} = ${price * qty} THB`);
  });
  lines.push('');
  lines.push(`ยอดรวม: ${order.total} THB`);
  lines.push('');
  lines.push(
    `รับสินค้า: ${order.fulfillment === 'delivery' ? '🚚 จัดส่ง' : '🏠 รับที่ร้าน Larna House'}`
  );
  if (order.fulfillment === 'delivery' && order.address) {
    lines.push(`ที่อยู่: ${order.address}`);
  }
  lines.push(`ชื่อ: ${order.name}`);
  lines.push(`โทร: ${order.phone}`);
  if (order.date) lines.push(`วันที่ต้องการ: ${order.date}`);
  if (order.note) lines.push(`หมายเหตุ: ${order.note}`);
  return lines.join('\n');
}
