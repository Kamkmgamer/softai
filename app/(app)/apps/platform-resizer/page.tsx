import { CreativeAppForm } from "@/components/creative-app-form";

export default function PlatformResizerPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="platform-resizer"
        title="Platform Resizer"
        description="Upload an image and adapt it for any social platform. Smart crop and reframe preserve the most important visual elements."
        placeholder="e.g., Adapt this image for Instagram Reels format while keeping the product centered."
        presets={["Instagram Reel", "TikTok", "YouTube Short", "LinkedIn", "Story format"]}
        requiresUpload="image"
      />
    </div>
  );
}
