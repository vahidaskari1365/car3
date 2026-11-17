import { Suspense } from "react";
import type { Metadata } from "next";
import { StoresBrowser } from "@/components/site/StoresBrowser";

export const metadata: Metadata = {
  title: "جستجوی فروشگاه‌ها و مراکز خدمات خودرو",
  description:
    "فروشگاه‌ها و مراکز خدمات خودرو را بر اساس شهر، منطقه، دسته‌بندی و برند جستجو کنید؛ با نشان تأیید و تاریخ آخرین بازرسی.",
};

export default function StoresPage() {
  return (
    <Suspense
      fallback={
        <div className="container-x py-20">
          <div className="h-40 animate-pulse rounded-3xl bg-white" />
        </div>
      }
    >
      <StoresBrowser />
    </Suspense>
  );
}
