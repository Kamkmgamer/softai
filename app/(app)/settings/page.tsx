import { Card, PageHeader } from "@/components/ui";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Account and policy controls."
        description="Keep the consent boundary explicit. The product supports self avatars, AI people, and rights-attested real people, but not public figure impersonation without consent."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold">Identity policy</h2>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-muted">
            <li>Use only your own likeness, fully AI-generated people, or talent you have the rights to use.</li>
            <li>Do not upload or generate celebrities, politicians, or public figures without consent.</li>
            <li>Generated outputs remain traceable through project metadata and audit logs.</li>
          </ul>
        </Card>
        <Card className="rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold">Launch posture</h2>
          <p className="mt-6 text-sm leading-7 text-muted">
            v1 intentionally uses minimal internal moderation logic and relies on provider safety layers, user attestation, rate limits, reporting, and admin takedown tools.
          </p>
        </Card>
      </div>
    </div>
  );
}
