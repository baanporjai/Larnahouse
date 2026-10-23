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
├── wrangler.jsonc                config ของ Worker larnaapi (D1 binding + cron 5 นาที)
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
- deploy Worker: `npx wrangler deploy` (ตั้ง `CLOUDFLARE_ACCOUNT_ID=255a202b8017897ece0d1e9cd615ca11`)
