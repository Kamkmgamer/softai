import { CreativeAppForm } from "@/components/creative-app-form";

export default function VisualRemixPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="visual-remix"
        title="Visual Remix"
        description="Upload an image and generate multiple styled variations. Reimagine your visuals with bold creative transformations."
        placeholder="Remix this product photo into a neon-lit cyberpunk version with glowing edges and a futuristic cityscape background."
        presets={["Neon remix", "Vintage reimagined", "Abstract art", "Pop art style"]}
        requiresUpload="image"
      />
    </div>
  );
}
