import { ArrowRight, CheckCircle2, Sparkles, Zap } from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { ButtonLink, Card, Pill } from "@/components/ui";

const features = [
  "Create vertical ads from brand assets and one script",
  "Generate image scenes and final video from the same project brief",
  "Support self avatars, AI people, and rights-attested talent",
  "Track credits, reports, and admin actions inside one app shell",
];

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 py-12 lg:px-10">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8 rounded-[2.5rem] border border-border bg-[linear-gradient(135deg,#fff7eb,rgba(255,255,255,0.75))] p-8 shadow-[0_24px_80px_rgba(82,41,11,0.14)] lg:p-12">
            <Pill>SMB ad video studio</Pill>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-foreground lg:text-7xl">
                Launch a short-form ad campaign before an agency can book the shoot.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted">
                SoftAI turns your product photos, offer, CTA, and script into a storyboard, scene art,
                and final vertical ad video. Built for founders who need usable creative, not a toy prompt box.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href="/dashboard">Build your first campaign</ButtonLink>
              <ButtonLink href="/pricing" variant="secondary">
                See pricing
              </ButtonLink>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="flex gap-3 rounded-[1.5rem] border border-border bg-white/70 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
                  <p className="text-sm leading-6 text-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="mesh-panel rounded-[2.5rem] p-8 lg:p-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Pill tone="warning">Hero workflow</Pill>
                <Sparkles className="h-5 w-5 text-accent-strong" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold">Storyboard to final render</h2>
                <p className="text-sm leading-7 text-muted">
                  Collect the brief, build 3-6 scenes, review the script, then render scene images and a 9:16 ad video.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  "1. Create project brief",
                  "2. Upload logos and product images",
                  "3. Add a self-photo or AI actor",
                  "4. Review scenes and CTA",
                  "5. Render the final vertical ad",
                ].map((step) => (
                  <div key={step} className="flex items-center justify-between rounded-2xl border border-border bg-white/75 px-4 py-3">
                    <span className="text-sm font-medium">{step}</span>
                    <ArrowRight className="h-4 w-4 text-muted" />
                  </div>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-border bg-white/75 p-5">
                  <Zap className="h-5 w-5 text-accent-strong" />
                  <p className="mt-3 text-3xl font-semibold">1 gateway</p>
                  <p className="mt-1 text-sm text-muted">OpenRouter handles text, image, and video generation.</p>
                </div>
                <div className="rounded-[1.5rem] border border-border bg-white/75 p-5">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <p className="mt-3 text-3xl font-semibold">Traceable</p>
                  <p className="mt-1 text-sm text-muted">Credits, audit logs, and output metadata are built in.</p>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
