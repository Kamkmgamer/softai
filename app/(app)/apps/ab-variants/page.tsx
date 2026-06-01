import { CreativeAppForm } from "@/components/creative-app-form";

export default function AbVariantsPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="ab-variants"
        title="A/B Variant Generator"
        description="Generate multiple ad variations from one concept. Test different visual approaches to find what converts best."
        placeholder="e.g., A summer sale ad for a fitness app. Generate variants with different color palettes, focal points, and layouts."
        presets={["Color test", "Layout variants", "CTA variations", "Audience splits"]}
        allowUpload="image"
      />
    </div>
  );
}
