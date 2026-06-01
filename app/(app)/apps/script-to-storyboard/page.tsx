import { CreativeAppForm } from "@/components/creative-app-form";

export default function ScriptToStoryboardPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="script-to-storyboard"
        title="Script to Storyboard"
        description="Paste your script and get a full storyboard with scene breakdowns, visual directions, and narration."
        placeholder="e.g., A 30-second ad for a coffee brand. Scene 1: Morning sunrise over a farm. Scene 2: Hands picking coffee beans. Scene 3: Brewing a perfect cup. Scene 4: Happy customer enjoying the first sip."
        presets={["30s ad script", "60s promo", "Product story", "Brand narrative"]}
      />
    </div>
  );
}
