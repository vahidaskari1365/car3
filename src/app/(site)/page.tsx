import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarCheck,
  CarFront,
  CheckCircle2,
  ClipboardList,
  Database,
  FileImage,
  Fuel,
  Gauge,
  LayoutDashboard,
  Link2,
  MapPin,
  Phone,
  Route,
  ShieldCheck,
  Sparkles,
  Timer,
  UserCog,
  Wrench,
} from "lucide-react";
import { SearchBox } from "@/components/site/SearchBox";
import { StoreCard } from "@/components/site/StoreCard";
import { MapPanel } from "@/components/site/MapPanel";
import { SectionHeading, Stat, VerificationBadge } from "@/components/site/ui";
import { CategoryIcon } from "@/components/CategoryIcon";
import { brands, categories, centerTypeMeta, cities } from "@/data/catalog";
import { images } from "@/data/images";
import { seedCenters, seedStores } from "@/data/stores";
import { roadmap } from "@/data/proposal";
import { num, toFa } from "@/lib/format";

const stats = [
  { value: `${num(seedStores.length)} مرکز`, label: "فروشگاه و مرکز خدمات ثبت‌شده" },
  { value: `${num(seedCenters.length)} مرکز`, label: "جایگاه سوخت و مرکز ضروری" },
  { value: `${num(cities.length)} شهر`, label: "پوشش شهری فاز اول" },
  { value: `${num(categories.length)} دسته`, label: "دسته‌بندی تخصصی خدمات" },
];

const garageFeatures = [
  { icon: CarFront, title: "چند خودرو، یک حساب", desc: "برای هر خودرو پرونده مستقل با مشخصات کامل فنی و کیلومتر." },
  { icon: Wrench, title: "سوابق سرویس و تعمیر", desc: "تاریخ، کیلومتر، هزینه و توضیحات هر سرویس در یک خط زمانی." },
  { icon: Fuel, title: "سوخت‌گیری و مصرف", desc: "محاسبه خودکار مصرف لیتر در ۱۰۰ کیلومتر و هزینه سوخت." },
  { icon: FileImage, title: "آرشیو فاکتور و مدارک", desc: "تصویر فاکتورها، بیمه‌نامه و کارت خودرو روی پرونده دیجیتال." },
];

const adminFeatures = [
  { icon: Database, title: "دیتابیس مرکزی", desc: "یک منبع داده واحد برای فروشگاه‌ها، خدمات، مراکز و خودروها." },
  { icon: ClipboardList, title: "ورود گروهی Excel/CSV", desc: "ثبت دسته‌ای اطلاعات فروشگاه‌ها با اعتبارسنجی و پیش‌نمایش." },
  { icon: ShieldCheck, title: "راستی‌آزمایی تلفنی", desc: "ثبت نتیجه تماس، تاریخ آخرین بررسی و نشان تأیید در سایت." },
  { icon: UserCog, title: "اپراتور و سطح دسترسی", desc: "نقش‌های مدیر، اپراتور راستی‌آزمایی، محتوا و پشتیبان." },
];

export default function HomePage() {
  const featuredStores = [...seedStores]
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating)
    .slice(0, 6);
  const verifiedStores = seedStores.filter((s) => s.status === "verified").length;
  const pendingStores = seedStores.filter((s) => s.status === "pending").length;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-teal/10 blur-3xl" />
          <div className="dot-grid absolute inset-0 opacity-40" />
        </div>

        <div className="container-x grid items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3.5 py-1.5 text-xs font-bold text-brand-dark">
              <Sparkles className="h-3.5 w-3.5" />
              فاز اول پلتفرم یکپارچه خدمات و اطلاعات خودرو
            </span>

            <h1 className="mt-5 text-balance text-[34px] font-extrabold leading-[1.35] text-ink sm:text-[46px] lg:text-[52px]">
              همه‌ی خودرو،
              <br />
              در <span className="relative inline-block text-brand">یک پلتفرم<svg className="absolute -bottom-2 right-0 h-3 w-full text-brand/40" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 9c40-6 90-8 196-3" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" /></svg></span>{" "}
              یکپارچه
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-8 text-muted sm:text-base">
              مراکز خدمات تأییدشده را پیدا کنید، جایگاه سوخت و تعویض پلاک نزدیک خود را
              مسیریابی کنید و سوابق سرویس خودروی خود را در یک شناسنامه دیجیتال امن نگه دارید.
            </p>

            <div className="mt-7 max-w-2xl">
              <SearchBox />
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                <span className="font-semibold text-ink-soft">جستجوهای پرطرفدار:</span>
                {[
                  { label: "تعمیرگاه", href: "/stores?category=mechanic" },
                  { label: "تعویض روغن", href: "/stores?category=oil" },
                  { label: "لاستیک و رینگ", href: "/stores?category=tire" },
                  { label: "لوازم یدکی", href: "/stores?category=parts" },
                  { label: "معاینه فنی", href: "/stores?category=inspection" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="rounded-full border border-line bg-white/70 px-2.5 py-1 transition hover:border-brand/40 hover:text-brand-dark"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-9 grid max-w-2xl grid-cols-2 gap-6 border-t border-line pt-7 sm:grid-cols-4">
              {stats.map((item) => (
                <Stat key={item.label} value={item.value} label={item.label} />
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="relative h-[420px] overflow-hidden rounded-[2rem] border border-white shadow-lift sm:h-[500px]">
              <Image
                src={images.hero}
                alt="مکانیک متخصص در حال بررسی خودرو در تعمیرگاه تأییدشده خودرویار"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/20 bg-ink/60 p-4 text-white backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">شبکه مراکز تأییدشده</p>
                    <p className="mt-1 text-[11px] text-white/70">
                      {num(verifiedStores)} مرکز با تأیید تلفنی و بازدید میدانی
                    </p>
                  </div>
                  <BadgeCheck className="h-9 w-9 text-brand" />
                </div>
              </div>
            </div>

            <div className="absolute -right-3 top-6 w-[220px] rounded-2xl border border-line bg-white/95 p-3.5 shadow-lift backdrop-blur sm:-right-8">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-ink">تعمیرگاه پارس‌آوران</span>
                <VerificationBadge status="verified" />
              </div>
              <p className="mt-2 flex items-center gap-1 text-[10px] text-muted">
                <MapPin className="h-3 w-3 text-brand" /> تهران، سعادت‌آباد
              </p>
              <p className="mt-1 flex items-center gap-1 text-[10px] text-muted" dir="ltr">
                <Phone className="h-3 w-3 text-brand" /> 021-22334455
              </p>
            </div>

            <div className="absolute -left-2 bottom-16 w-[210px] rounded-2xl border border-line bg-white/95 p-3.5 shadow-lift backdrop-blur sm:-left-8">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-soft text-teal">
                  <Gauge className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-bold">پژو ۲۰۷ پانوراما</p>
                  <p className="text-[10px] text-muted">کیلومتر: {toFa("52,400")}</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper-deep">
                <div className="h-full w-[68%] rounded-full bg-brand" />
              </div>
              <p className="mt-1.5 text-[10px] text-muted">سرویس بعدی: ۳٬۲۰۰ کیلومتر دیگر</p>
            </div>
          </div>
        </div>

        {/* BRANDS */}
        <div className="border-y border-line bg-white/60 py-5">
          <div className="container-x flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <span className="shrink-0 text-xs font-bold text-ink-soft">پوشش تخصصی برندها:</span>
            <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto sm:justify-end">
              {brands.map((brand) => (
                <span
                  key={brand}
                  className="whitespace-nowrap rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-muted"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-x py-16 sm:py-20">
        <SectionHeading
          eyebrow="دسته‌بندی خدمات"
          title="هر خدمتی که خودروی شما لازم دارد"
          desc="از تعمیرات تخصصی و سرویس دوره‌ای تا قطعات، دیتیلینگ و امداد خودرو؛ با فیلتر شهر و برند به مرکز مناسب برسید."
          href="/stores"
          linkLabel="همه مراکز خدمات"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => {
            const count = seedStores.filter((s) => s.categoryId === cat.id).length;
            return (
              <Link
                key={cat.id}
                href={`/stores?category=${cat.id}`}
                className="group card-surface relative overflow-hidden p-4 transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lift"
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-xl"
                  style={{ backgroundColor: `${cat.color}14`, color: cat.color }}
                >
                  <CategoryIcon name={cat.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-bold leading-6 text-ink">{cat.title}</h3>
                <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-muted">{cat.blurb}</p>
                <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
                  <span className="text-[10px] text-muted">
                    {count > 0 ? `${toFa(count)} مرکز` : "به‌زودی"}
                  </span>
                  <ArrowLeft className="h-3.5 w-3.5 text-brand opacity-0 transition group-hover:opacity-100" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* VERIFIED STORES */}
      <section className="border-y border-line bg-white/50 py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="اطلاعات تأییدشده"
            title="مراکز خدمات برگزیده با نشان تأیید"
            desc={`${num(verifiedStores)} مرکز تأییدشده و ${num(pendingStores)} پرونده در حال بررسی. وضعیت تأیید هر مرکز و تاریخ آخرین بازرسی، شفاف و قابل مشاهده است.`}
            href="/stores"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4">
            <p className="flex items-center gap-2 text-xs text-muted">
              <ShieldCheck className="h-4 w-4 text-verified" />
              صاحبان فروشگاه از طریق لینک اختصاصی و امن، اطلاعات خود را اصلاح می‌کنند و اپراتور تأیید نهایی را انجام می‌دهد.
            </p>
            <Link href="/verify/vrf-tire-barez-548" className="btn-outline px-4 py-2.5">
              <Link2 className="h-4 w-4" />
              مشاهده نمونه لینک راستی‌آزمایی
            </Link>
          </div>
        </div>
      </section>

      {/* ESSENTIAL CENTERS */}
      <section className="container-x py-16 sm:py-20">
        <SectionHeading
          eyebrow="مراکز ضروری خودرو"
          title="سوخت، تعویض پلاک و معاینه فنی نزدیک شما"
          desc="آدرس دقیق، ساعات کاری و موقعیت روی نقشه؛ با یک کلیک مسیر را در بلد، نشان یا گوگل مپ باز کنید."
          href="/centers"
          linkLabel="همه مراکز ضروری"
        />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <MapPanel
            lat={seedCenters[0].lat}
            lng={seedCenters[0].lng}
            label={seedCenters[0].name}
            address={seedCenters[0].address}
            height={380}
          />
          <div className="space-y-3">
            {seedCenters.slice(0, 4).map((center) => {
              const meta = centerTypeMeta[center.type];
              return (
                <div
                  key={center.id}
                  className="card-surface flex items-start gap-3 p-4 transition hover:border-brand/30"
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                    style={{ backgroundColor: `${meta.color}14`, color: meta.color }}
                  >
                    <CategoryIcon name={meta.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-sm font-bold">{center.name}</h3>
                      <span className="shrink-0 rounded-md bg-paper px-2 py-0.5 text-[10px] text-muted">
                        {meta.title}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-[11px] text-muted">
                      {center.city}، {center.district} — {center.address}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[10px] text-muted">
                        <Timer className="h-3 w-3" /> {center.hours}
                      </span>
                      <Link
                        href={`/centers?focus=${center.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-dark"
                      >
                        <Route className="h-3 w-3" /> مسیریابی
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DIGITAL GARAGE */}
      <section className="container-x py-6 sm:py-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink p-6 text-white sm:p-10 lg:p-14">
          <div className="mesh-dark absolute inset-0" aria-hidden="true" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-bold text-white/70">
                <CarFront className="h-3.5 w-3.5 text-brand" />
                شناسنامه دیجیتال خودرو
              </span>
              <h2 className="mt-4 text-balance text-2xl font-extrabold leading-[1.5] sm:text-[34px]">
                تاریخچه خودروی شما، همیشه همراه‌تان
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-8 text-white/60">
                برای هر خودرو یک پرونده مستقل بسازید؛ سرویس‌ها، تعویض قطعات، سوخت‌گیری و
                فاکتورها را ثبت کنید و گزارش مصرف و هزینه‌ها را در یک نگاه ببینید.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {garageFeatures.map((feature) => (
                  <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                    <feature.icon className="h-4 w-4 text-brand" />
                    <p className="mt-2 text-xs font-bold">{feature.title}</p>
                    <p className="mt-1 text-[11px] leading-5 text-white/50">{feature.desc}</p>
                  </div>
                ))}
              </div>

              <Link href="/garage" className="btn-primary mt-7">
                ساخت شناسنامه خودرو
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-white/5 blur-2xl" aria-hidden="true" />
              <div className="relative rounded-3xl border border-white/10 bg-white p-4 text-ink shadow-lift sm:p-5">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-white">
                      <CarFront className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold">پژو ۲۰۷ پانوراما اتوماتیک</p>
                      <p className="text-[10px] text-muted">مدل ۱۴۰۲ • ۵۲٬۴۰۰ کیلومتر</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                    فعال
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { label: "هزینه سرویس", value: "۳۲ میلیون" },
                    { label: "مصرف میانگین", value: "۸٫۴ لیتر" },
                    { label: "سرویس ثبت‌شده", value: "۱۸" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-paper p-2.5 text-center">
                      <p className="text-[11px] font-extrabold text-ink">{item.value}</p>
                      <p className="mt-0.5 text-[9px] text-muted">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  {[
                    { title: "تعویض روغن و فیلتر", date: "۱۴۰۴/۱۱/۱۲", km: "۵۰٬۰۰۰", tag: "سرویس دوره‌ای" },
                    { title: "تعویض لنت جلو", date: "۱۴۰۴/۰۹/۰۳", km: "۴۶٬۲۰۰", tag: "ترمز" },
                    { title: "سوخت‌گیری — ۴۲ لیتر", date: "۱۴۰۴/۱۲/۰۵", km: "۵۲٬۱۰۰", tag: "سوخت" },
                  ].map((row) => (
                    <div key={row.title} className="flex items-center justify-between rounded-xl border border-line px-3 py-2">
                      <div>
                        <p className="text-[11px] font-bold">{row.title}</p>
                        <p className="mt-0.5 text-[9px] text-muted">
                          {row.date} • کیلومتر {row.km}
                        </p>
                      </div>
                      <span className="rounded-md bg-brand-soft px-2 py-0.5 text-[9px] font-semibold text-brand-dark">
                        {row.tag}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-line p-2.5">
                  <FileImage className="h-4 w-4 text-brand" />
                  <span className="text-[10px] text-muted">۲ فاکتور و ۱ بیمه‌نامه ثبت شده است</span>
                  <span className="mr-auto text-[10px] font-bold text-teal">مشاهده پرونده</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VERIFICATION FLOW */}
      <section className="container-x py-16 sm:py-20">
        <SectionHeading
          eyebrow="فرآیند راستی‌آزمایی"
          title="اطلاعات قابل اعتماد، با یک فرآیند شفاف"
          desc="هر مرکز خدمات پیش از انتشار نشان تأیید، سه مرحله را طی می‌کند و تاریخ آخرین بررسی روی صفحه فروشگاه نمایش داده می‌شود."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Phone,
              step: "۰۱",
              title: "تأیید تلفنی",
              desc: "اپراتور با شماره ثبت‌شده تماس می‌گیرد و نام مالک، آدرس، ساعات کاری و خدمات را تأیید می‌کند.",
            },
            {
              icon: Link2,
              step: "۰۲",
              title: "لینک اختصاصی مالک",
              desc: "برای صاحب فروشگاه لینک امن و یکتای اصلاح اطلاعات ارسال می‌شود؛ بدون نیاز به ثبت‌نام.",
            },
            {
              icon: CalendarCheck,
              step: "۰۳",
              title: "تأیید نهایی اپراتور",
              desc: "تغییرات در صف بازبینی قرار می‌گیرد و پس از تأیید، اطلاعات و تاریخ بازرسی در سایت به‌روز می‌شود.",
            },
          ].map((item) => (
            <div key={item.step} className="card-surface relative overflow-hidden p-6">
              <span className="absolute left-4 top-4 text-4xl font-extrabold text-paper-deep">{item.step}</span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand-dark">
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold">{item.title}</h3>
              <p className="mt-2 text-xs leading-6 text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-center">
          <p className="text-xs leading-6 text-muted">
            صاحب فروشگاه هستید؟ اطلاعات مرکز خود را ثبت کنید تا کارشناس ما با شما تماس بگیرد.
          </p>
          <div className="flex gap-2">
            <Link href="/register" className="btn-primary px-4 py-2.5">
              ثبت اطلاعات فروشگاه
            </Link>
            <Link href="/admin/verifications" className="btn-outline px-4 py-2.5">
              صف بررسی اپراتور
            </Link>
          </div>
        </div>
      </section>

      {/* ADMIN PREVIEW */}
      <section className="border-y border-line bg-white/60 py-16 sm:py-20">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="پنل مدیریت اختصاصی"
              title="مدیریت داده‌ها، بدون وابستگی به فایل اکسل پراکنده"
              desc="پنل اختصاصی خودرویار، مدیریت فروشگاه‌ها، ورود گروهی داده، راستی‌آزمایی و سطوح دسترسی اپراتورها را یک‌جا انجام می‌دهد."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {adminFeatures.map((f) => (
                <div key={f.title} className="rounded-2xl border border-line bg-white p-4">
                  <f.icon className="h-4 w-4 text-brand" />
                  <p className="mt-2 text-xs font-bold">{f.title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-muted">{f.desc}</p>
                </div>
              ))}
            </div>
            <Link href="/admin" className="btn-dark mt-6">
              <LayoutDashboard className="h-4 w-4" />
              ورود به پنل مدیریت
            </Link>
          </div>

          <div className="overflow-hidden rounded-3xl border border-line bg-paper-deep p-3 shadow-card">
            <div className="overflow-hidden rounded-2xl border border-line bg-white">
              <div className="flex items-center justify-between border-b border-line bg-ink px-4 py-3 text-white">
                <span className="flex items-center gap-2 text-xs font-bold">
                  <span className="h-2 w-2 rounded-full bg-brand" />
                  خودرویار / مدیریت فروشگاه‌ها
                </span>
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px]">۱۴۰۴/۱۲/۱۸</span>
              </div>
              <div className="grid grid-cols-3 gap-2 p-3">
                {[
                  { label: "کل مراکز", value: num(seedStores.length) },
                  { label: "تأییدشده", value: num(verifiedStores) },
                  { label: "در بررسی", value: num(pendingStores) },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-xl bg-paper p-2.5">
                    <p className="text-lg font-extrabold">{kpi.value}</p>
                    <p className="text-[10px] text-muted">{kpi.label}</p>
                  </div>
                ))}
              </div>
              <div className="px-3 pb-3">
                <div className="overflow-hidden rounded-xl border border-line">
                  <div className="grid grid-cols-[1fr_70px_74px] bg-paper px-3 py-2 text-[10px] font-bold text-muted">
                    <span>نام مرکز</span>
                    <span>وضعیت</span>
                    <span>آخرین بررسی</span>
                  </div>
                  {seedStores.slice(0, 4).map((store) => (
                    <div
                      key={store.id}
                      className="grid grid-cols-[1fr_70px_74px] items-center border-t border-line px-3 py-2.5 text-[11px]"
                    >
                      <span className="truncate font-semibold">{store.name}</span>
                      <VerificationBadge status={store.status} />
                      <span className="text-[10px] text-muted">{store.lastCheck ?? "—"}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-teal-soft px-3 py-2 text-[10px] font-semibold text-teal">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  همه تغییرات با ثبت اپراتور و تاریخ در گزارش فعالیت ذخیره می‌شود.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="container-x py-16 sm:py-20">
        <SectionHeading
          eyebrow="نقشه راه"
          title="فاز اول، پایه‌ی یک پلتفرم بزرگ‌تر"
          desc="همه ماژول‌های آینده روی همین دیتابیس مرکزی و همین زیرساخت افزوده می‌شوند؛ بدون نیاز به سایت یا سامانه جداگانه."
          href="/proposal"
          linkLabel="جزئیات پیشنهاد اجرا"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {roadmap.map((item, index) => (
            <div key={item.title} className="card-surface relative overflow-hidden p-5">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-paper px-2 py-1 text-[10px] font-bold text-muted">{item.phase}</span>
                <span className="text-xs font-extrabold text-brand">{toFa(`0${index + 1}`)}</span>
              </div>
              <h3 className="mt-3 text-sm font-bold">{item.title}</h3>
              <p className="mt-2 text-[11px] leading-6 text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-brand-dark via-brand to-[#ff9b4a] p-7 text-white sm:p-10">
          <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full border-[20px] border-white/10" />
          <div className="absolute -bottom-16 right-24 h-56 w-56 rounded-full border-[24px] border-white/10" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-balance text-2xl font-extrabold leading-[1.5] sm:text-3xl">
                آماده‌اید خودروی خود را هوشمندتر مدیریت کنید؟
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-7 text-white/80">
                شناسنامه دیجیتال بسازید، مراکز تأییدشده نزدیک خود را پیدا کنید و برای ثبت
                فروشگاه خود درخواست دهید.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/garage" className="btn bg-white text-brand-dark hover:bg-white/90">
                <CarFront className="h-4 w-4" />
                ساخت شناسنامه
              </Link>
              <Link href="/stores" className="btn border border-white/40 text-white hover:bg-white/10">
                <MapPin className="h-4 w-4" />
                جستجوی مراکز
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
