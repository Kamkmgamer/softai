import { CreativeAppForm } from "@/components/creative-app-form";

export default function SeasonalTransformPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="seasonal-transform"
        title="Seasonal Campaign Transformer"
        description="Upload an existing ad and transform it into a seasonal version. Automatically applies holiday theming while keeping your core message."
        placeholder="e.g., Transform this ad for the holiday season with warm winter colors, snowflakes, and a gift-giving atmosphere."
        presets={["Summer vibes", "Holiday season", "Back to school", "Spring refresh"]}
        requiresUpload="image"
      />
    </div>
  );
}
