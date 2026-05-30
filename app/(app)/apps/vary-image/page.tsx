import { CreativeAppForm } from "@/components/creative-app-form";

export default function VaryImagePage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="vary-image"
        title="Vary Image"
        eyebrow="Image variations"
        description="Upload an image and describe what to change — swap colors, alter elements, adjust mood, or explore creative directions while keeping the core composition."
        placeholder="Keep the same product and composition but change the background to a deep navy blue, make the lighting cooler and more dramatic, and add subtle lens flare."
        presets={["Color swap", "Mood shift", "Season change", "Time of day", "Material swap", "Background change"]}
        requiresUpload="image"
      />
    </div>
  );
}
