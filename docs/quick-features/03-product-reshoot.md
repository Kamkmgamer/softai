# Product Reshoot — Implementation Guide

**Complexity:** Trivial  
**Estimated time:** < 1 hour  
**Reuses:** `CreativeAppForm`, `creative-projects` API route, `generateReferencedImage()`

## What It Does

Instantly change the setting, lighting, or angle of a product photo. Upload a product image and describe the new scene.

## Files to Change

### 1. Register the feature — `lib/features.ts`

Add a new entry in the Image section:

```typescript
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
```

### 2. Add validator variant — `lib/validators.ts`

Add a new variant to the `creativeAppSchema` discriminated union:

```typescript
z.object({
  app: z.literal("product-reshoot"),
  prompt: z.string().min(10).max(4000),
  sourceImageUrl: z.string().url(),
  style: z.string().min(2).max(80).default("Premium product photography"),
  aspectRatio: z.enum(["9:16", "1:1", "16:9"]).default("1:1"),
}),
```

### 3. Create the page — `app/(app)/apps/product-reshoot/page.tsx`

```tsx
import { CreativeAppForm } from "@/components/creative-app-form";

export default function ProductReshootPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="product-reshoot"
        title="Product Reshoot"
        eyebrow="Product photography"
        description="Upload your product photo and describe a new setting, lighting, or angle — get a studio-quality reshoot without the studio."
        placeholder="Place this product on a rustic wooden table with warm morning sunlight streaming through a window, soft shadows, and a blurred kitchen background."
        presets={["Studio white", "Lifestyle scene", "Outdoor natural", "Dramatic lighting", "Flat lay", "Close-up macro"]}
        requiresUpload="image"
      />
    </div>
  );
}
```

### 4. Update API route — `app/api/apps/creative-projects/route.ts`

Same pattern — add `"product-reshoot"` to `getKind()`, `getAppLabel()`, `buildImagePrompt()`, and POST handler:

**`getKind()`:** Add `if (app === "product-reshoot") return "image_edit";`

**`getAppLabel()`:** Add `if (app === "product-reshoot") return "Product Reshoot";`

**`buildImagePrompt()`:**
- Update type to include `"product-reshoot"`
- Add reshoot-specific prompt block:
```typescript
if (input.app === "product-reshoot") {
  return [
    "Reshoot the product in the provided image in a new setting.",
    `New scene description: ${input.prompt}.`,
    `Photography style: ${input.style}.`,
    `Aspect ratio: ${input.aspectRatio}.`,
    `Use this source image as the product reference: ${input.sourceImageUrl}. The product must remain exactly recognizable — same shape, colors, branding, and proportions.`,
    "Place the product naturally in the new scene with realistic lighting, shadows, and reflections that match the environment.",
    "Avoid embedded text, fake letters, labels, watermarks, captions, UI, or logos unless they are part of the original product.",
  ].join(" ");
}
```

**POST handler:** Add `"product-reshoot"` alongside the other image-editor variants.

## Verification

1. `pnpm lint` passes
2. Feature appears on dashboard under Image + Marketing starter kit
3. Upload product photo + scene description generates a reshoot
