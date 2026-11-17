import type { Metadata } from "next";
import { RegisterStoreForm } from "@/components/site/RegisterStoreForm";

export const metadata: Metadata = {
  title: "ثبت فروشگاه و مرکز خدمات خودرو",
  description:
    "اطلاعات فروشگاه یا مرکز خدمات خودرو خود را ثبت کنید تا کارشناس خودرویار برای راستی‌آزمایی تلفنی و انتشار در پلتفرم با شما تماس بگیرد.",
};

export default function RegisterPage() {
  return <RegisterStoreForm />;
}
