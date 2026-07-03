# Larna House — Frozen Larna Cake

เว็บไซต์และระบบสั่งซื้อของ **Larna House** เค้กไอศกรีมช็อกโกแลตไทยแช่แข็ง ขายผ่านตู้ vending machine ที่ Central Festival เชียงใหม่

## โครงสร้างโปรเจกต์

```
LarnaCake/
├── index.html                    เว็บหน้าหลัก
├── product.html                  หน้ารายละเอียดสินค้า
├── order.html                    ฟอร์มสั่งซื้อ
├── dashboard.html                แดชบอร์ดยอดขาย (ใช้ภายใน)
├── css/style.css, js/i18n.js, js/products.js
├── favicon.gif
├── robots.txt, sitemap.xml       สำหรับ SEO
│
├── cloudflare-worker.js          Cloudflare Worker: รับออเดอร์ → แจ้งเตือนผ่าน LINE
└── LINE-ORDER-BACKEND-SETUP.md   คู่มือตั้งค่า LINE Messaging API + Cloudflare Worker
```

## รันเว็บทดสอบในเครื่อง (local)

```bash
npx.cmd serve -p 3301 .
```

แล้วเปิดเบราว์เซอร์ไปที่ `http://localhost:3301`

## ตั้งค่าระบบสั่งซื้อ (LINE + Cloudflare Worker)

ดูขั้นตอนละเอียดใน [`LINE-ORDER-BACKEND-SETUP.md`](./LINE-ORDER-BACKEND-SETUP.md)
