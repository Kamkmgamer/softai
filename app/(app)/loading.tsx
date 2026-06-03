export default function AppRouteLoading() {
  return (
    <div className="space-y-6 animate-fade-in" aria-label="Loading page">
      <div className="space-y-2">
        <div className="h-4 w-24 animate-shimmer rounded" />
        <div className="h-8 w-56 animate-shimmer rounded" />
      </div>
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="h-4 w-full animate-shimmer rounded" />
        <div className="mt-3 h-4 w-3/4 animate-shimmer rounded" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-32 animate-shimmer rounded-lg" />
        <div className="h-32 animate-shimmer rounded-lg" />
      </div>
    </div>
  );
}
