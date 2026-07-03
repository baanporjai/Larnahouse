/**
 * Frozen Larna Cake — Order Backend (Cloudflare Worker)
 *
 * Receives order submissions from order.html and pushes a notification
 * to the shop's LINE via the LINE Messaging API.
 *
 * Required secrets (set in Cloudflare dashboard → Worker → Settings → Variables):
 *   LINE_CHANNEL_ACCESS_TOKEN  — long-lived channel access token from a
 *                                LINE Messaging API channel
 *   LINE_TARGET_ID             — userId or groupId that should receive
 *                                the order notification
 *
 * See LINE-ORDER-BACKEND-SETUP.md for full setup steps.
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed" }, 405, corsHeaders);
    }

    let order;
    try {
      order = await request.json();
    } catch (e) {
      return json({ ok: false, error: "Invalid JSON" }, 400, corsHeaders);
    }

    if (
      !order ||
      !Array.isArray(order.items) ||
      order.items.length === 0 ||
      !order.name ||
      !order.phone
    ) {
      return json({ ok: false, error: "Missing required fields" }, 400, corsHeaders);
    }

    if (!env.LINE_CHANNEL_ACCESS_TOKEN || !env.LINE_TARGET_ID) {
      return json({ ok: false, error: "Server not configured" }, 500, corsHeaders);
    }

    const text = buildLineText(order);

    try {
      const lineRes = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          to: env.LINE_TARGET_ID,
          messages: [{ type: "text", text }],
        }),
      });

      if (!lineRes.ok) {
        const errBody = await lineRes.text();
        console.log("LINE push failed:", lineRes.status, errBody);
        return json({ ok: false, error: "Failed to notify via LINE" }, 502, corsHeaders);
      }
    } catch (e) {
      console.log("LINE push network error:", e);
      return json({ ok: false, error: "Network error contacting LINE" }, 502, corsHeaders);
    }

    // Save to Google Sheets (fire-and-forget — don't fail the order if Sheets is down)
    const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwBwehAOVJUm4K5w9UQZTE9j70i6eP1zrv0vwIMLYzAoSvrLDMI7dTU6U_44T7YORZf/exec";
    try {
      await fetch(SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
        redirect: "follow",
      });
    } catch (e) {
      console.log("Sheets log failed (non-fatal):", e);
    }

    return json({ ok: true }, 200, corsHeaders);
  },
};

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

function buildLineText(order) {
  const lines = [];
  lines.push("🆕 คำสั่งซื้อใหม่ — Frozen Larna Cake");
  lines.push("");
  order.items.forEach((it) => {
    const name = String(it.name || "").slice(0, 100);
    const qty = Number(it.qty) || 0;
    const price = Number(it.price) || 0;
    lines.push(`- ${name} x${qty} = ${price * qty} THB`);
  });
  lines.push("");
  lines.push(`ยอดรวม: ${order.total} THB`);
  lines.push("");
  lines.push(
    `รับสินค้า: ${order.fulfillment === "delivery" ? "🚚 จัดส่ง" : "🏠 รับที่ร้าน Larna House"}`
  );
  if (order.fulfillment === "delivery" && order.address) {
    lines.push(`ที่อยู่: ${order.address}`);
  }
  lines.push(`ชื่อ: ${order.name}`);
  lines.push(`โทร: ${order.phone}`);
  if (order.date) lines.push(`วันที่ต้องการ: ${order.date}`);
  if (order.note) lines.push(`หมายเหตุ: ${order.note}`);
  return lines.join("\n");
}
