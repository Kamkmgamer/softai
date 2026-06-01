import SharePage from "@/app/(app)/share/[token]/page";

export default function LocalizedSharePage({
  params,
}: {
  params: Promise<{ lang: string; token: string }>;
}) {
  const pageParams = params.then(({ token }) => ({ token }));
  return <SharePage params={pageParams} />;
}
