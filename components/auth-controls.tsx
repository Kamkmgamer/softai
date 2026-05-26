import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

type AuthControlsProps = {
  variant?: "marketing" | "app";
};

const linkBaseClassName =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition";

export function AuthControls({ variant = "marketing" }: AuthControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <Show when="signed-out">
        <Link
          href="/sign-in"
          className={cn(
            linkBaseClassName,
            "border border-border bg-white/70 text-foreground hover:border-accent hover:bg-accent-soft/40",
          )}
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className={cn(linkBaseClassName, "bg-foreground text-background hover:bg-accent-strong")}
        >
          {variant === "app" ? "Create account" : "Sign up"}
        </Link>
      </Show>
      <Show when="signed-in">
        {variant === "marketing" ? (
          <Link
            href="/dashboard"
            className={cn(linkBaseClassName, "bg-foreground text-background hover:bg-accent-strong")}
          >
            Dashboard
          </Link>
        ) : null}
        <UserButton />
      </Show>
    </div>
  );
}
