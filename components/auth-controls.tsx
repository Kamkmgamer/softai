"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export function AuthControls() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div className="h-8 w-20 animate-pulse rounded bg-surface-raised" />;
  }

  if (isSignedIn) {
    return (
      <Link href="/dashboard" className="btn-primary">
        Dashboard
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/sign-in"
        className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
      >
        Log in
      </Link>
      <Link href="/sign-up" className="btn-primary">
        Sign up
      </Link>
    </div>
  );
}
