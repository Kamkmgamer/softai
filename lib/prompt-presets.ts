import type { Locale } from "@/lib/i18n";

export const promptPresets: Record<Locale, Record<string, string[]>> = {
  en: {
    campaignBrief: [
      "A launch campaign for a small business product with a clear offer and direct CTA.",
      "A short-form ad for busy founders who need a faster way to create branded content.",
    ],
    adCopy: [
      "Lead with the problem, show the product payoff, then close with the offer.",
      "Make the hook specific, practical, and easy to understand in the first two seconds.",
    ],
    productPhoto: [
      "Warm product hero shot with clean negative space for text overlay.",
      "Lifestyle product scene with natural lighting and a clear focal point.",
    ],
    videoScript: [
      "Three-scene vertical ad: hook, product proof, offer close.",
      "Friendly founder-style voiceover with a practical SMB tone.",
    ],
  },
  ar: {
    campaignBrief: [
      "حملة إطلاق لمنتج صغير، بعرض واضح ودعوة مباشرة للشراء أو التسجيل.",
      "إعلان قصير لأصحاب الأعمال الذين يريدون محتوى احترافي بسرعة ومن دون تعقيد.",
    ],
    adCopy: [
      "ابدأ بالمشكلة، ثم وضّح فائدة المنتج، وبعدها اختم بالعرض.",
      "اجعل البداية واضحة ومباشرة خلال أول ثانيتين، من دون مبالغة أو لغة رسمية ثقيلة.",
    ],
    productPhoto: [
      "لقطة منتج نظيفة بإضاءة دافئة ومساحة مريحة لإضافة نص عربي لاحقاً.",
      "مشهد استخدام طبيعي للمنتج مع تركيز واضح ومساحة آمنة للنصوص.",
    ],
    videoScript: [
      "إعلان عمودي من ثلاثة مشاهد: بداية لافتة، فائدة المنتج، ثم العرض والدعوة للإجراء.",
      "نص صوتي عربي فصيح وسهل، قريب من لغة أصحاب الأعمال ومن دون تكلف.",
    ],
  },
};
