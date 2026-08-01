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
 *   SHEETS_URL                 — Apps Script Web App URL (orders sheet)
 *   ADMIN_PIN                  — PIN for dashboard.html
 *   SESSION_SECRET             — long random string, signs admin session tokens
 *   EXPENSES_SHEET_URL         — Apps Script Web App URL for the "Expenses" tab
 *                                (accounting.html — cost/expense tracking, separate
 *                                standalone Apps Script project, see
 *                                _expense-apps-script-reference.gs)
 *   INVENTORY_API_URL          — Apps Script Web App URL for the Stock sheet
 *                                (see google-apps-script/Code.gs) — used both to
 *                                deduct stock when a website order comes in, and
 *                                to proxy stock.html's log/edit calls (below) so
 *                                the ADMIN_KEY never ships in client-side code
 *   INVENTORY_ADMIN_KEY        — ADMIN_KEY Script Property set on that same
 *                                Apps Script project
 *   LINE_CHANNEL_SECRET        — Channel secret (คนละค่ากับ LINE_CHANNEL_ACCESS_TOKEN)
 *                                จาก channel เดิม (Basic settings tab) — ใช้ตรวจลายเซ็น
 *                                webhook ที่ยิงเข้ามา กันคนปลอม request มาสั่งงานบอท
 *   GEMINI_API_KEY             — API key จาก aistudio.google.com/apikey — ใช้ให้ Gemini
 *                                ช่วยอ่าน/แปลงข้อความแอดมินในกลุ่มเป็นออเดอร์ที่มีโครงสร้าง
 *
 * See LINE-ORDER-BACKEND-SETUP.md for full setup steps.
 */

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 ชั่วโมง

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
      return handleAdminOrders(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/update-status') {
      return handleAdminUpdateStatus(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/api/admin/expenses') {
      return handleAdminExpenses(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/expenses') {
      return handleAdminExpenseWrite(request, env);
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

  // Save to Google Sheets (fire-and-forget — don't fail the order if Sheets is down)
  if (env.SHEETS_URL) {
    try {
      await fetch(env.SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
        redirect: 'follow',
      });
    } catch (e) {
      console.log('Sheets log failed (non-fatal):', e);
    }
  }

  // ตัดสต็อกสินค้าตามรายการที่สั่ง — ไม่ทำให้ order ล้มเหลวถ้าตัดสต็อกไม่สำเร็จ
  // (เช่น item ไม่มี id เพราะสั่งก่อนอัปเดตเว็บ หรือ Apps Script ล่มชั่วคราว)
  if (env.INVENTORY_API_URL && env.INVENTORY_ADMIN_KEY) {
    await Promise.all(
      order.items.map(async (it) => {
        if (!it.id) return;
        const qty = Number(it.qty) || 0;
        if (qty <= 0) return;
        try {
          await fetch(env.INVENTORY_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
              key: env.INVENTORY_ADMIN_KEY,
              action: 'adjustStock',
              id: it.id,
              delta: -qty,
              note: `ออเดอร์เว็บไซต์ — ${order.name || ''}`.trim(),
            }),
            redirect: 'follow',
          });
        } catch (e) {
          console.log('Stock deduct failed (non-fatal):', it.id, e);
        }
      })
    );
  }

  return json({ ok: true }, 200, CORS_HEADERS);
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

async function handleAdminOrders(request, env) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);
  if (!env.SHEETS_URL) return json({ error: 'Not configured' }, 500, CORS_HEADERS);

  try {
    const res = await fetch(env.SHEETS_URL);
    const text = await res.text();
    return new Response(text, { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.log('Sheet proxy error:', err);
    return json({ error: 'Failed to fetch sheet' }, 502, CORS_HEADERS);
  }
}

async function handleAdminUpdateStatus(request, env) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);
  if (!env.SHEETS_URL) return json({ error: 'Not configured' }, 500, CORS_HEADERS);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400, CORS_HEADERS);
  }

  try {
    const sheetsRes = await fetch(env.SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'update_status', row: body.row, id: body.id, status: body.status }),
      redirect: 'follow',
    });
    const text = await sheetsRes.text();
    if (!sheetsRes.ok) {
      console.log('Sheets update_status rejected:', sheetsRes.status, text);
      return json({ ok: false, error: 'Sheet rejected the update' }, 502, CORS_HEADERS);
    }
    return json({ ok: true }, 200, CORS_HEADERS);
  } catch (err) {
    console.log('Status update proxy error:', err);
    return json({ ok: false, error: 'Failed to update status' }, 502, CORS_HEADERS);
  }
}

// อ่านรายการต้นทุน/ค่าใช้จ่าย (หน้า accounting.html) — proxy JSON ตรงๆ แบบเดียวกับ handleAdminOrders
async function handleAdminExpenses(request, env) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);
  if (!env.EXPENSES_SHEET_URL) return json({ error: 'Not configured' }, 500, CORS_HEADERS);

  try {
    const res = await fetch(env.EXPENSES_SHEET_URL);
    const text = await res.text();
    return new Response(text, { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.log('Expenses sheet proxy error:', err);
    return json({ error: 'Failed to fetch sheet' }, 502, CORS_HEADERS);
  }
}

// เขียนรายการต้นทุน/ค่าใช้จ่าย (เพิ่ม/แก้ไข/ลบ) — ต้องผ่าน PIN token เพราะเป็นข้อมูลการเงินที่กระทบยอดกำไร
// ต่างจาก update-status ที่ยิงตรงจาก dashboard.html โดยไม่ auth (เหมาะกับสถานะออเดอร์ซึ่งความเสี่ยงต่ำ) —
// ที่นี่ให้ Worker เป็นตัวกลางยืนยัน token ก่อนเสมอ แล้วค่อย forward ไป Apps Script แทน
async function handleAdminExpenseWrite(request, env) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);
  if (!env.EXPENSES_SHEET_URL) return json({ error: 'Not configured' }, 500, CORS_HEADERS);

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid JSON' }, 400, CORS_HEADERS);
  }

  const action = (data.action === 'update' || data.action === 'delete') ? data.action : 'add';

  if (action === 'add') {
    if (!data.id || !data.type || !data.category || !data.amount || !data.date) {
      return json({ success: false, error: 'Missing required fields' }, 400, CORS_HEADERS);
    }
    if (data.type !== 'cogs' && data.type !== 'opex') {
      return json({ success: false, error: 'Invalid type' }, 400, CORS_HEADERS);
    }
  } else if (!data.id) {
    return json({ success: false, error: 'Missing id' }, 400, CORS_HEADERS);
  }

  try {
    const res = await fetch(env.EXPENSES_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ ...data, action }),
      redirect: 'follow',
    });
    const result = await res.json().catch(() => ({ success: res.ok }));
    return json(result, result.success === false ? 502 : 200, CORS_HEADERS);
  } catch (err) {
    console.log('Expense webhook error:', err);
    return json({ success: false, error: 'Failed to save expense' }, 502, CORS_HEADERS);
  }
}

// อ่านประวัติการปรับสต็อก (หน้า stock.html) — ต้องผ่าน PIN token เพราะ Apps Script
// เจ้าของ endpoint นี้ต้องการ ADMIN_KEY ซึ่งเก็บไว้ที่ Worker เท่านั้น ไม่ส่งให้ client
// รู้ค่าจริงเลย (ต่างจากตอนแรกที่ stock.html เก็บ ADMIN_KEY ไว้ในไฟล์ js ที่ push ขึ้น
// public repo ได้ตรงๆ — ย้ายมาพร็อกซีผ่าน Worker แทนเพื่อไม่ให้ secret หลุดขึ้น GitHub)
async function handleAdminStockLog(request, env) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);
  if (!env.INVENTORY_API_URL || !env.INVENTORY_ADMIN_KEY) return json({ error: 'Not configured' }, 500, CORS_HEADERS);

  try {
    const target = new URL(env.INVENTORY_API_URL);
    target.searchParams.set('action', 'log');
    target.searchParams.set('key', env.INVENTORY_ADMIN_KEY);
    const res = await fetch(target.toString());
    const text = await res.text();
    return new Response(text, { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.log('Stock log proxy error:', err);
    return json({ error: 'Failed to fetch stock log' }, 502, CORS_HEADERS);
  }
}

// อ่านต้นทุนต่อหน่วยของสต็อก (คอลัมน์ "ต้นทุน" ในหน้า stock.html) — เหมือน handleAdminStockLog
// แต่ดึง action=stockAdmin แทน เพราะ cost เป็นข้อมูลอ่อนไหวด้านมาร์จิ้น ต้องผ่าน ADMIN_KEY เท่านั้น
// (action=stock ที่หน้าเว็บ public เรียกตรงได้ไม่ต้องมี key จะไม่มี cost ติดมาด้วยเลย)
async function handleAdminStockCost(request, env) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);
  if (!env.INVENTORY_API_URL || !env.INVENTORY_ADMIN_KEY) return json({ error: 'Not configured' }, 500, CORS_HEADERS);

  try {
    const target = new URL(env.INVENTORY_API_URL);
    target.searchParams.set('action', 'stockAdmin');
    target.searchParams.set('key', env.INVENTORY_ADMIN_KEY);
    const res = await fetch(target.toString());
    const text = await res.text();
    return new Response(text, { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.log('Stock cost proxy error:', err);
    return json({ error: 'Failed to fetch stock cost' }, 502, CORS_HEADERS);
  }
}

// แก้ไขจำนวนสต็อก (ปุ่ม "บันทึก" ในหน้า stock.html) — client ส่งมาแค่ {action, id, newStock/delta, note}
// ไม่มี key เลย, Worker เป็นคนแปะ INVENTORY_ADMIN_KEY จริงให้เองก่อน forward ไป Apps Script
async function handleAdminStockUpdate(request, env) {
  const ok = await verifyAuthHeader(request, env);
  if (!ok) return json({ error: 'Unauthorized' }, 401, CORS_HEADERS);
  if (!env.INVENTORY_API_URL || !env.INVENTORY_ADMIN_KEY) return json({ error: 'Not configured' }, 500, CORS_HEADERS);

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400, CORS_HEADERS);
  }

  try {
    const res = await fetch(env.INVENTORY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ ...data, key: env.INVENTORY_ADMIN_KEY }),
      redirect: 'follow',
    });
    const text = await res.text();
    return new Response(text, { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.log('Stock update proxy error:', err);
    return json({ error: 'Failed to update stock' }, 502, CORS_HEADERS);
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

  let parsed;
  try {
    parsed = await parseOrderFromMessage(text, env);
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

  await replyToLine(env, replyToken, [
    { type: 'text', text: buildOrderSummaryText(order, parsed) },
    { type: 'text', text: '✅ บันทึกออเดอร์นี้แล้วครับ', quickReply: cancelQuickReply(id) },
  ]);
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

async function parseOrderFromMessage(text, env) {
  const catalogText = PRODUCT_CATALOG.map(p => `${p.id}: ${p.name} (${p.price} บาท)`).join('\n');

  const systemPrompt = [
    'คุณคือผู้ช่วยแปลงข้อความแจ้งออเดอร์เค้กที่แอดมินพิมพ์ในแชทกลุ่ม ให้เป็นออเดอร์แบบมีโครงสร้าง',
    'ตอบกลับเป็น JSON ล้วนๆ เท่านั้น ห้ามมีข้อความอื่นนอก JSON และห้ามใช้ markdown code fence',
    'รูปแบบ JSON ที่ต้องตอบ:',
    '{"isOrder":boolean,"name":string,"phone":string,"items":[{"id":string,"qty":number}],"fulfillment":"pickup"|"delivery","address":string,"date":string|null,"note":string,"confidence":number,"missingFields":string[]}',
    '- isOrder: false ถ้าข้อความนี้ไม่ได้พูดถึงการสั่งซื้อเค้กเลย (เช่น ทักทาย คุยเรื่องอื่น) — ฟิลด์อื่นใส่ค่าว่าง/0 ได้',
    '- items[].id: ต้องเลือกจาก id ในเมนูด้านล่างเท่านั้น ห้ามสร้าง id ขึ้นเอง ถ้าจับคู่สินค้าที่พิมพ์มากับเมนูไม่ได้เลย ให้ใส่ข้อความที่แอดมินพิมพ์มาแทนที่ id ตรงๆ (โค้ดฝั่งเราจะตรวจจับว่าไม่ตรงกับเมนูเอง)',
    '- ห้ามคำนวณราคา/total เอง (ไม่มีฟิลด์ total หรือ price ในผลลัพธ์) — ฝั่งโค้ดจะคำนวณจากราคาจริงในเมนูเอง',
    '- fulfillment: "delivery" ถ้าขอให้จัดส่ง มีที่อยู่ ไม่งั้นถือเป็น "pickup" (รับที่ร้าน)',
    '- date: แปลงเป็น YYYY-MM-DD ถ้าระบุมา (เช่น "พรุ่งนี้" ให้คำนวณจากวันที่ปัจจุบันที่ให้ไว้) ไม่งั้นใส่ null',
    '- confidence (0-1): มั่นใจแค่ไหนว่า parse ถูกต้องครบถ้วน ถ้าชื่อสินค้า/จำนวนกำกวม ให้ confidence ต่ำ',
    '- missingFields: รายชื่อฟิลด์ที่จำเป็น (name, phone, items) ที่ยังขาดหรือไม่ชัดเจน',
    `วันที่ปัจจุบัน (เวลาไทย): ${new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Bangkok' })}`,
    'เมนูสินค้า (id: ชื่อ (ราคา)):',
    catalogText,
  ].join('\n');

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
    method: 'POST',
    headers: {
      'x-goog-api-key': env.GEMINI_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text }] }],
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
  };
}

// บันทึกออเดอร์ลงชีตเดียวกับที่ order.html ใช้ (POST ตรงไป SHEETS_URL) — ส่ง id ของเราเองไปด้วย
// ต่างจาก order.html ปกติที่ไม่ส่ง id (ให้ Apps Script generate เอง) เพื่อให้รู้ id ทันทีสำหรับปุ่มยกเลิก
async function saveOrderToSheet(env, order) {
  if (!env.SHEETS_URL) throw new Error('SHEETS_URL not configured');
  await fetch(env.SHEETS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
    redirect: 'follow',
  });
}

async function cancelOrderInSheet(env, id) {
  if (!env.SHEETS_URL) throw new Error('SHEETS_URL not configured');
  const res = await fetch(env.SHEETS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'update_status', id, status: 'ยกเลิก' }),
    redirect: 'follow',
  });
  const text = await res.text();
  let result;
  try { result = JSON.parse(text); } catch { result = { ok: res.ok }; }
  if (!result.ok) throw new Error('Sheet rejected the cancel: ' + text);
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
