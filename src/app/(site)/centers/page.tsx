import { Suspense } from "react";
import type { Metadata } from "next";
import { CentersBrowser } from "@/components/site/CentersBrowser";

export const metadata: Metadata = {
  title: "مراکز ضروری خودرو: جایگاه سوخت و تعویض پلاک",
  description:
    "فهرست جایگاه‌های سوخت، مراکز CNG، تعویض پلاک و معاینه فنی با آدرس، ساعات کاری، موقعیت روی نقشه و مسیریابی بلد، نشان و گوگل مپ.",
};

export default function CentersPage() {
  return (
    <Suspense fallback={<div className="container-x py-20"><div className="h-40 animate-pulse rounded-3xl bg-white" /></div>}>
      <CentersBrowser />
    </Suspense>
  );
}
