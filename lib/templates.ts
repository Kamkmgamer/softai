import type { StarterKit } from "@/lib/features";

export type Template = {
  id: string;
  name: string;
  kit: StarterKit;
  description: string;
  prompt: string;
  presets: string[];
  aspectRatio: "9:16" | "1:1" | "16:9";
  appSlug: string;
};

export const templates: Template[] = [
  // ── Marketing ─────────────────────────────────────────────
  {
    id: "restaurant-promo",
    name: "Restaurant Promo",
    kit: "Marketing",
    description: "Showcase your restaurant with appetizing visuals and a compelling offer.",
    prompt: "A warm, inviting restaurant interior with beautifully plated dishes on a rustic wooden table. Golden hour lighting streaming through windows. Cinematic food photography style.",
    presets: ["Warm tones", "Rustic", "Modern fine dining"],
    aspectRatio: "9:16",
    appSlug: "create-ad",
  },
  {
    id: "product-launch",
    name: "Product Launch",
    kit: "Marketing",
    description: "Announce a new product with a bold, attention-grabbing visual.",
    prompt: "A sleek product hero shot on a clean, modern pedestal with dramatic studio lighting. The product is the clear focal point with subtle gradient background.",
    presets: ["Minimalist", "Bold & colorful", "Luxury"],
    aspectRatio: "1:1",
    appSlug: "create-ad",
  },
  {
    id: "sale-announcement",
    name: "Sale Announcement",
    kit: "Marketing",
    description: "Drive urgency with a time-limited sale creative.",
    prompt: "A dynamic sale advertisement with bold typography, vibrant colors, and product imagery. High-energy composition designed to stop the scroll.",
    presets: ["Flash sale", "Seasonal discount", "Clearance"],
    aspectRatio: "9:16",
    appSlug: "create-ad",
  },
  {
    id: "testimonial-ad",
    name: "Testimonial Ad",
    kit: "Marketing",
    description: "Build trust with a customer testimonial-style creative.",
    prompt: "A professional customer testimonial layout with a clean, trustworthy design. Features a lifestyle scene with a satisfied customer using the product naturally.",
    presets: ["Clean & professional", "Warm & personal", "Corporate"],
    aspectRatio: "1:1",
    appSlug: "create-ad",
  },
  {
    id: "seasonal-campaign",
    name: "Seasonal Campaign",
    kit: "Marketing",
    description: "Create holiday or seasonal themed marketing content.",
    prompt: "A festive seasonal marketing creative with themed decorations, warm colors, and seasonal atmosphere. Perfect for holiday promotions and seasonal events.",
    presets: ["Summer vibes", "Winter holiday", "Back to school"],
    aspectRatio: "9:16",
    appSlug: "create-ad",
  },

  // ── Social ────────────────────────────────────────────────
  {
    id: "instagram-reel-hook",
    name: "Instagram Reel Hook",
    kit: "Social",
    description: "Eye-catching first frame for Instagram Reels.",
    prompt: "A visually striking, scroll-stopping image designed as a hook for social media. Bold composition with a clear focal point and space for text overlay.",
    presets: ["Bold text", "Mystery hook", "Before/after"],
    aspectRatio: "9:16",
    appSlug: "text-to-image",
  },
  {
    id: "tiktok-trend",
    name: "TikTok Trend",
    kit: "Social",
    description: "Ride trending formats with a viral-ready visual.",
    prompt: "A trendy, Gen-Z aesthetic social media visual with bold colors, dynamic composition, and eye-catching elements. Designed for viral sharing.",
    presets: ["Neon aesthetic", "Retro vibe", "Minimalist"],
    aspectRatio: "9:16",
    appSlug: "text-to-image",
  },
  {
    id: "linkedin-carousel",
    name: "LinkedIn Carousel",
    kit: "Social",
    description: "Professional carousel slides for thought leadership.",
    prompt: "A clean, professional LinkedIn carousel slide with modern corporate design. Features clear hierarchy, readable typography, and branded color scheme.",
    presets: ["Data-driven", "Storytelling", "How-to guide"],
    aspectRatio: "1:1",
    appSlug: "text-to-image",
  },
  {
    id: "story-sequence",
    name: "Story Sequence",
    kit: "Social",
    description: "Multi-frame story content for Instagram or Facebook.",
    prompt: "A visually cohesive story frame with modern social media aesthetics. Clean design with space for text overlays and interactive elements.",
    presets: ["Poll/quiz", "Behind the scenes", "Product highlight"],
    aspectRatio: "9:16",
    appSlug: "text-to-image",
  },

  // ── Educational content ───────────────────────────────────
  {
    id: "lesson-explainer",
    name: "Lesson Explainer",
    kit: "Educational content",
    description: "Turn a concept into a clear, visual explanation.",
    prompt: "An educational explainer visual with clean diagrams, clear labels, and an engaging layout. Designed to make complex concepts easy to understand.",
    presets: ["Whiteboard style", "Infographic", "Modern classroom"],
    aspectRatio: "16:9",
    appSlug: "text-to-image",
  },
  {
    id: "course-trailer",
    name: "Course Trailer",
    kit: "Educational content",
    description: "Promote an online course with a compelling preview.",
    prompt: "A professional course promotional visual with modern e-learning aesthetics. Features clean design, educational icons, and an inviting atmosphere.",
    presets: ["Professional", "Friendly", "Academic"],
    aspectRatio: "16:9",
    appSlug: "text-to-image",
  },
  {
    id: "how-to-step",
    name: "How-To Step",
    kit: "Educational content",
    description: "Step-by-step instructional content.",
    prompt: "A clear step-by-step instructional visual with numbered steps, clean icons, and logical flow. Designed for easy following and comprehension.",
    presets: ["Numbered steps", "Flowchart", "Visual guide"],
    aspectRatio: "1:1",
    appSlug: "text-to-image",
  },

  // ── Film or shorts ────────────────────────────────────────
  {
    id: "character-intro",
    name: "Character Introduction",
    kit: "Film or shorts",
    description: "Introduce a character with a cinematic hero shot.",
    prompt: "A cinematic character introduction shot with dramatic lighting, shallow depth of field, and a compelling expression. Film-quality composition.",
    presets: ["Dramatic lighting", "Silhouette", "Close-up portrait"],
    aspectRatio: "16:9",
    appSlug: "text-to-image",
  },
  {
    id: "action-scene",
    name: "Action Scene",
    kit: "Film or shorts",
    description: "Dynamic action sequence frame.",
    prompt: "A high-energy action scene with dynamic composition, motion blur, and dramatic camera angle. Cinematic color grading and intense atmosphere.",
    presets: ["Chase scene", "Fight sequence", "Explosion"],
    aspectRatio: "16:9",
    appSlug: "text-to-image",
  },
  {
    id: "title-sequence",
    name: "Title Sequence",
    kit: "Film or shorts",
    description: "Opening title card with cinematic styling.",
    prompt: "A cinematic title sequence frame with elegant typography, atmospheric background, and film-quality visual effects. Perfect for opening credits.",
    presets: ["Epic opener", "Minimal", "Vintage film"],
    aspectRatio: "16:9",
    appSlug: "text-to-image",
  },

  // ── Experimental art ──────────────────────────────────────
  {
    id: "abstract-loop",
    name: "Abstract Loop",
    kit: "Experimental art",
    description: "Mesmerizing abstract visual patterns.",
    prompt: "A hypnotic abstract visual with flowing organic shapes, vibrant color gradients, and smooth transitions. Designed for seamless looping.",
    presets: ["Fluid waves", "Geometric", "Organic flow"],
    aspectRatio: "1:1",
    appSlug: "text-to-image",
  },
  {
    id: "surreal-scene",
    name: "Surreal Scene",
    kit: "Experimental art",
    description: "Dreamlike impossible scenarios.",
    prompt: "A surrealist dreamscape with impossible architecture, floating objects, and ethereal lighting. Inspired by Salvador Dali and modern surrealism.",
    presets: ["Dreamscape", "Impossible geometry", "Floating world"],
    aspectRatio: "16:9",
    appSlug: "text-to-image",
  },
  {
    id: "glitch-art",
    name: "Glitch Art",
    kit: "Experimental art",
    description: "Digital distortion and data moshing aesthetics.",
    prompt: "A digital glitch art piece with data corruption effects, pixel sorting, and VHS-style artifacts. Cyberpunk aesthetic with neon colors.",
    presets: ["Data mosh", "VHS retro", "Neon glitch"],
    aspectRatio: "1:1",
    appSlug: "text-to-image",
  },
];

export function getTemplatesByKit(kit: StarterKit): Template[] {
  return templates.filter((t) => t.kit === kit);
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}
