import { getEnv } from "@/lib/env";
import { SOFTAI_METADATA_TAG } from "@/lib/constants";

const DEFAULT_TEXT_MODEL = "minimax/minimax-m2.5:free";
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
const CHAT_UNAVAILABLE_MESSAGE = "The assistant is temporarily unavailable. Please try again in a moment.";

export type ChatCompletionMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type StoryboardInput = {
  productName: string;
  offer: string;
  cta: string;
  targetAudience: string;
  brandVoice: string;
  script: string;
  language: "en" | "ar";
};

type GeneratedScene = {
  title: string;
  narration: string;
  visualDirection: string;
  overlayText: string;
  durationSeconds: number;
};

function fallbackStoryboard(input: StoryboardInput) {
  if (input.language === "ar") {
    return {
      headline: `حوّل ${input.productName} إلى إعلان جاهز بسرعة`,
      hook: `${input.offer} ل${input.targetAudience}`,
      cta: input.cta,
      scenes: [
        {
          title: "افتتاحية لافتة",
          narration: input.script || `${input.productName} يساعد ${input.targetAudience} على الوصول للنتيجة بسرعة ووضوح.`,
          visualDirection: `لقطة قريبة للمنتج بأسلوب ${input.brandVoice}، مع ترك مساحة آمنة لإضافة نص عربي لاحقاً.`,
          overlayText: input.offer,
          durationSeconds: 5,
        },
        {
          title: "المشكلة والوعد",
          narration: `بدلاً من إضاعة الوقت في تجهيز الإعلانات من الصفر، يختصر ${input.productName} الطريق من الفكرة إلى محتوى قابل للنشر.`,
          visualDirection: "شخص يتحدث بثقة بجانب لقطات منتج واضحة ومساحات نظيفة للنصوص العربية.",
          overlayText: "إعلان جاهز أسرع",
          durationSeconds: 7,
        },
        {
          title: "العرض والختام",
          narration: `جرّب ${input.productName} اليوم واستفد من ${input.offer}. ${input.cta}`,
          visualDirection: "لقطة نهائية للمنتج بخلفية دافئة ومساحة واضحة لزر الدعوة للإجراء.",
          overlayText: input.cta,
          durationSeconds: 6,
        },
      ],
    };
  }

  return {
    headline: `Launch ${input.productName} without a camera crew`,
    hook: `${input.offer} for ${input.targetAudience}`,
    cta: input.cta,
    scenes: [
      {
        title: "Thumbstopper opener",
        narration: input.script || `Stop scrolling. ${input.productName} is built for ${input.targetAudience}.`,
        visualDirection: `Fast close-up of product with bold ${input.brandVoice} typography.`,
        overlayText: input.offer,
        durationSeconds: 5,
      },
      {
        title: "Problem and promise",
        narration: `Most teams waste time creating ads. ${input.productName} gets you from idea to publishable creative faster.`,
        visualDirection: "Talking-head avatar beside kinetic product visuals and before/after frames.",
        overlayText: "Fast ad production",
        durationSeconds: 7,
      },
      {
        title: "Offer close",
        narration: `Try ${input.productName} today and claim ${input.offer}. ${input.cta}`,
        visualDirection: "Product hero shot with warm gradient background and direct CTA treatment.",
        overlayText: input.cta,
        durationSeconds: 6,
      },
    ],
  };
}

function textOrFallback(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function normalizeStoryboard(value: unknown, input: StoryboardInput) {
  const fallback = fallbackStoryboard(input);
  const parsed = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const scenes = Array.isArray(parsed.scenes) ? parsed.scenes : [];
  const normalizedScenes = scenes
    .map((scene): GeneratedScene | null => {
      if (!scene || typeof scene !== "object") return null;
      const record = scene as Record<string, unknown>;
      return {
        title: textOrFallback(record.title, "Storyboard scene"),
        narration: textOrFallback(record.narration, input.script || fallback.hook),
        visualDirection: textOrFallback(record.visualDirection, `Show ${input.productName} with ${input.brandVoice} styling.`),
        overlayText: textOrFallback(record.overlayText, input.offer),
        durationSeconds: typeof record.durationSeconds === "number" ? Math.min(Math.max(Math.round(record.durationSeconds), 3), 15) : 5,
      };
    })
    .filter((scene): scene is GeneratedScene => Boolean(scene));

  return {
    headline: textOrFallback(parsed.headline, fallback.headline),
    hook: textOrFallback(parsed.hook, fallback.hook),
    cta: textOrFallback(parsed.cta, fallback.cta),
    scenes: normalizedScenes.length >= 3 ? normalizedScenes.slice(0, 6) : fallback.scenes,
  };
}

function getNestedImageUrl(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  return getNestedImageUrl(record.url) ?? getNestedImageUrl(record.image_url) ?? getNestedImageUrl(record.data);
}

function extractImageUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const directImages = Array.isArray(record.images) ? record.images : [];
  for (const image of directImages) {
    const imageUrl = getNestedImageUrl(image);
    if (imageUrl) return imageUrl;
  }

  const choices = Array.isArray(record.choices) ? record.choices : [];
  for (const choice of choices) {
    if (!choice || typeof choice !== "object") continue;
    const message = (choice as Record<string, unknown>).message;
    if (!message || typeof message !== "object") continue;

    const messageRecord = message as Record<string, unknown>;
    const messageImages = Array.isArray(messageRecord.images) ? messageRecord.images : [];
    for (const image of messageImages) {
      const imageUrl = getNestedImageUrl(image);
      if (imageUrl) return imageUrl;
    }

    const content = messageRecord.content;
    if (Array.isArray(content)) {
      for (const part of content) {
        const imageUrl = getNestedImageUrl(part);
        if (imageUrl) return imageUrl;
      }
    }
  }

  return null;
}

function extractVideoUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const directUrl = getNestedImageUrl(record.url) ?? getNestedImageUrl(record.video_url);
  if (directUrl) return directUrl;

  const videos = Array.isArray(record.videos) ? record.videos : [];
  for (const video of videos) {
    const videoUrl = getNestedImageUrl(video);
    if (videoUrl) return videoUrl;
  }

  const output = Array.isArray(record.output) ? record.output : [];
  for (const item of output) {
    const videoUrl = getNestedImageUrl(item);
    if (videoUrl) return videoUrl;
  }

  return null;
}

function extractStreamDelta(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const choices = Array.isArray((payload as Record<string, unknown>).choices)
    ? (payload as Record<string, unknown>).choices as unknown[]
    : [];
  const firstChoice = choices[0];
  if (!firstChoice || typeof firstChoice !== "object") return "";
  const delta = (firstChoice as Record<string, unknown>).delta;
  if (!delta || typeof delta !== "object") return "";
  const content = (delta as Record<string, unknown>).content;
  return typeof content === "string" ? content : "";
}

function extractProviderErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;

  const error = (payload as Record<string, unknown>).error;
  if (typeof error === "string" && error.trim()) return error;
  if (error && typeof error === "object") {
    const message = (error as Record<string, unknown>).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return null;
}

function getOpenRouterTextModel() {
  return process.env.OPENROUTER_TEXT_MODEL ?? DEFAULT_TEXT_MODEL;
}

function isRetryableError(error: unknown): boolean {
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

async function* fetchStreamCompletion(
  model: string,
  messages: ChatCompletionMessage[],
  env: { openRouterApiKey?: string; appUrl: string },
  signal?: AbortSignal,
) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    signal,
    headers: {
      Authorization: `Bearer ${env.openRouterApiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": env.appUrl,
      "X-Title": "SoftAI",
    },
    body: JSON.stringify({
      model,
      stream: true,
      messages,
    }),
  });

  if (!response.ok || !response.body) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error?.message ?? payload?.error ?? `OpenRouter chat request failed with status ${response.status}.`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      const payload = JSON.parse(data);
      const providerErrorMessage = extractProviderErrorMessage(payload);
      if (providerErrorMessage) {
        throw new Error(providerErrorMessage);
      }

      const delta = extractStreamDelta(payload);
      if (delta) yield delta;
    }
  }
}

export function getChatUnavailableMessage() {
  return CHAT_UNAVAILABLE_MESSAGE;
}

export async function* streamChatCompletion(messages: ChatCompletionMessage[], signal?: AbortSignal) {
  const env = getEnv();

  if (!env.openRouterApiKey) {
    const fallback = "I can help refine this campaign. Ask for ad angles, a stronger hook, a clearer offer, CTA options, script edits, or a short summary of the current project.";
    for (const word of fallback.split(" ")) {
      yield `${word} `;
    }
    return;
  }

  const primaryModel = getOpenRouterTextModel();
  const models = [primaryModel, ...FALLBACK_TEXT_MODELS.filter((m) => m !== primaryModel)];

  let yieldedContent = false;

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      for await (const chunk of fetchStreamCompletion(model, messages, env, signal)) {
        yieldedContent = true;
        yield chunk;
      }
      return;
    } catch (error) {
      if (yieldedContent || !isRetryableError(error)) {
        throw error;
      }

      const isLastModel = i === models.length - 1;
      if (!isLastModel) {
        const delay = model.endsWith(":free") ? 1000 : 500;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error("All chat models are currently unavailable.");
}

export async function generateStoryboard(input: StoryboardInput) {
  const env = getEnv();

  if (!env.openRouterApiKey) {
    return {
      ...fallbackStoryboard(input),
      provider: "demo-fallback",
      requestPayload: input,
      responsePayload: null,
    };
  }

  const languageInstruction = input.language === "ar"
    ? "Write all user-facing copy in soft Modern Standard Arabic: natural, business-friendly, not stiff, not dialect-heavy. Preserve Arabic intent. Return Arabic narration, overlayText, headline, hook, and CTA."
    : "Write clear English ad copy for SMB operators.";

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openRouterApiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": env.appUrl,
      "X-Title": "SoftAI",
    },
    body: JSON.stringify({
      model: getOpenRouterTextModel(),
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            `You are an ad creative strategist. ${languageInstruction} Return strict JSON with keys headline, hook, cta, and scenes. scenes must be an array of 3 to 6 objects with title, narration, visualDirection, overlayText, durationSeconds. For Arabic projects, visualDirection may describe safe negative space for RTL overlays, but do not ask image models to render exact Arabic text inside images.`,
        },
        {
          role: "user",
          content: JSON.stringify(input),
        },
      ],
    }),
  });

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  const parsed = typeof content === "string" ? JSON.parse(content) : content;
  const storyboard = normalizeStoryboard(parsed, input);

  return {
    ...storyboard,
    provider: getOpenRouterTextModel(),
    requestPayload: input,
    responsePayload: payload,
  };
}

export async function generateSceneImage(prompt: string, language: "en" | "ar" = "en") {
  const env = getEnv();

  if (!env.openRouterApiKey) {
    return {
      imageUrl: `https://placehold.co/720x1280/f6e5d4/1a1a1a.png?text=${encodeURIComponent(language === "ar" ? "Arabic+overlay+space" : prompt.slice(0, 50))}`,
      provider: "demo-fallback",
      requestPayload: { prompt },
      responsePayload: null,
    };
  }

  const requestPayload = {
    model: DEFAULT_IMAGE_MODEL,
    modalities: ["image", "text"],
    image_config: { aspect_ratio: "9:16" },
    messages: [
      {
        role: "user",
        content: `Generate one polished vertical 9:16 advertising scene image. Do not return analysis; return the image. ${language === "ar" ? "Do not render Arabic words or fake text in the image. Leave clean negative space for SoftAI to add RTL Arabic overlays later." : "Avoid unnecessary embedded text unless explicitly requested."} ${prompt}`,
      },
    ],
  };

  async function postImageRequest(body: typeof requestPayload | Omit<typeof requestPayload, "image_config">) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": env.appUrl,
        "X-Title": "SoftAI",
      },
      body: JSON.stringify(body),
    });

    return {
      response,
      payload: await response.json().catch(() => null),
    };
  }

  let { response, payload } = await postImageRequest(requestPayload);
  if (!response.ok && response.status === 400) {
    const retryPayload = {
      model: requestPayload.model,
      modalities: requestPayload.modalities,
      messages: requestPayload.messages,
    };
    ({ response, payload } = await postImageRequest(retryPayload));
  }

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? payload?.error ?? `OpenRouter image request failed with status ${response.status}.`);
  }

  const imageUrl = extractImageUrl(payload);
  if (!imageUrl) {
    throw new Error("OpenRouter image response did not include an image URL.");
  }

  return {
    imageUrl,
    provider: DEFAULT_IMAGE_MODEL,
    requestPayload,
    responsePayload: payload,
  };
}

export async function submitVideoRender(prompt: string, imageUrls: string[], language: "en" | "ar" = "en") {
  const env = getEnv();

  if (!env.openRouterApiKey) {
    return {
      id: `demo-video-${Date.now()}`,
      status: "completed",
      url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
      provider: "demo-fallback",
      requestPayload: { prompt, imageUrls, language },
      responsePayload: null,
    };
  }

  const response = await fetch("https://openrouter.ai/api/v1/videos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openRouterApiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": env.appUrl,
      "X-Title": "SoftAI",
    },
    body: JSON.stringify({
      model: DEFAULT_VIDEO_MODEL,
      prompt: language === "ar"
        ? `${prompt}\n\nUse soft Modern Standard Arabic for narration/captions. Preserve RTL intent. Do not generate malformed Arabic text inside frames; SoftAI will render Arabic overlays separately.`
        : prompt,
      images: imageUrls,
      duration: 1,
      resolution: "480p",
      aspect_ratio: "9:16",
      metadata: {
        tag: SOFTAI_METADATA_TAG,
      },
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? payload?.error ?? `OpenRouter video request failed with status ${response.status}.`);
  }

  return {
    id: payload.id ?? payload.generation_id ?? `video-${Date.now()}`,
    status: payload.status ?? "submitted",
    url: extractVideoUrl(payload),
    provider: DEFAULT_VIDEO_MODEL,
    requestPayload: { prompt, imageUrls, language },
    responsePayload: payload,
  };
}
