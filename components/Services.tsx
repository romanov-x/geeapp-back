"use client";
import { HeroCard } from "@/components/HeroPrimitives";
import { useCms } from "./CmsProvider";

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  apps: <><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></>,
  russian: <><rect x="2.5" y="4" width="19" height="12" rx="2" /><path d="M8 20h8M12 16v4M7 10h4M7 7.5h7" /></>,
  dash: <><path d="M4 14a8 8 0 0 1 16 0M12 14l3.5-3.5" /><circle cx="12" cy="14" r="1.4" /></>,
  format: <><path d="M12 21s-7-5.3-7-11a7 7 0 0 1 14 0c0 5.7-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></>,
  rollback: <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />,
  check: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5M8 10.5l1.8 1.8 3.5-3.6" /></>,
};

const APP_ICONS = [
  ["navi", "Яндекс Навигатор"], ["ym", "Яндекс Музыка"],
  ["vkvideo", "VK Видео"], ["rutube", "RUTUBE"],
  ["rustore", "RuStore"], ["fmplay", "FM Play"],
  ["tv", "ТВ"], ["hud", "HUD Антирадар"],
] as const;

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
        <div className="service-tiles">
          {serviceTiles.map((tile) => (
            <HeroCard
              key={tile.id}
              className="service-tile"
            >
              <span className="tile-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {SERVICE_ICONS[tile.id] || SERVICE_ICONS.apps}
                </svg>
              </span>
              <h3>{tile.title}</h3>
              {tile.id === "apps" && (
                <div className="app-icons" aria-label="Примеры приложений">
                  {APP_ICONS.map(([name, label]) => (
                    <img key={name} src={`/assets/apps/${name}-logo.png`} alt={label} title={label} width={40} height={40} loading="lazy" />
                  ))}
                </div>
              )}
              <p>{tile.description}</p>
            </HeroCard>
          ))}
        </div>
      </div>
    </section>
  );
}
