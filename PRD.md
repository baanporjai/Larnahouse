# Product Requirements Document — Larna House (Frozen Larna Cake)

> เอกสารสรุปข้อกำหนดผลิตภัณฑ์ (PRD) ของระบบ Larna House ทั้งหมดที่พัฒนาไปแล้ว
> ครอบคลุมเว็บไซต์ลูกค้า ระบบสั่งซื้อ ระบบหลังบ้าน (แดชบอร์ด/บัญชี/CRM/สต็อก) และบอท AI บน LINE
> ปรับปรุงล่าสุด: 9 สิงหาคม 2026 · เขียนแบบ "ระบบที่สร้างไปแล้ว" (as-built)

---

## 1. ภาพรวมผลิตภัณฑ์ (Overview)

**Larna House / Frozen Larna Cake** คือธุรกิจ **เค้กไอศกรีมช็อกโกแลตไทยแช่แข็ง** ที่ทำจากโกโก้ไทยพรีเมียม
แช่แข็งเก็บได้นานถึง 12 เดือนโดยไม่ใส่วัตถุกันเสีย ทานได้ 2 แบบ (ไอศกรีมเค้กตอนแช่แข็ง หรือรอละลาย 15–20 นาที
ให้เป็นเค้กหน้านิ่ม)

**ช่องทางจำหน่าย:**
- **ตู้ Vending Machine** — ชั้น 4 โซนฟู้ดคอร์ท Central Festival เชียงใหม่
- **สั่งออนไลน์ / เดลิเวอรี** — ผ่านเว็บไซต์ `larnacake.baanporjai.com` ส่งในเขตเมืองเชียงใหม่
- **สั่งผ่านแอดมิน** — สตาฟพิมพ์ออเดอร์เข้ากลุ่ม LINE แล้วบอท AI บันทึกให้อัตโนมัติ

**ปัญหาที่ระบบนี้แก้:**
- ลูกค้าเห็นสินค้า/สต็อกจริง และสั่งซื้อได้เองแบบหลายภาษา (รองรับนักท่องเที่ยว)
- ร้านรับออเดอร์รวมศูนย์ (เว็บ + LINE) พร้อมแจ้งเตือนทันที ไม่ตกหล่น
- เจ้าของร้านเห็นยอดขาย กำไร ลูกค้าประจำ และสต็อก ครบในที่เดียว บนมือถือ

**หลักการออกแบบระบบ:** static site + serverless + Google Sheets เป็นฐานข้อมูล — ต้นทุนต่ำ ดูแลง่าย
ไม่ต้องมีเซิร์ฟเวอร์/ฐานข้อมูลของตัวเอง

---

## 2. เป้าหมายและกลุ่มผู้ใช้ (Goals & Personas)

| Persona | ใครบ้าง | ต้องการอะไร | ใช้ส่วนไหน |
|---|---|---|---|
| **ลูกค้าปลายทาง** | ผู้ซื้อหน้าตู้ / สั่งเดลิเวอรี / นักท่องเที่ยว | ดูสินค้า ราคา สต็อก หลายภาษา แล้วสั่งง่าย | เว็บไซต์ลูกค้า (`index/product/order/story`) |
| **สตาฟ / เจ้าของร้าน (หน้างาน)** | คนรับออเดอร์ แพ็ก จัดส่ง | รับแจ้งเตือนออเดอร์ทันที บันทึกออเดอร์เร็ว | LINE (แจ้งเตือน + บอท AI) |
| **แอดมิน / เจ้าของร้าน (หลังบ้าน)** | ผู้ดูแลยอดขาย บัญชี สต็อก | เห็นภาพรวมธุรกิจ แก้ออเดอร์ ดูกำไร จัดการสต็อก | Admin PWA (`dashboard/accounting/customers/stock`) |

**เป้าหมายหลักของระบบ:**
1. เพิ่มยอดขายผ่านช่องทางออนไลน์และตู้ ด้วยประสบการณ์ซื้อที่ลื่นไหลและหลายภาษา
2. ลดงานซ้ำซ้อน — ออเดอร์ทุกช่องทางไหลเข้าที่เดียว ตัดสต็อกอัตโนมัติ
3. ให้เจ้าของร้านตัดสินใจด้วยข้อมูล — ยอดขาย กำไรสุทธิ ลูกค้าประจำ รสขายดี

---

## 3. ขอบเขตและสถาปัตยกรรมระบบ (System Scope)

```
                    ┌────────────────────────────┐
   ลูกค้า ────────► │  เว็บไซต์ลูกค้า (static)      │
                    │  Cloudflare Pages            │
                    │  index/product/order/story   │
                    └──────────────┬───────────────┘
                                   │ POST /api/order
                                   ▼
   แอดมิน (PWA) ──► ┌────────────────────────────┐ ──► LINE Messaging API
   dashboard        │  Cloudflare Worker          │      (แจ้งเตือน + บอท)
   accounting       │  larnaapi.*.workers.dev     │
   customers  ◄──── │  - order push               │ ──► Google Gemini
   stock            │  - admin API (PIN/session)  │      (2.5-flash, แปลงออเดอร์)
                    │  - LINE webhook (บอท AI)     │
                    └──────────────┬───────────────┘
                                   │ action=...
                                   ▼
                    ┌────────────────────────────┐
                    │  Google Apps Script + Sheets│
                    │  1 สเปรดชีต 4 แท็บ           │
                    │  Orders / Stock / Log / Expenses
                    └────────────────────────────┘
```

**องค์ประกอบ:**
- **Frontend (static):** HTML/CSS/JS ล้วน โฮสต์บน Cloudflare Pages
- **Backend 1 — Cloudflare Worker:** ประตูหลักของ API ทั้งหมด (รับออเดอร์, admin API, บอท LINE), เก็บ secret ฝั่งเซิร์ฟเวอร์
- **Backend 2 — Google Apps Script + Google Sheets:** ฐานข้อมูลจริง (ไม่มี DB แยก)
- **Integrations:** LINE Messaging API (แจ้งเตือน + บอท), Google Gemini `gemini-2.5-flash` (แปลงข้อความเป็นออเดอร์)

---

## 4. รายการสินค้า (Product Catalog)

สินค้าทั้งหมด **12 รายการ** (นิยามใน `js/products.js` มีข้อมูลครบ 4 ภาษา) น้ำหนักชิ้นละ ~40–60 g

### เค้กแช่แข็ง (Frozen Cakes)

| id | ชื่อ | ราคา | หมายเหตุ |
|---|---|---|---|
| `mini-larna` | มินิ ลาร์นา เค้ก (ออริจินัล) | 60฿ | ขายดีที่สุด · Popular Vote 2020 |
| `mini-white` | มินิ ไวท์ ลาร์นา เค้ก | 60฿ | คลาสสิก ไวท์ช็อกโกแลต |
| `mini-matcha` | มินิ มัทฉะ ลาร์นา เค้ก | 60฿ | มัทฉะแท้ |
| `mini-thai-tea` | มินิ ชาไทย ลาร์นา เค้ก | 60฿ | มีวิดีโอประกอบ |
| `mini-espresso` | มินิ เอสเพรสโซ่ ลาร์นา เค้ก | 60฿ | รสกาแฟ |
| `mini-mango` | มินิ มะม่วง ลาร์นา เค้ก | 80฿ | ลิมิเต็ดซีซัน · มะม่วงน้ำดอกไม้ |
| `mini-dubai-pistachio` | มินิ ดูไบ ลาร์นา เค้ก พิสตาชิโอ | 80฿ | ไวรัล · พิสตาชิโอ + คูนาฟ่า |
| `mini-crispy-larna` | ครันชี่ ลาร์นา เค้ก | 80฿ | Superior Taste Award 2024 · มีข้อมูล layers/tips/FAQ |

### คุกกี้ (Cookies — ไม่แช่แข็ง)

| id | ชื่อ | ราคา | หมายเหตุ |
|---|---|---|---|
| `marshmallow-cookie` | คุกกี้มาร์ชเมลโล่ ลาร์นา | 60฿ | ช็อกโกแลตจากน่าน |
| `marshmallow-cookie-nibs` | คุกกี้มาร์ชเมลโล่คาเคานิบส์ | 60฿ | มีข้อมูล benefits/FAQ |
| `marshmallow-cookie-almond` | คุกกี้มาร์ชเมลโล่อัลมอนด์ | 60฿ | อัลมอนด์คั่ว |
| `dubai-pistachio-cookie` | คุกกี้ดูไบ ลาร์นา ไส้พิสตาชิโอ | 80฿ | คูนาฟ่า + พิสตาชิโอ I'M NUTS |

**นโยบายข้อมูลสินค้า:** แต่ละสินค้าเก็บ ชื่อ/คำโปรย/รายละเอียด/วิธีเก็บรักษา ครบ **4 ภาษา** (ไทย, อังกฤษ, จีน 中文, เกาหลี 한국어)
บางสินค้ามีฟิลด์เสริม: `video`, `layers` (ชั้นของเค้ก), `benefits` (ประโยชน์), `productFaq`, `enjoyTips`

---

## 5. ข้อกำหนดเชิงฟังก์ชัน (Functional Requirements)

### 5.1 เว็บไซต์ลูกค้า
- **`index.html`** — แลนดิ้งเพจ: hero, รางวัล (awards), ร้านค้า/การ์ดสินค้าพร้อมสต็อกสด, จุดเด่น (why),
  วิธีทาน (howto), เรื่องราวแบรนด์, รีวิว, ข้อมูลตู้ vending, FAQ, ช่องทางติดต่อ
- **`product.html`** — หน้ารายละเอียดสินค้า (โหลดตาม id) รองรับการแสดง layers/benefits/FAQ เฉพาะสินค้า
- **`story.html`** — ที่มาแบรนด์ + ไทม์ไลน์ (จากสูตรครอบครัวสู่เค้กแช่แข็งได้ 1 ปี)
- **หลายภาษา (i18n):** `js/i18n.js` มี ~240 คีย์ × 4 ภาษา สลับภาษาได้ทันทีทั้งหน้า (ไทย/EN/中文/한국어)
- **สต็อกสด:** `js/inventory.js` ดึง `?action=stock` มาแสดงบนการ์ดสินค้า (`isOutOfStock`, `availableStock`);
  ถ้าดึงไม่ได้จะถือว่าไม่จำกัด (graceful degrade ไม่พังหน้าเว็บ)
- **เมนูสำหรับพิมพ์/แชร์ LINE:** `larna-menu-all.html` (รวม 12 สินค้า), `larna-cakes-real.html`, `larna-cookies-real.html`
  ใช้รูปสินค้าจริง (local) มีปุ่มดาวน์โหลดเป็น PNG

### 5.2 ระบบสั่งซื้อและตะกร้า (`order.html`)
- ตะกร้าเก็บใน `localStorage` (คีย์ `larna_cart`) — ค้างข้ามหน้าได้
- **Clamp จำนวนตามสต็อกจริง** ทันทีที่ข้อมูลสต็อกโหลดเสร็จ (สินค้าหมด = ลบออกจากตะกร้า, เกินสต็อก = ลดลงเท่าที่มี)
- เลือกรูปแบบรับสินค้า: **รับเอง (pickup)** หรือ **จัดส่ง (delivery)** พร้อมที่อยู่
- **ส่งฟรี** ในเขตเมืองเชียงใหม่เมื่อสั่ง 4 ชิ้นขึ้นไป
- ส่งออเดอร์ → `POST /api/order` ที่ Cloudflare Worker → แสดงหน้ายืนยัน "ส่งออเดอร์แล้ว"

### 5.3 แจ้งเตือนออเดอร์ผ่าน LINE
- Worker รับออเดอร์ → **push ข้อความไป LINE** ของร้าน/กลุ่มสตาฟ (`LINE_TARGET_ID`) ผ่าน LINE Messaging API
- ข้อความจัดรูปแบบภาษาไทย: รายการสินค้า, ยอดรวม, รับเอง/🚚 จัดส่ง + ที่อยู่, ชื่อ/เบอร์/วันที่/หมายเหตุ
- ถ้า push ไม่สำเร็จ → ตอบ error (502) เพื่อไม่ให้ออเดอร์หายเงียบ
- ควบคู่กับการบันทึกลง Google Sheets (สถานะเริ่มต้น "รอยืนยัน") และตัดสต็อก

### 5.4 บอท AI สั่งออเดอร์บน LINE (กลุ่มแอดมิน)
- แอดมินพิมพ์ข้อความอิสระในกลุ่ม `Larnacake_admin` (ที่ whitelist ไว้) → บอทแปลงเป็นออเดอร์ให้อัตโนมัติ
- ขั้นตอน: ตรวจลายเซ็น LINE (HMAC-SHA256) → ดึงประวัติลูกค้าเติมเบอร์/ที่อยู่ →
  **Gemini `gemini-2.5-flash`** แปลงเป็น JSON (เลือก id สินค้าจาก catalog เท่านั้น **ห้าม AI คิดราคาเอง**) →
  จับคู่สินค้ากับ catalog จริง → คำนวณยอด → บันทึกลงชีต → ตัดสต็อก →
  ตอบสรุปออเดอร์ + ปุ่มด่วน **"↩️ ยกเลิกออเดอร์นี้"**
- ประหยัด token ด้วยการส่งเฉพาะลูกค้าที่เกี่ยวข้อง ~8 คนให้ AI (`prefilterCustomers`)
- ข้อความที่ไม่ใช่ออเดอร์ (`isOrder:false`) จะถูกเมินเงียบ; ยกเลิกผ่านปุ่ม = คืนสต็อก

### 5.5 แดชบอร์ดยอดขาย (`dashboard.html`)
- รายการปฏิบัติงาน: 🚚 ส่งวันนี้, 📦 ส่งพรุ่งนี้, ⏰ ค้าง/เกินกำหนด (เรียงเก่าสุดก่อน, ค้นหาได้)
- การ์ด KPI (คลิกดูรายละเอียด): ยอดขายรวม, จำนวนออเดอร์, ส่งวันนี้, เฉลี่ยต่อออเดอร์, ยอด 30 วันล่าสุด
- กราฟ (Chart.js): ยอดขายรายวัน 14 วัน, รสขายดี Top 7, เทรนด์รายเดือน, พื้นที่จัดส่งยอดนิยม
- **แก้สถานะออเดอร์** (รอยืนยัน → ยืนยันแล้ว → แพ็กแล้ว → จัดส่งแล้ว / ยกเลิก) และ **แก้ออเดอร์** เต็มรูปแบบ

### 5.6 บัญชี P&L (`accounting.html`)
- รวมรายรับจากออเดอร์ + รายจ่ายที่บันทึกเอง; รายจ่ายแบ่งเป็น **COGS (ต้นทุนขาย)** และ **OPEX (รายจ่ายดำเนินงาน)** พร้อมหมวดหมู่ไทย
- KPI: รายรับ, COGS, **กำไรขั้นต้น** (รายรับ−COGS), **กำไรสุทธิ** (ขั้นต้น−OPEX), **มาร์จินสุทธิ %**
- กรองรายเดือน, กราฟแท่ง+เส้น (รายรับ/COGS/OPEX + เส้นกำไรสุทธิ), โดนัทแยกหมวด COGS/OPEX
- เพิ่ม/แก้/ลบรายจ่ายได้ทันที

### 5.7 CRM ลูกค้า (`customers.html`)
- จัดกลุ่มออเดอร์ตามชื่อลูกค้า → จำนวนครั้ง, ยอดรวม, จำนวนชิ้น, เบอร์, ออเดอร์ล่าสุด
- ป้าย **"ลูกค้าประจำ"** + ถ้วยรางวัล, ประวัติรายคน, กรองรายเดือน
- โมดัลวิเคราะห์ลูกค้าประจำ: สัดส่วนลูกค้าซ้ำ (%) และสัดส่วนรายได้จากลูกค้าซ้ำ (%)

### 5.8 จัดการสต็อก (`stock.html`)
- แสดง/แก้สต็อกสินค้าแต่ละรายการ (ปรับทีละ delta หรือตั้งค่าตรง), มีค่า threshold แจ้งเตือนของใกล้หมด
- **ซ่อนคอลัมน์ต้นทุน/กำไร** ในหน้านี้ (แยกสิทธิ์การมองเห็น)
- ทุกการเปลี่ยนสต็อกบันทึก Log (audit trail)

### 5.9 Admin PWA และการยืนยันตัวตน
- 4 หน้าแอดมิน (dashboard/accounting/customers/stock) เป็น **PWA ติดตั้งบน Android ได้** (`admin-manifest.json`)
- `admin-sw.js` เป็น service worker แบบ no-cache (มีไว้เพื่อให้ "เพิ่มลงหน้าจอโฮม" ได้เท่านั้น — ข้อมูลต้องสดเสมอ)
- **ยืนยันตัวตนด้วย PIN:** ทุกหน้ามี overlay กรอก PIN → `POST /api/admin/login` → Worker ออก token
  เซ็นด้วย HMAC (อายุ 12 ชม.) เก็บใน `sessionStorage` และแนบเป็น `Authorization: Bearer` ทุกคำขอ
- `_redirects` ทำ URL สั้น: `/admin`, `/admin/customers`, `/admin/accounting`

---

## 6. สถาปัตยกรรมทางเทคนิค (Technical Architecture)

### 6.1 Cloudflare Worker — endpoints (`cloudflare-worker.js`)
| Endpoint | ใช้ทำอะไร |
|---|---|
| `POST /api/order` | รับออเดอร์เว็บ → push LINE + log Sheets + ตัดสต็อก |
| `POST /api/admin/login` | ตรวจ PIN → คืน session token |
| `GET /api/admin/orders` | ดึงออเดอร์ทั้งหมด (แดชบอร์ด) |
| `POST /api/admin/update-status` | แก้สถานะออเดอร์ |
| `POST /api/admin/update-order` | แก้รายละเอียดออเดอร์ |
| `GET / POST /api/admin/expenses` | อ่าน / เพิ่ม-แก้-ลบ รายจ่าย |
| `GET /api/admin/stock-log` | ประวัติการเปลี่ยนสต็อก |
| `GET /api/admin/stock-cost` | สต็อก + ต้นทุน (เฉพาะแอดมิน) |
| `POST /api/admin/stock-update` | ปรับ/ตั้งค่าสต็อก |
| `POST /api/line/webhook` | รับ event จาก LINE → บอท AI |

### 6.2 Google Apps Script — actions (`_apps-script-reference.gs`)
- **GET:** (ว่าง)=รายการออเดอร์, `stock`=สต็อกสาธารณะ (ไม่รวมต้นทุน), `stockAdmin`=รวมต้นทุน (ต้องมี key),
  `log`=ประวัติสต็อก (key), `expenses`=รายจ่าย
- **POST:** `new_order`, `update_status`, `update_order`, `adjustStock`/`setStock` (key),
  `expense_add`/`expense_update`/`expense_delete`

### 6.3 โครงสร้างข้อมูล — 1 สเปรดชีต 4 แท็บ (ไม่มี DB)
| แท็บ | คอลัมน์หลัก |
|---|---|
| **Orders** | timestamp, name, phone, address, date, items, total, note, status, id |
| **Stock** | id, name, stock, threshold, lastUpdated, cost |
| **Log** | timestamp, id, oldStock, newStock, delta, note |
| **Expenses** | timestamp, id, type (cogs/opex), category, description, amount, date, note |

- **การตัดสต็อก:** `adjustStock_()` อ่าน-แก้-เขียน ภายใต้ `LockService` (10 วินาที) กัน race condition เมื่อมีออเดอร์พร้อมกัน; ทุกครั้งบันทึก Log
- **timestamp:** เก็บเป็น `Date` จริง แปลงเป็นปี พ.ศ. (+543) ตอน "อ่าน" เท่านั้น เพื่อกัน Sheets แปลปีผิด

### 6.4 ความปลอดภัยและ Secrets
- Worker เก็บ **PIN, Sheet URL, token ต่างๆ ไว้ฝั่งเซิร์ฟเวอร์** — ไม่หลุดไป client
- ตรวจลายเซ็น LINE webhook ทุกครั้ง (กันปลอม event)
- `ADMIN_KEY` ของ Apps Script ป้องกันเฉพาะ action ที่แตะสต็อก/ต้นทุน/log; ส่วนออเดอร์/รายจ่าย Worker ตรวจ PIN ก่อน proxy
- Secret ที่ต้องตั้งใน Worker: `LINE_CHANNEL_ACCESS_TOKEN`, `LINE_TARGET_ID`, `SHEETS_URL`, `ADMIN_PIN`,
  `SESSION_SECRET`, `INVENTORY_ADMIN_KEY`, `LINE_CHANNEL_SECRET`, `GEMINI_API_KEY`

---

## 7. ข้อกำหนดที่ไม่ใช่ฟังก์ชัน (Non-functional Requirements)

- **ประสิทธิภาพ/ต้นทุน:** static site + serverless (Cloudflare) + Google Sheets → แทบไม่มีค่าใช้จ่ายคงที่ สเกลตามการใช้งาน
- **ความทนทาน (resilience):** ถ้า Sheets/สต็อกล่ม เว็บยังแสดงผลได้ (graceful degrade); การบันทึก Sheets เป็น non-fatal
- **หลายภาษา:** รองรับ 4 ภาษาเต็มรูปแบบทั้งเนื้อหาและสินค้า
- **ความปลอดภัย:** secret ไม่หลุด client, session มีอายุจำกัด, ตรวจลายเซ็น webhook
- **การติดตั้ง:** แอดมินใช้งานเป็นแอปบนมือถือ (PWA) ได้
- **SEO:** มี `robots.txt`, `sitemap.xml`, meta หลายภาษา

---

## 8. ข้อจำกัดที่รู้อยู่และแนวทางพัฒนาต่อ (Known Limitations & Next Steps)

1. **Catalog sync ด้วยมือ:** `PRODUCT_CATALOG` ใน Worker และ `INVENTORY_API_URL` sync กับ `js/products.js`/Apps Script
   ด้วยมือ — เปลี่ยนราคา/เพิ่มสินค้าต้องแก้หลายที่ → ควรทำแหล่งข้อมูลสินค้าเดียว (single source of truth)
2. **การคืนสต็อกฝั่งแดชบอร์ด:** ยกเลิกออเดอร์จากแดชบอร์ด (สถานะ → "ยกเลิก") **ยังไม่คืนสต็อกอัตโนมัติ**
   (มีเฉพาะ path ปุ่มยกเลิกของบอท LINE) → ควรทำให้คืนสต็อกทั้งสองทาง
3. **บอท AI ไม่มีขั้นยืนยัน:** ออเดอร์จากบอทบันทึกทันที แก้ที่ผิดผ่านปุ่มยกเลิกหรือแดชบอร์ด → อาจเพิ่มขั้นยืนยันก่อนบันทึก
4. **ข้อควรพิจารณาเพิ่มเติม:** ระบบชำระเงินออนไลน์, การแจ้งเตือนของใกล้หมดสต็อกอัตโนมัติ, สิทธิ์ผู้ใช้หลายระดับ

---

## 9. ภาคผนวก (Appendix)

### ไฟล์สำคัญ
| ไฟล์ | หน้าที่ |
|---|---|
| `index.html` / `product.html` / `story.html` / `order.html` | เว็บไซต์ลูกค้า |
| `larna-menu-all.html` / `larna-cakes-real.html` / `larna-cookies-real.html` | เมนูพิมพ์/แชร์ |
| `js/products.js` | แคตตาล็อกสินค้า 12 รายการ (4 ภาษา) |
| `js/i18n.js` | ข้อความหลายภาษา (~240 คีย์) |
| `js/inventory.js` / `js/inventory-config.js` | อ่านสต็อกสดฝั่งลูกค้า |
| `dashboard.html` / `accounting.html` / `customers.html` / `stock.html` | แดชบอร์ดหลังบ้าน (Admin PWA) |
| `admin-manifest.json` / `admin-sw.js` | ตั้งค่า PWA แอดมิน |
| `cloudflare-worker.js` | API หลัก: order push, admin API, บอท LINE AI |
| `_apps-script-reference.gs` | โค้ดอ้างอิง Apps Script (Orders/Stock/Log/Expenses) |
| `LINE-ORDER-BACKEND-SETUP.md` | คู่มือ deploy Worker + LINE |
| `_redirects` / `robots.txt` / `sitemap.xml` | routing (Cloudflare Pages) / SEO |

### ลิงก์/ทรัพยากร
- โดเมนเว็บลูกค้า: `larnacake.baanporjai.com`
- Worker: `larnaapi.yai-taweewoot.workers.dev`
- คู่มือตั้งค่า backend: ดู `LINE-ORDER-BACKEND-SETUP.md`
