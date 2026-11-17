import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "خودرویار | پلتفرم یکپارچه خدمات و اطلاعات خودرو",
    template: "%s | خودرویار",
  },
  description:
    "خودرویار پلتفرم یکپارچه فارسی خدمات و اطلاعات خودرو است: جستجوی فروشگاه‌ها و مراکز خدمات تأییدشده، مراکز ضروری، شناسنامه دیجیتال خودرو و پنل مدیریت اختصاصی.",
  keywords: [
    "خدمات خودرو",
    "تعمیرگاه",
    "لوازم یدکی",
    "شناسنامه خودرو",
    "مراکز ضروری خودرو",
    "جایگاه سوخت",
    "تعویض پلاک",
    "فروشگاه خودرو",
  ],
  applicationName: "خودرویار",
  authors: [{ name: "خودرویار" }],
  openGraph: {
    title: "خودرویار | همه‌ی خودرو، در یک پلتفرم",
    description: "جستجوی مراکز خدمات تأییدشده، شناسنامه دیجیتال خودرو و پنل مدیریت یکپارچه.",
    type: "website",
    locale: "fa_IR",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
