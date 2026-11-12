"use client";
import { HeroCard } from "@/components/HeroPrimitives";
import { BookingButton } from "./BookingButton";
import { useCms } from "./CmsProvider";
import { Arrow } from "./Arrow";

function FormatIcon({ service }: { service: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {service === "apps" ? <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>
        : service === "russian" ? <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 6h14M5 18h14" /></>
        : service === "firmware" ? <><rect x="6" y="6" width="12" height="12" rx="3" /><rect x="10" y="10" width="4" height="4" rx="1" /><path d="M9 3v3m6-3v3M9 18v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3" /></>
        : <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5M8 10.5h5m-2.5-2.5v5" /></>}
    </svg>
  );
}

export function Formats() {
  const { formats } = useCms();
  return (
    <section
      className="section formats-section"
      id="formats"
      aria-labelledby="formats-title"
    >
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="kicker">Тарифы</p>
            <h2 id="formats-title">Выберите формат работы.</h2>
          </div>
        </div>
        <div className="format-cards">
          {formats.map((fmt) => (
            <HeroCard
              key={fmt.id}
              className={`format-card${
                fmt.featured ? " format-card--featured" : ""
              }`}
            >
              <div className="format-topline">
                <span className="format-icon"><FormatIcon service={fmt.serviceId} /></span>
                {fmt.badge && <span className="format-badge">{fmt.badge}</span>}
              </div>
              <h3 className="format-name">{fmt.title}</h3>
              <p className="format-price">{fmt.price}</p>
              <p className="format-desc">{fmt.description}</p>
              <ul className="format-list">
                {fmt.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <BookingButton
                className={`button btn ${
                  fmt.featured ? "btn--primary" : "btn--secondary"
                }`}
                service={fmt.serviceId}
              >
                {fmt.ctaLabel} <Arrow />
              </BookingButton>
            </HeroCard>
          ))}
        </div>
        <p className="fine-print formats-note">Стоимость зависит от модели и версии мультимедиа. Точный состав работ согласуем до записи.</p>
      </div>
    </section>
  );
}
