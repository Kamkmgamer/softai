import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { UserProfile } from "@clerk/nextjs";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";
import { softaiClerkAppearance } from "@/lib/clerk-appearance";
import { SectionHeader } from "@/components/ui";

export default async function SettingsPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const session = await getAppSession();
  if (!session) redirect(localizePath("/sign-in", locale));

  return (
    <div className="thin-scrollbar h-full overflow-y-auto px-5 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            {dictionary.settings.accountProfile}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">
            {dictionary.settings.description}
          </p>
        </header>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <SectionHeader title={dictionary.settings.accountProfile} />
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-(--shadow-sm)">
              <UserProfile appearance={softaiClerkAppearance} routing="hash" />
            </div>
          </div>

          <div className="space-y-4">
            <SectionHeader title={dictionary.settings.trustSafety} />
            <div className="rounded-2xl border border-border bg-surface p-5 text-[13px] leading-relaxed text-text-secondary">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-surface-raised text-text-secondary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <ul className="space-y-3 list-disc ps-4 marker:text-text-tertiary">
                <li>
                  <strong className="font-medium text-text">
                    {dictionary.settings.contentGenerationTitle}
                  </strong>{" "}
                  {dictionary.settings.contentGeneration}
                </li>
                <li>
                  <strong className="font-medium text-text">
                    {dictionary.settings.avatarsTitle}
                  </strong>{" "}
                  {dictionary.settings.avatars}
                </li>
                <li>
                  <strong className="font-medium text-text">
                    {dictionary.settings.dataUsageTitle}
                  </strong>{" "}
                  {dictionary.settings.dataUsage}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
