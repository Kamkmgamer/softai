import { afterEach, describe, expect, it, vi } from "vitest";
import { streamChatCompletion } from "@/lib/openrouter";

describe("streamChatCompletion", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("throws provider errors sent inside OpenRouter stream chunks", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(
      'data: {"error":{"message":"Provider returned error"}}\n\n',
      { status: 200 },
    )));

    const stream = streamChatCompletion([{ role: "user", content: "hello" }]);

    await expect(stream.next()).rejects.toThrow("Provider returned error");
  });
});
