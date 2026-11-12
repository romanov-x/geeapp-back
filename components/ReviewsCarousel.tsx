"use client";
import { useState } from "react";
import { PLATFORM_LABELS, type ReviewLabBundle } from "@/lib/reviewlab";

export function ReviewsCarousel({ bundle }: { bundle: ReviewLabBundle }) {
  const [platform, setPlatform] = useState<string>("all");
  const [visible, setVisible] = useState(6);

  const availablePlatforms = Array.from(
    new Set(bundle.reviews.map((r) => r.type).filter(Boolean))
  );

  const filtered = bundle.reviews.filter(
    (r) => platform === "all" || r.type === platform
  );

  return (
    <div className="reviews-widget">
      <div className="reviews-summary-bar">
        {bundle.totalRating && (
          <div className="reviews-score-badge">
            <strong>{bundle.totalRating.toFixed(1)}</strong>
            <span className="reviews-stars" aria-hidden="true">
              ★★★★★
            </span>
            <small>
              {bundle.totalReviewAmount > 0
                ? `${bundle.totalReviewAmount} отзывов`
                : "Независимые площадки"}
            </small>
          </div>
        )}

        <div className="catalog-filter-pills" role="group" aria-label="Площадки отзывов">
          <button
            type="button"
            className={`catalog-filter-pill${platform === "all" ? " is-active" : ""}`}
            onClick={() => {
              setPlatform("all");
              setVisible(6);
            }}
          >
            Все площадки
          </button>
          {availablePlatforms.map((code) => {
            const pRating = bundle.platformRatings.find((p) => p.code === code);
            return (
              <button
                key={code}
                type="button"
                className={`catalog-filter-pill${platform === code ? " is-active" : ""}`}
                onClick={() => {
                  setPlatform(code);
                  setVisible(6);
                }}
              >
                {PLATFORM_LABELS[code] || code}
                {pRating ? ` · ${pRating.rating}★` : ""}
              </button>
            );
          })}
        </div>
      </div>

      <div className="reviews-grid">
        {filtered.slice(0, visible).map((item) => (
          <article key={item._id} className="review-card">
            <div className="review-card-head">
              <div className="review-author">
                {item.photo ? (
                  <img
                    src={item.photo}
                    alt={item.name}
                    width={42}
                    height={42}
                    loading="lazy"
                  />
                ) : (
                  <span className="review-avatar-fallback" aria-hidden="true">
                    {(item.name || "К").slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div>
                  <strong>{item.name || "Клиент"}</strong>
                  <span>
                    {PLATFORM_LABELS[item.type] || item.type}
                    {item.date ? ` · ${item.date}` : ""}
                  </span>
                </div>
              </div>
              {typeof item.rating === "number" && item.rating > 0 && (
                <span className="review-rating" aria-label={`Оценка ${item.rating} из 5`}>
                  {"★".repeat(Math.round(item.rating))}
                </span>
              )}
            </div>

            {item.message && <p className="review-text">{item.message}</p>}

            {item.images && item.images.length > 0 && (
              <div className="review-photos">
                {item.images.slice(0, 3).map((src, idx) => (
                  <img key={idx} src={src} alt="Фото к отзыву" loading="lazy" />
                ))}
              </div>
            )}

            {item.src && (
              <a
                href={item.src}
                target="_blank"
                rel="noopener noreferrer"
                className="review-source-link"
              >
                Читать оригинал на {PLATFORM_LABELS[item.type] || "площадке"} ↗
              </a>
            )}
          </article>
        ))}
      </div>

      {visible < filtered.length && (
        <div style={{ marginTop: "1.5rem" }}>
          <button
            type="button"
            className="button btn btn--secondary"
            onClick={() => setVisible((v) => v + 6)}
          >
            Показать ещё отзывы
          </button>
        </div>
      )}
    </div>
  );
}