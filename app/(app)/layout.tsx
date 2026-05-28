import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getAppSession } from "@/lib/auth";
import { DEFAULT_LOCALE, isLocale, localizePath } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerList = await headers();
  const headerLocale = headerList.get("x-softai-locale");
  const locale = isLocale(headerLocale) ? headerLocale : DEFAULT_LOCALE;
  const session = await getAppSession().catch((error) => {
    if (error instanceof Error && error.message === "Authentication required.") {
      redirect(localizePath("/sign-in", locale));
    }
    throw error;
  });
  return (
    <div className="flex min-h-[100dvh] flex-col lg:flex-row">
      <AppSidebar isAdmin={session.isAdmin} />
      <main className="flex-1 min-w-0 px-5 pb-6 pt-24 lg:min-h-[100dvh] lg:px-8 lg:pb-8 lg:pt-24">
        <div className="mx-auto max-w-[1100px] space-y-6">
          <div className="flex justify-end">
            <LanguageSwitcher />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
