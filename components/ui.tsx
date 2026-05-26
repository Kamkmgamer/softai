import Link from "next/link";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent-strong">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function Pill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const tones = {
    default: "bg-accent-soft text-accent-strong",
    success: "bg-emerald-100 text-success",
    warning: "bg-amber-100 text-warning",
    danger: "bg-rose-100 text-danger",
  } as const;

  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}

export function Card({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("glass-card rounded-[2rem] border border-border p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition",
        variant === "primary"
          ? "bg-foreground text-background hover:bg-accent-strong"
          : "border border-border bg-white/70 text-foreground hover:border-accent hover:bg-accent-soft/40",
      )}
    >
      {children}
    </Link>
  );
}

export function FieldLabel({
  label,
  hint,
}: {
  label: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {hint ? <p className="text-sm text-muted">{hint}</p> : null}
    </div>
  );
}
