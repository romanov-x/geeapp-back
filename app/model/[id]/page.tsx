import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { HeroChip, HeroLink } from "@/components/HeroPrimitives";
import { Arrow } from "@/components/Arrow";
import { BookingButton } from "@/components/BookingButton";
import { DetailFooter, DetailHeader } from "@/components/DetailChrome";
import { asset, orderedMakes } from "@/lib/data";
import { formatWorkSummary } from "@/lib/cities";
import { getServerCity } from "@/lib/server-city";
import {
  BRAND_ALIASES,
  brandSlug,
  buildModelJsonLd,
  entriesByMake,
  resolveModelParam,
} from "@/lib/catalog";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const resolved = resolveModelParam(id);
  if (!resolved) return { title: "Модель не найдена — GeeApp" };

  const { city, origin } = await getServerCity();
  const { entry } = resolved;
  const canonicalUrl = `${origin}/model/${entry.slug}`;

  const servicePhrase = !entry.supported
    ? "совместимость и особенности штатной магнитолы"
    : entry.car?.service === "apps" && entry.rus
    ? `прошивка, русификация и приложения ${city.inName}`
    : entry.car?.service === "apps"
    ? `установка приложений и прошивка ГУ ${city.inName}`
    : entry.rus
    ? `русификация мультимедиа ${city.inName}`
    : `настройка штатной мультимедиа ${city.inName}`;

  const pricePhrase =
    entry.supported && entry.minPrice ? ` Цена от ${entry.priceDisplay}.` : "";
  const formatPhrase = city.isHeadquarters
    ? "Приём в сервисе в Челябинске (ул. Энтузиастов, 28а) и онлайн-прошивка."
    : `Мастера-партнёры ${city.inName} и дистанционная онлайн-прошивка.`;

  const title = `${entry.fullTitle}: ${servicePhrase} — GeeApp`;
  const description = `${entry.fullTitle} — ${servicePhrase}.${pricePhrase} ${formatPhrase}`;

  return {
    title,
    description,
    keywords: [
      `${entry.fullTitle} прошивка ${city.name}`,
      `русификация ${entry.fullTitle} ${city.name}`,
      `Яндекс Навигатор ${entry.fullTitle}`,
      ...entry.aliases,
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "GeeApp",
      locale: "ru_RU",
      type: "website",
      ...(entry.photo ? { images: [{ url: `${origin}${asset(entry.photo)}` }] } : {}),
    },
  };
}

export default async function ModelPage({ params }: Props) {
  const { id } = await params;
  const resolved = resolveModelParam(id);
  if (!resolved) notFound();
  if (!resolved.isCanonical) permanentRedirect(`/model/${resolved.entry.slug}`);

  const { city, origin } = await getServerCity();
  const { entry } = resolved;
  const siblings = entriesByMake(entry.make)
    .filter((item) => item.slug !== entry.slug)
    .slice(0, 6);
  const jsonLd = buildModelJsonLd(entry, origin, city.name);
  const ruBrand = BRAND_ALIASES[entry.make]?.[0];
  const headerHref = entry.supported
    ? `/?book=${encodeURIComponent(entry.slug)}#home`
    : `/brand/${entry.brandSlug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DetailHeader href={headerHref} />
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
                  Индексы и названия: {entry.aliases.slice(0, 5).join(" · ")}
                </p>
              )}

              <div className="chips" id="model-chips">
                {entry.car?.service === "apps" && entry.supported && (
                  <>
                    <HeroChip className="chip chip--primary">Установка приложений</HeroChip>
                    <HeroChip className="chip">Прошивка ГУ</HeroChip>
                  </>
                )}
                {(entry.rus || entry.car?.id === "car-2") && (
                  <HeroChip className="chip">Русификация</HeroChip>
                )}
                {!entry.supported && <HeroChip className="chip">Не прошивается</HeroChip>}
                {entry.needsCompatibility && <HeroChip className="chip">Проверка по фото ГУ</HeroChip>}
              </div>

              <p className="model-price" id="model-price">{entry.priceDisplay}</p>

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

            <div className="vehicle-photo model-photo">
              <img
                id="model-photo"
                src={asset(entry.photo || "assets/car-placeholder.svg")}
                alt={
                  entry.photo
                    ? `${entry.fullTitle} — прошивка и русификация ${city.inName}`
                    : `Иллюстрация ${entry.fullTitle}`
                }
                width={640}
                height={320}
              />
            </div>
          </div>

          {entry.packages.length > 0 && (
            <section className="model-packages" aria-labelledby="packages-heading">
              <h2 id="packages-heading">Доступные пакеты и состав работ</h2>
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

          <section className="model-detail" id="model-detail">
            <h2 id="model-detail-title">
              {entry.supported
                ? `Как проходит запись и работа ${city.inName}`
                : `Техническая справка по ${entry.fullTitle}`}
            </h2>
            <p id="model-detail-text">{entry.expertSummary}</p>

            {entry.supported && (
              <div className="model-formats-strip">
                <div className="model-format-step">
                  <strong>1. Заявка администратору</strong>
                  <span>Проверяем год выпуска и версию прошивки ГУ вашего {entry.cleanName} по фото экрана.</span>
                </div>
                <div className="model-format-step">
                  <strong>
                    {city.isHeadquarters
                      ? "2. Сервис в Челябинске или онлайн"
                      : `2. Мастер-партнёр ${city.inName} или онлайн`}
                  </strong>
                  <span>
                    {city.isHeadquarters
                      ? "Приглашаем в бокс на ул. Энтузиастов, 28а или подключаем онлайн-прошивку."
                      : `Администратор передаёт запись проверенному мастеру-партнёру ${city.inName} либо назначает онлайн-сессию.`}
                  </span>
                </div>
                <div className="model-format-step">
                  <strong>3. Сохранение штатных систем</strong>
                  <span>Камеры 360°, климат, микрофоны и возможность возврата к заводскому виду сохраняются.</span>
                </div>
              </div>
            )}
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
                <HeroLink className="brand-section-link text-link" href={`/brand/${entry.brandSlug}`}>
                  Все модели {entry.make} ({entriesByMake(entry.make).length}) →
                </HeroLink>
              </div>
              <div className="sibling-pills">
                {siblings.map((sib) => (
                  <HeroLink key={sib.slug} className="strip-pill" href={`/model/${sib.slug}`}>
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
              {orderedMakes().map((m) => (
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