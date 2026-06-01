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

export const mediaAssets = {
  productWorkspace:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  productPhoto:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
  studioBottle:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
  socialShoot:
    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
  editDesk:
    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
  packaging:
    "https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=1200&q=80",
  apparel:
    "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
  campaignWall:
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80",
  videoPreview:
    "https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4",
} as const;

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
    image: mediaAssets.editDesk,
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
    image: mediaAssets.socialShoot,
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
    image: mediaAssets.productWorkspace,
    category: "Video",
    starterKit: "Film or shorts",
    status: "coming_soon",
    appRoute: "/apps/scene-builder",
  },
  {
    slug: "upscale-video",
    title: "Upscale Video",
    description: "Upscale video with Topaz AI.",
    image: mediaAssets.editDesk,
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
    image: mediaAssets.socialShoot,
    category: "Video",
    starterKit: "Film or shorts",
    status: "coming_soon",
    appRoute: "/apps/performance-capture",
  },
  {
    slug: "remove-from-video",
    title: "Remove from Video",
    description: "Remove objects without reshooting.",
    image: mediaAssets.productWorkspace,
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
    image: mediaAssets.productPhoto,
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
    image: mediaAssets.studioBottle,
    category: "Image",
    status: "implemented",
    appRoute: "/apps/text-to-image",
    projectKind: "text_to_image",
  },
  {
    slug: "image-editor",
    title: "AI Image Editor",
    description: "Restyle, reshoot, relight, or change backdrops from one reference image.",
    image: mediaAssets.productPhoto,
    category: "Image",
    status: "implemented",
    appRoute: "/apps/image-editor",
    projectKind: "image_edit",
  },
  {
    slug: "image-to-video",
    title: "Image to Video",
    description: "Animate one image or bridge first and last frames.",
    image: mediaAssets.socialShoot,
    category: "Video",
    starterKit: "Marketing",
    status: "implemented",
    appRoute: "/apps/image-to-video",
    projectKind: "image_to_video",
    badge: "New",
  },
  {
    slug: "expand-image",
    title: "Expand Image",
    description: "Extend an image beyond its original frame.",
    image: mediaAssets.campaignWall,
    category: "Image",
    status: "implemented",
    appRoute: "/apps/expand-image",
    projectKind: "image_edit",
  },
  {
    slug: "stylize-image",
    title: "Stylize Image",
    description: "Apply artistic styles to your image — watercolor, oil painting, anime, vintage, and more.",
    image: mediaAssets.studioBottle,
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
    image: mediaAssets.productPhoto,
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
    image: mediaAssets.packaging,
    category: "Image",
    status: "implemented",
    appRoute: "/apps/vary-image",
    projectKind: "image_edit",
  },
  {
    slug: "mockup",
    title: "Mockup Generator",
    description: "Place your design on real-world products — apparel, mugs, screens, signage.",
    image: mediaAssets.apparel,
    category: "Image",
    status: "implemented",
    appRoute: "/apps/mockup",
    projectKind: "mockup",
    badge: "New",
  },
  {
    slug: "create-ad",
    title: "Create Ad",
    description: "Generate ad creatives from scratch or variations of an existing ad.",
    image: mediaAssets.campaignWall,
    category: "Image",
    starterKit: "Marketing",
    status: "implemented",
    appRoute: "/apps/create-ad",
    projectKind: "create_ad",
    badge: "New",
  },

  // ── Social ────────────────────────────────────────────────
  {
    slug: "batch-social",
    title: "Batch Social Generator",
    description:
      "Generate a week of platform-specific social posts from one idea.",
    image: mediaAssets.socialShoot,
    category: "Image",
    starterKit: "Social",
    status: "implemented",
    appRoute: "/apps/batch-social",
    projectKind: "text_to_image",
    badge: "New",
  },
  {
    slug: "carousel-builder",
    title: "Carousel Builder",
    description:
      "Create multi-slide carousel posts for Instagram and LinkedIn.",
    image: mediaAssets.campaignWall,
    category: "Image",
    starterKit: "Social",
    status: "implemented",
    appRoute: "/apps/carousel-builder",
    projectKind: "text_to_image",
  },
  {
    slug: "hook-generator",
    title: "Short-Form Hook Generator",
    description:
      "Generate viral hook variations for Reels and TikToks.",
    image: mediaAssets.socialShoot,
    category: "Image",
    starterKit: "Social",
    status: "implemented",
    appRoute: "/apps/hook-generator",
    projectKind: "text_to_image",
  },
  {
    slug: "platform-resizer",
    title: "Platform Resizer",
    description:
      "Adapt any image to fit every social platform's dimensions.",
    image: mediaAssets.productPhoto,
    category: "Image",
    starterKit: "Social",
    status: "implemented",
    appRoute: "/apps/platform-resizer",
    projectKind: "image_edit",
  },

  // ── Educational content ───────────────────────────────────
  {
    slug: "lesson-to-video",
    title: "Lesson to Video",
    description:
      "Turn lesson plans into structured teaching videos with scenes and visuals.",
    image: mediaAssets.productWorkspace,
    category: "Video",
    starterKit: "Educational content",
    status: "implemented",
    appRoute: "/apps/lesson-to-video",
    projectKind: "multi_shot_video",
    badge: "New",
  },
  {
    slug: "explainer-video",
    title: "Explainer Video Builder",
    description:
      "Create step-by-step explainer videos from a concept description.",
    image: mediaAssets.editDesk,
    category: "Video",
    starterKit: "Educational content",
    status: "implemented",
    appRoute: "/apps/explainer-video",
    projectKind: "multi_shot_video",
  },
  {
    slug: "whiteboard-animation",
    title: "Whiteboard Animation",
    description:
      "Generate whiteboard-style teaching videos from a script.",
    image: mediaAssets.productWorkspace,
    category: "Video",
    starterKit: "Educational content",
    status: "implemented",
    appRoute: "/apps/whiteboard-animation",
    projectKind: "multi_shot_video",
  },
  {
    slug: "course-trailer",
    title: "Course Trailer",
    description:
      "Create a compelling trailer to promote your online course.",
    image: mediaAssets.editDesk,
    category: "Video",
    starterKit: "Educational content",
    status: "implemented",
    appRoute: "/apps/course-trailer",
    projectKind: "multi_shot_video",
  },

  // ── Experimental art ──────────────────────────────────────
  {
    slug: "style-transfer",
    title: "Style Transfer",
    description:
      "Transform any image into a new artistic style — oil painting, anime, cyberpunk, and more.",
    image: mediaAssets.studioBottle,
    category: "Image",
    starterKit: "Experimental art",
    status: "implemented",
    appRoute: "/apps/style-transfer",
    projectKind: "image_edit",
    badge: "New",
  },
  {
    slug: "surreal-scene",
    title: "Surreal Scene Builder",
    description:
      "Generate dreamlike, impossible scenes from text prompts.",
    image: mediaAssets.campaignWall,
    category: "Image",
    starterKit: "Experimental art",
    status: "implemented",
    appRoute: "/apps/surreal-scene",
    projectKind: "text_to_image",
  },
  {
    slug: "visual-remix",
    title: "Visual Remix",
    description:
      "Upload an image and generate multiple styled variations.",
    image: mediaAssets.packaging,
    category: "Image",
    starterKit: "Experimental art",
    status: "implemented",
    appRoute: "/apps/visual-remix",
    projectKind: "image_edit",
  },
  {
    slug: "loop-generator",
    title: "Loop Generator",
    description:
      "Create perfect looping visual art for backgrounds and social.",
    image: mediaAssets.socialShoot,
    category: "Video",
    starterKit: "Experimental art",
    status: "implemented",
    appRoute: "/apps/loop-generator",
    projectKind: "multi_shot_video",
  },

  // ── Film or shorts additions ──────────────────────────────
  {
    slug: "script-to-storyboard",
    title: "Script to Storyboard",
    description:
      "Paste a script and get a full storyboard with scene breakdowns.",
    image: mediaAssets.productWorkspace,
    category: "Video",
    starterKit: "Film or shorts",
    status: "implemented",
    appRoute: "/apps/script-to-storyboard",
    projectKind: "multi_shot_video",
  },

  // ── Marketing additions ───────────────────────────────────
  {
    slug: "ab-variants",
    title: "A/B Variant Generator",
    description:
      "Generate multiple ad variations from one concept to test.",
    image: mediaAssets.campaignWall,
    category: "Image",
    starterKit: "Marketing",
    status: "implemented",
    appRoute: "/apps/ab-variants",
    projectKind: "create_ad",
  },
  {
    slug: "seasonal-transform",
    title: "Seasonal Campaign Transformer",
    description:
      "Transform an existing ad into a seasonal version automatically.",
    image: mediaAssets.productPhoto,
    category: "Image",
    starterKit: "Marketing",
    status: "implemented",
    appRoute: "/apps/seasonal-transform",
    projectKind: "image_edit",
  },

  // ── Audio ─────────────────────────────────────────────────
  {
    slug: "text-to-speech",
    title: "Text to Speech",
    description: "Generate spoken audio from text.",
    image: mediaAssets.productWorkspace,
    category: "Audio",
    status: "coming_soon",
    appRoute: "/apps/text-to-speech",
  },
  {
    slug: "lip-sync",
    title: "Lip Sync",
    description: "Sync speech to a character or performance.",
    image: mediaAssets.socialShoot,
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
    image: mediaAssets.productWorkspace,
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
    image: mediaAssets.editDesk,
    category: "Models",
    status: "coming_soon",
    appRoute: "/apps/model-library",
  },
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
