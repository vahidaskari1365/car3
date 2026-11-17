"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Info, Upload } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { PageHeader, Panel } from "@/components/admin/AdminUI";
import { categories, cities } from "@/data/catalog";
import { downloadBlob } from "@/lib/useLocalStore";
import { parseCsv, storeImportTemplate } from "@/lib/csv";
import { toFa, todayJalali } from "@/lib/format";
import type { Store, VerificationStatus } from "@/lib/types";

const sample = `name,categoryId,city,district,address,phone,hours,ownerName,status
"تعمیرگاه سپند خودرو",mechanic,تهران,شهرک غرب,بلوار فرحزادی پلاک ۴۵,02188001122,شنبه تا پنجشنبه ۸ تا ۱۸,امیر سپندی,verified
"مرکز سرویس پاژ",oil,مشهد,احمدآباد,خیابان احمدآباد نبش کوچه ۱۲,05138009900,همه روزه ۹ تا ۲۰,سارا پاژ,verified
"فروشگاه قطعات آریا",parts,کرج,مهرشهر,بلوار ارم پلاک ۸۸,02633445566,شنبه تا پنجشنبه ۹ تا ۱۹,آریا کریمی,pending
"تعمیرگاه اشتباه",mechanic,قم,پردیسان,آدرس کوتاه,123,۹ تا ۱۸,,unknown`;

type ParsedStore = { store: Store; errors: string[]; rowNumber: number; rawName: string };

export default function AdminImportPage() {
  const admin = useAdmin();
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null);

  const parsed = useMemo(() => parseCsv(text), [text]);

  const rows: ParsedStore[] = useMemo(() => {
    return parsed.rows.map((row, index) => {
      const errors: string[] = [];
      const name = (row.name ?? "").trim();
      if (name.length < 3) errors.push("نام مرکز نامعتبر است");

      const categoryInput = (row.categoryId ?? "").trim();
      const category =
        categories.find((c) => c.id === categoryInput) ??
        categories.find((c) => c.title === categoryInput || c.short === categoryInput);
      if (!category) errors.push("دسته‌بندی ناشناخته");

      const cityInput = (row.city ?? "").trim();
      const city = cities.find((c) => c.name === cityInput);
      if (!city) errors.push("شهر در فهرست پشتیبانی‌شده نیست");

      const phone = (row.phone ?? "").replace(/\s|-/g, "");
      if (!/^0\d{9,10}$/.test(phone)) errors.push("شماره تماس نامعتبر");

      const statusInput = (row.status ?? "unverified").trim();
      const status: VerificationStatus = ["verified", "pending", "unverified"].includes(statusInput)
        ? (statusInput as VerificationStatus)
        : "unverified";

      const seq = admin.stores.length + index + 1;
      const slug = `store-${seq}-${index + 1}`;

      const store: Store = {
        id: `store-${String(seq).padStart(3, "0")}-${index}`,
        slug,
        name,
        categoryId: category?.id ?? "mechanic",
        brands: (row.brands ?? "ایران‌خودرو، سایپا").split(/،|,/).map((b) => b.trim()).filter(Boolean),
        city: city?.name ?? cityInput,
        district: (row.district ?? "").trim() || "مرکز شهر",
        address: (row.address ?? "").trim() || "آدرس ثبت نشده",
        phone: phone || "0000000000",
        mobile: (row.mobile ?? "").trim(),
        hours: (row.hours ?? "شنبه تا پنجشنبه ۹:۰۰ تا ۱۸:۰۰").trim(),
        lat: Number(row.lat) || 35.7,
        lng: Number(row.lng) || 51.4,
        coverIndex: seq,
        description: (row.description ?? "").trim() || "اطلاعات این مرکز از طریق ورود گروهی ثبت شده و در انتظار تکمیل توضیحات است.",
        services: (row.services ?? "خدمات عمومی خودرو").split(/،|,/).map((s) => s.trim()).filter(Boolean),
        rating: 4.3,
        reviews: 0,
        status,
        lastCheck: status === "verified" ? todayJalali() : null,
        ownerName: (row.ownerName ?? "").trim() || "ثبت نشده",
        verifyToken: `vrf-${slug}-${seq}`,
        featured: false,
        since: (row.since ?? "1400").trim(),
        priceLevel: 2,
        pickup: false,
        onlineBooking: true,
      };

      return { store, errors, rowNumber: index + 2, rawName: name || `ردیف ${index + 2}` };
    });
  }, [parsed.rows, admin.stores.length]);

  const validRows = rows.filter((r) => r.errors.length === 0);
  const invalidRows = rows.filter((r) => r.errors.length > 0);

  function downloadTemplate() {
    downloadBlob("store-import-template.csv", new Blob(["\uFEFF" + storeImportTemplate], { type: "text/csv;charset=utf-8" }));
  }

  function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setText(String(reader.result ?? ""));
      setResult(null);
    };
    reader.readAsText(file);
  }

  function doImport() {
    if (validRows.length === 0) return;
    admin.importStores(validRows.map((r) => r.store));
    setResult({ imported: validRows.length, skipped: invalidRows.length });
    setText("");
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="ورود گروهی اطلاعات از Excel و CSV"
        desc="فایل CSV را بارگذاری یا محتوای آن را جای‌گذاری کنید. داده‌ها پیش از ثبت اعتبارسنجی و پیش‌نمایش می‌شوند."
      >
        <button type="button" onClick={downloadTemplate} className="btn-outline px-4 py-2.5">
          <Download className="h-4 w-4" /> دانلود قالب CSV
        </button>
      </PageHeader>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <Panel title="۱. بارگذاری فایل یا جای‌گذاری داده" desc="فرمت‌های CSV و فایل متنی؛ برای xlsx ابتدا «ذخیره به‌صورت CSV» کنید">
            <div className="rounded-2xl border border-dashed border-line bg-paper/60 p-5 text-center">
              <FileSpreadsheet className="mx-auto h-8 w-8 text-brand" />
              <p className="mt-2 text-xs font-semibold">فایل CSV خود را انتخاب کنید</p>
              <p className="mt-1 text-[10px] text-muted">ستون‌های ضروری: name, categoryId, city, address, phone</p>
              <label className="btn-primary mt-3 cursor-pointer px-4 py-2 text-[11px]">
                <Upload className="h-3.5 w-3.5" />
                انتخاب فایل
                <input type="file" accept=".csv,text/csv,text/plain" onChange={onFile} className="hidden" />
              </label>
            </div>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setResult(null);
              }}
              dir="ltr"
              placeholder="name,categoryId,city,district,address,phone,hours,ownerName,status"
              className="input mt-3 min-h-44 resize-y font-mono text-[11px]"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <button type="button" onClick={() => setText(sample)} className="text-[11px] font-bold text-brand-dark">
                درج داده نمونه (۴ ردیف)
              </button>
              <button type="button" onClick={() => { setText(""); setResult(null); }} className="text-[11px] text-muted hover:text-ink">
                پاک کردن
              </button>
            </div>
          </Panel>

          {parsed.rows.length > 0 && (
            <Panel
              title={`۲. پیش‌نمایش و اعتبارسنجی (${toFa(parsed.rows.length)} ردیف)`}
              desc={`${toFa(validRows.length)} ردیف معتبر و ${toFa(invalidRows.length)} ردیف دارای خطا`}
              action={
                <button type="button" onClick={doImport} disabled={validRows.length === 0} className="btn-primary px-3 py-2 text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> ثبت {toFa(validRows.length)} ردیف معتبر
                </button>
              }
            >
              <div className="overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>ردیف</th>
                      <th>نام</th>
                      <th>دسته</th>
                      <th>شهر / منطقه</th>
                      <th>تلفن</th>
                      <th>وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.rowNumber} className={row.errors.length ? "bg-red-50/40" : ""}>
                        <td className="text-[10px] text-muted">{toFa(row.rowNumber)}</td>
                        <td className="max-w-[180px] truncate text-[11px] font-semibold">{row.rawName}</td>
                        <td className="text-[10px]">{categories.find((c) => c.id === row.store.categoryId)?.short ?? "—"}</td>
                        <td className="text-[10px]">{row.store.city} / {row.store.district}</td>
                        <td className="text-[10px]" dir="ltr">{toFa(row.store.phone)}</td>
                        <td>
                          {row.errors.length === 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                              <CheckCircle2 className="h-3 w-3" /> آماده ثبت
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700">
                              <AlertTriangle className="h-3 w-3" /> {row.errors.join(" • ")}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}

          {result && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900">
              <p className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                {toFa(result.imported)} فروشگاه با موفقیت وارد دیتابیس مرکزی شد.
              </p>
              <p className="mt-1 text-[11px] text-emerald-800/80">
                {toFa(result.skipped)} ردیف نامعتبر نادیده گرفته شد. برای هر فروشگاه لینک اختصاصی مالک تولید شده است.
              </p>
              <div className="mt-3 flex gap-2">
                <Link href="/admin/stores" className="btn-primary px-3 py-2 text-[11px]">مشاهده فروشگاه‌ها</Link>
                <Link href="/admin/verifications" className="btn-outline px-3 py-2 text-[11px]">صف راستی‌آزمایی</Link>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <Panel title="راهنمای ستون‌ها">
            <ul className="space-y-2 text-[11px] leading-6 text-muted">
              {[
                ["name", "نام مرکز خدمات (الزامی)"],
                ["categoryId", "mechanic, oil, body, tire, electrical, parts, wash, inspection, glass, towing"],
                ["city", "نام شهر از فهرست پشتیبانی‌شده"],
                ["district", "منطقه یا محله"],
                ["address", "آدرس کامل (الزامی)"],
                ["phone", "شماره تماس با ۰ (الزامی)"],
                ["hours", "ساعات کاری"],
                ["ownerName", "نام مالک یا مدیر"],
                ["status", "verified / pending / unverified"],
              ].map(([key, desc]) => (
                <li key={key} className="rounded-lg bg-paper px-2.5 py-2">
                  <span className="font-mono text-[10px] font-bold text-brand-dark" dir="ltr">{key}</span>
                  <p className="mt-0.5 text-[10px] leading-5">{desc}</p>
                </li>
              ))}
            </ul>
          </Panel>

          <div className="rounded-2xl border border-dashed border-line bg-white p-4 text-[11px] leading-6 text-muted">
            <p className="mb-1.5 flex items-center gap-1.5 font-bold text-ink">
              <Info className="h-4 w-4 text-brand" /> نکات مهم
            </p>
            ردیف‌های تکراری بر اساس نام و شماره تماس شناسایی می‌شوند. پس از ورود، برای هر فروشگاه
            توکن لینک اختصاصی مالک تولید می‌شود. داده نمونه را می‌توانید دانلود و تکمیل کنید.
          </div>
        </aside>
      </div>
    </div>
  );
}
