import { CreativeAppForm } from "@/components/creative-app-form";

export default function EditStudioPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="edit-studio"
        title="Edit Studio"
        eyebrow="AI video editing"
        description="Create a Runway-style edit plan for transforming source footage: relight, restyle, remove distractions, or change the commercial direction."
        placeholder="Transform this into a high-converting product ad: brighten the product, remove background clutter, add smooth camera motion, make the room feel premium, and end on a clean hero shot."
        presets={["Transform video", "Remove object", "Change backdrop", "Relight scene", "Change time of day"]}
        requiresUpload="video"
      />
    </div>
  );
}
