const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toFa(value: string | number): string {
  return String(value).replace(/\d/g, (d) => faDigits[Number(d)]);
}

export function num(value: number): string {
  return toFa(value.toLocaleString("en-US"));
}

export function toman(value: number): string {
  if (!value) return "۰ تومان";
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const text = Number.isInteger(millions) ? millions.toString() : millions.toFixed(1);
    return `${toFa(text)} میلیون تومان`;
  }
  return `${num(value)} تومان`;
}

export function phoneFa(raw: string): string {
  return toFa(raw.replace(/^0/, "۰"));
}

export function consumption(liters: number, distance: number): number {
  if (distance <= 0) return 0;
  return Math.round((liters / distance) * 100 * 10) / 10;
}

export function todayJalali(): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export function mapEmbed(lat: number, lng: number): string {
  const d = 0.012;
  const bbox = [lng - d, lat - d, lng + d, lat + d].join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function routeLinks(lat: number, lng: number, label: string) {
  const enc = encodeURIComponent(label);
  return [
    { name: "گوگل مپ", href: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, color: "text-sky-700" },
    { name: "بلد", href: `https://balad.ir/directions?destination=${lat},${lng}&destinationTitle=${enc}`, color: "text-emerald-700" },
    { name: "نشان", href: `https://neshan.org/maps/@${lat},${lng},17z`, color: "text-orange-700" },
  ];
}

export function normalizeText(text: string): string {
  return text
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[ًٌٍَُِّْ]/g, "")
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function slugify(text: string): string {
  return text
    .trim()
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export function randomId(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
