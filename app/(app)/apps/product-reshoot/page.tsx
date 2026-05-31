import { CreativeAppForm } from "@/components/creative-app-form";

export default function ProductReshootPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="product-reshoot"
        title="Product Reshoot"
        description="Upload your product photo and describe a new setting, lighting, or angle — get a studio-quality reshoot without the studio."
        placeholder="Place this product on a rustic wooden table with warm morning sunlight streaming through a window, soft shadows, and a blurred kitchen background."
        presets={["Studio white", "Lifestyle scene", "Outdoor natural", "Dramatic lighting", "Flat lay", "Close-up macro"]}
        requiresUpload="image"
      />
    </div>
  );
}
