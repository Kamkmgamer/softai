import { redirect } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";
import { getAppSession } from "@/lib/auth";
import { PageHeader, SectionHeader } from "@/components/ui";

export default async function SettingsPage() {
  const session = await getAppSession();
  if (!session) redirect("/sign-in");

  return (
    <div className="space-y-10">
      <PageHeader title="Settings" />

      <section className="space-y-4">
        <SectionHeader title="Account profile" />
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border shadow-[var(--shadow-sm)]">
          <UserProfile
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "w-full rounded-none shadow-none border-none",
              },
            }}
            routing="hash"
          />
        </div>
      </section>

      <section className="space-y-4 max-w-2xl">
        <SectionHeader title="Trust & Safety Policies" />
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 text-[13px] leading-relaxed text-text-secondary">
          <ul className="space-y-2 list-disc pl-4 marker:text-text-tertiary">
            <li>
              <strong className="font-medium text-text">Content generation:</strong> We
              prohibit the generation of CSAM, non-consensual intimate imagery,
              violence, and hate speech.
            </li>
            <li>
              <strong className="font-medium text-text">Avatars & Likeness:</strong> When
              uploading single-photo avatars, you must attest to having the rights
              to that person&apos;s likeness. Generation of public figures or
              politicians is disabled.
            </li>
            <li>
              <strong className="font-medium text-text">Data usage:</strong> We do not train
              foundational models on your private brand assets or generations.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
