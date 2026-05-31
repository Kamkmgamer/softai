import { CreativeAppForm } from "@/components/creative-app-form";

export default function StylizeImagePage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="stylize-image"
        title="Stylize Image"
        description="Upload any image and transform it into a new artistic style — watercolor, oil painting, anime, cyberpunk, vintage film, and more."
        placeholder="Transform this product photo into a warm oil painting style with rich textures, visible brush strokes, and a golden-hour color palette."
        presets={["Watercolor", "Oil painting", "Anime", "Cyberpunk neon", "Vintage film", "Pencil sketch"]}
        requiresUpload="image"
      />
    </div>
  );
}
