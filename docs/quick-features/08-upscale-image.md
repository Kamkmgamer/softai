# 08 - Upscale Image

## Overview
Upscale any image to higher resolution. This relies on having an upscaler model available or prompting an existing model to recreate the image at higher detail without altering the content.

## 1. Verify Model Capability
Before implementing, verify if your OpenRouter models (`google/gemini-2.5-flash-image` or equivalent) natively support upscaling via an API parameter or simply via prompting.
- If it supports upscaling via a parameter, you will need to update `generateReferencedImage` in `lib/openrouter.ts` to pass an upscale flag.
- If it doesn't, you must rely on prompt engineering (e.g., "Upscale this image to 4k resolution, maintaining exact details").

## 2. Update Features Registry
File: `lib/features.ts`
```typescript
{
  slug: "upscale-image",
  title: "Upscale Image",
  description: "Upscale any image to higher resolution",
  icon: "maximize",
  appRoute: "/apps/upscale-image",
  projectKind: "upscale-image",
}
```

## 3. Update Validators
File: `lib/validators.ts`
```typescript
z.object({
  app: z.literal("upscale-image"),
  prompt: z.string().max(4000).optional().default("Upscale to maximum resolution, enhance details, preserve original composition"),
  sourceImageUrl: z.string().url(),
  style: z.string().max(80).default("High fidelity"),
  aspectRatio: z.enum(["9:16", "1:1", "16:9"]).default("16:9"),
}),
```

## 4. Create the UI Pages
File: `app/(app)/apps/upscale-image/page.tsx` (and `[lang]` counterpart)
```tsx
import { CreativeAppForm } from "@/components/creative-app-form";

export default function UpscaleImagePage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="upscale-image"
        title="Upscale Image"
        eyebrow="Enhance Quality"
        description="Upload an image to upscale it to a higher resolution."
        placeholder="Optional: Any specific details to enhance? (e.g., sharpen faces, reduce noise)"
        presets={["2x Upscale", "4x Upscale", "Noise reduction"]}
      />
    </div>
  );
}
```

## 5. API Modifications
File: `app/api/apps/creative-projects/route.ts`
- Add `"upscale-image"` to `getKind()` and `getAppLabel()`.
- Add `"upscale-image"` to the `sourceImageUrl` payload extraction checks.
- If using prompt-engineering for upscaling, the existing `generateReferencedImage` will work. If using a specialized provider route (e.g., an upscale specific API endpoint), you may need to branch the logic:
  ```typescript
  const result = input.app === "upscale-image"
      ? await upscaleImageAPI({ imageUrl: input.sourceImageUrl })
      : ...
  ```

## 6. Verification
- Test an upscale request and verify the output dimensions are larger or the image quality is enhanced.
