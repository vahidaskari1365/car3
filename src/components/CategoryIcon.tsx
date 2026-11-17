import {
  Archive,
  BadgeCheck,
  Car,
  Database,
  FileText,
  Gauge,
  LayoutDashboard,
  Map,
  Monitor,
  Palette,
  Shield,
  Store,
  Table,
  Wallet,
  CircleDot,
  ClipboardCheck,
  Droplet,
  Fuel,
  Layers,
  Package,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Truck,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  wrench: Wrench,
  droplet: Droplet,
  spray: SprayCan,
  circleDot: CircleDot,
  zap: Zap,
  package: Package,
  sparkles: Sparkles,
  shieldCheck: ShieldCheck,
  layers: Layers,
  truck: Truck,
  fuel: Fuel,
  wind: Wind,
  badge: BadgeCheck,
  clipboardCheck: ClipboardCheck,
  monitor: Monitor,
  database: Database,
  palette: Palette,
  map: Map,
  shield: Shield,
  archive: Archive,
  car: Car,
  store: Store,
  table: Table,
  file: FileText,
  gauge: Gauge,
  wallet: Wallet,
  dashboard: LayoutDashboard,
};

export function CategoryIcon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name] ?? Wrench;
  return <Icon className={className} strokeWidth={1.9} aria-hidden="true" />;
}

export function getIcon(name: string): LucideIcon {
  return icons[name] ?? Wrench;
}
