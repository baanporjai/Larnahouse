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
    video: "74taRlPC1eo",
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
    img2: "images/crunchy.jpg",
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
    },
    layers: [
      {
        icon: "🌋",
        h: { th: "ชั้นที่ 1 · เค้กหน้านิ่มลาวา", en: "Layer 1 · Lava Soft Cake", zh: "第一层 · 熔岩软蛋糕", ko: "1층 · 라바 소프트 케이크" },
        p: {
          th: "ช็อกโกแลตเข้ม บาลานซ์ ไม่หวานแหลม สูตรเดิมของ Larna House ที่ทำให้ \"เยิ้ม\" ขึ้นกว่าเดิม ด้วยเทคนิคพิเศษเก็บความชุ่มฉ่ำให้นานขึ้น",
          en: "Rich, balanced dark chocolate — not overly sweet. Larna House's original recipe, made even more molten with a special technique that keeps it moist longer.",
          zh: "浓郁均衡的黑巧克力，甜度适中。Larna House原创配方，运用特殊工艺让口感更加\"熔岩流心\"，湿润度维持更久。",
          ko: "진하고 균형 잡힌 다크 초콜릿, 과하게 달지 않아요. Larna House의 오리지널 레시피에 특별한 기법을 더해 더욱 촉촉하고 라바처럼 흐르는 식감을 오래 유지합니다."
        }
      },
      {
        icon: "🥜",
        h: { th: "ชั้นที่ 2 · เพสถั่วบดจาก I'M NUTS", en: "Layer 2 · Nut Paste by I'M NUTS", zh: "第二层 · I'M NUTS坚果酱", ko: "2층 · I'M NUTS 넛 페이스트" },
        p: {
          th: "อัลมอนด์คั่วอุณหภูมิกลาง-สูงเพื่อดึงกลิ่นหอมมัน ผสมพีนัทคัดขนาดสม่ำเสมอ บดจนเนียนละลายในปาก จากอัตราส่วนที่ทดลองหลายรอบจนลงตัวกับช็อกโกแลตพอดี",
          en: "Almonds roasted at medium-high heat for a nutty-toasty aroma, blended with evenly-sized peanuts and ground until smooth and melt-in-your-mouth — a ratio tested many times to balance perfectly with the chocolate.",
          zh: "杏仁以中高温烘烤，激发浓郁坚果香气，搭配大小均匀的花生，研磨至丝滑入口即化——经过多次试验才找到与巧克力完美平衡的比例。",
          ko: "중고온에서 볶아 고소한 향을 살린 아몬드에 크기가 고른 땅콩을 더해, 입에서 사르르 녹을 때까지 갈아냈습니다. 초콜릿과 완벽하게 어우러지는 비율을 찾기까지 수차례 테스트를 거쳤습니다."
        }
      },
      {
        icon: "✨",
        h: { th: "ชั้นที่ 3 · ครันชี่ท็อปปิ้ง รางวัล Taste Awards 2024", en: "Layer 3 · Award-Winning Crispy Topping", zh: "第三层 · 获奖酥脆配料", ko: "3층 · 수상작 크리스피 토핑" },
        p: {
          th: "เบสครั้นชี่สูตรลับที่ให้เสียง \"กรุบกรอบ\" เคลือบด้วยช็อกโกแลตคุณภาพดีเพื่อคงความกรอบให้อยู่ได้นาน สัมผัสครบทั้งกรอบ เยิ้ม และนุ่ม ในคำเดียว",
          en: "A secret crunchy base with a satisfying crackle, coated in quality chocolate to keep it crisp for longer — crunchy, molten, and soft, all in one bite.",
          zh: "秘制酥脆底料带来满足的\"咔滋\"声，外层裹以优质巧克力以保持长久酥脆——酥脆、熔岩流心与柔软，三种口感一口俱全。",
          ko: "만족스러운 바삭함을 주는 시크릿 크런치 베이스에 고급 초콜릿을 코팅해 바삭함을 오래 유지합니다. 바삭함, 라바의 촉촉함, 부드러움을 한입에 모두 느껴보세요."
        }
      }
    ],
    enjoyTips: [
      { th: "ยิ่งเย็นจัด ยิ่งได้ยินเสียงกรุบกรอบชัดในทุกคำที่ตัก", en: "The colder it is, the more satisfying the crunch in every spoonful.", zh: "越冰越能在每一口都听见清脆的咔滋声。", ko: "차가울수록 한 입 한 입마다 바삭한 소리가 더 선명하게 느껴져요." },
      { th: "จับคู่กับกาแฟดำ ช็อกโกแลตร้อน หรือชาไม่หวาน จะช่วยดึงกลิ่นถั่วให้เด่นขึ้น", en: "Pair with black coffee, hot chocolate, or unsweetened tea to bring out the nutty aroma.", zh: "搭配黑咖啡、热巧克力或无糖茶，能让坚果香气更加突出。", ko: "블랙커피, 핫초콜릿, 또는 무가당 차와 함께 즐기면 고소한 견과류 향이 더욱 살아납니다." },
      { th: "เหมาะเป็นของขวัญหรือของหวานปาร์ตี้ออฟฟิศ ตัดแชร์ง่าย ถ่ายรูปสวย", en: "Great as a gift or an office party dessert — easy to slice and share, and photogenic too.", zh: "非常适合作为礼物或办公室聚会甜点——方便分切分享，拍照也好看。", ko: "선물이나 오피스 파티 디저트로도 좋아요. 자르기 쉽고 나눠 먹기 좋으며 사진도 예쁘게 나옵니다." }
    ],
    productFaq: [
      {
        q: { th: "หวานไหม?", en: "Is it very sweet?", zh: "甜度高吗？", ko: "많이 달콤한가요?" },
        a: {
          th: "สูตรนี้บาลานซ์ หวานน้อยกว่าเค้กช็อกโกแลตที่ขายทั่วไป ทานได้บ่อยไม่เลี่ยน",
          en: "This recipe is well-balanced and less sweet than typical chocolate cakes — easy to enjoy often without feeling too rich.",
          zh: "这款配方口感均衡，甜度低于市面上常见的巧克力蛋糕，可以经常享用而不腻。",
          ko: "이 레시피는 균형 잡힌 단맛으로, 일반적인 초콜릿 케이크보다 덜 달아서 자주 즐기기 좋습니다."
        }
      },
      {
        q: { th: "เด็กทานได้ไหม?", en: "Can kids eat it?", zh: "小朋友可以吃吗？", ko: "아이도 먹을 수 있나요?" },
        a: {
          th: "ได้ครับ แต่มีส่วนผสมของถั่ว (อัลมอนด์และพีนัท) หากมีอาการแพ้ถั่วควรหลีกเลี่ยง",
          en: "Yes, but it contains nuts (almond and peanut) — please avoid if you have a nut allergy.",
          zh: "可以，但含有坚果成分（杏仁与花生），如对坚果过敏请避免食用。",
          ko: "네, 가능합니다. 다만 아몬드와 땅콩 등 견과류가 들어있으니 견과류 알레르기가 있다면 피해주세요."
        }
      }
    ]
  },
  {
    id: "marshmallow-cookie",
    frozen: false,
    price: 60,
    weight: "40 g",
    box: "ถุงซีลเดี่ยว 1 ชิ้น",
    badge: { th: "ของใหม่", en: "New", zh: "新品", ko: "신제품" },
    img: "https://ik.imagekit.io/p3u6ogh1n/larnahouse/tr:w-1000,f-webp,quality-100/image/c3453369-727c-441f-b73d-0700efcb2291.png",
    name: { th: "คุกกี้มาร์ชเมลโล่ ลาร์นา", en: "Larna Marshmallow Cookie", zh: "拉尔纳棉花糖曲奇", ko: "라르나 마시멜로 쿠키" },
    tag: {
      th: "คุกกี้ช็อกโกแลตมาร์ชเมลโล่ล้วน ใช้ช็อกโกแลตฝีมือคนไทยจากน่าน",
      en: "Classic chocolate marshmallow cookie made with handcrafted Thai chocolate from Nan",
      zh: "经典巧克力棉花糖曲奇，选用南邦手工泰式巧克力",
      ko: "난(Nan) 지방 수제 태국 초콜릿으로 만든 클래식 초콜릿 마시멜로 쿠키"
    },
    desc: {
      th: "คุกกี้ช็อกโกแลตมาร์ชเมลโล่ล้วน สูตรพิเศษที่ใช้ช็อกโกแลตฝีมือคนไทยจากจังหวัดน่านเป็นวัตถุดิบหลัก ผสมผสานกับช็อกโกแลตหลายชนิด ใส่แป้งน้อย แต่อัดแน่นไปด้วยมาร์ชเมลโล่ชิ้นใหญ่ทั่วทั้งชิ้น เน้นเพิ่มเนื้อช็อกโกแลตเพื่อเสริมรสชาติ แทนการลดความหวานด้วยสารให้ความหวานสังเคราะห์",
      en: "A one-of-a-kind cookie made with handcrafted Thai chocolate from Nan province as the main ingredient, blended with several types of chocolate. Less flour, with big marshmallow chunks packed into every bite. We use more chocolate mass to boost flavor rather than swapping in artificial sweeteners to cut sweetness.",
      zh: "原味棉花糖曲奇，主要采用泰国南邦府手工制作的巧克力为原料，并混合多种巧克力。面粉用量较少，每一口都能吃到大块棉花糖。我们选择增加巧克力用量来提升风味，而非用人工代糖降低甜度。",
      ko: "태국 난(Nan) 지방에서 수제로 만든 초콜릿을 주재료로 하고 여러 종류의 초콜릿을 배합한 특별한 쿠키입니다. 밀가루는 적게, 큼직한 마시멜로 조각은 한입 가득 넣었습니다. 인공 감미료로 단맛을 줄이는 대신 초콜릿 함량을 늘려 풍미를 살렸습니다."
    },
    serving: {
      th: "เก็บในภาชนะปิดสนิทที่อุณหภูมิห้อง หลีกเลี่ยงความชื้นและแสงแดดโดยตรง เพื่อความกรอบอร่อยที่สุด",
      en: "Store in an airtight container at room temperature, away from moisture and direct sunlight, for the best texture.",
      zh: "请存放于密封容器中，置于室温环境，避免潮湿与阳光直射，以保持最佳口感。",
      ko: "최상의 식감을 위해 밀폐 용기에 담아 실온에서 보관하고, 습기와 직사광선을 피해주세요."
    }
  },
  {
    id: "marshmallow-cookie-nibs",
    frozen: false,
    price: 60,
    weight: "40 g",
    box: "ถุงซีลเดี่ยว 1 ชิ้น",
    badge: { th: "ของใหม่", en: "New", zh: "新品", ko: "신제품" },
    img: "https://ik.imagekit.io/p3u6ogh1n/larnahouse/tr:w-1000,f-webp,quality-100/image/596dc111-1ee5-4b04-8004-735716d98543.png",
    name: { th: "คุกกี้มาร์ชเมลโล่คาเคานิบส์ ลาร์นา", en: "Larna Marshmallow & Cacao Nibs Cookie", zh: "拉尔纳棉花糖可可粒曲奇", ko: "라르나 마시멜로 카카오닙스 쿠키" },
    tag: {
      th: "คุกกี้ช็อกโกแลตมาร์ชเมลโล่ผสมคาเคานิบส์ กรุบกรอบ หอมโกโก้แท้",
      en: "Chocolate marshmallow cookie with crunchy cacao nibs and real cacao aroma",
      zh: "巧克力棉花糖曲奇，加入酥脆可可粒，可可香气浓郁",
      ko: "바삭한 카카오닙스와 진한 카카오 향의 초콜릿 마시멜로 쿠키"
    },
    desc: {
      th: "คุกกี้ช็อกโกแลตมาร์ชเมลโล่สูตรพิเศษ ใช้ช็อกโกแลตฝีมือคนไทยจากจังหวัดน่านเป็นวัตถุดิบหลัก ผสมผสานกับช็อกโกแลตหลายชนิด ใส่แป้งน้อย แต่อัดแน่นไปด้วยมาร์ชเมลโล่ชิ้นใหญ่ทั่วทั้งชิ้น เสริมด้วยคาเคานิบส์กรุบกรอบ ให้สัมผัสและกลิ่นหอมโกโก้แท้เข้มข้นยิ่งขึ้น เน้นเพิ่มเนื้อช็อกโกแลตเพื่อเสริมรสชาติ แทนการลดความหวานด้วยสารให้ความหวานสังเคราะห์",
      en: "A one-of-a-kind cookie made with handcrafted Thai chocolate from Nan province as the main ingredient, blended with several types of chocolate. Less flour, with big marshmallow chunks packed into every bite, finished with crunchy cacao nibs for extra texture and real cacao aroma. We use more chocolate mass to boost flavor rather than swapping in artificial sweeteners to cut sweetness.",
      zh: "特色曲奇，主要采用泰国南邦府手工制作的巧克力为原料，并混合多种巧克力。面粉用量较少，每一口都能吃到大块棉花糖，再加入酥脆可可粒，带来更浓郁的可可香气与口感。我们选择增加巧克力用量来提升风味，而非用人工代糖降低甜度。",
      ko: "태국 난(Nan) 지방에서 수제로 만든 초콜릿을 주재료로 하고 여러 종류의 초콜릿을 배합한 특별한 쿠키입니다. 밀가루는 적게, 큼직한 마시멜로 조각을 가득 넣고 바삭한 카카오닙스를 더해 식감과 진한 카카오 향을 살렸습니다. 인공 감미료로 단맛을 줄이는 대신 초콜릿 함량을 늘려 풍미를 살렸습니다."
    },
    serving: {
      th: "เก็บในภาชนะปิดสนิทที่อุณหภูมิห้อง หลีกเลี่ยงความชื้นและแสงแดดโดยตรง เพื่อความกรอบอร่อยที่สุด",
      en: "Store in an airtight container at room temperature, away from moisture and direct sunlight, for the best texture.",
      zh: "请存放于密封容器中，置于室温环境，避免潮湿与阳光直射，以保持最佳口感。",
      ko: "최상의 식감을 위해 밀폐 용기에 담아 실온에서 보관하고, 습기와 직사광선을 피해주세요."
    },
    nibsIntro: {
      th: "คาเคานิบส์ (Cocoa Nibs) คือเนื้อด้านในชิ้นเล็ก ๆ ของเมล็ดโกโก้ที่ผ่านการแยกเปลือกออก แต่ไม่ผ่านการปรุงแต่งหรือเติมน้ำตาล มีรสชาติขมเล็กน้อยและกลิ่นหอมเฉพาะตัวของโกโก้ ถือเป็นรูปแบบธรรมชาติของช็อกโกแลตก่อนถูกแปรรูปเป็นช็อกโกแลตแท่งหรือผลิตภัณฑ์อื่น ๆ ในคุกกี้ชิ้นนี้ เราใส่คาเคานิบส์กรุบกรอบลงไปเสริมทั้งรสสัมผัสและคุณค่าทางโภชนาการ",
      en: "Cacao nibs are small pieces of the inner cocoa bean with the shell removed — unprocessed, with no added sugar. They have a slightly bitter taste and a distinctive cacao aroma, essentially the natural form of chocolate before it's turned into chocolate bars or other products. In this cookie, we add crunchy cacao nibs for extra texture and nutritional value.",
      zh: "可可粒（Cocoa Nibs）是可可豆去壳后的内部小碎片，未经加工、不添加糖分，带有淡淡的苦味与独特的可可香气，是巧克力被加工成巧克力块或其他产品之前的天然形态。在这款曲奇中，我们加入酥脆的可可粒，为口感与营养价值加分。",
      ko: "카카오닙스(Cocoa Nibs)는 껍질을 제거한 카카오 콩의 작은 속살 조각으로, 가공하지 않고 설탕도 첨가하지 않아 살짝 쌉쌀한 맛과 카카오 특유의 향을 지니고 있습니다. 초콜릿 바나 다른 제품으로 가공되기 전의 천연 형태라 할 수 있습니다. 이 쿠키에는 바삭한 카카오닙스를 더해 식감과 영양 가치를 함께 높였습니다."
    },
    benefits: [
      {
        icon: "🫀",
        h: { th: "บำรุงหัวใจและหลอดเลือด", en: "Heart & Blood Vessel Health", zh: "有益心血管健康", ko: "심혈관 건강" },
        p: {
          th: "สารฟลาโวนอยด์ (สารต้านอนุมูลอิสระ) ในคาเคานิบส์ช่วยลดระดับคอเลสเตอรอลและความดันโลหิต",
          en: "Flavonoids, a type of antioxidant found in cacao nibs, help lower cholesterol and blood pressure.",
          zh: "可可粒中的黄酮类抗氧化物质有助于降低胆固醇和血压。",
          ko: "카카오닙스에 함유된 항산화 성분인 플라보노이드가 콜레스테롤과 혈압을 낮추는 데 도움을 줍니다."
        }
      },
      {
        icon: "⚡",
        h: { th: "เพิ่มพลังงาน", en: "Energy Boost", zh: "提升能量", ko: "에너지 충전" },
        p: {
          th: "คาเฟอีนตามธรรมชาติในคาเคานิบส์ช่วยกระตุ้นพลังงานและความตื่นตัว",
          en: "The natural caffeine in cacao nibs helps sharpen energy and alertness.",
          zh: "可可粒中的天然咖啡因有助于提神醒脑、集中注意力。",
          ko: "카카오닙스에 든 천연 카페인이 활력과 집중력을 높여줍니다."
        }
      },
      {
        icon: "😊",
        h: { th: "ปรับปรุงอารมณ์", en: "Mood Support", zh: "改善情绪", ko: "기분 개선" },
        p: {
          th: "คาเคานิบส์มีสารธีโอโบรมีนที่ช่วยเพิ่มฮอร์โมนแห่งความสุข",
          en: "Cacao nibs contain theobromine, which helps boost feel-good hormones.",
          zh: "可可粒含有可可碱，有助于促进\"快乐荷尔蒙\"分泌。",
          ko: "카카오닙스에 함유된 테오브로민 성분이 행복 호르몬 분비를 돕습니다."
        }
      },
      {
        icon: "🌾",
        h: { th: "ส่งเสริมสุขภาพลำไส้", en: "Gut Health", zh: "促进肠道健康", ko: "장 건강 증진" },
        p: {
          th: "ไฟเบอร์จากคาเคานิบส์ช่วยกระตุ้นการทำงานของระบบย่อยอาหาร",
          en: "Fiber from cacao nibs supports healthy digestion.",
          zh: "可可粒中的膳食纤维有助于促进消化系统健康。",
          ko: "카카오닙스의 식이섬유가 소화 건강을 돕습니다."
        }
      }
    ],
    productFaq: [
      {
        q: { th: "รสชาติของคาเคานิบส์เป็นอย่างไร?", en: "What does cacao nibs taste like?", zh: "可可粒的味道如何？", ko: "카카오닙스는 어떤 맛인가요?" },
        a: {
          th: "มีรสขมเข้มเล็กน้อยและกลิ่นหอมโกโก้ธรรมชาติ ไม่หวานเหมือนช็อกโกแลตทั่วไป",
          en: "A slightly intense bitterness with a natural cacao aroma — not sweet like regular chocolate.",
          zh: "带有淡淡的浓郁苦味与天然可可香气，不像一般巧克力那样甜。",
          ko: "살짝 진한 쌉쌀한 맛과 천연 카카오 향이 특징이며, 일반 초콜릿처럼 달지 않습니다."
        }
      },
      {
        q: { th: "ทานคาเคานิบส์ทุกวันได้ไหม?", en: "Can I eat cacao nibs every day?", zh: "可以每天吃可可粒吗？", ko: "카카오닙스를 매일 먹어도 되나요?" },
        a: {
          th: "ได้ การทานในปริมาณที่เหมาะสม (ประมาณ 1-2 ช้อนโต๊ะต่อวัน) ช่วยเสริมประโยชน์ต่อสุขภาพ",
          en: "Yes. Eating a moderate amount (about 1–2 tablespoons a day) can add extra health benefits.",
          zh: "可以。适量食用（每天约1-2汤匙）有助于增加健康益处。",
          ko: "네. 적당량(하루 약 1~2큰술)을 섭취하면 건강에 도움이 될 수 있습니다."
        }
      },
      {
        q: { th: "คาเคานิบส์ช่วยควบคุมน้ำหนักได้จริงไหม?", en: "Do cacao nibs really help with weight management?", zh: "可可粒真的有助于控制体重吗？", ko: "카카오닙스가 체중 관리에 정말 도움이 되나요?" },
        a: {
          th: "คาเคานิบส์มีไฟเบอร์สูงและช่วยให้รู้สึกอิ่มนานขึ้น จึงเหมาะกับการควบคุมน้ำหนักเมื่อทานในปริมาณที่พอดี",
          en: "Cacao nibs are high in fiber and help you feel fuller for longer, making them a good fit for weight management when eaten in moderation.",
          zh: "可可粒富含膳食纤维，能延长饱腹感，适量食用有助于控制体重。",
          ko: "카카오닙스는 식이섬유가 풍부해 포만감을 오래 유지해주므로, 적당히 섭취하면 체중 관리에 도움이 됩니다."
        }
      },
      {
        q: { th: "คาเคานิบส์ต่างจากช็อกโกแลตทั่วไปอย่างไร?", en: "How are cacao nibs different from regular chocolate?", zh: "可可粒与一般巧克力有什么不同？", ko: "카카오닙스는 일반 초콜릿과 어떻게 다른가요?" },
        a: {
          th: "คาเคานิบส์คือเมล็ดโกโก้บดที่ยังไม่ผ่านการปรุงแต่ง ไม่มีน้ำตาลหรือสารเติมแต่งเหมือนช็อกโกแลตทั่วไป",
          en: "Cacao nibs are unprocessed ground cocoa beans, with no added sugar or other ingredients like regular chocolate.",
          zh: "可可粒是未经加工的可可豆碎粒，不含糖分或其他添加物，与一般巧克力不同。",
          ko: "카카오닙스는 가공하지 않은 카카오 콩을 갈아 만든 것으로, 일반 초콜릿과 달리 설탕이나 다른 첨가물이 들어있지 않습니다."
        }
      }
    ]
  },
  {
    id: "marshmallow-cookie-almond",
    frozen: false,
    price: 60,
    weight: "40 g",
    box: "ถุงซีลเดี่ยว 1 ชิ้น",
    badge: { th: "ของใหม่", en: "New", zh: "新品", ko: "신제품" },
    img: "https://ik.imagekit.io/p3u6ogh1n/larnahouse/tr:w-1000,f-webp,quality-100/image/5e4c5b2c-36a3-43ae-b431-53fa5368c1c7.png",
    name: { th: "คุกกี้มาร์ชเมลโล่อัลมอนด์ ลาร์นา", en: "Larna Marshmallow & Almond Cookie", zh: "拉尔纳棉花糖杏仁曲奇", ko: "라르나 마시멜로 아몬드 쿠키" },
    tag: {
      th: "คุกกี้ช็อกโกแลตมาร์ชเมลโล่ผสมอัลมอนด์ หอมมันจากถั่วคั่ว",
      en: "Chocolate marshmallow cookie with roasted almonds for a nutty crunch",
      zh: "巧克力棉花糖曲奇，加入烘烤杏仁，坚果香气浓郁",
      ko: "고소하게 볶은 아몬드가 들어간 초콜릿 마시멜로 쿠키"
    },
    desc: {
      th: "คุกกี้ช็อกโกแลตมาร์ชเมลโล่สูตรพิเศษ ใช้ช็อกโกแลตฝีมือคนไทยจากจังหวัดน่านเป็นวัตถุดิบหลัก ผสมผสานกับช็อกโกแลตหลายชนิด ใส่แป้งน้อย แต่อัดแน่นไปด้วยมาร์ชเมลโล่ชิ้นใหญ่ทั่วทั้งชิ้น เสริมด้วยอัลมอนด์คั่วสับหยาบ ให้รสสัมผัสกรุบกรอบและกลิ่นหอมมันจากถั่ว เน้นเพิ่มเนื้อช็อกโกแลตเพื่อเสริมรสชาติ แทนการลดความหวานด้วยสารให้ความหวานสังเคราะห์",
      en: "A one-of-a-kind cookie made with handcrafted Thai chocolate from Nan province as the main ingredient, blended with several types of chocolate. Less flour, with big marshmallow chunks packed into every bite, topped with coarsely chopped roasted almonds for a nutty crunch. We use more chocolate mass to boost flavor rather than swapping in artificial sweeteners to cut sweetness.",
      zh: "特色曲奇，主要采用泰国南邦府手工制作的巧克力为原料，并混合多种巧克力。面粉用量较少，每一口都能吃到大块棉花糖，再铺上粗切烘烤杏仁，增添坚果香气与酥脆口感。我们选择增加巧克力用量来提升风味，而非用人工代糖降低甜度。",
      ko: "태국 난(Nan) 지방에서 수제로 만든 초콜릿을 주재료로 하고 여러 종류의 초콜릿을 배합한 특별한 쿠키입니다. 밀가루는 적게, 큼직한 마시멜로 조각을 가득 넣고 굵게 다진 볶은 아몬드를 올려 고소한 식감을 더했습니다. 인공 감미료로 단맛을 줄이는 대신 초콜릿 함량을 늘려 풍미를 살렸습니다."
    },
    serving: {
      th: "เก็บในภาชนะปิดสนิทที่อุณหภูมิห้อง หลีกเลี่ยงความชื้นและแสงแดดโดยตรง เพื่อความกรอบอร่อยที่สุด",
      en: "Store in an airtight container at room temperature, away from moisture and direct sunlight, for the best texture.",
      zh: "请存放于密封容器中，置于室温环境，避免潮湿与阳光直射，以保持最佳口感。",
      ko: "최상의 식감을 위해 밀폐 용기에 담아 실온에서 보관하고, 습기와 직사광선을 피해주세요."
    }
  }
];

function getProduct(id){
  return PRODUCTS.find(p => p.id === id);
}
