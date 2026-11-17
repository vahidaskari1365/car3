"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Search, Wrench } from "lucide-react";
import { categories, cities } from "@/data/catalog";

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (city) params.set("city", city);
    if (category) params.set("category", category);
    router.push(`/stores${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={submit}
      className={`rounded-2xl border border-line bg-white p-2 shadow-card ${compact ? "" : "sm:rounded-3xl"}`}
      role="search"
    >
      <div className={`flex flex-col gap-2 ${compact ? "sm:flex-row" : "lg:flex-row"}`}>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="تعمیرگاه، تعویض روغن، لاستیک، لوازم یدکی…"
            aria-label="جستجوی خدمت یا فروشگاه"
            className="h-12 w-full rounded-xl border border-transparent bg-paper/60 pr-10 pl-3 text-sm outline-none transition focus:border-brand/40 focus:bg-white"
          />
        </div>

        <div className="relative sm:w-40">
          <MapPin className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="شهر"
            className="h-12 w-full appearance-none rounded-xl border border-transparent bg-paper/60 pr-9 pl-3 text-sm outline-none transition focus:border-brand/40 focus:bg-white"
          >
            <option value="">همه شهرها</option>
            {cities.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative sm:w-48">
          <Wrench className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="دسته‌بندی"
            className="h-12 w-full appearance-none rounded-xl border border-transparent bg-paper/60 pr-9 pl-3 text-sm outline-none transition focus:border-brand/40 focus:bg-white"
          >
            <option value="">همه خدمات</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.short}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary h-12 shrink-0 px-6">
          <Search className="h-4 w-4" />
          جستجو
        </button>
      </div>
    </form>
  );
}
