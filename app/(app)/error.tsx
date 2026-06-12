"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function AppError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-bg p-6 lg:min-h-dvh">
      <div className="flex max-w-sm flex-col items-center text-center">
        <AlertTriangle className="mb-4 h-10 w-10 text-danger" />
        <h2 className="text-[15px] font-semibold text-text">
          Something went wrong
        </h2>
        <p className="mt-2 text-[0.8125rem] text-text-secondary">
          An unexpected error occurred. You can try again or return to the
          dashboard.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="btn btn-primary"
          >
            Try again
          </button>
          <Link href="/dashboard" className="btn btn-secondary">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
