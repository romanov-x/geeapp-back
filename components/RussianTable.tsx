import { HeroLink } from "@/components/HeroPrimitives";
import { asset, brandLogo, monogram, vehicles } from "@/lib/data";
import { brandSlug } from "@/lib/catalog";

export function RussianTable() {
  const byMake: Record<string, string[]> = {};
  vehicles
    .filter((c) => c.service === "russian")
    .forEach((c) => {
      const clean =
        c.id === "russian-bmw"
          ? "Модельный ряд iDrive / MGU"
          : c.name
              .replace(/\s*\(приборная панель \+ мультимедиа\)/i, "")
              .replace(/\s*\(мультимедиа без разбора\)/i, "")
              .replace(/\s*\(мультимедиа\)/i, "")
              .replace(/\s*\(любое поколение[^)]*\)/i, "")
              .trim();
      (byMake[c.make] ||= []).push(clean);
    });

  const rows = Object.entries(byMake).sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], "ru")
  );

  const items = rows.slice(0, 9).map(([make, models]) => {
    const unique = [...new Set(models)];
    const text = unique.join(" · ");
    return {
      make,
      isBrand: true,
      text:
        text.length > 150
          ? text.slice(0, 150).replace(/[ ·]+$/, "") + "…"
          : text,
    };
  });

  if (rows.length > 9) {
    items.push({
      make: "Ещё",
      isBrand: false,
      text: `${rows
        .slice(9)
        .map(([make]) => make)
        .join(", ")} — всего ${rows.length} марок.`,
    });
  }

  return (
    <div className="russian-table" id="russian-table">
      {items.map(({ make, isBrand, text }) => {
        const logo = brandLogo(make);
        const content = (
          <>
            {isBrand && (
              <span className="rt-logo" aria-hidden="true">
                {logo ? (
                  <img src={asset(logo)} alt="" loading="lazy" />
                ) : (
                  monogram(make)
                )}
              </span>
            )}
            <span>{make}</span>
          </>
        );

        return (
          <div key={make} className="rt-row">
            {isBrand ? (
              <HeroLink
                className="rt-make rt-make--link"
                href={`/brand/${brandSlug(make)}`}
              >
                {content}
              </HeroLink>
            ) : (
              <span className="rt-make">{content}</span>
            )}
            <span className="rt-models">{text}</span>
          </div>
        );
      })}
    </div>
  );
}