import { CreativeAppForm } from "@/components/creative-app-form";

export default function LoopGeneratorPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="loop-generator"
        title="Loop Generator"
        description="Create perfect looping visual art for backgrounds, social media, and digital displays."
        placeholder="e.g., Flowing abstract particles in deep blue and gold, forming organic wave patterns that seamlessly loop."
        presets={["Fluid waves", "Particle flow", "Geometric loop", "Nature pulse"]}
      />
    </div>
  );
}
