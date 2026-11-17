"use client";

import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Database,
  MapPin,
  Store,
  Upload,
  UserCog,
  Users,
  XCircle,
} from "lucide-react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Kpi, Meter, PageHeader, Panel } from "@/components/admin/AdminUI";
import { categories, cities, verificationLabels } from "@/data/catalog";
import { storeCover } from "@/data/images";
import { toFa, toman } from "@/lib/format";
import Image from "next/image";
import type { VerificationStatus } from "@/lib/types";

export default function AdminDashboardPage() {
  const admin = useAdmin();
  const pendingRequests = admin.changeRequests.filter((r) => r.status === "pending");
  const verified = admin.stores.filter((s) => s.status === "verified");
  const pending = admin.stores.filter((s) => s.status === "pending");
  const unverified = admin.stores.filter((s) => s.status === "unverified");
  const totalReviews = admin.stores.reduce((sum, s) => sum + s.reviews, 0);

  const statusRows: { key: VerificationStatus; value: number }[] = [
    { key: "verified", value: verified.length },
    { key: "pending", value: pending.length },
    { key: "unverified", value: unverified.length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`سلام نگار، امروز ${toFa(pendingRequests.length)} پرونده در صف بررسی است`}
        desc="نمای کلی وضعیت داده‌های مرکزی، فروشگاه‌ها، راستی‌آزمایی و فعالیت اپراتورها. همه تغییرات در گزارش فعالیت ثبت می‌شود."
      >
        <Link href="/admin/import" className="btn-outline px-4 py-2.5">
          <Upload className="h-4 w-4" /> ورود گروهی داده
        </Link>
        <Link href="/admin/stores" className="btn-dark px-4 py-2.5">
          <Store className="h-4 w-4" /> مدیریت فروشگاه‌ها
        </Link>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="فروشگاه و مرکز ثبت‌شده" value={toFa(admin.stores.length)} hint="دیتابیس مرکزی" icon={Building2} />
        <Kpi label="اطلاعات تأییدشده" value={toFa(verified.length)} hint={`${Math.round((verified.length / Math.max(admin.stores.length, 1)) * 100)}٪ کل مراکز`} icon={BadgeCheck} tone="teal" />
        <Kpi label="پرونده در صف بررسی" value={toFa(pendingRequests.length)} hint="تغییرات مالکان" icon={ClipboardCheck} tone="amber" />
        <Kpi label="اپراتور فعال" value={toFa(admin.operators.filter((o) => o.active).length)} hint={`${toFa(admin.operators.length)} اپراتور کل`} icon={UserCog} tone="ink" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="آخرین درخواست‌های اصلاح اطلاعات" desc="ارسال‌شده از لینک اختصاصی مالک یا تأیید تلفنی" action={<Link href="/admin/verifications" className="text-[11px] font-bold text-brand-dark">مشاهده صف کامل</Link>}>
          {pendingRequests.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted">همه درخواست‌ها بررسی شده‌اند.</p>
          ) : (
            <ul className="space-y-3">
              {pendingRequests.map((request) => (
                <li key={request.id} className="rounded-2xl border border-line p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold">{request.storeName}</p>
                      <p className="mt-1 text-[10px] text-muted">
                        {request.submittedAt} • {request.channel} • {request.summary}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => admin.approveRequest(request.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> تأیید
                      </button>
                      <button
                        type="button"
                        onClick={() => admin.rejectRequest(request.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-[10px] font-bold text-red-700 hover:bg-red-100"
                      >
                        <XCircle className="h-3.5 w-3.5" /> رد
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.keys(request.payload).slice(0, 3).map((key) => (
                      <span key={key} className="rounded-md bg-paper px-2 py-1 text-[10px] text-muted">
                        {key}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="space-y-5">
          <Panel title="وضعیت راستی‌آزمایی" desc="توزیع مراکز بر اساس وضعیت اطلاعات">
            <div className="space-y-3">
              {statusRows.map((row) => (
                <div key={row.key}>
                  <div className="mb-1.5 flex items-center justify-between text-[11px]">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-semibold ring-1 ring-inset ${verificationLabels[row.key].className}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${verificationLabels[row.key].dot}`} />
                      {verificationLabels[row.key].title}
                    </span>
                    <span className="font-bold">{toFa(row.value)}</span>
                  </div>
                  <Meter
                    value={row.value}
                    max={admin.stores.length}
                    color={row.key === "verified" ? "bg-emerald-500" : row.key === "pending" ? "bg-amber-500" : "bg-slate-400"}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-4 text-center">
              <div className="rounded-xl bg-paper p-2.5">
                <p className="text-sm font-extrabold">{toFa(totalReviews)}</p>
                <p className="text-[9px] text-muted">نظر کاربران</p>
              </div>
              <div className="rounded-xl bg-paper p-2.5">
                <p className="text-sm font-extrabold">{toFa(admin.registrations.length)}</p>
                <p className="text-[9px] text-muted">درخواست ثبت جدید</p>
              </div>
            </div>
          </Panel>

          <Panel title="گزارش فعالیت" desc="ثبت خودکار رویدادها">
            <ul className="space-y-3">
              {admin.activities.slice(0, 5).map((activity) => (
                <li key={activity.id} className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-paper text-muted">
                    <Activity className="h-3 w-3" />
                  </span>
                  <div>
                    <p className="text-[11px] leading-5 text-ink-soft">{activity.text}</p>
                    <p className="text-[9px] text-muted">{activity.at}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <Panel
          title="پوشش دسته‌بندی خدمات"
          desc="تعداد مراکز ثبت‌شده در هر دسته"
          action={<Link href="/admin/categories" className="text-[11px] font-bold text-brand-dark">جزییات دسته‌بندی</Link>}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((cat) => {
              const count = admin.stores.filter((s) => s.categoryId === cat.id).length;
              return (
                <div key={cat.id} className="rounded-xl border border-line p-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold">{cat.short}</span>
                    <span className="text-muted">{toFa(count)} مرکز</span>
                  </div>
                  <div className="mt-2">
                    <Meter value={count} max={Math.max(...categories.map((c) => admin.stores.filter((s) => s.categoryId === c.id).length))} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="دسترسی سریع">
            <div className="grid gap-2">
              {[
                { href: "/admin/stores", label: "افزودن یا ویرایش فروشگاه", icon: Store },
                { href: "/admin/import", label: "ورود گروهی از Excel/CSV", icon: Upload },
                { href: "/admin/operators", label: "مدیریت اپراتورها", icon: Users },
                { href: "/admin/settings", label: "پشتیبان‌گیری و خروجی داده", icon: Database },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center justify-between rounded-xl border border-line px-3 py-2.5 text-[11px] font-semibold transition hover:border-brand/40 hover:bg-brand-soft/40">
                  <span className="flex items-center gap-2">
                    <item.icon className="h-3.5 w-3.5 text-brand" />
                    {item.label}
                  </span>
                  <ArrowLeft className="h-3 w-3 text-muted" />
                </Link>
              ))}
            </div>
          </Panel>

          <Panel title="پوشش شهری" desc="مراکز فعال به تفکیک شهر">
            <ul className="space-y-2">
              {cities.slice(0, 5).map((city) => {
                const count = admin.stores.filter((s) => s.city === city.name).length;
                return (
                  <li key={city.name} className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-muted">
                      <MapPin className="h-3 w-3 text-brand" /> {city.name}
                    </span>
                    <span className="font-bold">{toFa(count)}</span>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>

      <Panel title="آخرین مراکز ثبت‌شده" desc="با تصویر، وضعیت تأیید و ارزش خدمات">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {admin.stores.slice(0, 3).map((store) => (
            <div key={store.id} className="flex items-center gap-3 rounded-2xl border border-line p-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                <Image src={storeCover(store.coverIndex)} alt={store.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-bold">{store.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted">
                  <MapPin className="h-3 w-3" /> {store.city}، {store.district}
                </p>
                <p className="mt-1 flex items-center gap-1 text-[9px] text-muted">
                  <Clock className="h-3 w-3" /> آخرین بررسی: {store.lastCheck ?? "—"}
                </p>
              </div>
              <Link href="/admin/stores" className="rounded-lg bg-paper p-2 text-muted hover:text-brand-dark" aria-label="مدیریت">
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[10px] text-muted">
          میانگین امتیاز مراکز: {toFa((admin.stores.reduce((sum, s) => sum + s.rating, 0) / Math.max(admin.stores.length, 1)).toFixed(1))} از ۵ —
          ارزش تقریبی خدمات ثبت‌شده: {toman(admin.stores.length * 1_250_000)}
        </p>
      </Panel>
    </div>
  );
}
