import { getEnv } from "@/lib/env";
import { SOFTAI_METADATA_TAG } from "@/lib/constants";

const DEFAULT_TEXT_MODEL = "openai/gpt-4.1-mini";
const DEFAULT_IMAGE_MODEL = "google/gemini-2.5-flash-image-preview";
const DEFAULT_VIDEO_MODEL = "minimax/video-01";

type StoryboardInput = {
  productName: string;
  offer: string;
  cta: string;
  targetAudience: string;
  brandVoice: string;
  script: string;
};

export async function generateStoryboard(input: StoryboardInput) {
  const env = getEnv();

  if (!env.openRouterApiKey) {
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
      provider: "demo-fallback",
      requestPayload: input,
      responsePayload: null,
    };
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openRouterApiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": env.appUrl,
      "X-Title": "SoftAI",
    },
    body: JSON.stringify({
      model: DEFAULT_TEXT_MODEL,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an ad creative strategist. Return strict JSON with keys headline, hook, cta, and scenes. scenes must be an array of 3 to 6 objects with title, narration, visualDirection, overlayText, durationSeconds.",
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

  return {
    ...parsed,
    provider: DEFAULT_TEXT_MODEL,
    requestPayload: input,
    responsePayload: payload,
  };
}

export async function generateSceneImage(prompt: string) {
  const env = getEnv();

  if (!env.openRouterApiKey) {
    return {
      imageUrl: `https://placehold.co/720x1280/f6e5d4/1a1a1a.png?text=${encodeURIComponent(prompt.slice(0, 50))}`,
      provider: "demo-fallback",
      requestPayload: { prompt },
      responsePayload: null,
    };
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openRouterApiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": env.appUrl,
      "X-Title": "SoftAI",
    },
    body: JSON.stringify({
      model: DEFAULT_IMAGE_MODEL,
      modalities: ["image", "text"],
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const payload = await response.json();
  const imageUrl = payload.images?.[0]?.image_url ?? payload.choices?.[0]?.message?.images?.[0]?.image_url;

  return {
    imageUrl,
    provider: DEFAULT_IMAGE_MODEL,
    requestPayload: { prompt },
    responsePayload: payload,
  };
}

export async function submitVideoRender(prompt: string, imageUrls: string[]) {
  const env = getEnv();

  if (!env.openRouterApiKey) {
    return {
      id: `demo-video-${Date.now()}`,
      status: "completed",
      url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
      provider: "demo-fallback",
      requestPayload: { prompt, imageUrls },
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
      prompt,
      images: imageUrls,
      metadata: {
        tag: SOFTAI_METADATA_TAG,
      },
    }),
  });

  const payload = await response.json();
  return {
    id: payload.id,
    status: payload.status,
    url: payload.url ?? null,
    provider: DEFAULT_VIDEO_MODEL,
    requestPayload: { prompt, imageUrls },
    responsePayload: payload,
  };
}
