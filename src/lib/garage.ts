"use client";

import { useCallback } from "react";
import { useLocalStore } from "@/lib/useLocalStore";
import { randomId, todayJalali } from "@/lib/format";
import type { DocumentRecord, FuelRecord, ServiceRecord, Vehicle } from "@/lib/types";

const demoDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  try {
    return new Intl.DateTimeFormat("fa-IR", { dateStyle: "short" }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
};

export function useGarage() {
  const vehicles = useLocalStore<Vehicle[]>("vehicles", []);
  const services = useLocalStore<ServiceRecord[]>("serviceRecords", []);
  const fuels = useLocalStore<FuelRecord[]>("fuelRecords", []);
  const documents = useLocalStore<DocumentRecord[]>("documents", []);

  const addVehicle = useCallback(
    (input: Omit<Vehicle, "id" | "createdAt">) => {
      const vehicle: Vehicle = { ...input, id: randomId("veh"), createdAt: todayJalali() };
      vehicles.setValue((prev) => [vehicle, ...prev]);
      return vehicle;
    },
    [vehicles],
  );

  const removeVehicle = useCallback(
    (id: string) => {
      vehicles.setValue((prev) => prev.filter((v) => v.id !== id));
      services.setValue((prev) => prev.filter((r) => r.vehicleId !== id));
      fuels.setValue((prev) => prev.filter((r) => r.vehicleId !== id));
      documents.setValue((prev) => prev.filter((r) => r.vehicleId !== id));
    },
    [vehicles, services, fuels, documents],
  );

  const updateMileage = useCallback(
    (id: string, mileage: number) => {
      vehicles.setValue((prev) => prev.map((v) => (v.id === id ? { ...v, mileage } : v)));
    },
    [vehicles],
  );

  const addService = useCallback(
    (input: Omit<ServiceRecord, "id" | "createdAt">) => {
      const record: ServiceRecord = { ...input, id: randomId("srv"), createdAt: todayJalali() };
      services.setValue((prev) => [record, ...prev]);
      return record;
    },
    [services],
  );

  const addFuel = useCallback(
    (input: Omit<FuelRecord, "id" | "createdAt">) => {
      const record: FuelRecord = { ...input, id: randomId("fuel"), createdAt: todayJalali() };
      fuels.setValue((prev) => [record, ...prev]);
      return record;
    },
    [fuels],
  );

  const addDocument = useCallback(
    (input: Omit<DocumentRecord, "id" | "createdAt">) => {
      const record: DocumentRecord = { ...input, id: randomId("doc"), createdAt: todayJalali() };
      documents.setValue((prev) => [record, ...prev]);
      return record;
    },
    [documents],
  );

  const removeService = useCallback((id: string) => services.setValue((prev) => prev.filter((s) => s.id !== id)), [services]);
  const removeFuel = useCallback((id: string) => fuels.setValue((prev) => prev.filter((s) => s.id !== id)), [fuels]);
  const removeDocument = useCallback((id: string) => documents.setValue((prev) => prev.filter((s) => s.id !== id)), [documents]);

  const loadDemo = useCallback(() => {
    const vehicle: Vehicle = {
      id: randomId("veh"),
      manufacturer: "ایران‌خودرو",
      model: "پژو ۲۰۷",
      trim: "پانوراما اتوماتیک",
      year: 1402,
      mileage: 52400,
      plate: "۲۲ الف ۳۴۵ — ایران ۱۱",
      fuelType: "بنزین",
      color: "خاکستری",
      vin: "IR207PA1402218",
      createdAt: todayJalali(),
    };
    const demoServices: ServiceRecord[] = [
      {
        id: randomId("srv"),
        vehicleId: vehicle.id,
        date: demoDate(120),
        mileage: 46200,
        cost: 4800000,
        type: "تعویض لنت ترمز",
        provider: "تعمیرگاه پارس‌آوران",
        note: "لنت جلو و دیسک سمت راست تعویض شد.",
        createdAt: todayJalali(),
      },
      {
        id: randomId("srv"),
        vehicleId: vehicle.id,
        date: demoDate(48),
        mileage: 50000,
        cost: 3200000,
        type: "تعویض روغن و فیلتر",
        provider: "اتوکلینیک ونک",
        note: "روغن ۵W-30 و فیلتر روغن و هوا.",
        nextMileage: 55000,
        createdAt: todayJalali(),
      },
    ];
    const demoFuels: FuelRecord[] = [
      {
        id: randomId("fuel"),
        vehicleId: vehicle.id,
        date: demoDate(96),
        mileage: 48000,
        liters: 42,
        cost: 126000,
        station: "جایگاه همت",
        fullTank: true,
        createdAt: todayJalali(),
      },
      {
        id: randomId("fuel"),
        vehicleId: vehicle.id,
        date: demoDate(54),
        mileage: 48750,
        liters: 38,
        cost: 114000,
        station: "جایگاه پونک",
        fullTank: true,
        createdAt: todayJalali(),
      },
      {
        id: randomId("fuel"),
        vehicleId: vehicle.id,
        date: demoDate(12),
        mileage: 52100,
        liters: 45,
        cost: 135000,
        station: "جایگاه همت",
        fullTank: true,
        createdAt: todayJalali(),
      },
    ];
    vehicles.setValue([vehicle]);
    services.setValue(demoServices);
    fuels.setValue(demoFuels);
    documents.setValue([]);
  }, [vehicles, services, fuels, documents]);

  return {
    vehicles: vehicles.value,
    services: services.value,
    fuels: fuels.value,
    documents: documents.value,
    ready: vehicles.ready && services.ready && fuels.ready && documents.ready,
    addVehicle,
    removeVehicle,
    updateMileage,
    addService,
    addFuel,
    addDocument,
    removeService,
    removeFuel,
    removeDocument,
    loadDemo,
  };
}
