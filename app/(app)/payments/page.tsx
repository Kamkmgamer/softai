import Link from "next/link";
import { redirect } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";
import { softaiClerkAppearance } from "@/lib/clerk-appearance";
import { AppBackButton } from "@/components/app-back-button";

export default async function PaymentsPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const session = await getAppSession();
  if (!session) redirect(localizePath("/sign-in", locale));

  return (
    <div className="thin-scrollbar h-full overflow-y-auto px-5 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[920px] space-y-6">
        <header className="flex flex-wrap items-start gap-4">
          <AppBackButton className="mt-1" />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-text">
              {dictionary.payments.accountPanel}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              {dictionary.payments.description}
            </p>
          </div>
          <Link
            href={localizePath("/billing", locale)}
            className="btn btn-secondary"
          >
            {dictionary.payments.openBilling}
          </Link>
        </header>

        <section
          id="billing"
          className="clerk-account-surface overflow-hidden rounded-2xl border border-border bg-bg shadow-(--shadow-sm)"
        >
          <UserProfile appearance={softaiClerkAppearance} routing="hash" />
        </section>
      </div>
    </div>
  );
}
