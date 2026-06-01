import { CreativeAppForm } from "@/components/creative-app-form";

export default function CarouselBuilderPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="carousel-builder"
        title="Carousel Builder"
        description="Create multi-slide carousel posts for Instagram and LinkedIn. Describe your topic and get a cohesive set of slides."
        placeholder="e.g., 5 tips for small business owners to improve their social media presence. Include practical, actionable advice."
        presets={["How-to guide", "Data storytelling", "Tips & tricks", "Case study"]}
      />
    </div>
  );
}
