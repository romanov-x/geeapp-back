"use client";
import { asset } from "@/lib/data";
import { useCity } from "./CityProvider";
import { useCms } from "./CmsProvider";
import { BookingButton } from "./BookingButton";

export function Hero() {
  const { city, inCity, cityInfo } = useCity();
  const { hero } = useCms();

  return (
    <section
      className="hero hero--photo"
      data-enter=""
      aria-labelledby="hero-title"
    >
      <div className="wrap hero-body">
        <div className="hero-text">
          <p className="hero-kicker">
            <span data-city="">{city}</span> /{" "}
            {cityInfo.isHeadquarters ? hero.hqBadge : hero.regionalBadge}
          </p>
          <h1 id="hero-title" data-enter-whole="">
            {hero.titleBefore}{" "}
            <span className="hero-title-gradient">
              {hero.titleGradient} {inCity}
            </span>
          </h1>

          <div
            className="hero-split-media"
            aria-label="Примеры интерфейсов мультимедиа"
          >
            {hero.splitImages.map((slot, idx) => {
              const videoUrl = slot.videoSrc?.trim() || "";
              const isVideo = slot.kind === "video" && Boolean(videoUrl);
              return (
                <figure key={idx}>
                  {isVideo ? (
                    <video
                      src={asset(videoUrl)}
                      poster={slot.src ? asset(slot.src) : undefined}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={slot.alt}
                    />
                  ) : (
                    <img
                      src={asset(slot.src || "assets/car-placeholder.svg")}
                      alt={slot.alt}
                      width="420"
                      height="746"
                      decoding="async"
                    />
                  )}
                </figure>
              );
            })}
          </div>

          <div className="hero-bottom hero-benefits">
            <ul className="hero-stats" aria-label="Возможности GeeApp">
              {hero.stats.map((st, idx) => (
                <li key={idx}>
                  <strong>{st.value}</strong>
                  <span>{st.label}</span>
                </li>
              ))}
            </ul>
            <div className="hero-benefits-action">
              <BookingButton className="button btn btn--primary" service="">
                {hero.ctaLabel}{" "}
                <svg className="m-arrow" viewBox="0 0 20 20" aria-hidden="true">
                  <path className="m-arrow__stem" d="M3 10h12"></path>
                  <path className="m-arrow__head" d="M10 5l5 5-5 5"></path>
                </svg>
              </BookingButton>
              <p>
                {cityInfo.isHeadquarters ? hero.hqSubnote : hero.regionalSubnote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}