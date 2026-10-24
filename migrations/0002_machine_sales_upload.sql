-- Kiosk sales can now also be loaded from the .xlsx that Ksher exports (machine-sales.html upload box).
-- src = who wrote the bill: 'sheet' (copied from the Google Sheet inbox) or 'upload' (from an .xlsx).
-- The 5-minute sheet sync never touches a bill that came from an upload, so an uploaded correction is not undone.
ALTER TABLE machine_sales ADD COLUMN src TEXT NOT NULL DEFAULT 'sheet';

-- one row per upload, shown as the history under the upload box
CREATE TABLE machine_sales_uploads (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  ts        INTEGER NOT NULL,
  filename  TEXT NOT NULL DEFAULT '',
  rows_read INTEGER NOT NULL,
  bills     INTEGER NOT NULL,
  added     INTEGER NOT NULL,
  changed   INTEGER NOT NULL,
  unchanged INTEGER NOT NULL,
  date_from TEXT,
  date_to   TEXT
);
