"use client";

import { ClerkProvider } from "@clerk/nextjs";

type ProvidersProps = {
  children: React.ReactNode;
};

const hasClerk =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

export function Providers({ children }: ProvidersProps) {
  if (!hasClerk) {
    return <>{children}</>;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}
