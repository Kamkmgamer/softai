import { afterEach, describe, expect, it, vi } from "vitest";
import { buildFinalVideoPrompt, buildSceneImagePrompt, pollVideoStatus, streamChatCompletion, submitVideoRender } from "@/lib/openrouter";

describe("buildSceneImagePrompt", () => {
  it("keeps overlay copy out of scene image prompts and forbids embedded text", () => {
    const prompt = buildSceneImagePrompt({
      headline: "Launch faster",
      visualDirection: "Product close-up on a warm kitchen counter with space on the right",
      language: "en",
    });

    expect(prompt).toContain("Product close-up");
    expect(prompt).toContain("Do not render English words");
    expect(prompt).toContain("subtitles");
    expect(prompt).toContain("watermarks");
    expect(prompt).not.toContain("Overlay text");
  });
});

describe("buildFinalVideoPrompt", () => {
  it("marks overlay text as post-production copy instead of baked-in frame text", () => {
    const prompt = buildFinalVideoPrompt({
      headline: "Launch faster",
      hook: "20% off",
      cta: "Start today",
      language: "en",
      scenes: [
        {
          order: 1,
          title: "Opener",
          narration: "Stop waiting on creative.",
          visualDirection: "Product hero shot",
          overlayText: "Launch in minutes",
          durationSeconds: 4,
        },
      ],
    });

    expect(prompt).toContain("using the provided scene images as ordered visual references");
    expect(prompt).toContain("Post-production overlay copy, not to be baked into frames: Launch in minutes.");
    expect(prompt).toContain("Do not generate subtitles");
  });
});

describe("streamChatCompletion", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("throws provider errors sent inside OpenRouter stream chunks", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    const encoder = new TextEncoder();
    vi.stubGlobal("fetch", vi.fn(async () => new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"hello"}}]}\n\n'));
          controller.enqueue(encoder.encode('data: {"error":{"message":"Provider returned error"}}\n\n'));
          controller.close();
        },
      }),
      { status: 200 },
    )));

    const stream = streamChatCompletion([{ role: "user", content: "hello" }]);

    await expect(stream.next()).resolves.toMatchObject({ value: "hello", done: false });
    await expect(stream.next()).rejects.toThrow("Provider returned error");
  });
});

describe("submitVideoRender", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("uses OpenRouter's supported vertical video request shape with ordered scene references and without localhost callbacks", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");

    const fetchMock = vi.fn<typeof fetch>(async () => new Response(
      JSON.stringify({ id: "video-job", status: "pending", polling_url: "https://openrouter.ai/poll/video-job" }),
      { status: 200 },
    ));
    vi.stubGlobal("fetch", fetchMock);

    await submitVideoRender("Make a polished vertical ad", ["https://example.com/scene-1.png", "https://example.com/scene-2.png"]);

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init?.body as string);

    expect(body).toMatchObject({
      model: "x-ai/grok-imagine-video",
      prompt: "Make a polished vertical ad",
      duration: 4,
      size: "720x1280",
      input_references: [
        { type: "image_url", image_url: { url: "https://example.com/scene-1.png" } },
        { type: "image_url", image_url: { url: "https://example.com/scene-2.png" } },
      ],
    });
    expect(body).not.toHaveProperty("callback_url");
    expect(body).not.toHaveProperty("resolution");
    expect(body).not.toHaveProperty("aspect_ratio");
    expect(body).not.toHaveProperty("first_frame");
  });

  it("sends callback_url for public HTTPS app URLs", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://softai.example");

    const fetchMock = vi.fn<typeof fetch>(async () => new Response(
      JSON.stringify({ id: "video-job", status: "pending", polling_url: "https://openrouter.ai/poll/video-job" }),
      { status: 200 },
    ));
    vi.stubGlobal("fetch", fetchMock);

    await submitVideoRender("Make a polished vertical ad", ["https://example.com/scene.png"]);

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init?.body as string);

    expect(body.callback_url).toBe("https://softai.example/api/webhooks/openrouter");
  });

  it("returns direct completed video URLs from provider responses", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");

    vi.stubGlobal("fetch", vi.fn(async () => new Response(
      JSON.stringify({
        id: "video-job",
        status: "completed",
        unsigned_urls: [{ url: "https://cdn.example.com/final.mp4" }],
      }),
      { status: 200 },
    )));

    const result = await submitVideoRender("Make a polished vertical ad", []);

    expect(result.url).toBe("https://cdn.example.com/final.mp4");
  });
});

describe("pollVideoStatus", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("extracts completed video URLs from object unsigned_urls", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(
      JSON.stringify({
        status: "completed",
        unsigned_urls: [{ url: "https://cdn.example.com/final.mp4" }],
      }),
      { status: 200 },
    )));

    await expect(pollVideoStatus("https://openrouter.ai/poll/video-job")).resolves.toMatchObject({
      status: "completed",
      url: "https://cdn.example.com/final.mp4",
    });
  });
});
