import { getEnv } from "@/lib/env";

export type AiCapability = "text" | "image" | "video" | "audio" | "edit";
export type AiProviderKey = "openrouter" | "demo";

export type AiProviderRoute = {
  providerKey: AiProviderKey;
  modelKey: string;
  capability: AiCapability;
  isDemo: boolean;
};

const DEFAULT_TEXT_MODEL = "minimax/minimax-m3:free";
const FALLBACK_TEXT_MODELS = [
  "deepseek/deepseek-v4-flash:free",
  "moonshotai/kimi-k2.6:free",
  "openai/gpt-oss-120b:free",
  "deepseek/deepseek-v4-flash",
  "moonshotai/kimi-k2.6",
  "openai/gpt-oss-120b",
];
const DEFAULT_IMAGE_MODEL = "google/gemini-2.5-flash-image";
const DEFAULT_VIDEO_MODEL = "x-ai/grok-imagine-video";
const DEMO_MODEL = "deterministic-demo";

const modelByCapability: Record<
  Exclude<AiCapability, "audio" | "edit">,
  string
> = {
  text: DEFAULT_TEXT_MODEL,
  image: DEFAULT_IMAGE_MODEL,
  video: DEFAULT_VIDEO_MODEL,
};

export function getConfiguredTextModel() {
  return process.env.OPENROUTER_TEXT_MODEL ?? DEFAULT_TEXT_MODEL;
}

export function getTextFallbackModels() {
  const primaryModel = getConfiguredTextModel();
  return [
    primaryModel,
    ...FALLBACK_TEXT_MODELS.filter((model) => model !== primaryModel),
  ];
}

export function getProviderRoute(
  capability: AiCapability,
  modelOverride?: string,
): AiProviderRoute {
  const env = getEnv();

  if (!env.openRouterApiKey) {
    return {
      providerKey: "demo",
      modelKey: DEMO_MODEL,
      capability,
      isDemo: true,
    };
  }

  const fallbackModel =
    capability in modelByCapability
      ? modelByCapability[capability as keyof typeof modelByCapability]
      : DEMO_MODEL;

  return {
    providerKey: "openrouter",
    modelKey:
      modelOverride ??
      (capability === "text" ? getConfiguredTextModel() : fallbackModel),
    capability,
    isDemo: false,
  };
}

export function getProviderJobMetadata(
  route: AiProviderRoute,
  costEstimate: number | null = null,
) {
  return {
    providerKey: route.providerKey,
    modelKey: route.modelKey,
    costEstimate,
  };
}

export function isRetryableProviderError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("provider returned error") ||
    message.includes("rate limit") ||
    message.includes("overloaded") ||
    message.includes("temporarily unavailable") ||
    message.includes("503") ||
    message.includes("502") ||
    message.includes("504") ||
    message.includes("429")
  );
}

export function normalizeProviderError(
  error: unknown,
  fallbackMessage: string,
) {
  if (!(error instanceof Error)) return fallbackMessage;
  if (error.message.toLowerCase().includes("content policy"))
    return "This request was blocked by the provider safety policy.";
  return error.message || fallbackMessage;
}
