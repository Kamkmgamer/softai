import { afterEach, describe, expect, it, vi } from "vitest";
import { isDurableMediaUrl, storeVideoDurably } from "@/lib/media-storage";

describe("isDurableMediaUrl", () => {
  it("recognizes UploadThing file URLs as durable", () => {
    expect(isDurableMediaUrl("https://ufs.sh/f/video.mp4")).toBe(true);
    expect(isDurableMediaUrl("https://app-id.ufs.sh/f/video.mp4")).toBe(true);
    expect(isDurableMediaUrl("https://uploadthing.com/f/video.mp4")).toBe(true);
  });

  it("does not treat provider URLs as durable", () => {
    expect(isDurableMediaUrl("https://openrouter.ai/api/v1/videos/job/content")).toBe(false);
  });
});

describe("storeVideoDurably", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns durable URLs without fetching or uploading", async () => {
    const fetcher = vi.fn<typeof fetch>();
    const uploader = vi.fn();

    await expect(storeVideoDurably({
      sourceUrl: "https://ufs.sh/f/final.mp4",
      title: "Final video",
      fetcher,
      uploader,
    })).resolves.toBe("https://ufs.sh/f/final.mp4");

    expect(fetcher).not.toHaveBeenCalled();
    expect(uploader).not.toHaveBeenCalled();
  });

  it("fetches provider URLs with auth and uploads video bytes", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    const fetcher = vi.fn<typeof fetch>(async () => new Response(new Blob(["video-bytes"], { type: "video/mp4" }), {
      status: 200,
      headers: { "content-type": "video/mp4" },
    }));
    const uploader = vi.fn(async (file: File) => ({
      data: {
        ufsUrl: "https://ufs.sh/f/stored.mp4",
        name: file.name,
      },
    }));

    await expect(storeVideoDurably({
      sourceUrl: "https://openrouter.ai/api/v1/videos/job/content",
      title: "Launch Ad!",
      fetcher,
      uploader,
    })).resolves.toBe("https://ufs.sh/f/stored.mp4");

    const [, init] = fetcher.mock.calls[0];
    expect((init?.headers as Headers).get("Authorization")).toBe("Bearer test-key");
    expect(uploader).toHaveBeenCalledOnce();
    expect(uploader.mock.calls[0][0]).toMatchObject({
      name: "Launch Ad.mp4",
      type: "video/mp4",
    });
  });

  it("rejects non-video upstream responses", async () => {
    const fetcher = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ error: "not ready" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }));
    const uploader = vi.fn();

    await expect(storeVideoDurably({
      sourceUrl: "https://example.com/video-result",
      title: "Final video",
      fetcher,
      uploader,
    })).rejects.toThrow("did not return video content");

    expect(uploader).not.toHaveBeenCalled();
  });

  it("rejects failed uploads", async () => {
    const fetcher = vi.fn<typeof fetch>(async () => new Response(new Blob(["video-bytes"], { type: "video/mp4" }), {
      status: 200,
      headers: { "content-type": "video/mp4" },
    }));
    const uploader = vi.fn(async () => ({ error: { message: "upload failed" } }));

    await expect(storeVideoDurably({
      sourceUrl: "https://example.com/final.mp4",
      title: "Final video",
      fetcher,
      uploader,
    })).rejects.toThrow("Failed to store completed video durably");
  });
});
