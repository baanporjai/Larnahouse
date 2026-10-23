// Stock now lives in Cloudflare D1 behind the larnaapi Worker — no Google Apps Script URL is needed in the browser.

// Public stock read for the storefront (index.html/product.html/order.html via
// js/inventory.js) — goes through the larnaapi Worker's cached /api/stock instead of
// hitting Apps Script directly from every visitor's browser (see handlePublicStock in
// cloudflare-worker.js). Storefront pages don't need the raw Apps Script URL at all.
const STOCK_API_URL = "https://larnaapi.yai-taweewoot.workers.dev/api/stock";
