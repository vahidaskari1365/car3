"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function PageHeader({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h2 className="text-xl font-extrabold sm:text-2xl">{title}</h2>
        {desc && <p className="mt-2 max-w-2xl text-xs leading-6 text-muted">{desc}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Panel({
  title,
  desc,
  action,
  children,
  className = "",
}: {
  title?: string;
  desc?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card-surface overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3.5">
          <div>
            {title && <h3 className="text-sm font-bold">{title}</h3>}
            {desc && <p className="mt-0.5 text-[10px] text-muted">{desc}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Kpi({
  label,
  value,
  hint,
  icon: Icon,
  tone = "brand",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "brand" | "teal" | "ink" | "amber";
}) {
  const tones = {
    brand: "bg-brand-soft text-brand-dark",
    teal: "bg-teal-soft text-teal",
    ink: "bg-ink text-white",
    amber: "bg-amber-50 text-amber-700",
  } as const;

  return (
    <div className="card-surface p-4">
      <div className="flex items-start justify-between">
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[10px] text-muted">{hint}</span>
      </div>
      <p className="mt-3 text-xl font-extrabold">{value}</p>
      <p className="mt-0.5 text-[11px] text-muted">{label}</p>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  desc,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  desc?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 sm:p-8">
      <div className={`relative my-6 w-full rounded-3xl border border-line bg-white shadow-lift ${wide ? "max-w-4xl" : "max-w-2xl"}`}>
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h3 className="text-sm font-bold">{title}</h3>
            {desc && <p className="mt-0.5 text-[11px] text-muted">{desc}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="بستن" className="rounded-lg p-1 text-muted hover:bg-paper">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

export function Meter({ value, max, color = "bg-brand" }: { value: number; max: number; color?: string }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-deep">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, Math.max(percent, 2))}%` }} />
    </div>
  );
}
