# 06 - Create Ad / Vary Ad

## Overview
Generate ad creatives from scratch or create variations of an existing product image/ad using ad-specific prompts. 
To keep things unified, we'll implement this as a `create-ad` tool that allows an **optional** source image. If the user uploads an image, it acts like "Vary Ad". If they don't, it acts like "Create Ad" (pure text-to-image).

## 1. Update Features Registry
File: `lib/features.ts`
```typescript
{
  slug: "create-ad",
  title: "Create Ad",
  description: "Generate ad creatives from scratch or variations of an existing ad",
  icon: "megaphone",
  appRoute: "/apps/create-ad",
  projectKind: "create-ad", // add to types.ts `ProjectKind` if needed
}
```

## 2. Update Validators
File: `lib/validators.ts`
Update `CreativeAppKind` union, and add the variant to `creativeAppSchema`. Notice we make `sourceImageUrl` optional here!
```typescript
z.object({
  app: z.literal("create-ad"),
  prompt: z.string().min(10).max(4000),
  sourceImageUrl: z.string().url().optional().nullable(),
  style: z.string().min(2).max(80).default("Social media ad"),
  aspectRatio: z.enum(["9:16", "1:1", "16:9"]).default("9:16"),
}),
```

## 3. Create the UI Pages
File: `app/(app)/apps/create-ad/page.tsx`
```tsx
import { CreativeAppForm } from "@/components/creative-app-form";

export default function CreateAdPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="create-ad"
        title="Create Ad"
        eyebrow="Ad Generation"
        description="Describe the ad you want to create. Optionally upload an existing ad or product photo to generate variations."
        placeholder="e.g., A bright, highly converting Instagram story ad for a summer skincare line, featuring text 'Summer Sale'."
        presets={["Headline swap", "Color palette change", "Product swap", "Seasonal theme"]}
      />
    </div>
  );
}
```
File: `app/[lang]/(app)/apps/create-ad/page.tsx`
```tsx
export { default } from "@/app/(app)/apps/create-ad/page";
```

## 4. API Modifications
File: `app/api/apps/creative-projects/route.ts`
- **getKind() and getAppLabel():** Add `"create-ad"`.
- **Payload & Brand Asset checks:** Include `"create-ad"` in the checks that extract `sourceImageUrl` if it exists.
- **Generation Logic:** Here, you need a dynamic check. 
  ```typescript
  const result = (input.sourceImageUrl)
    ? await generateReferencedImage({ prompt, imageUrl: input.sourceImageUrl, language: "en" })
    : await generateSceneImage(prompt, "en");
  ```
  Make sure this gracefully handles both pure text generation and referenced image generation based on user input.

File: `components/creative-app-form.tsx`
- Ensure the form allows uploading an image for `create-ad`, but does not make it mandatory.

## 5. Verification
- Test generating an ad *without* an image.
- Test generating an ad *with* an image (variation).
