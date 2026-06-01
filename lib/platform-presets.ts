export type PlatformPreset = {
  id: string;
  name: string;
  width: number;
  height: number;
  maxDurationSeconds: number;
  aspectRatio: "9:16" | "1:1" | "16:9";
  category: "social" | "video" | "ads" | "professional";
};

export const platformPresets: PlatformPreset[] = [
  // ── Social ────────────────────────────────────────────────
  {
    id: "instagram_reel",
    name: "Instagram Reel",
    width: 1080,
    height: 1920,
    maxDurationSeconds: 90,
    aspectRatio: "9:16",
    category: "social",
  },
  {
    id: "instagram_post",
    name: "Instagram Post",
    width: 1080,
    height: 1080,
    maxDurationSeconds: 60,
    aspectRatio: "1:1",
    category: "social",
  },
  {
    id: "instagram_story",
    name: "Instagram Story",
    width: 1080,
    height: 1920,
    maxDurationSeconds: 15,
    aspectRatio: "9:16",
    category: "social",
  },
  {
    id: "tiktok",
    name: "TikTok",
    width: 1080,
    height: 1920,
    maxDurationSeconds: 180,
    aspectRatio: "9:16",
    category: "social",
  },
  {
    id: "facebook_post",
    name: "Facebook Post",
    width: 1200,
    height: 630,
    maxDurationSeconds: 240,
    aspectRatio: "16:9",
    category: "social",
  },
  {
    id: "pinterest_pin",
    name: "Pinterest Pin",
    width: 1000,
    height: 1500,
    maxDurationSeconds: 0,
    aspectRatio: "9:16",
    category: "social",
  },

  // ── Video ─────────────────────────────────────────────────
  {
    id: "youtube_short",
    name: "YouTube Short",
    width: 1080,
    height: 1920,
    maxDurationSeconds: 60,
    aspectRatio: "9:16",
    category: "video",
  },
  {
    id: "youtube_landscape",
    name: "YouTube (Landscape)",
    width: 1920,
    height: 1080,
    maxDurationSeconds: 600,
    aspectRatio: "16:9",
    category: "video",
  },
  {
    id: "youtube_square",
    name: "YouTube (Square)",
    width: 1080,
    height: 1080,
    maxDurationSeconds: 600,
    aspectRatio: "1:1",
    category: "video",
  },

  // ── Ads ───────────────────────────────────────────────────
  {
    id: "google_display",
    name: "Google Display Ad",
    width: 1200,
    height: 628,
    maxDurationSeconds: 0,
    aspectRatio: "16:9",
    category: "ads",
  },
  {
    id: "facebook_ad",
    name: "Facebook/Instagram Ad",
    width: 1080,
    height: 1080,
    maxDurationSeconds: 120,
    aspectRatio: "1:1",
    category: "ads",
  },
  {
    id: "tiktok_ad",
    name: "TikTok Ad",
    width: 1080,
    height: 1920,
    maxDurationSeconds: 60,
    aspectRatio: "9:16",
    category: "ads",
  },
  {
    id: "youtube_ad",
    name: "YouTube Pre-Roll",
    width: 1920,
    height: 1080,
    maxDurationSeconds: 30,
    aspectRatio: "16:9",
    category: "ads",
  },

  // ── Professional ──────────────────────────────────────────
  {
    id: "linkedin_post",
    name: "LinkedIn Post",
    width: 1200,
    height: 627,
    maxDurationSeconds: 600,
    aspectRatio: "16:9",
    category: "professional",
  },
  {
    id: "twitter_post",
    name: "X / Twitter Post",
    width: 1600,
    height: 900,
    maxDurationSeconds: 140,
    aspectRatio: "16:9",
    category: "professional",
  },
  {
    id: "presentation_16_9",
    name: "Presentation (16:9)",
    width: 1920,
    height: 1080,
    maxDurationSeconds: 0,
    aspectRatio: "16:9",
    category: "professional",
  },
  {
    id: "presentation_4_3",
    name: "Presentation (4:3)",
    width: 1440,
    height: 1080,
    maxDurationSeconds: 0,
    aspectRatio: "16:9",
    category: "professional",
  },
];

export function getPlatformPresetsByCategory(category: PlatformPreset["category"]): PlatformPreset[] {
  return platformPresets.filter((p) => p.category === category);
}

export function getPlatformPresetById(id: string): PlatformPreset | undefined {
  return platformPresets.find((p) => p.id === id);
}

export function getAspectRatioForPlatform(platformId: string): "9:16" | "1:1" | "16:9" {
  return getPlatformPresetById(platformId)?.aspectRatio ?? "9:16";
}
