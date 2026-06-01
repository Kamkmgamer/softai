import { CreativeAppForm } from "@/components/creative-app-form";

export default function SurrealScenePage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="surreal-scene"
        title="Surreal Scene Builder"
        description="Generate dreamlike, impossible scenes from text prompts. Push the boundaries of reality with floating objects, ethereal lighting, and fantasy landscapes."
        placeholder="e.g., A floating city made of crystals above a serene ocean at sunset, with bioluminescent jellyfish drifting between the buildings."
        presets={["Dreamscape", "Impossible geometry", "Fantasy world", "Sci-fi surrealism"]}
      />
    </div>
  );
}
