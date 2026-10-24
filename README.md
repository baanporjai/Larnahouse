# Larna House — Frozen Larna Cake

เว็บไซต์และระบบสั่งซื้อของ **Larna House** เค้กไอศกรีมช็อกโกแลตไทยแช่แข็ง ขายผ่านตู้ vending machine ที่ Central Festival เชียงใหม่

## โครงสร้างโปรเจกต์

```
LarnaCake/
├── index.html                    เว็บหน้าหลัก
├── product.html                  หน้ารายละเอียดสินค้า
├── order.html                    ฟอร์มสั่งซื้อ
├── dashboard.html                แดชบอร์ดยอดสั่งซื้อทางเว็บ/LINE (ใช้ภายใน)
├── machine-sales.html            ยอดขายหน้าตู้จริง จากแท็บ "inbox" ที่ Ksher เติมให้ (ใช้ภายใน)
├── css/style.css, js/i18n.js, js/products.js
├── favicon.gif
├── robots.txt, sitemap.xml       สำหรับ SEO
│
├── cloudflare-worker.js          Cloudflare Worker (larnaapi): API ทั้งหมด + รับออเดอร์ → แจ้งเตือนผ่าน LINE
├── larna-data.js                 ชั้นข้อมูลบน Cloudflare D1 (ออเดอร์ สต็อก log รายจ่าย ยอดขายตู้)
├── migrations/                   schema ของ D1 (wrangler d1 migrations apply larnacake --remote)
├── wrangler.larnaapi.jsonc       config ของ Worker larnaapi (ตั้งชื่อนี้โดยตั้งใจ ห้ามใช้ wrangler.jsonc เพราะ Workers Builds ของ larnahouse จะหยิบไป deploy ทับเว็บ) (D1 binding + cron 5 นาที)
├── scripts/test-d1.mjs           ทดสอบชั้นข้อมูล/เส้นทาง Worker แบบออฟไลน์ (node --no-warnings scripts/test-d1.mjs)
└── LINE-ORDER-BACKEND-SETUP.md   คู่มือตั้งค่า LINE Messaging API + Cloudflare Worker
```

## รันเว็บทดสอบในเครื่อง (local)

```bash
npx.cmd serve -p 3301 .
```

แล้วเปิดเบราว์เซอร์ไปที่ `http://localhost:3301`

## ตั้งค่าระบบสั่งซื้อ (LINE + Cloudflare Worker)

ดูขั้นตอนละเอียดใน [`LINE-ORDER-BACKEND-SETUP.md`](./LINE-ORDER-BACKEND-SETUP.md)

## ข้อมูล: Cloudflare D1 (ย้ายจาก Google Sheet เมื่อ 23/10/2569)

ออเดอร์ สต็อก ประวัติสต็อก และรายจ่าย เก็บใน D1 ชื่อ `larnacake` (account yai.taweewoot) หน้าเว็บทุกหน้าอ่านผ่าน Worker ไม่เรียก Google โดยตรง

- **ยอดขายตู้ (Ksher)**: Ksher ยังเติมแท็บ `inbox` ของ Google Sheet อยู่ Worker คัดลอกแถวใหม่/ที่เปลี่ยนเข้า D1 ทุก 5 นาที (cron) และเมื่อกดรีเฟรชในหน้า machine-sales.html (`?fresh=1`) — หน้าเว็บอ่านจาก D1 เสมอ ถ้าชีตล่ม หน้ายังเปิดได้ด้วยข้อมูลล่าสุดที่คัดลอกไว้
- Google Sheet/Apps Script (`_apps-script-reference.gs`) เก็บไว้เป็นต้นทางของยอดขายตู้และเป็นข้อมูลสำรองก่อนย้าย ออเดอร์/สต็อก/รายจ่ายใหม่ไม่ถูกเขียนลงชีตอีกต่อไป
- deploy Worker: `npx wrangler deploy --config wrangler.larnaapi.jsonc` (ตั้ง `CLOUDFLARE_ACCOUNT_ID=255a202b8017897ece0d1e9cd615ca11`)

## อัปโหลดไฟล์ .xlsx ยอดขายตู้ (หน้า machine-sales.html)

ปุ่ม **⬆ อัปโหลด .xlsx** ที่หัวหน้า → เลือก/ลากไฟล์ที่ดาวน์โหลดจาก Ksher (คอลัมน์ Transaction Date, Transaction ID, Ksher Order No, …, Product Name, Dispense Status, Sub Total, Discount, Grand Total; แถว TOTAL ท้ายไฟล์ถูกข้าม)

- เบราว์เซอร์อ่านไฟล์ด้วย SheetJS แล้วส่งแถวไป `POST /api/admin/machine-sales/upload` (ต้องมี PIN token) — `confirm:false` = ตรวจและสรุปให้ดูก่อน ไม่เขียนอะไร, `confirm:true` = นำเข้าจริง
- เทียบรายบิล (Transaction ID): บิลใหม่ = เพิ่ม · ตรงกับที่มีอยู่ = ไม่แตะ · ต่างกัน = แทนที่ทั้งบิล (ไม่ลบบิลที่ไม่อยู่ในไฟล์) ไฟล์ที่มีแถวอ่านไม่ได้ จะไม่นำเข้าเลย
- บิลที่มาจากการอัปโหลดมี `machine_sales.src='upload'` — cron คัดลอกจากชีตทุก 5 นาทีจะไม่ทับบิลเหล่านั้น ประวัติอยู่ในตาราง `machine_sales_uploads`
- migration `0002_machine_sales_upload.sql` · ทดสอบ: `node --no-warnings scripts/test-d1.mjs` และ `node --no-warnings scripts/e2e-upload.mjs` (เบราว์เซอร์ + ไฟล์ Ksher จริง)
