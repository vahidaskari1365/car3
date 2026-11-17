import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { verificationLabels } from "@/data/catalog";
import type { VerificationStatus } from "@/lib/types";
import { toFa } from "@/lib/format";

export function SectionHeading({
  eyebrow,
  title,
  desc,
  href,
  linkLabel = "مشاهده همه",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  href?: string;
  linkLabel?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div className="max-w-2xl">
        {eyebrow && (
          <span
            className={`mb-3 inline-flex items-center gap-2 text-xs font-bold ${
              light ? "text-brand" : "text-brand-dark"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {eyebrow}
          </span>
        )}
        <h2
          className={`text-balance text-2xl font-extrabold leading-[1.45] sm:text-[32px] ${
            light ? "text-white" : "text-ink"
          }`}
        >
          {title}
        </h2>
        {desc && (
          <p className={`mt-3 text-sm leading-7 ${light ? "text-white/60" : "text-muted"}`}>{desc}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
            light
              ? "border-white/20 text-white hover:border-brand hover:text-brand"
              : "border-line bg-white text-ink hover:border-brand/40 hover:text-brand-dark"
          }`}
        >
          {linkLabel}
          <ArrowLeft className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export function VerificationBadge({
  status,
  size = "sm",
}: {
  status: VerificationStatus;
  size?: "sm" | "md";
}) {
  const meta = verificationLabels[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset ${meta.className} ${
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.title}
    </span>
  );
}

export function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      {toFa(rating.toFixed(1))}
      {typeof reviews === "number" && <span className="font-normal text-muted">({toFa(reviews)})</span>}
    </span>
  );
}

export function Stat({ value, label, light = false }: { value: string; label: string; light?: boolean }) {
  return (
    <div>
      <div className={`text-2xl font-extrabold sm:text-3xl ${light ? "text-white" : "text-ink"}`}>{value}</div>
      <div className={`mt-1 text-xs ${light ? "text-white/55" : "text-muted"}`}>{label}</div>
    </div>
  );
}

export function EmptyState({
  title,
  desc,
  action,
}: {
  title: string;
  desc: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="card-surface flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand-dark">
        <Star className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="max-w-md text-sm leading-7 text-muted">{desc}</p>
      {action && (
        <Link href={action.href} className="btn-primary mt-2">
          {action.label}
        </Link>
      )}
    </div>
  );
}
