import { images } from "@/data/images";
import type { Category, CenterType, City } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "mechanic",
    title: "تعمیرگاه و مکانیکی",
    short: "مکانیکی",
    blurb: "سرویس موتور، گیربکس، جلوبندی و تعمیرات تخصصی",
    icon: "wrench",
    image: images.serviceMechanic,
    color: "#F26B1D",
  },
  {
    id: "oil",
    title: "تعویض روغن و سرویس دوره‌ای",
    short: "سرویس دوره‌ای",
    blurb: "تعویض روغن، فیلتر، تسمه و تنظیم سرویس",
    icon: "droplet",
    image: images.serviceOil,
    color: "#0E7490",
  },
  {
    id: "body",
    title: "صافکاری و نقاشی",
    short: "صافکاری",
    blurb: "صافکاری بی‌رنگ، نقاشی کابین و ترمیم بدنه",
    icon: "spray",
    image: images.serviceBody,
    color: "#B45309",
  },
  {
    id: "tire",
    title: "لاستیک، رینگ و بالانس",
    short: "لاستیک و رینگ",
    blurb: "فروش و نصب لاستیک، بالانس و تنظیم فرمان",
    icon: "circleDot",
    image: images.serviceTire,
    color: "#1F2937",
  },
  {
    id: "electrical",
    title: "برق، باتری و ECU",
    short: "برق خودرو",
    blurb: "عیب‌یابی برق، باتری، مالتی‌پلکس و دیاگ",
    icon: "zap",
    image: images.serviceElectrical,
    color: "#CA8A04",
  },
  {
    id: "parts",
    title: "لوازم یدکی و قطعات",
    short: "لوازم یدکی",
    blurb: "قطعات اصلی، تعویضی و لوازم جانبی خودرو",
    icon: "package",
    image: images.serviceParts,
    color: "#7C3AED",
  },
  {
    id: "wash",
    title: "کارواش و دیتیلینگ",
    short: "کارواش",
    blurb: "شست‌وشوی تخصصی، پولیش و نانو سرامیک",
    icon: "sparkles",
    image: images.serviceWash,
    color: "#0891B2",
  },
  {
    id: "inspection",
    title: "معاینه فنی و فنی خودرو",
    short: "معاینه فنی",
    blurb: "معاینه فنی، تست آلایندگی و بازرسی فنی",
    icon: "shieldCheck",
    image: images.serviceInspection,
    color: "#15803D",
  },
  {
    id: "glass",
    title: "شیشه، آپشن و دزدگیر",
    short: "شیشه و آپشن",
    blurb: "تعویض شیشه، تینت، دزدگیر و سیستم صوتی",
    icon: "layers",
    image: images.serviceGlass,
    color: "#0F766E",
  },
  {
    id: "towing",
    title: "امداد خودرو و یدک‌کش",
    short: "امداد خودرو",
    blurb: "امداد شبانه‌روزی، یدک‌کش و حمل خودرو",
    icon: "truck",
    image: images.serviceTowing,
    color: "#DC2626",
  },
];

export const cities: City[] = [
  {
    name: "تهران",
    districts: ["سعادت‌آباد", "شهرک غرب", "ونک", "پونک", "جنت‌آباد", "نارمک", "اکباتان", "نیاوران", "ولیعصر", "بازار"],
  },
  { name: "کرج", districts: ["مرکز شهر", "گوهردشت", "عظیمیه", "مهرشهر"] },
  { name: "مشهد", districts: ["مرکز شهر", "احمدآباد", "وکیل‌آباد", "قاسم‌آباد"] },
  { name: "اصفهان", districts: ["مرکز شهر", "چهارباغ", "سپاهان‌شهر", "خانه اصفهان"] },
  { name: "شیراز", districts: ["مرکز شهر", "قصردشت", "معالی‌آباد", "زند"] },
  { name: "تبریز", districts: ["مرکز شهر", "باغمیشه", "ولیعصر"] },
  { name: "اهواز", districts: ["مرکز شهر", "کیانپارس", "زیتون"] },
  { name: "قم", districts: ["مرکز شهر", "پردیسان", "صفاشهر"] },
  { name: "رشت", districts: ["مرکز شهر", "گلسار", "منظریه"] },
];

export const brands = [
  "ایران‌خودرو",
  "سایپا",
  "پژو",
  "رنو",
  "کیا",
  "هیوندای",
  "تویوتا",
  "بی‌ام‌و",
  "مرسدس بنز",
  "چری",
  "جک",
  "مک‌لارن",
];

export const centerTypeMeta: Record<CenterType, { title: string; icon: string; color: string; note: string }> = {
  fuel: { title: "جایگاه سوخت", icon: "fuel", color: "#F26B1D", note: "بنزین، گازوئیل و کارت سوخت" },
  cng: { title: "جایگاه CNG", icon: "wind", color: "#0E7490", note: "سوخت گاز فشرده" },
  plate: { title: "مرکز تعویض پلاک", icon: "badge", color: "#1D4ED8", note: "تعویض پلاک و شماره‌گذاری" },
  inspection: { title: "معاینه فنی", icon: "clipboardCheck", color: "#15803D", note: "برگ معاینه فنی و تست آلایندگی" },
};

export const verificationLabels = {
  verified: { title: "تأییدشده", className: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  pending: { title: "در حال بررسی", className: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  unverified: { title: "تأیید نشده", className: "bg-slate-100 text-slate-600 ring-slate-200", dot: "bg-slate-400" },
} as const;

export const serviceTypes = [
  "تعویض روغن و فیلتر",
  "تعویض لنت ترمز",
  "تعمیر موتور",
  "تعویض تسمه تایم",
  "تنظیم فرمان و بالانس",
  "تعویض باتری",
  "سرویس گیربکس",
  "تعویض لاستیک",
  "معاینه فنی",
  "سایر",
];
