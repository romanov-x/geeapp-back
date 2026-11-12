"use client";
import { HeroButton, HeroLink, HeroCard } from "@/components/HeroPrimitives";
import { useEffect, useMemo, useRef } from "react";
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

  useEffect(() => {
    const videos = track.current?.querySelectorAll("video");
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () =>
      videos?.forEach((v) => {
        if (media.matches) v.pause();
        else void v.play().catch(() => {});
      });
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [cms.works]);

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
    el.scrollTo({ left, behavior: "smooth" });
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
              tabIndex={0}
              onClick={(e) => e.currentTarget.focus()}
              key={work.id}
            >
              {work.video ? (
                <video
                  src={asset(work.video)}
                  poster={work.img ? asset(work.img) : undefined}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  aria-hidden="true"
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
          onClick={() => move(-1)}
        >
          ←
        </HeroButton>
        <HeroButton
          id="works-next"
          className="button btn btn--secondary"
          aria-label="Следующая работа"
          onClick={() => move(1)}
        >
          →
        </HeroButton>
      </div>
    </>
  );
}