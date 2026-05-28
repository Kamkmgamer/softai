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

export const chatMessageSchema = z.object({
  content: z.string().trim().min(1).max(4000),
});
