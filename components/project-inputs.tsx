"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/components/uploadthing";
import { SectionHeader } from "@/components/ui";

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
      setError(
        taskError instanceof Error ? taskError.message : "Request failed.",
      );
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
      throw new Error(
        payload?.error ?? `Request failed with status ${response.status}.`,
      );
    }
  }

  const autoUploadConfig = { mode: "auto" as const };

  const uploadAppearance = {
    container: {
      border: "1px dashed var(--border)",
      background: "var(--surface)",
      padding: "1rem",
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
    },
    label: {
      color: "var(--text-secondary)",
      fontSize: "0.8125rem",
      fontWeight: 500,
    },
    allowedContent: { color: "var(--text-tertiary)", fontSize: "0.6875rem" },
    button: {
      background: "var(--text)",
      color: "var(--bg)",
      fontSize: "0.75rem",
      padding: "0.375rem 0.625rem",
      borderRadius: "var(--radius-sm)",
      fontWeight: 500,
    },
  };

  const autoUploadAppearance = {
    ...uploadAppearance,
    button: ({ isUploading }: { isUploading: boolean }) =>
      isUploading ? uploadAppearance.button : { display: "none" },
  };

  function getUploadedUrl(file: {
    ufsUrl?: string;
    url?: string;
    serverData?: { url?: string } | null;
  }) {
    return file.ufsUrl ?? file.serverData?.url ?? file.url ?? null;
  }

  return (
    <section className="rounded-[28px] border border-border bg-surface p-4 shadow-(--shadow-sm)">
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
          Inputs
        </p>
        <h2 className="mt-1 text-base font-semibold text-text">
          Production assets
        </h2>
      </div>

      <div className="space-y-5">
        {/* Upload/Error messages at the top of the inputs column */}
        {uploadMessage && (
          <div className="rounded-sm bg-success-soft px-3 py-2 text-xs font-medium text-success">
            {uploadMessage}
          </div>
        )}
        {error && (
          <div className="rounded-sm bg-danger-soft px-3 py-2 text-xs font-medium text-danger">
            {error}
          </div>
        )}

        {/* Assets Section */}
        <div className="space-y-3">
          <SectionHeader title="Add asset" />
          <div className="space-y-3">
            <select
              value={assetForm.type}
              onChange={(event) =>
                setAssetForm((current) => ({
                  ...current,
                  type: event.target.value,
                }))
              }
              className="control-field rounded-[14px] text-[13px]"
            >
              <option value="logo">Logo</option>
              <option value="product_image">Product image</option>
              <option value="reference_image">Reference image</option>
            </select>

            <input
              value={assetForm.name}
              onChange={(event) =>
                setAssetForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className="control-field rounded-[14px] text-[13px]"
              placeholder="Asset name"
            />

            <UploadDropzone
              endpoint="brandAssetUploader"
              config={autoUploadConfig}
              appearance={autoUploadAppearance}
              content={{
                label: "Drop image here, or click to choose",
                allowedContent: "PNG, JPG, or WebP up to 8MB",
              }}
              onClientUploadComplete={(files) => {
                const firstFile = files[0];
                if (!firstFile) return;
                const uploadedUrl = getUploadedUrl(firstFile);
                if (!uploadedUrl) {
                  setError("Upload completed, but no URL returned.");
                  return;
                }
                setAssetForm((current) => ({
                  ...current,
                  name: current.name || firstFile.name,
                  url: uploadedUrl,
                }));
                setError(null);
                setUploadMessage(`${firstFile.name} uploaded.`);
              }}
              onUploadError={(err) => setError(err.message)}
            />

            {assetForm.url && (
              <div className="overflow-hidden rounded-md border border-border bg-surface-sunken">
                <Image
                  src={assetForm.url}
                  alt={assetForm.name || "Uploaded asset"}
                  width={512}
                  height={256}
                  className="h-24 w-full object-cover"
                />
              </div>
            )}

            <button
              type="button"
              disabled={isSaving || !assetForm.name || !assetForm.url}
              onClick={() =>
                run(
                  () => request(`/api/projects/${projectId}/assets`, assetForm),
                  "Asset saved.",
                )
              }
              className="btn btn-primary w-full text-[13px]"
            >
              {isSaving ? "Saving..." : "Save asset"}
            </button>
          </div>
        </div>

        <hr className="divider" />

        {/* Avatar Section */}
        <div className="space-y-3">
          <SectionHeader title="Avatar policy" />
          <div className="space-y-3">
            <select
              value={avatarForm.sourceType}
              onChange={(event) =>
                setAvatarForm((current) => ({
                  ...current,
                  sourceType: event.target.value,
                  policyState:
                    event.target.value === "ai_person"
                      ? "ai_generated"
                      : current.policyState,
                }))
              }
              className="control-field rounded-[14px] text-[13px]"
            >
              <option value="single_photo">Single photo</option>
              <option value="ai_person">AI person</option>
            </select>

            {avatarForm.sourceType === "single_photo" && (
              <>
                <UploadDropzone
                  endpoint="avatarUploader"
                  config={autoUploadConfig}
                  appearance={autoUploadAppearance}
                  content={{
                    label: "Drop avatar here, or click to choose",
                    allowedContent: "PNG, JPG, or WebP up to 8MB",
                  }}
                  onClientUploadComplete={(files) => {
                    const firstFile = files[0];
                    if (!firstFile) return;
                    const uploadedUrl = getUploadedUrl(firstFile);
                    if (!uploadedUrl) {
                      setError("Upload completed, but no URL returned.");
                      return;
                    }
                    setAvatarForm((current) => ({
                      ...current,
                      imageUrl: uploadedUrl,
                    }));
                    setError(null);
                    setUploadMessage(`${firstFile.name} uploaded.`);
                  }}
                  onUploadError={(err) => setError(err.message)}
                />
                {avatarForm.imageUrl && (
                  <div className="overflow-hidden rounded-md border border-border bg-surface-sunken">
                    <Image
                      src={avatarForm.imageUrl}
                      alt="Avatar reference"
                      width={512}
                      height={256}
                      className="h-24 w-full object-cover"
                    />
                  </div>
                )}
              </>
            )}

            <textarea
              rows={2}
              value={avatarForm.prompt}
              onChange={(event) =>
                setAvatarForm((current) => ({
                  ...current,
                  prompt: event.target.value,
                }))
              }
              className="control-field resize-y rounded-[14px] text-[13px]"
              placeholder="Optional AI actor description"
            />

            <label className="flex items-start gap-2.5 rounded-2xl bg-bg p-3 ring-1 ring-border/80">
              <input
                type="checkbox"
                checked={avatarForm.attested}
                onChange={(event) =>
                  setAvatarForm((current) => ({
                    ...current,
                    attested: event.target.checked,
                  }))
                }
                className="mt-0.5 rounded border-border text-text accent-accent"
              />
              <span className="text-[11px] leading-tight text-text-secondary">
                I confirm I have the right to use this likeness and will not
                generate public figures without consent.
              </span>
            </label>

            <button
              type="button"
              disabled={
                isSaving ||
                (avatarForm.sourceType === "single_photo" &&
                  !avatarForm.imageUrl)
              }
              onClick={() =>
                run(
                  () =>
                    request(`/api/projects/${projectId}/avatar`, {
                      sourceType: avatarForm.sourceType,
                      imageUrl: avatarForm.imageUrl || null,
                      prompt: avatarForm.prompt || null,
                      policyState:
                        avatarForm.sourceType === "ai_person"
                          ? "ai_generated"
                          : avatarForm.policyState,
                      attested: avatarForm.attested,
                    }),
                  "Avatar policy saved.",
                )
              }
              className="btn btn-primary w-full text-[13px]"
            >
              {isSaving ? "Saving..." : "Save avatar"}
            </button>
          </div>
        </div>

        <hr className="divider" />

        {/* Report Section */}
        <div className="space-y-3">
          <SectionHeader title="Report abuse" />
          <div className="space-y-3">
            <input
              value={reportForm.reason}
              onChange={(event) =>
                setReportForm((current) => ({
                  ...current,
                  reason: event.target.value,
                }))
              }
              className="control-field rounded-[14px] text-[13px]"
              placeholder="Reason"
            />
            <textarea
              rows={3}
              value={reportForm.details}
              onChange={(event) =>
                setReportForm((current) => ({
                  ...current,
                  details: event.target.value,
                }))
              }
              className="control-field resize-y rounded-[14px] text-[13px]"
              placeholder="Explain the issue"
            />
            <button
              type="button"
              disabled={isSaving}
              onClick={() =>
                run(
                  () =>
                    request("/api/report-abuse", {
                      projectId,
                      reason: reportForm.reason,
                      details: reportForm.details,
                    }),
                  "Report submitted.",
                )
              }
              className="btn btn-secondary w-full text-[13px]"
            >
              {isSaving ? "Submitting..." : "Submit report"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
