// Shared stock lookup used by index.html and product.html.
// Reads INVENTORY_API_URL from js/inventory-config.js.

let STOCK_DATA = {};
let stockLoaded = false;

async function loadStockData() {
  if (!INVENTORY_API_URL) { stockLoaded = true; return; }
  try {
    const res = await fetch(INVENTORY_API_URL + "?action=stock", { cache: "no-store" });
    const data = await res.json();
    STOCK_DATA = {};
    (data.products || []).forEach(p => { STOCK_DATA[p.id] = p; });
  } catch (err) {
    console.warn("Stock data unavailable:", err);
  }
  stockLoaded = true;
}

function isOutOfStock(id) {
  const s = STOCK_DATA[id];
  return !!s && Number(s.stock) <= 0;
}
