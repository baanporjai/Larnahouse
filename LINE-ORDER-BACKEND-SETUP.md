# Order Backend Setup (Cloudflare Worker + LINE)

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
- I can't deploy this to your Cloudflare account or enter the LINE token for you — these steps need to be done from your own Cloudflare/LINE logins.
