"use client";
import { HeroCard, HeroChip, HeroLink } from "@/components/HeroPrimitives";
import { asset } from "@/lib/data";
import type { CatalogEntry } from "@/lib/catalog";
import { Arrow } from "./Arrow";

export function ModelCard({
  entry,
  hidden = false,
}: {
  entry: CatalogEntry;
  hidden?: boolean;
}) {
  const { supported, photo, video, fullTitle, priceDisplay, shortNote, slug } =
    entry;

  return (
    <HeroCard
      className={`model-card${supported ? "" : " model-card--unsupported"}`}
      hidden={hidden}
    >
      <div className="vehicle-photo">
        <img
          src={asset(photo || "assets/car-placeholder.svg")}
          alt={photo ? fullTitle : `Иллюстрация ${fullTitle}`}
          width={640}
          height={320}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/assets/car-placeholder.svg";
            e.currentTarget.alt = "Место для фотографии автомобиля";
          }}
        />
        {video && <span className="model-video-pill">▶ Видео</span>}
      </div>

      <h3>{fullTitle}</h3>

      <div className="chips">
        {supported && entry.services.apps?.enabled && (
          <HeroChip className="chip chip--primary">Установка приложений</HeroChip>
        )}
        {supported && entry.services.russian?.enabled && (
          <HeroChip className="chip">Русификация ГУ</HeroChip>
        )}
        {supported && entry.services.dashboard?.enabled && (
          <HeroChip className="chip">Приборка</HeroChip>
        )}
        {supported && entry.services.firmware?.enabled && (
          <HeroChip className="chip">Прошивка</HeroChip>
        )}
        {entry.needsCompatibility && (
          <HeroChip className="chip">Проверка по фото ГУ</HeroChip>
        )}
        {!supported && <HeroChip className="chip">Не прошивается</HeroChip>}
      </div>

      <p className="model-price">{priceDisplay}</p>
      <p className="model-note">{shortNote}</p>

      <HeroLink
        className="button btn btn--primary model-link"
        href={`/model/${slug}`}
      >
        <span>Подробнее и цены</span>
        <Arrow />
      </HeroLink>
    </HeroCard>
  );
}