/* ===== Frozen Larna Cake — UI Translations (TH / EN / ZH / KO ) ===== */

const LANGS = ["th", "en", "zh", "ko"];
const LANG_LABEL = { th: "ไทย", en: "EN", zh: "中文", ko: "한국어" };

const I18N = {
  nav_shop:        { th: "สินค้า", en: "Shop", zh: "商品", ko: "제품" },
  nav_about:       { th: "เกี่ยวกับเรา", en: "About", zh: "品牌故事", ko: "브랜드 소개" },
  nav_story:       { th: "ประวัติที่มา", en: "Our Story", zh: "我们的故事", ko: "브랜드 히스토리" },
  nav_faq:         { th: "คำถามที่พบบ่อย", en: "FAQ", zh: "常见问题", ko: "자주 묻는 질문" },
  nav_vending:     { th: "หาตู้ใกล้คุณ", en: "Find a Machine", zh: "查找售货机", ko: "자판기 찾기" },
  nav_contact:     { th: "ติดต่อเรา", en: "Contact", zh: "联系我们", ko: "문의하기" },
  nav_order:       { th: "สั่งซื้อ", en: "Order", zh: "立即订购", ko: "주문하기" },

  hero_award:      { th: "ผู้ชนะ Popular Vote · Innovative House Awards 2020", en: "Popular Vote Winner · Innovative House Awards 2020", zh: "Innovative House Awards 2020 人气大奖", ko: "Innovative House Awards 2020 인기상 수상" },
  hero_award2:     { th: "รางวัล Superior Taste Award 2024 · 3 ดาว", en: "Superior Taste Award 2024 · 3-Star", zh: "2024年Superior Taste Award · 三星", ko: "2024 Superior Taste Award · 3스타" },
  hero_title_pre:  { th: "เค้กไอศกรีมช็อกโกแลตไทย", en: "Thai Chocolate", zh: "泰式巧克力", ko: "태국 초콜릿" },
  hero_title_em:   { th: "แช่แข็ง สดใหม่ ทุกเวลา", en: "Ice Cream Cake. Frozen. Fresh. Anytime.", zh: "冰淇淋蛋糕。冷冻保鲜，随时享用。", ko: "아이스크림 케이크. 냉동. 신선함. 언제든지." },
  hero_lead:       { th: "เค้กช็อกโกแลตหน้านิ่มต้นตำรับจาก Larna House คัดสรรจากโกโก้ไทยพรีเมียม แช่แข็งได้นานถึง 12 เดือนโดยไม่ใส่วัตถุกันเสีย พร้อมเสิร์ฟทุกที่ ทุกเวลา ผ่านตู้ขายอัตโนมัติ", en: "The original soft-fudge chocolate cake from Larna House — crafted from premium Thai cacao, frozen for up to 12 months with zero preservatives. Ready whenever you are, straight from the vending machine.", zh: "源自Larna House的经典软心巧克力蛋糕，采用优质泰国可可制作，零防腐剂，可冷冻保存长达12个月。随时随地，自助售货机即取即享。", ko: "Larna House의 오리지널 소프트 퍼지 초콜릿 케이크. 프리미엄 태국 카카오로 만들었으며 보존제 없이 최대 12개월 냉동 보관이 가능합니다. 자판기에서 언제든 바로 즐기세요." },
  hero_cta_shop:   { th: "ดูสินค้าทั้งหมด", en: "Shop the Flavors", zh: "查看全部口味", ko: "전체 맛 보기" },
  hero_cta_machine:{ th: "หาตู้ใกล้คุณ", en: "Find a Vending Machine", zh: "查找售货机位置", ko: "자판기 위치 찾기" },
  stat_flavors:    { th: "รสชาติให้เลือก", en: "Flavors to Choose", zh: "种口味可选", ko: "가지 맛 선택 가능" },
  stat_shelf:      { th: "เดือน อายุการเก็บแช่แข็ง", en: "Mo. Frozen Shelf Life", zh: "个月冷冻保鲜期", ko: "개월 냉동 보관" },
  stat_serve:      { th: "กรัม ต่อชิ้น พอดีคำ", en: "g Perfect Single Serve", zh: "克 一人份装", ko: "g 1인분 사이즈" },

  vending_strip:   { th: "ซื้อง่ายผ่านตู้ vending machine — เลือกสินค้า สแกน QR จ่ายเงิน พร้อมทาน ไม่ต้องรอ", en: "Available now in vending machines — pick, scan to pay, enjoy. No waiting required.", zh: "现已上架自助售货机 — 选购、扫码付款、即享，无需等待。", ko: "지금 자판기에서 만나보세요 — 선택, QR 스캔 결제, 바로 즐기기. 기다림 없이!" },

  awards_eyebrow:  { th: "การันตีด้วยรางวัลระดับโลก", en: "World-Class Recognition", zh: "屡获国际殊荣", ko: "세계가 인정한 품질" },
  awards_title:    { th: "ไม่ใช่แค่เค้กแช่แข็ง แต่คือเค้กที่ได้รางวัล", en: "Not Just Frozen. Award-Winning.", zh: "不只是冷冻蛋糕，更是获奖蛋糕", ko: "단순한 냉동 케이크가 아닙니다, 수상 경력의 케이크입니다" },
  award1_name:     { th: "Superior Taste Award 2024", en: "Superior Taste Award 2024", zh: "2024年 Superior Taste Award", ko: "2024 Superior Taste Award" },
  award1_sub:      { th: "ได้รับการรับรองระดับ 3 ดาว (คะแนน 90–100%) ระดับสูงสุดจาก International Taste Institute กรุงบรัสเซลส์ ตัดสินโดยคณะกรรมการเชฟและซอมเมอลิเยร์ระดับโลก หมายถึงรสชาติระดับ \"ดีเลิศ\" ยอดเยี่ยมและควรค่าแก่การค้นหา", en: "Awarded the top 3-Star rating (score 90–100%) by the International Taste Institute, Brussels — judged by a world-class panel of chefs and sommeliers. A 3-star rating signifies an \"exceptional\" taste, the highest distinction given.", zh: "获International Taste Institute（布鲁塞尔）评定为最高等级——3星认证（评分90–100%），由世界级名厨与侍酒师组成的评审团评定，代表“卓越非凡”的最高风味等级。", ko: "벨기에 브뤼셀 International Taste Institute로부터 최고 등급인 3스타(점수 90–100%)를 받았습니다. 세계적인 셰프와 소믈리에로 구성된 심사단이 평가했으며, 3스타는 \"탁월함\"을 의미하는 최고 등급입니다." },
  award2_name:     { th: "ผู้ชนะ Popular Vote", en: "Popular Vote Winner", zh: "人气大奖获得者", ko: "인기상 수상" },
  award2_sub:      { th: "Innovative House Awards 2020 — ได้รับคะแนนโหวตจากผู้บริโภคสูงสุดในหมวดสินค้านวัตกรรม", en: "Innovative House Awards 2020 — voted #1 by consumers in the innovative product category.", zh: "Innovative House Awards 2020 — 在创新产品类别中获得消费者最高票数。", ko: "Innovative House Awards 2020 — 혁신 제품 부문에서 소비자 최다 득표로 선정되었습니다." },
  award3_tag:      { th: "ผลิตในประเทศไทย", en: "Made in Thailand", zh: "泰国制造", ko: "메이드 인 태국" },
  award3_name:     { th: "Product of Thailand", en: "Product of Thailand", zh: "泰国本土制造", ko: "태국산 제품" },
  award3_sub:      { th: "ผลิตในประเทศไทย จากโกโก้ไทยพรีเมียม สนับสนุนเกษตรกรและอุตสาหกรรมโกโก้ไทยอย่างยั่งยืน", en: "Proudly made in Thailand with premium Thai cacao — supporting local farmers and a sustainable Thai chocolate industry.", zh: "在泰国制造，采用优质泰国可可——支持本地农民与可持续的泰国巧克力产业。", ko: "프리미엄 태국 카카오로 태국에서 직접 생산 — 현지 농가와 지속 가능한 태국 초콜릿 산업을 지원합니다." },
  awards_note:     { th: "ระบบรางวัล Superior Taste Award แบ่งเป็น 1–3 ดาวตามคะแนนที่ได้ (70–80% = 1 ดาว \"รสชาติดี\", 80–90% = 2 ดาว \"รสชาติโดดเด่น\", 90–100% = 3 ดาว \"รสชาติดีเลิศ\") ประเมินโดยคณะกรรมการเชฟและซอมเมอลิเยร์มืออาชีพตั้งแต่ปี 2005 · ข้อมูลอ้างอิงจาก taste-institute.com", en: "The Superior Taste Award rates products from 1–3 stars based on score (70–80% = 1 Star \"Good\", 80–90% = 2 Stars \"Remarkable\", 90–100% = 3 Stars \"Exceptional\"), judged by a professional panel of chefs and sommeliers since 2005. Source: taste-institute.com", zh: "Superior Taste Award依据评分授予1至3星（70–80% = 1星“优良”，80–90% = 2星“出色”，90–100% = 3星“卓越”），自2005年起由专业名厨与侍酒师评审团评定。资料来源：taste-institute.com", ko: "Superior Taste Award는 점수에 따라 1~3스타로 평가됩니다(70–80% = 1스타 \"우수\", 80–90% = 2스타 \"뛰어남\", 90–100% = 3스타 \"탁월함\"). 2005년부터 전문 셰프 및 소믈리에 심사단이 평가합니다. 출처: taste-institute.com" },

  shop_eyebrow:    { th: "รสชาติที่มีให้เลือก", en: "Flavor Lineup", zh: "口味系列", ko: "플레이버 라인업" },
  shop_title:      { th: "8 รสชาติ บนฐานบราวนี่รางวัล", en: "8 Flavors. One Award-Winning Base.", zh: "8种口味，同一获奖底层", ko: "8가지 맛, 하나의 수상작 베이스" },
  shop_sub:        { th: "จากช็อกโกแลตคลาสสิกไปจนถึงมะม่วงเขตร้อนและดูไบสุดไวรัล ทุกรสชาติสร้างจากฐานบราวนี่รางวัลของเรา", en: "From classic dark chocolate to tropical mango and the viral Dubai — every flavor is crafted on our award-winning brownie base.", zh: "从经典黑巧克力到热带芒果，再到风靡全网的迪拜口味——每一款都以我们获奖的布朗尼为基底制作。", ko: "클래식 다크 초콜릿부터 트로피컬 망고, 화제의 두바이 맛까지 — 모든 플레이버는 수상작 브라우니 베이스 위에 만들어집니다." },
  view_detail:     { th: "ดูรายละเอียด", en: "View Details", zh: "查看详情", ko: "자세히 보기" },

  why_eyebrow:     { th: "ทำไมต้อง Frozen Larna", en: "Why Frozen Larna", zh: "为什么选择 Frozen Larna", ko: "왜 Frozen Larna인가" },
  why_title_l1:    { th: "ไม่ต้องเลือกระหว่าง", en: "You Shouldn't Have to Choose Between", zh: "美味与保鲜，", ko: "맛과 보관 기간," },
  why_title_l2:    { th: "ความอร่อย กับ อายุการเก็บ", en: "Taste & Shelf Life.", zh: "不必只能选一个。", ko: "둘 다 포기하지 마세요." },
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

  howto_eyebrow:   { th: "นวัตกรรมที่ทำให้เราแตกต่าง", en: "An Innovation in Every Bite", zh: "我们的独家创新", ko: "한입에 담긴 혁신" },
  howto_title:     { th: "ทานได้ 2 สไตล์ จากเค้กกระปุกเดียว", en: "Two Ways to Enjoy. One Tiny Tin.", zh: "一罐两种吃法", ko: "하나의 케이크, 두 가지 즐기는 방법" },
  howto_sub:       { th: "ไม่ต้องอุ่น ไม่ต้องเตรียมอะไรเลย แค่หยิบจากตู้แช่แข็งแล้วเลือกสไตล์ที่ใช่สำหรับคุณ", en: "No heating, no prep — just grab it from the freezer and pick the style that suits you.", zh: "无需加热，无需准备——直接从冷冻柜取出，选择你喜欢的吃法。", ko: "데울 필요도, 준비할 필요도 없습니다 — 냉동고에서 꺼내 원하는 스타일을 선택하세요." },
  howto1_h:        { th: "ทานแบบไอศกรีมเค้ก", en: "Eat It Like Ice Cream Cake", zh: "冰淇淋蛋糕风味", ko: "아이스크림 케이크처럼" },
  howto1_p_t:      { th: "นำออกจากช่องแช่แข็ง วางพักที่อุณหภูมิห้อง 5–10 นาที สัมผัสจะคล้ายไอศกรีมเค้ก", en: "Take it from the freezer and rest at room temperature 5–10 min for an ice-cream-cake texture.", zh: "从冷冻室取出，室温静置5–10分钟，口感如冰淇淋蛋糕。", ko: "냉동실에서 꺼내 실온에서 5~10분 두면 아이스크림 케이크 같은 식감이 됩니다." },
  howto2_h:        { th: "ทานแบบเค้กหน้านิ่ม", en: "Eat It Soft", zh: "绵密蛋糕风味", ko: "부드러운 케이크처럼" },
  howto2_p_t:      { th: "ย้ายจากช่องแข็งไปช่องเย็นธรรมดาค้างคืน แล้วพักที่อุณหภูมิห้องประมาณ 5 นาที จะได้เนื้อนุ่ม ละลายในปากแบบต้นตำรับ", en: "Move from freezer to regular fridge overnight, then rest at room temperature about 5 min for the original soft, melt-in-your-mouth texture.", zh: "从冷冻室移至冷藏室隔夜，再于室温静置约5分钟，即可呈现原版绵密、入口即化的口感。", ko: "냉동실에서 일반 냉장실로 옮겨 하룻밤 두었다가, 실온에서 약 5분 두면 부드럽고 입에서 녹는 본연의 식감을 즐길 수 있습니다." },
  howto3_h:        { th: "พร้อมทาน ไม่ต้องเตรียมอะไร", en: "Ready to Eat. Zero Prep.", zh: "即开即食，无需准备", ko: "준비 없이 바로 즐기기" },
  howto3_p:        { th: "มีช้อนในตัวกระปุก เปิดแล้วทานได้เลย เหมาะกับทุกที่ ทุกเวลา ไม่ต้องมีจาน ไม่ต้องมีช้อนแยก", en: "Comes with a spoon already inside the tin — just open and eat. Perfect anywhere, anytime, with no plate or extra utensils needed.", zh: "罐内已附赠勺子，打开即可食用，随时随地享用，无需餐具或额外准备。", ko: "틴 안에 스푼이 들어 있어 열기만 하면 바로 드실 수 있습니다. 그릇이나 별도 도구 없이 언제 어디서나 즐기세요." },

  story_eyebrow:   { th: "เรื่องราวของเรา", en: "Our Story", zh: "我们的故事", ko: "브랜드 스토리" },
  story_title:     { th: "เริ่มต้นจากครัวบ้านเรา ได้รับรางวัลระดับโลก", en: "Started in a Home Kitchen. Awarded by the World.", zh: "源自家庭厨房，获世界级认可", ko: "가정의 부엌에서 시작해, 세계가 인정한 맛" },
  story_quote:     { th: "Larna House เริ่มต้นจากคุณแม่ของผู้ก่อตั้ง คนรักการอบเค้กที่ทำเค้กช็อกโกแลตให้ครอบครัวและเพื่อนในทุกโอกาส สำหรับเธอ เค้กที่ดีไม่ใช่แค่เรื่องของรสชาติ แต่เป็นความรู้สึก สิ่งที่ส่งต่อให้กับคนที่ต้องการมัน", en: "Larna House began with our founder's mother — a passionate home baker who made chocolate cake for family and friends at every occasion. For her, a good cake wasn't just about taste. It was a feeling. Something you pass on to someone who needs it.", zh: "Larna House源于创始人的母亲——一位热爱烘焙的家庭主厨，在每个特别的日子为家人朋友制作巧克力蛋糕。对她而言，一块好蛋糕不仅是美味，更是一种心意，一份传递给需要它的人的温暖。", ko: "Larna House는 창업자의 어머니에게서 시작되었습니다. 모든 특별한 순간마다 가족과 친구를 위해 초콜릿 케이크를 만들던 열정적인 홈베이커였죠. 그녀에게 좋은 케이크란 맛뿐만 아니라 하나의 감정이었습니다. 필요한 누군가에게 전하는 따뜻한 마음이었습니다." },
  story_p:         { th: "วันนี้ เราใช้เวลาหลายปีในการพัฒนาเค้กให้นุ่ม เข้มข้น และไม่ใส่วัตถุกันเสีย เพื่อส่งความอบอุ่นจากครัวของเราไปถึงคุณ ไม่ว่าคุณจะอยู่ที่ไหน", en: "Today, we've spent years perfecting that cake — keeping it soft, rich, and preservative-free — so we can send that warmth from our kitchen to yours, anywhere in the world.", zh: "如今，我们已花费多年时间不断打磨这款蛋糕——让它保持柔软、浓郁且不含防腐剂——只为将这份来自我们厨房的温暖，送到世界各地的你手中。", ko: "오늘날 우리는 그 케이크를 더 부드럽고 풍부하면서도 보존제 없이 완성하기 위해 수년간 노력해왔습니다. 그렇게 우리 부엌의 따뜻함을 세계 어디든 당신에게 전합니다." },
  story_cta:       { th: "อ่านเรื่องราวทั้งหมด", en: "Read Our Full Story", zh: "阅读完整故事", ko: "전체 이야기 보기" },
  story_video_link: { th: "ดูวิดีโอเรื่องราวของเรา", en: "Watch our story on video", zh: "观看我们的故事视频", ko: "영상으로 우리 이야기 보기" },

  review_eyebrow:  { th: "รีวิว", en: "Reviews", zh: "顾客评价", ko: "고객 리뷰" },
  review_title:    { th: "ลูกค้าของเราพูดว่า", en: "What Our Customers Say", zh: "顾客怎么说", ko: "고객들의 한마디" },
  review1:         { th: "ไม่เชื่อเลยว่านี่คือของแช่แข็ง เนื้อนุ่มมาก เหมือนเพิ่งอบใหม่ๆ", en: "I can't believe this came frozen. The texture is so soft — like it was just baked fresh.", zh: "真不敢相信这是冷冻的，口感太柔软了，就像刚烤好一样。", ko: "이게 냉동 제품이라니 믿기지 않아요. 방금 구운 것처럼 정말 부드러워요." },
  review1_who:     { th: "น้าน · กรุงเทพฯ", en: "Nan · Bangkok", zh: "Nan · 曼谷", ko: "난 · 방콕" },
  review2:         { th: "คุณแม่ถึงกับน้ำตาซึม บอกว่ามันทำให้นึกถึงเค้กที่เราทานด้วยกันตอนเด็กๆ", en: "My mother teared up. She said it reminded her of the cakes we had together when we were kids.", zh: "我妈妈感动落泪，她说这让她想起我们小时候一起吃的蛋糕。", ko: "어머니가 눈물을 글썽이셨어요. 어렸을 때 함께 먹던 케이크가 생각난다고 하셨죠." },
  review2_who:     { th: "เขม · เชียงใหม่", en: "Khem · Chiang Mai", zh: "Khem · 清迈", ko: "켐 · 치앙마이" },
  review3:         { th: "ซื้อเป็นของขวัญให้ลูกค้า ทุกคนถามว่าซื้อได้ที่ไหน", en: "I bought these as gifts for clients. Every single one of them asked where to get more.", zh: "我买来送给客户当礼物，每个人都问我在哪里能买到更多。", ko: "고객 선물용으로 구매했는데, 모두가 어디서 더 살 수 있는지 물어봤어요." },
  review3_who:     { th: "ป๊อป · สีลม", en: "Pop · Silom", zh: "Pop · 是隆", ko: "팝 · 실롬" },

  vending_eyebrow: { th: "ตู้ vending machine", en: "Vending Machine", zh: "自助售货机", ko: "자판기" },
  vending_title:   { th: "เค้กรางวัลระดับโลก สแกนจ่าย พร้อมทานทันที", en: "Award-Winning Cake. One Scan Away.", zh: "获奖蛋糕，扫码即享", ko: "수상작 케이크, 스캔 한 번으로" },
  vending_p:       { th: "ไม่ต้องรอคิว ไม่ต้องสั่งล่วงหน้า เพียงเดินมาที่ตู้ Frozen Larna Cake เลือกรสชาติที่ชอบ สแกน QR Code เพื่อชำระเงิน และอร่อยได้ทันที ตลอด 24 ชั่วโมง", en: "No queue, no pre-order — just walk up to the Frozen Larna Cake vending machine, pick your favorite flavor, scan the QR code to pay, and enjoy. Available 24 hours a day.", zh: "无需排队，无需预订——只需走到Frozen Larna Cake自助售货机前，选择您喜爱的口味，扫描二维码付款，即可立即享用。24小时全天候供应。", ko: "줄을 서거나 미리 주문할 필요 없이, Frozen Larna Cake 자판기로 가서 원하는 맛을 고르고 QR 코드를 스캔해 결제한 뒤 바로 즐기세요. 24시간 이용 가능합니다." },
  vending_location:{ th: "📍 จัดจำหน่ายแล้วที่ ชั้น 4 โซนฟู้ดคอร์ท เซ็นทรัล เฟสติวัล เชียงใหม่", en: "📍 Now at 4th Floor, Food Court Zone, Central Festival Chiang Mai", zh: "📍 现已入驻清迈 Central Festival 4楼美食广场区", ko: "📍 현재 센트럴 페스티벌 치앙마이 4층 푸드코트 구역에서 만나보세요" },
  vending_ic1:     { th: "เปิดบริการ", en: "Open", zh: "营业时间", ko: "운영 시간" },
  vending_ic1v:    { th: "24 ชม.", en: "24 Hrs", zh: "24小时", ko: "24시간" },
  vending_ic2:     { th: "ชำระเงิน", en: "Payment", zh: "支付方式", ko: "결제 방식" },
  vending_ic2v:    { th: "สแกน QR", en: "QR Code", zh: "扫码支付", ko: "QR 코드 결제" },
  vending_ic2note: { th: "รองรับ PromptPay, TrueMoney, Alipay, WeChat Pay — ไม่รับเงินสดหรือเหรียญ", en: "Supports PromptPay, TrueMoney, Alipay, WeChat Pay — no cash or coins accepted.", zh: "支持 PromptPay、TrueMoney、支付宝、微信支付——不接受现金或硬币。", ko: "PromptPay, TrueMoney, Alipay, WeChat Pay 지원 — 현금 및 동전은 받지 않습니다." },
  vending_ic3:     { th: "อุณหภูมิ", en: "Storage", zh: "存储温度", ko: "보관 온도" },
  vending_ic3v:    { th: "แช่แข็งตลอดเวลา", en: "Always Frozen", zh: "全程冷冻", ko: "상시 냉동" },
  vending_btn:     { th: "นำทางไปยังตู้", en: "Navigate to the Machine", zh: "导航前往售货机", ko: "자판기로 길찾기" },
  vending_btn2:    { th: "สอบถามเพิ่มเติม", en: "Ask Us a Question", zh: "咨询更多信息", ko: "문의하기" },

  faq_eyebrow:     { th: "คำถามที่พบบ่อย", en: "FAQ", zh: "常见问题", ko: "자주 묻는 질문" },
  faq_title:       { th: "คำถามที่พบบ่อย", en: "Frequently Asked Questions", zh: "常见问题解答", ko: "자주 묻는 질문" },
  faq1_q:          { th: "จะทาน Frozen Larna Cake ต้องทำอย่างไร?", en: "How should I eat Frozen Larna Cake?", zh: "Frozen Larna Cake 该怎么吃？", ko: "Frozen Larna Cake는 어떻게 먹어야 하나요?" },
  faq1_a:          { th: "เพียงนำออกจากช่องแช่แข็งมาวางที่อุณหภูมิห้อง 15–30 นาที หรือแช่ตู้เย็นธรรมดาทิ้งไว้ข้ามคืน เนื้อเค้กจะนุ่มฟัดจ์เหมือนเพิ่งอบใหม่", en: "Simply move it from the freezer to room temperature for 15–30 minutes, or leave it in the fridge overnight. It will return to its signature soft, fudgy texture — just like freshly baked.", zh: "只需将蛋糕从冷冻室取出，在室温下放置15–30分钟，或放入冷藏室隔夜解冻，即可恢复柔软绵密的招牌口感，如同现烤一般。", ko: "냉동실에서 꺼내 실온에 15~30분 두거나 냉장실에서 하룻밤 보관하세요. 갓 구운 듯한 부드럽고 퍼지한 식감으로 돌아옵니다." },
  faq2_q:          { th: "ต้องอุ่นก่อนทานไหม?", en: "Do I need to heat it up before eating?", zh: "食用前需要加热吗？", ko: "먹기 전에 데워야 하나요?" },
  faq2_a:          { th: "ไม่ต้องเลย Frozen Larna Cake ออกแบบมาให้ทานได้ทันทีตอนแช่แข็ง (เหมือนไอศกรีมเค้ก) หรือรอละลายบางส่วนเพื่อความนุ่มฟัดจ์ ไม่ต้องอุ่นเลย", en: "Not at all. Frozen Larna Cake is designed to be enjoyed straight from the freezer (like ice cream cake) or partially thawed for the classic soft-fudge experience. No heating required.", zh: "完全不需要。Frozen Larna Cake专为冷冻状态下直接享用而设计（如冰淇淋蛋糕），也可部分解冻后享受经典绵密口感，无需加热。", ko: "전혀 필요 없습니다. Frozen Larna Cake는 냉동 상태(아이스크림 케이크처럼) 또는 약간 해동한 상태에서 부드러운 퍼지 식감을 즐기도록 설계되었습니다. 데울 필요가 없습니다." },
  faq3_q:          { th: "เก็บได้นานแค่ไหน?", en: "How long does it last?", zh: "可以保存多久？", ko: "보관 기간은 얼마나 되나요?" },
  faq3_a:          { th: "เก็บในช่องแช่แข็ง (-18°C) ได้นานสูงสุด 12 เดือน เพราะไม่ใส่วัตถุกันเสีย ความสดจึงขึ้นอยู่กับการเก็บรักษาเป็นหลัก หากนำออกมาไว้ในตู้เย็นธรรมดา (4°C) แนะนำให้ทานภายใน 5–7 วัน ส่วนการวางไว้ที่อุณหภูมิห้องควรไม่เกิน 2 ชม. และไม่ควรเก็บค้างคืนนอกตู้เย็น", en: "Up to 12 months in the freezer (-18°C). Since there are no preservatives, freshness depends on proper storage. Once moved to a regular fridge (4°C), enjoy it within 5–7 days. At room temperature, keep it out for no more than 2 hours, and avoid leaving it unrefrigerated overnight.", zh: "在冷冻室（-18°C）中可保存长达12个月。由于不含防腐剂，新鲜度主要取决于保存方式。若移至普通冷藏室（4°C），建议在5–7天内食用完毕；若放置于室温，请勿超过2小时，且不建议在室温下放置过夜。", ko: "냉동실(-18°C)에서 최대 12개월까지 보관할 수 있습니다. 보존제를 첨가하지 않았기 때문에 신선도는 보관 방법에 따라 크게 달라집니다. 일반 냉장실(4°C)로 옮긴 경우 5~7일 이내에 드시는 것을 권장하며, 실온에서는 2시간을 넘기지 않도록 하고 냉장 보관 없이 밤새 두지 않는 것이 좋습니다." },
  faq4_q:          { th: "มีวัตถุกันเสียหรือไม่?", en: "Does it contain preservatives?", zh: "含有防腐剂吗？", ko: "보존제가 들어 있나요?" },
  faq4_a:          { th: "ไม่มีค่ะ เราใช้เทคนิคถนอมอาหารตามธรรมชาติ ไม่มีวัตถุกันเสียหรือสารปรุงแต่งใดๆ ทานได้อย่างมั่นใจ", en: "No. We use natural food preservation techniques — no artificial preservatives, no additives. You can enjoy it with full confidence.", zh: "不含。我们采用天然保鲜技术，不添加任何人工防腐剂或添加剂，您可以放心享用。", ko: "없습니다. 천연 보존 기술을 사용하여 인공 보존제나 첨가물을 넣지 않았습니다. 안심하고 즐기셔도 됩니다." },
  faq5_q:          { th: "ซื้อที่ไหนได้บ้าง?", en: "Where can I find it?", zh: "在哪里可以买到？", ko: "어디서 구매할 수 있나요?" },
  faq5_a:          { th: "หาซื้อได้ที่ตู้ vending machine Frozen Larna Cake ชั้น 4 โซนฟู้ดคอร์ท เซ็นทรัล เฟสติวัล เชียงใหม่ ตู้เปิดให้บริการ 24 ชม. จ่ายผ่าน QR Code เท่านั้น รองรับ PromptPay, TrueMoney, Alipay และ WeChat Pay สอบถามข้อมูลเพิ่มเติมหรือดูเส้นทางผ่าน LINE @baanporjai", en: "Find us at the Frozen Larna Cake vending machine on the 4th Floor, Food Court Zone, Central Festival Chiang Mai. The machine is open 24 hrs and accepts QR code payment only — PromptPay, TrueMoney, Alipay, and WeChat Pay. Reach out via LINE @baanporjai for directions or more information.", zh: "您可以在清迈Central Festival 4楼美食广场区的Frozen Larna Cake自助售货机找到我们。该售货机24小时营业，仅支持二维码支付——PromptPay、TrueMoney、支付宝及微信支付。如需路线指引或更多信息，请通过LINE @baanporjai联系。", ko: "센트럴 페스티벌 치앙마이 4층 푸드코트 구역의 Frozen Larna Cake 자판기에서 만나보실 수 있습니다. 자판기는 24시간 운영되며 QR코드 결제만 가능합니다 — PromptPay, TrueMoney, Alipay, WeChat Pay 지원. 길 안내나 더 자세한 정보는 LINE @baanporjai로 문의해주세요." },
  faq6_q:          { th: "เป็นฮาลาลหรือไม่?", en: "Is it Halal certified?", zh: "是否通过清真认证？", ko: "할랄 인증 제품인가요?" },
  faq6_a:          { th: "ใช่ค่ะ Frozen Larna Cake ได้รับการรับรองฮาลาล, GHP และ HACCP ตรงตามมาตรฐานความปลอดภัยทางอาหารระดับสากล", en: "Yes. Frozen Larna Cake is Halal certified, GHP certified, and HACCP certified — meeting international food safety and dietary standards.", zh: "是的。Frozen Larna Cake通过清真认证、GHP认证和HACCP认证，符合国际食品安全和饮食标准。", ko: "네, Frozen Larna Cake는 할랄, GHP, HACCP 인증을 모두 획득하여 국제 식품 안전 및 식이 기준을 충족합니다." },
  faq7_q:          { th: "ชำระเงินที่ตู้ได้อย่างไร?", en: "How do I pay at the machine?", zh: "如何在自助售货机付款？", ko: "자판기에서는 어떻게 결제하나요?" },
  faq7_a:          { th: "ตู้ Frozen Larna Cake รองรับการชำระเงินผ่าน QR Code เท่านั้น ได้แก่ PromptPay, TrueMoney, Alipay และ WeChat Pay", en: "Our vending machines accept QR code payments only — PromptPay, TrueMoney, Alipay, and WeChat Pay.", zh: "我们的自助售货机仅支持扫码支付，包括 PromptPay、TrueMoney、支付宝和微信支付。", ko: "자판기는 QR 코드 결제만 지원합니다 — PromptPay, TrueMoney, Alipay, WeChat Pay." },

  contact_title:   { th: "ติดต่อเรา", en: "Get in Touch", zh: "联系我们", ko: "문의하기" },
  contact_sub:     { th: "มีคำถามเกี่ยวกับการสั่งซื้อ ของขวัญ หรือตำแหน่งตู้? เราพร้อมช่วยเหลือ", en: "Questions about ordering, gifting, or machine locations? We're ready to help.", zh: "对订购、礼品或售货机位置有疑问？我们随时为您解答。", ko: "주문, 선물, 자판기 위치에 대해 궁금하신가요? 언제든지 도와드리겠습니다." },

  footer_about:    { th: "Frozen Larna Cake โดย Larna House — เค้กไอศกรีมช็อกโกแลตไทยแช่แข็ง อร่อยได้นาน อร่อยได้ทุกที่ จัดจำหน่ายผ่านตู้ vending machine ชั้น 4 โซนฟู้ดคอร์ท เซ็นทรัล เฟสติวัล เชียงใหม่ ได้แล้ว", en: "Frozen Larna Cake by Larna House — Thai chocolate ice cream cake, frozen for freshness, delicious anywhere. Now available through our vending machine on the 4th Floor, Food Court Zone, Central Festival Chiang Mai.", zh: "Larna House旗下的Frozen Larna Cake——泰式巧克力冰淇淋蛋糕，冷冻保鲜，随时随地享用。现已在清迈Central Festival 4楼美食广场区的自助售货机上架。", ko: "Larna House의 Frozen Larna Cake — 태국 초콜릿 아이스크림 케이크. 신선함을 오래 유지하며 언제 어디서나 맛볼 수 있습니다. 현재 센트럴 페스티벌 치앙마이 4층 푸드코트 구역의 자판기에서 만나보실 수 있습니다." },
  footer_explore:  { th: "สำรวจ", en: "Explore", zh: "探索", ko: "둘러보기" },
  footer_legal:    { th: "ข้อมูล Larna House", en: "Larna House", zh: "Larna House 信息", ko: "Larna House 정보" },
  footer_rights:   { th: "© 2026 Frozen Larna Cake · ผลิตภัณฑ์ภายใต้ Larna House · ข้อมูลอ้างอิงจาก foodcovery.co/frozenlarna", en: "© 2026 Frozen Larna Cake · A Larna House product · Reference: foodcovery.co/frozenlarna", zh: "© 2026 Frozen Larna Cake · Larna House 出品 · 信息来源：foodcovery.co/frozenlarna", ko: "© 2026 Frozen Larna Cake · Larna House 제품 · 출처: foodcovery.co/frozenlarna" },

  back_home:       { th: "กลับหน้าแรก", en: "Back to Home", zh: "返回首页", ko: "홈으로 돌아가기" },
  detail_serving:  { th: "วิธีทาน & การเก็บรักษา", en: "How to Enjoy & Storage", zh: "食用与保存方式", ko: "맛있게 먹는 법 & 보관" },
  detail_weight:   { th: "น้ำหนัก", en: "Weight", zh: "重量", ko: "중량" },
  detail_box:      { th: "ขนาดกล่อง", en: "Box Size", zh: "包装尺寸", ko: "포장 크기" },
  detail_buy:      { th: "หาซื้อที่ตู้ vending / ติดต่อสั่งซื้อ", en: "Find at Vending Machine / Order via LINE", zh: "前往自助售货机购买 / 通过LINE订购", ko: "자판기에서 구매 / LINE으로 문의" },
  detail_line:     { th: "แชทผ่าน LINE", en: "Chat on LINE", zh: "LINE 咨询", ko: "LINE으로 문의" },
  detail_layers_title: { th: "3 ชั้นรสสัมผัส", en: "3 Layers of Texture", zh: "三层口感", ko: "3가지 레이어의 식감" },
  detail_benefits_title: { th: "ประโยชน์ของคาเคานิบส์", en: "Benefits of Cacao Nibs", zh: "可可粒的益处", ko: "카카오닙스의 효능" },
  detail_nibs_title: { th: "คาเคานิบส์คืออะไร?", en: "What Are Cacao Nibs?", zh: "什么是可可粒？", ko: "카카오닙스란?" },
  stock_out: { th: "สินค้าหมดชั่วคราว", en: "Temporarily Out of Stock", zh: "暂时缺货", ko: "일시 품절" },
  order_validation_stock: { th: "สินค้าบางรายการมีไม่พอ กรุณาปรับจำนวนในตะกร้า", en: "Some items don't have enough stock — please adjust the quantity in your cart.", zh: "部分商品库存不足，请调整购物车中的数量。", ko: "일부 상품의 재고가 부족합니다. 장바구니 수량을 조정해주세요." },
  detail_video_title:  { th: "ดูวิดีโอแนะนำ", en: "Watch the Video", zh: "观看视频", ko: "영상 보기" },
  detail_tips_title:   { th: "ทานให้อร่อยที่สุด", en: "For the Best Experience", zh: "这样吃最过瘾", ko: "가장 맛있게 즐기는 법" },
  detail_faq_title:    { th: "คำถามที่พบบ่อย", en: "Frequently Asked Questions", zh: "常见问题", ko: "자주 묻는 질문" },
  related_title:   { th: "รสชาติอื่นที่น่าลอง", en: "More Flavors to Try", zh: "更多口味推荐", ko: "더 다양한 맛 보기" },

  care1_q:         { th: "เก็บรักษา Frozen Larna Cake อย่างไร?", en: "How do I store Frozen Larna Cake?", zh: "如何保存 Frozen Larna Cake？", ko: "Frozen Larna Cake는 어떻게 보관하나요?" },
  care1_li1_b:     { th: "ช่องแช่แข็ง (-18°C)", en: "Freezer (-18°C)", zh: "冷冻室（-18°C）", ko: "냉동실 (-18°C)" },
  care1_li1_t:     { th: "— เก็บได้นาน 1 ปี", en: "— keeps for up to 1 year.", zh: "— 可保存长达1年。", ko: "— 최대 1년 보관 가능합니다." },
  care1_li2_b:     { th: "ตู้เย็นธรรมดา (4°C)", en: "Regular Fridge (4°C)", zh: "冷藏室（4°C）", ko: "일반 냉장실 (4°C)" },
  care1_li2_t:     { th: "— เก็บได้ 5–7 วันหลังนำออกจากช่องแข็ง", en: "— keeps 5–7 days once moved out of the freezer.", zh: "— 从冷冻室取出后可冷藏保存5–7天。", ko: "— 냉동실에서 옮긴 후 5~7일간 보관 가능합니다." },
  care1_li3_b:     { th: "อุณหภูมิห้อง", en: "Room Temperature", zh: "室温", ko: "실온" },
  care1_li3_t:     { th: "— วางไว้ข้างนอกตู้เย็นได้ 8-10 ชม. ไม่แนะนำเก็บค้างคืน", en: "— fine outside the fridge for up to 8-10 hrs; not recommended overnight.", zh: "— 可在室温下放置最多8-10小时，不建议放置过夜。", ko: "— 냉장고 밖에 최대 8-10시간까지는 괜찮으나 밤새 두는 것은 권장하지 않습니다." },
  care1_tip:       { th: "ไม่มีวัตถุกันเสีย — ความสดขึ้นอยู่กับการเก็บรักษาค่ะ", en: "No preservatives added — freshness depends on proper storage.", zh: "不含防腐剂——新鲜度取决于妥善的保存方式。", ko: "보존제를 첨가하지 않았습니다 — 신선도는 올바른 보관 방법에 따라 달라집니다." },

  care2_q:         { th: "จะทาน Frozen Larna Cake ต้องทำอย่างไร?", en: "How should I eat Frozen Larna Cake?", zh: "Frozen Larna Cake 该怎么吃？", ko: "Frozen Larna Cake는 어떻게 먹어야 하나요?" },
  care2_sub:       { th: "เลือกวิธีทานได้ 2 แบบตามความชอบค่ะ", en: "Pick whichever of the 2 styles you prefer.", zh: "可根据喜好选择以下两种吃法。", ko: "선호하는 방식대로 2가지 중 골라 드세요." },
  care2_li1_b:     { th: "แบบเย็นฉ่ำ", en: "Cold Style", zh: "冰凉口感", ko: "차가운 스타일" },
  care2_li1_t:     { th: "— นำออกจากช่องแข็ง วางพักที่อุณหภูมิห้อง 5–10 นาที สัมผัสคล้ายไอศกรีมเค้ก", en: "— take it from the freezer and rest at room temperature 5–10 min for an ice-cream-cake texture.", zh: "— 从冷冻室取出，室温静置5–10分钟，口感如冰淇淋蛋糕。", ko: "— 냉동실에서 꺼내 실온에서 5~10분 두면 아이스크림 케이크 같은 식감이 됩니다." },
  care2_li2_b:     { th: "แบบนุ่มละมุน", en: "Soft Style", zh: "绵密口感", ko: "부드러운 스타일" },
  care2_li2_t:     { th: "— ย้ายจากช่องแข็งไปช่องเย็นธรรมดาค้างคืน แล้วพักที่อุณหภูมิห้องอีก 5 นาที จะได้เนื้อนุ่ม ละลายในปากแบบต้นตำรับ", en: "— move from freezer to regular fridge overnight, then rest at room temperature another 5 min for the original soft, melt-in-your-mouth texture.", zh: "— 从冷冻室移至冷藏室隔夜，再于室温静置5分钟，即可呈现原版绵密、入口即化的口感。", ko: "— 냉동실에서 일반 냉장실로 옮겨 하룻밤 두었다가, 실온에서 5분 더 두면 부드럽고 입에서 녹는 본연의 식감을 즐길 수 있습니다." },
  care2_warn:      { th: "ไม่แนะนำอุ่นไมโครเวฟ เพราะหน้าช็อกโกแลตจะแยกตัวออกจากเนื้อเค้กค่ะ", en: "Microwaving is not recommended — the chocolate coating will separate from the cake.", zh: "不建议使用微波炉加热，否则巧克力外层会与蛋糕本体分离。", ko: "전자레인지 사용은 권장하지 않습니다 — 초콜릿 코팅이 케이크에서 분리될 수 있습니다." },

  /* ===== Order page ===== */
  order_eyebrow:     { th: "สั่งซื้อออนไลน์", en: "Order Online", zh: "在线订购", ko: "온라인 주문" },
  order_title:       { th: "สั่งเค้กที่ใช่ ให้ Larna House จัดส่งถึงบ้านคุณ", en: "Order Your Favorites — We'll Deliver Them to Your Door", zh: "订购喜爱的口味，由Larna House为您配送到家", ko: "원하는 케이크를 주문하면 Larna House가 댁까지 배송해 드립니다" },
  order_sub:         { th: "เลือกสินค้าและจำนวนที่ต้องการ จากนั้นแจ้งคำสั่งซื้อผ่าน LINE หรืออีเมล ทางร้านจะติดต่อยืนยันการจัดส่งอีกครั้ง", en: "Pick the flavors and quantities you want, then send your order via LINE or email. We'll follow up to confirm delivery details.", zh: "选择您想要的口味和数量，然后通过LINE或电子邮件发送订单。我们会与您联系确认配送详情。", ko: "원하는 맛과 수량을 선택한 뒤 LINE 또는 이메일로 주문을 보내주세요. 배송 일정은 저희가 다시 연락드려 확인해 드립니다." },
  order_free_delivery: { th: "🚚 จัดส่งฟรีในเขตอำเภอเมืองเชียงใหม่ เมื่อสั่งซื้อ 4 ชิ้นขึ้นไป", en: "🚚 Free delivery within Mueang Chiang Mai for orders of 4+ items.", zh: "🚚 清迈市区订购满4件即可享受免费配送。", ko: "🚚 치앙마이 므앙 지역 내 4개 이상 주문 시 무료 배송." },
  order_note_vending:{ th: "💡 ตู้ vending machine ที่เซ็นทรัล เฟสติวัล เชียงใหม่ รองรับเฉพาะซื้อหน้าตู้สแกน QR เท่านั้น ไม่รองรับสั่งล่วงหน้า หากต้องการสั่งล่วงหน้า กรุณาใช้หน้านี้", en: "💡 The vending machine at Central Festival Chiang Mai is walk-up only (scan QR to pay) and doesn't take pre-orders. Use this page to pre-order instead.", zh: "💡 清迈Central Festival的自助售货机仅支持现场扫码购买，不支持预订。如需预订，请使用本页面。", ko: "💡 센트럴 페스티벌 치앙마이의 자판기는 현장에서 QR 결제로만 구매 가능하며 사전 주문은 받지 않습니다. 사전 주문은 이 페이지를 이용해 주세요." },

  order_pick_title:  { th: "1. เลือกสินค้า", en: "1. Choose Your Cakes", zh: "1. 选择您的蛋糕", ko: "1. 케이크 선택" },
  order_qty:         { th: "จำนวน", en: "Qty", zh: "数量", ko: "수량" },

  order_cart_title:  { th: "ตะกร้าสินค้าของคุณ", en: "Your Order", zh: "您的订单", ko: "주문 내역" },
  order_cart_empty:  { th: "ยังไม่มีสินค้าในตะกร้า เลือกรสชาติที่ชอบได้เลยค่ะ", en: "Your cart is empty. Pick a few flavors to get started.", zh: "您的购物车是空的，快来选购喜欢的口味吧。", ko: "카트가 비어 있습니다. 원하는 맛을 선택해 보세요." },
  order_subtotal:    { th: "ยอดรวม", en: "Total", zh: "总计", ko: "총액" },

  order_fulfill_title:  { th: "2. จัดส่ง", en: "2. Delivery", zh: "2. 配送", ko: "2. 배송" },
  order_fulfill_note:  { th: "* ทางร้านจะติดต่อนัดวันและเวลาที่แน่นอนอีกครั้งหลังได้รับคำสั่งซื้อ", en: "* We'll contact you to confirm the exact date and time after receiving your order.", zh: "* 收到订单后，我们会与您联系确认具体的日期和时间。", ko: "* 주문을 받은 후 정확한 날짜와 시간을 확인하기 위해 연락드립니다." },

  order_form_title:  { th: "3. ข้อมูลผู้สั่งซื้อ", en: "3. Your Details", zh: "3. 订购人信息", ko: "3. 주문자 정보" },
  order_form_name:   { th: "ชื่อ-นามสกุล", en: "Full Name", zh: "姓名", ko: "성명" },
  order_form_phone:  { th: "เบอร์โทรศัพท์", en: "Phone Number", zh: "电话号码", ko: "전화번호" },
  order_form_address:{ th: "ที่อยู่จัดส่ง", en: "Delivery Address", zh: "配送地址", ko: "배송 주소" },
  order_form_date:   { th: "วันที่ต้องการ (ถ้ามี)", en: "Preferred Date (optional)", zh: "期望日期（可选）", ko: "희망 날짜 (선택)" },
  order_form_note:   { th: "หมายเหตุเพิ่มเติม (ถ้ามี)", en: "Additional Notes (optional)", zh: "备注（可选）", ko: "추가 메모 (선택)" },

  order_submit_title:{ th: "4. ส่งคำสั่งซื้อ", en: "4. Send Your Order", zh: "4. 提交订单", ko: "4. 주문 보내기" },
  order_submit_btn:  { th: "✅ ส่งคำสั่งซื้อ", en: "✅ Submit Order", zh: "✅ 提交订单", ko: "✅ 주문 보내기" },
  order_sending:     { th: "กำลังส่ง...", en: "Sending...", zh: "发送中...", ko: "전송 중..." },
  order_err_fail:    { th: "เกิดข้อผิดพลาด กรุณาลองใหม่ หรือทักแชท LINE @baanporjai", en: "Something went wrong. Please try again, or message us on LINE @baanporjai.", zh: "出现错误，请重试，或通过LINE @baanporjai联系我们。", ko: "오류가 발생했습니다. 다시 시도하거나 LINE @baanporjai로 문의해 주세요." },
  order_or_contact:  { th: "หรือติดต่อโดยตรง:", en: "Or contact us directly:", zh: "或直接联系我们：", ko: "또는 직접 문의하기:" },
  order_line_btn:    { th: "💬 แชททาง LINE", en: "💬 Chat on LINE", zh: "💬 通过LINE聊天", ko: "💬 LINE으로 문의하기" },
  order_validation_cart:   { th: "กรุณาเลือกสินค้าอย่างน้อย 1 รายการ", en: "Please choose at least one item.", zh: "请至少选择一项商品。", ko: "최소 1개 이상의 상품을 선택해 주세요." },
  order_validation_info:   { th: "กรุณากรอกชื่อและเบอร์โทรศัพท์", en: "Please enter your name and phone number.", zh: "请填写姓名和电话号码。", ko: "이름과 전화번호를 입력해 주세요." },
  order_validation_address:{ th: "กรุณากรอกที่อยู่จัดส่ง", en: "Please enter a delivery address.", zh: "请填写配送地址。", ko: "배송 주소를 입력해 주세요." },
  order_validation_date:{ th: "กรุณากรอกวันที่ให้ถูกต้องในรูปแบบ วว/ดด/ปปปป", en: "Please enter a valid date in DD/MM/YYYY format.", zh: "请按 DD/MM/YYYY 格式填写正确的日期。", ko: "DD/MM/YYYY 형식으로 올바른 날짜를 입력해 주세요." },

  order_success_title:{ th: "ส่งคำสั่งซื้อสำเร็จ! 🎉", en: "Order Sent! 🎉", zh: "订单已送出！🎉", ko: "주문이 전송되었습니다! 🎉" },
  order_success_msg:  { th: "ทีมงาน Larna House ได้รับคำสั่งซื้อของคุณแล้ว จะติดต่อกลับเพื่อยืนยันการจัดส่งภายใน 24 ชั่วโมงค่ะ", en: "Larna House has received your order and will contact you to confirm delivery within 24 hours.", zh: "Larna House已收到您的订单，将在24小时内与您联系以确认配送事宜。", ko: "Larna House가 주문을 받았습니다. 24시간 내에 배송 확인을 위해 연락드리겠습니다." },
  order_new_btn:      { th: "🔁 สั่งซื้ออีกครั้ง", en: "🔁 Place Another Order", zh: "🔁 再下一单", ko: "🔁 새 주문하기" },

  sp_hero_eyebrow: { th: "กว่า 20 ปีแห่งเรื่องราว", en: "Over 20 Years in the Making", zh: "20余年的传承故事", ko: "20년이 넘는 이야기" },
  sp_hero_title:   { th: "จากสูตรในครอบครัว สู่เค้กที่แช่แข็งได้นานถึง 1 ปี", en: "From a Family Recipe to a Cake That Freezes for a Year", zh: "从家传食谱，到可冷冻保存长达一年的蛋糕", ko: "가족의 레시피에서, 1년간 냉동 보관되는 케이크로" },
  sp_hero_lead:    { th: "ก่อนจะเป็น Frozen Larna Cake ที่คุณซื้อได้จากตู้ vending machine เราคือร้านเค้กเล็กๆ ย่านพัฒนาการที่เริ่มต้นจากสูตรของคนในครอบครัว นี่คือเรื่องราวกว่าจะมาถึงวันนี้", en: "Before it became the Frozen Larna Cake you can grab from a vending machine, we were a small cake shop in the Phatthanakan neighborhood that started with a family recipe. Here's how we got here.", zh: "在成为如今可从自助售货机购买的Frozen Larna Cake之前，我们只是Phatthanakan街区一家从家传食谱起步的小蛋糕店。这是我们走到今天的故事。", ko: "지금은 자판기에서 바로 살 수 있는 Frozen Larna Cake가 되기까지, 우리는 가족의 레시피에서 시작한 파타나칸(Phatthanakan) 지역의 작은 케이크 가게였습니다. 오늘에 이르기까지의 이야기를 소개합니다." },

  sp1_eyebrow: { th: "จุดเริ่มต้น", en: "The Beginning", zh: "起点", ko: "시작" },
  sp1_title:   { th: "จานที่หมดก่อนใคร ในปาร์ตี้คริสต์มาส ปี 1998", en: "The Dish That Ran Out First at Christmas, 1998", zh: "1998年圣诞派对上，最先被吃光的一道菜", ko: "1998년 크리스마스 파티에서 가장 먼저 사라진 케이크" },
  sp1_p1:      { th: "ปี 1998 งานคริสต์มาสของครอบครัวเรามีอาหารวางเต็มโต๊ะหลายสิบจาน แต่มีอยู่จานเดียวที่หมดก่อนเสมอ นั่นคือเค้กช็อกโกแลตของคุณแม่ ทุกปีมีคนถามสูตร ทุกปีแม่ก็ยิ้มแล้วบอกว่า \"ไม่บอก\" แต่เค้กก็ยังคงถูกวางบนโต๊ะ และหมดก่อนจานอื่นเสมอ", en: "It was 1998. Our family's Christmas table had dozens of dishes laid out, but one always disappeared first — our mother's chocolate cake. Every year someone asked for the recipe, and every year she just smiled and said, \"I'm not telling.\" Yet the cake kept showing up on the table, and kept running out before everything else.", zh: "那是1998年。我们家的圣诞餐桌上摆满了数十道菜，但总有一道最先被吃光——妈妈做的巧克力蛋糕。每年都有人向她讨要食谱，每年她也只是微笑着说：“不告诉你。”可蛋糕依然年年出现在桌上，也依然年年最先被吃光。", ko: "1998년, 우리 가족의 크리스마스 식탁에는 수십 가지 요리가 차려졌지만 늘 가장 먼저 동나는 것은 하나였습니다. 바로 어머니가 만든 초콜릿 케이크였죠. 매년 누군가 레시피를 물었고, 매년 어머니는 그저 웃으며 \"안 알려줄 거야\"라고 하셨습니다. 그래도 케이크는 해마다 식탁에 올랐고, 늘 가장 먼저 사라졌습니다." },
  sp1_p2:      { th: "จนวันหนึ่งเราถามตัวเองว่า ทำไมความอร่อยแบบนี้ถึงต้องอยู่แค่ในงานปาร์ตี้ของครอบครัวเดียว จึงเริ่มทดลองนำไปวางขายที่ร้านกาแฟตั้งแต่สมัยเรียนมหาวิทยาลัย ผลตอบรับดีเกินคาด จนเปิดร้านเค้กของตัวเองขึ้นในปี 2006 ที่ย่านพัฒนาการ โดยขายเฉพาะเค้กช็อกโกแลตหน้านิ่มเป็นหลัก", en: "Until one day we asked ourselves — why should something this good stay confined to one family's party? We started testing it at a coffee shop while still in university. The response was better than expected, and in 2006 we opened our own cake shop in the Phatthanakan area, selling almost nothing but soft-fudge chocolate cake.", zh: "直到有一天，我们问自己：这么美味的东西，为什么只能出现在一个家庭的聚会上？于是从大学时期开始，我们尝试把它拿到咖啡店寄卖，反响出乎意料地好，最终在2006年于Phatthanakan街区开设了自己的蛋糕店，几乎只专注于这一款软心巧克力蛋糕。", ko: "그러다 문득 스스로에게 물었습니다. 이렇게 맛있는 걸 왜 한 가족의 파티에서만 즐겨야 할까? 대학생 시절 커피숍에서 판매를 시작했고, 반응은 기대 이상이었습니다. 그렇게 2006년, 파타나칸 지역에 저희만의 케이크 가게를 열었고 처음부터 거의 소프트 퍼지 초콜릿 케이크 하나에만 집중했습니다." },
  sp1_quote:   { th: "เราไม่ได้ขายเค้ก เราส่งต่อความรู้สึกที่แม่มอบให้เราในวันนั้น ไปสู่ทุกวันเกิดของทุกคน", en: "We're not selling cake. We're passing on the feeling our mother gave us that day, to everyone's birthday.", zh: "我们卖的不是蛋糕，而是把那天母亲给予我们的感觉，传递到每个人的生日里。", ko: "우리는 케이크를 파는 게 아닙니다. 그날 어머니가 우리에게 주신 그 마음을, 모두의 생일로 전하는 거죠." },
  sp1_who:     { th: "คุณแจ็ค · ผู้ก่อตั้ง Larna House", en: "Jack · Founder, Larna House", zh: "Jack · Larna House创始人", ko: "잭(Jack) · Larna House 창업자" },

  sp_tl_eyebrow: { th: "การเดินทาง", en: "The Journey", zh: "我们的旅程", ko: "우리의 여정" },
  sp_tl_title:   { th: "จากครัวที่บ้าน สู่เวทีโลก", en: "From a Home Kitchen to the World Stage", zh: "从家庭厨房，走向世界舞台", ko: "가정의 부엌에서, 세계 무대로" },
  tl1_year: { th: "1998", en: "1998", zh: "1998", ko: "1998" },
  tl1_h:    { th: "สูตรของแม่ · ครัวที่บ้าน", en: "Mom's Recipe · A Home Kitchen", zh: "妈妈的食谱 · 家庭厨房", ko: "어머니의 레시피 · 가정의 부엌" },
  tl1_p:    { th: "เค้กช็อกโกแลตต้นตำรับถูกอบครั้งแรกสำหรับงานคริสต์มาสครอบครัว สูตรที่ไม่เคยเปลี่ยนจนถึงวันนี้", en: "The original chocolate cake was baked for the first time for a family Christmas — a recipe that hasn't changed to this day.", zh: "最初的巧克力蛋糕，是为一场家庭圣诞聚会而烤制的——这份食谱，直到今天都未曾改变。", ko: "오리지널 초콜릿 케이크가 가족 크리스마스 파티를 위해 처음 구워졌습니다. 오늘날까지 바뀌지 않은 레시피죠." },
  tl2_year: { th: "2006", en: "2006", zh: "2006", ko: "2006" },
  tl2_h:    { th: "Larna House เปิดสาขาแรก", en: "Larna House Opens Its First Branch", zh: "Larna House首家门店开业", ko: "Larna House 첫 매장 오픈" },
  tl2_p:    { th: "สาขาพัฒนาการ 61 — ครัวบ้านกลายเป็นครัวกลางที่ผลิตเค้กส่งทุกวัน", en: "Phatthanakan 61 branch — the home kitchen became a central kitchen, producing and shipping cakes every day.", zh: "Phatthanakan 61分店——家庭厨房蜕变为每日出品配送的中央厨房。", ko: "파타나칸(Phatthanakan) 61 지점 — 가정의 부엌이 매일 케이크를 생산하고 배송하는 중앙 주방이 되었습니다." },
  tl3_year: { th: "2023", en: "2023", zh: "2023", ko: "2023" },
  tl3_h:    { th: "แตกแบรนด์ Cacao Everywhere", en: "Cacao Everywhere Is Born", zh: "衍生品牌Cacao Everywhere诞生", ko: "Cacao Everywhere 브랜드 출범" },
  tl3_p:    { th: "ขยายสู่ Craft Chocolate Café เพราะเราเชื่อว่าโกโก้ไทยมีเรื่องราวและเอกลักษณ์ที่โลกควรรู้", en: "Expanding into a craft chocolate café, because we believe Thai cacao has a story and identity the world should know.", zh: "拓展为精品巧克力咖啡馆，因为我们相信泰国可可有着值得世界了解的故事与个性。", ko: "크래프트 초콜릿 카페로 확장했습니다. 태국 카카오만의 이야기와 개성을 세상이 알아야 한다고 믿었기 때문이죠." },
  tl4_year: { th: "2024", en: "2024", zh: "2024", ko: "2024" },
  tl4_h:    { th: "🏆 Superior Taste Award · Brussels", en: "🏆 Superior Taste Award · Brussels", zh: "🏆 Superior Taste Award · 布鲁塞尔", ko: "🏆 Superior Taste Award · 브뤼셀" },
  tl4_p:    { th: "ขนมที่เริ่มจากครัวที่บ้าน ได้รับการยืนยันจากเวทีนานาชาติที่กรุงบรัสเซลส์", en: "A treat that began in a home kitchen, now recognized on the international stage in Brussels.", zh: "从家庭厨房走出的甜点，获得了布鲁塞尔国际舞台的认证。", ko: "가정의 부엌에서 시작된 디저트가 브뤼셀의 국제 무대에서 인정받았습니다." },
  tl5_year: { th: "2026", en: "2026", zh: "2026", ko: "2026" },
  tl5_h:    { th: "Chiva Cafe + พร้อมส่งออก", en: "Chiva Cafe + Export Ready", zh: "Chiva Cafe + 正式开放出口", ko: "Chiva Cafe + 수출 준비 완료" },
  tl5_p:    { th: "เปิด Chiva Cafe ที่โรงพยาบาลกรุงเทพ และ Frozen Larna Cake พร้อมส่งออกสู่สิงคโปร์ มาเลเซีย และสหรัฐอาหรับเอมิเรตส์", en: "Chiva Cafe opens at Bangkok Hospital, and Frozen Larna Cake becomes export-ready to Singapore, Malaysia, and the UAE.", zh: "Chiva Cafe于曼谷医院开业，Frozen Larna Cake同步开放出口至新加坡、马来西亚与阿联酋。", ko: "방콕 병원(Bangkok Hospital)에 Chiva Cafe가 문을 열고, Frozen Larna Cake는 싱가포르·말레이시아·UAE로 수출할 준비를 마쳤습니다." },

  sp2_eyebrow: { th: "ที่มาของชื่อ", en: "Where the Name Comes From", zh: "品牌名称的由来", ko: "브랜드 이름의 유래" },
  sp2_title:   { th: "ทำไมถึงชื่อ Larna House", en: "Why We're Called Larna House", zh: "为何取名Larna House", ko: "왜 Larna House 인가요" },
  sp2_p1:      { th: "\"Lana Cake\" คือชื่อที่แท้จริงของเค้กช็อกโกแลตหน้านิ่มชนิดนี้ มีต้นกำเนิดจากประเทศสิงคโปร์ แต่คนส่วนใหญ่กลับไม่รู้จักชื่อนี้ ต่างจากทีรามิสุหรือเค้กส้มที่คุ้นหูกันดี เราจึงอยากส่งเสริมให้คนรู้จักชื่อนี้มากขึ้น โดยนำมาดัดแปลงตั้งเป็นชื่อแบรนด์ของตัวเอง", en: "\"Lana Cake\" is the real name of this soft-fudge chocolate cake, originally from Singapore. Yet most people don't know the name — unlike tiramisu or orange cake, which everyone recognizes instantly. We wanted more people to know it, so we adapted it into our own brand name.", zh: "“Lana Cake”其实才是这款软心巧克力蛋糕的正式名称，起源于新加坡。可惜大多数人并不熟悉这个名字，不像提拉米苏或香橙蛋糕那样家喻户晓。我们希望让更多人认识它，于是将其化用为自己的品牌名。", ko: "\"라나 케이크(Lana Cake)\"는 이 소프트 퍼지 초콜릿 케이크의 원래 이름으로, 싱가포르에서 유래했습니다. 하지만 티라미수나 오렌지 케이크와 달리, 대부분의 사람들은 이 이름을 잘 모르죠. 더 많은 사람이 알아주길 바라는 마음에, 이 이름을 브랜드명으로 삼게 되었습니다." },
  sp2_quote:   { th: "คนส่วนใหญ่รู้ว่าทีรามิสุคืออะไร เค้กส้มคืออะไร แต่ไม่ค่อยมีคนรู้ว่า Lana Cake คือเค้กช็อกฯ หน้านิ่ม เราเลยอยากส่งเสริมให้คนได้รู้จักมากขึ้น จึงนำมาดัดแปลงตั้งเป็นชื่อแบรนด์ของตัวเองขึ้นมา", en: "Most people know what tiramisu is, what orange cake is — but hardly anyone knows Lana Cake is a soft-fudge chocolate cake. We wanted to help people learn it, so we turned it into our own brand name.", zh: "大多数人知道提拉米苏是什么、香橙蛋糕是什么，却很少有人知道Lana Cake就是软心巧克力蛋糕。我们希望帮助更多人认识它，于是把它变成了我们自己的品牌名字。", ko: "티라미수가 뭔지, 오렌지 케이크가 뭔지는 다들 알지만 라나 케이크가 소프트 퍼지 초콜릿 케이크라는 건 잘 모르시더라고요. 그래서 사람들이 더 알 수 있도록, 저희 브랜드 이름으로 삼게 됐어요." },

  sp3_eyebrow: { th: "ปรัชญาของเรา", en: "Our Philosophy", zh: "我们的理念", ko: "우리의 철학" },
  sp3_title:   { th: "ไม่ต้องทำเยอะ ทำให้ดีอย่างเดียวไปเลย", en: "Don't Do a Lot. Just Do One Thing Well.", zh: "不必面面俱到，把一件事做到极致就好", ko: "많이 하지 않아도 됩니다, 하나만 제대로 하면 되죠" },
  sp3_p1:      { th: "ตั้งแต่วันแรก เราเลือกโฟกัสเฉพาะเค้กช็อกโกแลตหน้านิ่มและผลิตภัณฑ์จากช็อกโกแลตเท่านั้น เพราะเชื่อว่าช็อกโกแลตเป็นรสชาติคลาสสิกที่ไม่มีวันตกยุค และคนไทยชื่นชอบเนื้อสัมผัสที่นุ่มละมุนเป็นทุนเดิมอยู่แล้ว", en: "From day one, we chose to focus only on soft-fudge chocolate cake and chocolate-based products, believing chocolate is a classic flavor that never goes out of style — and that Thai people already love soft, melt-in-your-mouth textures.", zh: "从第一天起，我们就只专注于软心巧克力蛋糕与巧克力相关产品，因为我们相信巧克力是永不过时的经典风味，而泰国人本就偏爱绵密柔软的口感。", ko: "처음부터 저희는 소프트 퍼지 초콜릿 케이크와 초콜릿 제품에만 집중하기로 했습니다. 초콜릿은 유행을 타지 않는 클래식한 맛이고, 태국 사람들은 원래 부드러운 식감을 좋아한다고 믿었기 때문이죠." },
  sp3_quote:   { th: "ถามว่าทำไมไม่ทำเค้กหลากหลายเหมือนร้านอื่นๆ เพราะเราเชื่อว่าไม่จำเป็นต้องทำหลายอย่างก็ได้ แต่ทำแค่ตัวเดียวให้อร่อยให้คนพูดถึงก็พอ ซึ่งมันก็ได้ผลจริงๆ และทำให้เราอยู่มาได้จนถึงทุกวันนี้", en: "People ask why we don't make many kinds of cake like other shops. We believe you don't need to do a lot of things — just make one thing delicious enough that people talk about it. That's really worked, and it's why we're still here today.", zh: "常有人问，为什么我们不像别的店那样做多种蛋糕。我们相信不必样样都做，只要把一款做到让人念念不忘就够了。事实证明这确实有效，也是我们能走到今天的原因。", ko: "왜 다른 가게들처럼 다양한 케이크를 만들지 않냐고 묻는 분들이 많아요. 저희는 여러 가지를 할 필요는 없다고 믿어요. 하나만 맛있게 만들어서 사람들이 이야기하게 만들면 충분하죠. 실제로 그게 효과가 있었고, 그래서 저희가 지금까지 이어올 수 있었습니다." },
  sp3_promise_h: { th: "สัญญาของเรา", en: "Our Promise", zh: "我们的承诺", ko: "우리의 약속" },
  sp3_p2:        { th: "เค้กที่เราทำ ครอบครัวของเราก็กินด้วย มันจึงต้องมีแต่ส่วนผสมที่ดี ไม่มีวัตถุกันเสีย ไม่มีทางลัด — แป้งสาลีคุณภาพสูง เนยสด น้ำตาลทรายธรรมชาติ และช็อกโกแลตจากโกโก้ไทย ทุกชิ้นอบสดทุกวันที่ครัวกลางพัฒนาการ 61 ก่อนส่งถึงมือคุณ", en: "We eat the same cake we sell our family. That means only good ingredients, no preservatives, no shortcuts — quality wheat flour, fresh butter, natural sugar, and chocolate made from Thai cacao. Every piece is baked fresh daily at our central kitchen on Phatthanakan 61 before it reaches you.", zh: "我们卖的蛋糕，自己家人也在吃。这意味着只用优质原料，不含防腐剂，绝不走捷径——优质小麦粉、新鲜奶油、天然蔗糖，以及以泰国可可制成的巧克力。每一件都在Phatthanakan 61中央厨房每日新鲜烘焙后，才送到你手中。", ko: "저희가 파는 케이크는 저희 가족도 함께 먹는 케이크입니다. 그만큼 좋은 재료만 쓰고, 보존제도 지름길도 없습니다 — 고품질 밀가루, 신선한 버터, 천연 설탕, 그리고 태국 카카오로 만든 초콜릿. 모든 케이크는 파타나칸 61 중앙 주방에서 매일 신선하게 구워진 뒤 여러분께 전달됩니다." },

  sp5_eyebrow: { th: "ลงลึกถึงราก", en: "Down to the Roots", zh: "深耕根源", ko: "뿌리까지 파고들다" },
  sp5_title:   { th: "จากผู้ใช้โกโก้ สู่ผู้สนับสนุนโกโก้ไทย", en: "From Cacao User to Thai Cacao Advocate", zh: "从可可使用者，到泰国可可的推动者", ko: "카카오 사용자에서, 태국 카카오 지지자로" },
  sp5_p1:      { th: "หลังทำเค้กช็อกโกแลตมากว่า 20 ปีโดยใช้ช็อกโกแลตนำเข้าจากต่างประเทศตลอด คุณนภัสพรเพิ่งพบว่าประเทศไทยปลูกต้นโกโก้มานานกว่า 40-50 ปีแล้ว เพียงแต่ยังขาดกรรมวิธีแปรรูปที่ดีพอ สามีของเธอ คุณบดินทร์ เจริญพงศ์ชัย จึงไปศึกษาเพิ่มเติมกับผู้เชี่ยวชาญด้านโกโก้ทั้งในไทยและที่ประเทศเปรู", en: "After 20-plus years of making chocolate cake with imported chocolate, Napatsorn discovered Thailand had actually been growing cacao for 40–50 years — it just lacked good enough processing methods. Her husband, Bodin Charoenpongchai, went on to study cacao processing with experts in both Thailand and Peru.", zh: "在使用进口巧克力制作蛋糕20多年后，纳帕颂才发现泰国其实早已种植可可长达40至50年，只是一直缺乏足够成熟的加工工艺。她的丈夫波丁·扎伦蓬猜（Bodin Charoenpongchai）随后前往泰国及秘鲁向可可专家深入学习加工技术。", ko: "20여 년간 수입 초콜릿으로 케이크를 만들어온 나팟손은, 태국이 이미 40~50년 전부터 카카오를 재배해왔다는 사실을 뒤늦게 알게 됩니다. 다만 제대로 된 가공 방식이 부족했을 뿐이었죠. 남편 보딘 짜른퐁차이(Bodin Charoenpongchai)는 태국과 페루의 카카오 전문가들에게 가공 기술을 배우러 떠났습니다." },
  sp5_p2:      { th: "กลับมาจึงร่วมกันตั้งบริษัท Yellow Chocolate เพื่อรวบรวมทั้งเกษตรกรผู้ปลูกโกโก้ ผู้ผลิตช็อกโกแลตแฮนด์เมดในไทย และคนรักช็อกโกแลตไว้ด้วยกัน โดยใช้ร้าน Larna House เป็นพื้นที่ทดลองนำช็อกโกแลตไทยมาใช้จริง", en: "On his return, they founded Yellow Chocolate — bringing together cacao farmers, Thai handmade chocolate makers, and chocolate lovers, using Larna House itself as a testing ground for putting Thai-grown chocolate to real use.", zh: "回国后，他们共同创立了Yellow Chocolate，将可可种植农户、泰国手工巧克力制造商与巧克力爱好者聚集在一起，并以Larna House作为泰国本土巧克力实际应用的试验场。", ko: "귀국 후 두 사람은 Yellow Chocolate를 설립해 카카오 재배 농가, 태국의 수제 초콜릿 생산자, 그리고 초콜릿 애호가들을 하나로 모았습니다. Larna House 매장 자체를 태국산 초콜릿을 실제로 시험해보는 공간으로 활용하면서 말이죠." },
  sp5_quote:   { th: "เรามีแนวคิดว่าอยากส่งเสริมให้การผลิตช็อกโกแลตในเมืองไทยเติบโตไปอย่างถูกทิศทาง ซึ่งเราเป็นผู้ใช้งาน จึงรู้ว่าต้องการอะไร", en: "We wanted to help Thai chocolate production grow in the right direction. Since we're the ones using it, we know exactly what's needed.", zh: "我们希望能帮助泰国的巧克力生产朝着正确的方向发展。因为我们本身就是使用者，所以清楚自己需要什么。", ko: "태국의 초콜릿 생산이 올바른 방향으로 성장하도록 돕고 싶었어요. 저희가 직접 사용하는 입장이니, 무엇이 필요한지 가장 잘 알거든요." },
  sp5_p3:      { th: "วันนี้ความตั้งใจนั้นเติบโตต่อเป็น Cacao Everywhere ศูนย์รวม Craft Chocolate Café และตลาดโกโก้ไทยที่ใหญ่ที่สุด เมื่อคุณซื้อเค้ก Larna House คุณจึงไม่ได้แค่ฉลองวันเกิด แต่เป็นส่วนหนึ่งของเรื่องราวที่ใหญ่กว่านั้น", en: "Today, that intention has grown into Cacao Everywhere — a craft chocolate café and Thailand's largest Thai cacao marketplace. So when you buy a Larna House cake, you're not just celebrating a birthday — you're part of a bigger story.", zh: "如今，这份初心已成长为Cacao Everywhere——一间精品巧克力咖啡馆，也是泰国最大的泰国可可交易市场。所以当你买下一块Larna House蛋糕时，你庆祝的不只是生日，更是这个更大故事的一部分。", ko: "오늘날 그 마음은 Cacao Everywhere로 성장했습니다. 크래프트 초콜릿 카페이자 태국 최대 규모의 태국 카카오 마켓플레이스죠. 그러니 Larna House 케이크를 사는 것은 단순히 생일을 축하하는 일이 아니라, 그보다 더 큰 이야기의 일부가 되는 일입니다." },

  sp6_eyebrow: { th: "ปัญหา คือ โอกาส", en: "The Problem Was the Opportunity", zh: "问题即是机会", ko: "문제가 곧 기회였습니다" },
  sp6_title:   { th: "เค้กที่อยู่ได้แค่ 10 วัน สู่นวัตกรรมแช่แข็ง 1 ปี", en: "From a 10-Day Cake to a 1-Year Freezing Breakthrough", zh: "从只能存放10天，到实现冷冻1年的技术突破", ko: "10일짜리 케이크에서, 1년 냉동 보관 혁신으로" },
  sp6_p1:      { th: "แม้เค้กช็อกโกแลตหน้านิ่มจะได้รับความนิยมมาก แต่ก็กระจายไปได้ไม่ไกล เพราะเก็บได้เพียง 10 วันเท่านั้น คุณนภัสพรและสามีจึงเข้าไปปรึกษานักวิจัยที่ Innovative House และใช้เวลาพัฒนาร่วมกันนานถึง 2 ปี", en: "As popular as the soft-fudge chocolate cake was, it couldn't travel far — it only kept for 10 days. Napatsorn and her husband turned to researchers at Innovative House, working together for two full years to solve it.", zh: "尽管软心巧克力蛋糕大受欢迎，却始终难以远销，因为保质期仅有10天。纳帕颂夫妇因此向Innovative House的研究人员寻求合作，共同研发长达两年之久。", ko: "소프트 퍼지 초콜릿 케이크는 큰 인기를 얻었지만, 유통기한이 단 10일뿐이라 멀리까지 판매를 확장하기 어려웠습니다. 나팟손 부부는 Innovative House의 연구진과 함께 이 문제를 해결하기 위해 2년에 걸쳐 공동 연구를 진행했습니다." },
  sp6_quote:   { th: "ถึงเราจะเป็นร้านดั้งเดิมที่มีชื่อเสียงมานาน แต่ก็ยังไม่สามารถกระจายออกไปได้ไกลมากกว่านี้ เพราะอายุการเก็บรักษาที่สั้น เราจึงเข้าไปปรึกษานักวิจัยที่ Innovative House ใช้เวลาพัฒนาร่วมกันอยู่ 2 ปี จนตอนนี้สามารถผลิตเค้กที่เก็บรักษาไว้ในช่องฟรีซได้นานกว่า 1 ปี รสชาติและเนื้อสัมผัสยังคงเหมือนเดิม หน้าเค้กไม่แตก", en: "Even as a well-known, long-running shop, we still couldn't distribute far because of the short shelf life. So we consulted researchers at Innovative House, and after 2 years of joint development, we can now make a cake that keeps in the freezer for over a year — same taste, same texture, and the surface doesn't even crack.", zh: "即便我们是经营多年、小有名气的老店，也因为保质期太短而难以远销。于是我们向Innovative House的研究人员求助，历经两年共同研发，如今终于做出能在冷冻室保存一年以上、口感风味不变、表面也不会开裂的蛋糕。", ko: "오랫동안 이름이 알려진 가게였음에도, 짧은 유통기한 때문에 더 멀리 유통할 수 없었어요. 그래서 Innovative House 연구진과 상담했고, 2년간 함께 개발한 끝에 지금은 냉동실에서 1년 넘게 보관해도 맛과 식감이 그대로이고 케이크 표면도 갈라지지 않는 제품을 만들 수 있게 됐습니다." },
  sp6_p2:      { th: "นวัตกรรมนี้เองที่ทำให้เราเริ่มเปิดรับตัวแทนจำหน่ายทั้งในและต่างประเทศได้ และคว้ารางวัล Popular Vote จาก Innovative House Awards 2020 มาครอง ก่อนจะกลายมาเป็น Frozen Larna Cake ที่จำหน่ายผ่านตู้ vending machine ในวันนี้", en: "This very innovation let us start welcoming distributors both in Thailand and abroad, and won the Popular Vote at the Innovative House Awards 2020 — before it became the Frozen Larna Cake sold through vending machines today.", zh: "正是这项创新，让我们得以在国内外开放代理经销，并荣获2020年Innovative House Awards人气大奖——最终演变成如今通过自助售货机销售的Frozen Larna Cake。", ko: "바로 이 혁신 덕분에 국내외 유통 파트너를 모집할 수 있게 되었고, Innovative House Awards 2020에서 인기상(Popular Vote)까지 수상했습니다. 그리고 그 결과가 오늘날 자판기에서 만나는 Frozen Larna Cake입니다." },
  sp6_p3:      { th: "และในปี 2026 Frozen Larna Cake ก็พร้อมส่งออกสู่สิงคโปร์ มาเลเซีย และสหรัฐอาหรับเอมิเรตส์แล้ว — เค้กแช่แข็งที่แก้ปัญหาอายุ 10 วัน วันนี้เดินทางไปได้ไกลกว่าที่ใครเคยคิด", en: "By 2026, Frozen Larna Cake is export-ready to Singapore, Malaysia, and the UAE — a cake once limited to a 10-day shelf life now travels farther than anyone imagined.", zh: "到2026年，Frozen Larna Cake已开放出口至新加坡、马来西亚与阿联酋——这款曾受限于10天保质期的蛋糕，如今走得比任何人预想的都要远。", ko: "2026년, Frozen Larna Cake는 싱가포르, 말레이시아, UAE로 수출할 준비를 마쳤습니다. 한때 유통기한 10일에 갇혀 있던 케이크가, 이제는 누구도 상상하지 못했던 곳까지 나아가고 있습니다." },

  sp_family_eyebrow: { th: "ครอบครัวของเรา", en: "Our Family", zh: "我们的大家庭", ko: "우리의 패밀리 브랜드" },
  sp_family_title:   { th: "Larna House เป็นส่วนหนึ่งของพันธกิจที่ใหญ่กว่า", en: "Larna House Is Part of a Bigger Mission", zh: "Larna House是更大使命的一部分", ko: "Larna House는 더 큰 미션의 일부입니다" },
  spf1_h: { th: "Larna House", en: "Larna House", zh: "Larna House", ko: "Larna House" },
  spf1_p: { th: "เค้กวันเกิดที่เริ่มจากครัวที่บ้าน สู่รางวัลจากเบลเยียม", en: "Birthday cakes that started in a home kitchen and went on to win an award in Belgium.", zh: "从家庭厨房起步，最终荣获比利时奖项的生日蛋糕。", ko: "가정의 부엌에서 시작해 벨기에에서 상을 받은 생일 케이크." },
  spf2_h: { th: "Cacao Everywhere", en: "Cacao Everywhere", zh: "Cacao Everywhere", ko: "Cacao Everywhere" },
  spf2_p: { th: "Craft Chocolate Café และตลาดโกโก้ไทยที่ใหญ่ที่สุด", en: "A craft chocolate café and Thailand's largest Thai cacao marketplace.", zh: "精品巧克力咖啡馆，也是泰国最大的泰国可可交易市场。", ko: "크래프트 초콜릿 카페이자 태국 최대의 태국 카카오 마켓플레이스." },
  spf3_h: { th: "Yellow Chocolate", en: "Yellow Chocolate", zh: "Yellow Chocolate", ko: "Yellow Chocolate" },
  spf3_p: { th: "ช็อกโกแลต social enterprise ที่แบ่งกำไรตรงสู่เกษตรกรไทย", en: "A chocolate social enterprise that shares profit directly with Thai farmers.", zh: "将利润直接分享给泰国农民的巧克力社会企业。", ko: "수익을 태국 농가에 직접 나누는 초콜릿 소셜 엔터프라이즈." },
  spf4_h: { th: "TCCF", en: "TCCF", zh: "TCCF", ko: "TCCF" },
  spf4_p: { th: "Thailand Craft Chocolate Festival เวทียกระดับช็อกโกแลตไทยสู่โลก", en: "Thailand Craft Chocolate Festival — a platform raising Thai chocolate to the world stage.", zh: "泰国精品巧克力节——将泰国巧克力推向世界舞台的平台。", ko: "태국 크래프트 초콜릿 페스티벌 — 태국 초콜릿을 세계 무대로 이끄는 플랫폼." },

  sp_cta_lead: { th: "ทุกครั้งที่คุณสั่งเค้ก Larna คุณช่วยให้เค้กของแม่ยังคงส่งต่อความสุขถึงรุ่นถัดไป เกษตรกรโกโก้ไทยยังมีรายได้ที่ดี และโกโก้ไทยยังเดินหน้าไปสู่เวทีโลก", en: "Every time you order a Larna cake, you help mom's cake keep passing happiness to the next generation, help Thai cacao farmers earn a good living, and help Thai cacao keep moving toward the world stage.", zh: "每一次您订购Larna蛋糕，都在帮助妈妈的蛋糕将幸福传递给下一代，帮助泰国可可农获得更好的收入，也帮助泰国可可持续走向世界舞台。", ko: "Larna 케이크를 주문할 때마다, 어머니의 케이크가 다음 세대에게 행복을 전하도록 돕고, 태국 카카오 농가가 좋은 수입을 얻도록 도우며, 태국 카카오가 세계 무대로 나아가도록 돕는 것입니다." },

  sp7_quote: { th: "ในการทำธุรกิจ เราไม่จำเป็นต้องทำหลายอย่างก็ได้ แต่ทำยังไงให้สิ่งที่ทำอยู่ออกมาดีที่สุด ถ้าเราทำทุกอย่างออกมาดีแล้ว คุณภาพที่เห็นก็จะส่งต่อออกไปเอง โดยที่เราไม่ต้องทุ่มงบโฆษณาหรือโปรโมตอะไรเลย", en: "In business, you don't need to do many things — just do what you do as well as you can. If everything you do is genuinely good, the quality speaks for itself, without needing to pour money into advertising or promotion.", zh: "做生意不必样样都做，只要把手上的事做到最好。只要一切都做得足够好，品质自然会不胫而走，根本不需要投入大量广告或宣传预算。", ko: "사업을 할 때 여러 가지를 할 필요는 없어요. 하고 있는 일을 최대한 잘 해내면 됩니다. 모든 걸 제대로 해내면, 그 품질은 광고나 홍보에 큰돈을 들이지 않아도 저절로 퍼져나가거든요." },
  sp7_who:   { th: "นภัสพร ผลเจริญ · ผู้ก่อตั้ง Larna House", en: "Napatsorn Poncharoen · Founder, Larna House", zh: "纳帕颂·蓬扎伦 · Larna House创始人", ko: "나팟손 폰차른 · Larna House 창업자" },

  sp_cta_title: { th: "ลองรสชาติที่เราภูมิใจที่สุด", en: "Try the Cake We're Proudest Of", zh: "尝尝我们最自豪的滋味", ko: "우리가 가장 자랑스러워하는 맛을 만나보세요" },
  sp_cta_p:     { th: "เค้กช็อกโกแลตหน้านิ่มสูตรดั้งเดิม แช่แข็งได้นาน 12 เดือน พร้อมเสิร์ฟทุกที่ทุกเวลา", en: "The original soft-fudge chocolate cake, now frozen for up to 12 months — ready wherever, whenever.", zh: "经典软心巧克力蛋糕，如今可冷冻保存长达12个月，随时随地即刻享用。", ko: "오리지널 소프트 퍼지 초콜릿 케이크, 이제 최대 12개월 냉동 보관이 가능합니다 — 언제 어디서든 준비되어 있어요." },
  sp_cta_btn:   { th: "ดูรสชาติทั้งหมด", en: "Shop All Flavors", zh: "查看全部口味", ko: "전체 맛 보기" },

  sp_source: { th: "เรียบเรียงจากบทสัมภาษณ์คุณนภัสพร ผลเจริญ ผู้ก่อตั้ง Larna House โดย SME Thailand Club และหน้า About Us อย่างเป็นทางการที่ larnahouse.com", en: "Adapted from an interview with Napatsorn Poncharoen, founder of Larna House, by SME Thailand Club, and the official About Us page at larnahouse.com.", zh: "内容改编自SME Thailand Club对Larna House创始人纳帕颂·蓬扎伦的专访，以及larnahouse.com官方About Us页面。", ko: "SME Thailand Club의 Larna House 창업자 나팟손 폰차른 인터뷰와 larnahouse.com 공식 소개 페이지를 바탕으로 재구성했습니다." }
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
  ["renderProductGrid", "renderNutrition", "renderProductDetail", "renderRelated", "renderOrderPicker", "renderCart"].forEach(fnName => {
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
