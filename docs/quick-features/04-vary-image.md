# Vary Image — Implementation Guide

**Complexity:** Trivial  
**Estimated time:** < 1 hour  
**Reuses:** `CreativeAppForm`, `creative-projects` API route, `generateReferencedImage()`

## What It Does

Generate variations of an existing image — change specific elements while keeping the overall composition and subject.

## Files to Change

### 1. Register the feature — `lib/features.ts`

Add a new entry in the Image section:

```typescript
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
```

### 2. Add validator variant — `lib/validators.ts`

Add a new variant to the `creativeAppSchema` discriminated union:

```typescript
z.object({
  app: z.literal("vary-image"),
  prompt: z.string().min(10).max(4000),
  sourceImageUrl: z.string().url(),
  style: z.string().min(2).max(80).default("Creative variation"),
  aspectRatio: z.enum(["9:16", "1:1", "16:9"]).default("9:16"),
}),
```

### 3. Create the page — `app/(app)/apps/vary-image/page.tsx`

```tsx
import { CreativeAppForm } from "@/components/creative-app-form";

export default function VaryImagePage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="vary-image"
        title="Vary Image"
        eyebrow="Image variations"
        description="Upload an image and describe what to change — swap colors, alter elements, adjust mood, or explore creative directions while keeping the core composition."
        placeholder="Keep the same product and composition but change the background to a deep navy blue, make the lighting cooler and more dramatic, and add subtle lens flare."
        presets={["Color swap", "Mood shift", "Season change", "Time of day", "Material swap", "Background change"]}
        requiresUpload="image"
      />
    </div>
  );
}
```

### 4. Update API route — `app/api/apps/creative-projects/route.ts`

Same pattern — add `"vary-image"` to `getKind()`, `getAppLabel()`, `buildImagePrompt()`, and POST handler:

**`getKind()`:** Add `if (app === "vary-image") return "image_edit";`

**`getAppLabel()`:** Add `if (app === "vary-image") return "Vary Image";`

**`buildImagePrompt()`:**
- Update type to include `"vary-image"`
- Add vary-specific prompt block:
```typescript
if (input.app === "vary-image") {
  return [
    "Create a variation of the provided image with specific changes.",
    `Changes requested: ${input.prompt}.`,
    `Variation style: ${input.style}.`,
    `Aspect ratio: ${input.aspectRatio}.`,
    `Use this source image as the reference: ${input.sourceImageUrl}. Preserve the overall composition, framing, and subject while applying the requested changes.`,
    "The variation should feel like a deliberate creative choice, not a random alteration.",
    "Avoid embedded text, fake letters, labels, watermarks, captions, UI, or logos unless they are part of the original.",
  ].join(" ");
}
```

**POST handler:** Add `"vary-image"` alongside the other image-editor variants.

## Verification

1. `pnpm lint` passes
2. Feature appears on dashboard under Image
3. Upload + variation prompt generates a varied image
