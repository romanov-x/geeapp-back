import type { Metadata, Viewport } from "next";
import { BookingProvider } from "@/components/BookingProvider";
import { CityProvider } from "@/components/CityProvider";
import { CmsProvider } from "@/components/CmsProvider";
import { CookieBanner } from "@/components/CookieBanner";
import { UIProvider } from "@/components/UIProvider";
import { getCmsData } from "@/lib/cms-store";
import { getServerCity } from "@/lib/server-city";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { city, origin } = await getServerCity();
  const cms = getCmsData();
  const brand = cms.settings.brandName || "GeeApp";
  const title = `${brand} — русификация, прошивка и приложения для авто ${city.inName}`;
  const description = city.isHeadquarters
    ? `Прошивка, русификация мультимедиа и установка Яндекс Навигатора на штатный экран авто ${city.inName} (${cms.settings.hqAddress}) и онлайн.`
    : `Прошивка, русификация мультимедиа и установка приложений на штатный экран авто ${city.inName}. Проверенные мастера-партнёры и онлайн-прошивка.`;

  return {
    metadataBase: new URL(origin),
    title,
    description,
    alternates: { canonical: origin },
    openGraph: {
      title,
      description,
      url: origin,
      siteName: brand,
      locale: "ru_RU",
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f5f4f7",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { city } = await getServerCity();
  const cms = getCmsData();

  return (
    <html lang="ru">
      <body>
        <UIProvider>
          <CmsProvider data={cms}>
            <CityProvider initialSlug={city.slug} citiesList={cms.cities}>
              <BookingProvider>
                {children}
                <CookieBanner />
              </BookingProvider>
            </CityProvider>
          </CmsProvider>
        </UIProvider>
      </body>
    </html>
  );
}