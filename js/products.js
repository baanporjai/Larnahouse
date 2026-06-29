/* ===== Frozen Larna Cake — Product Data (4 languages) =====
   Adapted from https://foodcovery.co/frozenlarna — official Larna House product copy,
   translated/localized for this vending-machine showcase site. */

const PRODUCTS = [
  {
    id: "mini-larna",
    price: 60,
    weight: "60 g",
    box: "6.2 × 9.5 × 3.3 cm",
    badge: { th: "ขายดีที่สุด", en: "Bestseller", zh: "畅销款", ko: "베스트셀러" },
    img: "https://ik.imagekit.io/p3u6ogh1n/larnahouse/tr:w-1000,f-webp,quality-100/image/b9ba42cf-25e2-444f-9d44-35f3acdbc12d.png",
    img2: "https://ik.imagekit.io/p3u6ogh1n/larnahouse/tr:w-1000,f-webp,quality-100/image/6e09855e-f33d-4b54-9de9-723c27a98dda.jpeg",
    name: { th: "มินิ ลาร์นา เค้ก (ออริจินัล)", en: "Mini Larna Cake (Original)", zh: "迷你拉尔纳蛋糕（经典原味）", ko: "미니 라르나 케이크 (오리지널)" },
    tag: {
      th: "เค้กช็อกโกแลตหน้านิ่มต้นตำรับ เนื้อฟัดจ์เข้มข้นจากโกโก้ไทย",
      en: "The original soft-fudge chocolate cake, made with Thai cacao",
      zh: "经典软心巧克力蛋糕，采用泰国可可制作",
      ko: "태국 카카오로 만든 오리지널 소프트 퍼지 초콜릿 케이크"
    },
    desc: {
      th: "ลาร์นาเค้กสูตรแช่แข็งรสช็อกโกแลตต้นตำรับ เนื้อฟัดจ์เข้มข้นจากโกโก้ไทยแท้ 100% ความอร่อยที่ทำให้ Larna House ได้รับรางวัล Popular Vote จาก Innovative House Awards 2020",
      en: "The original soft-fudge chocolate cake recipe from Larna House, made with 100% Thai cacao — the recipe that won the Popular Vote award at the Innovative House Awards 2020.",
      zh: "Larna House 经典软心巧克力蛋糕配方，采用100%泰国可可制作——这款配方曾荣获2020年Innovative House Awards人气大奖。",
      ko: "100% 태국 카카오로 만든 Larna House의 오리지널 소프트 퍼지 초콜릿 케이크. 2020 Innovative House Awards 인기상을 수상한 바로 그 레시피입니다."
    },
    serving: {
      th: "อร่อยได้ 2 แบบ — ทานเป็นไอศกรีมเค้กทันทีตอนแช่แข็ง หรือรอละลาย 15–20 นาที ให้กลายเป็นเค้กหน้านิ่ม เก็บต่อในตู้เย็นได้อีก 10 วัน ไม่มีวัตถุกันเสีย",
      en: "Enjoy it two ways: eat it frozen like ice cream cake, or let it thaw 15–20 minutes for the classic soft-fudge texture. Keep refrigerated up to 10 more days. No preservatives.",
      zh: "两种吃法皆可：冷冻状态下如冰淇淋蛋糕般享用，或静置回软15–20分钟，呈现经典绵密口感。解冻后可冷藏保存10天，不含防腐剂。",
      ko: "두 가지 방법으로 즐기세요. 냉동 상태로 아이스크림 케이크처럼 먹거나, 15~20분 자연 해동하여 부드러운 퍼지 케이크로 즐길 수 있습니다. 해동 후 냉장 보관 시 최대 10일 더 보관 가능하며 보존제는 첨가하지 않았습니다."
    }
  },
  {
    id: "mini-white",
    price: 60,
    weight: "60 g",
    box: "6.2 × 9.5 × 3.3 cm",
    badge: { th: "คลาสสิก", en: "Classic", zh: "经典", ko: "클래식" },
    img: "https://ik.imagekit.io/p3u6ogh1n/larnahouse/tr:w-1000,f-webp,quality-100/image/ce05d104-f2e6-419f-9116-4fdb9397c402.png",
    img2: "https://ik.imagekit.io/p3u6ogh1n/larnahouse/tr:w-1000,f-webp,quality-100/image/c5986c21-c5b1-4b3c-9764-2dac5292072e.jpeg",
    name: { th: "มินิ ไวท์ ลาร์นา เค้ก", en: "Mini White Larna Cake", zh: "迷你白巧克力拉尔纳蛋糕", ko: "미니 화이트 라르나 케이크" },
    tag: {
      th: "เนื้อไวท์ช็อกโกแลตนุ่มละมุน หวานกำลังดี",
      en: "Creamy white chocolate, delicately sweet",
      zh: "丝滑白巧克力，甜度恰到好处",
      ko: "부드러운 화이트 초콜릿, 적당한 단맛"
    },
    desc: {
      th: "ลาร์นาเค้กสูตรแช่แข็งรสไวท์ช็อกโกแลต เนื้อนุ่มละมุน หวานละมุนกำลังดี เวอร์ชันไวท์ช็อกโกแลตของเค้กต้นตำรับที่ทุกคนหลงรัก",
      en: "A soft white chocolate version of the original Larna Cake — creamy, delicately sweet, and just as indulgent frozen or thawed.",
      zh: "经典拉尔纳蛋糕的白巧克力版本——口感绵密细腻，甜度适中，无论冷冻或解冻后食用都同样美味。",
      ko: "오리지널 라르나 케이크의 화이트 초콜릿 버전. 부드럽고 은은한 단맛이 특징이며, 냉동 또는 해동 후 모두 맛있게 즐길 수 있습니다."
    },
    serving: {
      th: "อร่อยได้ 2 แบบ — ไอศกรีมเค้กตอนแช่แข็ง หรือเค้กหน้านิ่มเมื่อรอ 15–20 นาที เก็บต่อในตู้เย็นได้อีก 10 วัน ไม่มีวัตถุกันเสีย",
      en: "Enjoy frozen like ice cream cake, or thawed 15–20 minutes for a soft texture. Refrigerate up to 10 more days. No preservatives.",
      zh: "冷冻享用如冰淇淋蛋糕，或静置15–20分钟回软享用。解冻后可冷藏保存10天，不含防腐剂。",
      ko: "냉동 상태로 아이스크림 케이크처럼, 또는 15~20분 해동하여 부드럽게 즐기세요. 해동 후 최대 10일 냉장 보관 가능, 보존제 무첨가."
    }
  },
  {
    id: "mini-matcha",
    price: 60,
    weight: "60 g",
    box: "6.2 × 9.5 × 3.3 cm",
    badge: { th: "รสชาเขียว", en: "Matcha", zh: "抹茶口味", ko: "마차맛" },
    img: "https://ik.imagekit.io/p3u6ogh1n/larnahouse/tr:w-1000,f-webp,quality-100/image/bb498dc1-b96a-4fd2-bb90-3acbdaecce56.png",
    img2: "https://ik.imagekit.io/p3u6ogh1n/larnahouse/tr:w-1000,f-webp,quality-100/image/02d41dd0-4feb-4770-a714-274725e9326b.jpeg",
    name: { th: "มินิ มัทฉะ ลาร์นา เค้ก", en: "Mini Matcha Larna Cake", zh: "迷你抹茶拉尔纳蛋糕", ko: "미니 마차 라르나 케이크" },
    tag: {
      th: "มัทฉะแท้กลมกล่อม หอมชาเขียวเข้มข้น",
      en: "Real matcha, rich and aromatic",
      zh: "真正抹茶，香气浓郁",
      ko: "진짜 마차, 풍부하고 향긋한 향"
    },
    desc: {
      th: "ลาร์นาเค้กสูตรแช่แข็งรสชาเขียวมัทฉะ ผสานความขมละมุนของมัทฉะแท้เข้ากับไวท์ช็อกโกแลตเนื้อนุ่ม กลมกล่อมหอมชาในทุกคำ",
      en: "Frozen Larna Cake in matcha green tea flavor — earthy, aromatic matcha balanced with creamy white chocolate.",
      zh: "抹茶口味的拉尔纳冷冻蛋糕——浓郁的抹茶香气与丝滑白巧克力完美融合。",
      ko: "그린티 마차 맛 프로즌 라르나 케이크. 진한 마차 향과 부드러운 화이트 초콜릿이 조화를 이룹니다."
    },
    serving: {
      th: "อร่อยได้ 2 แบบ — ไอศกรีมเค้กตอนแช่แข็ง หรือเค้กหน้านิ่มเมื่อรอ 15–20 นาที เก็บต่อในตู้เย็นได้อีก 10 วัน ไม่มีวัตถุกันเสีย",
      en: "Enjoy frozen like ice cream cake, or thawed 15–20 minutes for a soft texture. Refrigerate up to 10 more days. No preservatives.",
      zh: "冷冻享用如冰淇淋蛋糕，或静置15–20分钟回软享用。解冻后可冷藏保存10天，不含防腐剂。",
      ko: "냉동 상태로 아이스크림 케이크처럼, 또는 15~20분 해동하여 부드럽게 즐기세요. 해동 후 최대 10일 냉장 보관 가능, 보존제 무첨가."
    }
  },
  {
    id: "mini-thai-tea",
    price: 60,
    weight: "60 g",
    box: "6.2 × 9.5 × 3.3 cm",
    badge: { th: "รสไทย", en: "Thai Flavor", zh: "泰式风味", ko: "태국 풍미" },
    img: "https://ik.imagekit.io/p3u6ogh1n/larnahouse/tr:w-1000,f-webp,quality-100/image/d275d3b0-7f44-447d-a6d2-7b069ae533c9.png",
    img2: "https://ik.imagekit.io/p3u6ogh1n/larnahouse/tr:w-1000,f-webp,quality-100/image/5d9e14ba-aa60-4cf2-b0b0-93b59e6d8b4f.jpeg",
    name: { th: "มินิ ชาไทย ลาร์นา เค้ก", en: "Mini Thai Tea Larna Cake", zh: "迷你泰式奶茶拉尔纳蛋糕", ko: "미니 타이티 라르나 케이크" },
    tag: {
      th: "ชาไทยเข้มข้นผสานไวท์ช็อกโกแลต",
      en: "Bold Thai tea meets white chocolate",
      zh: "浓郁泰式茶香与白巧克力交融",
      ko: "진한 태국식 밀크티와 화이트 초콜릿의 만남"
    },
    desc: {
      th: "สายชาไทยห้ามพลาด! เค้กไอศกรีมชาไทยมินิที่ผสมผสานชาไทยเข้มข้นกับไวท์ช็อกโกแลตได้อย่างลงตัว หวานละมุนไม่หวานเกินไป ฐานเค้กชาไทยหน้านิ่ม ชงสดใหม่ทุกครั้งจากชาไทยแท้ ไวท์ช็อกโกแลต และครีมสด",
      en: "A mini Thai-tea ice cream cake that blends bold, freshly brewed Thai tea with creamy white chocolate — sweet but never overpowering. Perfect as a snack or a gift for any occasion.",
      zh: "迷你泰式奶茶冰淇淋蛋糕，将浓郁的现泡泰式茶与丝滑白巧克力完美融合，甜而不腻。无论作为零食还是礼物，都是绝佳之选。",
      ko: "진하게 우린 태국식 밀크티와 부드러운 화이트 초콜릿이 어우러진 미니 타이티 아이스크림 케이크. 적당히 달콤해 간식이나 선물용으로도 좋습니다."
    },
    serving: {
      th: "อร่อยได้ 2 แบบ — ไอศกรีมเค้กตอนแช่แข็ง หรือเค้กหน้านิ่มเมื่อรอ 15–20 นาที เก็บต่อในตู้เย็นได้อีก 10 วัน ไม่มีวัตถุกันเสีย",
      en: "Enjoy frozen like ice cream cake, or thawed 15–20 minutes for a soft texture. Refrigerate up to 10 more days. No preservatives.",
      zh: "冷冻享用如冰淇淋蛋糕，或静置15–20分钟回软享用。解冻后可冷藏保存10天，不含防腐剂。",
      ko: "냉동 상태로 아이스크림 케이크처럼, 또는 15~20분 해동하여 부드럽게 즐기세요. 해동 후 최대 10일 냉장 보관 가능, 보존제 무첨가."
    }
  },
  {
    id: "mini-espresso",
    price: 60,
    weight: "60 g",
    box: "6.2 × 9.5 × 3.3 cm",
    badge: { th: "รสกาแฟ", en: "Coffee", zh: "咖啡口味", ko: "커피맛" },
    img: "https://ik.imagekit.io/p3u6ogh1n/larnahouse/tr:w-1000,f-webp,quality-100/image/b6aa3bc2-6ba9-4733-ac16-628551b4e9f4.png",
    img2: "https://ik.imagekit.io/p3u6ogh1n/larnahouse/tr:w-1000,f-webp,quality-100/image/ff2bb4e8-b837-4574-93ab-7e4a2ed4285c.jpeg",
    name: { th: "มินิ เอสเพรสโซ่ ลาร์นา เค้ก", en: "Mini Espresso Larna Cake", zh: "迷你浓缩咖啡拉尔纳蛋糕", ko: "미니 에스프레소 라르나 케이크" },
    tag: {
      th: "ไวท์ช็อกโกแลตตัดรสกาแฟเอสเพรสโซ่",
      en: "White chocolate cut with bold espresso",
      zh: "白巧克力与浓缩咖啡的完美碰撞",
      ko: "화이트 초콜릿과 진한 에스프레소의 조화"
    },
    desc: {
      th: "ลาร์นาเค้กสูตรแช่แข็งรสกาแฟเอสเพรสโซ่ เนื้อไวท์ช็อกโกแลตตัดรสกาแฟ ขนาดพอดีคำ ทานได้ทั้งแบบเย็นจัดเหมือนไอศกรีมหรือแบบนุ่มละมุน ไม่ใส่วัตถุกันเสีย อร่อยแบบปลอดภัย",
      en: "A bite-sized frozen white chocolate cake infused with bold espresso coffee flavor. Enjoy it ice-cold like ice cream, or soft and fudgy once thawed. No preservatives.",
      zh: "一口大小的冷冻白巧克力蛋糕，融入浓郁的浓缩咖啡风味。可冰冻成冰淇淋般享用，解冻后则呈现绵密软糯的口感，不含防腐剂。",
      ko: "진한 에스프레소 향을 더한 한입 크기의 화이트 초콜릿 냉동 케이크. 차갑게 아이스크림처럼 즐기거나 해동하여 부드럽게 즐길 수 있으며, 보존제는 첨가하지 않았습니다."
    },
    serving: {
      th: "อร่อยได้ 2 แบบ — ไอศกรีมเค้กตอนแช่แข็ง หรือเค้กหน้านิ่มเมื่อรอ 15–20 นาที เก็บต่อในตู้เย็นได้อีก 10 วัน",
      en: "Enjoy frozen like ice cream cake, or thawed 15–20 minutes for a soft texture. Refrigerate up to 10 more days.",
      zh: "冷冻享用如冰淇淋蛋糕，或静置15–20分钟回软享用。解冻后可冷藏保存10天。",
      ko: "냉동 상태로 아이스크림 케이크처럼, 또는 15~20분 해동하여 부드럽게 즐기세요. 해동 후 최대 10일 냉장 보관 가능합니다."
    }
  },
  {
    id: "mini-mango",
    price: 80,
    weight: "60 g",
    box: "6.2 × 9.5 × 3.3 cm",
    badge: { th: "ลิมิเต็ดซีซัน", en: "Seasonal", zh: "季节限定", ko: "시즌 한정" },
    img: "https://ik.imagekit.io/p3u6ogh1n/larnahouse/tr:w-1000,f-webp,quality-100/image/760dd9c1-ce08-4a5f-bbb3-b07a907e7d00.png",
    name: { th: "มินิ มะม่วง ลาร์นา เค้ก", en: "Mini Mango Larna Cake", zh: "迷你芒果拉尔纳蛋糕", ko: "미니 망고 라르나 케이크" },
    tag: {
      th: "มะม่วงน้ำดอกไม้พรีเมียม ผสานไวท์ช็อกโกแลต",
      en: "Premium Nam Dok Mai mango meets white chocolate",
      zh: "优质水仙芒果与白巧克力的结合",
      ko: "프리미엄 남독마이 망고와 화이트 초콜릿의 만남"
    },
    desc: {
      th: "Tropical Twist ในแบบฉบับ Larna House! มะม่วงน้ำดอกไม้พรีเมียมหวานฉ่ำสดใหม่ ผสานความละมุนของไวท์ช็อกโกแลตลาร์นาเค้กต้นตำรับ ความสดใสของฤดูร้อนในทุกคำที่ตัก",
      en: "A tropical twist on the original — premium Nam Dok Mai mango paired with the silky original white chocolate Larna Cake. Delicious frozen like ice cream, just as good soft and thawed.",
      zh: "经典蛋糕的热带新风味——优质泰国水仙芒果与丝滑原味白巧克力拉尔纳蛋糕完美搭配。冷冻享用如冰淇淋般清爽，解冻后则绵软可口。",
      ko: "오리지널 케이크에 트로피컬한 변화를 더했습니다. 프리미엄 남독마이 망고와 부드러운 오리지널 화이트 초콜릿 라르나 케이크의 조합. 냉동 상태로 아이스크림처럼 즐기거나 해동하여 부드럽게 즐겨보세요."
    },
    serving: {
      th: "หลังได้รับสินค้าควรแช่ช่องแข็งเพื่อทานแบบไอศกรีม หากต้องการทานแบบเค้กหน้านิ่มควรแช่ตู้เย็นและทานภายใน 3 วัน เพื่อความสดใหม่ที่สุด",
      en: "Keep frozen for the ice-cream texture. For the soft-cake texture, refrigerate and enjoy within 3 days for best freshness.",
      zh: "冷冻保存可享受冰淇淋般口感；若想品尝绵软蛋糕口感，请冷藏并在3天内食用，以保持最佳新鲜度。",
      ko: "아이스크림 같은 식감을 원하면 냉동 보관하세요. 부드러운 케이크 식감을 원하면 냉장 보관 후 신선도를 위해 3일 이내에 드세요."
    }
  },
  {
    id: "mini-dubai-pistachio",
    price: 80,
    weight: "60 g",
    box: "6.2 × 9.5 × 3.3 cm",
    badge: { th: "ไวรัลทั้งโลก", en: "Viral", zh: "全球爆红", ko: "전세계 화제" },
    img: "https://ik.imagekit.io/p3u6ogh1n/larnahouse/tr:w-1000,f-webp,quality-100/image/e41031d6-3b6d-4bb2-83be-b56d1decae43.png",
    name: { th: "มินิ ดูไบ ลาร์นา เค้ก พิสตาชิโอ", en: "Mini Dubai Larna Cake Pistachio", zh: "迷你迪拜开心果拉尔纳蛋糕", ko: "미니 두바이 라르나 케이크 피스타치오" },
    tag: {
      th: "พิสตาชิโอแท้ + เส้นกรอบคูนาฟ่าสุดฮิต",
      en: "Real pistachio + viral crispy kunafa",
      zh: "真开心果 + 风靡全网的库纳法脆丝",
      ko: "진짜 피스타치오 + 화제의 바삭한 쿠나파"
    },
    desc: {
      th: "เค้กช็อกโกแลตดูไบ ไส้พิสตาชิโอและเส้นกรอบคูนาฟ่าสุดฮิตในโลก social! เต็มคำด้วยพิสตาชิโอแท้ๆที่คัดสรรมาอย่างดี ผสานกับความเข้มข้นของช็อกโกแลตไทยคุณภาพสูงอย่างกลมกล่อม เส้นกรอบคูนาฟ่าให้สัมผัสกรอบพิเศษ ไส้พิสตาชิโอมันเต็มคำ หวานน้อยเพื่อสุขภาพ ไม่เติมไวท์ช็อกโกแลตหรือน้ำตาลในไส้",
      en: "The viral Dubai chocolate cake — real pistachio filling and crispy kunafa strands layered with rich, high-quality Thai chocolate. Less sweet, with no added white chocolate or sugar in the filling. Just as good frozen or thawed.",
      zh: "风靡全网的\"迪拜巧克力蛋糕\"——选用真正的开心果馅料与酥脆的库纳法丝，搭配浓郁优质的泰国巧克力。馅料未额外添加白巧克力或糖，甜度更低更健康，冷冻或解冻后食用都很美味。",
      ko: "소셜 미디어에서 화제가 된 두바이 초콜릿 케이크. 진짜 피스타치오 필링과 바삭한 쿠나파가 풍부한 태국 초콜릿과 어우러집니다. 필링에 화이트 초콜릿이나 설탕을 추가하지 않아 덜 달고, 냉동이나 해동 상태 모두 맛있게 즐길 수 있습니다."
    },
    serving: {
      th: "อร่อยได้ 2 แบบ — ไอศกรีมเค้กตอนแช่แข็ง หรือเค้กหน้านิ่มเมื่อรอ 15–20 นาที เก็บต่อในตู้เย็นได้อีก 10 วัน ไม่มีวัตถุกันเสีย",
      en: "Enjoy frozen like ice cream cake, or thawed 15–20 minutes for a soft texture. Refrigerate up to 10 more days. No preservatives.",
      zh: "冷冻享用如冰淇淋蛋糕，或静置15–20分钟回软享用。解冻后可冷藏保存10天，不含防腐剂。",
      ko: "냉동 상태로 아이스크림 케이크처럼, 또는 15~20분 해동하여 부드럽게 즐기세요. 해동 후 최대 10일 냉장 보관 가능, 보존제 무첨가."
    }
  },
  {
    id: "crispy-larna",
    price: 80,
    weight: "60 g",
    box: "6.2 × 9.5 × 3.3 cm",
    badge: { th: "รางวัล 2024", en: "Award 2024", zh: "2024获奖", ko: "2024 수상작" },
    img: "https://ik.imagekit.io/p3u6ogh1n/larnahouse/tr:w-1000,f-webp,quality-100/image/cdb3545b-9fc4-4931-a8ae-bb4f2d96e7f0.png",
    name: { th: "ครันชี่ ลาร์นา เค้ก", en: "Crispy Larna Cake", zh: "脆脆拉尔纳蛋糕", ko: "크리스피 라르나 케이크" },
    tag: {
      th: "เนื้อนุ่มของบราวนี่รางวัล ผสานครันชี่กรุบกรอบ",
      en: "Award-winning brownie base meets crunchy topping",
      zh: "获奖布朗尼底层搭配酥脆配料",
      ko: "수상작 브라우니 베이스와 바삭한 토핑의 만남"
    },
    desc: {
      th: "NEW ARRIVAL! เค้กช็อกโกแลตกรอบสุดฮิตในรูปแบบแช่แข็ง บนฐานบราวนี่เจ้าของรางวัล Superior Taste Award 2024 — ฐานลาร์นาเค้กเนื้อนุ่มสูตรออริจินอล ตรงกลางคือ Dark Chocolate Fudge พรีเมียมและเนยถั่วคุณภาพเยี่ยมจาก I'M NUTS ด้านบนคือ Crispy Topping ครันชี่กรุบกรอบในทุกคำที่ตัก นิยามใหม่ของคำว่า Next-Level Texture",
      en: "NEW! A frozen take on our viral Crispy Chocolate cake, built on our award-winning brownie base (Superior Taste Award 2024). Layered with premium dark chocolate fudge and peanut butter from I'M NUTS, finished with a crunchy crispy topping — next-level texture in every bite.",
      zh: "新品上市！风靡一时的\"脆脆巧克力蛋糕\"全新冷冻版本，以荣获2024年Superior Taste Award的获奖布朗尼为底层，叠加优质黑巧克力软糖与I'M NUTS花生酱，最后撒上酥脆配料——每一口都充满层次感。",
      ko: "신제품! 화제의 크리스피 초콜릿 케이크를 냉동 버전으로 새롭게 선보입니다. 2024 Superior Taste Award 수상에 빛나는 브라우니 베이스 위에 프리미엄 다크 초콜릿 퍼지와 I'M NUTS 피넛버터를 더하고, 바삭한 크리스피 토핑으로 마무리했습니다. 한입마다 새로운 식감을 경험하세요."
    },
    serving: {
      th: "หลังได้รับสินค้าควรแช่ช่องแข็งเพื่อทานแบบไอศกรีม หากต้องการทานแบบเค้กหน้านิ่มควรแช่ตู้เย็นและทานภายใน 3 วัน เพื่อความสดใหม่ที่สุด",
      en: "Keep frozen for the ice-cream texture. For the soft-cake texture, refrigerate and enjoy within 3 days for best freshness.",
      zh: "冷冻保存可享受冰淇淋般口感；若想品尝绵软蛋糕口感，请冷藏并在3天内食用，以保持最佳新鲜度。",
      ko: "아이스크림 같은 식감을 원하면 냉동 보관하세요. 부드러운 케이크 식감을 원하면 냉장 보관 후 신선도를 위해 3일 이내에 드세요."
    }
  }
];

function getProduct(id){
  return PRODUCTS.find(p => p.id === id);
}
