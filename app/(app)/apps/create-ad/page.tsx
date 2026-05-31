import { CreativeAppForm } from "@/components/creative-app-form";

export default function CreateAdPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="create-ad"
        title="Create Ad"
        description="Describe the ad you want to create. Optionally upload an existing ad or product photo to generate variations."
        placeholder="e.g., A bright, highly converting Instagram story ad for a summer skincare line, featuring text 'Summer Sale'."
        presets={["Headline swap", "Color palette change", "Product swap", "Seasonal theme"]}
        allowUpload="image"
      />
    </div>
  );
}
