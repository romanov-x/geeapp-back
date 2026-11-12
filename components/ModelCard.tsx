"use client";
import { HeroCard, HeroChip, HeroLink } from "@/components/HeroPrimitives";
import { asset, type Vehicle } from "@/lib/data";
import {
  catalogEntries,
  entryForVehicleId,
  type CatalogEntry,
} from "@/lib/catalog";
import { Arrow } from "./Arrow";

type ModelCardProps = {
  entry?: CatalogEntry;
  car?: Vehicle | null;
  rus?: Vehicle | null;
  hidden?: boolean;
};

export function ModelCard({ entry, car, rus, hidden = false }: ModelCardProps) {
  const resolved =
    entry ||
    (car ? entryForVehicleId(car.id) : rus ? entryForVehicleId(rus.id) : undefined) ||
    catalogEntries[0];

  const { supported, photo, fullTitle, priceDisplay, shortNote, slug } = resolved;

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
      </div>

      <h3>{fullTitle}</h3>

      <div className="chips">
        {resolved.car?.service === "apps" && supported && (
          <>
            <HeroChip className="chip chip--primary">Установка приложений</HeroChip>
            <HeroChip className="chip">Прошивка</HeroChip>
          </>
        )}
        {resolved.needsCompatibility && (
          <HeroChip className="chip">Совместимость уточняется</HeroChip>
        )}
        {(resolved.rus || resolved.car?.id === "car-2") && (
          <HeroChip className="chip">Русификация</HeroChip>
        )}
        {!supported && <HeroChip className="chip">Не прошивается</HeroChip>}
      </div>

      <p className="model-price">{priceDisplay}</p>
      <p className="model-note">{shortNote}</p>

      <HeroLink className="button btn btn--primary model-link" href={`/model/${slug}`}>
        <span>Подробнее и цены</span>
        <Arrow />
      </HeroLink>
    </HeroCard>
  );
}