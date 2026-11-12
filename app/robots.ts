import type { MetadataRoute } from "next";
import { getServerCity } from "@/lib/server-city";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { origin } = await getServerCity();

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: [
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Google-Extended",
          "Yandex",
          "YandexAdditional",
        ],
        allow: ["/", "/llms.txt"],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}