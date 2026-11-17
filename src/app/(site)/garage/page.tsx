import type { Metadata } from "next";
import { GarageList } from "@/components/garage/GarageList";

export const metadata: Metadata = {
  title: "شناسنامه دیجیتال خودرو",
  description:
    "برای هر خودرو یک پرونده دیجیتال بسازید: ثبت سوابق سرویس و تعمیر، سوخت‌گیری و مصرف سوخت، هزینه‌ها و آرشیو فاکتورها و مدارک خودرو.",
};

export default function GaragePage() {
  return <GarageList />;
}
