export default function AppRouteLoading() {
  return (
    <div className="space-y-6" aria-label="Loading page">
      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-surface-raised" />
        <div className="h-8 w-56 animate-pulse rounded bg-surface-raised" />
      </div>
      <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
        <div className="h-4 w-full animate-pulse rounded bg-surface-raised" />
        <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-surface-raised" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-32 animate-pulse rounded-[var(--radius-lg)] bg-surface-raised" />
        <div className="h-32 animate-pulse rounded-[var(--radius-lg)] bg-surface-raised" />
      </div>
    </div>
  );
}
