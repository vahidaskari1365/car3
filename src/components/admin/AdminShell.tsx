"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BarChart3,
  ClipboardCheck,
  Database,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Store,
  Tags,
  Upload,
  UserCog,
  X,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAdmin } from "@/components/admin/AdminProvider";
import { toFa } from "@/lib/format";

const navGroups = [
  {
    title: "مدیریت",
    items: [
      { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
      { href: "/admin/stores", label: "فروشگاه‌ها", icon: Store },
      { href: "/admin/import", label: "ورود گروهی Excel/CSV", icon: Upload },
      { href: "/admin/verifications", label: "راستی‌آزمایی", icon: ShieldCheck, badge: "requests" as const },
    ],
  },
  {
    title: "سامانه",
    items: [
      { href: "/admin/operators", label: "اپراتورها و دسترسی", icon: UserCog },
      { href: "/admin/categories", label: "دسته‌بندی و شهرها", icon: Tags },
      { href: "/admin/settings", label: "پشتیبان‌گیری و تنظیمات", icon: Settings },
    ],
  },
];

const titles: Record<string, string> = {
  "/admin": "داشبورد مدیریت",
  "/admin/stores": "مدیریت فروشگاه‌ها",
  "/admin/import": "ورود گروهی اطلاعات",
  "/admin/verifications": "صف راستی‌آزمایی",
  "/admin/operators": "اپراتورها و سطوح دسترسی",
  "/admin/categories": "دسته‌بندی‌ها و شهرها",
  "/admin/settings": "پشتیبان‌گیری و تنظیمات",
};

export function AdminGate({ children }: { children: ReactNode }) {
  const admin = useAdmin();

  if (!admin.ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          در حال بارگذاری پنل…
        </div>
      </div>
    );
  }

  if (!admin.authed) return <LoginScreen />;

  return <AdminShell>{children}</AdminShell>;
}

function LoginScreen() {
  const admin = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!admin.login(password)) {
      setError("رمز عبور نادرست است. برای نسخه نمایشی از رمز admin استفاده کنید.");
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      <div className="relative hidden overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="mesh-dark absolute inset-0" aria-hidden="true" />
        <div className="dot-grid absolute inset-0 opacity-[0.07]" aria-hidden="true" />
        <div className="relative">
          <Logo light />
          <h1 className="mt-12 text-balance text-3xl font-extrabold leading-[1.5]">
            پنل مدیریت یکپارچه
            <br />
            اطلاعات فروشگاه‌ها و خدمات خودرو
          </h1>
          <p className="mt-4 max-w-md text-sm leading-8 text-white/60">
            مدیریت مراکز خدمات، ورود گروهی داده، راستی‌آزمایی تلفنی و سطوح دسترسی
            اپراتورها — همه در یک سامانه با دیتابیس مرکزی.
          </p>
        </div>
        <div className="relative grid grid-cols-3 gap-3">
          {[
            { label: "فروشگاه ثبت‌شده", value: toFa(admin.stores.length) },
            { label: "پرونده تأییدشده", value: toFa(admin.stores.filter((s) => s.status === "verified").length) },
            { label: "در صف بررسی", value: toFa(admin.changeRequests.filter((r) => r.status === "pending").length) },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-2xl font-extrabold">{item.value}</p>
              <p className="mt-1 text-[10px] text-white/50">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center bg-paper p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="card-surface mt-6 p-6 sm:p-8">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-dark">
              <LockKeyhole className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-xl font-extrabold">ورود به پنل مدیریت</h2>
            <p className="mt-1.5 text-xs leading-6 text-muted">
              دسترسی فقط برای اپراتورهای مجاز. در نسخه نهایی، ورود با موبایل و رمز یک‌بارمصرف انجام می‌شود.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-3">
              <div>
                <label className="label" htmlFor="email">ایمیل اپراتور</label>
                <input id="email" className="input" defaultValue="admin@khodroyar.ir" dir="ltr" />
              </div>
              <div>
                <label className="label" htmlFor="password">رمز عبور</label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••"
                  dir="ltr"
                />
              </div>
              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-700">{error}</p>}
              <button type="submit" className="btn-primary w-full">
                ورود به پنل
              </button>
            </form>

            <div className="mt-5 rounded-xl border border-dashed border-brand/30 bg-brand-soft p-3 text-[11px] text-ink-soft">
              <p className="mb-1.5 flex items-center gap-1.5 font-bold text-brand-dark">
                <Sparkles className="h-3.5 w-3.5" />
                دسترسی نسخه نمایشی
              </p>
              ایمیل: admin@khodroyar.ir — رمز: <span className="font-bold">admin</span>
              <button
                type="button"
                onClick={() => {
                  setPassword("admin");
                  admin.login("admin");
                }}
                className="mt-2 block w-full rounded-lg bg-ink py-2 text-[11px] font-bold text-white"
              >
                ورود سریع نمایشی
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px]">
              <Link href="/" className="flex items-center gap-1 text-muted hover:text-ink">
                <ArrowUpRight className="h-3.5 w-3.5" /> بازگشت به سایت
              </Link>
              <span className="flex items-center gap-1 text-muted">
                <Database className="h-3.5 w-3.5" /> داده نمایشی محلی
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminShell({ children }: { children: ReactNode }) {
  const admin = useAdmin();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const pendingCount = admin.changeRequests.filter((r) => r.status === "pending").length;
  const title = titles[pathname] ?? "پنل مدیریت";

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-5">
        <Logo light />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-[10px] font-bold tracking-wide text-white/35">{group.title}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                      active ? "bg-brand text-white" : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {item.badge === "requests" && pendingCount > 0 && (
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? "bg-white/20" : "bg-brand text-white"}`}>
                        {toFa(pendingCount)}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="rounded-xl bg-white/[0.04] p-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand/20 text-brand">
              <BarChart3 className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-white">نگار احمدی</p>
              <p className="truncate text-[10px] text-white/40">مدیر سامانه</p>
            </div>
          </div>
          <button
            type="button"
            onClick={admin.logout}
            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 py-1.5 text-[10px] font-semibold text-white/60 hover:border-white/25 hover:text-white"
          >
            <LogOut className="h-3 w-3" />
            خروج از حساب
          </button>
        </div>
        <Link href="/" className="mt-2 flex items-center justify-center gap-1.5 py-2 text-[10px] text-white/40 hover:text-white">
          <ExternalLink className="h-3 w-3" />
          مشاهده وب‌سایت
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-64 bg-ink lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="بستن منو" className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 right-0 w-72 bg-ink">{sidebar}</aside>
        </div>
      )}

      <div className="lg:mr-64">
        <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="باز کردن منو"
                className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white lg:hidden"
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <div>
                <h1 className="text-sm font-extrabold sm:text-base">{title}</h1>
                <p className="hidden text-[10px] text-muted sm:block">خودرویار / پنل مدیریت / {title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/verifications" className="hidden items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[11px] font-semibold text-ink-soft hover:border-brand/40 sm:flex">
                <ClipboardCheck className="h-3.5 w-3.5 text-brand" />
                {toFa(pendingCount)} پرونده در صف
              </Link>
              <span className="hidden rounded-lg border border-line bg-white px-3 py-2 text-[11px] text-muted md:inline">۱۴۰۴/۱۲/۱۸</span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">ن.ا</span>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>

        <footer className="border-t border-line px-4 py-4 text-center text-[10px] text-muted sm:px-6">
          خودرویار — فاز اول پلتفرم یکپارچه خدمات خودرو • داده‌های این نسخه نمایشی در مرورگر شما ذخیره می‌شوند.
        </footer>
      </div>
    </div>
  );
}
