import { CreativeAppForm } from "@/components/creative-app-form";

export default function LessonToVideoPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="lesson-to-video"
        title="Lesson to Video"
        description="Describe your lesson topic and key points. The AI will generate a structured teaching video with scenes, visuals, and narration."
        placeholder="e.g., Introduction to photosynthesis: how plants convert sunlight into energy. Cover the light reactions, Calvin cycle, and real-world applications."
        presets={["Science lesson", "Math concept", "History overview", "Language tutorial"]}
      />
    </div>
  );
}
