"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolved, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentResolved = mounted ? resolved : "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "group relative inline-flex h-8 w-8 items-center justify-center rounded-md",
        "border border-border bg-surface text-text-secondary",
        "transition-colors duration-200 ease-out",
        "hover:border-border-strong hover:bg-surface-raised hover:text-text",
        "focus-visible:shadow-(--focus-ring)",
        className,
      )}
      aria-label={
        currentResolved === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      <Sun
        className={cn(
          "h-4 w-4 transition-[transform,opacity] duration-300",
          currentResolved === "dark"
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100",
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-[transform,opacity] duration-300",
          currentResolved === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0",
        )}
      />
    </button>
  );
}
