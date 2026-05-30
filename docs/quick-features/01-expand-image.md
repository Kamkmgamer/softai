# Expand Image — Implementation Guide

**Complexity:** Trivial  
**Estimated time:** < 1 hour  
**Reuses:** `CreativeAppForm`, `creative-projects` API route, `generateReferencedImage()`

## What It Does

Extend an image beyond its original borders (outpainting). The user uploads an image and describes how the extended area should look.

## Files to Change

### 1. Register the feature — `lib/features.ts`

Update the existing `coming_soon` entry for `expand-image` (around line 194-201):
- Change `status` from `"coming_soon"` to `"implemented"`
- Add `projectKind: "image_edit"`

```diff
  {
    slug: "expand-image",
    title: "Expand Image",
    description: "Extend an image beyond its original frame.",
    image: "/hero-mockup.png",
    category: "Image",
-   status: "coming_soon",
+   status: "implemented",
    appRoute: "/apps/expand-image",
+   projectKind: "image_edit",
  },
```

### 2. Add validator variant — `lib/validators.ts`

Add a new variant to the `creativeAppSchema` discriminated union (after line 127):

```typescript
z.object({
  app: z.literal("expand-image"),
  prompt: z.string().min(10).max(4000),
  sourceImageUrl: z.string().url(),
  style: z.string().min(2).max(80).default("Seamless extension"),
  aspectRatio: z.enum(["9:16", "1:1", "16:9", "4:3", "3:4"]).default("16:9"),
}),
```

### 3. Create the page — `app/(app)/apps/expand-image/page.tsx`

```tsx
import { CreativeAppForm } from "@/components/creative-app-form";

export default function ExpandImagePage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="expand-image"
        title="Expand Image"
        eyebrow="Image outpainting"
        description="Upload an image and describe how to extend it beyond its original borders — add scenery, extend backgrounds, or widen compositions."
        placeholder="Extend this product photo to the right with a matching marble countertop, soft natural light, and subtle bokeh in the background."
        presets={["Extend background", "Widen composition", "Add scenery", "Panoramic extend", "Fill canvas"]}
        requiresUpload="image"
      />
    </div>
  );
}
```

### 4. Update API route — `app/api/apps/creative-projects/route.ts`

Add `"expand-image"` to the `getKind()`, `getAppLabel()`, and `buildImagePrompt()` functions:

**`getKind()` (line ~29):**
```diff
 function getKind(app: CreativeInput["app"]): ProjectKind {
   if (app === "text-to-image") return "text_to_image";
   if (app === "image-editor") return "image_edit";
+  if (app === "expand-image") return "image_edit";
   return "video_edit";
 }
```

**`getAppLabel()` (line ~35):**
```diff
 function getAppLabel(app: CreativeInput["app"]) {
   if (app === "text-to-image") return "Text to Image";
   if (app === "image-editor") return "AI Image Editor";
+  if (app === "expand-image") return "Expand Image";
   return "Edit Studio";
 }
```

**`buildImagePrompt()` (line ~41):** Update the type and add expand-specific prompt:
```diff
-function buildImagePrompt(input: Extract<CreativeInput, { app: "text-to-image" | "image-editor" }>) {
+function buildImagePrompt(input: Extract<CreativeInput, { app: "text-to-image" | "image-editor" | "expand-image" }>) {
+  if (input.app === "expand-image") {
+    return [
+      "Expand/outpaint the provided image beyond its current borders.",
+      `Expansion direction and content: ${input.prompt}.`,
+      `Target aspect ratio: ${input.aspectRatio}.`,
+      `Style: ${input.style}.`,
+      `Use this source image as the starting point: ${input.sourceImageUrl}. Seamlessly extend the image content, matching lighting, perspective, color palette, and style perfectly.`,
+      "The expanded area must look naturally continuous with the original image. Avoid visible seams, abrupt color shifts, or style mismatches.",
+      "Avoid embedded text, fake letters, labels, watermarks, captions, UI, or logos.",
+    ].join(" ");
+  }
+
   const sourceInstruction = input.app === "image-editor"
```

**POST handler (line ~131):** Add `"expand-image"` alongside `"image-editor"` in all the conditional checks:
```diff
-    if (input.app === "image-editor") {
+    if (input.app === "image-editor" || input.app === "expand-image") {
       await addBrandAsset(user.id, project.id, {
```

```diff
-    const result = input.app === "image-editor"
+    const result = (input.app === "image-editor" || input.app === "expand-image")
       ? await generateReferencedImage({ prompt, imageUrl: input.sourceImageUrl, language: "en" })
```

## Verification

1. `pnpm lint` passes
2. Feature appears on dashboard as implemented (not "coming soon")
3. Clicking it navigates to `/apps/expand-image`
4. Upload + prompt generates an expanded image
