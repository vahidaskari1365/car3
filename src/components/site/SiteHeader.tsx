"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LayoutDashboard, PlusCircle, PhoneCall } from "lucide-react";
import { Logo } from "@/components/Logo";

const nav = [
  { href: "/", label: "خانه" },
  { href: "/stores", label: "فروشگاه‌ها و خدمات" },
  { href: "/centers", label: "مراکز ضروری" },
  { href: "/garage", label: "شناسنامه خودرو" },
  { href: "/proposal", label: "پیشنهاد اجرا" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/85 backdrop-blur-xl">
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="ناوبری اصلی">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                isActive(item.href)
                  ? "bg-white text-ink shadow-card"
                  : "text-muted hover:bg-white/70 hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/register" className="btn-outline px-4 py-2.5">
            <PlusCircle className="h-4 w-4" />
            ثبت فروشگاه
          </Link>
          <Link href="/admin" className="btn-dark px-4 py-2.5">
            <LayoutDashboard className="h-4 w-4" />
            پنل مدیریت
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink md:hidden"
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-paper md:hidden">
          <div className="container-x space-y-1 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-3 py-2.5 text-sm font-medium ${
                  isActive(item.href) ? "bg-white text-ink shadow-card" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-3">
              <Link href="/register" onClick={() => setOpen(false)} className="btn-outline">
                <PlusCircle className="h-4 w-4" />
                ثبت فروشگاه
              </Link>
              <Link href="/admin" onClick={() => setOpen(false)} className="btn-dark">
                <LayoutDashboard className="h-4 w-4" />
                پنل مدیریت
              </Link>
            </div>
            <a href="tel:02191000000" className="mt-2 flex items-center justify-center gap-2 py-2 text-xs text-muted">
              <PhoneCall className="h-3.5 w-3.5" />
              پشتیبانی: ۰۲۱-۹۱۰۰۰۰۰۰
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
