import type { MetadataRoute } from "next";
import { orderedMakes } from "@/lib/data";
import { brandSlug, catalogEntries } from "@/lib/catalog";
import { getServerCity } from "@/lib/server-city";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { origin } = await getServerCity();
  const now = new Date();

  return [
    { url: origin, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${origin}/consent`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    ...orderedMakes().map((make) => ({
      url: `${origin}/brand/${brandSlug(make)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...catalogEntries.map((entry) => ({
      url: `${origin}/model/${entry.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: entry.supported ? 0.8 : 0.5,
    })),
  ];
}