import ReviewPage from "@/app/(app)/projects/[projectId]/review/page";

export default function LocalizedReviewPage({
  params,
}: {
  params: Promise<{ lang: string; projectId: string }>;
}) {
  const projectParams = params.then(({ projectId }) => ({ projectId }));
  return <ReviewPage params={projectParams} />;
}
