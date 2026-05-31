import { CreativeAppForm } from "@/components/creative-app-form";

export default function ImageEditorPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="image-editor"
        title="AI Image Editor"
        description="Upload one reference image, then restyle, relight, reshoot, or change the backdrop with a plain-English instruction."
        placeholder="Keep the product exactly recognizable, replace the background with a warm kitchen counter scene, add golden-hour light, and make it feel like a premium direct-to-consumer ad."
        presets={["Reshoot product", "Change backdrop", "Relight scene", "Change image style", "Remove distractions"]}
        requiresUpload="image"
      />
    </div>
  );
}
