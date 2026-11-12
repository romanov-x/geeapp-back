import { getCmsData } from "@/lib/cms-store";
import { fetchReviewLabData } from "@/lib/reviewlab";
import { ReviewsCarousel } from "./ReviewsCarousel";

export async function ReviewsSection() {
  const cms = getCmsData();
  const cfg = cms.reviews;
  if (!cfg.enabled) return null;

  if (cfg.mode === "embed" && cfg.embedHtml.trim()) {
    return (
      <section className="section reviews-section" id="reviews" aria-labelledby="reviews-title">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="kicker">{cfg.kicker}</p>
              <h2 id="reviews-title">{cfg.title}</h2>
              {cfg.subtitle && <p>{cfg.subtitle}</p>}
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: cfg.embedHtml }} />
        </div>
      </section>
    );
  }

  if (!cfg.widgetId.trim()) return null;

  const bundle = await fetchReviewLabData(cfg.widgetId, cfg.limit || 12);
  if (!bundle.ok || bundle.reviews.length === 0) return null;

  const aggregateJsonLd =
    bundle.totalRating && bundle.totalReviewAmount > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: cms.settings.brandName || "GeeApp",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: String(bundle.totalRating),
            bestRating: "5",
            reviewCount: String(bundle.totalReviewAmount),
          },
        }
      : null;

  return (
    <section
      className="section reviews-section"
      id="reviews"
      aria-labelledby="reviews-title"
    >
      {aggregateJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateJsonLd) }}
        />
      )}
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="kicker">{cfg.kicker}</p>
            <h2 id="reviews-title">{cfg.title}</h2>
            {cfg.subtitle && <p>{cfg.subtitle}</p>}
          </div>
        </div>
        <ReviewsCarousel bundle={bundle} />
      </div>
    </section>
  );
}