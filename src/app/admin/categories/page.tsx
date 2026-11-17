"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Tags } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Meter, PageHeader, Panel } from "@/components/admin/AdminUI";
import { CategoryIcon } from "@/components/CategoryIcon";
import { brands, categories, cities } from "@/data/catalog";
import { toFa } from "@/lib/format";

export default function AdminCategoriesPage() {
  const admin = useAdmin();
  const maxCategory = Math.max(...categories.map((c) => admin.stores.filter((s) => s.categoryId === c.id).length), 1);

  return (
    <div className="space-y-5">
      <PageHeader
        title="دسته‌بندی خدمات، شهرها و برندها"
        desc="ساختار دسته‌بندی مرکزی برای فروشگاه‌ها، خدمات و جستجوی سایت. در نسخه نهایی، افزودن و ویرایش دسته‌بندی از همین صفحه انجام می‌شود."
      >
        <Link href="/admin/import" className="btn-outline px-4 py-2.5">ورود گروهی داده</Link>
      </PageHeader>

      <Panel title="دسته‌بندی‌های خدمات" desc={`${toFa(categories.length)} دسته فعال — توزیع مراکز ثبت‌شده`}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((cat) => {
            const count = admin.stores.filter((s) => s.categoryId === cat.id).length;
            return (
              <div key={cat.id} className="rounded-2xl border border-line p-3">
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ backgroundColor: `${cat.color}14`, color: cat.color }}>
                    <CategoryIcon name={cat.icon} className="h-4 w-4" />
                  </span>
                  <span className="rounded-md bg-paper px-2 py-0.5 font-mono text-[9px] text-muted" dir="ltr">{cat.id}</span>
                </div>
                <p className="mt-2 text-xs font-bold">{cat.title}</p>
                <p className="mt-0.5 line-clamp-1 text-[10px] text-muted">{cat.blurb}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-muted">
                  <span>{toFa(count)} مرکز</span>
                  <Link href={`/stores?category=${cat.id}`} className="inline-flex items-center gap-1 font-bold text-brand-dark">
                    مشاهده <ArrowLeft className="h-3 w-3" />
                  </Link>
                </div>
                <div className="mt-1.5">
                  <Meter value={count} max={maxCategory} color="bg-ink" />
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="پوشش شهری و منطقه‌ای" desc="آماده برای گسترش به ۳۱ استان">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>شهر</th>
                  <th>تعداد مراکز</th>
                  <th>مناطق تعریف‌شده</th>
                  <th>وضعیت پوشش</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => {
                  const count = admin.stores.filter((s) => s.city === city.name).length;
                  return (
                    <tr key={city.name}>
                      <td className="text-[11px] font-semibold">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-brand" /> {city.name}
                        </span>
                      </td>
                      <td className="text-[11px]">{toFa(count)}</td>
                      <td className="text-[10px] text-muted">{city.districts.join("، ")}</td>
                      <td>
                        <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold ${count > 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {count > 0 ? "فعال" : "در انتظار داده"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="برندهای تحت پوشش" desc="برای فیلتر برند در جستجوی سایت">
            <div className="flex flex-wrap gap-1.5">
              {brands.map((brand) => {
                const count = admin.stores.filter((s) => s.brands.includes(brand)).length;
                return (
                  <span key={brand} className="rounded-lg border border-line px-2.5 py-1.5 text-[10px]">
                    {brand} <span className="text-muted">({toFa(count)})</span>
                  </span>
                );
              })}
            </div>
          </Panel>

          <div className="rounded-2xl border border-dashed border-line bg-white p-4 text-[11px] leading-6 text-muted">
            <p className="mb-1.5 flex items-center gap-1.5 font-bold text-ink">
              <Tags className="h-4 w-4 text-brand" /> نکته معماری
            </p>
            دسته‌بندی‌ها در جدول مرکزی categories ذخیره می‌شوند و هر خدمت، فروشگاه و ویجت جستجو
            به همان شناسه ارجاع می‌دهد؛ بنابراین افزودن دسته جدید نیازی به تغییر ساختار سایت ندارد.
          </div>
        </div>
      </div>

      <Panel title="جستجوهای پرتکرار کاربران" desc="مبنای توسعه محتوا و سئو (داده نمایشی)">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "تعمیرگاه پژو ۲۰۷ در سعادت‌آباد",
            "تعویض روغن در محل تهران",
            "لاستیک و رینگ پونک",
            "باتری خودرو فوری نارمک",
            "تعویض پلاک نزدیک ولیعصر",
            "معاینه فنی اکباتان",
            "فروشگاه لوازم یدکی امیرکبیر",
            "کارواش نانو نیاوران",
          ].map((term, index) => (
            <div key={term} className="flex items-center justify-between rounded-xl border border-line px-3 py-2 text-[11px]">
              <span>{term}</span>
              <span className="rounded-md bg-paper px-1.5 py-0.5 text-[9px] text-muted">{toFa(1200 - index * 130)} جستجو</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
