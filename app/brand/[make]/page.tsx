import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { HeroLink } from "@/components/HeroPrimitives";
import { DetailFooter, DetailHeader } from "@/components/DetailChrome";
import { ModelCard } from "@/components/ModelCard";
import { money } from "@/lib/data";
import { formatWorkSummary } from "@/lib/cities";
import { getCmsData } from "@/lib/cms-store";
import { getServerCity } from "@/lib/server-city";
import {
  brandSlug,
  buildBrandJsonLd,
  buildCatalogFromModels,
  entriesFromMake,
  orderedMakesFromEntries,
  resolveBrandFromEntries,
} from "@/lib/catalog";

type Props = { params: Promise<{ make: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { make: rawMake } = await params;
  const cms = getCmsData();
  const allEntries = buildCatalogFromModels(cms.models, cms.brandAliases, cms.works);
  const resolved = resolveBrandFromEntries(allEntries, rawMake);
  if (!resolved) return { title: "Марка не найдена — GeeApp" };

  const { city, origin } = await getServerCity();
  const { make, slug } = resolved;
  const entries = entriesFromMake(allEntries, make);
  const prices = entries
    .map((e) => e.minPrice)
    .filter((p): p is number => typeof p === "number" && p > 0);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const canonicalUrl = `${origin}/brand/${slug}`;
  const ruAliases = cms.brandAliases[make] || [];

  const title = `Прошивка и русификация ${make}${ruAliases[0] ? ` (${ruAliases[0]})` : ""} ${city.inName} — цены и модели | GeeApp`;
  const description = `Установка приложений и русификация мультимедиа ${make} ${city.inName} (${entries.length} мод.)${minPrice ? ` от ${money(minPrice)}` : ""}. ${formatWorkSummary(city)}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
  };
}

export default async function BrandPage({ params }: Props) {
  const { make: rawMake } = await params;
  const cms = getCmsData();
  const allEntries = buildCatalogFromModels(cms.models, cms.brandAliases, cms.works);
  const resolved = resolveBrandFromEntries(allEntries, rawMake);
  if (!resolved) notFound();
  if (!resolved.isCanonical) permanentRedirect(`/brand/${resolved.slug}`);

  const { city, origin } = await getServerCity();
  const { make } = resolved;
  const entries = entriesFromMake(allEntries, make);
  if (!entries.length) notFound();

  const makes = orderedMakesFromEntries(allEntries);
  const ruBrand = cms.brandAliases[make]?.[0];
  const jsonLd = buildBrandJsonLd(
    make,
    entries,
    origin,
    city.inName,
    cms.brandLogos[make]
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DetailHeader
        href={`/?make=${encodeURIComponent(brandSlug(make))}#models`}
        label="Выбрать на главной"
      />
      <main id="model-main" className="model-page">
        <div className="wrap">
          <nav className="seo-breadcrumbs" aria-label="Хлебные крошки">
            <HeroLink href="/">Главная</HeroLink>
            <span aria-hidden="true">/</span>
            <HeroLink href="/#models">Марки авто</HeroLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{make}</span>
          </nav>

          <section className="brand-detail">
            <p className="kicker">
              Каталог решений {make}
              {ruBrand ? ` · ${ruBrand}` : ""} · {city.name}
            </p>
            <h1>
              Прошивка, приложения и русификация {make} {city.inName}
            </h1>
            <p className="section-lead">
              В каталоге {entries.length} актуальных моделей {make}.{" "}
              {formatWorkSummary(city)}
            </p>

            <div className="model-cards">
              {entries.map((entry) => (
                <ModelCard key={entry.slug} entry={entry} />
              ))}
            </div>
          </section>

          <nav className="other-brands-nav" aria-label="Другие марки автомобилей">
            <p className="kicker">Другие марки в работе</p>
            <div className="sibling-pills">
              {makes
                .filter((m) => m !== make)
                .map((m) => (
                  <HeroLink key={m} className="strip-pill" href={`/brand/${brandSlug(m)}`}>
                    {m}
                  </HeroLink>
                ))}
            </div>
          </nav>
        </div>
      </main>
      <DetailFooter />
    </>
  );
}