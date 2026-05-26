"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function ProjectInputs({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [assetForm, setAssetForm] = useState({
    type: "product_image",
    name: "",
    url: "",
  });
  const [avatarForm, setAvatarForm] = useState({
    sourceType: "single_photo",
    imageUrl: "",
    prompt: "",
    policyState: "self_declared",
    attested: true,
  });
  const [reportForm, setReportForm] = useState({
    reason: "",
    details: "",
  });

  function run(task: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await task();
        router.refresh();
      } catch (taskError) {
        setError(taskError instanceof Error ? taskError.message : "Request failed.");
      }
    });
  }

  async function request(path: string, body: unknown) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error ?? "Request failed.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="rounded-[2rem] border border-border bg-white/70 p-5">
        <h3 className="text-lg font-semibold">Add asset</h3>
        <div className="mt-4 space-y-3">
          <select
            value={assetForm.type}
            onChange={(event) => setAssetForm((current) => ({ ...current, type: event.target.value }))}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3"
          >
            <option value="logo">Logo</option>
            <option value="product_image">Product image</option>
            <option value="reference_image">Reference image</option>
          </select>
          <input
            value={assetForm.name}
            onChange={(event) => setAssetForm((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3"
            placeholder="Asset name"
          />
          <input
            value={assetForm.url}
            onChange={(event) => setAssetForm((current) => ({ ...current, url: event.target.value }))}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3"
            placeholder="https://..."
          />
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              run(() => request(`/api/projects/${projectId}/assets`, assetForm))
            }
            className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
          >
            Save asset
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-white/70 p-5">
        <h3 className="text-lg font-semibold">Avatar policy</h3>
        <div className="mt-4 space-y-3">
          <select
            value={avatarForm.sourceType}
            onChange={(event) =>
              setAvatarForm((current) => ({
                ...current,
                sourceType: event.target.value,
                policyState: event.target.value === "ai_person" ? "ai_generated" : current.policyState,
              }))
            }
            className="w-full rounded-2xl border border-border bg-background px-4 py-3"
          >
            <option value="single_photo">Single photo</option>
            <option value="ai_person">AI person</option>
          </select>
          <input
            value={avatarForm.imageUrl}
            onChange={(event) => setAvatarForm((current) => ({ ...current, imageUrl: event.target.value }))}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3"
            placeholder="Reference image URL"
          />
          <textarea
            rows={3}
            value={avatarForm.prompt}
            onChange={(event) => setAvatarForm((current) => ({ ...current, prompt: event.target.value }))}
            className="w-full rounded-[1.5rem] border border-border bg-background px-4 py-3"
            placeholder="Optional AI actor description"
          />
          <label className="flex items-start gap-3 rounded-[1.25rem] border border-border bg-background px-4 py-3 text-sm text-muted">
            <input
              checked={avatarForm.attested}
              onChange={(event) => setAvatarForm((current) => ({ ...current, attested: event.target.checked }))}
              type="checkbox"
              className="mt-1"
            />
            I confirm I have the right to use this likeness and I will not generate celebrities or public figures without consent.
          </label>
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              run(() =>
                request(`/api/projects/${projectId}/avatar`, {
                  sourceType: avatarForm.sourceType,
                  imageUrl: avatarForm.imageUrl || null,
                  prompt: avatarForm.prompt || null,
                  policyState:
                    avatarForm.sourceType === "ai_person" ? "ai_generated" : avatarForm.policyState,
                  attested: avatarForm.attested,
                }),
              )
            }
            className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
          >
            Save avatar
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-white/70 p-5">
        <h3 className="text-lg font-semibold">Report abuse</h3>
        <div className="mt-4 space-y-3">
          <input
            value={reportForm.reason}
            onChange={(event) => setReportForm((current) => ({ ...current, reason: event.target.value }))}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3"
            placeholder="Reason"
          />
          <textarea
            rows={4}
            value={reportForm.details}
            onChange={(event) => setReportForm((current) => ({ ...current, details: event.target.value }))}
            className="w-full rounded-[1.5rem] border border-border bg-background px-4 py-3"
            placeholder="Explain the issue"
          />
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              run(() =>
                request("/api/report-abuse", {
                  projectId,
                  reason: reportForm.reason,
                  details: reportForm.details,
                }),
              )
            }
            className="rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold"
          >
            Submit report
          </button>
        </div>
      </section>

      {error ? <p className="text-sm text-danger lg:col-span-3">{error}</p> : null}
    </div>
  );
}
