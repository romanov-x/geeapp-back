"use client";
import { HeroCard } from "@/components/HeroPrimitives";
import { useCms } from "./CmsProvider";

export function Services() {
  const { serviceTiles } = useCms();
  return (
    <section
      className="section services-section"
      id="services"
      aria-labelledby="services-title"
    >
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="kicker">Услуги</p>
            <h2 id="services-title">Всё для мультимедиа вашего автомобиля.</h2>
            <p>
              Работаем поверх штатной системы: заводскую проводку не трогаем, всё
              можно вернуть к заводскому состоянию.
            </p>
          </div>
        </div>
        <div className="services-bento">
          {serviceTiles.map((tile, idx) => (
            <HeroCard
              key={tile.id}
              className={`service-tile${idx === 0 ? " service-tile--wide" : ""}`}
            >
              <span className="tile-num" aria-hidden="true">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3>{tile.title}</h3>
              <p>{tile.description}</p>
            </HeroCard>
          ))}
        </div>
      </div>
    </section>
  );
}