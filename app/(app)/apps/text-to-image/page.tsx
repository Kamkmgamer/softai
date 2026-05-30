import { CreativeAppForm } from "@/components/creative-app-form";

export default function TextToImagePage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="text-to-image"
        title="Text to Image"
        eyebrow="Image generation"
        description="Generate ad-ready image plates from a prompt, with clean space for copy and platform crops."
        placeholder="A premium skincare bottle on wet black stone, soft morning window light, condensation, warm beige background, clean empty space at top for offer copy."
        presets={["Product hero", "Social ad", "Editorial still", "Luxury studio", "Bold ecommerce"]}
      />
    </div>
  );
}
