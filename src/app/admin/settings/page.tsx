"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  Database,
  Download,
  FileCheck2,
  FileJson,
  HardDriveDownload,
  KeyRound,
  RotateCcw,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { PageHeader, Panel } from "@/components/admin/AdminUI";
import { downloadBlob, useLocalStore } from "@/lib/useLocalStore";
import type { Registration } from "@/components/admin/AdminProvider";
import { toCsv } from "@/lib/csv";
import { toFa } from "@/lib/format";
import type { ActivityItem, ChangeRequest, Operator, Store } from "@/lib/types";

export default function AdminSettingsPage() {
  const admin = useAdmin();
  const registrations = useLocalStore<Registration[]>("registrations", []);
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [restoreConfirm, setRestoreConfirm] = useState(false);

  function flash(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(""), 4000);
  }

  function backupJson() {
    const payload = {
      app: "khodroyar",
      version: "phase-1",
      exportedAt: new Date().toISOString(),
      stores: admin.stores,
      operators: admin.operators,
      changeRequests: admin.changeRequests,
      activities: admin.activities,
      registrations: registrations.value,
    };
    downloadBlob("khodroyar-backup.json", new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    flash("نسخه پشتیبان کامل (JSON) دانلود شد.");
  }

  function exportStoresCsv() {
    const csv = toCsv(
      ["id", "name", "categoryId", "city", "district", "address", "phone", "mobile", "ownerName", "status", "lastCheck", "token"],
      admin.stores.map((s) => [s.id, s.name, s.categoryId, s.city, s.district, s.address, s.phone, s.mobile, s.ownerName, s.status, s.lastCheck ?? "", s.verifyToken]),
    );
    downloadBlob("store-directory.csv", new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    flash("خروجی CSV فهرست فروشگاه‌ها دانلود شد.");
  }

  function onRestore(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as {
          stores?: Store[];
          operators?: Operator[];
          changeRequests?: ChangeRequest[];
          activities?: ActivityItem[];
          registrations?: Registration[];
        };
        if (!data.stores) throw new Error("invalid");
        window.localStorage.setItem("khodroyar:v1:stores", JSON.stringify(data.stores));
        if (data.operators) window.localStorage.setItem("khodroyar:v1:operators", JSON.stringify(data.operators));
        if (data.changeRequests) window.localStorage.setItem("khodroyar:v1:changeRequests", JSON.stringify(data.changeRequests));
        if (data.activities) window.localStorage.setItem("khodroyar:v1:activities", JSON.stringify(data.activities));
        if (data.registrations) window.localStorage.setItem("khodroyar:v1:registrations", JSON.stringify(data.registrations));
        flash("داده‌ها بازگردانی شد؛ برای اعمال کامل، صفحه بازخوانی می‌شود.");
        setTimeout(() => window.location.reload(), 1200);
      } catch {
        flash("فایل پشتیبان معتبر نیست. فایل JSON خروجی خودرویار را انتخاب کنید.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="پشتیبان‌گیری، خروجی داده و تنظیمات"
        desc="مالکیت داده با کارفرما است؛ هر زمان می‌توانید نسخه کامل داده‌ها را دریافت یا بازگردانی کنید. در نسخه نهایی، پشتیبان‌گیری خودکار روزانه فعال است."
      />

      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4" /> {message}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "فروشگاه", value: admin.stores.length },
          { label: "اپراتور", value: admin.operators.length },
          { label: "درخواست تغییر", value: admin.changeRequests.length },
          { label: "رویداد ثبت‌شده", value: admin.activities.length },
        ].map((item) => (
          <div key={item.label} className="card-surface p-4">
            <p className="text-xl font-extrabold">{toFa(item.value)}</p>
            <p className="text-[10px] text-muted">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="پشتیبان‌گیری و خروجی" desc="دریافت نسخه کامل داده‌ها برای آرشیو یا انتقال به سرور">
          <div className="space-y-2.5">
            <button type="button" onClick={backupJson} className="flex w-full items-center justify-between rounded-xl border border-line px-4 py-3 text-[11px] font-semibold transition hover:border-brand/40 hover:bg-brand-soft/40">
              <span className="flex items-center gap-2">
                <FileJson className="h-4 w-4 text-brand" />
                پشتیبان کامل JSON (فروشگاه‌ها، اپراتورها، درخواست‌ها، گزارش)
              </span>
              <Download className="h-3.5 w-3.5 text-muted" />
            </button>
            <button type="button" onClick={exportStoresCsv} className="flex w-full items-center justify-between rounded-xl border border-line px-4 py-3 text-[11px] font-semibold transition hover:border-brand/40 hover:bg-brand-soft/40">
              <span className="flex items-center gap-2">
                <Archive className="h-4 w-4 text-brand" />
                خروجی CSV فهرست فروشگاه‌ها
              </span>
              <Download className="h-3.5 w-3.5 text-muted" />
            </button>
            <button
              type="button"
              onClick={() => {
                const csv = toCsv(
                  ["id", "storeName", "submittedAt", "channel", "status"],
                  admin.changeRequests.map((r) => [r.id, r.storeName, r.submittedAt, r.channel, r.status]),
                );
                downloadBlob("verification-requests.csv", new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
                flash("خروجی درخواست‌های راستی‌آزمایی دانلود شد.");
              }}
              className="flex w-full items-center justify-between rounded-xl border border-line px-4 py-3 text-[11px] font-semibold transition hover:border-brand/40 hover:bg-brand-soft/40"
            >
              <span className="flex items-center gap-2">
                <HardDriveDownload className="h-4 w-4 text-brand" />
                خروجی درخواست‌های راستی‌آزمایی
              </span>
              <Download className="h-3.5 w-3.5 text-muted" />
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-teal-soft p-3 text-[10px] leading-5 text-teal">
            در نسخه عملیاتی، پشتیبان‌گیری خودکار روزانه در ساعت ۳ بامداد روی فضای امن انجام و
            ۳۰ نسخه اخیر نگهداری می‌شود. خروجی SQL نیز از طریق خط فرمان قابل دریافت است.
          </div>
        </Panel>

        <Panel title="بازگردانی داده" desc="بارگذاری فایل JSON پشتیبان">
          <div className="rounded-2xl border border-dashed border-line bg-paper/50 p-5 text-center">
            <Upload className="mx-auto h-7 w-7 text-brand" />
            <p className="mt-2 text-xs font-semibold">فایل پشتیبان JSON خودرویار</p>
            <p className="mt-1 text-[10px] text-muted">داده‌های فعلی جایگزین می‌شوند؛ پیش از بازگردانی خروجی بگیرید.</p>
            <label className="btn-outline mt-3 cursor-pointer px-4 py-2 text-[11px]">
              انتخاب فایل پشتیبان
              <input ref={fileRef} type="file" accept="application/json,.json" onChange={onRestore} className="hidden" />
            </label>
          </div>

          <div className="mt-4">
            <label className="flex items-start gap-2 text-[11px] leading-6 text-muted">
              <input type="checkbox" checked={restoreConfirm} onChange={(e) => setRestoreConfirm(e.target.checked)} className="mt-1 h-4 w-4 accent-[#f26b1d]" />
              از بازگردانی داده و جایگزینی نسخه فعلی مطمئن هستم.
            </label>
            <button
              type="button"
              disabled={!restoreConfirm}
              onClick={() => {
                if (window.confirm("همه داده‌ها به حالت نمونه اولیه بازگردانده شود؟")) {
                  admin.resetDemo();
                  flash("داده‌های نمایشی به حالت اولیه بازگشت.");
                }
              }}
              className="btn mt-3 w-full border border-red-200 bg-red-50 text-xs text-red-700 hover:bg-red-100 disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" /> بازنشانی به داده نمونه فاز اول
            </button>
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="مستندات و تحویل پروژه" desc="موارد تحویل قابل دریافت توسط کارفرما">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: FileCheck2, title: "مستند فنی معماری", desc: "ساختار لایه‌ها، جریان داده و تصمیم‌های فنی" },
              { icon: Database, title: "اسکریپت دیتابیس", desc: "مهاجرت‌ها و ساختار جداول PostgreSQL" },
              { icon: KeyRound, title: "راهنمای اپراتور", desc: "آموزش ورود گروهی، راستی‌آزمایی و پشتیبان‌گیری" },
              { icon: ShieldCheck, title: "راهنمای امنیت", desc: "سطوح دسترسی، مدیریت توکن و سیاست نگهداری داده" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-line p-3">
                <item.icon className="h-4 w-4 text-brand" />
                <p className="mt-2 text-[11px] font-bold">{item.title}</p>
                <p className="mt-1 text-[10px] leading-5 text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/proposal" className="btn-dark px-4 py-2.5 text-[11px]">پیشنهاد اجرا و معماری</Link>
            <Link href="/proposal#delivery" className="btn-outline px-4 py-2.5 text-[11px]">شرایط تحویل سورس کد</Link>
          </div>
        </Panel>

        <Panel title="وضعیت امنیت و دسترسی">
          <ul className="space-y-3 text-[11px] leading-6">
            {[
              { label: "احراز هویت اپراتور", value: "فعال (نمایشی)", ok: true },
              { label: "ثبت گزارش فعالیت", value: "فعال", ok: true },
              { label: "توکن یکتای لینک مالک", value: "فعال", ok: true },
              { label: "پشتیبان‌گیری خودکار سرور", value: "در فاز استقرار", ok: false },
              { label: "رمزنگاری اسناد خودرو", value: "در فاز استقرار", ok: false },
            ].map((row) => (
              <li key={row.label} className="flex items-center justify-between rounded-lg bg-paper px-3 py-2">
                <span className="text-muted">{row.label}</span>
                <span className={`font-bold ${row.ok ? "text-emerald-700" : "text-amber-700"}`}>{row.value}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[10px] leading-5 text-amber-800">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            این نسخه بدون دیتابیس و برای نمایش محصول ساخته شده است؛ داده‌ها در مرورگر ذخیره
            می‌شوند. در نسخه عملیاتی، احراز هویت دو مرحله‌ای و رمزنگاری کامل فعال می‌شود.
          </div>
        </Panel>
      </div>
    </div>
  );
}
