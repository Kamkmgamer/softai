import Link from "next/link";
import { redirect } from "next/navigation";
import { CreditCard } from "lucide-react";
import { UserProfile } from "@clerk/nextjs";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";
import { runwayClerkAppearance } from "@/lib/clerk-appearance";

export default async function PaymentsPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const session = await getAppSession();
  if (!session) redirect(localizePath("/sign-in", locale));

  return (
    <div className="thin-scrollbar h-full overflow-y-auto px-5 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[920px] space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
              <CreditCard className="h-3.5 w-3.5" />
              {dictionary.payments.title}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-text">
              {dictionary.payments.accountPanel}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              {dictionary.payments.description}
            </p>
          </div>
          <Link href={localizePath("/billing", locale)} className="btn btn-secondary">
            {dictionary.payments.openBilling}
          </Link>
        </header>

        <section id="billing" className="clerk-account-surface overflow-hidden rounded-2xl border border-border bg-bg shadow-[var(--shadow-sm)]">
            <UserProfile
              appearance={runwayClerkAppearance}
              routing="hash"
            />
        </section>
      </div>
    </div>
  );
}
