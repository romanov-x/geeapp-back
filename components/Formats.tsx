"use client";
import { HeroCard } from "@/components/HeroPrimitives";
import { BookingButton } from "./BookingButton";
import { useCms } from "./CmsProvider";
import { Arrow } from "./Arrow";

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
              {fmt.badge && <span className="format-badge">{fmt.badge}</span>}
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
      </div>
    </section>
  );
}
