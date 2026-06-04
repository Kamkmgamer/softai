"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  ImageIcon,
  Layers3,
  Sparkles,
  Video,
  Wallet,
} from "lucide-react";
import { PricingTable } from "@/components/pricing-table";
import { softaiClerkAppearance } from "@/lib/clerk-appearance";
import { getDictionary } from "@/lib/dictionaries";
import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  localizePath,
  type Locale,
} from "@/lib/i18n";
import { CREDIT_COSTS } from "@/lib/constants";

const STEPS = ["welcome", "credits", "subscribe"] as const;
type Step = (typeof STEPS)[number];

export function OnboardingFlow() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  const [step, setStep] = useState<Step>("welcome");
  const currentIndex = STEPS.indexOf(step);

  function next() {
    if (currentIndex < STEPS.length - 1) {
      setStep(STEPS[currentIndex + 1]);
    }
  }

  function back() {
    if (currentIndex > 0) {
      setStep(STEPS[currentIndex - 1]);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= currentIndex
                  ? "w-10 bg-accent"
                  : "w-6 bg-border"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="animate-fade-in" key={step}>
          {step === "welcome" && <WelcomeStep onNext={next} />}
          {step === "credits" && (
            <CreditsStep onNext={next} onBack={back} />
          )}
          {step === "subscribe" && (
            <SubscribeStep
              locale={locale}
              onBack={back}
              onComplete={() =>
                router.push(localizePath("/dashboard", locale))
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-8 text-center">
      {/* Logo mark */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft animate-scale-in">
        <Sparkles className="h-7 w-7 text-accent-text" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-text">
          Welcome to Soft-Magic AI
        </h1>
        <p className="mx-auto max-w-lg text-pretty text-base leading-7 text-text-secondary">
          Turn product briefs, brand assets, and scripts into
          short-form video ad campaigns. Let&apos;s get you set up
          in a couple of steps.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="mx-auto grid max-w-lg gap-3 text-left stagger-children">
        {[
          {
            icon: Video,
            title: "Multi-shot video ads",
            description:
              "Generate complete video campaigns from a product brief and script.",
          },
          {
            icon: ImageIcon,
            title: "AI image generation",
            description:
              "Create product reshoots, mockups, and ad creatives from text prompts.",
          },
          {
            icon: Layers3,
            title: "Automated storyboarding",
            description:
              "Break your brief into pacing-optimized scenes with narration and overlays.",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="flex items-start gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-surface-raised"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
              <feature.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">
                {feature.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="btn btn-primary mx-auto inline-flex items-center gap-2 px-6 py-3 text-sm"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function CreditsStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const creditItems = [
    {
      label: "Generate storyboard",
      cost: CREDIT_COSTS.storyboard,
      icon: Layers3,
    },
    {
      label: "Generate images",
      cost: CREDIT_COSTS.imageBatch,
      icon: ImageIcon,
    },
    {
      label: "Render video",
      cost: CREDIT_COSTS.videoRender,
      icon: Video,
    },
    {
      label: "AI assistant response",
      cost: CREDIT_COSTS.chatResponse,
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft animate-scale-in">
        <Wallet className="h-7 w-7 text-accent-text" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-text">
          How credits work
        </h1>
        <p className="mx-auto max-w-lg text-pretty text-base leading-7 text-text-secondary">
          Every generation costs credits. Your plan gives you a
          monthly credit allowance that refreshes each billing cycle.
        </p>
      </div>

      {/* Credit cost table */}
      <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-border bg-surface">
        <div className="border-b border-border bg-surface-raised px-5 py-3">
          <p className="text-xs font-medium text-text-secondary">
            Credit costs per action
          </p>
        </div>
        <div className="divide-y divide-border">
          {creditItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-surface-raised"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-text-tertiary" />
                <span className="text-sm font-medium text-text">
                  {item.label}
                </span>
              </div>
              <span className="text-sm font-semibold tabular-nums text-text-secondary">
                {item.cost} credits
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Key points */}
      <div className="mx-auto max-w-md space-y-2 text-left">
        {[
          "Credits refresh monthly with your subscription",
          "Unused credits do not roll over",
          "Upgrade anytime for more monthly credits",
        ].map((point) => (
          <div key={point} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <p className="text-sm leading-6 text-text-secondary">
              {point}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onBack}
          className="btn btn-secondary px-5 py-3 text-sm"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="btn btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm"
        >
          Choose a plan
          <CreditCard className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SubscribeStep({
  locale,
  onBack,
  onComplete,
}: {
  locale: Locale;
  onBack: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft animate-scale-in">
          <CreditCard className="h-7 w-7 text-accent-text" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-text">
          Choose your plan
        </h1>
        <p className="mx-auto max-w-lg text-pretty text-base leading-7 text-text-secondary">
          Pick the plan that fits your production needs. You can
          change plans or cancel anytime from the billing page.
        </p>
      </div>

      {/* Clerk pricing table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-(--shadow-sm)">
        <PricingTable
          appearance={softaiClerkAppearance}
          newSubscriptionRedirectUrl={localizePath(
            "/dashboard",
            locale,
          )}
        />
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onBack}
          className="btn btn-secondary px-5 py-3 text-sm"
        >
          Back
        </button>
      </div>
    </div>
  );
}
