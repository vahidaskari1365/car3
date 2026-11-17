import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  CircleDot,
  Clock,
  Coins,
  Database,
  FileCheck2,
  Layers,
  Lock,
  Rocket,
  ServerCog,
  Sparkles,
  Table2,
} from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import {
  architectureLayers,
  dbTables,
  deliveryTerms,
  portfolio,
  roadmap,
  supportPlans,
  techStack,
  timeline,
} from "@/data/proposal";
import { toFa } from "@/lib/format";

export const metadata: Metadata = {
  title: "پیشنهاد اجرای فاز اول پلتفرم خدمات خودرو",
  description:
    "پیشنهاد فنی و اجرایی فاز اول پلتفرم خودرویار: تکنولوژی‌های پیشنهادی، معماری یکپارچه، ساختار دیتابیس مرکزی، زمان‌بندی ۱۸ هفته‌ای، هزینه هر مرحله و شرایط تحویل سورس کد.",
};

const total = "۱٬۳۲۰ میلیون تومان";

export default function ProposalPage() {
  return (
    <div className="pb-10">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line bg-ink text-white">
        <div className="mesh-dark absolute inset-0" aria-hidden="true" />
        <div className="dot-grid absolute inset-0 opacity-[0.06]" aria-hidden="true" />
        <div className="container-x relative py-14 sm:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-bold text-white/70">
                <Sparkles className="h-3.5 w-3.5 text-brand" />
                پیشنهاد مجری — نسخه ۱٫۰
              </span>
              <h1 className="mt-5 text-balance text-3xl font-extrabold leading-[1.45] sm:text-[42px]">
                پیشنهاد اجرای فاز اول
                <br />
                پلتفرم خدمات و اطلاعات خودرو
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/60">
                طراحی و پیاده‌سازی یک پلتفرم یکپارچه، توسعه‌پذیر و فارسی شامل پنل مدیریت
                اختصاصی، دیتابیس مرکزی، سیستم راستی‌آزمایی فروشگاه‌ها، وب‌سایت عمومی و
                شناسنامه دیجیتال خودرو — همه روی یک زیرساخت واحد.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {[
                  { icon: Clock, text: "۱۸ هفته اجرا" },
                  { icon: Coins, text: total },
                  { icon: Database, text: "دیتابیس مرکزی" },
                  { icon: FileCheck2, text: "تحویل کامل سورس" },
                ].map((item) => (
                  <span key={item.text} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/80">
                    <item.icon className="h-3.5 w-3.5 text-brand" />
                    {item.text}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                <Link href="/proposal#timeline" className="btn-primary">
                  زمان‌بندی و هزینه
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <Link href="/admin" className="btn border border-white/25 text-white hover:bg-white/10">
                  مشاهده نمونه پنل مدیریت
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <CircleDot className="h-4 w-4 text-brand" />
                خلاصه پیشنهاد
              </h2>
              <ul className="mt-4 space-y-3 text-[11px] leading-6 text-white/60">
                {[
                  "پنل مدیریت اختصاصی با ورود گروهی داده و سطوح دسترسی",
                  "راستی‌آزمایی تلفنی + لینک امن اختصاصی مالک فروشگاه",
                  "وب‌سایت عمومی فارسی، واکنش‌گرا و سئو‌محور",
                  "شناسنامه دیجیتال خودرو با سرویس، سوخت و مدارک",
                  "معماری ماژولار برای بازارگاه و خرید امن در فازهای بعد",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-4 text-center">
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-lg font-extrabold">۶</p>
                  <p className="text-[10px] text-white/50">فاز اجرایی</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-lg font-extrabold">۱۲</p>
                  <p className="text-[10px] text-white/50">جدول دیتابیس پایه</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH */}
      <section className="container-x py-14">
        <span className="text-xs font-bold text-brand-dark">۰۱ — تکنولوژی‌های پیشنهادی</span>
        <h2 className="mt-2 text-2xl font-extrabold leading-[1.5] sm:text-[30px]">انتخاب فناوری با تمرکز بر پایداری و توسعه‌پذیری</h2>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-muted">
          همه اجزای فاز اول با فناوری‌های بالغ و متن‌باز پیاده‌سازی می‌شوند؛ به‌گونه‌ای که
          ماژول‌های آینده (بازارگاه، پرداخت، پیک) روی همین بستر اضافه شوند.
        </p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((tech) => (
            <div key={tech.title} className="card-surface p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand-dark">
                  <CategoryIcon name={tech.icon} className="h-5 w-5" />
                </span>
                <span className="rounded-md bg-paper px-2 py-1 text-[10px] text-muted">{tech.role}</span>
              </div>
              <h3 className="mt-3 text-sm font-bold">{tech.title}</h3>
              <p className="mt-2 text-[11px] leading-6 text-muted">{tech.why}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section id="architecture" className="border-y border-line bg-white/60 py-14">
        <div className="container-x">
          <span className="text-xs font-bold text-brand-dark">۰۲ — معماری فنی و ساختار دیتابیس</span>
          <h2 className="mt-2 text-2xl font-extrabold leading-[1.5] sm:text-[30px]">یک دیتابیس مرکزی، چند لایه مستقل</h2>
          <p className="mt-3 max-w-3xl text-sm leading-8 text-muted">
            معماری لایه‌ای با API مرکزی؛ پنل مدیریت، سایت عمومی و اپلیکیشن‌های آینده همه از یک
            منبع داده و یک مجموعه سرویس استفاده می‌کنند. تغییر در یک ماژول، سایر ماژول‌ها را
            نمی‌شکند و افزودن قابلیت جدید نیازی به سامانه جداگانه ندارد.
          </p>

          <div className="mt-7 grid gap-4 lg:grid-cols-4">
            {architectureLayers.map((layer, index) => (
              <div key={layer.title} className="card-surface relative p-5">
                <span className="absolute left-4 top-4 text-xs font-extrabold text-line">{toFa(`0${index + 1}`)}</span>
                <Layers className="h-5 w-5 text-brand" />
                <h3 className="mt-3 text-sm font-bold">{layer.title}</h3>
                <p className="mt-2 text-[11px] leading-6 text-muted">{layer.desc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {layer.items.map((item) => (
                    <span key={item} className="rounded-md bg-paper px-2 py-1 text-[10px] text-ink-soft">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="card-surface overflow-hidden">
              <div className="flex items-center gap-2 border-b border-line bg-paper/60 px-5 py-3">
                <Table2 className="h-4 w-4 text-brand" />
                <h3 className="text-sm font-bold">جداول پایه دیتابیس مرکزی</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>جدول</th>
                      <th>کاربرد</th>
                      <th>ستون‌های کلیدی</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbTables.map((table) => (
                      <tr key={table.name}>
                        <td className="whitespace-nowrap font-mono text-[11px] font-bold text-brand-dark" dir="ltr">{table.name}</td>
                        <td className="text-[11px] text-ink-soft">{table.desc}</td>
                        <td className="text-[10px] text-muted" dir="ltr">{table.columns}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <div className="card-surface p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold">
                  <ServerCog className="h-4 w-4 text-brand" /> جریان داده راستی‌آزمایی
                </h3>
                <ol className="mt-3 space-y-2.5 text-[11px] leading-6 text-muted">
                  {[
                    "ثبت اطلاعات توسط اپراتور یا فایل Excel/CSV",
                    "ایجاد پرونده و توکن یکتای لینک اختصاصی مالک",
                    "تماس تلفنی و ثبت نتیجه در جدول verifications",
                    "ارسال لینک امن و ثبت درخواست در change_requests",
                    "بازبینی اپراتور و به‌روزرسانی stores + تاریخ بررسی",
                    "انتشار نشان تأیید و اطلاعات نهایی در وب‌سایت",
                  ].map((step, index) => (
                    <li key={step} className="flex items-start gap-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft text-[10px] font-bold text-brand-dark">{toFa(index + 1)}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="card-surface p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold">
                  <Lock className="h-4 w-4 text-brand" /> امنیت و دسترسی
                </h3>
                <ul className="mt-3 space-y-2 text-[11px] text-muted">
                  {[
                    "احراز هویت اپراتور با نقش و مجوز مجزا (RBAC)",
                    "توکن یکتا، غیرقابل حدس و محدود به زمان برای لینک مالک",
                    "لاگ کامل تغییرات و امکان بازگردانی نسخه",
                    "پشتیبان‌گیری روزانه و رمزنگاری اسناد",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-verified" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE & PRICE */}
      <section id="timeline" className="container-x py-14">
        <span className="text-xs font-bold text-brand-dark">۰۳ و ۰۴ — زمان‌بندی و هزینه هر مرحله</span>
        <h2 className="mt-2 text-2xl font-extrabold leading-[1.5] sm:text-[30px]">اجرای مرحله‌ای در ۱۸ هفته</h2>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-muted">
          هر فاز پس از تأیید کارفرما آغاز می‌شود. پرداخت هر مرحله بر اساس تحویل خروجی
          قابل مشاهده و تست انجام می‌گیرد.
        </p>

        <div className="mt-7 space-y-3">
          {timeline.map((phase, index) => (
            <div key={phase.phase} className="card-surface grid gap-4 p-5 lg:grid-cols-[200px_1fr_180px] lg:items-center">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-xs font-extrabold text-white">
                  {toFa(`0${index + 1}`)}
                </span>
                <div>
                  <p className="text-xs font-extrabold">{phase.phase.split("—")[0]}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted">
                    <Clock className="h-3 w-3" /> {phase.weeks}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {phase.items.map((item) => (
                  <span key={item} className="rounded-lg bg-paper px-2.5 py-1.5 text-[10px] text-ink-soft">{item}</span>
                ))}
              </div>
              <div className="rounded-xl bg-brand-soft px-3 py-2.5 text-center">
                <p className="text-xs font-extrabold text-brand-dark">{phase.price}</p>
                <p className="text-[10px] text-brand-dark/70">هزینه فاز</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-2xl bg-ink p-5 text-white sm:flex-row sm:items-center">
          <p className="text-xs leading-6 text-white/70">
            جمع هزینه فاز اول: <span className="font-extrabold text-white">{total}</span> — با امکان
            تفکیک پرداخت به‌صورت مرحله‌ای و بر اساس تأیید کارفرما.
          </p>
          <Link href="/register" className="btn bg-brand text-white hover:bg-brand-dark">
            شروع هماهنگی
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="border-y border-line bg-white/60 py-14">
        <div className="container-x">
          <span className="text-xs font-bold text-brand-dark">۰۵ — نمونه‌کارها و سوابق اجرایی</span>
          <h2 className="mt-2 text-2xl font-extrabold leading-[1.5] sm:text-[30px]">تجربه اجرای پلتفرم‌های داده‌محور و پنل‌های مدیریتی</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {portfolio.map((item) => (
              <div key={item.title} className="card-surface p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-soft text-teal">
                  <CategoryIcon name={item.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-bold">{item.title}</h3>
                <p className="mt-2 text-[11px] leading-6 text-muted">{item.desc}</p>
                <p className="mt-3 inline-flex items-center gap-1 rounded-lg bg-paper px-2.5 py-1.5 text-[10px] font-bold text-ink-soft">
                  <BadgeCheck className="h-3.5 w-3.5 text-verified" />
                  {item.metric}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT & DELIVERY */}
      <section id="delivery" className="container-x py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <span className="text-xs font-bold text-brand-dark">۰۶ — شرایط پشتیبانی و تحویل سورس کد</span>
            <h2 className="mt-2 text-2xl font-extrabold leading-[1.5] sm:text-[30px]">مالکیت کامل با کارفرما</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {supportPlans.map((plan) => (
                <div key={plan.title} className="card-surface p-4">
                  <p className="text-[10px] font-bold text-brand-dark">{plan.duration}</p>
                  <h3 className="mt-1.5 text-xs font-bold">{plan.title}</h3>
                  <p className="mt-1.5 text-[10px] leading-5 text-muted">{plan.desc}</p>
                </div>
              ))}
            </div>
            <ul className="mt-5 space-y-2.5">
              {deliveryTerms.map((term) => (
                <li key={term} className="flex items-start gap-2 rounded-xl border border-line bg-white px-3.5 py-3 text-[11px] leading-6 text-ink-soft">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-verified" />
                  {term}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xs font-bold text-brand-dark">فازهای آینده — بدون زیرساخت جداگانه</span>
            <h2 className="mt-2 text-2xl font-extrabold leading-[1.5] sm:text-[30px]">نقشه راه توسعه پلتفرم</h2>
            <div className="mt-5 space-y-3">
              {roadmap.map((item, index) => (
                <div key={item.title} className="card-surface flex items-start gap-3 p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-dark">
                    {index === 0 ? <Boxes className="h-4 w-4" /> : index === 1 ? <Rocket className="h-4 w-4" /> : index === 2 ? <Layers className="h-4 w-4" /> : <Database className="h-4 w-4" />}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold">{item.title}</h3>
                      <span className="rounded-md bg-paper px-1.5 py-0.5 text-[9px] text-muted">{item.phase}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-6 text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-dashed border-brand/30 bg-brand-soft p-4 text-[11px] leading-6 text-ink-soft">
              <p className="mb-1 flex items-center gap-1.5 font-bold text-brand-dark">
                <Coins className="h-4 w-4" /> برآورد کلی فازهای آینده
              </p>
              بازارگاه قطعات و خرید امن: از ۴۵۰ میلیون تومان — اتصال به پیک: از ۱۸۰ میلیون تومان —
              شناسنامه پیشرفته: از ۲۲۰ میلیون تومان (بر اساس دامنه نهایی و پس از تأیید فاز اول).
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-ink p-6 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-extrabold">آماده شروع فاز اول هستیم</h2>
            <p className="mt-1 text-[11px] text-white/60">
              برای هماهنگی جلسه ارائه پیشنهاد فنی و بررسی جزئیات قرارداد با ما تماس بگیرید.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="tel:02191000000" className="btn bg-brand text-white hover:bg-brand-dark">۰۲۱-۹۱۰۰۰۰۰۰</a>
            <Link href="/stores" className="btn border border-white/25 text-white hover:bg-white/10">مشاهده محصول</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
