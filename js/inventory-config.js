// Paste the deployed Google Apps Script Web App URL here (ends in /exec).
// Same URL as SHEETS_URL — Stock/Log logic was merged into the Orders
// Apps Script project, see _apps-script-reference.gs.
// Used by stock.html (admin) to read live stock directly.
const INVENTORY_API_URL = "https://script.google.com/macros/s/AKfycbzpRubMt29bX4jR3UpPWpoCOuz6ZejN456uy59pYxQo-fotpJ5wJW6wAbT0HB5ksep4/exec";

// Public stock read for the storefront (index.html/product.html/order.html via
// js/inventory.js) — goes through the larnaapi Worker's cached /api/stock instead of
// hitting Apps Script directly from every visitor's browser (see handlePublicStock in
// cloudflare-worker.js). Storefront pages don't need the raw Apps Script URL at all.
const STOCK_API_URL = "https://larnaapi.yai-taweewoot.workers.dev/api/stock";
