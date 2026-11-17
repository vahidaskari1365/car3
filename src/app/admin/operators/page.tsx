"use client";

import { useState } from "react";
import { KeyRound, Pencil, Plus, ShieldCheck, Trash2, UserCog, UserPlus } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Modal, PageHeader, Panel } from "@/components/admin/AdminUI";
import { randomId, toFa } from "@/lib/format";
import type { Operator } from "@/lib/types";

const roles: Operator["role"][] = ["مدیر سامانه", "اپراتور راستی‌آزمایی", "اپراتور محتوا", "پشتیبان"];

const permissionLabels: Record<string, string> = {
  stores: "مدیریت فروشگاه‌ها",
  verify: "راستی‌آزمایی و تأیید تغییرات",
  import: "ورود گروهی داده",
  operators: "مدیریت اپراتورها",
  content: "مدیریت محتوا و دسته‌بندی",
};

const blank = {
  name: "",
  email: "",
  role: "اپراتور راستی‌آزمایی" as Operator["role"],
  active: true,
  permissions: ["stores", "verify"] as string[],
};

export default function AdminOperatorsPage() {
  const admin = useAdmin();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Operator | null>(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");

  function openCreate() {
    setEditing(null);
    setForm(blank);
    setError("");
    setOpen(true);
  }

  function openEdit(operator: Operator) {
    setEditing(operator);
    setForm({ name: operator.name, email: operator.email, role: operator.role, active: operator.active, permissions: operator.permissions });
    setError("");
    setOpen(true);
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    if (form.name.trim().length < 3) return setError("نام اپراتور را کامل وارد کنید.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return setError("ایمیل معتبر وارد کنید.");
    if (form.permissions.length === 0) return setError("حداقل یک سطح دسترسی انتخاب کنید.");

    if (editing) {
      admin.updateOperator(editing.id, form);
    } else {
      admin.addOperator({
        id: randomId("op"),
        ...form,
        stores: 0,
        lastLogin: "—",
      });
    }
    setOpen(false);
  }

  function togglePermission(key: string) {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(key) ? prev.permissions.filter((p) => p !== key) : [...prev.permissions, key],
    }));
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="اپراتورها و سطوح دسترسی"
        desc="مدیریت نقش‌محور (RBAC): هر اپراتور فقط به بخش‌های مجاز دسترسی دارد و همه اقدامات در گزارش فعالیت ثبت می‌شود."
      >
        <button type="button" onClick={openCreate} className="btn-primary px-4 py-2.5">
          <UserPlus className="h-4 w-4" /> افزودن اپراتور
        </button>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "کل اپراتورها", value: admin.operators.length, icon: UserCog },
          { label: "فعال", value: admin.operators.filter((o) => o.active).length, icon: ShieldCheck },
          { label: "مدیر سامانه", value: admin.operators.filter((o) => o.role === "مدیر سامانه").length, icon: KeyRound },
          { label: "سطوح دسترسی تعریف‌شده", value: Object.keys(permissionLabels).length, icon: UserPlus },
        ].map((item) => (
          <div key={item.label} className="card-surface flex items-center gap-3 p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand-dark">
              <item.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-lg font-extrabold">{toFa(item.value)}</p>
              <p className="text-[10px] text-muted">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Panel title="فهرست اپراتورها" desc="تغییر نقش، فعال/غیرفعال کردن دسترسی و حذف اپراتور">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>اپراتور</th>
                <th>نقش</th>
                <th>دسترسی‌ها</th>
                <th>فروشگاه‌های مدیریت‌شده</th>
                <th>آخرین ورود</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {admin.operators.map((operator) => (
                <tr key={operator.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">
                        {operator.name.slice(0, 1)}
                      </span>
                      <div>
                        <p className="text-[11px] font-bold">{operator.name}</p>
                        <p className="text-[10px] text-muted" dir="ltr">{operator.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-[11px]">{operator.role}</td>
                  <td>
                    <div className="flex max-w-[220px] flex-wrap gap-1">
                      {operator.permissions.map((permission) => (
                        <span key={permission} className="rounded-md bg-paper px-1.5 py-0.5 text-[9px] text-ink-soft">
                          {permissionLabels[permission] ?? permission}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-[11px]">{toFa(operator.stores)}</td>
                  <td className="whitespace-nowrap text-[10px] text-muted">{operator.lastLogin}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => admin.updateOperator(operator.id, { active: !operator.active })}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset transition ${
                        operator.active
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-600 ring-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {operator.active ? "فعال" : "غیرفعال"}
                    </button>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => openEdit(operator)} aria-label="ویرایش" className="rounded-md p-1.5 text-muted hover:bg-paper hover:text-brand-dark">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`حذف اپراتور «${operator.name}»؟`)) admin.deleteOperator(operator.id);
                        }}
                        aria-label="حذف"
                        className="rounded-md p-1.5 text-muted hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Object.entries(permissionLabels).map(([key, label]) => (
          <div key={key} className="card-surface p-4">
            <p className="font-mono text-[10px] font-bold text-brand-dark" dir="ltr">{key}</p>
            <p className="mt-1.5 text-xs font-semibold">{label}</p>
            <p className="mt-1 text-[10px] text-muted">
              {toFa(admin.operators.filter((o) => o.permissions.includes(key)).length)} اپراتور این دسترسی را دارد.
            </p>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? `ویرایش ${editing.name}` : "افزودن اپراتور جدید"}
        desc="نقش و دسترسی‌ها را تعیین کنید؛ تغییرات بلافاصله اعمال می‌شود."
      >
        <form onSubmit={save} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="op-name">نام و نام خانوادگی *</label>
              <input id="op-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="op-email">ایمیل سازمانی *</label>
              <input id="op-email" className="input" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="op-role">نقش</label>
              <select id="op-role" className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Operator["role"] })}>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <label className="flex items-end gap-2 pb-3 text-[11px]">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 accent-[#f26b1d]" />
              حساب فعال باشد
            </label>
          </div>

          <div>
            <span className="label">سطوح دسترسی *</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(permissionLabels).map(([key, label]) => (
                <label key={key} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-[11px] ${form.permissions.includes(key) ? "border-brand/40 bg-brand-soft/50" : "border-line"}`}>
                  <input type="checkbox" checked={form.permissions.includes(key)} onChange={() => togglePermission(key)} className="h-4 w-4 accent-[#f26b1d]" />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-700">{error}</p>}

          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <button type="button" onClick={() => setOpen(false)} className="btn-outline py-2.5">انصراف</button>
            <button type="submit" className="btn-primary py-2.5">
              <Plus className="h-4 w-4" />
              {editing ? "ذخیره تغییرات" : "افزودن اپراتور"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
