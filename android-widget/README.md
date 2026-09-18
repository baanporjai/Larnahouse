# Larna Cake Widget (Android)

Home-screen widget แสดงปฏิทินจำนวนชิ้นที่ขายได้รายวันจากตู้ Larna Cake (สีเข้ม = ขายดี, ช่องวันนี้ไฮไลต์แยก)
ดึงข้อมูลจาก `cloudflare-worker.js` (Worker ชื่อ `larnaapi`) ตัวเดียวกับ dashboard/machine-sales.html
ผ่าน endpoint ใหม่ `/api/widget/daily-sales-calendar`

โครงสร้าง/วิธีใช้เหมือนกับ widget ของ O'Fresh ทุกประการ (ดู `../../OFresh/android-widget/README.md`
ถ้าเทียบ) ต่างกันแค่ข้อมูล: อันนี้นับ "จำนวนชิ้นเค้ก/คุกกี้" จากชีต `inbox` (Ksher) แทนแก้วน้ำส้มจาก Nayax

## ขั้นตอนติดตั้ง

### 1. ตั้งค่าฝั่ง Worker (ทำครั้งเดียว)

```bash
# สุ่ม token ยาวๆ เอง (ใช้คนละค่ากับของ O'Fresh ก็ได้ ไม่บังคับต้องเหมือนกัน)
openssl rand -hex 32
```

ไม่มี `openssl` บน Windows cmd ปกติ — ใช้ Git Bash แทน (มากับ Git for Windows) หรือถามผู้ช่วยให้สุ่มให้ก็ได้

จากนั้นตั้ง secret บน Worker **`larnaapi`** (Worker ตัวนี้ deploy ผ่านการ copy-paste เข้า Cloudflare
dashboard editor โดยตรง ไม่มีไฟล์ `wrangler.jsonc` — แต่ตั้ง secret ผ่าน wrangler CLI ได้ปกติ):

```bash
wrangler secret put WIDGET_TOKEN --name larnaapi
# แล้ววาง token ที่สุ่มได้ตอนถูกถาม
```

**อย่าลืม deploy โค้ด `cloudflare-worker.js` ที่แก้ไปแล้ว** (มี endpoint `/api/widget/daily-sales-calendar`
ใหม่) — เข้า [Cloudflare dashboard](https://dash.cloudflare.com/) → Workers & Pages → `larnaapi` → เปิด
editor → คัดลอกเนื้อไฟล์ `cloudflare-worker.js` ทั้งไฟล์ไปวางทับ → Deploy (ขั้นตอนเดียวกับที่
`LINE-ORDER-BACKEND-SETUP.md` ใช้มาตลอด)

### 2. ตั้งค่าฝั่งแอป

คัดลอก `widget.secrets.properties.example` เป็น `widget.secrets.properties` (อยู่ที่ root ของ
`android-widget/` โฟลเดอร์นี้ ไฟล์นี้ถูก `.gitignore` ไว้แล้ว) แล้วใส่ค่า:

```properties
WORKER_BASE_URL=https://larnaapi.yai-taweewoot.workers.dev
WIDGET_TOKEN=<ค่าเดียวกับที่ใส่ตอน wrangler secret put ด้านบน>
```

### 3. เปิดโปรเจกต์ด้วย Android Studio

1. เปิด Android Studio → **Open** → เลือกโฟลเดอร์ `android-widget/` นี้ (ของ LarnaCake ไม่ใช่ของ OFresh —
   ถ้าเปิด OFresh ค้างอยู่แล้ว ใช้ **File → Open** เพื่อเปิดเป็นโปรเจกต์ใหม่ หรือปิดอันเก่าก่อนก็ได้)
2. ปล่อยให้ Gradle sync (ครั้งแรกจะดาวน์โหลด Gradle wrapper/SDK components อัตโนมัติ ถ้าถามว่าจะสร้าง
   Gradle wrapper ให้กด Yes)
3. เชื่อมมือถือ Android ผ่าน USB (เปิด USB debugging ไว้แล้วจากตอนติดตั้ง widget ของ OFresh)
4. กด Run ▶ เพื่อติดตั้งแอปลงเครื่อง (ไม่มีหน้าจอให้เปิด เป็นปกติของแอปที่มีแต่ widget)

### 4. เพิ่ม widget ลงโฮมสกรีน

กดค้างที่พื้นที่ว่างบนโฮมสกรีน → **Widgets** → หา **Larna Cake ปฏิทินยอดขาย** → ลากไปวาง

## รีเฟรชข้อมูล

- อัตโนมัติทุก 30 นาที (ค่าต่ำสุดที่ Android รองรับสำหรับ widget)
- แตะที่ widget เพื่อรีเฟรชทันที

## หมายเหตุ

- ตัวเลขนับเฉพาะบิลที่จ่ายเงินสำเร็จ (`status === "paid"`) เหมือน machine-sales.html — บิล pending
  (ลูกค้ากดสั่งแต่จ่ายไม่สำเร็จ) ไม่ถูกนับ
- แอปนี้ไม่ได้ตั้งใจอัป Play Store — build แล้ว sideload ลงเครื่องตัวเองเท่านั้น
- ถ้าเปลี่ยนเครื่องหรือล้างเครื่อง ต้อง build+install ใหม่ (ไม่มี auto-update)
