# 07 - Image to Video

## Overview
Generate a short video from a single starting image. Unlike the multi-shot "edit-studio" feature, this is a quick tool that takes one image and a motion prompt, returning a single video.

## 1. Update Features Registry & Types
File: `lib/features.ts`
```typescript
{
  slug: "image-to-video",
  title: "Image to Video",
  description: "Animate an image into a video",
  icon: "video",
  appRoute: "/apps/image-to-video",
  projectKind: "image-to-video",
}
```

## 2. Update Validators
File: `lib/validators.ts`
```typescript
z.object({
  app: z.literal("image-to-video"),
  prompt: z.string().min(10).max(4000),
  sourceImageUrl: z.string().url(),
  style: z.string().min(2).max(80).default("Smooth pan"),
  aspectRatio: z.enum(["9:16", "1:1", "16:9"]).default("16:9"),
}),
```

## 3. Create the UI Pages
File: `app/(app)/apps/image-to-video/page.tsx` (and its i18n counterpart `app/[lang]/(app)/apps/image-to-video/page.tsx`)
```tsx
import { CreativeAppForm } from "@/components/creative-app-form";

export default function ImageToVideoPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="image-to-video"
        title="Image to Video"
        eyebrow="Animate your images"
        description="Upload an image and describe how you want it to move or animate."
        placeholder="e.g., The camera pans slowly to the right, clouds moving in the sky."
        presets=["Subtle motion", "Cinematic zoom", "Dynamic tilt"]
      />
    </div>
  );
}
```

## 4. API Modifications
Video generation is asynchronous (polling). `app/api/apps/creative-projects/route.ts` is currently built for synchronous image generation. You have two choices:

**Option A (Recommended): Create a new route for video apps.**
Create `app/api/apps/video-projects/route.ts` that handles `image-to-video`.
- Use `submitVideoRender(prompt, [input.sourceImageUrl], ...)` from `lib/openrouter.ts`.
- Save the project and then implement server-side polling (similar to `app/api/projects/[projectId]/render-video/route.ts`).
- Ensure it returns `{ project: {...}, output: { url: videoUrl } }`.

**Option B: Modify `creative-projects/route.ts` to support Video.**
- If `input.app === "image-to-video"`, call `submitVideoRender` instead of `generateReferencedImage`.
- Implement polling loop (`pollVideoStatus`) inside the route handler until the video completes.
- Save output type as `final_video` instead of `scene_image`.

## 5. Verification
- Verify the API holds video credits instead of image credits! `holdVideoCredits(user.id, project.id)`
- Test generating a video and ensure the project dashboard correctly displays the `.mp4` result.
