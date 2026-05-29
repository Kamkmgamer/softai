import Image from "next/image";
import { ProjectCreationForm } from "@/components/project-creation-form";

export default function NewProjectPage() {
  return (
    <div className="grid min-h-[calc(100dvh-4rem)] bg-bg lg:min-h-[100dvh] lg:grid-cols-[464px_1fr]">
      <section className="border-border bg-surface px-5 py-6 lg:border-r lg:px-4 lg:py-4">
        <ProjectCreationForm />
      </section>

      <section className="relative flex min-h-[620px] items-center justify-center px-5 py-12 lg:px-10">
        <div className="absolute right-3 top-3 hidden gap-2 lg:flex">
          <span className="rounded-lg bg-surface-raised px-3 py-2 text-sm font-semibold text-text">Login</span>
          <span className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-text">Sign up</span>
        </div>
        <div className="w-full max-w-[1130px] rounded-[18px] bg-surface p-6 shadow-[var(--shadow-lg)] ring-1 ring-border">
          <div className="mb-5 space-y-2">
            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-text">
              Multi-Shot Video
            </h1>
            <p className="text-sm text-text-secondary">
              Write a simple brief. SoftAI turns it into campaign shots, review steps, and renders.
            </p>
            <div className="flex gap-2 pt-2 text-xs font-semibold">
              <span className="rounded-full bg-text px-3 py-1.5 text-bg">Examples</span>
              <span className="rounded-full px-3 py-1.5 text-text-secondary">How it works</span>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {[
              ["/hero-mockup.png", "Storyboard workspace for a product launch"],
              ["/storyboard-feature.png", "Scene review with structured campaign shots"],
              ["/rendering-feature.png", "Rendered ad preview for social video"],
              ["/storyboard-feature.png", "Script edits arranged into compact frames"],
              ["/rendering-feature.png", "Motion preview with product close-up"],
              ["/hero-mockup.png", "Final campaign assets ready for export"],
            ].map(([src, alt], index) => (
              <div key={`${src}-${index}`} className="group relative aspect-video overflow-hidden rounded-[10px] bg-bg-subtle ring-1 ring-border">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(min-width: 1280px) 350px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/75 via-transparent to-transparent opacity-70" />
                <p className="absolute inset-x-3 bottom-3 text-xs font-medium text-text/85">
                  {alt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
