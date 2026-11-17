import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  BadgeCheck,
  Building2,
  CalendarCheck,
  CarFront,
  CheckCircle2,
  Clock,
  Info,
  Link2,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { StoreCard } from "@/components/site/StoreCard";
import { DynamicStore } from "@/components/site/DynamicStore";
import { MapPanel } from "@/components/site/MapPanel";
import { SectionHeading, Stars, VerificationBadge } from "@/components/site/ui";
import { categories } from "@/data/catalog";
import { storeGallery } from "@/data/images";
import { seedStores } from "@/data/stores";
import { findStoreBySlug } from "@/data/stores";
import { num, routeLinks, toFa } from "@/lib/format";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return seedStores.map((store) => ({ slug: store.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const store = findStoreBySlug(slug);
  if (!store) return { title: "فروشگاه و مرکز خدمات خودرو" };
  const category = categories.find((c) => c.id === store.categoryId);
  return {
    title: `${store.name} — ${category?.title} در ${store.city}`,
    description: `${store.description} آدرس: ${store.city}، ${store.district}، ${store.address}. شماره تماس و مسیریابی روی نقشه.`,
  };
}

export default async function StorePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const store = findStoreBySlug(slug);
  if (!store) return <DynamicStore slug={slug} />;

  const category = categories.find((c) => c.id === store.categoryId);
  const gallery = storeGallery(store.coverIndex, 3);
  const similar = seedStores
    .filter((s) => s.id !== store.id && (s.categoryId === store.categoryId || s.city === store.city))
    .slice(0, 3);
  const links = routeLinks(store.lat, store.lng, store.name);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: store.name,
    description: store.description,
    telephone: store.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: store.city,
      addressRegion: store.district,
      streetAddress: store.address,
      addressCountry: "IR",
    },
    geo: { "@type": "GeoCoordinates", latitude: store.lat, longitude: store.lng },
    openingHours: store.hours,
    aggregateRating: { "@type": "AggregateRating", ratingValue: store.rating, reviewCount: store.reviews },
  };

  return (
    <div className="container-x py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted" aria-label="مسیر صفحه">
        <Link href="/" className="hover:text-brand-dark">خانه</Link>
        <span>/</span>
        <Link href="/stores" className="hover:text-brand-dark">فروشگاه‌ها</Link>
        <span>/</span>
        <Link href={`/stores?category=${store.categoryId}`} className="hover:text-brand-dark">
          {category?.title}
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink">{store.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="grid gap-2 sm:grid-cols-[2fr_1fr]">
            <div className="relative h-64 overflow-hidden rounded-3xl border border-line sm:h-[360px]">
              <Image
                src={gallery[0]}
                alt={`${store.name} — تصویر اصلی`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 640px"
                className="object-cover"
              />
              <div className="absolute right-3 top-3 flex gap-2">
                <VerificationBadge status={store.status} size="md" />
                {store.featured && (
                  <span className="rounded-full bg-brand px-3 py-1.5 text-[11px] font-bold text-white">
                    پیشنهاد خودرویار
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
              {gallery.slice(1).map((src, index) => (
                <div key={src + index} className="relative h-32 overflow-hidden rounded-2xl border border-line sm:h-[176px]">
                  <Image
                    src={src}
                    alt={`${store.name} — تصویر ${toFa(index + 2)}`}
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                  {index === 1 && (
                    <span className="absolute inset-0 grid place-items-center bg-ink/45 text-xs font-bold text-white">
                      +{toFa(4)} تصویر دیگر
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold"
                style={{ backgroundColor: `${category?.color}14`, color: category?.color }}
              >
                {category?.title}
              </span>
              <Stars rating={store.rating} reviews={store.reviews} />
              <span className="flex items-center gap-1 text-[11px] text-muted">
                <Wallet className="h-3.5 w-3.5" />
                سطح قیمت: {["اقتصادی", "متوسط", "ویژه"][store.priceLevel - 1]}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-muted">
                <Building2 className="h-3.5 w-3.5" />
                از سال {store.since}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold leading-[1.5] sm:text-[32px]">{store.name}</h1>
            <p className="mt-3 flex items-start gap-2 text-sm leading-7 text-muted">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-brand" />
              {store.city}، {store.district} — {store.address}
            </p>
            <p className="mt-4 text-sm leading-8 text-ink-soft">{store.description}</p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="card-surface p-5">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <Sparkles className="h-4 w-4 text-brand" />
                خدمات ارائه‌شده
              </h2>
              <ul className="mt-3 grid gap-2">
                {store.services.map((service) => (
                  <li key={service} className="flex items-center gap-2 text-xs text-ink-soft">
                    <CheckCircle2 className="h-3.5 w-3.5 text-verified" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-surface p-5">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <CarFront className="h-4 w-4 text-brand" />
                برندهای تحت پوشش
              </h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {store.brands.map((brand) => (
                  <span key={brand} className="rounded-lg bg-paper px-2.5 py-1.5 text-[11px] text-ink-soft">
                    {brand}
                  </span>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-line pt-3 text-[11px] text-muted">
                <p className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-brand" /> ساعات کاری: {store.hours}
                </p>
                <p className="flex items-center gap-1.5">
                  {store.pickup ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-verified" /> امکان تحویل خودرو در محل
                    </>
                  ) : (
                    <>
                      <Info className="h-3.5 w-3.5 text-muted" /> پذیرش حضوری خودرو
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold">
              <MapPin className="h-4 w-4 text-brand" />
              موقعیت روی نقشه و مسیریابی
            </h2>
            <MapPanel lat={store.lat} lng={store.lng} label={store.name} address={store.address} height={340} />
          </div>

          <div className="mt-7 card-surface p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-verified">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold">وضعیت راستی‌آزمایی اطلاعات</h2>
                <p className="mt-1.5 text-xs leading-6 text-muted">
                  {store.status === "verified"
                    ? `اطلاعات این مرکز در تاریخ ${store.lastCheck} با تماس تلفنی تأیید و توسط اپراتور خودرویار بررسی شده است. نام مالک/مدیر ثبت‌شده: ${store.ownerName}.`
                    : store.status === "pending"
                      ? `درخواست اصلاح اطلاعات این مرکز در تاریخ ${store.lastCheck} ثبت شده و در صف بررسی اپراتور است.`
                      : "اطلاعات این مرکز هنوز راستی‌آزمایی نشده است؛ لطفاً پیش از مراجعه، تلفنی هماهنگ کنید."}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-paper px-2 py-1 text-muted">
                    <CalendarCheck className="h-3.5 w-3.5" />
                    آخرین بررسی: {store.lastCheck ?? "انجام نشده"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-paper px-2 py-1 text-muted">
                    کد پرونده: {toFa(store.id.replace(/\D/g, ""))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card-surface p-5">
            <p className="text-[11px] text-muted">تماس با مرکز</p>
            <a href={`tel:${store.phone}`} className="mt-1 block text-xl font-extrabold tracking-wide text-ink" dir="ltr">
              {toFa(store.phone)}
            </a>
            <div className="mt-3 grid gap-2">
              <a href={`tel:${store.mobile}`} className="btn-outline py-2.5 text-xs">
                <Phone className="h-4 w-4" />
                تماس با موبایل مدیر
              </a>
              <a
                href={`https://wa.me/98${store.mobile.replace(/^0/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline py-2.5 text-xs"
              >
                <MessageCircle className="h-4 w-4" />
                گفتگو در واتساپ
              </a>
              <a href={`tel:${store.phone}`} className="btn-primary py-2.5 text-xs">
                <Phone className="h-4 w-4" />
                تماس و رزرو نوبت
              </a>
            </div>

            <div className="mt-4 space-y-2 border-t border-line pt-4 text-[11px] text-muted">
              <p className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-brand" /> {store.hours}
              </p>
              <p className="flex items-start gap-1.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" /> {store.address}
              </p>
            </div>

            <div className="mt-4 border-t border-line pt-4">
              <p className="mb-2 text-[11px] font-semibold text-ink-soft">مسیریابی سریع</p>
              <div className="grid grid-cols-3 gap-2">
                {links.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-line py-2 text-center text-[11px] font-bold text-ink transition hover:border-brand/50 hover:text-brand-dark"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-dashed border-brand/30 bg-brand-soft p-5">
            <Link2 className="h-5 w-5 text-brand-dark" />
            <h2 className="mt-2 text-sm font-bold text-brand-dark">مدیر این فروشگاه هستید؟</h2>
            <p className="mt-1.5 text-[11px] leading-6 text-ink-soft">
              با لینک اختصاصی و امن، اطلاعات مرکز خود را بازبینی و اصلاح کنید.
            </p>
            <Link href={`/verify/${store.verifyToken}`} className="btn-dark mt-3 w-full py-2.5 text-xs">
              بازبینی اطلاعات مرکز
            </Link>
          </div>

          <div className="card-surface p-5">
            <h2 className="text-sm font-bold">نشانه‌های اعتماد</h2>
            <ul className="mt-3 space-y-2.5 text-[11px] text-muted">
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-verified" /> تأیید تلفنی اطلاعات توسط اپراتور
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-verified" /> ثبت تاریخ آخرین بازرسی
              </li>
              <li className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-verified" /> امکان گزارش اطلاعات نادرست
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <div className="mt-14">
          <SectionHeading eyebrow="مراکز مشابه" title="شاید این مراکز هم به کارتان بیاید" href="/stores" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <StoreCard key={item.id} store={item} />
            ))}
          </div>
        </div>
      )}

      <p className="mt-10 rounded-2xl border border-line bg-white/60 p-4 text-[11px] leading-6 text-muted">
        اطلاعات این صفحه بر اساس پرونده شماره {num(Number(store.id.replace(/\D/g, "")))} و آخرین بازبینی
        اپراتور نمایش داده می‌شود. پیش از مراجعه، ساعات کاری را تلفنی تأیید کنید.
      </p>
    </div>
  );
}
