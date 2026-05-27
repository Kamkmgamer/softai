import { redirect } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";
import { PageHeader, SectionHeader } from "@/components/ui";

export default async function SettingsPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const session = await getAppSession();
  if (!session) redirect(localizePath("/sign-in", locale));

  return (
    <div className="space-y-10">
      <PageHeader title={dictionary.settings.title} />

      <section className="space-y-4">
        <SectionHeader title={dictionary.settings.accountProfile} />
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
        <SectionHeader title={dictionary.settings.trustSafety} />
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 text-[13px] leading-relaxed text-text-secondary">
          <ul className="space-y-2 list-disc ps-4 marker:text-text-tertiary">
            <li>
              <strong className="font-medium text-text">{dictionary.settings.contentGenerationTitle}</strong> {dictionary.settings.contentGeneration}
            </li>
            <li>
              <strong className="font-medium text-text">{dictionary.settings.avatarsTitle}</strong> {dictionary.settings.avatars}
            </li>
            <li>
              <strong className="font-medium text-text">{dictionary.settings.dataUsageTitle}</strong> {dictionary.settings.dataUsage}
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
