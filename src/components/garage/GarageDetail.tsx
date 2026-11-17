"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Droplet,
  ExternalLink,
  FileImage,
  FileText,
  Fuel,
  Gauge,
  Info,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  Wallet,
  Wrench,
} from "lucide-react";
import { useGarage } from "@/lib/garage";
import { consumption, num, toFa, toman, todayJalali } from "@/lib/format";
import { serviceTypes } from "@/data/catalog";
import type { DocumentRecord } from "@/lib/types";

const tabs = [
  { key: "overview", label: "نمای کلی" },
  { key: "service", label: "سوابق سرویس" },
  { key: "fuel", label: "سوخت‌گیری" },
  { key: "docs", label: "مدارک و فاکتور" },
  { key: "specs", label: "مشخصات خودرو" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const blankService = {
  date: "",
  mileage: 0,
  cost: 0,
  type: serviceTypes[0],
  provider: "",
  note: "",
  nextMileage: 0,
};

const blankFuel = {
  date: "",
  mileage: 0,
  liters: 0,
  cost: 0,
  station: "",
  fullTank: true,
};

export function GarageDetail() {
  const params = useParams<{ id: string }>();
  const garage = useGarage();
  const [tab, setTab] = useState<TabKey>("overview");
  const [serviceForm, setServiceForm] = useState(blankService);
  const [fuelForm, setFuelForm] = useState(blankFuel);
  const [docForm, setDocForm] = useState<{ title: string; kind: DocumentRecord["kind"]; dataUrl: string; size: number }>({
    title: "",
    kind: "فاکتور",
    dataUrl: "",
    size: 0,
  });
  const [docError, setDocError] = useState("");
  const [notice, setNotice] = useState("");
  const [editMileage, setEditMileage] = useState(false);
  const [mileageDraft, setMileageDraft] = useState(0);

  const vehicle = garage.vehicles.find((v) => v.id === params.id);

  const vehicleServices = useMemo(
    () => garage.services.filter((s) => s.vehicleId === params.id).sort((a, b) => b.mileage - a.mileage),
    [garage.services, params.id],
  );
  const vehicleFuels = useMemo(
    () => garage.fuels.filter((f) => f.vehicleId === params.id).sort((a, b) => b.mileage - a.mileage),
    [garage.fuels, params.id],
  );
  const vehicleDocs = useMemo(
    () => garage.documents.filter((d) => d.vehicleId === params.id),
    [garage.documents, params.id],
  );

  const fuelStats = useMemo(() => {
    const ascending = [...vehicleFuels].sort((a, b) => a.mileage - b.mileage);
    const totalLiters = ascending.reduce((sum, f) => sum + f.liters, 0);
    const totalCost = ascending.reduce((sum, f) => sum + f.cost, 0);
    const distance = ascending.length > 1 ? ascending[ascending.length - 1].mileage - ascending[0].mileage : 0;
    const litersForAverage = ascending.slice(1).reduce((sum, f) => sum + f.liters, 0);
    const average = consumption(litersForAverage, distance);
    const perRecord = new Map<string, number>();
    ascending.forEach((record, index) => {
      if (index === 0) return;
      const previous = ascending[index - 1];
      perRecord.set(record.id, consumption(record.liters, record.mileage - previous.mileage));
    });
    return { totalLiters, totalCost, distance, average, perRecord };
  }, [vehicleFuels]);

  if (!garage.ready) {
    return <div className="container-x py-20"><div className="h-64 animate-pulse rounded-3xl bg-white" /></div>;
  }

  if (!vehicle) {
    return (
      <div className="container-x py-16">
        <div className="card-surface mx-auto max-w-lg p-8 text-center">
          <CarFront className="mx-auto h-10 w-10 text-brand" />
          <h1 className="mt-3 text-lg font-bold">این پرونده پیدا نشد</h1>
          <p className="mt-2 text-sm text-muted">ممکن است خودرو حذف شده باشد یا داده‌های مرورگر پاک شده باشد.</p>
          <Link href="/garage" className="btn-primary mt-5">بازگشت به گاراژ</Link>
        </div>
      </div>
    );
  }

  const lastService = vehicleServices[0];
  const nextMileage = lastService?.nextMileage || (lastService ? lastService.mileage + 5000 : null);
  const remaining = nextMileage ? Math.max(nextMileage - vehicle.mileage, 0) : null;
  const totalServiceCost = vehicleServices.reduce((sum, s) => sum + s.cost, 0);

  function flash(message: string) {
    setNotice(message);
    setTimeout(() => setNotice(""), 3200);
  }

  function submitService(event: React.FormEvent) {
    event.preventDefault();
    if (!vehicle) return;
    if (!serviceForm.date || !serviceForm.mileage) {
      flash("تاریخ و کیلومتر سرویس الزامی است.");
      return;
    }
    garage.addService({
      vehicleId: vehicle.id,
      date: serviceForm.date,
      mileage: Number(serviceForm.mileage),
      cost: Number(serviceForm.cost) || 0,
      type: serviceForm.type,
      provider: serviceForm.provider || "ثبت شخصی",
      note: serviceForm.note,
      nextMileage: Number(serviceForm.nextMileage) || Number(serviceForm.mileage) + 5000,
    });
    if (Number(serviceForm.mileage) > vehicle.mileage) garage.updateMileage(vehicle.id, Number(serviceForm.mileage));
    setServiceForm(blankService);
    flash("سرویس جدید به پرونده اضافه شد.");
  }

  function submitFuel(event: React.FormEvent) {
    event.preventDefault();
    if (!vehicle) return;
    if (!fuelForm.date || !fuelForm.mileage || !fuelForm.liters) {
      flash("تاریخ، کیلومتر و مقدار سوخت الزامی است.");
      return;
    }
    garage.addFuel({
      vehicleId: vehicle.id,
      date: fuelForm.date,
      mileage: Number(fuelForm.mileage),
      liters: Number(fuelForm.liters),
      cost: Number(fuelForm.cost) || 0,
      station: fuelForm.station || "—",
      fullTank: fuelForm.fullTank,
    });
    if (Number(fuelForm.mileage) > vehicle.mileage) garage.updateMileage(vehicle.id, Number(fuelForm.mileage));
    setFuelForm(blankFuel);
    flash("سوخت‌گیری ثبت شد و مصرف به‌روزرسانی شد.");
  }

  function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1_500_000) {
      setDocError("حجم فایل باید کمتر از ۱٫۵ مگابایت باشد (در نسخه نهایی، فایل روی سرور ذخیره می‌شود).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDocError("");
      setDocForm((prev) => ({
        ...prev,
        title: prev.title || file.name,
        dataUrl: String(reader.result ?? ""),
        size: file.size,
      }));
    };
    reader.readAsDataURL(file);
  }

  function submitDoc(event: React.FormEvent) {
    event.preventDefault();
    if (!vehicle || !docForm.dataUrl) {
      setDocError("ابتدا فایل فاکتور یا مدرک را انتخاب کنید.");
      return;
    }
    garage.addDocument({
      vehicleId: vehicle.id,
      title: docForm.title || "مدرک بدون عنوان",
      kind: docForm.kind,
      dataUrl: docForm.dataUrl,
      size: docForm.size,
    });
    setDocForm({ title: "", kind: "فاکتور", dataUrl: "", size: 0 });
    setDocError("");
    flash("مدرک در پرونده خودرو ذخیره شد.");
  }

  return (
    <div className="container-x py-8">
      <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
        <Link href="/" className="hover:text-brand-dark">خانه</Link>
        <span>/</span>
        <Link href="/garage" className="hover:text-brand-dark">گاراژ دیجیتال</Link>
        <span>/</span>
        <span className="font-semibold text-ink">{vehicle.manufacturer} {vehicle.model}</span>
      </nav>

      {notice && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          {notice}
        </div>
      )}

      <div className="card-surface overflow-hidden">
        <div className="relative bg-ink p-5 text-white sm:p-6">
          <div className="mesh-dark absolute inset-0" aria-hidden="true" />
          <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <Link href="/garage" aria-label="بازگشت" className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-white/70 hover:text-white">
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                <CarFront className="h-6 w-6 text-brand" />
              </span>
              <div>
                <h1 className="text-lg font-extrabold sm:text-xl">{vehicle.manufacturer} {vehicle.model}</h1>
                <p className="mt-0.5 text-[11px] text-white/60">
                  {vehicle.trim || "—"} • مدل {toFa(vehicle.year)} • {vehicle.fuelType} • پلاک {vehicle.plate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-center">
                <p className="flex items-center justify-center gap-1 text-sm font-extrabold">
                  <Gauge className="h-4 w-4 text-brand" />
                  {num(vehicle.mileage)}
                </p>
                <p className="text-[10px] text-white/50">کیلومتر</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMileageDraft(vehicle.mileage);
                  setEditMileage((v) => !v);
                }}
                className="btn border border-white/20 px-3 py-2 text-[11px] text-white hover:bg-white/10"
              >
                به‌روزرسانی کیلومتر
              </button>
            </div>
          </div>

          {editMileage && (
            <div className="relative mt-4 flex flex-wrap items-end gap-2 rounded-xl border border-white/15 bg-white/5 p-3">
              <div>
                <label className="mb-1 block text-[10px] text-white/60" htmlFor="mileage-input">کیلومتر جدید</label>
                <input
                  id="mileage-input"
                  type="number"
                  value={mileageDraft}
                  onChange={(e) => setMileageDraft(Number(e.target.value))}
                  className="rounded-lg border border-white/20 bg-ink/60 px-3 py-2 text-sm text-white outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  garage.updateMileage(vehicle.id, Number(mileageDraft) || vehicle.mileage);
                  setEditMileage(false);
                  flash("کیلومتر خودرو به‌روزرسانی شد.");
                }}
                className="btn bg-white px-4 py-2 text-[11px] text-ink"
              >
                ذخیره
              </button>
            </div>
          )}
        </div>

        <div className="no-scrollbar flex overflow-x-auto border-b border-line">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`shrink-0 px-4 py-3 text-xs font-semibold transition ${
                tab === item.key ? "border-b-2 border-brand text-brand-dark" : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "overview" && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Wallet, label: "هزینه سرویس‌ها", value: toman(totalServiceCost) },
                  { icon: Fuel, label: "مصرف میانگین", value: fuelStats.average ? `${toFa(fuelStats.average)} لیتر / ۱۰۰ کیلومتر` : "داده کافی نیست" },
                  { icon: Wrench, label: "سوابق ثبت‌شده", value: `${num(vehicleServices.length)} سرویس` },
                  { icon: CalendarDays, label: "سرویس بعدی", value: remaining === null ? "ثبت نشده" : remaining === 0 ? "عقب‌افتاده" : `${num(remaining)} کیلومتر دیگر` },
                ].map((card) => (
                  <div key={card.label} className="rounded-2xl border border-line bg-paper/60 p-4">
                    <card.icon className="h-4 w-4 text-brand" />
                    <p className="mt-2 text-xs font-extrabold leading-6">{card.value}</p>
                    <p className="text-[10px] text-muted">{card.label}</p>
                  </div>
                ))}
              </div>

              {remaining !== null && (
                <div className="rounded-2xl border border-line p-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold">پیشرفت تا سرویس دوره‌ای بعدی</span>
                    <span className={remaining === 0 ? "font-bold text-red-600" : "font-bold text-verified"}>
                      {remaining === 0 ? "نیازمند سرویس" : `${num(remaining)} کیلومتر`}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper-deep">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-brand to-[#ffb37a]"
                      style={{
                        width: `${lastService && nextMileage ? Math.min(100, Math.max(4, ((vehicle.mileage - lastService.mileage) / (nextMileage - lastService.mileage || 1)) * 100)) : 0}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-muted">
                    آخرین سرویس: {lastService ? `${lastService.type} در کیلومتر ${num(lastService.mileage)}` : "ثبت نشده"}
                  </p>
                </div>
              )}

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-line p-4">
                  <h2 className="flex items-center gap-2 text-xs font-bold">
                    <Wrench className="h-4 w-4 text-brand" /> آخرین سرویس‌ها
                  </h2>
                  {vehicleServices.length === 0 ? (
                    <p className="mt-3 text-[11px] text-muted">هنوز سرویسی ثبت نشده است.</p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {vehicleServices.slice(0, 4).map((record) => (
                        <li key={record.id} className="flex items-center justify-between rounded-xl bg-paper px-3 py-2">
                          <div>
                            <p className="text-[11px] font-bold">{record.type}</p>
                            <p className="text-[10px] text-muted">{record.date} • {num(record.mileage)} کیلومتر</p>
                          </div>
                          <span className="text-[10px] font-bold text-ink-soft">{toman(record.cost)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-2xl border border-line p-4">
                  <h2 className="flex items-center gap-2 text-xs font-bold">
                    <Fuel className="h-4 w-4 text-brand" /> خلاصه سوخت
                  </h2>
                  {vehicleFuels.length === 0 ? (
                    <p className="mt-3 text-[11px] text-muted">هنوز سوخت‌گیری ثبت نشده است.</p>
                  ) : (
                    <div className="mt-3 space-y-2 text-[11px]">
                      <div className="flex justify-between rounded-lg bg-paper px-3 py-2">
                        <span className="text-muted">مجموع سوخت</span>
                        <span className="font-bold">{toFa(fuelStats.totalLiters)} لیتر</span>
                      </div>
                      <div className="flex justify-between rounded-lg bg-paper px-3 py-2">
                        <span className="text-muted">هزینه سوخت</span>
                        <span className="font-bold">{toman(fuelStats.totalCost)}</span>
                      </div>
                      <div className="flex justify-between rounded-lg bg-paper px-3 py-2">
                        <span className="text-muted">مسافت پیموده‌شده</span>
                        <span className="font-bold">{num(fuelStats.distance)} کیلومتر</span>
                      </div>
                      <div className="flex justify-between rounded-lg bg-teal-soft px-3 py-2 text-teal">
                        <span>مصرف میانگین</span>
                        <span className="font-bold">{fuelStats.average ? `${toFa(fuelStats.average)} L/100km` : "—"}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === "service" && (
            <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
              <form onSubmit={submitService} className="rounded-2xl border border-line p-4">
                <h2 className="flex items-center gap-2 text-xs font-bold">
                  <Plus className="h-4 w-4 text-brand" /> ثبت سرویس یا تعمیر
                </h2>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="label" htmlFor="s-date">تاریخ *</label>
                    <input id="s-date" className="input py-2.5" placeholder="۱۴۰۴/۱۲/۱۸" value={serviceForm.date} onChange={(e) => setServiceForm({ ...serviceForm, date: e.target.value })} />
                    <button type="button" onClick={() => setServiceForm({ ...serviceForm, date: todayJalali() })} className="mt-1 text-[10px] text-brand-dark">امروز</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="label" htmlFor="s-mileage">کیلومتر *</label>
                      <input id="s-mileage" type="number" className="input py-2.5" value={serviceForm.mileage || ""} onChange={(e) => setServiceForm({ ...serviceForm, mileage: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className="label" htmlFor="s-cost">هزینه (تومان)</label>
                      <input id="s-cost" type="number" className="input py-2.5" value={serviceForm.cost || ""} onChange={(e) => setServiceForm({ ...serviceForm, cost: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="s-type">نوع خدمت</label>
                    <select id="s-type" className="input py-2.5" value={serviceForm.type} onChange={(e) => setServiceForm({ ...serviceForm, type: e.target.value })}>
                      {serviceTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label" htmlFor="s-provider">مرکز خدمات</label>
                    <input id="s-provider" className="input py-2.5" placeholder="نام تعمیرگاه" value={serviceForm.provider} onChange={(e) => setServiceForm({ ...serviceForm, provider: e.target.value })} />
                  </div>
                  <div>
                    <label className="label" htmlFor="s-next">کیلومتر سرویس بعدی</label>
                    <input id="s-next" type="number" className="input py-2.5" placeholder="۵۵۰۰۰" value={serviceForm.nextMileage || ""} onChange={(e) => setServiceForm({ ...serviceForm, nextMileage: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="label" htmlFor="s-note">توضیحات</label>
                    <textarea id="s-note" className="input min-h-20 resize-none py-2.5" value={serviceForm.note} onChange={(e) => setServiceForm({ ...serviceForm, note: e.target.value })} />
                  </div>
                  <button type="submit" className="btn-primary w-full py-2.5 text-xs">ثبت سرویس</button>
                </div>
              </form>

              <div>
                {vehicleServices.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-line p-8 text-center text-[11px] text-muted">
                    هنوز سرویسی ثبت نشده است. اولین سرویس را از فرم کنار اضافه کنید.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {vehicleServices.map((record) => (
                      <li key={record.id} className="rounded-2xl border border-line p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-xs font-bold">{record.type}</h3>
                              <span className="rounded-md bg-brand-soft px-2 py-0.5 text-[10px] text-brand-dark">{record.date}</span>
                            </div>
                            <p className="mt-1.5 text-[11px] text-muted">{record.provider} • کیلومتر {num(record.mileage)}</p>
                            {record.note && <p className="mt-1 text-[11px] leading-6 text-ink-soft">{record.note}</p>}
                            {record.nextMileage && (
                              <p className="mt-1 text-[10px] text-teal">سرویس بعدی: {num(record.nextMileage)} کیلومتر</p>
                            )}
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-extrabold">{toman(record.cost)}</p>
                            <button type="button" onClick={() => garage.removeService(record.id)} aria-label="حذف سرویس" className="mt-2 rounded-md p-1 text-muted hover:bg-red-50 hover:text-red-600">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {tab === "fuel" && (
            <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
              <form onSubmit={submitFuel} className="rounded-2xl border border-line p-4">
                <h2 className="flex items-center gap-2 text-xs font-bold">
                  <Droplet className="h-4 w-4 text-brand" /> ثبت سوخت‌گیری
                </h2>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="label" htmlFor="f-date">تاریخ *</label>
                    <input id="f-date" className="input py-2.5" placeholder="۱۴۰۴/۱۲/۱۸" value={fuelForm.date} onChange={(e) => setFuelForm({ ...fuelForm, date: e.target.value })} />
                    <button type="button" onClick={() => setFuelForm({ ...fuelForm, date: todayJalali() })} className="mt-1 text-[10px] text-brand-dark">امروز</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="label" htmlFor="f-mileage">کیلومتر *</label>
                      <input id="f-mileage" type="number" className="input py-2.5" value={fuelForm.mileage || ""} onChange={(e) => setFuelForm({ ...fuelForm, mileage: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className="label" htmlFor="f-liters">لیتر *</label>
                      <input id="f-liters" type="number" className="input py-2.5" value={fuelForm.liters || ""} onChange={(e) => setFuelForm({ ...fuelForm, liters: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="f-cost">هزینه (تومان)</label>
                    <input id="f-cost" type="number" className="input py-2.5" value={fuelForm.cost || ""} onChange={(e) => setFuelForm({ ...fuelForm, cost: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="label" htmlFor="f-station">جایگاه سوخت</label>
                    <input id="f-station" className="input py-2.5" value={fuelForm.station} onChange={(e) => setFuelForm({ ...fuelForm, station: e.target.value })} />
                  </div>
                  <label className="flex items-center gap-2 text-[11px] text-ink-soft">
                    <input type="checkbox" checked={fuelForm.fullTank} onChange={(e) => setFuelForm({ ...fuelForm, fullTank: e.target.checked })} className="h-4 w-4 accent-[#f26b1d]" />
                    باک کامل پر شد (برای محاسبه دقیق مصرف)
                  </label>
                  <button type="submit" className="btn-primary w-full py-2.5 text-xs">ثبت سوخت‌گیری</button>
                  <p className="flex items-start gap-1.5 rounded-lg bg-paper p-2.5 text-[10px] leading-5 text-muted">
                    <Info className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
                    مصرف بین دو سوخت‌گیری کامل محاسبه می‌شود: لیتر ÷ مسافت × ۱۰۰.
                  </p>
                </div>
              </form>

              <div>
                {vehicleFuels.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-line p-8 text-center text-[11px] text-muted">
                    هنوز سوخت‌گیری ثبت نشده است.
                  </div>
                ) : (
                  <>
                    <div className="mb-3 grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-teal-soft p-3 text-center text-teal">
                        <p className="text-sm font-extrabold">{fuelStats.average ? toFa(fuelStats.average) : "—"}</p>
                        <p className="text-[9px]">میانگین L/100km</p>
                      </div>
                      <div className="rounded-xl bg-paper p-3 text-center">
                        <p className="text-sm font-extrabold">{num(fuelStats.distance)}</p>
                        <p className="text-[9px] text-muted">کیلومتر پیموده‌شده</p>
                      </div>
                      <div className="rounded-xl bg-paper p-3 text-center">
                        <p className="text-sm font-extrabold">{toman(fuelStats.totalCost)}</p>
                        <p className="text-[9px] text-muted">هزینه سوخت</p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {vehicleFuels.map((record) => (
                        <li key={record.id} className="flex items-center justify-between rounded-2xl border border-line p-3">
                          <div>
                            <p className="text-xs font-bold">{toFa(record.liters)} لیتر — {record.station}</p>
                            <p className="mt-0.5 text-[10px] text-muted">{record.date} • کیلومتر {num(record.mileage)} • {toman(record.cost)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {fuelStats.perRecord.get(record.id) ? (
                              <span className="rounded-md bg-paper px-2 py-1 text-[10px] font-bold text-ink-soft">
                                {toFa(fuelStats.perRecord.get(record.id) ?? 0)} L/100
                              </span>
                            ) : (
                              <span className="rounded-md bg-paper px-2 py-1 text-[10px] text-muted">مبنا</span>
                            )}
                            <button type="button" onClick={() => garage.removeFuel(record.id)} aria-label="حذف سوخت‌گیری" className="rounded-md p-1 text-muted hover:bg-red-50 hover:text-red-600">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}

          {tab === "docs" && (
            <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
              <form onSubmit={submitDoc} className="rounded-2xl border border-line p-4">
                <h2 className="flex items-center gap-2 text-xs font-bold">
                  <Upload className="h-4 w-4 text-brand" /> افزودن فاکتور یا مدرک
                </h2>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="label" htmlFor="d-title">عنوان مدرک</label>
                    <input id="d-title" className="input py-2.5" placeholder="فاکتور سرویس ۵۰٬۰۰۰" value={docForm.title} onChange={(e) => setDocForm({ ...docForm, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="label" htmlFor="d-kind">نوع مدرک</label>
                    <select id="d-kind" className="input py-2.5" value={docForm.kind} onChange={(e) => setDocForm({ ...docForm, kind: e.target.value as DocumentRecord["kind"] })}>
                      {(["فاکتور", "بیمه‌نامه", "کارت خودرو", "معاینه فنی", "سایر"] as const).map((kind) => (
                        <option key={kind} value={kind}>{kind}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label" htmlFor="d-file">تصویر مدرک (حداکثر ۱٫۵ مگابایت)</label>
                    <input id="d-file" type="file" accept="image/*,application/pdf" onChange={onFile} className="w-full rounded-xl border border-dashed border-line bg-paper px-3 py-3 text-[11px] text-muted" />
                  </div>
                  {docForm.dataUrl && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-[10px] text-emerald-800">
                      <FileImage className="h-4 w-4" />
                      فایل انتخاب شد ({num(Math.round(docForm.size / 1024))} کیلوبایت)
                    </div>
                  )}
                  {docError && <p className="rounded-lg bg-red-50 px-3 py-2 text-[10px] text-red-700">{docError}</p>}
                  <button type="submit" className="btn-primary w-full py-2.5 text-xs">ذخیره در پرونده</button>
                  <p className="flex items-start gap-1.5 text-[10px] leading-5 text-muted">
                    <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-verified" />
                    در نسخه نهایی، فایل‌ها با دسترسی خصوصی و رمزنگاری روی فضای امن ذخیره می‌شوند.
                  </p>
                </div>
              </form>

              <div>
                {vehicleDocs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-line p-8 text-center text-[11px] text-muted">
                    هنوز مدرکی بارگذاری نشده است.
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {vehicleDocs.map((doc) => (
                      <div key={doc.id} className="rounded-2xl border border-line p-3">
                        <div className="relative h-32 overflow-hidden rounded-xl bg-paper">
                          {doc.dataUrl.startsWith("data:image") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={doc.dataUrl} alt={doc.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="grid h-full place-items-center text-muted">
                              <FileText className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div className="mt-2 flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[11px] font-bold">{doc.title}</p>
                            <p className="text-[10px] text-muted">{doc.kind} • {doc.createdAt}</p>
                          </div>
                          <div className="flex gap-1">
                            <a href={doc.dataUrl} target="_blank" rel="noopener noreferrer" aria-label="مشاهده مدرک" className="rounded-md p-1 text-muted hover:bg-paper">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                            <button type="button" onClick={() => garage.removeDocument(doc.id)} aria-label="حذف مدرک" className="rounded-md p-1 text-muted hover:bg-red-50 hover:text-red-600">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "specs" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <dl className="rounded-2xl border border-line p-4 text-xs">
                {[
                  ["سازنده", vehicle.manufacturer],
                  ["مدل", vehicle.model],
                  ["تیپ / نسخه", vehicle.trim || "—"],
                  ["سال ساخت", toFa(vehicle.year)],
                  ["کیلومتر", num(vehicle.mileage)],
                  ["نوع سوخت", vehicle.fuelType],
                  ["رنگ", vehicle.color],
                  ["پلاک", vehicle.plate],
                  ["شماره شاسی", vehicle.vin || "—"],
                  ["تاریخ ایجاد پرونده", vehicle.createdAt],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-line/70 py-2 last:border-0">
                    <dt className="text-muted">{label}</dt>
                    <dd className="font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="space-y-3">
                <div className="rounded-2xl border border-line p-4 text-[11px] leading-6 text-muted">
                  <p className="mb-2 flex items-center gap-1.5 font-bold text-ink"><Info className="h-4 w-4 text-brand" /> درباره این پرونده</p>
                  این پرونده شامل {num(vehicleServices.length)} سرویس، {num(vehicleFuels.length)} سوخت‌گیری و {num(vehicleDocs.length)} مدرک است.
                  در نسخه نهایی، امکان اشتراک‌گذاری امن پرونده با خریدار یا تعمیرگاه و خروجی PDF وجود خواهد داشت.
                </div>
                <button
                  type="button"
                  onClick={() => garage.removeVehicle(vehicle.id)}
                  className="btn w-full border border-red-200 bg-red-50 text-xs text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف کامل پرونده خودرو
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
