"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { seedStores } from "@/data/stores";
import { readLocal, useLocalStore } from "@/lib/useLocalStore";
import { randomId, todayJalali } from "@/lib/format";
import type { ActivityItem, ChangeRequest, Operator, Store } from "@/lib/types";

export type Registration = {
  id: string;
  name: string;
  categoryId: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  ownerName: string;
  hours: string;
  note: string;
  createdAt: string;
  token: string;
  status: "new" | "contacted" | "published";
};

const seedOperators: Operator[] = [
  {
    id: "op-001",
    name: "نگار احمدی",
    email: "admin@khodroyar.ir",
    role: "مدیر سامانه",
    active: true,
    stores: seedStores.length,
    lastLogin: "۱۴۰۴/۱۲/۱۸ — ۰۹:۱۲",
    permissions: ["stores", "verify", "import", "operators", "content"],
  },
  {
    id: "op-002",
    name: "محمد رستمی",
    email: "verify@khodroyar.ir",
    role: "اپراتور راستی‌آزمایی",
    active: true,
    stores: 14,
    lastLogin: "۱۴۰۴/۱۲/۱۸ — ۰۸:۴۰",
    permissions: ["stores", "verify"],
  },
  {
    id: "op-003",
    name: "سارا کاظمی",
    email: "content@khodroyar.ir",
    role: "اپراتور محتوا",
    active: true,
    stores: 0,
    lastLogin: "۱۴۰۴/۱۲/۱۷ — ۱۶:۰۵",
    permissions: ["content"],
  },
  {
    id: "op-004",
    name: "رضا فتحی",
    email: "support@khodroyar.ir",
    role: "پشتیبان",
    active: false,
    stores: 0,
    lastLogin: "۱۴۰۴/۱۱/۲۶ — ۱۱:۳۰",
    permissions: ["verify"],
  },
];

const seedRequests: ChangeRequest[] = [
  {
    id: "cr-1001",
    storeId: "store-004",
    storeName: "لاستیک و رینگ بارز",
    submittedAt: "۱۴۰۴/۱۲/۱۴",
    channel: "لینک اختصاصی",
    summary: "اصلاح شماره تماس و ساعات کاری روزهای پنجشنبه",
    status: "pending",
    payload: {
      phone: "02144447799",
      mobile: "09124558899",
      hours: "شنبه تا پنجشنبه ۹:۰۰ تا ۱۹:۳۰",
      address: "بلوار میرزابابایی، نبش خیابان همیلا، پلاک ۱۲، فروشگاه بارز",
    },
  },
  {
    id: "cr-1002",
    storeId: "store-016",
    storeName: "لاستیک و رینگ زاینده‌رود",
    submittedAt: "۱۴۰۴/۱۲/۱۶",
    channel: "لینک اختصاصی",
    summary: "تکمیل خدمات و افزودن برندهای تحت پوشش",
    status: "pending",
    payload: {
      services: ["بالانس", "پنچرگیری سیار", "فروش رینگ", "تراز چرخ", "تنظیم باد نیتروژن"],
    },
  },
  {
    id: "cr-1003",
    storeId: "store-009",
    storeName: "شیشه و آپشن خودرو دلارام",
    submittedAt: "۱۴۰۴/۱۲/۱۵",
    channel: "تماس تلفنی",
    summary: "تأیید تلفنی نصب شیشه سکوریت و تینت مجاز",
    status: "approved",
    payload: { hours: "شنبه تا جمعه ۱۰:۰۰ تا ۲۰:۰۰" },
  },
];

const seedActivities: ActivityItem[] = [
  { id: "act-1", at: "۱۴۰۴/۱۲/۱۸ — ۰۹:۱۲", text: "گزارش روزانه وضعیت مراکز تولید شد.", kind: "import" },
  { id: "act-2", at: "۱۴۰۴/۱۲/۱۷ — ۱۶:۳۰", text: "وضعیت «تعمیرگاه بارس‌آوران» تأیید شد.", kind: "verify" },
  { id: "act-3", at: "۱۴۰۴/۱۲/۱۶ — ۱۱:۰۵", text: "درخواست اصلاح اطلاعات «لاستیک بارز» ثبت شد.", kind: "store" },
  { id: "act-4", at: "۱۴۰۴/۱۲/۱۵ — ۱۴:۲۰", text: "اپراتور جدید «سارا کاظمی» افزوده شد.", kind: "operator" },
];

type AdminContextValue = {
  ready: boolean;
  stores: Store[];
  operators: Operator[];
  changeRequests: ChangeRequest[];
  activities: ActivityItem[];
  registrations: Registration[];
  authed: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  addStore: (store: Store) => void;
  updateStore: (id: string, patch: Partial<Store>) => void;
  deleteStore: (id: string) => void;
  importStores: (rows: Store[]) => void;
  addOperator: (operator: Operator) => void;
  updateOperator: (id: string, patch: Partial<Operator>) => void;
  deleteOperator: (id: string) => void;
  addRequest: (request: ChangeRequest) => void;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  recordVerification: (storeId: string, result: "verified" | "pending" | "unverified", note: string) => void;
  log: (text: string, kind: ActivityItem["kind"]) => void;
  resetDemo: () => void;
  newStoreDraft: () => Store;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}

function stamp(): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", { dateStyle: "short", timeStyle: "short" }).format(new Date());
  } catch {
    return todayJalali();
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const storesState = useLocalStore<Store[]>("stores", seedStores);
  const operatorsState = useLocalStore<Operator[]>("operators", seedOperators);
  const requestsState = useLocalStore<ChangeRequest[]>("changeRequests", seedRequests);
  const activitiesState = useLocalStore<ActivityItem[]>("activities", seedActivities);
  const registrationsState = useLocalStore<Registration[]>("registrations", []);
  const authState = useLocalStore<boolean>("adminAuth", false);

  const log = useCallback(
    (text: string, kind: ActivityItem["kind"]) => {
      activitiesState.setValue((prev) => [{ id: randomId("act"), at: stamp(), text, kind }, ...prev].slice(0, 40));
    },
    [activitiesState],
  );

  const updateStore = useCallback(
    (id: string, patch: Partial<Store>) => {
      storesState.setValue((prev) => prev.map((store) => (store.id === id ? { ...store, ...patch } : store)));
    },
    [storesState],
  );

  const value = useMemo<AdminContextValue>(
    () => ({
      ready:
        storesState.ready &&
        operatorsState.ready &&
        requestsState.ready &&
        activitiesState.ready &&
        registrationsState.ready &&
        authState.ready,
      stores: storesState.value,
      operators: operatorsState.value,
      changeRequests: requestsState.value,
      activities: activitiesState.value,
      registrations: registrationsState.value,
      authed: authState.value,
      login: (password: string) => {
        const success = password === "admin" || password === "khodroyar";
        if (success) authState.setValue(true);
        return success;
      },
      logout: () => authState.setValue(false),
      addStore: (store) => {
        storesState.setValue((prev) => [store, ...prev]);
        log(`فروشگاه «${store.name}» توسط اپراتور ثبت شد.`, "store");
      },
      updateStore: (id, patch) => {
        updateStore(id, patch);
        log(`اطلاعات فروشگاه با شناسه ${id} به‌روزرسانی شد.`, "store");
      },
      deleteStore: (id) => {
        const name = storesState.value.find((s) => s.id === id)?.name ?? id;
        storesState.setValue((prev) => prev.filter((s) => s.id !== id));
        log(`فروشگاه «${name}» حذف شد.`, "store");
      },
      importStores: (rows) => {
        storesState.setValue((prev) => [...rows, ...prev]);
        log(`${rows.length} فروشگاه از فایل گروهی وارد شد.`, "import");
      },
      addOperator: (operator) => {
        operatorsState.setValue((prev) => [operator, ...prev]);
        log(`اپراتور «${operator.name}» با نقش ${operator.role} افزوده شد.`, "operator");
      },
      updateOperator: (id, patch) => {
        operatorsState.setValue((prev) => prev.map((op) => (op.id === id ? { ...op, ...patch } : op)));
        log(`دسترسی اپراتور ${id} به‌روزرسانی شد.`, "operator");
      },
      deleteOperator: (id) => {
        operatorsState.setValue((prev) => prev.filter((op) => op.id !== id));
        log(`اپراتور ${id} حذف شد.`, "operator");
      },
      addRequest: (request) => requestsState.setValue((prev) => [request, ...prev]),
      approveRequest: (id) => {
        const request = requestsState.value.find((r) => r.id === id);
        if (!request) return;
        storesState.setValue((prev) =>
          prev.map((store) =>
            store.id === request.storeId
              ? { ...store, ...request.payload, status: "verified", lastCheck: todayJalali() }
              : store,
          ),
        );
        requestsState.setValue((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
        log(`درخواست اصلاح «${request.storeName}» تأیید و در سایت منتشر شد.`, "verify");
      },
      rejectRequest: (id) => {
        const request = requestsState.value.find((r) => r.id === id);
        requestsState.setValue((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
        if (request) log(`درخواست اصلاح «${request.storeName}» رد شد.`, "verify");
      },
      recordVerification: (storeId, result, note) => {
        const store = storesState.value.find((s) => s.id === storeId);
        if (!store) return;
        updateStore(storeId, { status: result, lastCheck: todayJalali() });
        log(`راستی‌آزمایی «${store.name}» ثبت شد (${result === "verified" ? "تأیید" : result === "pending" ? "نیازمند بررسی" : "رد"}) — ${note}`, "verify");
      },
      log,
      resetDemo: () => {
        storesState.setValue(seedStores);
        operatorsState.setValue(seedOperators);
        requestsState.setValue(seedRequests);
        activitiesState.setValue(seedActivities);
        log("داده‌های نمایشی به حالت اولیه بازگشت.", "import");
      },
      newStoreDraft: () => {
        const seq = storesState.value.length + 1;
        const id = `store-${String(seq).padStart(3, "0")}`;
        const slug = `store-${seq}-${Date.now().toString(36).slice(-4)}`;
        return {
          id,
          slug,
          name: "",
          categoryId: "mechanic",
          brands: ["ایران‌خودرو"],
          city: "تهران",
          district: "",
          address: "",
          phone: "",
          mobile: "",
          hours: "شنبه تا پنجشنبه ۹:۰۰ تا ۱۸:۰۰",
          lat: 35.7,
          lng: 51.4,
          coverIndex: seq,
          description: "",
          services: [],
          rating: 4.5,
          reviews: 0,
          status: "unverified",
          lastCheck: null,
          ownerName: "",
          verifyToken: `vrf-${slug}-${Date.now().toString(36)}`,
          featured: false,
          since: "1400",
          priceLevel: 2,
          pickup: false,
          onlineBooking: true,
        };
      },
    }),
    [storesState, operatorsState, requestsState, activitiesState, registrationsState, authState, log, updateStore],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

/** خواندن داده‌های پنل از خارج از Context (مثلاً برای صفحه verify) */
export function readStores(): Store[] {
  return readLocal<Store[]>("stores", seedStores);
}
