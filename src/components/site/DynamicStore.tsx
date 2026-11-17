"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Link2, MapPin, Phone, Store as StoreIcon } from "lucide-react";
import { categories } from "@/data/catalog";
import { seedStores } from "@/data/stores";
import { storeGallery } from "@/data/images";
import { useLocalStore } from "@/lib/useLocalStore";
import { toFa } from "@/lib/format";
import { MapPanel } from "@/components/site/MapPanel";
import { VerificationBadge } from "@/components/site/ui";
import type { Store } from "@/lib/types";

/**
 * صفحه فروشگاه‌هایی که از پنل مدیریت اضافه شده‌اند (داده محلی).
 * فروشگاه‌های اولیه به‌صورت استاتیک و سئو‌محور رندر می‌شوند.
 */
export function DynamicStore({ slug }: { slug: string }) {
  const storesState = useLocalStore<Store[]>("stores", seedStores);
  const store = storesState.value.find((s) => s.slug === slug);

  if (!storesState.ready) {
    return <div className="container-x py-20"><div className="h-64 animate-pulse rounded-3xl bg-white" /></div>;
  }

  if (!store) {
    return (
      <div className="container-x py-20">
        <div className="card-surface mx-auto max-w-lg p-8 text-center">
          <StoreIcon className="mx-auto h-10 w-10 text-brand" />
          <h1 className="mt-3 text-lg font-bold">این فروشگاه یافت نشد</h1>
          <p className="mt-2 text-sm leading-7 text-muted">
            ممکن است پرونده حذف شده باشد یا داده‌های این مرورگر پاک شده باشد.
          </p>
          <Link href="/stores" className="btn-primary mt-5">بازگشت به فهرست مراکز</Link>
        </div>
      </div>
    );
  }

  const category = categories.find((c) => c.id === store.categoryId);
  const gallery = storeGallery(store.coverIndex, 1)[0];

  return (
    <div className="container-x py-8">
      <nav className="mb-5 flex items-center gap-1.5 text-[11px] text-muted">
        <Link href="/" className="hover:text-brand-dark">خانه</Link>
        <span>/</span>
        <Link href="/stores" className="hover:text-brand-dark">فروشگاه‌ها</Link>
        <span>/</span>
        <span className="font-semibold text-ink">{store.name}</span>
      </nav>

      <div className="grid gap-7 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="relative h-64 overflow-hidden rounded-3xl border border-line sm:h-80">
            <Image src={gallery} alt={store.name} fill sizes="100vw" className="object-cover" priority />
            <div className="absolute right-3 top-3">
              <VerificationBadge status={store.status} size="md" />
            </div>
          </div>
          <span className="mt-5 inline-block rounded-lg bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand-dark">
            {category?.title}
          </span>
          <h1 className="mt-2 text-2xl font-extrabold">{store.name}</h1>
          <p className="mt-2 flex items-start gap-2 text-sm leading-7 text-muted">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-brand" />
            {store.city}، {store.district} — {store.address}
          </p>
          <p className="mt-4 text-sm leading-8 text-ink-soft">{store.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {store.services.map((service) => (
              <span key={service} className="chip">{service}</span>
            ))}
          </div>

          <div className="mt-6">
            <MapPanel lat={store.lat} lng={store.lng} label={store.name} address={store.address} height={320} />
          </div>

          <p className="mt-5 rounded-xl border border-dashed border-line bg-white/60 p-3 text-[11px] leading-6 text-muted">
            این پرونده از پنل مدیریت (داده محلی مرورگر) نمایش داده می‌شود. در نسخه عملیاتی،
            تمام پرونده‌ها از دیتابیس مرکزی و با آدرس اختصاصی و سئوی کامل منتشر می‌شوند.
          </p>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card-surface p-5">
            <p className="text-[11px] text-muted">تماس با مرکز</p>
            <a href={`tel:${store.phone}`} className="mt-1 block text-xl font-extrabold" dir="ltr">{toFa(store.phone)}</a>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
              <Clock className="h-3.5 w-3.5 text-brand" /> {store.hours}
            </p>
            <a href={`tel:${store.phone}`} className="btn-primary mt-4 w-full py-2.5 text-xs">
              <Phone className="h-4 w-4" /> تماس و رزرو نوبت
            </a>
          </div>
          <div className="rounded-3xl border border-dashed border-brand/30 bg-brand-soft p-5">
            <Link2 className="h-5 w-5 text-brand-dark" />
            <h2 className="mt-2 text-sm font-bold text-brand-dark">مدیر این فروشگاه هستید؟</h2>
            <p className="mt-1.5 text-[11px] leading-6 text-ink-soft">اطلاعات مرکز را بازبینی و برای تأیید ارسال کنید.</p>
            <Link href={`/verify/${store.verifyToken}`} className="btn-dark mt-3 w-full py-2.5 text-xs">
              بازبینی اطلاعات
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
