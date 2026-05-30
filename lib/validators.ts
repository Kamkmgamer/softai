import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(2),
  productName: z.string().min(2),
  offer: z.string().min(2),
  cta: z.string().min(2),
  targetAudience: z.string().min(2),
  brandVoice: z.string().min(2),
  platformTarget: z.enum(["tiktok", "instagram", "youtube"]).default("tiktok"),
  language: z.enum(["en", "ar"]).default("en"),
  script: z.string().min(2),
});

export const brandAssetSchema = z.object({
  type: z.enum(["logo", "product_image", "reference_image"]),
  name: z.string().min(1),
  url: z.string().url(),
});

export const avatarSchema = z.object({
  sourceType: z.enum(["single_photo", "ai_person"]),
  imageUrl: z.string().url().nullable(),
  prompt: z.string().nullable(),
  policyState: z.enum([
    "self_declared",
    "third_party_declared",
    "ai_generated",
    "flagged",
  ]),
  attested: z.boolean(),
});

export const storyboardPatchSchema = z.object({
  headline: z.string().min(2),
  hook: z.string().min(2),
  cta: z.string().min(2),
  scenes: z
    .array(
      z.object({
        title: z.string().min(2),
        narration: z.string().min(2),
        visualDirection: z.string().min(2),
        overlayText: z.string().min(1),
        durationSeconds: z.number().int().min(3).max(15),
      }),
    )
    .min(3)
    .max(6),
});

export const abuseReportSchema = z.object({
  projectId: z.string().nullable().optional(),
  outputId: z.string().nullable().optional(),
  reason: z.string().min(4),
  details: z.string().min(8),
});

export const adminBanSchema = z.object({
  targetUserId: z.string().min(1),
  details: z.string().min(4),
});

export const adminOutputSchema = z.object({
  targetUserId: z.string().min(1),
  outputId: z.string().min(1),
  details: z.string().min(4),
});

export const adminCreditAdjustmentSchema = z.object({
  targetUserId: z.string().min(1),
  amount: z.number().int(),
  details: z.string().min(4),
});

export const multiShotVideoSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("auto"),
    prompt: z.string().min(10).max(4000),
    firstFrameUrl: z.string().url().nullable().optional(),
    aspectRatio: z.enum(["16:9", "9:16", "1:1"]).default("16:9"),
    duration: z.enum(["10s", "15s", "20s"]).default("10s"),
    resolution: z.enum(["720p", "1080p"]).default("720p"),
    audioOn: z.boolean().default(false),
  }),
  z.object({
    mode: z.literal("custom"),
    shots: z
      .array(
        z.object({
          order: z.number().int().min(1).max(5),
          prompt: z.string().min(4).max(2000),
        }),
      )
      .min(2)
      .max(5),
    firstFrameUrl: z.string().url().nullable().optional(),
    aspectRatio: z.enum(["16:9", "9:16", "1:1"]).default("16:9"),
    duration: z.enum(["10s", "15s", "20s"]).default("10s"),
    resolution: z.enum(["720p", "1080p"]).default("720p"),
    audioOn: z.boolean().default(false),
  }),
]);

export const creativeAppSchema = z.discriminatedUnion("app", [
  z.object({
    app: z.literal("text-to-image"),
    prompt: z.string().min(10).max(4000),
    style: z.string().min(2).max(80).default("Commercial product ad"),
    aspectRatio: z.enum(["9:16", "1:1", "16:9"]).default("9:16"),
  }),
  z.object({
    app: z.literal("image-editor"),
    prompt: z.string().min(10).max(4000),
    sourceImageUrl: z.string().url(),
    style: z.string().min(2).max(80).default("Keep product identity"),
    aspectRatio: z.enum(["9:16", "1:1", "16:9"]).default("9:16"),
  }),
  z.object({
    app: z.literal("edit-studio"),
    prompt: z.string().min(10).max(4000),
    sourceVideoUrl: z.string().url().optional().nullable(),
    style: z.string().min(2).max(80).default("Cinematic commercial edit"),
    aspectRatio: z.enum(["9:16", "1:1", "16:9"]).default("9:16"),
    duration: z.enum(["10s", "15s", "20s"]).default("10s"),
  }),
  z.object({
    app: z.literal("expand-image"),
    prompt: z.string().min(10).max(4000),
    sourceImageUrl: z.string().url(),
    style: z.string().min(2).max(80).default("Seamless extension"),
    aspectRatio: z.enum(["9:16", "1:1", "16:9"]).default("16:9"),
  }),
  z.object({
    app: z.literal("stylize-image"),
    prompt: z.string().min(10).max(4000),
    sourceImageUrl: z.string().url(),
    style: z.string().min(2).max(80).default("Artistic transformation"),
    aspectRatio: z.enum(["9:16", "1:1", "16:9"]).default("9:16"),
  }),
  z.object({
    app: z.literal("product-reshoot"),
    prompt: z.string().min(10).max(4000),
    sourceImageUrl: z.string().url(),
    style: z.string().min(2).max(80).default("Premium product photography"),
    aspectRatio: z.enum(["9:16", "1:1", "16:9"]).default("1:1"),
  }),
]);

export const chatMessageSchema = z.object({
  content: z.string().trim().min(1).max(4000),
});
