import { getCmsData } from "@/lib/cms-store";
import {
  SITE_URL,
  brandSlug,
  buildCatalogFromModels,
  entriesFromMake,
  orderedMakesFromEntries,
} from "@/lib/catalog";

export const dynamic = "force-dynamic";

export function GET() {
  const cms = getCmsData();
  const entries = buildCatalogFromModels(cms.models, cms.brandAliases, cms.works);
  const makes = orderedMakesFromEntries(entries);

  const lines: string[] = [
    `# ${cms.settings.brandName} — Русификация, прошивка и установка приложений на штатные магнитолы авто`,
    ``,
    `> Актуальный каталог моделей и цен (${SITE_URL}). Центральный сервис: ${cms.settings.hqAddress}. Регионы РФ: мастера-партнёры и онлайн-прошивка (${cms.cities.map((c) => c.name).join(", ")}). Телефон: ${cms.settings.phoneDisplay}.`,
    ``,
    `## Поддерживаемые марки и модели (${entries.length})`,
  ];

  for (const make of makes) {
    lines.push(``, `### ${make} (${SITE_URL}/brand/${brandSlug(make)})`);
    for (const entry of entriesFromMake(entries, make)) {
      const pkgs = !entry.supported
        ? "Не прошивается"
        : entry.packages.map((p) => `${p.title}: ${p.priceLabel}`).join(", ") ||
          "По запросу";
      lines.push(
        `- [${entry.fullTitle}](${SITE_URL}/model/${entry.slug}): ${pkgs}`
      );
    }
  }

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}