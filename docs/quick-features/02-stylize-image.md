# Stylize Image — Implementation Guide

**Complexity:** Trivial  
**Estimated time:** < 1 hour  
**Reuses:** `CreativeAppForm`, `creative-projects` API route, `generateReferencedImage()`

## What It Does

Apply artistic styles to an uploaded image — watercolor, oil painting, anime, cyberpunk, vintage film, etc.

## Files to Change

### 1. Register the feature — `lib/features.ts`

Add a new entry in the Image section (after the `image-editor` entry, around line 183):

```typescript
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
```

### 2. Add validator variant — `lib/validators.ts`

Add a new variant to the `creativeAppSchema` discriminated union:

```typescript
z.object({
  app: z.literal("stylize-image"),
  prompt: z.string().min(10).max(4000),
  sourceImageUrl: z.string().url(),
  style: z.string().min(2).max(80).default("Artistic transformation"),
  aspectRatio: z.enum(["9:16", "1:1", "16:9"]).default("9:16"),
}),
```

### 3. Create the page — `app/(app)/apps/stylize-image/page.tsx`

```tsx
import { CreativeAppForm } from "@/components/creative-app-form";

export default function StylizeImagePage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="stylize-image"
        title="Stylize Image"
        eyebrow="Artistic styles"
        description="Upload any image and transform it into a new artistic style — watercolor, oil painting, anime, cyberpunk, vintage film, and more."
        placeholder="Transform this product photo into a warm oil painting style with rich textures, visible brush strokes, and a golden-hour color palette."
        presets={["Watercolor", "Oil painting", "Anime", "Cyberpunk neon", "Vintage film", "Pencil sketch"]}
        requiresUpload="image"
      />
    </div>
  );
}
```

### 4. Update API route — `app/api/apps/creative-projects/route.ts`

Same pattern as Expand Image — add `"stylize-image"` to `getKind()`, `getAppLabel()`, `buildImagePrompt()`, and the POST handler conditionals:

**`getKind()`:** Add `if (app === "stylize-image") return "image_edit";`

**`getAppLabel()`:** Add `if (app === "stylize-image") return "Stylize Image";`

**`buildImagePrompt()`:**
- Update type to include `"stylize-image"`
- Add stylize-specific prompt block:
```typescript
if (input.app === "stylize-image") {
  return [
    "Apply an artistic style transformation to the provided image.",
    `Requested style: ${input.prompt}.`,
    `Style preset: ${input.style}.`,
    `Use this source image as the reference: ${input.sourceImageUrl}. Transform the visual style while preserving the subject composition and recognizable elements.`,
    "The result should feel like a cohesive artistic interpretation, not a simple filter overlay.",
    "Avoid embedded text, fake letters, labels, watermarks, captions, UI, or logos.",
  ].join(" ");
}
```

**POST handler:** Add `"stylize-image"` alongside `"image-editor"` and `"expand-image"` in the conditional checks for `addBrandAsset` and `generateReferencedImage`.

## Verification

1. `pnpm lint` passes
2. Feature appears on dashboard
3. Upload + style prompt generates a stylized image
