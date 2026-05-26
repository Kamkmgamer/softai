import { MarketingNav } from "@/components/marketing-nav";
import { Card, PageHeader, Pill } from "@/components/ui";

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <main className="mx-auto max-w-6xl px-6 py-12 lg:px-10">
        <PageHeader
          eyebrow="Pricing"
          title="One focused plan for SMB creative teams."
          description="The v1 commercial model is subscription plus credits. You get predictable monthly capacity with overage control rather than unlimited usage."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-[2.5rem] p-8">
            <Pill>Starter</Pill>
            <p className="mt-4 text-5xl font-semibold">$79</p>
            <p className="mt-2 text-sm text-muted">per month, billed via Polar</p>
            <ul className="mt-8 space-y-4 text-sm leading-6 text-muted">
              <li>1,000 monthly credits</li>
              <li>Storyboard, image batch, and video render pipeline</li>
              <li>Asset library and campaign archive</li>
              <li>Abuse reporting and admin safety tools</li>
              <li>Demo mode fallback while you wire live providers</li>
            </ul>
          </Card>
          <Card className="rounded-[2.5rem] p-8">
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-accent-strong">Credit economics</p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-border bg-white/70 p-4">
                <p className="text-sm font-medium">Storyboard draft</p>
                <p className="mt-1 text-sm text-muted">25 credits</p>
              </div>
              <div className="rounded-2xl border border-border bg-white/70 p-4">
                <p className="text-sm font-medium">Scene image generation</p>
                <p className="mt-1 text-sm text-muted">120 credits per batch</p>
              </div>
              <div className="rounded-2xl border border-border bg-white/70 p-4">
                <p className="text-sm font-medium">Final video render</p>
                <p className="mt-1 text-sm text-muted">300 credits</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
