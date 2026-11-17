"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CarFront,
  Database,
  FileText,
  Fuel,
  Gauge,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { useGarage } from "@/lib/garage";
import { num, toFa } from "@/lib/format";
import type { Vehicle } from "@/lib/types";

const fuelTypes: Vehicle["fuelType"][] = ["بنزین", "گازوئیل", "دوگانه‌سوز", "هیبرید", "برقی"];

const blankVehicle = {
  manufacturer: "ایران‌خودرو",
  model: "",
  trim: "",
  year: 1402,
  mileage: 0,
  plate: "",
  fuelType: "بنزین" as Vehicle["fuelType"],
  color: "",
  vin: "",
};

export function GarageList() {
  const garage = useGarage();
  const { vehicles, services, fuels, documents } = garage;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blankVehicle);
  const [error, setError] = useState("");

  const totalServiceCost = services.reduce((sum, record) => sum + record.cost, 0);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.model.trim()) {
      setError("مدل خودرو را وارد کنید.");
      return;
    }
    if (!form.year || form.year < 1370 || form.year > 1410) {
      setError("سال ساخت را بین ۱۳۷۰ تا ۱۴۱۰ وارد کنید.");
      return;
    }
    setError("");
    garage.addVehicle({
      ...form,
      mileage: Number(form.mileage) || 0,
      year: Number(form.year),
      plate: form.plate.trim() || "ثبت نشده",
      color: form.color.trim() || "—",
    });
    setForm(blankVehicle);
    setOpen(false);
  }

  return (
    <div className="container-x py-10">
      <nav className="mb-3 flex items-center gap-1.5 text-[11px] text-muted">
        <Link href="/" className="hover:text-brand-dark">خانه</Link>
        <span>/</span>
        <span className="font-semibold text-ink">شناسنامه دیجیتال خودرو</span>
      </nav>

      <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white sm:p-8">
        <div className="mesh-dark absolute inset-0" aria-hidden="true" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-bold text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              پرونده دیجیتال هر خودرو
            </span>
            <h1 className="mt-3 text-2xl font-extrabold leading-[1.5] sm:text-[32px]">
              گاراژ دیجیتال من
            </h1>
            <p className="mt-2 text-sm leading-7 text-white/60">
              سوابق سرویس، سوخت‌گیری، هزینه‌ها و فاکتورهای هر خودرو را در یک پرونده مستقل
              نگه دارید. داده‌های این نسخه نمایشی روی مرورگر شما ذخیره می‌شوند.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button type="button" onClick={() => setOpen((v) => !v)} className="btn-primary">
              {open ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {open ? "بستن فرم" : "افزودن خودرو"}
            </button>
            {vehicles.length === 0 && (
              <button type="button" onClick={garage.loadDemo} className="btn border border-white/25 text-white hover:bg-white/10">
                <Database className="h-4 w-4" />
                بارگذاری نمونه پژو ۲۰۷
              </button>
            )}
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: CarFront, label: "خودروهای ثبت‌شده", value: num(vehicles.length) },
            { icon: Wrench, label: "سوابق سرویس", value: num(services.length) },
            { icon: Fuel, label: "سوخت‌گیری", value: num(fuels.length) },
            { icon: FileText, label: "هزینه سرویس‌ها", value: `${num(Math.round(totalServiceCost / 1_000_000))} م.ت` },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <item.icon className="h-4 w-4 text-brand" />
              <p className="mt-2 text-lg font-extrabold">{garage.ready ? item.value : "—"}</p>
              <p className="text-[10px] text-white/50">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <form onSubmit={submit} className="card-surface mt-6 p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <CarFront className="h-4 w-4 text-brand" /> مشخصات خودروی جدید
            </h2>
            <button type="button" onClick={() => setOpen(false)} aria-label="بستن" className="text-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="label" htmlFor="manufacturer">سازنده</label>
              <select id="manufacturer" className="input" value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}>
                {["ایران‌خودرو", "سایپا", "پارس‌خودرو", "مدیران خودرو", "کرمان موتور", "تویوتا", "کیا", "هیوندای", "بنز", "بی‌ام‌و", "سایر"].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="model">مدل *</label>
              <input id="model" className="input" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="مثلاً پژو ۲۰۷" />
            </div>
            <div>
              <label className="label" htmlFor="trim">تیپ / نسخه</label>
              <input id="trim" className="input" value={form.trim} onChange={(e) => setForm({ ...form, trim: e.target.value })} placeholder="پانوراما اتوماتیک" />
            </div>
            <div>
              <label className="label" htmlFor="year">سال ساخت (شمسی) *</label>
              <input id="year" type="number" className="input" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label" htmlFor="mileage">کیلومتر فعلی</label>
              <input id="mileage" type="number" className="input" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label" htmlFor="fuelType">نوع سوخت</label>
              <select id="fuelType" className="input" value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value as Vehicle["fuelType"] })}>
                {fuelTypes.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="plate">شماره پلاک</label>
              <input id="plate" className="input" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="۱۲ ب ۳۴۵ — ایران ۱۱" />
            </div>
            <div>
              <label className="label" htmlFor="color">رنگ</label>
              <input id="color" className="input" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="خاکستری" />
            </div>
            <div>
              <label className="label" htmlFor="vin">شماره شاسی (VIN)</label>
              <input id="vin" className="input" dir="ltr" value={form.vin} onChange={(e) => setForm({ ...form, vin: e.target.value })} />
            </div>
          </div>
          {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-700">{error}</p>}
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <p className="flex items-center gap-1.5 text-[11px] text-muted">
              <ShieldCheck className="h-4 w-4 text-verified" /> اطلاعات خودرو فقط روی دستگاه شما ذخیره می‌شود.
            </p>
            <button type="submit" className="btn-primary">ثبت خودرو</button>
          </div>
        </form>
      )}

      {!garage.ready ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-52 animate-pulse rounded-3xl bg-white" />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="card-surface mt-6 flex flex-col items-center px-6 py-14 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-soft text-brand-dark">
            <CarFront className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-lg font-bold">هنوز خودرویی ثبت نکرده‌اید</h2>
          <p className="mt-2 max-w-md text-sm leading-7 text-muted">
            با افزودن خودرو، پرونده دیجیتال آن ساخته می‌شود و می‌توانید سرویس‌ها،
            سوخت‌گیری و فاکتورها را ثبت کنید.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => setOpen(true)} className="btn-primary">
              <Plus className="h-4 w-4" /> افزودن خودرو
            </button>
            <button type="button" onClick={garage.loadDemo} className="btn-outline">
              <Sparkles className="h-4 w-4" /> مشاهده نمونه
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {vehicles.map((vehicle) => {
            const vehicleServices = services.filter((s) => s.vehicleId === vehicle.id);
            const vehicleFuels = fuels.filter((f) => f.vehicleId === vehicle.id);
            const vehicleDocs = documents.filter((d) => d.vehicleId === vehicle.id);
            const lastService = [...vehicleServices].sort((a, b) => b.mileage - a.mileage)[0];
            const nextMileage = lastService?.nextMileage ?? (lastService ? lastService.mileage + 5000 : null);
            const remaining = nextMileage ? Math.max(nextMileage - vehicle.mileage, 0) : null;
            const progress = nextMileage && lastService
              ? Math.min(100, Math.max(4, ((vehicle.mileage - lastService.mileage) / (nextMileage - lastService.mileage || 1)) * 100))
              : 0;

            return (
              <article key={vehicle.id} className="card-surface overflow-hidden">
                <div className="flex items-start justify-between border-b border-line bg-paper/60 p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white">
                      <CarFront className="h-6 w-6" />
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold">{vehicle.manufacturer} {vehicle.model}</h2>
                      <p className="text-[11px] text-muted">{vehicle.trim || "—"} • مدل {toFa(vehicle.year)} • {vehicle.fuelType}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => garage.removeVehicle(vehicle.id)}
                    aria-label={`حذف ${vehicle.model}`}
                    className="rounded-lg p-1.5 text-muted transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-paper p-2.5">
                      <Gauge className="mx-auto h-4 w-4 text-brand" />
                      <p className="mt-1 text-xs font-extrabold">{num(vehicle.mileage)}</p>
                      <p className="text-[9px] text-muted">کیلومتر</p>
                    </div>
                    <div className="rounded-xl bg-paper p-2.5">
                      <Wrench className="mx-auto h-4 w-4 text-brand" />
                      <p className="mt-1 text-xs font-extrabold">{num(vehicleServices.length)}</p>
                      <p className="text-[9px] text-muted">سرویس</p>
                    </div>
                    <div className="rounded-xl bg-paper p-2.5">
                      <FileText className="mx-auto h-4 w-4 text-brand" />
                      <p className="mt-1 text-xs font-extrabold">{num(vehicleDocs.length)}</p>
                      <p className="text-[9px] text-muted">مدرک</p>
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] text-muted">پلاک: <span className="font-semibold text-ink">{vehicle.plate}</span></p>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted">وضعیت سرویس دوره‌ای</span>
                      <span className={remaining !== null && remaining < 800 ? "font-bold text-red-600" : "font-bold text-verified"}>
                        {remaining === null ? "سرویسی ثبت نشده" : remaining === 0 ? "سرویس عقب‌افتاده" : `${num(remaining)} کیلومتر مانده`}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-deep">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-muted">{num(vehicleFuels.length)} سوخت‌گیری ثبت‌شده</span>
                    <Link href={`/garage/${vehicle.id}`} className="btn-dark px-3 py-2 text-[11px]">
                      پرونده خودرو
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { title: "محاسبه مصرف سوخت", desc: "میانگین مصرف لیتر در ۱۰۰ کیلومتر به‌صورت خودکار محاسبه می‌شود.", icon: Fuel },
          { title: "یادآور سرویس", desc: "بر اساس کیلومتر و سرویس قبلی، موعد سرویس بعدی نمایش داده می‌شود.", icon: Gauge },
          { title: "آرشیو مدارک", desc: "فاکتورها، بیمه‌نامه و کارت خودرو در پرونده خودرو نگهداری می‌شود.", icon: FileText },
        ].map((item) => (
          <div key={item.title} className="card-surface p-4">
            <item.icon className="h-4 w-4 text-brand" />
            <h3 className="mt-2 text-xs font-bold">{item.title}</h3>
            <p className="mt-1 text-[11px] leading-6 text-muted">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
