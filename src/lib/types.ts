export type VerificationStatus = "verified" | "pending" | "unverified";

export type CategoryId =
  | "mechanic"
  | "oil"
  | "body"
  | "tire"
  | "electrical"
  | "parts"
  | "wash"
  | "inspection"
  | "glass"
  | "towing";

export interface Category {
  id: CategoryId;
  title: string;
  short: string;
  blurb: string;
  icon: string;
  image: string;
  color: string;
}

export interface City {
  name: string;
  districts: string[];
}

export interface Store {
  id: string;
  slug: string;
  name: string;
  categoryId: CategoryId;
  brands: string[];
  city: string;
  district: string;
  address: string;
  phone: string;
  mobile: string;
  hours: string;
  lat: number;
  lng: number;
  coverIndex: number;
  description: string;
  services: string[];
  rating: number;
  reviews: number;
  status: VerificationStatus;
  lastCheck: string | null;
  ownerName: string;
  verifyToken: string;
  featured: boolean;
  since: string;
  priceLevel: 1 | 2 | 3;
  pickup: boolean;
  onlineBooking: boolean;
}

export type CenterType = "fuel" | "cng" | "plate" | "inspection";

export interface EssentialCenter {
  id: string;
  name: string;
  type: CenterType;
  city: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  hours: string;
  phone?: string;
  note?: string;
}

export interface Operator {
  id: string;
  name: string;
  email: string;
  role: "مدیر سامانه" | "اپراتور راستی‌آزمایی" | "اپراتور محتوا" | "پشتیبان";
  active: boolean;
  stores: number;
  lastLogin: string;
  permissions: string[];
}

export interface ChangeRequest {
  id: string;
  storeId: string;
  storeName: string;
  submittedAt: string;
  channel: "لینک اختصاصی" | "تماس تلفنی" | "فرم عمومی";
  summary: string;
  payload: Partial<Store>;
  status: "pending" | "approved" | "rejected";
}

export interface ActivityItem {
  id: string;
  at: string;
  text: string;
  kind: "verify" | "store" | "operator" | "import";
}

export interface Vehicle {
  id: string;
  manufacturer: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
  plate: string;
  fuelType: "بنزین" | "گازوئیل" | "دوگانه‌سوز" | "هیبرید" | "برقی";
  color: string;
  vin?: string;
  createdAt: string;
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  date: string;
  mileage: number;
  cost: number;
  type: string;
  provider: string;
  note: string;
  nextMileage?: number;
  createdAt: string;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: string;
  mileage: number;
  liters: number;
  cost: number;
  station: string;
  fullTank: boolean;
  createdAt: string;
}

export interface DocumentRecord {
  id: string;
  vehicleId: string;
  title: string;
  kind: "فاکتور" | "بیمه‌نامه" | "کارت خودرو" | "معاینه فنی" | "سایر";
  dataUrl: string;
  size: number;
  createdAt: string;
}
