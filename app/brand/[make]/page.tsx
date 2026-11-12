import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { HeroLink } from "@/components/HeroPrimitives";
import { DetailFooter, DetailHeader } from "@/components/DetailChrome";
import { ModelCard } from "@/components/ModelCard";
import { money, orderedMakes } from "@/lib/data";
import { formatWorkSummary } from "@/lib/cities";
import { getServerCity } from "@/lib/server-city";
import {
  BRAND_ALIASES,
  brandSlug,
  buildBrandJsonLd,
  entriesByMake,
  resolveBrandParam,
} from "@/lib/catalog";

type Props = { params: Promise<{ make: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { make: rawMake } = await params;
  const resolved = resolveBrandParam(rawMake);
  if (!resolved) return { title: "Марка не найдена — GeeApp" };

  const { city, origin } = await getServerCity();
  const { make, slug } = resolved;
  const entries = entriesByMake(make);
  const prices = entries
    .map((e) => e.minPrice)
    .filter((p): p is number => typeof p === "number" && p > 0);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const canonicalUrl = `${origin}/brand/${slug}`;
  const ruAliases = BRAND_ALIASES[make] || [];

  const title = `Прошивка и русификация ${make}${ruAliases[0] ? ` (${ruAliases[0]})` : ""} ${city.inName} — цены и модели | GeeApp`;
  const description = `Установка Яндекс Навигатора, приложений и русификация штатной мультимедиа ${make} ${city.inName} (${entries.length} мод.)${minPrice ? ` от ${money(minPrice)}` : ""}. ${formatWorkSummary(city)}`;

  return {
    title,
    description,
    keywords: [
      `прошивка ${make} ${city.name}`,
      `русификация ${make} ${city.name}`,
      `установка приложений ${make}`,
      ...ruAliases,
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "GeeApp",
      locale: "ru_RU",
      type: "website",
    },
  };
}

export default async function BrandPage({ params }: Props) {
  const { make: rawMake } = await params;
  const resolved = resolveBrandParam(rawMake);
  if (!resolved) notFound();
  if (!resolved.isCanonical) permanentRedirect(`/brand/${resolved.slug}`);

  const { city, origin } = await getServerCity();
  const { make } = resolved;
  const entries = entriesByMake(make);
  if (!entries.length) notFound();

  const appsCount = entries.filter((e) => e.car?.service === "apps" && e.supported).length;
  const rusCount = entries.filter((e) => e.rus || e.car?.id === "car-2").length;
  const ruBrand = BRAND_ALIASES[make]?.[0];
  const jsonLd = buildBrandJsonLd(make, origin);

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
              В каталоге {entries.length} актуальных моделей {make}
              {appsCount > 0 ? ` (пакеты приложений: ${appsCount}` : ""}
              {appsCount > 0 && rusCount > 0 ? `, русификация: ${rusCount})` : appsCount > 0 ? ")" : ""}.{" "}
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
              {orderedMakes()
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