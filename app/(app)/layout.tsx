import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
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
    <div className="runway-shell flex h-[100dvh] overflow-hidden bg-bg text-text max-lg:flex-col">
      <AppSidebar isAdmin={session.isAdmin} />
      <main className="min-h-0 min-w-0 flex-1 overflow-hidden bg-bg pt-16 lg:h-[100dvh] lg:pt-0">
        <div className="h-full min-h-0">
          {children}
        </div>
      </main>
    </div>
  );
}
