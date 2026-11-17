import { MapPin, Navigation } from "lucide-react";
import { mapEmbed, routeLinks, toFa } from "@/lib/format";

export function MapPanel({
  lat,
  lng,
  label,
  address,
  height = 300,
}: {
  lat: number;
  lng: number;
  label: string;
  address?: string;
  height?: number;
}) {
  const links = routeLinks(lat, lng, label);

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white">
      <div className="relative w-full bg-paper-deep" style={{ height }}>
        <iframe
          title={`نقشه ${label}`}
          src={mapEmbed(lat, lng)}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-xl bg-white/95 px-3 py-2 text-[11px] font-semibold text-ink shadow-card">
          <MapPin className="mb-0.5 inline h-3.5 w-3.5 text-brand" /> {label}
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        {address ? (
          <p className="flex items-start gap-2 text-xs leading-6 text-muted">
            <MapPin className="mt-1 h-3.5 w-3.5 shrink-0 text-brand" />
            {address}
          </p>
        ) : (
          <span className="text-xs text-muted">
            مختصات: {toFa(lat.toFixed(5))} ، {toFa(lng.toFixed(5))}
          </span>
        )}
        <div className="flex shrink-0 flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted">
            <Navigation className="h-3.5 w-3.5" />
            مسیریابی:
          </span>
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-bold text-ink transition hover:border-brand/50 hover:text-brand-dark"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
