# Order Backend Setup (Cloudflare Worker + LINE)

> **Status: ✅ Set up and working** (as of 2026-07-03). The Worker `larnaapi` is deployed with all required secrets (`LINE_CHANNEL_ACCESS_TOKEN`, `LINE_TARGET_ID`, `SHEETS_URL`, `ADMIN_PIN`, `SESSION_SECRET`) and `order.html` points at it. This doc is kept for reference — e.g. if the LINE token ever needs rotating, or the Worker needs redeploying from scratch.

This replaces the manual "open LINE / send email" flow with a one-click form that sends the order straight to a LINE chat for the shop, the same way O'Fresh works.

## 1. Get a LINE Messaging API channel + token

1. Go to [LINE Developers Console](https://developers.line.biz/console/) and log in with the account that manages `@baanporjai`.
2. Open the Provider for Larna House (or create one).
3. Click **Create a new channel → Messaging API channel**. You can link it to the existing `@baanporjai` OA, or create a separate internal "Larna Orders" bot — either works, since this channel is only used to push order notifications, not to chat with customers.
4. Open the channel → **Messaging API** tab → scroll to **Channel access token (long-lived)** → click **Issue**. Copy this value — it's `LINE_CHANNEL_ACCESS_TOKEN`.

## 2. Get the LINE ID that should receive order notifications

This is the `userId` (or `groupId`) of whoever should get pinged when an order comes in — e.g. the shop owner's personal LINE, or a staff group chat.

Easiest path:
1. In the same channel's **Messaging API** tab, turn on **Use webhook**, and set the webhook URL to your Worker URL + `/webhook` once it's deployed (optional — only needed for this discovery step).
2. Simpler alternative: add the bot as a friend (or to a group), send it any message, then check the **Cloudflare Worker's real-time logs** (Workers & Pages → your worker → Logs → Begin log stream) while sending — the userId/groupId of the sender appears in the webhook payload.
3. Once you have the ID, that's `LINE_TARGET_ID`. (No webhook handling is needed in the worker long-term — this Worker only sends, it doesn't need to receive.)

If this step is awkward, an easier shortcut: ask the person who should receive orders to message `@baanporjai`, then use LINE's [Get follower IDs API](https://developers.line.biz/en/reference/messaging-api/#get-follower-ids) with the same channel token to list recent followers' userIds.

## 3. Deploy the Worker

1. Go to [Cloudflare dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Create Worker**.
2. Give it a name (e.g. `larna-order`), then open the editor and paste in the contents of `cloudflare-worker.js` (in this folder), replacing the default code.
3. Click **Deploy**.
4. Go to **Settings → Variables and Secrets** → add two **Secret** variables:
   - `LINE_CHANNEL_ACCESS_TOKEN` = (value from step 1)
   - `LINE_TARGET_ID` = (value from step 2)
5. Save and redeploy if prompted.
6. Copy the Worker's URL, shown at the top of the page — something like `https://larna-order.<your-subdomain>.workers.dev`.

## 4. Point the website at the Worker

Open `order.html`, find this line near the top of the `<script>` block:

```js
const API_URL = "https://REPLACE-ME.workers.dev/api/order";
```

Replace it with your real Worker URL + `/api/order`, e.g.:

```js
const API_URL = "https://larna-order.yai-taweewoot.workers.dev/api/order";
```

Save, and the order form will go live — submissions will POST to the Worker, which pushes a LINE message to `LINE_TARGET_ID`, and the customer sees an inline "Order Sent!" confirmation on the page.

## Notes

- The "Chat with us on LINE" and "Email us" links on the order page are kept as backup contact options — they don't depend on the Worker.
- If the Worker call fails (network issue, misconfigured secret, etc.), the page shows an error and tells the customer to message `@baanporjai` directly, so no order is silently lost.
- To rotate the LINE token or update the target ID later, run `wrangler secret put LINE_CHANNEL_ACCESS_TOKEN --name larnaapi` (or `LINE_TARGET_ID`) from this folder and paste the new value when prompted.

## 5. AI order assistant (admin group) — ported from O'Fresh

> **Status: needs setup.** The webhook code is deployed (`/api/line/webhook` route), but this feature needs the steps below before it works.

Admins can type a free-text order into the LINE admin group chat (e.g. "พี่ขอมินิออริจินัล 3 ชิ้น กับดูไบพิสตาชิโอ 2 ชิ้น ส่งพรุ่งนี้") and the bot uses Gemini to parse it into a structured order, saves it straight to the Orders sheet, and replies with a summary + a "ยกเลิกออเดอร์นี้" (cancel) button — same feature O'Fresh has.

This uses the **same LINE channel** as the order-notification push above (`@baanporjai`), just with webhook receiving turned on. No new channel needed.

### Setup steps

1. **Get the Channel secret** (different from `LINE_CHANNEL_ACCESS_TOKEN`): LINE Developers Console → your channel → **Basic settings** tab → **Channel secret**.
2. **Get a Gemini API key**: [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Can reuse O'Fresh's key or create a separate one (recommended, so quota/billing don't mix between the two businesses).
3. Add two new secrets to the `larnaapi` Worker (Cloudflare dashboard → Worker → Settings → Variables, or `wrangler secret put <name> --name larnaapi`):
   - `LINE_CHANNEL_SECRET`
   - `GEMINI_API_KEY`
4. **Set the admin group ID(s)**: open `cloudflare-worker.js`, find the `ADMIN_GROUP_IDS` array near the top, and add the group ID(s) of the LINE group chat(s) where admins should be able to type orders. (Not a secret — same convention as O'Fresh's `ADMIN_GROUP_ID`.) Redeploy (copy-paste into the Cloudflare dashboard editor) after editing.
   - To find a group's ID: add the bot to the group, send any message, then check the Worker's real-time logs (Workers & Pages → `larnaapi` → Logs → Begin log stream) — or temporarily log `event.source.groupId` in `handleLineWebhook`.
5. In LINE Developers Console → your channel → **Messaging API** tab, turn on **Use webhook** and set the Webhook URL to `https://larnaapi.<your-subdomain>.workers.dev/api/line/webhook`.
6. Paste the current `_apps-script-reference.gs` into the Orders sheet's actual Apps Script editor (Extensions → Apps Script) and redeploy that Web App (**Manage deployments → edit the existing deployment → New version**, not "New deployment" — that keeps the same `/exec` URL so `SHEETS_URL` doesn't need to change).

### Notes

- The product catalog the bot matches against (`PRODUCT_CATALOG` in `cloudflare-worker.js`) is a hand-copied, condensed version of `js/products.js` (id/name/price only). **If products or prices change, update this list too** — it isn't synced automatically.
- The bot only replies inside the admin group; it doesn't touch customer-facing chats or the website order flow (`/api/order`) at all.
- If Gemini can't match a product name to the menu, that item is dropped from the order and flagged in the note instead of guessing a price.

## 6. Stock/Log/Expenses — merged into the same Apps Script project as Orders

The "Stock", "Log", and "Expenses" tabs all live in the same spreadsheet as "Orders", and their backend logic (previously two separate Apps Script projects — `google-apps-script/Code.gs` for Stock/Log, `_expense-apps-script-reference.gs` for Expenses) has been merged into `_apps-script-reference.gs` — one Apps Script project, one deployment, routed by an `action` parameter. This removes the failure mode where a URL secret (`INVENTORY_API_URL`, `EXPENSES_SHEET_URL`) pointed at a different deployment than `SHEETS_URL` and got mixed up or, in the Expenses case, never got set at all — which is exactly what caused every save on `accounting.html` to fail with "Not configured" until this merge.

`google-apps-script/Code.gs` and `_expense-apps-script-reference.gs` are now superseded and have been removed — their logic lives in `_apps-script-reference.gs`'s Stock/Log and Expenses sections.

### One-time migration steps

1. Open the Orders spreadsheet's Apps Script project (Extensions → Apps Script) and replace its entire contents with the current `_apps-script-reference.gs`.
2. **Project Settings → Script Properties** → add `ADMIN_KEY` = the same value already used as Cloudflare's `INVENTORY_ADMIN_KEY` secret (so that secret doesn't need to change).
3. Make sure the spreadsheet has an **"Expenses"** tab with header row `timestamp | id | type | category | description | amount | date | note` (create it if it doesn't exist yet).
4. Redeploy: **Manage deployments → edit the existing deployment → New version → Deploy**. This keeps the existing `/exec` URL (same one `SHEETS_URL` already points to).
5. Update Cloudflare secrets on the `larnaapi` Worker: `INVENTORY_API_URL` should equal `SHEETS_URL` (`wrangler secret put INVENTORY_API_URL --name larnaapi`); the old `EXPENSES_SHEET_URL` secret is no longer used and can be deleted.
6. Update `js/inventory-config.js`'s `INVENTORY_API_URL` constant (used client-side by `stock.html`/`product.html`/`index.html` to read public stock levels) to that same URL.
7. Smoke test: `?action=stock` should return `{products:[...]}`, `?action=expenses` should return `{expenses:[...]}` (Worker-proxied, needs a PIN session to reach from the browser), a bot-created order should decrement stock, cancelling one should restore it, and saving an expense on `accounting.html` should actually succeed.
