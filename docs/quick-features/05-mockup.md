# 05 - Mockup

## Overview
Place a design (like a logo or graphic) onto real-world product mockups (t-shirts, mugs, screens, billboards) using the existing image referencing pipeline.

## 1. Update Features Registry
File: `lib/features.ts`
Add a new object to the `features` array:
```typescript
{
  slug: "mockup",
  title: "Mockup Generator",
  description: "Place your design on real-world products",
  icon: "monitor",
  appRoute: "/apps/mockup",
  projectKind: "mockup", // you may need to add this to types.ts `ProjectKind` if not already present
}
```

## 2. Update Validators
File: `lib/validators.ts`
Add the variant to `CreativeAppKind` and `creativeAppSchema`:
```typescript
// Update the CreativeAppKind type
type CreativeAppKind = "text-to-image" | "image-editor" | "edit-studio" | "expand-image" | "stylize-image" | "product-reshoot" | "vary-image" | "mockup";

// Add to creativeAppSchema discriminated union
z.object({
  app: z.literal("mockup"),
  prompt: z.string().min(10).max(4000),
  sourceImageUrl: z.string().url(),
  style: z.string().min(2).max(80).default("Photorealistic"),
  aspectRatio: z.enum(["9:16", "1:1", "16:9"]).default("1:1"),
}),
```

## 3. Create the UI Pages
File: `app/(app)/apps/mockup/page.tsx`
```tsx
import { CreativeAppForm } from "@/components/creative-app-form";

export default function MockupPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="mockup"
        title="Product Mockup"
        eyebrow="Visualize your designs"
        description="Upload a design or logo and describe where it should be placed (e.g., 'on a white t-shirt')."
        placeholder="e.g., A white ceramic coffee mug on a wooden desk with a plant."
        presets={["Apparel", "Print media", "Digital screens", "Outdoor signage"]}
      />
    </div>
  );
}
```
File: `app/[lang]/(app)/apps/mockup/page.tsx`
```tsx
export { default } from "@/app/(app)/apps/mockup/page";
```

## 4. API Modifications
File: `app/api/apps/creative-projects/route.ts`
- Add `"mockup"` to the `getKind()` switch, returning `"mockup"`.
- Add `"mockup"` to `getAppLabel()`, returning `"Mockup"`.
- In `POST`, add `"mockup"` to all `if` condition checks that verify if the app requires a `sourceImageUrl` (lines where `image-editor` and `expand-image` are checked). This ensures `sourceImageUrl` is extracted into the payload and used in `generateReferencedImage()`.

File: `components/creative-app-form.tsx`
- Ensure `mockup` is included in the condition block for `sourceImageUrl` so it includes the file upload button and attaches it to the form body payload.

## 5. Verification
- Run `pnpm lint`
- Upload a design and generate a mockup to verify `generateReferencedImage()` is correctly triggered.
