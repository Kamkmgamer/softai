import { CreativeAppForm } from "@/components/creative-app-form";

export default function HookGeneratorPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="hook-generator"
        title="Short-Form Hook Generator"
        description="Generate scroll-stopping hook images for Instagram Reels, TikToks, and YouTube Shorts."
        placeholder="e.g., A fitness transformation story. Hook should create curiosity about the before/after results."
        presets={["Curiosity gap", "Bold claim", "Question hook", "Contrarian take"]}
      />
    </div>
  );
}
