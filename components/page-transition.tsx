"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setAnimating(true);
      const id = setTimeout(() => setAnimating(false), 400);
      return () => clearTimeout(id);
    }
  }, [pathname]);

  return (
    <div
      className={cn(
        animating && "animate-slide-up",
        className,
      )}
    >
      {children}
    </div>
  );
}
