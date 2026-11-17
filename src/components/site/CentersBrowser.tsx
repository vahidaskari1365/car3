"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Clock, Info, MapPin, Navigation, Phone, Route } from "lucide-react";
import { cities, centerTypeMeta } from "@/data/catalog";
import { seedCenters } from "@/data/stores";
import { MapPanel } from "@/components/site/MapPanel";
import { CategoryIcon } from "@/components/CategoryIcon";
import { routeLinks, toFa } from "@/lib/format";
import type { CenterType } from "@/lib/types";

const types: Array<CenterType | "all"> = ["all", "fuel", "cng", "plate", "inspection"];

export function CentersBrowser() {
  const params = useSearchParams();
  const initial = seedCenters.find((c) => c.id === params.get("focus")) ?? seedCenters[0];
  const [activeType, setActiveType] = useState<CenterType | "all">("all");
  const [city, setCity] = useState("");
  const [selectedId, setSelectedId] = useState(initial.id);

  const filtered = useMemo(() => {
    return seedCenters.filter((center) => {
      if (activeType !== "all" && center.type !== activeType) return false;
      if (city && center.city !== city) return false;
      return true;
    });
  }, [activeType, city]);

  const selected = seedCenters.find((c) => c.id === selectedId) ?? filtered[0] ?? seedCenters[0];
  const meta = centerTypeMeta[selected.type];

  return (
    <div className="container-x py-10">
      <nav className="mb-3 flex items-center gap-1.5 text-[11px] text-muted" aria-label="مسیر صفحه">
        <Link href="/" className="hover:text-brand-dark">خانه</Link>
        <span>/</span>
        <span className="font-semibold text-ink">مراکز ضروری خودرو</span>
      </nav>

      <div className="max-w-3xl">
        <span className="chip border-brand/20 bg-brand-soft text-brand-dark">
          <MapPin className="h-3.5 w-3.5" />
          راهنمای مراکز ضروری
        </span>
        <h1 className="mt-4 text-2xl font-extrabold leading-[1.5] sm:text-[34px]">
          سوخت، تعویض پلاک و معاینه فنی نزدیک شما
        </h1>
        <p className="mt-3 text-sm leading-8 text-muted">
          جایگاه‌های سوخت و مراکز ضروری خودرو با آدرس، ساعات کاری و موقعیت دقیق روی نقشه.
          مسیر را با یک کلیک در بلد، نشان یا گوگل مپ باز کنید.
        </p>
      </div>

      <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-line bg-white p-3 sm:flex-row sm:items-center">
        <div className="no-scrollbar flex flex-1 gap-1.5 overflow-x-auto">
          {types.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                activeType === type ? "bg-ink text-white" : "bg-paper text-muted hover:text-ink"
              }`}
            >
              {type === "all" ? "همه مراکز" : centerTypeMeta[type].title}
            </button>
          ))}
        </div>
        <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="شهر" className="input w-auto py-2.5 sm:min-w-40">
          <option value="">همه شهرها</option>
          {cities.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="card-surface p-8 text-center text-sm text-muted">
              مرکزی با این فیلتر پیدا نشد. شهر یا نوع مرکز را تغییر دهید.
            </div>
          )}
          {filtered.map((center) => {
            const itemMeta = centerTypeMeta[center.type];
            const links = routeLinks(center.lat, center.lng, center.name);
            const isActive = center.id === selected.id;
            return (
              <article
                key={center.id}
                className={`card-surface p-4 transition ${isActive ? "border-brand/50 ring-2 ring-brand/10" : "hover:border-brand/30"}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                    style={{ backgroundColor: `${itemMeta.color}14`, color: itemMeta.color }}
                  >
                    <CategoryIcon name={itemMeta.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-bold">{center.name}</h2>
                      <span className="rounded-md bg-paper px-2 py-0.5 text-[10px] text-muted">{itemMeta.title}</span>
                    </div>
                    <p className="mt-1.5 flex items-start gap-1.5 text-[11px] leading-6 text-muted">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                      {center.city}، {center.district} — {center.address}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {center.hours}</span>
                      {center.phone && (
                        <a href={`tel:${center.phone}`} className="flex items-center gap-1 hover:text-brand-dark" dir="ltr">
                          <Phone className="h-3.5 w-3.5" /> {toFa(center.phone)}
                        </a>
                      )}
                    </div>
                    {center.note && (
                      <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-paper px-2.5 py-1.5 text-[10px] leading-5 text-muted">
                        <Info className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
                        {center.note}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedId(center.id)}
                        className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition ${
                          isActive ? "bg-brand text-white" : "bg-paper text-ink hover:bg-brand-soft"
                        }`}
                      >
                        نمایش روی نقشه
                      </button>
                      {links.map((link) => (
                        <a
                          key={link.name}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-semibold text-ink transition hover:border-brand/50 hover:text-brand-dark"
                        >
                          <Route className="h-3 w-3" />
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <MapPanel
            lat={selected.lat}
            lng={selected.lng}
            label={selected.name}
            address={selected.address}
            height={330}
          />
          <div className="card-surface p-5">
            <span
              className="grid h-10 w-10 place-items-center rounded-xl"
              style={{ backgroundColor: `${meta.color}14`, color: meta.color }}
            >
              <CategoryIcon name={meta.icon} className="h-5 w-5" />
            </span>
            <h2 className="mt-3 text-sm font-bold">{selected.name}</h2>
            <p className="mt-1 text-[11px] leading-6 text-muted">{selected.address}</p>
            <dl className="mt-3 space-y-2 border-t border-line pt-3 text-[11px]">
              <div className="flex justify-between">
                <dt className="text-muted">نوع مرکز</dt>
                <dd className="font-semibold">{meta.title}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">ساعات کاری</dt>
                <dd className="font-semibold">{selected.hours}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">شهر / منطقه</dt>
                <dd className="font-semibold">{selected.city} — {selected.district}</dd>
              </div>
            </dl>
            <a
              href={routeLinks(selected.lat, selected.lng, selected.name)[1].href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4 w-full py-2.5 text-xs"
            >
              <Navigation className="h-4 w-4" />
              مسیریابی با بلد
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
