"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, RotateCcw, Search, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { brands, categories, cities, verificationLabels } from "@/data/catalog";
import { seedStores } from "@/data/stores";
import { normalizeText, num, toFa } from "@/lib/format";
import type { VerificationStatus } from "@/lib/types";
import { StoreCard } from "@/components/site/StoreCard";
import { EmptyState } from "@/components/site/ui";

type SortKey = "rating" | "reviews" | "name";

export function StoresBrowser() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [city, setCity] = useState(params.get("city") ?? "");
  const [district, setDistrict] = useState(params.get("district") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "");
  const [brand, setBrand] = useState(params.get("brand") ?? "");
  const [status, setStatus] = useState<VerificationStatus | "">("");
  const [sort, setSort] = useState<SortKey>("rating");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const districts = cities.find((c) => c.name === city)?.districts ?? [];

  const term = normalizeText(q);
  const results = (() => {
    const filtered = seedStores.filter((store) => {
      if (city && store.city !== city) return false;
      if (district && store.district !== district) return false;
      if (category && store.categoryId !== category) return false;
      if (brand && !store.brands.includes(brand)) return false;
      if (status && store.status !== status) return false;
      if (!term) return true;
      const haystack = normalizeText(
        [store.name, store.description, store.city, store.district, store.address, store.services.join(" "), store.brands.join(" ")].join(" "),
      );
      return term.split(" ").every((token) => haystack.includes(token));
    });

    return filtered.sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "reviews") return b.reviews - a.reviews;
      return a.name.localeCompare(b.name, "fa");
    });
  })();

  function reset() {
    setQ("");
    setCity("");
    setDistrict("");
    setCategory("");
    setBrand("");
    setStatus("");
    setSort("rating");
  }

  const activeCount = [q, city, district, category, brand, status].filter(Boolean).length;

  const filterPanel = (
    <div className="space-y-5">
      <div>
        <label className="label" htmlFor="city-filter">شهر</label>
        <select
          id="city-filter"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setDistrict("");
          }}
          className="input"
        >
          <option value="">همه شهرها</option>
          {cities.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="district-filter">منطقه / محله</label>
        <select
          id="district-filter"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="input disabled:opacity-50"
          disabled={!city}
        >
          <option value="">همه مناطق</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {!city && <p className="mt-1.5 text-[10px] text-muted">برای انتخاب منطقه، ابتدا شهر را انتخاب کنید.</p>}
      </div>

      <div>
        <span className="label">دسته‌بندی خدمات</span>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setCategory("")}
            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition ${
              category === "" ? "bg-brand-soft font-bold text-brand-dark" : "text-muted hover:bg-paper"
            }`}
          >
            همه خدمات
            <span>{toFa(seedStores.length)}</span>
          </button>
          {categories.map((c) => {
            const count = seedStores.filter((s) => s.categoryId === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition ${
                  category === c.id ? "bg-brand-soft font-bold text-brand-dark" : "text-muted hover:bg-paper"
                }`}
              >
                {c.short}
                <span>{toFa(count)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="brand-filter">برند خودرو</label>
        <select id="brand-filter" value={brand} onChange={(e) => setBrand(e.target.value)} className="input">
          <option value="">همه برندها</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div>
        <span className="label">وضعیت اطلاعات</span>
        <div className="flex flex-wrap gap-1.5">
          {(["", "verified", "pending", "unverified"] as const).map((s) => (
            <button
              key={s || "all"}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition ${
                status === s
                  ? "border-brand bg-brand-soft font-bold text-brand-dark"
                  : "border-line bg-white text-muted hover:border-brand/30"
              }`}
            >
              {s === "" ? "همه" : verificationLabels[s].title}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-teal-soft p-3 text-[11px] leading-5 text-teal">
        <ShieldCheck className="mb-1 h-4 w-4" />
        مراکز دارای نشان «تأییدشده» اطلاعاتشان با تماس تلفنی و بازدید میدانی بررسی شده است.
      </div>

      <button type="button" onClick={reset} className="btn-outline w-full py-2.5 text-xs">
        <RotateCcw className="h-3.5 w-3.5" />
        حذف همه فیلترها
      </button>
    </div>
  );

  return (
    <div className="container-x py-10">
      <nav className="mb-3 flex items-center gap-1.5 text-[11px] text-muted" aria-label="مسیر صفحه">
        <span>خانه</span>
        <span>/</span>
        <span className="font-semibold text-ink">فروشگاه‌ها و خدمات</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">فروشگاه‌ها و مراکز خدمات خودرو</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            {num(results.length)} مرکز مطابق جستجوی شما — فیلترها را ترکیب کنید تا نزدیک‌ترین و
            مطمئن‌ترین مرکز را پیدا کنید.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جستجو در نام و خدمات…"
              aria-label="جستجو"
              className="input py-2.5 pr-9"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="پاک کردن جستجو"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted hover:bg-paper"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="btn-outline shrink-0 px-3 py-2.5 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            فیلتر
            {activeCount > 0 && (
              <span className="rounded-full bg-brand px-1.5 text-[10px] text-white">{toFa(activeCount)}</span>
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="card-surface sticky top-24 p-5">
            <div className="mb-4 flex items-center gap-2 border-b border-line pb-3">
              <Filter className="h-4 w-4 text-brand" />
              <span className="text-sm font-bold">فیلترها</span>
            </div>
            {filterPanel}
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between rounded-xl border border-line bg-white px-4 py-2.5">
            <span className="text-xs text-muted">
              مرتب‌سازی بر اساس:
            </span>
            <div className="flex gap-1">
              {(
                [
                  { key: "rating", label: "امتیاز" },
                  { key: "reviews", label: "محبوب‌ترین" },
                  { key: "name", label: "الفبا" },
                ] as const
              ).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSort(item.key)}
                  className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition ${
                    sort === item.key ? "bg-ink text-white" : "text-muted hover:bg-paper"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {results.length === 0 ? (
            <EmptyState
              title="مرکزی با این مشخصات پیدا نشد"
              desc="عبارت جستجو را کوتاه‌تر کنید یا فیلتر شهر و دسته‌بندی را بردارید تا نتایج بیشتری ببینید."
              action={{ href: "/stores", label: "مشاهده همه مراکز" }}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="بستن فیلترها"
            className="absolute inset-0 bg-ink/50"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="relative z-10 mr-auto h-full w-[86%] max-w-sm overflow-y-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
              <span className="text-sm font-bold">فیلتر نتایج</span>
              <button type="button" onClick={() => setFiltersOpen(false)} aria-label="بستن">
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterPanel}
            <button type="button" onClick={() => setFiltersOpen(false)} className="btn-primary mt-4 w-full">
              نمایش {toFa(results.length)} نتیجه
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
