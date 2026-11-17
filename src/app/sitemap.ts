import type { MetadataRoute } from "next";
import { seedStores } from "@/data/stores";

const base = "https://khodroyar.ir";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/stores", "/centers", "/garage", "/register", "/proposal"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const storeRoutes = seedStores.map((store) => ({
    url: `${base}/stores/${store.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...storeRoutes];
}
