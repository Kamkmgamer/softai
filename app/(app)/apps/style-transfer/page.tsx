import { CreativeAppForm } from "@/components/creative-app-form";

export default function StyleTransferPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="style-transfer"
        title="Style Transfer"
        description="Upload any image and transform it into a new artistic style. Choose from oil painting, watercolor, anime, cyberpunk, and more."
        placeholder="Transform this photo into a vibrant watercolor painting with soft edges, flowing colors, and a dreamy atmosphere."
        presets={["Oil painting", "Watercolor", "Anime style", "Cyberpunk neon", "Vintage film", "Pencil sketch"]}
        requiresUpload="image"
      />
    </div>
  );
}
