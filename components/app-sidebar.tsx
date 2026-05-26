"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, FolderKanban, LibraryBig, Settings, Shield, Sparkles, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: FolderKanban },
  { href: "/projects/new", label: "New Project", icon: Sparkles },
  { href: "/library", label: "Library", icon: LibraryBig },
  { href: "/billing", label: "Billing", icon: Wallet },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/admin", label: "Admin", icon: Shield },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="mesh-panel sticky top-6 h-[calc(100vh-3rem)] rounded-[2rem] border border-border p-5 shadow-[0_20px_50px_rgba(65,32,11,0.12)]">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background">
          <Film className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold">SoftAI Studio</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
            Build ads
          </p>
        </div>
      </div>
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                active
                  ? "bg-foreground text-background"
                  : "text-muted hover:bg-white/70 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 rounded-[1.5rem] border border-border bg-white/70 p-4 text-sm text-muted">
        Demo mode works without external keys. Add Clerk, OpenRouter, UploadThing, Polar, and Neon env vars to switch to live providers.
      </div>
    </aside>
  );
}
