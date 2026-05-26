import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { getAppSession } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";
import { upsertUser } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAppSession();
  const clerkUser = await currentUser().catch(() => null);
  await upsertUser({
    clerkUserId: session.clerkUserId,
    email: clerkUser?.primaryEmailAddress?.emailAddress ?? session.email,
    name:
      [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
      session.name,
  });

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 min-w-0 px-5 py-6 pb-20 lg:px-8 lg:py-8 lg:pb-8">
        <div className="mx-auto max-w-[1100px] space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
