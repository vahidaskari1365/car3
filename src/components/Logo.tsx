import Link from "next/link";

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="خودرویار — صفحه اصلی">
      <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand to-[#ff9b4a] shadow-[0_10px_24px_-12px_rgba(242,107,29,0.9)] transition group-hover:-translate-y-0.5">
        <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" aria-hidden="true">
          <path d="M5 21a11 11 0 0 1 22 0" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M16 21 22 12.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="16" cy="21" r="2.6" fill="white" />
          <path d="M4 26h24" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className={`text-lg font-extrabold ${light ? "text-white" : "text-ink"}`}>خودرویار</span>
        {!compact && (
          <span className={`mt-1 text-[10px] font-medium tracking-wide ${light ? "text-white/55" : "text-muted"}`}>
            خدمات و اطلاعات خودرو
          </span>
        )}
      </span>
    </Link>
  );
}
