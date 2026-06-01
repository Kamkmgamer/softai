import { CreativeAppForm } from "@/components/creative-app-form";

export default function WhiteboardAnimationPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="whiteboard-animation"
        title="Whiteboard Animation"
        description="Generate whiteboard-style teaching videos from a script. Watch concepts come to life with hand-drawn illustrations."
        placeholder="e.g., Explaining the water cycle: evaporation, condensation, precipitation, and collection. Simple, visual, and easy to remember."
        presets={["Classic whiteboard", "Colorful sketch", "Minimal line art", "Story-driven"]}
      />
    </div>
  );
}
