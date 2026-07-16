export interface AppConfig {
  whatsappNumber?: string;
  address?: string;
  workingHours?: string;
}

export interface BotAction {
  type: 'scroll' | 'link';
  label: string;
  target: string;
}

export interface BotResponse {
  text: string;
  action?: BotAction;
}

export interface Intent {
  id: string;
  keywords: string[];
  responses: (string | ((config: AppConfig) => string))[];
  action?: BotAction | ((config: AppConfig) => BotAction | undefined);
}

export const viviKnowledge: Intent[] = [
  {
    id: "greeting",
    keywords: ["مرحبا", "هلا", "السلام", "سلام", "هاي", "صباح", "مساء", "كيفك", "شخبارك", "اهلين", "يا هلا", "شلونك", "مرحبتين", "حي الله", "ازيك"],
    responses: [
      "يا هلا فيكِ حبيبتي في صالون ڤيڤيد بيوتي ✨ نورتينا! كيف أقدر أساعدك وأبرز جمالك اليوم؟",
      "وعليكم السلام والرحمة، أهلاً وسهلاً بكِ في ڤيڤيد بيوتي 🌸 أي خدمة أقدر أقدمها لكِ اليوم يا جميلة؟",
      "أهلاً يا قلبي! يسعد أوقاتك بكل خير. أنا ڤيفي، وموجودة هنا عشان أساعدك وأجاوب على كل استفساراتك 💖",
      "يا هلا والله! نورتي ڤيڤيد بيوتي.. آمري تدللي، كيف أقدر أخدمك؟"
    ]
  },
  {
    id: "booking",
    keywords: ["حجز", "موعد", "احجز", "مواعيد", "ابغى احجز", "طريقة الحجز", "كيف احجز", "اريد حجز", "بدي احجز"],
    responses: [
      "من عيوني! حجز الموعد عندنا جداً سهل. تقدرين تختارين الخدمة والوقت اللي يناسبك وتأكدين حجزك مباشرة من خلال القسم الخاص بالحجوزات 👇",
      "أكيد حبيبتي، تقدرين تحجزين موعدك بكل سهولة وبضغطة زر. بس اضغطي على الزر اللي تحت واختاري كل اللي بخاطرك 💖",
      "ولا يهمك، تفضلي بالانتقال لقسم الحجز واختاري الخدمات اللي تناسبك والوقت اللي يريحك:"
    ],
    action: {
      type: 'scroll',
      label: 'الذهاب لقسم الحجز 📅',
      target: 'booking-section'
    }
  },
  {
    id: "location",
    keywords: ["موقع", "مكان", "وينكم", "عنوان", "موقعكم", "وين مكانكم", "وصف", "اللوكيشن", "لوكيشن", "مكان الصالون", "فرعكم", "فروعكم"],
    responses: [
      (config) => `يا هلا فيكِ، ${config.address ? `موقعنا في: ${config.address}. ` : ''}تقدرين تشوفين الخريطة وتوصلين لنا بكل سهولة من الزر اللي تحت 📍`,
      (config) => `نسعد بزيارتكِ! ${config.address ? `نحن متواجدون في: ${config.address}. ` : ''}اضغطي على الزر تحت عشان تفتحين الخريطة وتجينا بسرعة 👇`
    ],
    action: {
      type: 'scroll',
      label: 'عرض موقعنا على الخريطة 🗺️',
      target: 'location-section'
    }
  },
  {
    id: "contact",
    keywords: ["رقم", "تواصل", "واتس", "واتساب", "اتصال", "تليفون", "هاتف", "كلمكم", "رقمكم"],
    responses: [
      (config) => `أكيد! للتواصل المباشر معنا، ${config.whatsappNumber ? `تقدرين تراسلينا على الواتساب عبر الرقم: ${config.whatsappNumber}` : 'استخدمي زر الواتساب المباشر اللي تحت'}. جاهزين للرد عليك بأي وقت 💬`,
      (config) => `يسعدنا تواصلك معنا يا جميلة! ${config.whatsappNumber ? `هذا رقمنا للواتساب: ${config.whatsappNumber}` : 'اضغطي على زر الواتساب للتواصل معنا مباشرة'}.`
    ],
    action: (config) => config.whatsappNumber ? {
      type: 'link',
      label: 'مراسلتنا عبر الواتساب 💬',
      target: `https://wa.me/${config.whatsappNumber.replace(/[^0-9]/g, '')}`
    } : undefined
  },
  {
    id: "hours",
    keywords: ["دوام", "ساعات", "متى تفتحون", "متى تقفلون", "اوقات العمل", "ساعات العمل", "تفتحون", "متى تفتحوا", "الدوام", "شغالين"],
    responses: [
      (config) => config.workingHours 
        ? `نستقبلكِ بكل حب، أوقات العمل لدينا: ${config.workingHours}. ⏰`
        : `أوقات العمل موضحة في الموقع، ونستقبلك بكل حب يومياً. أوقاتنا مرنة لتناسب جدولك. يمكنك اختيار الوقت المناسب لكِ أثناء عملية الحجز. ⏰`,
      "حياك الله، نفتح أبوابنا يومياً عشان نستقبلك وتدللين نفسك. شيكي على المواعيد المتاحة بقسم الحجز واختاري اللي يريحك 💖"
    ]
  },
  {
    id: "hair_care",
    keywords: ["شعر", "تساقط", "جفاف", "تقصف", "تطويل", "عناية بالشعر", "بروتين", "كيراتين", "صبغة", "قص", "استشوار", "فروة", "شعري"],
    responses: [
      "جمال شعرك هو تاجك! للعناية بالشعر، دايماً ننصح بالترطيب المستمر وماسكات العناية. وإذا حابة دلع أكثر، عندنا في ڤيڤيد بيوتي أحدث صيحات القص والصبغات وجلسات علاجية مخصصة ترجع لشعرك حيويته. 💇‍♀️✨",
      "يا هلا بالجميلة! عشان تحافظين على شعرك، احرصي على قص الأطراف بانتظام واستخدام منتجات تناسب طبيعته. تقدرين تحجزين عندنا جلسة عناية أو استشارة مع خبيراتنا، ورح نضبطك بأحلى لوك! 💕"
    ],
    action: {
      type: 'scroll',
      label: 'تصفح خدمات الشعر 💇‍♀️',
      target: 'services-section'
    }
  },
  {
    id: "skin_care",
    keywords: ["بشرة", "حبوب", "تفتيح", "نضارة", "تنظيف", "مسامات", "رؤوس سوداء", "عناية بالبشرة", "جافة", "دهنية", "مختلطة", "تجاعيد", "تقشير", "وجهي", "البشرة"],
    responses: [
      "سر البشرة المشرقة هو الروتين الصح! أهم 3 خطوات: الغسول، الترطيب اليومي، وواقي الشمس. وعندنا في الصالون جلسات تنظيف عميق ونضارة بتجدد خلايا بشرتك وتعطيها إشراقة فورية. 🧖‍♀️💧",
      "لتبان بشرتك دايماً صحية وموردة، الترطيب هو الأساس. وإذا حابة تنظيف أعمق وتوحيد لون، ننصحك تحجزين جلسة العناية بالبشرة عندنا، متأكدة رح تعجبك النتيجة! ✨"
    ],
    action: {
      type: 'scroll',
      label: 'تصفح خدمات البشرة 🧖‍♀️',
      target: 'services-section'
    }
  },
  {
    id: "makeup",
    keywords: ["مكياج", "ميكب", "تتوريال", "ميك اب", "عروس", "سهرة", "كريم اساس", "كونسيلر", "تثبيت", "اظلال"],
    responses: [
      "المكياج فن يبرز ملامحك الجميلة! خبيرات المكياج عندنا جاهزات لتجهيزك بأجمل إطلالة تناسب ذوقك وتبرز سحرك في مناسباتك السعيدة. 💄💋",
      "سواء كان مكياج ناعم للدوام أو مكياج سهرة فخم، خبيراتنا في ڤيڤيد بيوتي يبدعون في إبراز ملامحك بأحلى صورة. تفضلي احجزي موعدك وخلي الباقي علينا 💖"
    ],
    action: {
      type: 'scroll',
      label: 'احجزي خدمة المكياج 💄',
      target: 'booking-section'
    }
  },
  {
    id: "nails",
    keywords: ["اظافر", "بديكير", "منيكير", "جل", "اكريليك", "تطويل اظافر", "تكسر", "عناية بالاظافر", "لون", "منكير", "بدكير"],
    responses: [
      "يديكِ تعكس أنوثتك! نقدم لكِ خدمات البديكير والمنيكير الملكية، بالإضافة إلى الجل والأكريليك بأحدث الألوان عشان تبدو يداكِ بأبهى حلة. 💅✨",
      "دلع أظافرك عندنا غير! من التنظيف العميق للتركيب والألوان الصيفية والشتوية.. تعالي وجربي خدمات الأظافر عندنا ورح تطلعين مبسوطة 💕"
    ],
    action: {
      type: 'scroll',
      label: 'خدمات العناية بالأظافر 💅',
      target: 'services-section'
    }
  },
  {
    id: "prices",
    keywords: ["اسعار", "بكم", "سعر", "تكلفة", "عروض", "خصم", "خصومات", "غالي", "رخيص", "قائمة الاسعار", "الاسعار"],
    responses: [
      "أسعارنا مدروسة لتناسب الجميع مع ضمان أعلى معايير الجودة يا جميلة. تقدرين تطلعين على قائمة الخدمات وأسعارها المفصلة في الموقع تحت. 💸🎁",
      "لأننا نهتم فيكِ، وفرنا لك أفضل الخدمات بأسعار تنافسية. شوفي قائمة الخدمات والأسعار من الزر اللي تحت، ولا تنسين تتابعين عروضنا! ✨"
    ],
    action: {
      type: 'scroll',
      label: 'الاطلاع على قائمة الأسعار 💸',
      target: 'services-section'
    }
  },
  {
    id: "thanks",
    keywords: ["شكرا", "يعطيك العافية", "تسلمين", "ما قصرتي", "مشكورة", "ممنونة", "يسلمو", "يعطيكم العافية"],
    responses: [
      "العفو يا قلبي! هذا واجبي وأقل من حقي. أنا هنا دايماً عشان أجاوب استفساراتك. أتمنى لك يوم سعيد ومليان جمال! 🌸💕",
      "يا هلا بك وبأي وقت! يسعدني جداً إني قدرت أفيدك. إذا احتجتي أي شيء ثاني أنا موجودة 💖",
      "العفو حبيبتي! كلي تحت أمرك.. شرفتينا وأتمنى لك يوم يجنن زيك ✨"
    ]
  },
  {
    id: "who_are_you",
    keywords: ["من انتي", "وش اسمك", "من تكونين", "ايش اسمك", "من انت", "مين معي", "عرفيني عن نفسك"],
    responses: [
      "أنا ڤيفي، صديقتك ومستشارتك الخاصة في ڤيڤيد بيوتي. متواجدة هنا عشان أجاوب على كل استفساراتك وأساعدك تبرزين جمالك وأناقتك وتعيشين تجربة صالون متكاملة ✨",
      "يا هلا بك! أنا ڤيفي، موجودة عشان أخدمك وأسهل عليك معرفة خدماتنا وحجوزاتنا. اعتبريني أختك الصديقة اللي تفهم بجمالك 🌸"
    ]
  }
];

export const viviQuickActions = [
  "كيف أحجز موعد؟",
  "وين موقع الصالون؟",
  "بكم أسعار الخدمات؟",
  "أحتاج نصيحة للعناية بشعري"
];

// Helper to normalize Arabic text for better matching
export function normalizeArabic(text: string): string {
  return text
    .replace(/[أإآا]/g, 'ا')
    .replace(/[ةه]/g, 'ه')
    .replace(/[ىي]/g, 'ي')
    .replace(/[ًٌٍَُِّْ]/g, '') // remove diacritics
    .toLowerCase();
}

export function analyzeMessage(message: string, config: AppConfig): BotResponse {
  const normalizedMsg = normalizeArabic(message);
  let bestMatch: Intent | null = null;
  let maxScore = 0;

  for (const intent of viviKnowledge) {
    let score = 0;
    for (const keyword of intent.keywords) {
      const normalizedKeyword = normalizeArabic(keyword);
      if (normalizedMsg.includes(normalizedKeyword)) {
        score += normalizedKeyword.length; // Longer keyword match = better score
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = intent;
    }
  }

  // Threshold for understanding
  if (bestMatch && maxScore > 2) {
    // Pick a random response from the array
    const responses = bestMatch.responses;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const text = typeof randomResponse === 'function' ? randomResponse(config) : randomResponse;
    
    // Resolve action if it's a function
    const resolvedAction = typeof bestMatch.action === 'function' 
      ? bestMatch.action(config) 
      : bestMatch.action;

    return { text, action: resolvedAction };
  }

  // Fallback if no intent matches well (varied responses)
  const fallbacks = [
    "عذراً يا جميلة، ما فهمت عليكِ زين. ممكن توضحين سؤالك أكثر؟ أنا هنا عشان أساعدك بكل ما يخص صالون ڤيڤيد بيوتي 🌸",
    "يا هلا بك، بس للأسف ما لقطت قصدك بالضبط. تقدرين تسأليني عن خدماتنا، أسعارنا، موقعنا، أو طريقة الحجز وراح أجاوبك فوراً ✨",
    "معليش حبيبتي ما استوعبت سؤالك، ممكن تعيدين صياغته؟ أنا جاهزة أساعدك بكل اللي تحتاجينه من معلومات عن الصالون 💖"
  ];
  
  return { 
    text: fallbacks[Math.floor(Math.random() * fallbacks.length)] 
  };
}
