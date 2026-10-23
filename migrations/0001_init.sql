-- Larna House data (was the Google Sheet tabs Orders / Stock / Log / Expenses / inbox).
-- Times are unix seconds (UTC); the Worker formats them as Thailand time.

CREATE TABLE orders (
  id        TEXT PRIMARY KEY,
  row_no    INTEGER NOT NULL UNIQUE,      -- continues the old sheet's row numbers; the dashboard sends it as a fallback id
  created_at INTEGER NOT NULL,
  name      TEXT NOT NULL DEFAULT '',
  phone     TEXT NOT NULL DEFAULT '',
  address   TEXT NOT NULL DEFAULT '',
  date      TEXT NOT NULL DEFAULT '-',    -- the date the customer wants the cake, as entered
  items     TEXT NOT NULL DEFAULT '',     -- "ชื่อสินค้า x2, ชื่อสินค้า x1"
  total     REAL NOT NULL DEFAULT 0,
  note      TEXT NOT NULL DEFAULT '-',
  status    TEXT NOT NULL DEFAULT 'รอยืนยัน'
);
CREATE INDEX idx_orders_created ON orders (created_at);
CREATE INDEX idx_orders_name ON orders (name);

CREATE TABLE stock_products (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL DEFAULT '',
  stock        INTEGER NOT NULL DEFAULT 0,
  threshold    INTEGER NOT NULL DEFAULT 0,
  cost         REAL,                       -- never returned by the public stock endpoint
  last_updated INTEGER
);

CREATE TABLE stock_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  ts         INTEGER NOT NULL,
  product_id TEXT NOT NULL,
  old_stock  INTEGER NOT NULL,
  new_stock  INTEGER NOT NULL,
  delta      INTEGER NOT NULL,
  note       TEXT NOT NULL DEFAULT ''
);
CREATE INDEX idx_stock_log_ts ON stock_log (ts);

CREATE TABLE expenses (
  seq         INTEGER PRIMARY KEY AUTOINCREMENT,
  id          TEXT NOT NULL UNIQUE,
  created_at  INTEGER NOT NULL,
  type        TEXT NOT NULL DEFAULT 'opex',   -- cogs | opex
  category    TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  amount      REAL NOT NULL DEFAULT 0,
  date        TEXT NOT NULL DEFAULT '',        -- YYYY-MM-DD
  note        TEXT NOT NULL DEFAULT ''
);

-- Kiosk sales. Ksher still writes these into the sheet's "inbox" tab; the Worker copies them here.
-- One row per product line; a bill with two products has two rows sharing txn_id.
-- Raw columns are untyped on purpose so each value keeps the type Ksher gave it (text or number).
CREATE TABLE machine_sales (
  txn_id          TEXT NOT NULL,
  line_no         INTEGER NOT NULL,
  seq             INTEGER NOT NULL,
  transactiondate,
  transactionid,
  ksherorderno,
  merchantid,
  kioskid,
  kioskname,
  paymentmethod,
  coupon,
  promotion,
  cartenable,
  status,
  productname,
  subtotal,
  discount,
  grandtotal,
  row_hash TEXT NOT NULL,
  PRIMARY KEY (txn_id, line_no)
);
CREATE INDEX idx_machine_sales_date ON machine_sales (transactiondate);

CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
