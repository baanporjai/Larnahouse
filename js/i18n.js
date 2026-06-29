/* ===== Frozen Larna Cake — UI Translations (TH / EN / ZH / KO ) ===== */

const LANGS = ["th", "en", "zh", "ko"];
const LANG_LABEL = { th: "ไทย", en: "EN", zh: "中文", ko: "한국어" };

const I18N = {
  nav_shop:        { th: "สินค้า", en: "Shop", zh: "商品", ko: "제품" },
  nav_about:       { th: "เกี่ยวกับเรา", en: "About", zh: "品牌故事", ko: "브랜드 소개" },
  nav_faq:         { th: "คำถามที่พบบ่อย", en: "FAQ", zh: "常见问题", ko: "자주 묻는 질문" },
  nav_vending:     { th: "หาตู้ใกล้คุณ", en: "Find a Machine", zh: "查找售货机", ko: "자판기 찾기" },
  nav_contact:     { th: "ติดต่อเรา", en: "Contact", zh: "联系我们", ko: "문의하기" },

  hero_award:      { th: "ผู้ชนะ Popular Vote · Innovative House Awards 2020", en: "Popular Vote Winner · Innovative House Awards 2020", zh: "Innovative House Awards 2020 人气大奖", ko: "Innovative House Awards 2020 인기상 수상" },
  hero_title_pre:  { th: "เค้กไอศกรีมช็อกโกแลตไทย", en: "Thai Chocolate", zh: "泰式巧克力", ko: "태국 초콜릿" },
  hero_title_em:   { th: "แช่แข็ง สดใหม่ ทุกเวลา", en: "Ice Cream Cake. Frozen. Fresh. Anytime.", zh: "冰淇淋蛋糕。冷冻保鲜，随时享用。", ko: "아이스크림 케이크. 냉동. 신선함. 언제든지." },
  hero_lead:       { th: "เค้กช็อกโกแลตหน้านิ่มต้นตำรับจาก Larna House คัดสรรจากโกโก้ไทยพรีเมียม แช่แข็งได้นานถึง 12 เดือนโดยไม่ใส่วัตถุกันเสีย พร้อมเสิร์ฟทุกที่ ทุกเวลา ผ่านตู้ขายอัตโนมัติ", en: "The original soft-fudge chocolate cake from Larna House — crafted from premium Thai cacao, frozen for up to 12 months with zero preservatives. Ready whenever you are, straight from the vending machine.", zh: "源自Larna House的经典软心巧克力蛋糕，采用优质泰国可可制作，零防腐剂，可冷冻保存长达12个月。随时随地，自助售货机即取即享。", ko: "Larna House의 오리지널 소프트 퍼지 초콜릿 케이크. 프리미엄 태국 카카오로 만들었으며 보존제 없이 최대 12개월 냉동 보관이 가능합니다. 자판기에서 언제든 바로 즐기세요." },
  hero_cta_shop:   { th: "ดูสินค้าทั้งหมด", en: "Shop the Flavors", zh: "查看全部口味", ko: "전체 맛 보기" },
  hero_cta_machine:{ th: "หาตู้ใกล้คุณ", en: "Find a Vending Machine", zh: "查找售货机位置", ko: "자판기 위치 찾기" },
  stat_flavors:    { th: "รสชาติให้เลือก", en: "Flavors to Choose", zh: "种口味可选", ko: "가지 맛 선택 가능" },
  stat_shelf:      { th: "เดือน อายุการเก็บแช่แข็ง", en: "Mo. Frozen Shelf Life", zh: "个月冷冻保鲜期", ko: "개월 냉동 보관" },
  stat_serve:      { th: "กรัม ต่อชิ้น พอดีคำ", en: "g Perfect Single Serve", zh: "克 一人份装", ko: "g 1인분 사이즈" },

  vending_strip:   { th: "ซื้อง่ายผ่านตู้ vending machine — เปิดตู้ หยอดเหรียญ พร้อมทาน ไม่ต้องรอ", en: "Available now in vending machines — open, pay, enjoy. No waiting required.", zh: "现已上架自助售货机 — 选购、付款、即享，无需等待。", ko: "지금 자판기에서 만나보세요 — 선택, 결제, 바로 즐기기. 기다림 없이!" },

  shop_eyebrow:    { th: "รสชาติที่มีให้เลือก", en: "Flavor Lineup", zh: "口味系列", ko: "플레이버 라인업" },
  shop_title:      { th: "8 รสชาติ บนฐานบราวนี่รางวัล", en: "8 Flavors. One Award-Winning Base.", zh: "8种口味，同一获奖底层", ko: "8가지 맛, 하나의 수상작 베이스" },
  shop_sub:        { th: "จากช็อกโกแลตคลาสสิกไปจนถึงมะม่วงเขตร้อนและดูไบสุดไวรัล ทุกรสชาติสร้างจากฐานบราวนี่รางวัลของเรา", en: "From classic dark chocolate to tropical mango and the viral Dubai — every flavor is crafted on our award-winning brownie base.", zh: "从经典黑巧克力到热带芒果，再到风靡全网的迪拜口味——每一款都以我们获奖的布朗尼为基底制作。", ko: "클래식 다크 초콜릿부터 트로피컬 망고, 화제의 두바이 맛까지 — 모든 플레이버는 수상작 브라우니 베이스 위에 만들어집니다." },
  view_detail:     { th: "ดูรายละเอียด", en: "View Details", zh: "查看详情", ko: "자세히 보기" },

  why_eyebrow:     { th: "ทำไมต้อง Frozen Larna", en: "Why Frozen Larna", zh: "为什么选择 Frozen Larna", ko: "왜 Frozen Larna인가" },
  why_title:       { th: "ไม่ต้องเลือกระหว่างความอร่อยกับอายุการเก็บ", en: "You Shouldn't Have to Choose Between Taste & Shelf Life.", zh: "美味与保鲜，不必只能选一个。", ko: "맛과 보관 기간, 둘 다 포기하지 마세요." },
  why_sub:         { th: "Frozen Larna Cake มอบทั้งสองอย่างให้คุณ ในกระปุกเดียว", en: "Frozen Larna Cake gives you both — in one perfect little tin.", zh: "Frozen Larna Cake 让你两者兼得——一个小铁盒装下所有美味。", ko: "Frozen Larna Cake는 작은 틴 케이스 하나에 두 가지를 모두 담았습니다." },
  feat1_h:         { th: "เก็บแช่แข็งได้นาน 12 เดือน", en: "12-Month Frozen Shelf Life", zh: "12个月冷冻保鲜期", ko: "12개월 냉동 보관" },
  feat1_p:         { th: "เทคโนโลยีถนอมอาหารตามธรรมชาติ ไม่ใส่วัตถุกันเสีย ยังคงนุ่มฟัดจ์เหมือนเพิ่งทำใหม่", en: "Natural preservation technology. No preservatives. Still soft and fudgy straight from the freezer.", zh: "天然保鲜技术，不含防腐剂，从冷冻库取出依然柔软绵密。", ko: "천연 보존 기술로 보존제 없이도 냉동고에서 꺼내자마자 부드럽고 퍼지한 식감을 유지합니다." },
  feat2_h:         { th: "ฐานโกโก้ไทยพรีเมียม", en: "Premium Thai Cacao Base", zh: "优质泰国可可基底", ko: "프리미엄 태국 카카오 베이스" },
  feat2_p:         { th: "คัดสรรจากเกษตรกรไทย ทุกคำที่ทานช่วยสนับสนุนอุตสาหกรรมช็อกโกแลตท้องถิ่นอย่างยั่งยืน", en: "Sourced from Thai cacao farmers. Every bite supports a sustainable local chocolate industry.", zh: "采购自泰国可可农户，每一口都在支持可持续的本地巧克力产业。", ko: "태국 카카오 농가에서 공급받습니다. 한 입 한 입이 지속 가능한 현지 초콜릿 산업을 지원합니다." },
  feat3_h:         { th: "รางวัล Superior Taste Award 2024", en: "Superior Taste Award 2024", zh: "2024年Superior Taste Award", ko: "2024 Superior Taste Award" },
  feat3_p:         { th: "ได้รับการยอมรับจาก International Taste Institute กรุงบรัสเซลส์ หนึ่งในรางวัลคุณภาพอาหารที่ทรงเกียรติที่สุดของโลก", en: "Recognized by the International Taste Institute in Brussels — one of the world's most prestigious food quality awards.", zh: "获布鲁塞尔国际美味协会认证——全球最具声望的食品品质奖项之一。", ko: "벨기에 브뤼셀의 International Taste Institute가 인정한, 세계에서 가장 권위 있는 식품 품질 어워드 중 하나입니다." },
  feat4_h:         { th: "ขนาดพอดีคำ พร้อมช้อนในกล่อง", en: "Single Serve. Spoon Included.", zh: "一人份装，附赠勺子", ko: "1인분 사이즈, 스푼 포함" },
  feat4_p:         { th: "80 กรัมในกระปุกฟอยล์พรีเมียมพร้อมช้อน เปิดแล้วทานได้เลย ไม่ต้องเตรียม ไม่เลอะเทอะ", en: "60–80g in a premium foil tin with spoon inside. Open and eat. No prep, no mess, no compromise.", zh: "60-80克装在精致铝箔罐中，内附勺子，开盖即食，无需准备，干净便捷。", ko: "60~80g 프리미엄 포일 틴에 스푼이 함께 들어 있어 바로 열어서 드실 수 있습니다. 준비도, 번거로움도 없습니다." },

  cert_halal:      { th: "ฮาลาล", en: "Halal Certified", zh: "清真认证", ko: "할랄 인증" },
  cert_ghp:        { th: "GHP", en: "GHP Certified", zh: "GHP认证", ko: "GHP 인증" },
  cert_haccp:      { th: "HACCP", en: "HACCP Certified", zh: "HACCP认证", ko: "HACCP 인증" },
  cert_nopreserv:  { th: "ไม่ใส่วัตถุกันเสีย", en: "No Preservatives", zh: "不含防腐剂", ko: "보존제 무첨가" },

  nutri_eyebrow:   { th: "โภชนาการ", en: "Nutrition", zh: "营养成分", ko: "영양 정보" },
  nutri_title:     { th: "ข้อมูลโภชนาการ ต่อหนึ่งหน่วยบริโภค (60 ก.)", en: "Nutrition Facts · Per Serving (60 g)", zh: "营养成分 · 每份（60克）", ko: "영양 정보 · 1회 제공량 (60g)" },
  nutri_flavor:    { th: "รสชาติ", en: "Flavor", zh: "口味", ko: "맛" },
  nutri_energy:    { th: "พลังงาน", en: "Energy", zh: "热量", ko: "열량" },
  nutri_fat:       { th: "ไขมัน", en: "Fat", zh: "脂肪", ko: "지방" },
  nutri_sugar:     { th: "น้ำตาล", en: "Sugar", zh: "糖", ko: "당류" },
  nutri_note:      { th: "คำนวณจากสูตรจริง · ค่าอาจแปรผัน ±10% · ไม่ใส่วัตถุกันเสีย · โกโก้ไทย 100%", en: "Calculated from actual recipe · Values may vary ±10% · No preservatives · 100% Thai cacao", zh: "数据来源于实际配方 · 数值可能有±10%误差 · 不含防腐剂 · 100%泰国可可", ko: "실제 레시피 기준 산출 · 수치는 ±10% 오차 가능 · 보존제 무첨가 · 100% 태국 카카오" },

  story_eyebrow:   { th: "เรื่องราวของเรา", en: "Our Story", zh: "我们的故事", ko: "브랜드 스토리" },
  story_title:     { th: "เริ่มต้นจากครัวบ้านเรา ได้รับรางวัลระดับโลก", en: "Started in a Home Kitchen. Awarded by the World.", zh: "源自家庭厨房，获世界级认可", ko: "가정의 부엌에서 시작해, 세계가 인정한 맛" },
  story_quote:     { th: "Larna House เริ่มต้นจากคุณแม่ของผู้ก่อตั้ง คนรักการอบเค้กที่ทำเค้กช็อกโกแลตให้ครอบครัวและเพื่อนในทุกโอกาส สำหรับเธอ เค้กที่ดีไม่ใช่แค่เรื่องของรสชาติ แต่เป็นความรู้สึก สิ่งที่ส่งต่อให้กับคนที่ต้องการมัน", en: "Larna House began with our founder's mother — a passionate home baker who made chocolate cake for family and friends at every occasion. For her, a good cake wasn't just about taste. It was a feeling. Something you pass on to someone who needs it.", zh: "Larna House源于创始人的母亲——一位热爱烘焙的家庭主厨，在每个特别的日子为家人朋友制作巧克力蛋糕。对她而言，一块好蛋糕不仅是美味，更是一种心意，一份传递给需要它的人的温暖。", ko: "Larna House는 창업자의 어머니에게서 시작되었습니다. 모든 특별한 순간마다 가족과 친구를 위해 초콜릿 케이크를 만들던 열정적인 홈베이커였죠. 그녀에게 좋은 케이크란 맛뿐만 아니라 하나의 감정이었습니다. 필요한 누군가에게 전하는 따뜻한 마음이었습니다." },
  story_p:         { th: "วันนี้ เราใช้เวลาหลายปีในการพัฒนาเค้กให้นุ่ม เข้มข้น และไม่ใส่วัตถุกันเสีย เพื่อส่งความอบอุ่นจากครัวของเราไปถึงคุณ ไม่ว่าคุณจะอยู่ที่ไหน", en: "Today, we've spent years perfecting that cake — keeping it soft, rich, and preservative-free — so we can send that warmth from our kitchen to yours, anywhere in the world.", zh: "如今，我们已花费多年时间不断打磨这款蛋糕——让它保持柔软、浓郁且不含防腐剂——只为将这份来自我们厨房的温暖，送到世界各地的你手中。", ko: "오늘날 우리는 그 케이크를 더 부드럽고 풍부하면서도 보존제 없이 완성하기 위해 수년간 노력해왔습니다. 그렇게 우리 부엌의 따뜻함을 세계 어디든 당신에게 전합니다." },
  story_cta:       { th: "ลองสักชิ้นวันนี้", en: "Try One Today", zh: "立即尝试", ko: "오늘 한번 맛보세요" },

  review_eyebrow:  { th: "รีวิว", en: "Reviews", zh: "顾客评价", ko: "고객 리뷰" },
  review_title:    { th: "ลูกค้าของเราพูดว่า", en: "What Our Customers Say", zh: "顾客怎么说", ko: "고객들의 한마디" },
  review1:         { th: "ไม่เชื่อเลยว่านี่คือของแช่แข็ง เนื้อนุ่มมาก เหมือนเพิ่งอบใหม่ๆ", en: "I can't believe this came frozen. The texture is so soft — like it was just baked fresh.", zh: "真不敢相信这是冷冻的，口感太柔软了，就像刚烤好一样。", ko: "이게 냉동 제품이라니 믿기지 않아요. 방금 구운 것처럼 정말 부드러워요." },
  review1_who:     { th: "น้าน · กรุงเทพฯ", en: "Nan · Bangkok", zh: "Nan · 曼谷", ko: "난 · 방콕" },
  review2:         { th: "คุณแม่ถึงกับน้ำตาซึม บอกว่ามันทำให้นึกถึงเค้กที่เราทานด้วยกันตอนเด็กๆ", en: "My mother teared up. She said it reminded her of the cakes we had together when we were kids.", zh: "我妈妈感动落泪，她说这让她想起我们小时候一起吃的蛋糕。", ko: "어머니가 눈물을 글썽이셨어요. 어렸을 때 함께 먹던 케이크가 생각난다고 하셨죠." },
  review2_who:     { th: "เขม · เชียงใหม่", en: "Khem · Chiang Mai", zh: "Khem · 清迈", ko: "켐 · 치앙마이" },
  review3:         { th: "ซื้อเป็นของขวัญให้ลูกค้า ทุกคนถามว่าซื้อได้ที่ไหน", en: "I bought these as gifts for clients. Every single one of them asked where to get more.", zh: "我买来送给客户当礼物，每个人都问我在哪里能买到更多。", ko: "고객 선물용으로 구매했는데, 모두가 어디서 더 살 수 있는지 물어봤어요." },
  review3_who:     { th: "ป๊อป · สีลม", en: "Pop · Silom", zh: "Pop · 是隆", ko: "팝 · 실롬" },

  vending_eyebrow: { th: "ตู้ vending machine", en: "Vending Machine", zh: "自助售货机", ko: "자판기" },
  vending_title:   { th: "เค้กรางวัลระดับโลก หยอดเหรียญ พร้อมทานทันที", en: "Award-Winning Cake. One Tap Away.", zh: "获奖蛋糕，触手可及", ko: "수상작 케이크, 한 번의 터치로" },
  vending_p:       { th: "ไม่ต้องรอคิว ไม่ต้องสั่งล่วงหน้า เพียงเดินมาที่ตู้ Frozen Larna Cake ที่ใกล้คุณ เลือกรสชาติที่ชอบ และอร่อยได้ทันที ตลอด 24 ชั่วโมง", en: "No queue, no pre-order — just walk up to the nearest Frozen Larna Cake vending machine, pick your favorite flavor, and enjoy. Available 24 hours a day.", zh: "无需排队，无需预订——只需走到最近的Frozen Larna Cake自助售货机前，选择您喜爱的口味，即可立即享用。24小时全天候供应。", ko: "줄을 서거나 미리 주문할 필요 없이, 가까운 Frozen Larna Cake 자판기로 가서 원하는 맛을 고르고 바로 즐기세요. 24시간 이용 가능합니다." },
  vending_ic1:     { th: "เปิดบริการ", en: "Open", zh: "营业时间", ko: "운영 시간" },
  vending_ic1v:    { th: "24 ชม.", en: "24 Hrs", zh: "24小时", ko: "24시간" },
  vending_ic2:     { th: "ชำระเงิน", en: "Payment", zh: "支付方式", ko: "결제 방식" },
  vending_ic2v:    { th: "เงินสด / QR", en: "Cash / QR", zh: "现金 / 扫码", ko: "현금 / QR" },
  vending_ic3:     { th: "อุณหภูมิ", en: "Storage", zh: "存储温度", ko: "보관 온도" },
  vending_ic3v:    { th: "แช่แข็งตลอดเวลา", en: "Always Frozen", zh: "全程冷冻", ko: "상시 냉동" },
  vending_btn:     { th: "ติดต่อสอบถามตำแหน่งตู้", en: "Ask Us About Machine Locations", zh: "咨询售货机位置", ko: "자판기 위치 문의하기" },

  faq_eyebrow:     { th: "คำถามที่พบบ่อย", en: "FAQ", zh: "常见问题", ko: "자주 묻는 질문" },
  faq_title:       { th: "คำถามที่พบบ่อย", en: "Frequently Asked Questions", zh: "常见问题解答", ko: "자주 묻는 질문" },
  faq1_q:          { th: "ต้องละลายเค้กอย่างไร?", en: "How do I thaw the cake?", zh: "如何解冻蛋糕？", ko: "케이크는 어떻게 해동하나요?" },
  faq1_a:          { th: "เพียงนำออกจากช่องแช่แข็งมาวางที่อุณหภูมิห้อง 15–30 นาที หรือแช่ตู้เย็นธรรมดาทิ้งไว้ข้ามคืน เนื้อเค้กจะนุ่มฟัดจ์เหมือนเพิ่งอบใหม่", en: "Simply move it from the freezer to room temperature for 15–30 minutes, or leave it in the fridge overnight. It will return to its signature soft, fudgy texture — just like freshly baked.", zh: "只需将蛋糕从冷冻室取出，在室温下放置15–30分钟，或放入冷藏室隔夜解冻，即可恢复柔软绵密的招牌口感，如同现烤一般。", ko: "냉동실에서 꺼내 실온에 15~30분 두거나 냉장실에서 하룻밤 보관하세요. 갓 구운 듯한 부드럽고 퍼지한 식감으로 돌아옵니다." },
  faq2_q:          { th: "ต้องอุ่นก่อนทานไหม?", en: "Do I need to heat it up before eating?", zh: "食用前需要加热吗？", ko: "먹기 전에 데워야 하나요?" },
  faq2_a:          { th: "ไม่ต้องเลย Frozen Larna Cake ออกแบบมาให้ทานได้ทันทีตอนแช่แข็ง (เหมือนไอศกรีมเค้ก) หรือรอละลายบางส่วนเพื่อความนุ่มฟัดจ์ ไม่ต้องอุ่นเลย", en: "Not at all. Frozen Larna Cake is designed to be enjoyed straight from the freezer (like ice cream cake) or partially thawed for the classic soft-fudge experience. No heating required.", zh: "完全不需要。Frozen Larna Cake专为冷冻状态下直接享用而设计（如冰淇淋蛋糕），也可部分解冻后享受经典绵密口感，无需加热。", ko: "전혀 필요 없습니다. Frozen Larna Cake는 냉동 상태(아이스크림 케이크처럼) 또는 약간 해동한 상태에서 부드러운 퍼지 식감을 즐기도록 설계되었습니다. 데울 필요가 없습니다." },
  faq3_q:          { th: "เก็บได้นานแค่ไหน?", en: "How long does it last?", zh: "可以保存多久？", ko: "보관 기간은 얼마나 되나요?" },
  faq3_a:          { th: "แช่แข็งได้นานถึง 12 เดือน หลังละลายแล้วแนะนำให้ทานภายใน 10 วัน หากเก็บในตู้เย็น", en: "Up to 12 months in the freezer. Once thawed, we recommend consuming within 10 days if kept refrigerated.", zh: "冷冻可保存长达12个月。解冻后建议冷藏保存并在10天内食用完毕。", ko: "냉동 상태로 최대 12개월 보관 가능합니다. 해동 후에는 냉장 보관 시 10일 이내에 섭취하는 것을 권장합니다." },
  faq4_q:          { th: "มีวัตถุกันเสียหรือไม่?", en: "Does it contain preservatives?", zh: "含有防腐剂吗？", ko: "보존제가 들어 있나요?" },
  faq4_a:          { th: "ไม่มีค่ะ เราใช้เทคนิคถนอมอาหารตามธรรมชาติ ไม่มีวัตถุกันเสียหรือสารปรุงแต่งใดๆ ทานได้อย่างมั่นใจ", en: "No. We use natural food preservation techniques — no artificial preservatives, no additives. You can enjoy it with full confidence.", zh: "不含。我们采用天然保鲜技术，不添加任何人工防腐剂或添加剂，您可以放心享用。", ko: "없습니다. 천연 보존 기술을 사용하여 인공 보존제나 첨가물을 넣지 않았습니다. 안심하고 즐기셔도 됩니다." },
  faq5_q:          { th: "ซื้อที่ไหนได้บ้าง?", en: "Where can I find it?", zh: "在哪里可以买到？", ko: "어디서 구매할 수 있나요?" },
  faq5_a:          { th: "หาซื้อได้ที่ตู้ vending machine Frozen Larna Cake ทั่วกรุงเทพฯ หรือที่สาขา Larna House พัฒนาการ, สามย่าน และเอ็มโพเรียม สอบถามตำแหน่งตู้ใกล้คุณผ่าน LINE @larnahouse", en: "Find us at Frozen Larna Cake vending machines across Bangkok, or at Larna House branches in Pattanakarn, Samyan, and Emporium. Ask for the nearest machine location via LINE @larnahouse.", zh: "您可以在曼谷各地的Frozen Larna Cake自助售货机找到我们，或前往Larna House的Pattanakarn、Samyan和Emporium分店购买。通过LINE @larnahouse咨询最近的售货机位置。", ko: "방콕 전역의 Frozen Larna Cake 자판기에서 만나보실 수 있으며, Larna House의 빠따나깐, 사얌, 엠포리움 지점에서도 구매 가능합니다. 가까운 자판기 위치는 LINE @larnahouse로 문의해주세요." },
  faq6_q:          { th: "เป็นฮาลาลหรือไม่?", en: "Is it Halal certified?", zh: "是否通过清真认证？", ko: "할랄 인증 제품인가요?" },
  faq6_a:          { th: "ใช่ค่ะ Frozen Larna Cake ได้รับการรับรองฮาลาล, GHP และ HACCP ตรงตามมาตรฐานความปลอดภัยทางอาหารระดับสากล", en: "Yes. Frozen Larna Cake is Halal certified, GHP certified, and HACCP certified — meeting international food safety and dietary standards.", zh: "是的。Frozen Larna Cake通过清真认证、GHP认证和HACCP认证，符合国际食品安全和饮食标准。", ko: "네, Frozen Larna Cake는 할랄, GHP, HACCP 인증을 모두 획득하여 국제 식품 안전 및 식이 기준을 충족합니다." },

  contact_title:   { th: "ติดต่อเรา", en: "Get in Touch", zh: "联系我们", ko: "문의하기" },
  contact_sub:     { th: "มีคำถามเกี่ยวกับการสั่งซื้อ ของขวัญ หรือตำแหน่งตู้? เราพร้อมช่วยเหลือ", en: "Questions about ordering, gifting, or machine locations? We're ready to help.", zh: "对订购、礼品或售货机位置有疑问？我们随时为您解答。", ko: "주문, 선물, 자판기 위치에 대해 궁금하신가요? 언제든지 도와드리겠습니다." },

  footer_about:    { th: "Frozen Larna Cake โดย Larna House — เค้กไอศกรีมช็อกโกแลตไทยแช่แข็ง อร่อยได้นาน อร่อยได้ทุกที่ จัดจำหน่ายผ่านตู้ vending machine ทั่วกรุงเทพฯ", en: "Frozen Larna Cake by Larna House — Thai chocolate ice cream cake, frozen for freshness, delivered through vending machines across Bangkok.", zh: "Larna House旗下的Frozen Larna Cake——泰式巧克力冰淇淋蛋糕，冷冻保鲜，通过曼谷各地的自助售货机销售。", ko: "Larna House의 Frozen Larna Cake — 태국 초콜릿 아이스크림 케이크. 신선함을 위해 냉동 보관하며, 방콕 전역의 자판기를 통해 만나보실 수 있습니다." },
  footer_explore:  { th: "สำรวจ", en: "Explore", zh: "探索", ko: "둘러보기" },
  footer_legal:    { th: "ข้อมูล Larna House", en: "Larna House", zh: "Larna House 信息", ko: "Larna House 정보" },
  footer_rights:   { th: "© 2026 Frozen Larna Cake · ผลิตภัณฑ์ภายใต้ Larna House · ข้อมูลอ้างอิงจาก foodcovery.co/frozenlarna", en: "© 2026 Frozen Larna Cake · A Larna House product · Reference: foodcovery.co/frozenlarna", zh: "© 2026 Frozen Larna Cake · Larna House 出品 · 信息来源：foodcovery.co/frozenlarna", ko: "© 2026 Frozen Larna Cake · Larna House 제품 · 출처: foodcovery.co/frozenlarna" },

  back_home:       { th: "กลับหน้าแรก", en: "Back to Home", zh: "返回首页", ko: "홈으로 돌아가기" },
  detail_serving:  { th: "วิธีทาน & การเก็บรักษา", en: "How to Enjoy & Storage", zh: "食用与保存方式", ko: "맛있게 먹는 법 & 보관" },
  detail_weight:   { th: "น้ำหนัก", en: "Weight", zh: "重量", ko: "중량" },
  detail_box:      { th: "ขนาดกล่อง", en: "Box Size", zh: "包装尺寸", ko: "포장 크기" },
  detail_buy:      { th: "หาซื้อที่ตู้ vending / ติดต่อสั่งซื้อ", en: "Find at Vending Machine / Order via LINE", zh: "前往自助售货机购买 / 通过LINE订购", ko: "자판기에서 구매 / LINE으로 문의" },
  detail_line:     { th: "แชทผ่าน LINE", en: "Chat on LINE", zh: "LINE 咨询", ko: "LINE으로 문의" },
  related_title:   { th: "รสชาติอื่นที่น่าลอง", en: "More Flavors to Try", zh: "更多口味推荐", ko: "더 다양한 맛 보기" }
};

let currentLang = localStorage.getItem("larna_lang") || "th";

function t(key){
  const entry = I18N[key];
  if(!entry) return key;
  return entry[currentLang] || entry.th || key;
}

function applyI18n(){
  document.documentElement.lang = currentLang === "th" ? "th" : currentLang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll(".lang-switch button").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === currentLang);
  });
  ["renderProductGrid", "renderNutrition", "renderProductDetail", "renderRelated"].forEach(fnName => {
    if (typeof window[fnName] === "function") window[fnName]();
  });
}

function setLang(lang){
  if (!LANGS.includes(lang)) return;
  currentLang = lang;
  localStorage.setItem("larna_lang", lang);
  applyI18n();
}

function buildLangSwitch(){
  return LANGS.map(l =>
    `<button data-lang="${l}" onclick="setLang('${l}')">${LANG_LABEL[l]}</button>`
  ).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-switch").forEach(el => {
    el.innerHTML = buildLangSwitch();
  });
  applyI18n();
});
