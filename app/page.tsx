import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { BrandsCloud } from "@/components/BrandsCloud";
import { Services } from "@/components/Services";
import { Models } from "@/components/Models";
import { Russian } from "@/components/Russian";
import { About } from "@/components/About";
import { Formats } from "@/components/Formats";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { config } from "@/lib/data";
import { getServerCity } from "@/lib/server-city";

export default async function Home() {
  const { city, origin } = await getServerCity();

  const homeJsonLd = city.isHeadquarters
    ? {
        "@context": "https://schema.org",
        "@type": "AutoRepair",
        name: "GeeApp — настройка и русификация мультимедиа авто",
        url: origin,
        telephone: config.phone,
        openingHours: "Mo-Su 10:00-22:00",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Челябинск",
          streetAddress: "ул. Энтузиастов, 28а",
          addressCountry: "RU",
        },
        areaServed: { "@type": "City", name: city.name },
      }
    : {
        "@context": "https://schema.org",
        "@type": "Service",
        name: `GeeApp — русификация, прошивка и приложения для авто ${city.inName}`,
        url: origin,
        provider: {
          "@type": "Organization",
          name: "GeeApp",
          telephone: config.phone,
          url: "https://geeapp.ru",
        },
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
        <Hero />
        <BrandsCloud />
        <Services />
        <Models />
        <Russian />
        <About />
        <Formats />
        <Faq />
      </main>
      <Footer />
    </>
  );
}