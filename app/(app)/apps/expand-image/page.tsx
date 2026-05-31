import { CreativeAppForm } from "@/components/creative-app-form";

export default function ExpandImagePage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="expand-image"
        title="Expand Image"
        description="Upload an image and describe how to extend it beyond its original borders — add scenery, extend backgrounds, or widen compositions."
        placeholder="Extend this product photo to the right with a matching marble countertop, soft natural light, and subtle bokeh in the background."
        presets={["Extend background", "Widen composition", "Add scenery", "Panoramic extend", "Fill canvas"]}
        requiresUpload="image"
      />
    </div>
  );
}
