"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  Link2,
  Lock,
  PencilLine,
  Phone,
  ShieldCheck,
  Store as StoreIcon,
} from "lucide-react";
import { categories } from "@/data/catalog";
import { seedStores } from "@/data/stores";
import { readLocal, useLocalStore, writeLocal } from "@/lib/useLocalStore";
import { randomId, todayJalali } from "@/lib/format";
import type { ChangeRequest, Store } from "@/lib/types";

type Props = { token: string };

export function VerifyOwnerClient({ token }: Props) {
  const rawToken = token;
  const storesState = useLocalStore<Store[]>("stores", seedStores);

  if (!storesState.ready) {
    return (
      <div className="container-x py-20">
        <div className="mx-auto h-64 max-w-2xl animate-pulse rounded-3xl bg-white" />
      </div>
    );
  }

  const store =
    storesState.value.find((s) => s.verifyToken === rawToken) ??
    seedStores.find((s) => s.verifyToken === rawToken) ??
    null;

  if (!store) {
    return (
      <div className="container-x py-16">
        <div className="card-surface mx-auto max-w-xl p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-extrabold">لینک راستی‌آزمایی معتبر نیست</h1>
          <p className="mt-2 text-sm leading-7 text-muted">
            این لینک منقضی شده یا وجود ندارد. برای دریافت لینک جدید با پشتیبانی خودرویار تماس بگیرید.
          </p>
          <div className="mt-5 rounded-xl bg-paper p-3 text-right text-[11px] text-muted">
            <p className="mb-2 font-bold text-ink-soft">لینک‌های نمونه برای آزمون:</p>
            <ul className="space-y-1">
              {seedStores.filter((s) => s.status !== "verified").slice(0, 3).map((s) => (
                <li key={s.id}>
                  <Link href={`/verify/${s.verifyToken}`} className="text-brand-dark underline">
                    {s.name} — {s.verifyToken}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/" className="btn-primary mt-5">بازگشت به صفحه اصلی</Link>
        </div>
      </div>
    );
  }

  return <VerifyForm key={store.id} store={store} />;
}

function VerifyForm({ store }: { store: Store }) {
  const [form, setForm] = useState(() => ({
    ownerName: store.ownerName,
    phone: store.phone,
    mobile: store.mobile,
    hours: store.hours,
    address: store.address,
    district: store.district,
    description: store.description,
    services: store.services.join("، "),
  }));
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const category = categories.find((c) => c.id === store.categoryId);

  function copyLink() {
    if (typeof window === "undefined") return;
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^0\d{10}$/.test(form.phone.replace(/\s|-/g, ""))) {
      setError("شماره تماس معتبر ۱۱ رقمی وارد کنید.");
      return;
    }
    if (form.address.trim().length < 10) {
      setError("آدرس دقیق‌تری وارد کنید.");
      return;
    }
    setError("");

    const request: ChangeRequest = {
      id: randomId("cr"),
      storeId: store.id,
      storeName: store.name,
      submittedAt: todayJalali(),
      channel: "لینک اختصاصی",
      summary: "اصلاح مشخصات تماس، آدرس و خدمات توسط مالک فروشگاه",
      status: "pending",
      payload: {
        ownerName: form.ownerName,
        phone: form.phone.replace(/\s|-/g, ""),
        mobile: form.mobile,
        hours: form.hours,
        address: form.address,
        district: form.district,
        description: form.description,
        services: form.services.split(/،|,/).map((item) => item.trim()).filter(Boolean),
      },
    };

    const existing = readLocal<ChangeRequest[]>("changeRequests", []);
    writeLocal("changeRequests", [request, ...existing.filter((r) => r.storeId !== store.id || r.status !== "pending")]);

    const stores = readLocal<Store[]>("stores", seedStores);
    writeLocal("stores", stores.map((s) => (s.id === store.id ? { ...s, status: "pending", lastCheck: todayJalali() } : s)));

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="container-x py-16">
        <div className="card-surface mx-auto max-w-2xl overflow-hidden">
          <div className="bg-emerald-50 p-7 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-verified shadow-card">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h1 className="mt-4 text-xl font-extrabold text-emerald-900">تغییرات برای تأیید ارسال شد</h1>
            <p className="mx-auto mt-2 max-w-md text-xs leading-7 text-emerald-800/80">
              اطلاعات اصلاح‌شده {store.name} در صف بازبینی اپراتور قرار گرفت. پس از تأیید نهایی،
              اطلاعات جدید روی صفحه عمومی فروشگاه نمایش داده می‌شود.
            </p>
          </div>
          <div className="space-y-3 p-6 text-xs text-muted">
            {[
              "شماره پیگیری درخواست در پنل مدیریت قابل مشاهده است.",
              "در صورت نیاز به اصلاح مجدد، همین لینک تا ۷ روز فعال می‌ماند.",
              "پس از تأیید، تاریخ آخرین بازرسی به‌روزرسانی و نشان تأیید نمایش داده می‌شود.",
            ].map((text) => (
              <p key={text} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-verified" />
                {text}
              </p>
            ))}
            <div className="flex flex-wrap gap-2 pt-3">
              <Link href={`/stores/${store.slug}`} className="btn-primary">مشاهده صفحه فروشگاه</Link>
              <Link href="/admin/verifications" className="btn-outline">صف بررسی اپراتور</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10">
      <div className="grid gap-7 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="chip border-emerald-200 bg-emerald-50 text-emerald-700">
              <Lock className="h-3.5 w-3.5" />
              لینک امن اختصاصی مالک
            </span>
            <span className="chip">
              <Clock className="h-3.5 w-3.5" />
              اعتبار لینک: ۷ روز
            </span>
            <button type="button" onClick={copyLink} className="chip hover:border-brand/40">
              <Copy className="h-3.5 w-3.5" />
              {copied ? "کپی شد" : "کپی لینک"}
            </button>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold leading-[1.5] sm:text-[32px]">
            بازبینی اطلاعات {store.name}
          </h1>
          <p className="mt-2 text-sm leading-8 text-muted">
            لطفاً اطلاعات زیر را بررسی و در صورت نیاز اصلاح کنید. تغییرات پس از تأیید اپراتور
            روی صفحه عمومی فروشگاه اعمال می‌شود.
          </p>

          <form onSubmit={submit} className="card-surface mt-6 p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-paper p-3">
              <StoreIcon className="h-4 w-4 text-brand" />
              <div className="text-[11px]">
                <p className="font-bold">{store.name}</p>
                <p className="text-muted">
                  {category?.title} • {store.city}، {store.district} • کد پرونده {store.id.replace(/\D/g, "")}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="ownerName">نام مالک / مدیر</label>
                <input id="ownerName" className="input" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="district">منطقه / محله</label>
                <input id="district" className="input" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="phone">شماره تماس ثابت *</label>
                <input id="phone" className="input" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="mobile">شماره موبایل</label>
                <input id="mobile" className="input" dir="ltr" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="address">آدرس دقیق *</label>
                <textarea id="address" className="input min-h-20 resize-none" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="hours">ساعات کاری</label>
                <input id="hours" className="input" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="services">خدمات (با ویرگول جدا کنید)</label>
                <input id="services" className="input" value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="description">توضیحات معرفی</label>
                <textarea id="description" className="input min-h-24 resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>

            {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-700">{error}</p>}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <p className="flex items-center gap-1.5 text-[11px] text-muted">
                <ShieldCheck className="h-4 w-4 text-verified" />
                ارسال شما به‌صورت درخواست تغییر ثبت می‌شود و بلافاصله منتشر نمی‌شود.
              </p>
              <button type="submit" className="btn-primary">
                <PencilLine className="h-4 w-4" />
                ارسال برای تأیید اپراتور
              </button>
            </div>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-line bg-white p-5">
            <Link2 className="h-5 w-5 text-brand" />
            <h2 className="mt-2 text-sm font-bold">این لینک چطور کار می‌کند؟</h2>
            <ol className="mt-3 space-y-3 text-[11px] leading-6 text-muted">
              <li>۱. اپراتور با شما تماس می‌گیرد و این لینک را ارسال می‌کند.</li>
              <li>۲. شما اطلاعات را بازبینی و اصلاح می‌کنید.</li>
              <li>۳. تغییرات در صف بررسی قرار می‌گیرد.</li>
              <li>۴. پس از تأیید، صفحه فروشگاه با اطلاعات جدید منتشر می‌شود.</li>
            </ol>
          </div>
          <div className="rounded-3xl border border-dashed border-brand/30 bg-brand-soft p-5">
            <h2 className="text-sm font-bold text-brand-dark">وضعیت فعلی اطلاعات</h2>
            <p className="mt-2 text-[11px] leading-6 text-ink-soft">
              وضعیت: {store.status === "verified" ? "تأییدشده" : store.status === "pending" ? "در حال بررسی" : "تأیید نشده"}
              <br />
              آخرین بررسی: {store.lastCheck ?? "انجام نشده"}
            </p>
          </div>
          <div className="card-surface flex items-center gap-3 p-4">
            <Phone className="h-4 w-4 text-brand" />
            <p className="text-[11px] text-muted">
              نیاز به راهنمایی دارید؟ <a href="tel:02191000000" className="font-bold text-ink" dir="ltr">021-91000000</a>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
