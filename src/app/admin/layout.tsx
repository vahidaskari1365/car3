import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminProvider } from "@/components/admin/AdminProvider";
import { AdminGate } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  description: "پنل مدیریت اختصاصی خودرویار: فروشگاه‌ها، راستی‌آزمایی، اپراتورها و ورود گروهی داده.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <AdminGate>{children}</AdminGate>
    </AdminProvider>
  );
}
