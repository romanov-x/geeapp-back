"use client";
import { HeroButton, HeroLink, HeroCard } from "@/components/HeroPrimitives";
import { useMemo, useRef } from "react";
import { asset } from "@/lib/data";
import { buildCatalogFromModels, entryByVehicleId } from "@/lib/catalog";
import { useCms } from "./CmsProvider";
import { Arrow } from "./Arrow";

export function WorksCarousel() {
  const cms = useCms();
  const entries = useMemo(
    () => buildCatalogFromModels(cms.models, cms.brandAliases, cms.works),
    [cms.models, cms.brandAliases, cms.works]
  );
  const track = useRef<HTMLDivElement>(null);

  const move = (direction: number) => {
    const el = track.current;
    if (!el?.firstElementChild) return;
    const step =
      el.firstElementChild.getBoundingClientRect().width +
      parseFloat(getComputedStyle(el).columnGap);
    const max = el.scrollWidth - el.clientWidth;
    const left =
      direction > 0
        ? el.scrollLeft >= max - 2
          ? 0
          : Math.min(max, el.scrollLeft + step)
        : el.scrollLeft <= 2
        ? max
        : Math.max(0, el.scrollLeft - step);
    el.scrollTo({ left, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return (
    <>
      <div className="works-track" id="works-track" ref={track}>
        {cms.works.map((work) => {
          const entry = entryByVehicleId(entries, work.car);
          const modelSlug = entry ? entry.slug : work.car;

          return (
            <HeroCard
              className="work-card"
              key={work.id}
            >
              {work.video ? (
                <video
                  src={asset(work.video)}
                  poster={work.img ? asset(work.img) : undefined}
                  muted
                  playsInline
                  controls
                  preload="metadata"
                  aria-label={`Видео: ${entry?.fullTitle || "Кейс GeeApp"}`}
                />
              ) : (
                <img
                  src={asset(work.img || "assets/car-placeholder.svg")}
                  alt={entry?.fullTitle || "Кейс GeeApp"}
                  loading="lazy"
                  width={720}
                  height={1280}
                />
              )}
              <div className="work-body">
                <h4 className="work-car">
                  {entry ? entry.fullTitle : "Автомобиль"}
                </h4>
                <div className="work-details">
                  <p className="work-done">{work.done}</p>
                  {entry && (
                    <HeroLink
                      className="button btn work-link"
                      href={`/model/${modelSlug}`}
                    >
                      <span>Страница модели</span>
                      <Arrow />
                    </HeroLink>
                  )}
                </div>
              </div>
            </HeroCard>
          );
        })}
      </div>
      <div
        className="works-controls"
        aria-label="Управление каруселью работ"
        hidden={cms.works.length < 2}
      >
        <HeroButton
          id="works-prev"
          className="button btn btn--secondary"
          aria-label="Предыдущая работа"
          aria-controls="works-track"
          onClick={() => move(-1)}
        >
          ←
        </HeroButton>
        <HeroButton
          id="works-next"
          className="button btn btn--secondary"
          aria-label="Следующая работа"
          aria-controls="works-track"
          onClick={() => move(1)}
        >
          →
        </HeroButton>
      </div>
    </>
  );
}
