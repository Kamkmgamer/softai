import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { TopNav } from "@/components/top-nav";
import { PageTransition } from "@/components/page-transition";
import { getAppSession } from "@/lib/auth";
import { DEFAULT_LOCALE, isLocale, localizePath } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const headerList = await headers();
  const headerLocale = headerList.get("x-softai-locale");
  const locale = isLocale(headerLocale) ? headerLocale : DEFAULT_LOCALE;
  const session = await getAppSession().catch((error) => {
    if (
      error instanceof Error &&
      error.message === "Authentication required."
    ) {
      redirect(localizePath("/sign-in", locale));
    }
    throw error;
  });

  return (
    <div className="softai-shell flex min-h-dvh flex-col bg-bg text-text lg:h-dvh lg:overflow-hidden">
      <TopNav />
      <div className="flex min-h-0 flex-1 max-lg:flex-col">
        <AppSidebar isAdmin={session.isAdmin} />
        <main id="main-content" className="min-w-0 flex-1 bg-bg pb-18 pt-16 lg:h-dvh lg:min-h-0 lg:overflow-y-auto lg:pb-0 lg:pt-0">
          <PageTransition className="min-h-full lg:h-full lg:min-h-0">
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}

