import {
  BookOpen,
  Brush,
  Clapperboard,
  Megaphone,
  Share2,
} from "lucide-react";

export type FeatureCategory =
  | "Starter Kits"
  | "Custom"
  | "Image"
  | "Video"
  | "Audio"
  | "Models";

export type StarterKit =
  | "Film or shorts"
  | "Marketing"
  | "Social"
  | "Educational content"
  | "Experimental art";

export type FeatureStatus = "implemented" | "coming_soon";

export type FeatureTile = {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: Exclude<FeatureCategory, "Starter Kits">;
  starterKit?: StarterKit;
  status: FeatureStatus;
  appRoute: string;
  projectKind?: string;
  badge?: string;
};

export const starterKits: Array<{
  title: StarterKit;
  description: string;
  icon: typeof Clapperboard;
}> = [
  {
    title: "Film or shorts",
    description: "Scenes, characters, VFX & Narrative",
    icon: Clapperboard,
  },
  {
    title: "Marketing",
    description: "Product, campaign & brand content",
    icon: Megaphone,
  },
  {
    title: "Social",
    description: "Reels, TikToks & platform-ready content",
    icon: Share2,
  },
  {
    title: "Educational content",
    description: "Animation & storytelling",
    icon: BookOpen,
  },
  {
    title: "Experimental art",
    description: "Visual variations & new methods to create",
    icon: Brush,
  },
];

export const categories: FeatureCategory[] = [
  "Starter Kits",
  "Custom",
  "Image",
  "Video",
  "Audio",
  "Models",
];

export const features: FeatureTile[] = [
  // ── Film or shorts ────────────────────────────────────────
  {
    slug: "edit-studio",
    title: "Edit Studio",
    description:
      "Transform a video with natural-language edits for lighting, style, objects, or pacing.",
    image: "/hero-mockup.png",
    category: "Video",
    starterKit: "Film or shorts",
    status: "implemented",
    appRoute: "/apps/edit-studio",
    projectKind: "video_edit",
    badge: "New",
  },
  {
    slug: "multi-shot-video",
    title: "Multi-Shot Video",
    description:
      "Write a simple prompt, get a multiple shots video.",
    image: "/rendering-feature.png",
    category: "Video",
    starterKit: "Film or shorts",
    status: "implemented",
    appRoute: "/apps/multi-shot-video",
    projectKind: "multi_shot_video",
  },
  {
    slug: "scene-builder",
    title: "Scene Builder",
    description:
      "Craft your multi-shot scene step by step, see the look, then bring it to life.",
    image: "/storyboard-feature.png",
    category: "Video",
    starterKit: "Film or shorts",
    status: "coming_soon",
    appRoute: "/apps/scene-builder",
  },
  {
    slug: "upscale-video",
    title: "Upscale Video",
    description: "Upscale video with Topaz AI.",
    image: "/storyboard-feature.png",
    category: "Video",
    starterKit: "Film or shorts",
    status: "coming_soon",
    appRoute: "/apps/upscale-video",
  },
  {
    slug: "performance-capture",
    title: "Performance Capture with Act-Two",
    description:
      "Animate characters using driving performance videos.",
    image: "/rendering-feature.png",
    category: "Video",
    starterKit: "Film or shorts",
    status: "coming_soon",
    appRoute: "/apps/performance-capture",
  },
  {
    slug: "remove-from-video",
    title: "Remove from Video",
    description: "Remove objects without reshooting.",
    image: "/hero-mockup.png",
    category: "Video",
    starterKit: "Film or shorts",
    status: "coming_soon",
    appRoute: "/apps/remove-from-video",
  },

  // ── Marketing ─────────────────────────────────────────────
  {
    slug: "product-shot-video",
    title: "Product Shot Video Builder",
    description: "Turn a product photo into a polished video ad.",
    image: "/rendering-feature.png",
    category: "Video",
    starterKit: "Marketing",
    status: "coming_soon",
    appRoute: "/apps/product-shot-video",
  },

  // ── Image ─────────────────────────────────────────────────
  {
    slug: "text-to-image",
    title: "Text to Image",
    description: "Generate campaign-ready image plates from a prompt.",
    image: "/storyboard-feature.png",
    category: "Image",
    status: "implemented",
    appRoute: "/apps/text-to-image",
    projectKind: "text_to_image",
  },
  {
    slug: "image-editor",
    title: "AI Image Editor",
    description: "Restyle, reshoot, relight, or change backdrops from one reference image.",
    image: "/hero-mockup.png",
    category: "Image",
    status: "implemented",
    appRoute: "/apps/image-editor",
    projectKind: "image_edit",
    badge: "Runway-style",
  },
  {
    slug: "image-to-video",
    title: "Image to Video",
    description: "Generate video from a starting image.",
    image: "/rendering-feature.png",
    category: "Image",
    status: "coming_soon",
    appRoute: "/apps/image-to-video",
  },
  {
    slug: "expand-image",
    title: "Expand Image",
    description: "Extend an image beyond its original frame.",
    image: "/hero-mockup.png",
    category: "Image",
    status: "implemented",
    appRoute: "/apps/expand-image",
    projectKind: "image_edit",
  },
  {
    slug: "stylize-image",
    title: "Stylize Image",
    description: "Apply artistic styles to your image — watercolor, oil painting, anime, vintage, and more.",
    image: "/hero-mockup.png",
    category: "Image",
    status: "implemented",
    appRoute: "/apps/stylize-image",
    projectKind: "image_edit",
    badge: "New",
  },
  {
    slug: "product-reshoot",
    title: "Product Reshoot",
    description: "Instantly change the setting, lighting, or angle of your product photo.",
    image: "/hero-mockup.png",
    category: "Image",
    starterKit: "Marketing",
    status: "implemented",
    appRoute: "/apps/product-reshoot",
    projectKind: "image_edit",
  },
  {
    slug: "vary-image",
    title: "Vary Image",
    description: "Generate creative variations of your image — change elements while keeping the core composition.",
    image: "/rendering-feature.png",
    category: "Image",
    status: "implemented",
    appRoute: "/apps/vary-image",
    projectKind: "image_edit",
  },
  {
    slug: "mockup",
    title: "Mockup Generator",
    description: "Place your design on real-world products — apparel, mugs, screens, signage.",
    image: "/hero-mockup.png",
    category: "Image",
    status: "implemented",
    appRoute: "/apps/mockup",
    projectKind: "mockup",
    badge: "New",
  },

  // ── Audio ─────────────────────────────────────────────────
  {
    slug: "text-to-speech",
    title: "Text to Speech",
    description: "Generate spoken audio from text.",
    image: "/hero-mockup.png",
    category: "Audio",
    status: "coming_soon",
    appRoute: "/apps/text-to-speech",
  },
  {
    slug: "lip-sync",
    title: "Lip Sync",
    description: "Sync speech to a character or performance.",
    image: "/storyboard-feature.png",
    category: "Audio",
    status: "coming_soon",
    appRoute: "/apps/lip-sync",
  },

  // ── Custom ────────────────────────────────────────────────
  {
    slug: "custom-agent",
    title: "Custom Agent",
    description:
      "Create a custom assistant for repeatable creative workflows.",
    image: "/rendering-feature.png",
    category: "Custom",
    status: "coming_soon",
    appRoute: "/apps/custom-agent",
  },

  // ── Models ────────────────────────────────────────────────
  {
    slug: "model-library",
    title: "Model Library",
    description:
      "Choose generation models and compare capabilities.",
    image: "/storyboard-feature.png",
    category: "Models",
    status: "coming_soon",
    appRoute: "/apps/model-library",
  },
];

export const modelOptions = [
  "Aleph 2.0",
  "Seedance 2.0",
  "Multi-Shot Video",
  "Runway Characters",
  "Gen-4.5",
  "Kling 3.0",
];

export function getFeatureBySlug(slug: string): FeatureTile | undefined {
  return features.find((f) => f.slug === slug);
}

export function getImplementedFeatures(): FeatureTile[] {
  return features.filter((f) => f.status === "implemented");
}

export function getFeaturesByCategory(
  category: FeatureCategory,
  starterKit?: StarterKit,
): FeatureTile[] {
  if (category === "Starter Kits" && starterKit) {
    return features.filter((f) => f.starterKit === starterKit);
  }
  return features.filter((f) => f.category === category);
}

export function getDefaultFeatureForCategory(
  category: FeatureCategory,
  starterKit?: StarterKit,
): FeatureTile {
  const list = getFeaturesByCategory(category, starterKit);
  return (
    list.find((f) => f.status === "implemented") ??
    list[0] ??
    features.find((f) => f.slug === "multi-shot-video")!
  );
}
