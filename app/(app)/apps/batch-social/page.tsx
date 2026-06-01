import { CreativeAppForm } from "@/components/creative-app-form";

export default function BatchSocialPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="batch-social"
        title="Batch Social Generator"
        description="Describe your brand or product and generate a week of platform-specific social posts with matching visuals."
        placeholder="e.g., A organic skincare brand targeting millennials. Products: vitamin C serum, retinol night cream. Tone: friendly, educational, empowering."
        presets={["Instagram focus", "TikTok trends", "LinkedIn professional", "Multi-platform"]}
      />
    </div>
  );
}
