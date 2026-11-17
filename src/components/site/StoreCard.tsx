import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Navigation } from "lucide-react";
import { categories } from "@/data/catalog";
import { storeGallery } from "@/data/images";
import { num } from "@/lib/format";
import type { Store } from "@/lib/types";
import { Stars, VerificationBadge } from "@/components/site/ui";

export function StoreCard({ store, compact = false }: { store: Store; compact?: boolean }) {
  const category = categories.find((c) => c.id === store.categoryId);
  const cover = storeGallery(store.coverIndex, 1)[0];

  return (
    <article className="group card-surface overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link href={`/stores/${store.slug}`} className="block">
        <div className={`relative overflow-hidden ${compact ? "h-36" : "h-44"}`}>
          <Image
            src={cover}
            alt={`تصویر ${store.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute right-3 top-3">
            <VerificationBadge status={store.status} />
          </div>
          {store.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-white">
              پیشنهاد خودرویار
            </span>
          )}
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-white">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2 py-1 text-[11px] font-medium backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
              {category?.short}
            </span>
            <Stars rating={store.rating} reviews={store.reviews} />
          </div>
        </div>
      </Link>

      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-bold text-ink">
          <Link href={`/stores/${store.slug}`} className="hover:text-brand-dark">
            {store.name}
          </Link>
        </h3>
        <div className="mt-2 space-y-1.5 text-xs text-muted">
          <p className="flex items-start gap-1.5">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
            <span className="line-clamp-1">
              {store.city}، {store.district} — {store.address}
            </span>
          </p>
          <p className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0 text-brand" />
            {store.hours}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {store.services.slice(0, 2).map((service) => (
            <span key={service} className="rounded-lg bg-paper px-2 py-1 text-[11px] text-ink-soft">
              {service}
            </span>
          ))}
          {store.services.length > 2 && (
            <span className="rounded-lg bg-paper px-2 py-1 text-[11px] text-muted">
              +{num(store.services.length - 2)} خدمت
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <span className="text-[11px] text-muted">
            آخرین بازرسی: {store.lastCheck ? store.lastCheck : "در انتظار بررسی"}
          </span>
          <Link
            href={`/stores/${store.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-dark"
          >
            <Navigation className="h-3.5 w-3.5" />
            جزئیات و مسیریابی
          </Link>
        </div>
      </div>
    </article>
  );
}
