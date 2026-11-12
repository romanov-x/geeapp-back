import type { Metadata, Viewport } from "next";
import { BookingProvider } from "@/components/BookingProvider";
import "./globals.css";
import {CityProvider} from "@/components/CityProvider";
import {UIProvider} from "@/components/UIProvider";

export const metadata: Metadata = {
  title: "Geeapp — русификация, прошивка и приложения для авто в Челябинске",
  description:
    "Русификация, прошивка и установка приложений в Челябинске. Подбор по марке и модели.",
};
export const viewport: Viewport = {width:"device-width",initialScale:1,viewportFit:"cover",themeColor:"#f5f4f7"};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" data-type="service" data-radius="soft" data-buttons="solid" data-motion="" suppressHydrationWarning>
      <body className="variant-b">
          <UIProvider><CityProvider><BookingProvider>{children}</BookingProvider></CityProvider></UIProvider>
      </body>
    </html>
  );
}
