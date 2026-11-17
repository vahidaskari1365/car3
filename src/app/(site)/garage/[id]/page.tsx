import type { Metadata } from "next";
import { GarageDetail } from "@/components/garage/GarageDetail";

export const metadata: Metadata = {
  title: "پرونده دیجیتال خودرو",
  description: "سوابق سرویس، سوخت‌گیری، مصرف سوخت، هزینه‌ها و مدارک خودرو در شناسنامه دیجیتال خودرویار.",
};

export default function GarageDetailPage() {
  return <GarageDetail />;
}
