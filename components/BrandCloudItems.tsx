"use client";
import { HeroLink } from "@/components/HeroPrimitives";
import { asset, monogram } from "@/lib/data";
import {
  brandSlug,
  buildCatalogFromModels,
  entriesFromMake,
  orderedMakesFromEntries,
} from "@/lib/catalog";
import { useCms } from "./CmsProvider";

export function BrandCloudItems() {
  const cms = useCms();
  const entries = buildCatalogFromModels(
    cms.models,
    cms.brandAliases,
    cms.works
  );
  const makes = orderedMakesFromEntries(entries);

  const renderMake = (make: string) => {
        const count = entriesFromMake(entries, make).length;
        const logo = cms.brandLogos[make];
        const slug = brandSlug(make);

        return (
          <HeroLink
            key={make}
            className={`strip-pill strip-pill--${
              count >= 6 ? "l" : count >= 3 ? "m" : "s"
            }`}
            href={`/?make=${encodeURIComponent(slug)}#models`}
            aria-label={`${make}: ${count} РјРѕРґРµР»РµР№ вЂ” РїРµСЂРµР№С‚Рё Рє РєР°С‚Р°Р»РѕРіСѓ`}
            onClick={(e) => {
              if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
              if (document.getElementById("models")) {
                e.preventDefault();
                history.replaceState(
                  null,
                  "",
                  `/?make=${encodeURIComponent(slug)}#models`
                );
                window.dispatchEvent(
                  new CustomEvent("geeapp:select-make", { detail: make })
                );
                document.getElementById("models")?.scrollIntoView({
                  block: "start",
                  behavior: matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "instant"
                    : "smooth",
                });
              }
            }}
          >
            <span
              className={`brand-logo${logo ? " brand-logo--img" : ""}`}
              aria-hidden="true"
            >
              {logo ? (
                <img src={asset(logo)} alt="" loading="lazy" decoding="async" />
              ) : (
                monogram(make)
              )}
            </span>
            <span className="strip-pill-name">{make}</span>
          </HeroLink>
        );
      };

  return (
    <div className="brands-strip" id="brands-strip" aria-label="РњР°СЂРєРё Р°РІС‚РѕРјРѕР±РёР»РµР№">
      {makes.map(renderMake)}
    </div>
  );
}
