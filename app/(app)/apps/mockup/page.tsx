import { CreativeAppForm } from "@/components/creative-app-form";

export default function MockupPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="mockup"
        title="Product Mockup"
        description="Upload a design or logo and describe where it should be placed on a real-world product."
        placeholder="e.g., A white ceramic coffee mug on a wooden desk with a plant."
        presets={["Apparel", "Print media", "Digital screens", "Outdoor signage"]}
        requiresUpload="image"
      />
    </div>
  );
}
