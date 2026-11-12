import type { MetadataRoute } from "next";
import { getCmsData } from "@/lib/cms-store";
import {
  brandSlug,
  buildCatalogFromModels,
  orderedMakesFromEntries,
} from "@/lib/catalog";
import { getServerCity } from "@/lib/server-city";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { origin } = await getServerCity();
  const cms = getCmsData();
  const entries = buildCatalogFromModels(cms.models, cms.brandAliases, cms.works);
  const makes = orderedMakesFromEntries(entries);
  const now = new Date(cms.updatedAt || Date.now());

  return [
    { url: origin, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/legal`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    ...cms.customPages
      .filter((p) => p.published)
      .map((p) => ({
        url: `${origin}/${p.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      })),
    ...makes.map((make) => ({
      url: `${origin}/brand/${brandSlug(make)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...entries.map((entry) => ({
      url: `${origin}/model/${entry.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: entry.supported ? 0.8 : 0.5,
    })),
  ];
}