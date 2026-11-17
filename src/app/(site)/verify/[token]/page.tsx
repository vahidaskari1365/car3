import type { Metadata } from "next";
import { VerifyOwnerClient } from "@/components/site/VerifyOwnerClient";

export const metadata: Metadata = {
  title: "بازبینی و اصلاح اطلاعات فروشگاه",
  description: "لینک اختصاصی و امن مالک فروشگاه برای بازبینی، اصلاح و ارسال اطلاعات جهت تأیید اپراتور خودرویار.",
  robots: { index: false, follow: false },
};

export default async function VerifyTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <VerifyOwnerClient token={token} />;
}
