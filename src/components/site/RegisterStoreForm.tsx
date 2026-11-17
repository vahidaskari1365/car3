"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ClipboardCheck, Link2, Phone, ShieldCheck, Store } from "lucide-react";
import { categories, cities } from "@/data/catalog";
import { randomId, todayJalali } from "@/lib/format";
import { useLocalStore } from "@/lib/useLocalStore";

type Registration = {
  id: string;
  name: string;
  categoryId: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  ownerName: string;
  hours: string;
  note: string;
  createdAt: string;
  token: string;
  status: "new" | "contacted" | "published";
};

const initialForm = {
  name: "",
  categoryId: "mechanic",
  city: "تهران",
  district: "",
  address: "",
  phone: "",
  ownerName: "",
  hours: "شنبه تا پنجشنبه ۹:۰۰ تا ۱۸:۰۰",
  note: "",
};

export function RegisterStoreForm() {
  const { value: registrations, setValue: setRegistrations, ready } = useLocalStore<Registration[]>("registrations", []);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Registration | null>(null);

  const districts = cities.find((c) => c.name === form.city)?.districts ?? [];

  function update(key: keyof typeof initialForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (form.name.trim().length < 3) nextErrors.name = "نام فروشگاه را کامل وارد کنید.";
    if (form.ownerName.trim().length < 3) nextErrors.ownerName = "نام مالک یا مدیر الزامی است.";
    if (!/^0\d{10}$/.test(form.phone.replace(/\s|-/g, ""))) nextErrors.phone = "شماره تماس ۱۱ رقمی معتبر وارد کنید.";
    if (form.address.trim().length < 10) nextErrors.address = "آدرس دقیق‌تری وارد کنید.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const registration: Registration = {
      id: randomId("reg"),
      ...form,
      phone: form.phone.replace(/\s|-/g, ""),
      createdAt: todayJalali(),
      token: `reg-${Date.now().toString(36)}`,
      status: "new",
    };
    setRegistrations((prev) => [registration, ...prev]);
    setSubmitted(registration);
  }

  if (submitted) {
    return (
      <div className="container-x py-14">
        <div className="mx-auto max-w-2xl">
          <div className="card-surface overflow-hidden">
            <div className="bg-emerald-50 p-6 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-verified shadow-card">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <h1 className="mt-4 text-xl font-extrabold text-emerald-900">درخواست شما ثبت شد</h1>
              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-emerald-800/80">
                شماره پیگیری <span className="font-bold">{submitted.token}</span> — کارشناس خودرویار
                حداکثر تا ۲ روز کاری برای راستی‌آزمایی تلفنی با شماره {submitted.phone} تماس می‌گیرد.
              </p>
            </div>
            <div className="p-6">
              <h2 className="text-sm font-bold">مراحل بعدی</h2>
              <ol className="mt-3 space-y-3 text-xs text-muted">
                {[
                  "بررسی اولیه اطلاعات و تماس تلفنی با مدیر فروشگاه",
                  "ارسال لینک اختصاصی برای تکمیل و اصلاح اطلاعات",
                  "تأیید نهایی اپراتور و انتشار عمومی صفحه فروشگاه",
                ].map((step, index) => (
                  <li key={step} className="flex items-start gap-2">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft text-[10px] font-bold text-brand-dark">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <div className="mt-5 rounded-xl bg-paper p-3 text-[11px] leading-6 text-muted">
                این نسخه نمایشی، داده‌ها را در مرورگر شما ذخیره می‌کند؛ در نسخه نهایی، درخواست‌ها
                مستقیماً در دیتابیس مرکزی و صف بررسی اپراتور ثبت می‌شوند.
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/stores" className="btn-primary">مشاهده مراکز خدمات</Link>
                <Link href="/admin/stores" className="btn-outline">مشاهده در پنل مدیریت</Link>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    setSubmitted(null);
                    setForm(initialForm);
                  }}
                >
                  ثبت درخواست دیگر
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10">
      <nav className="mb-3 flex items-center gap-1.5 text-[11px] text-muted">
        <Link href="/" className="hover:text-brand-dark">خانه</Link>
        <span>/</span>
        <span className="font-semibold text-ink">ثبت فروشگاه</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <span className="chip border-brand/20 bg-brand-soft text-brand-dark">
            <Store className="h-3.5 w-3.5" />
            ثبت اطلاعات فروشگاه
          </span>
          <h1 className="mt-4 text-2xl font-extrabold leading-[1.5] sm:text-[32px]">
            مرکز خدمات خود را به خودرویار اضافه کنید
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-8 text-muted">
            اطلاعات پایه را وارد کنید؛ پس از تماس تلفنی، لینک اختصاصی تکمیل اطلاعات برای شما
            ارسال می‌شود. پس از تأیید اپراتور، صفحه اختصاصی فروشگاه شما با نشان تأیید منتشر می‌شود.
          </p>

          <form onSubmit={submit} className="card-surface mt-6 p-5 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="name">نام فروشگاه / مرکز خدمات *</label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="input"
                  placeholder="مثلاً تعمیرگاه تخصصی پارس‌آوران"
                />
                {errors.name && <p className="mt-1 text-[11px] text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="label" htmlFor="categoryId">دسته‌بندی خدمات *</label>
                <select id="categoryId" value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)} className="input">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" htmlFor="ownerName">نام مالک / مدیر *</label>
                <input
                  id="ownerName"
                  value={form.ownerName}
                  onChange={(e) => update("ownerName", e.target.value)}
                  className="input"
                  placeholder="نام و نام خانوادگی"
                />
                {errors.ownerName && <p className="mt-1 text-[11px] text-red-600">{errors.ownerName}</p>}
              </div>

              <div>
                <label className="label" htmlFor="city">شهر *</label>
                <select
                  id="city"
                  value={form.city}
                  onChange={(e) => {
                    update("city", e.target.value);
                    update("district", "");
                  }}
                  className="input"
                >
                  {cities.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" htmlFor="district">منطقه / محله *</label>
                <input
                  id="district"
                  value={form.district}
                  onChange={(e) => update("district", e.target.value)}
                  className="input"
                  list="districts"
                  placeholder="منطقه را وارد کنید"
                />
                <datalist id="districts">
                  {districts.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </div>

              <div className="sm:col-span-2">
                <label className="label" htmlFor="address">آدرس دقیق *</label>
                <textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  className="input min-h-24 resize-none"
                  placeholder="خیابان، کوچه، پلاک و واحد"
                />
                {errors.address && <p className="mt-1 text-[11px] text-red-600">{errors.address}</p>}
              </div>

              <div>
                <label className="label" htmlFor="phone">شماره تماس ثابت یا موبایل *</label>
                <input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="input"
                  placeholder="02122334455"
                  inputMode="tel"
                  dir="ltr"
                />
                {errors.phone && <p className="mt-1 text-[11px] text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="label" htmlFor="hours">ساعات کاری</label>
                <input
                  id="hours"
                  value={form.hours}
                  onChange={(e) => update("hours", e.target.value)}
                  className="input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="label" htmlFor="note">توضیحات و خدمات (اختیاری)</label>
                <textarea
                  id="note"
                  value={form.note}
                  onChange={(e) => update("note", e.target.value)}
                  className="input min-h-20 resize-none"
                  placeholder="خدمات اصلی، برندهای تحت پوشش و امکانات مرکز"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <p className="flex items-center gap-1.5 text-[11px] text-muted">
                <ShieldCheck className="h-4 w-4 text-verified" />
                اطلاعات شما فقط برای راستی‌آزمایی استفاده می‌شود.
              </p>
              <button type="submit" className="btn-primary" disabled={!ready}>
                ارسال درخواست ثبت
              </button>
            </div>

            {registrations.length > 0 && (
              <p className="mt-3 text-[11px] text-muted">
                {ready ? `شما ${registrations.length} درخواست ثبت‌شده در این مرورگر دارید.` : "در حال بارگذاری…"}
              </p>
            )}
          </form>
        </div>

        <aside className="space-y-4">
          {[
            {
              icon: ClipboardCheck,
              title: "بررسی اپراتور",
              desc: "اطلاعات شما در صف بررسی قرار می‌گیرد و تماس تلفنی انجام می‌شود.",
            },
            {
              icon: Link2,
              title: "لینک اختصاصی",
              desc: "لینک امن برای اصلاح اطلاعات دریافت می‌کنید؛ بدون نیاز به ثبت‌نام.",
            },
            {
              icon: CheckCircle2,
              title: "انتشار با نشان تأیید",
              desc: "پس از تأیید نهایی، صفحه فروشگاه با نشان تأیید و تاریخ بازرسی منتشر می‌شود.",
            },
            {
              icon: Phone,
              title: "پشتیبانی ثبت",
              desc: "در صورت نیاز به کمک، با شماره ۰۲۱-۹۱۰۰۰۰۰۰ تماس بگیرید.",
            },
          ].map((item) => (
            <div key={item.title} className="card-surface p-4">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand-dark">
                <item.icon className="h-4 w-4" />
              </span>
              <h2 className="mt-2.5 text-xs font-bold">{item.title}</h2>
              <p className="mt-1 text-[11px] leading-6 text-muted">{item.desc}</p>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
