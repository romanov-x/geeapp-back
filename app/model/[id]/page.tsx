import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { HeroChip, HeroLink } from "@/components/HeroPrimitives";
import { Arrow } from "@/components/Arrow";
import { BookingButton } from "@/components/BookingButton";
import { DetailFooter, DetailHeader } from "@/components/DetailChrome";
import { ReviewsSection } from "@/components/ReviewsSection";
import { asset } from "@/lib/data";
import { formatWorkSummary } from "@/lib/cities";
import { getCmsData } from "@/lib/cms-store";
import { getServerCity } from "@/lib/server-city";
import {
  brandSlug,
  buildCatalogFromModels,
  buildModelJsonLd,
  entriesFromMake,
  orderedMakesFromEntries,
  resolveModelFromEntries,
} from "@/lib/catalog";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cms = getCmsData();
  const entries = buildCatalogFromModels(cms.models, cms.brandAliases, cms.works);
  const resolved = resolveModelFromEntries(entries, id);
  if (!resolved) return { title: "Модель не найдена — GeeApp" };

  const { city, origin } = await getServerCity();
  const { entry } = resolved;
  const canonicalUrl = `${origin}/model/${entry.slug}`;

  const title = `${entry.fullTitle}: прошивка, русификация и приложения ${city.inName} — GeeApp`;
  const description = `${entry.fullTitle} — настройка штатной мультимедиа ${city.inName}. ${
    entry.supported ? `Стоимость: ${entry.priceDisplay}.` : ""
  } ${formatWorkSummary(city)}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: cms.settings.brandName || "GeeApp",
      locale: "ru_RU",
      type: "website",
      ...(entry.photo ? { images: [{ url: `${origin}${asset(entry.photo)}` }] } : {}),
    },
  };
}

export default async function ModelPage({ params }: Props) {
  const { id } = await params;
  const cms = getCmsData();
  const entries = buildCatalogFromModels(cms.models, cms.brandAliases, cms.works);
  const resolved = resolveModelFromEntries(entries, id);
  if (!resolved) notFound();
  if (!resolved.isCanonical) permanentRedirect(`/model/${resolved.entry.slug}`);

  const { city, origin } = await getServerCity();
  const { entry } = resolved;
  const brandEntries = entriesFromMake(entries, entry.make);
  const siblings = brandEntries.filter((item) => item.slug !== entry.slug).slice(0, 6);
  const makes = orderedMakesFromEntries(entries);
  const ruBrand = cms.brandAliases[entry.make]?.[0];
  const jsonLd = buildModelJsonLd(
    entry,
    origin,
    city.name,
    cms.settings.phoneDisplay
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DetailHeader
        href={
          entry.supported
            ? `/?book=${encodeURIComponent(entry.slug)}#home`
            : `/brand/${entry.brandSlug}`
        }
      />
      <main id="model-main" className="model-page">
        <div className="wrap">
          <nav className="seo-breadcrumbs" aria-label="Хлебные крошки">
            <HeroLink href="/">Главная</HeroLink>
            <span aria-hidden="true">/</span>
            <HeroLink href="/#models">Марки авто</HeroLink>
            <span aria-hidden="true">/</span>
            <HeroLink href={`/brand/${entry.brandSlug}`}>{entry.make}</HeroLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{entry.cleanName}</span>
          </nav>

          <div className="model-hero" id="model-hero">
            <div>
              <p className="kicker" id="model-make">
                {entry.make}
                {ruBrand ? ` · ${ruBrand}` : ""} · {city.name}
              </p>
              <h1 id="model-name">
                {entry.fullTitle}
                {entry.supported ? ` — настройка мультимедиа ${city.inName}` : ""}
              </h1>

              {entry.aliases.length > 0 && (
                <p className="model-aliases">
                  Индексы и названия: {entry.aliases.slice(0, 6).join(" · ")}
                </p>
              )}

              <div className="chips" id="model-chips">
                {entry.packages.map((pkg) => (
                  <HeroChip
                    key={pkg.kind}
                    className={`chip${pkg.kind === "apps" ? " chip--primary" : ""}`}
                  >
                    {pkg.badge}: {pkg.priceLabel}
                  </HeroChip>
                ))}
                {!entry.supported && <HeroChip className="chip">Не прошивается</HeroChip>}
                {entry.needsCompatibility && (
                  <HeroChip className="chip">Проверка по фото ГУ</HeroChip>
                )}
              </div>

              <p className="model-price" id="model-price">
                {entry.priceDisplay}
              </p>

              {entry.compatibilityNote && (
                <p className="catalog-restriction model-callout" id="model-restriction">
                  {entry.compatibilityNote}
                </p>
              )}

              <div className="model-cta-group">
                {entry.supported ? (
                  <BookingButton
                    id="model-cta"
                    className="button btn btn--primary"
                    car={entry.primary}
                    service={entry.primary.service}
                  >
                    Оставить заявку {city.inName} <Arrow />
                  </BookingButton>
                ) : (
                  <HeroLink
                    className="button btn btn--secondary"
                    id="model-cta"
                    href={`/brand/${entry.brandSlug}`}
                  >
                    Смотреть поддерживаемые модели {entry.make} <Arrow />
                  </HeroLink>
                )}
              </div>

              <p className="fine-print model-fine">{formatWorkSummary(city)}</p>
            </div>

            {/* ГЛАВНОЕ ВИДЕО МОДЕЛИ (если загружено в админке) ЛИБО ФОТО */}
            <div className="vehicle-photo model-photo">
              {entry.video ? (
                <video
                  src={asset(entry.video)}
                  poster={entry.photo ? asset(entry.photo) : undefined}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="model-main-video"
                />
              ) : (
                <img
                  id="model-photo"
                  src={asset(entry.photo || "assets/car-placeholder.svg")}
                  alt={`${entry.fullTitle} — прошивка и русификация ${city.inName}`}
                  width={640}
                  height={320}
                />
              )}
            </div>
          </div>

          {entry.packages.length > 0 && (
            <section className="model-packages" aria-labelledby="packages-heading">
              <h2 id="packages-heading">Доступные услуги и цены по модели</h2>
              <div className="model-packages-grid">
                {entry.packages.map((pkg) => (
                  <article key={pkg.kind} className="model-package-card">
                    <div className="model-package-head">
                      <span className="format-badge">{pkg.badge}</span>
                      <span className="model-package-price">{pkg.priceLabel}</span>
                    </div>
                    <h3>{pkg.title}</h3>
                    <p className="model-package-summary">{pkg.summary}</p>
                    <ul className="format-list model-feature-list">
                      {pkg.features.map((feat) => (
                        <li key={feat}>{feat}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ГАЛЕРЕЯ ВЫПОЛНЕННЫХ РАБОТ МОДЕЛИ (показывается, если есть кейсы или кадры) */}
          {entry.gallery.length > 0 && (
            <section className="model-gallery-section" aria-labelledby="gallery-heading">
              <h2 id="gallery-heading">
                Примеры выполненных работ на {entry.fullTitle}
              </h2>
              <div className="model-gallery-grid">
                {entry.gallery.map((item) => (
                  <figure key={item.id} className="model-gallery-card">
                    {item.kind === "video" ? (
                      <video
                        src={asset(item.src)}
                        poster={item.poster ? asset(item.poster) : undefined}
                        controls
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={asset(item.src)}
                        alt={item.caption || entry.fullTitle}
                        loading="lazy"
                      />
                    )}
                    {item.caption && <figcaption>{item.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </section>
          )}

          <section className="model-detail" id="model-detail">
            <h2 id="model-detail-title">
              {entry.supported
                ? `Как проходит запись и работа ${city.inName}`
                : `Техническая справка по ${entry.fullTitle}`}
            </h2>
            <p id="model-detail-text">{entry.expertSummary}</p>
          </section>

          <section className="model-faq-section" aria-labelledby="model-faq-title">
            <h2 id="model-faq-title">
              Частые вопросы по {entry.fullTitle} {city.inName}
            </h2>
            <div className="model-faq-grid">
              {entry.faq.map((item) => (
                <details key={item.q} className="model-faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {siblings.length > 0 && (
            <section className="model-siblings" aria-labelledby="siblings-title">
              <div className="models-brand-heading">
                <h2 id="siblings-title">Другие модели {entry.make}</h2>
                <HeroLink
                  className="brand-section-link text-link"
                  href={`/brand/${entry.brandSlug}`}
                >
                  Все модели {entry.make} ({brandEntries.length}) →
                </HeroLink>
              </div>
              <div className="sibling-pills">
                {siblings.map((sib) => (
                  <HeroLink
                    key={sib.slug}
                    className="strip-pill"
                    href={`/model/${sib.slug}`}
                  >
                    <span>{sib.fullTitle}</span>
                    <span className="sibling-pill-price">{sib.priceDisplay}</span>
                  </HeroLink>
                ))}
              </div>
            </section>
          )}

          <nav className="other-brands-nav" aria-label="Другие марки автомобилей">
            <p className="kicker">Каталог марок</p>
            <div className="sibling-pills">
              {makes.map((m) => (
                <HeroLink key={m} className="strip-pill" href={`/brand/${brandSlug(m)}`}>
                  {m}
                </HeroLink>
              ))}
            </div>
          </nav>
        </div>

        <ReviewsSection />
      </main>
      <DetailFooter />
    </>
  );
}