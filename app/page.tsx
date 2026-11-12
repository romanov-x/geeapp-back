import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageBlocksRenderer } from "@/components/PageBlocksRenderer";
import { getCmsData } from "@/lib/cms-store";
import { getServerCity } from "@/lib/server-city";

export default async function Home() {
  const { city, origin } = await getServerCity();
  const cms = getCmsData();

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": city.isHeadquarters ? "AutoRepair" : "Service",
    name: `${cms.settings.brandName} — настройка и русификация мультимедиа авто ${city.inName}`,
    url: origin,
    telephone: cms.settings.phoneDisplay,
    areaServed: { "@type": "City", name: city.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <Header />
      <main id="home" tabIndex={-1}>
        <PageBlocksRenderer blocks={cms.homeBlocks} />
      </main>
      <Footer />
    </>
  );
}