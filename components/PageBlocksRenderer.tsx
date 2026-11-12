import type { PageBlockInstance } from "@/lib/cms-types";
import { asset } from "@/lib/data";
import { Hero } from "./Hero";
import { BrandsCloud } from "./BrandsCloud";
import { Services } from "./Services";
import { Models } from "./Models";
import { Russian } from "./Russian";
import { About } from "./About";
import { ReviewsSection } from "./ReviewsSection";
import { Formats } from "./Formats";
import { Faq } from "./Faq";
import { BookingButton } from "./BookingButton";
import { HeroLink } from "./HeroPrimitives";
import { Arrow } from "./Arrow";

export function PageBlocksRenderer({ blocks }: { blocks: PageBlockInstance[] }) {
  return (
    <>
      {blocks
        .filter((b) => b.enabled)
        .map((blk) => {
          switch (blk.type) {
            case "hero":
              return <Hero key={blk.id} />;
            case "brands":
              return <BrandsCloud key={blk.id} />;
            case "services":
              return <Services key={blk.id} />;
            case "models":
              return <Models key={blk.id} />;
            case "russian":
              return <Russian key={blk.id} />;
            case "about":
              return <About key={blk.id} />;
            case "reviews":
              return <ReviewsSection key={blk.id} />;
            case "formats":
              return <Formats key={blk.id} />;
            case "faq":
              return <Faq key={blk.id} />;
            case "custom": {
              const mediaUrl = blk.customMediaSrc?.trim() || "";
              const hasMedia =
                blk.customMediaKind &&
                blk.customMediaKind !== "none" &&
                Boolean(mediaUrl);

              return (
                <section key={blk.id} className="section custom-cms-section">
                  <div className="wrap">
                    <div
                      className={hasMedia ? "model-hero" : "custom-cms-single"}
                    >
                      <div>
                        {blk.customKicker && (
                          <p className="kicker">{blk.customKicker}</p>
                        )}
                        {blk.customTitle && <h2>{blk.customTitle}</h2>}
                        {blk.customText && (
                          <p
                            className="section-lead"
                            style={{ whiteSpace: "pre-line", marginTop: "1rem" }}
                          >
                            {blk.customText}
                          </p>
                        )}
                        {blk.customCtaLabel && (
                          <div style={{ marginTop: "1.5rem" }}>
                            {blk.customOpenBooking ? (
                              <BookingButton className="button btn btn--primary">
                                {blk.customCtaLabel} <Arrow />
                              </BookingButton>
                            ) : (
                              <HeroLink
                                className="button btn btn--primary"
                                href={blk.customCtaHref || "/#models"}
                              >
                                {blk.customCtaLabel} <Arrow />
                              </HeroLink>
                            )}
                          </div>
                        )}
                      </div>
                      {hasMedia && (
                        <div className="vehicle-photo model-photo">
                          {blk.customMediaKind === "video" ? (
                            <video
                              src={asset(mediaUrl)}
                              controls
                              playsInline
                              preload="metadata"
                            />
                          ) : (
                            <img
                              src={asset(mediaUrl)}
                              alt={blk.customTitle || ""}
                              loading="lazy"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              );
            }
            default:
              return null;
          }
        })}
    </>
  );
}