import Link from "next/link";
import { cn } from "@/lib/utils";

/* ─── Page header ────────────────────────────────────────── */

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-text text-balance">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-xl text-[0.8125rem] leading-relaxed text-text-secondary">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ─── Section header (in-page) ───────────────────────────── */

export function SectionHeader({
  title,
  action,
  count,
}: {
  title: string;
  action?: React.ReactNode;
  count?: number | string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <h2 className="text-[0.9375rem] font-semibold text-text">{title}</h2>
        {count !== undefined ? (
          <span className="text-xs tabular-nums text-text-tertiary">{count}</span>
        ) : null}
      </div>
      {action}
    </div>
  );
}

/* ─── Badge / Pill ───────────────────────────────────────── */

const badgeTones = {
  default:  "border-border bg-surface-raised text-text-secondary",
  accent:   "border-accent/20 bg-accent-soft text-accent-text",
  success:  "border-success/20 bg-success-soft text-success",
  warning:  "border-warning/20 bg-warning-soft text-warning",
  danger:   "border-danger/20 bg-danger-soft text-danger",
} as const;

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: keyof typeof badgeTones;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize leading-none",
        badgeTones[tone],
      )}
    >
      {children}
    </span>
  );
}

/** @deprecated Use Badge instead */
export const Pill = Badge;

/* ─── Status badge (dot + label) ─────────────────────────── */

const statusColors: Record<string, string> = {
  draft:            "status-dot-neutral",
  storyboard_ready: "status-dot-warning",
  review_needed:    "status-dot-warning",
  rendering:        "status-dot-warning",
  completed:        "status-dot-success",
  failed:           "status-dot-danger",
  blocked:          "status-dot-danger",
  active:           "status-dot-success",
  inactive:         "status-dot-neutral",
  trialing:         "status-dot-warning",
  past_due:         "status-dot-danger",
  canceled:         "status-dot-danger",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary capitalize">
      <span className={cn("status-dot", statusColors[status] ?? "status-dot-neutral")} />
      {status.replaceAll("_", " ")}
    </span>
  );
}

/* ─── Card ───────────────────────────────────────────────── */

export function Card({
  className,
  padding = "default",
  children,
  ...props
}: React.ComponentProps<"div"> & {
  padding?: "compact" | "default" | "spacious";
}) {
  const paddings = {
    compact: "p-4",
    default: "p-5",
    spacious: "p-6",
  };
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-sm)]",
        paddings[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─── Empty state ────────────────────────────────────────── */

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border px-6 py-12 text-center">
      {Icon ? <Icon className="mb-3 h-8 w-8 text-text-tertiary" /> : null}
      <p className="text-sm font-medium text-text">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-[0.8125rem] text-text-secondary">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/* ─── Data row (key-value) ───────────────────────────────── */

export function DataRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <dt className="shrink-0 text-[0.8125rem] text-text-secondary">{label}</dt>
      <dd className="text-right text-[0.8125rem] font-medium text-text">{children}</dd>
    </div>
  );
}

/* ─── Button link ────────────────────────────────────────── */

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "default",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "default" | "sm";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "btn",
        variant === "primary" ? "btn-primary" : "btn-secondary",
        size === "sm" && "btn-sm",
      )}
    >
      {children}
    </Link>
  );
}

/* ─── Field label ────────────────────────────────────────── */

export function FieldLabel({
  htmlFor,
  label,
  hint,
  required,
}: {
  htmlFor?: string;
  label: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-0.5">
      <label htmlFor={htmlFor} className="text-[0.8125rem] font-medium text-text">
        {label}
        {required ? <span className="ml-0.5 text-danger">*</span> : null}
      </label>
      {hint ? <p className="text-xs text-text-tertiary">{hint}</p> : null}
    </div>
  );
}
