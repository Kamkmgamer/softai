import Link from "next/link";
import Image from "next/image";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { getAppSession } from "@/lib/auth";

export default async function MarketingPage() {
  const session = await getAppSession().catch(() => null);
  const hasAccess = session !== null;

  return (
    <div className="flex min-h-screen flex-col bg-bg selection:bg-accent-soft selection:text-text">
      <MarketingNav hasAccess={hasAccess} />

      <main className="flex-1 overflow-hidden">
        {/* Hero Section */}
        <section className="relative mx-auto max-w-[1200px] px-6 py-20 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-8 items-center">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-[13px] font-medium text-accent-text">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                SoftAI Studio v2.0
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-[4rem] lg:leading-[1.1] text-balance">
                Turn your product brief into a video ad.
              </h1>
              <p className="mt-6 text-lg text-text-secondary max-w-xl text-pretty leading-relaxed">
                Upload your product images, paste your script, and generate short-form
                video campaigns ready for TikTok and Instagram. No timeline editor required.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href={hasAccess ? "/dashboard" : "/sign-up"} className="btn-primary px-7 py-3.5 text-[15px]">
                  {hasAccess ? "Go to Dashboard" : "Start a project"}
                </Link>
                <Link href="/pricing" className="btn-secondary px-7 py-3.5 text-[15px]">
                  See pricing
                </Link>
              </div>
            </div>
            
            <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none">
              <div className="relative rounded-2xl border border-border/50 bg-surface/50 p-2 shadow-2xl backdrop-blur-xl">
                <div className="overflow-hidden rounded-xl border border-border">
                  <Image 
                    src="/hero-mockup.png" 
                    alt="SoftAI Dashboard Interface" 
                    width={1200} 
                    height={800}
                    className="w-full object-cover"
                    priority
                  />
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-x-10 -inset-y-10 -z-10 bg-gradient-to-tr from-accent/20 via-transparent to-transparent blur-3xl opacity-50" />
            </div>
          </div>
        </section>

        {/* Social Proof / Stats Bar */}
        <section className="border-y border-border bg-surface py-10">
          <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-12 px-6 text-center sm:gap-24 lg:justify-start lg:text-left">
            <div className="min-w-[120px]">
              <p className="text-3xl font-semibold tracking-tight text-text">10x</p>
              <p className="mt-1.5 text-sm font-medium text-text-secondary">Faster production</p>
            </div>
            <div className="min-w-[120px]">
              <p className="text-3xl font-semibold tracking-tight text-text">9:16</p>
              <p className="mt-1.5 text-sm font-medium text-text-secondary">Native format</p>
            </div>
            <div className="min-w-[120px]">
              <p className="text-3xl font-semibold tracking-tight text-text">100%</p>
              <p className="mt-1.5 text-sm font-medium text-text-secondary">Brand control</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-[1200px] px-6 py-24 lg:py-32">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">How it works</h2>
            <p className="mt-4 text-lg text-text-secondary leading-relaxed">
              Our pipeline is designed for SMB operators who need to ship campaigns, not learn complex video editing software.
            </p>
          </div>
          
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24 items-center">
            <div className="space-y-12">
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold text-text shadow-[var(--shadow-sm)]">
                  1
                </div>
                <h3 className="text-lg font-medium text-text">Create a brief</h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  Define your target audience, offer, and brand voice. Paste a rough script seed and upload your core product imagery.
                </p>
              </div>
              
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold text-text shadow-[var(--shadow-sm)]">
                  2
                </div>
                <h3 className="text-lg font-medium text-text">Review storyboard</h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  We generate a scene-by-scene storyboard. You tweak the voiceover narration and visual prompts before rendering.
                </p>
              </div>
              
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold text-text shadow-[var(--shadow-sm)]">
                  3
                </div>
                <h3 className="text-lg font-medium text-text">Render & export</h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  Our pipeline renders the visuals, generates the TTS narration, and produces a final video ready for ad platforms.
                </p>
              </div>
            </div>
            
            <div className="relative w-full">
              <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-2 shadow-xl">
                <div className="overflow-hidden rounded-md border border-border">
                  <Image 
                    src="/storyboard-feature.png" 
                    alt="Storyboard Scene Editor Interface" 
                    width={800} 
                    height={600}
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-surface-raised py-24 lg:py-32">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="mb-12 text-3xl font-semibold tracking-tight text-text sm:text-4xl text-center lg:text-left">Everything you need</h2>
            
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface p-8 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent-text ring-1 ring-accent/20">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium tracking-tight text-text">Automated Storyboarding</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
                  Our system breaks down your brief into pacing-optimized scenes. It generates 
                  hook-focused narration, visual prompts for the image generator, and suggested 
                  text overlays perfectly timed for short-form content.
                </p>
                <div className="mt-8 overflow-hidden rounded-lg border border-border">
                  <Image 
                    src="/rendering-feature.png" 
                    alt="Rendering Progress Interface" 
                    width={800} 
                    height={400}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-8">
                <div className="flex-1 rounded-[var(--radius-lg)] border border-border bg-surface p-8 shadow-[var(--shadow-sm)]">
                  <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-sunken text-text-secondary ring-1 ring-border">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-medium tracking-tight text-text">Brand safety</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    Strict policies ensure your product imagery remains secure. We do not train foundational models on your private brand assets or generations.
                  </p>
                </div>
                
                <div className="flex-1 rounded-[var(--radius-lg)] border border-border bg-surface p-8 shadow-[var(--shadow-sm)]">
                  <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-sunken text-text-secondary ring-1 ring-border">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-medium tracking-tight text-text">Consistent Avatars</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    Upload a reference photo of your brand spokesperson and our pipeline ensures their likeness is maintained across generated scenes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
