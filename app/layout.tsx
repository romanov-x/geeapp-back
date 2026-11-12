import type { Metadata, Viewport } from "next";
import { BookingProvider } from "@/components/BookingProvider";
import { CityProvider } from "@/components/CityProvider";
import { UIProvider } from "@/components/UIProvider";
import { getServerCity } from "@/lib/server-city";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { city, origin } = await getServerCity();
  const title = `GeeApp — русификация, прошивка и приложения для авто ${city.inName}`;
  const description = city.isHeadquarters
    ? `Прошивка, русификация мультимедиа и установка Яндекс Навигатора на штатный экран авто ${city.inName} (ул. Энтузиастов, 28а) и онлайн. Подбор по марке и модели.`
    : `Прошивка, русификация мультимедиа и установка приложений на штатный экран авто ${city.inName}. Проверенные мастера-партнёры и онлайн-прошивка — подбор по марке и модели.`;

  return {
    metadataBase: new URL(origin),
    title,
    description,
    alternates: { canonical: origin },
    openGraph: {
      title,
      description,
      url: origin,
      siteName: "GeeApp",
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

  return (
    <html lang="ru">
      <body>
        <UIProvider>
          <CityProvider initialSlug={city.slug}>
            <BookingProvider>{children}</BookingProvider>
          </CityProvider>
        </UIProvider>
      </body>
    </html>
  );
}