import Link from "next/link";
import { ArrowUpLeft, Mail, MapPin, PhoneCall } from "lucide-react";
import { Logo } from "@/components/Logo";
import { categories } from "@/data/catalog";

const platformLinks = [
  { href: "/stores", label: "جستجوی فروشگاه‌ها" },
  { href: "/centers", label: "مراکز ضروری خودرو" },
  { href: "/garage", label: "شناسنامه دیجیتال خودرو" },
  { href: "/register", label: "ثبت فروشگاه" },
];

const aboutLinks = [
  { href: "/proposal", label: "پیشنهاد اجرای پروژه" },
  { href: "/proposal#architecture", label: "معماری فنی" },
  { href: "/proposal#timeline", label: "زمان‌بندی و هزینه" },
  { href: "/admin", label: "پنل مدیریت" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-ink text-white">
      <div className="mesh-dark absolute inset-0" aria-hidden="true" />
      <div className="container-x relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
              پلتفرم یکپارچه خدمات و اطلاعات خودرو در ایران؛ از پیدا کردن مرکز خدمات
              تأییدشده تا نگهداری شناسنامه دیجیتال خودرو، همه روی یک زیرساخت واحد.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["فارسی و RTL", "معماری توسعه‌پذیر", "داده تأییدشده"].map((tag) => (
                <span key={tag} className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/70">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-white">پلتفرم</h3>
            <ul className="space-y-3 text-sm text-white/60">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-white">خدمات پرطرفدار</h3>
            <ul className="space-y-3 text-sm text-white/60">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/stores?category=${cat.id}`} className="transition hover:text-brand">
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-white">ارتباط با ما</h3>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                تهران، خیابان ولیعصر، برج خودرویار، طبقه ۷
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 shrink-0 text-brand" />
                <a href="tel:02191000000" dir="ltr" className="transition hover:text-brand">
                  021-91000000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-brand" />
                <a href="mailto:info@khodroyar.ir" className="transition hover:text-brand">
                  info@khodroyar.ir
                </a>
              </li>
            </ul>
            <div className="mt-5 space-y-2 text-sm">
              {aboutLinks.slice(0, 3).map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center gap-1.5 text-white/45 hover:text-white">
                  <ArrowUpLeft className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row">
          <p>© ۱۴۰۵ خودرویار — مالکیت کامل سورس‌کد و دیتابیس متعلق به کارفرما است.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span>فاز اول • نسخه نمایشی داده‌محور</span>
            <Link href="/proposal#delivery" className="hover:text-white">
              شرایط تحویل سورس کد
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
