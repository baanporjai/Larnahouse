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
 *
 * See LINE-ORDER-BACKEND-SETUP.md for full setup steps.
 */

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 ชั่วโมง

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request, env) {
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
