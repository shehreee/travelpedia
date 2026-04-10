import type { MetadataRoute } from "next";

function siteBase(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (typeof process.env.VERCEL_URL === "string" ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000"
  );
}

export default function robots(): MetadataRoute.Robots {
  const base = siteBase();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/operator/", "/auth/callback"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
