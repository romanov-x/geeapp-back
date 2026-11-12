import type { MetadataRoute } from "next";
import { orderedMakes } from "@/lib/data";
import { SITE_URL, brandSlug, catalogEntries } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/consent`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const brandRoutes: MetadataRoute.Sitemap = orderedMakes().map((make) => ({
    url: `${SITE_URL}/brand/${brandSlug(make)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const modelRoutes: MetadataRoute.Sitemap = catalogEntries.map((entry) => ({
    url: `${SITE_URL}/model/${entry.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: entry.supported ? 0.8 : 0.5,
  }));

  return [...staticRoutes, ...brandRoutes, ...modelRoutes];
}