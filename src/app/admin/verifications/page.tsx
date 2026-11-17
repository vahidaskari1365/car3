"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Link2,
  Phone,
  PhoneCall,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { PageHeader, Panel } from "@/components/admin/AdminUI";
import { categories } from "@/data/catalog";
import { toFa } from "@/lib/format";
import type { VerificationStatus } from "@/lib/types";

const tabs = [
  { key: "requests", label: "درخواست‌های اصلاح" },
  { key: "calls", label: "راستی‌آزمایی تلفنی" },
  { key: "links", label: "لینک اختصاصی مالک" },
] as const;

export default function AdminVerificationsPage() {
  const admin = useAdmin();
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("requests");
  const [selectedStore, setSelectedStore] = useState(admin.stores[0]?.id ?? "");
  const [callResult, setCallResult] = useState<VerificationStatus>("verified");
  const [callNote, setCallNote] = useState("مالک تأیید کرد؛ آدرس و ساعات کاری صحیح است.");
  const [copied, setCopied] = useState("");
  const [toast, setToast] = useState("");

  const pending = admin.changeRequests.filter((r) => r.status === "pending");
  const history = admin.changeRequests.filter((r) => r.status !== "pending");
  const store = admin.stores.find((s) => s.id === selectedStore) ?? admin.stores[0];

  function copy(token: string) {
    const url = `${window.location.origin}/verify/${token}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(token);
      setTimeout(() => setCopied(""), 1800);
    });
  }

  function flash(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="سیستم راستی‌آزمایی فروشگاه‌ها"
        desc="بررسی تغییرات ارسال‌شده از لینک اختصاصی مالک، ثبت نتیجه تماس تلفنی و تولید لینک امن بازبینی."
      />

      {toast && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          {toast}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 rounded-2xl border border-line bg-white p-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              tab === item.key ? "bg-ink text-white" : "text-muted hover:bg-paper"
            }`}
          >
            {item.label}
            {item.key === "requests" && pending.length > 0 && (
              <span className="mr-1.5 rounded-full bg-brand px-1.5 py-0.5 text-[9px] text-white">{toFa(pending.length)}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "requests" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <Panel title={`در صف بررسی (${toFa(pending.length)})`} desc="تغییرات مالک فروشگاه پیش از انتشار نیازمند تأیید اپراتور است">
            {pending.length === 0 ? (
              <p className="py-10 text-center text-xs text-muted">صف بررسی خالی است. همه درخواست‌ها تعیین تکلیف شده‌اند.</p>
            ) : (
              <ul className="space-y-4">
                {pending.map((request) => {
                  const target = admin.stores.find((s) => s.id === request.storeId);
                  return (
                    <li key={request.id} className="rounded-2xl border border-line">
                      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-line bg-paper/50 px-4 py-3">
                        <div>
                          <p className="text-xs font-bold">{request.storeName}</p>
                          <p className="mt-0.5 text-[10px] text-muted">
                            {request.submittedAt} • {request.channel} • شناسه {request.id}
                          </p>
                        </div>
                        <div className="flex gap-1.5">
                          {target && (
                            <Link href={`/stores/${target.slug}`} target="_blank" className="rounded-lg border border-line bg-white px-2 py-1.5 text-[10px] font-semibold text-muted hover:text-ink">
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              admin.approveRequest(request.id);
                              flash(`تغییرات «${request.storeName}» تأیید و در سایت منتشر شد.`);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> تأیید نهایی
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              admin.rejectRequest(request.id);
                              flash(`درخواست «${request.storeName}» رد شد.`);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-[10px] font-bold text-red-700 hover:bg-red-100"
                          >
                            <XCircle className="h-3.5 w-3.5" /> رد
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="mb-3 rounded-lg bg-brand-soft px-3 py-2 text-[11px] text-brand-dark">{request.summary}</p>
                        <div className="space-y-2">
                          {Object.entries(request.payload).map(([key, value]) => {
                            const current = target ? (target as unknown as Record<string, unknown>)[key] : undefined;
                            return (
                              <div key={key} className="grid gap-2 rounded-xl border border-line p-2.5 text-[11px] sm:grid-cols-[80px_1fr_1fr]">
                                <span className="font-mono text-[10px] font-bold text-muted" dir="ltr">{key}</span>
                                <span className="rounded-md bg-paper px-2 py-1 text-[10px] text-muted line-through">
                                  {Array.isArray(current) ? current.join("، ") : String(current ?? "—")}
                                </span>
                                <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-800">
                                  {Array.isArray(value) ? value.join("، ") : String(value ?? "—")}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel title="تاریخچه بررسی‌ها" desc="آخرین درخواست‌های تعیین‌تکلیف‌شده">
            <ul className="space-y-2">
              {history.map((request) => (
                <li key={request.id} className="rounded-xl border border-line p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold">{request.storeName}</p>
                    <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold ${request.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                      {request.status === "approved" ? "تأییدشده" : "ردشده"}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted">{request.submittedAt} • {request.channel}</p>
                </li>
              ))}
              {history.length === 0 && <p className="py-6 text-center text-[11px] text-muted">تاریخچه‌ای موجود نیست.</p>}
            </ul>
          </Panel>
        </div>
      )}

      {tab === "calls" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <Panel title="ثبت نتیجه تماس تلفنی" desc="پس از تماس با مالک، وضعیت اطلاعات را ثبت کنید">
            <div className="space-y-3">
              <div>
                <label className="label" htmlFor="call-store">فروشگاه</label>
                <select id="call-store" value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)} className="input">
                  {admin.stores.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} — {s.city}</option>
                  ))}
                </select>
              </div>
              {store && (
                <div className="rounded-xl bg-paper p-3 text-[11px]">
                  <p className="font-bold">{store.name}</p>
                  <p className="mt-1 text-muted">مالک: {store.ownerName} • دسته: {categories.find((c) => c.id === store.categoryId)?.title}</p>
                  <p className="mt-1 text-muted" dir="ltr">☎ {toFa(store.phone)} / {toFa(store.mobile)}</p>
                  <p className="mt-1 text-muted">آدرس: {store.city}، {store.district}، {store.address}</p>
                  <p className="mt-1 text-muted">آخرین بررسی: {store.lastCheck ?? "انجام نشده"}</p>
                </div>
              )}
              <div>
                <label className="label" htmlFor="call-result">نتیجه تماس</label>
                <select id="call-result" value={callResult} onChange={(e) => setCallResult(e.target.value as VerificationStatus)} className="input">
                  <option value="verified">تأیید شد — اطلاعات صحیح است</option>
                  <option value="pending">نیازمند بازبینی مجدد / اصلاح</option>
                  <option value="unverified">پاسخ داده نشد / شماره نامعتبر</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="call-note">یادداشت اپراتور</label>
                <textarea id="call-note" value={callNote} onChange={(e) => setCallNote(e.target.value)} className="input min-h-20 resize-none" />
              </div>
              <button
                type="button"
                onClick={() => {
                  admin.recordVerification(selectedStore, callResult, callNote);
                  flash(`نتیجه راستی‌آزمایی «${store?.name}» ثبت شد و در گزارش فعالیت ذخیره گردید.`);
                }}
                className="btn-primary w-full"
              >
                <PhoneCall className="h-4 w-4" /> ثبت نتیجه و به‌روزرسانی وضعیت
              </button>
            </div>
          </Panel>

          <Panel title="پرونده‌های نیازمند تماس" desc="مراکزی که تأیید آن‌ها کامل نشده است">
            <ul className="space-y-2">
              {admin.stores.filter((s) => s.status !== "verified").map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line p-3">
                  <div>
                    <p className="text-[11px] font-bold">{s.name}</p>
                    <p className="text-[10px] text-muted">{s.city}، {s.district} • {s.lastCheck ?? "بدون بازبینی"}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a href={`tel:${s.phone}`} className="inline-flex items-center gap-1 rounded-lg bg-paper px-2.5 py-1.5 text-[10px] font-bold text-ink-soft hover:bg-brand-soft">
                      <Phone className="h-3 w-3" /> تماس
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStore(s.id);
                        flash(`پرونده «${s.name}» برای ثبت نتیجه انتخاب شد.`);
                      }}
                      className="rounded-lg bg-ink px-2.5 py-1.5 text-[10px] font-bold text-white"
                    >
                      ثبت نتیجه
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}

      {tab === "links" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <Panel title="لینک‌های اختصاصی بازبینی مالک" desc="هر لینک یکتا، غیرقابل حدس و محدود به پرونده همان فروشگاه است">
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>فروشگاه</th>
                    <th>توکن لینک</th>
                    <th>وضعیت</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {admin.stores.slice(0, 12).map((s) => (
                    <tr key={s.id}>
                      <td className="text-[11px] font-semibold">{s.name}</td>
                      <td className="font-mono text-[10px] text-muted" dir="ltr">{s.verifyToken}</td>
                      <td className="text-[10px] text-muted">{s.status === "verified" ? "تأییدشده" : s.status === "pending" ? "در بررسی" : "تأیید نشده"}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => copy(s.verifyToken)} aria-label="کپی لینک" className="rounded-md p-1.5 text-muted hover:bg-paper hover:text-brand-dark">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <Link href={`/verify/${s.verifyToken}`} target="_blank" className="rounded-md p-1.5 text-muted hover:bg-paper hover:text-ink" aria-label="باز کردن لینک">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => flash(`پیامک لینک بازبینی برای ${toFa(s.mobile)} — ${s.ownerName} در صف ارسال قرار گرفت (نمایشی).`)}
                            className="rounded-lg bg-paper px-2 py-1 text-[10px] font-bold text-ink-soft hover:bg-brand-soft"
                          >
                            ارسال پیامک
                          </button>
                        </div>
                        {copied === s.verifyToken && <span className="text-[9px] font-bold text-emerald-600">کپی شد</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <div className="space-y-4">
            <Panel title="امنیت لینک">
              <ul className="space-y-2.5 text-[11px] leading-6 text-muted">
                {[
                  "توکن یکتا با ۱۲+ کاراکتر تصادفی و غیرقابل حدس",
                  "اعتبار ۷ روزه و امکان باطل‌سازی فوری توسط اپراتور",
                  "دسترسی فقط به اطلاعات همان فروشگاه",
                  "ارسال تغییرات به صف بازبینی، بدون انتشار مستقیم",
                  "ثبت کامل هر ارسال در گزارش فعالیت",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-verified" />
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>
            <div className="rounded-2xl border border-dashed border-brand/30 bg-brand-soft p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold text-brand-dark">
                <Link2 className="h-4 w-4" /> مشاهده نمونه
              </p>
              <p className="mt-1.5 text-[11px] leading-6 text-ink-soft">
                صفحه‌ای که مالک فروشگاه می‌بیند را باز کنید و تغییرات را ارسال کنید؛
                سپس در همین صف، تأیید نهایی را انجام دهید.
              </p>
              <Link href={`/verify/${admin.stores[3]?.verifyToken ?? "demo"}`} className="btn-dark mt-3 w-full py-2.5 text-[11px]">
                باز کردن لینک نمونه
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "تأییدشده", value: admin.stores.filter((s) => s.status === "verified").length, icon: BadgeCheck, tone: "bg-emerald-50 text-emerald-700" },
          { label: "در حال بررسی", value: admin.stores.filter((s) => s.status === "pending").length, icon: Clock, tone: "bg-amber-50 text-amber-700" },
          { label: "درخواست در صف", value: pending.length, icon: Link2, tone: "bg-brand-soft text-brand-dark" },
        ].map((item) => (
          <div key={item.label} className="card-surface flex items-center gap-3 p-4">
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${item.tone}`}>
              <item.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-lg font-extrabold">{toFa(item.value)}</p>
              <p className="text-[10px] text-muted">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
