import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/verify/"] },
    ],
    sitemap: "https://khodroyar.ir/sitemap.xml",
  };
}
