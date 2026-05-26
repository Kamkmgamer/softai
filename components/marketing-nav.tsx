import Link from "next/link";
import { ButtonLink } from "@/components/ui";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-sm font-bold text-background">
            S
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">SoftAI</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
              AI ad studio
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <Link href="/pricing">Pricing</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/library">Library</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ButtonLink href="/sign-in" variant="secondary">
            Sign in
          </ButtonLink>
          <ButtonLink href="/dashboard">Start creating</ButtonLink>
        </div>
      </div>
    </header>
  );
}
