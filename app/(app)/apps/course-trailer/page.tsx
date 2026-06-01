import { CreativeAppForm } from "@/components/creative-app-form";

export default function CourseTrailerPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="course-trailer"
        title="Course Trailer"
        description="Create a compelling trailer to promote your online course. Highlight key topics and outcomes to drive enrollments."
        placeholder="e.g., Complete Digital Marketing Mastery course. Covers SEO, social media ads, email marketing, analytics, and conversion optimization."
        presets={["Professional promo", "Casual & friendly", "Urgency-driven", "Testimonial style"]}
      />
    </div>
  );
}
