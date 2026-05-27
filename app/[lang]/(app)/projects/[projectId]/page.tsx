import ProjectDetailPage from "@/app/(app)/projects/[projectId]/page";

export default function LocalizedProjectDetailPage({
  params,
}: {
  params: Promise<{ lang: string; projectId: string }>;
}) {
  const projectParams = params.then(({ projectId }) => ({ projectId }));
  return <ProjectDetailPage params={projectParams} />;
}
