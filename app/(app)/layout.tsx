import type { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { AuthControls } from "@/components/auth-controls";
import { AppSidebar } from "@/components/app-sidebar";
import { Pill } from "@/components/ui";
import { getAppSession } from "@/lib/auth";
import { upsertUser } from "@/lib/store";
import { getMissingRequiredEnv } from "@/lib/env";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAppSession();
  const clerkUser = await currentUser().catch(() => null);
  const user = upsertUser({
    clerkUserId: session.clerkUserId,
    email: clerkUser?.primaryEmailAddress?.emailAddress ?? session.email,
    name:
      [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
      session.name,
  });
  const missingEnv = getMissingRequiredEnv();

  return (
    <div className="mx-auto grid min-h-screen w-full max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
      <AppSidebar />
      <div className="space-y-6">
        <div className="glass-card flex flex-col justify-between gap-4 rounded-[2rem] border border-border px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">Workspace</p>
            <h2 className="mt-1 text-xl font-semibold">{user.name}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Pill>{session.isDemo ? "Demo session" : "Clerk auth"}</Pill>
            {missingEnv.length > 0 ? <Pill tone="warning">{missingEnv.length} env vars missing</Pill> : null}
            {!session.isDemo ? <AuthControls variant="app" /> : null}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
