import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function RootNotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg p-6">
      <div className="flex max-w-sm flex-col items-center text-center">
        <FileQuestion className="mb-4 h-10 w-10 text-text-tertiary" />
        <h2 className="text-[15px] font-semibold text-text">
          Page not found
        </h2>
        <p className="mt-2 text-[0.8125rem] text-text-secondary">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn btn-primary mt-6">
          Back to home
        </Link>
      </div>
    </div>
  );
}
