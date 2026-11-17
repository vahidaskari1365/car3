"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Clock,
  Download,
  ExternalLink,
  Link2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Store as StoreIcon,
  Trash2,
  Upload,
} from "lucide-react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Modal, PageHeader, Panel } from "@/components/admin/AdminUI";
import { brands, categories, cities, verificationLabels } from "@/data/catalog";
import { storeCover } from "@/data/images";
import { downloadBlob } from "@/lib/useLocalStore";
import { toCsv } from "@/lib/csv";
import { num, toFa, todayJalali } from "@/lib/format";
import type { CategoryId, Store, VerificationStatus } from "@/lib/types";

const blankForm = {
  name: "",
  categoryId: "mechanic" as CategoryId,
  city: "تهران",
  district: "",
  address: "",
  phone: "",
  mobile: "",
  ownerName: "",
  hours: "شنبه تا پنجشنبه ۹:۰۰ تا ۱۸:۰۰",
  description: "",
  status: "unverified" as VerificationStatus,
  servicesText: "",
  brandsText: "",
  featured: false,
  lat: 35.7,
  lng: 51.4,
};

export default function AdminStoresPage() {
  const admin = useAdmin();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<VerificationStatus | "">("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [editing, setEditing] = useState<Store | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [formError, setFormError] = useState("");
  const [copied, setCopied] = useState("");

  const filtered = useMemo(() => {
    return admin.stores.filter((store) => {
      if (status && store.status !== status) return false;
      if (category && store.categoryId !== category) return false;
      if (city && store.city !== city) return false;
      if (!query.trim()) return true;
      const haystack = `${store.name} ${store.city} ${store.district} ${store.address} ${store.ownerName} ${store.phone}`;
      return haystack.includes(query.trim());
    });
  }, [admin.stores, query, status, category, city]);

  function openCreate() {
    setEditing(null);
    setForm(blankForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(store: Store) {
    setEditing(store);
    setForm({
      name: store.name,
      categoryId: store.categoryId,
      city: store.city,
      district: store.district,
      address: store.address,
      phone: store.phone,
      mobile: store.mobile,
      ownerName: store.ownerName,
      hours: store.hours,
      description: store.description,
      status: store.status,
      servicesText: store.services.join("، "),
      brandsText: store.brands.join("، "),
      featured: store.featured,
      lat: store.lat,
      lng: store.lng,
    });
    setFormError("");
    setModalOpen(true);
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    if (form.name.trim().length < 3) return setFormError("نام فروشگاه الزامی است.");
    if (!/^0\d{9,10}$/.test(form.phone.replace(/\s|-/g, ""))) return setFormError("شماره تماس معتبر وارد کنید (با ۰ شروع شود).");
    if (form.address.trim().length < 10) return setFormError("آدرس کامل‌تری وارد کنید.");

    const services = form.servicesText.split(/،|,/).map((s) => s.trim()).filter(Boolean);
    const brandsList = form.brandsText.split(/،|,/).map((s) => s.trim()).filter(Boolean);

    if (editing) {
      admin.updateStore(editing.id, {
        ...form,
        services,
        brands: brandsList.length ? brandsList : brands.slice(0, 2),
        lastCheck: form.status === editing.status ? editing.lastCheck : form.status === "verified" ? todayJalali() : editing.lastCheck,
      });
    } else {
      const draft = admin.newStoreDraft();
      admin.addStore({
        ...draft,
        ...form,
        services,
        brands: brandsList.length ? brandsList : brands.slice(0, 2),
        lastCheck: form.status === "verified" ? todayJalali() : null,
      });
    }
    setModalOpen(false);
  }

  function remove(store: Store) {
    if (window.confirm(`حذف «${store.name}» قطعی است. ادامه می‌دهید؟`)) admin.deleteStore(store.id);
  }

  function exportCsv() {
    const csv = toCsv(
      ["id", "name", "categoryId", "city", "district", "address", "phone", "ownerName", "status", "lastCheck", "verifyToken"],
      filtered.map((s) => [s.id, s.name, s.categoryId, s.city, s.district, s.address, s.phone, s.ownerName, s.status, s.lastCheck ?? "", s.verifyToken]),
    );
    downloadBlob("stores-export.csv", new Blob([csv], { type: "text/csv;charset=utf-8" }));
  }

  async function copyLink(token: string) {
    const url = `${window.location.origin}/verify/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(token);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      window.prompt("لینک اختصاصی مالک:", url);
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="مدیریت فروشگاه‌ها و مراکز خدمات"
        desc={`${toFa(admin.stores.length)} مرکز در دیتابیس مرکزی. جستجو، ویرایش، تغییر وضعیت تأیید و ساخت لینک اختصاصی مالک.`}
      >
        <button type="button" onClick={exportCsv} className="btn-outline px-4 py-2.5">
          <Download className="h-4 w-4" /> خروجی CSV
        </button>
        <Link href="/admin/import" className="btn-outline px-4 py-2.5">
          <Upload className="h-4 w-4" /> ورود گروهی
        </Link>
        <button type="button" onClick={openCreate} className="btn-primary px-4 py-2.5">
          <Plus className="h-4 w-4" /> افزودن فروشگاه
        </button>
      </PageHeader>

      <div className="card-surface flex flex-col gap-2 p-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو بر اساس نام، شهر، مالک یا شماره تماس…"
            className="input py-2.5 pr-9"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as VerificationStatus | "")} className="input w-auto py-2.5">
          <option value="">همه وضعیت‌ها</option>
          <option value="verified">تأییدشده</option>
          <option value="pending">در حال بررسی</option>
          <option value="unverified">تأیید نشده</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input w-auto py-2.5">
          <option value="">همه دسته‌ها</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.short}</option>
          ))}
        </select>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="input w-auto py-2.5">
          <option value="">همه شهرها</option>
          {cities.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <Panel
        title={`فهرست مراکز (${toFa(filtered.length)})`}
        desc="تغییر وضعیت، ویرایش اطلاعات و لینک اختصاصی بازبینی مالک"
        action={
          <button
            type="button"
            onClick={() => {
              if (window.confirm("وضعیت همه پرونده‌های در حال بررسی تأیید شود؟")) {
                admin.stores.filter((s) => s.status === "pending").forEach((s) => admin.updateStore(s.id, { status: "verified", lastCheck: todayJalali() }));
              }
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100"
          >
            <BadgeCheck className="h-3.5 w-3.5" /> تأیید گروهی در انتظارها
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>مرکز</th>
                <th>دسته / شهر</th>
                <th>تماس</th>
                <th>وضعیت</th>
                <th>آخرین بررسی</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((store) => (
                <tr key={store.id} className="hover:bg-paper/50">
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                        <Image src={storeCover(store.coverIndex)} alt={store.name} fill sizes="40px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-[190px] truncate text-[11px] font-bold">{store.name}</p>
                        <p className="mt-0.5 text-[9px] text-muted">مالک: {store.ownerName || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="text-[11px]">{categories.find((c) => c.id === store.categoryId)?.short}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[9px] text-muted">
                      <MapPin className="h-3 w-3" /> {store.city}، {store.district}
                    </p>
                  </td>
                  <td className="text-[11px]" dir="ltr">{toFa(store.phone)}</td>
                  <td>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ring-1 ring-inset ${verificationLabels[store.status].className}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${verificationLabels[store.status].dot}`} />
                      {verificationLabels[store.status].title}
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-[10px] text-muted">{store.lastCheck ?? "—"}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => openEdit(store)} aria-label="ویرایش" className="rounded-md p-1.5 text-muted hover:bg-paper hover:text-brand-dark">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => copyLink(store.verifyToken)}
                        aria-label="لینک اختصاصی مالک"
                        className="rounded-md p-1.5 text-muted hover:bg-paper hover:text-teal"
                      >
                        <Link2 className="h-3.5 w-3.5" />
                      </button>
                      <Link href={`/stores/${store.slug}`} aria-label="مشاهده صفحه" className="rounded-md p-1.5 text-muted hover:bg-paper hover:text-ink">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => admin.updateStore(store.id, { status: "verified", lastCheck: todayJalali() })}
                        aria-label="تأیید"
                        className="rounded-md p-1.5 text-muted hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <BadgeCheck className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => remove(store)} aria-label="حذف" className="rounded-md p-1.5 text-muted hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {copied === store.verifyToken && (
                      <span className="mt-1 block text-[9px] font-bold text-emerald-600">لینک کپی شد</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-xs text-muted">
                    مرکزی با این فیلترها یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "تأییدشده", value: admin.stores.filter((s) => s.status === "verified").length, icon: BadgeCheck, tone: "bg-emerald-50 text-emerald-700" },
          { label: "در بررسی", value: admin.stores.filter((s) => s.status === "pending").length, icon: Clock, tone: "bg-amber-50 text-amber-700" },
          { label: "بدون تأیید", value: admin.stores.filter((s) => s.status === "unverified").length, icon: StoreIcon, tone: "bg-paper text-muted" },
        ].map((item) => (
          <div key={item.label} className="card-surface flex items-center gap-3 p-4">
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${item.tone}`}>
              <item.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-lg font-extrabold">{num(item.value)}</p>
              <p className="text-[10px] text-muted">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `ویرایش ${editing.name}` : "افزودن فروشگاه جدید"}
        desc="اطلاعات در دیتابیس مرکزی ذخیره و بلافاصله در سایت اعمال می‌شود."
        wide
      >
        <form onSubmit={save}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="f-name">نام مرکز *</label>
              <input id="f-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="f-category">دسته‌بندی</label>
              <select id="f-category" className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value as CategoryId })}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="f-status">وضعیت تأیید</label>
              <select id="f-status" className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as VerificationStatus })}>
                <option value="verified">تأییدشده</option>
                <option value="pending">در حال بررسی</option>
                <option value="unverified">تأیید نشده</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="f-city">شهر</label>
              <select id="f-city" className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                {cities.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="f-district">منطقه</label>
              <input id="f-district" className="input" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="f-address">آدرس *</label>
              <input id="f-address" className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="f-phone">تلفن ثابت *</label>
              <input id="f-phone" className="input" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="f-mobile">موبایل</label>
              <input id="f-mobile" className="input" dir="ltr" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="f-owner">نام مالک / مدیر</label>
              <input id="f-owner" className="input" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="f-hours">ساعات کاری</label>
              <input id="f-hours" className="input" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="f-services">خدمات (با ویرگول جدا شود)</label>
              <input id="f-services" className="input" value={form.servicesText} onChange={(e) => setForm({ ...form, servicesText: e.target.value })} placeholder="دیاگ، تعویض روغن، تنظیم فرمان" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="f-brands">برندهای تحت پوشش</label>
              <input id="f-brands" className="input" value={form.brandsText} onChange={(e) => setForm({ ...form, brandsText: e.target.value })} placeholder="ایران‌خودرو، سایپا، چری" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="f-desc">توضیحات</label>
              <textarea id="f-desc" className="input min-h-20 resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="f-lat">عرض جغرافیایی</label>
              <input id="f-lat" type="number" step="0.0001" className="input" dir="ltr" value={form.lat} onChange={(e) => setForm({ ...form, lat: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label" htmlFor="f-lng">طول جغرافیایی</label>
              <input id="f-lng" type="number" step="0.0001" className="input" dir="ltr" value={form.lng} onChange={(e) => setForm({ ...form, lng: Number(e.target.value) })} />
            </div>
            <label className="flex items-center gap-2 text-[11px] sm:col-span-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 accent-[#f26b1d]" />
              نمایش در بخش «پیشنهاد خودرویار» صفحه اصلی
            </label>
          </div>

          {formError && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-700">{formError}</p>}

          <div className="mt-4 flex justify-end gap-2 border-t border-line pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline py-2.5">انصراف</button>
            <button type="submit" className="btn-primary py-2.5">{editing ? "ذخیره تغییرات" : "ثبت فروشگاه"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
