"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/components/uploadthing";

export function ProjectInputs({ projectId }: { projectId: string }) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
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

  async function run(task: () => Promise<void>, successMessage: string) {
    setError(null);
    setUploadMessage(null);
    setIsSaving(true);

    try {
      await task();
      setUploadMessage(successMessage);
    } catch (taskError) {
      setError(taskError instanceof Error ? taskError.message : "Request failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function request(path: string, body: unknown) {
    const response = await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.error ?? `Request failed with status ${response.status}.`);
    }
  }

  const uploadAppearance = {
    container: {
      borderColor: "var(--border)",
      background: "var(--card-strong)",
      color: "var(--foreground)",
      padding: "1rem",
    },
    label: { color: "var(--foreground)", fontWeight: 650 },
    allowedContent: { color: "var(--muted)", fontSize: "0.8rem" },
    button: {
      background: "var(--foreground)",
      color: "var(--background)",
      fontWeight: 650,
    },
  };

  const autoUploadConfig = { mode: "auto" as const };

  const autoUploadAppearance = {
    ...uploadAppearance,
    button: ({ isUploading }: { isUploading: boolean }) =>
      isUploading
        ? uploadAppearance.button
        : {
            display: "none",
          },
  };

  function getUploadedUrl(file: { ufsUrl?: string; url?: string; serverData?: { url?: string } | null }) {
    return file.ufsUrl ?? file.serverData?.url ?? file.url ?? null;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-lg font-semibold">Add asset</h3>
        <div className="mt-4 space-y-3">
          <select
            value={assetForm.type}
            onChange={(event) => setAssetForm((current) => ({ ...current, type: event.target.value }))}
            className="control-field"
          >
            <option value="logo">Logo</option>
            <option value="product_image">Product image</option>
            <option value="reference_image">Reference image</option>
          </select>
          <input
            value={assetForm.name}
            onChange={(event) => setAssetForm((current) => ({ ...current, name: event.target.value }))}
            className="control-field"
            placeholder="Asset name"
          />
          <UploadDropzone
            endpoint="brandAssetUploader"
            config={autoUploadConfig}
            appearance={autoUploadAppearance}
            content={{
              label: "Drop brand image here, or click to choose",
              allowedContent: "One PNG, JPG, GIF, or WebP image up to 8MB.",
            }}
            onClientUploadComplete={(files) => {
              const firstFile = files[0];
              if (!firstFile) return;
              const uploadedUrl = getUploadedUrl(firstFile);
              if (!uploadedUrl) {
                setError("Upload completed, but UploadThing did not return a file URL.");
                return;
              }

              setAssetForm((current) => ({
                ...current,
                name: current.name || firstFile.name,
                url: uploadedUrl,
              }));
              setError(null);
              setUploadMessage(`${firstFile.name} uploaded. Save it to attach it to this project.`);
            }}
            onUploadError={(uploadError) => setError(uploadError.message)}
          />
          {assetForm.url ? (
            <div className="overflow-hidden rounded-xl border border-border bg-card-strong">
              <Image
                src={assetForm.url}
                alt={assetForm.name || "Uploaded asset"}
                width={512}
                height={256}
                className="h-32 w-full object-cover"
              />
            </div>
          ) : null}
          <button
            type="button"
            disabled={isSaving || !assetForm.name || !assetForm.url}
            onClick={() =>
              run(() => request(`/api/projects/${projectId}/assets`, assetForm), "Asset saved to this project.")
            }
            className="button-primary"
          >
            {isSaving ? "Saving..." : "Save asset"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
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
            className="control-field"
          >
            <option value="single_photo">Single photo</option>
            <option value="ai_person">AI person</option>
          </select>
          {avatarForm.sourceType === "single_photo" ? (
            <>
              <UploadDropzone
                endpoint="avatarUploader"
                config={autoUploadConfig}
                appearance={autoUploadAppearance}
                content={{
                  label: "Drop avatar reference here, or click to choose",
                  allowedContent: "One PNG, JPG, GIF, or WebP image up to 8MB.",
                }}
                onClientUploadComplete={(files) => {
                  const firstFile = files[0];
                  if (!firstFile) return;
                  const uploadedUrl = getUploadedUrl(firstFile);
                  if (!uploadedUrl) {
                    setError("Upload completed, but UploadThing did not return a file URL.");
                    return;
                  }

                  setAvatarForm((current) => ({ ...current, imageUrl: uploadedUrl }));
                  setError(null);
                  setUploadMessage(`${firstFile.name} uploaded. Save it to use it as the avatar reference.`);
                }}
                onUploadError={(uploadError) => setError(uploadError.message)}
              />
              {avatarForm.imageUrl ? (
                <div className="overflow-hidden rounded-xl border border-border bg-card-strong">
                  <Image
                    src={avatarForm.imageUrl}
                    alt="Uploaded avatar reference"
                    width={512}
                    height={256}
                    className="h-32 w-full object-cover"
                  />
                </div>
              ) : null}
            </>
          ) : null}
          <textarea
            rows={3}
            value={avatarForm.prompt}
            onChange={(event) => setAvatarForm((current) => ({ ...current, prompt: event.target.value }))}
            className="control-field"
            placeholder="Optional AI actor description"
          />
          <label className="flex items-start gap-3 rounded-xl border border-border bg-card-strong px-4 py-3 text-sm text-muted">
            <input
              checked={avatarForm.attested}
              onChange={(event) => setAvatarForm((current) => ({ ...current, attested: event.target.checked }))}
              type="checkbox"
              className="mt-1 accent-[var(--accent)]"
            />
            I confirm I have the right to use this likeness and I will not generate celebrities or public figures without consent.
          </label>
          <button
            type="button"
            disabled={isSaving || (avatarForm.sourceType === "single_photo" && !avatarForm.imageUrl)}
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
                "Avatar policy saved.",
              )
            }
            className="button-primary"
          >
            {isSaving ? "Saving..." : "Save avatar"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-lg font-semibold">Report abuse</h3>
        <div className="mt-4 space-y-3">
          <input
            value={reportForm.reason}
            onChange={(event) => setReportForm((current) => ({ ...current, reason: event.target.value }))}
            className="control-field"
            placeholder="Reason"
          />
          <textarea
            rows={4}
            value={reportForm.details}
            onChange={(event) => setReportForm((current) => ({ ...current, details: event.target.value }))}
            className="control-field"
            placeholder="Explain the issue"
          />
          <button
            type="button"
            disabled={isSaving}
            onClick={() =>
              run(() =>
                request("/api/report-abuse", {
                  projectId,
                  reason: reportForm.reason,
                  details: reportForm.details,
                }),
                "Report submitted.",
              )
            }
            className="button-secondary"
          >
            {isSaving ? "Submitting..." : "Submit report"}
          </button>
        </div>
      </section>

      {uploadMessage ? <p className="rounded-xl border border-success/25 bg-[oklch(0.95_0.035_151)] px-4 py-3 text-sm text-success lg:col-span-3">{uploadMessage}</p> : null}
      {error ? <p className="rounded-xl border border-danger/25 bg-[oklch(0.95_0.035_27)] px-4 py-3 text-sm text-danger lg:col-span-3">{error}</p> : null}
    </div>
  );
}
