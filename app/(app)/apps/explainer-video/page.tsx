import { CreativeAppForm } from "@/components/creative-app-form";

export default function ExplainerVideoPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="explainer-video"
        title="Explainer Video Builder"
        description="Create step-by-step explainer videos from a concept description. Perfect for tutorials, onboarding, and educational content."
        placeholder="e.g., How to set up a Shopify store in 5 steps. Cover account creation, product listing, payment setup, theme customization, and launch."
        presets={["How-to tutorial", "Product demo", "Onboarding flow", "Concept explainer"]}
      />
    </div>
  );
}
