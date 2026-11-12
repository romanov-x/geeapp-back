import { NextResponse, type NextRequest } from "next/server";
import {
  CITY_COOKIE,
  CITY_HEADER,
  ROOT_DOMAIN,
  getCityBySlug,
  parseHostCity,
} from "./lib/cities";

export function middleware(request: NextRequest) {
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const parsedHost = parseHostCity(host);

  // Склейка www.geeapp.ru и chelyabinsk.geeapp.ru -> geeapp.ru
  if (parsedHost?.needsCanonicalRedirect) {
    const target = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      `https://${ROOT_DOMAIN}`
    );
    return NextResponse.redirect(target, 308);
  }

  const queryCity = request.nextUrl.searchParams.get("city");
  const cookieCity = request.cookies.get(CITY_COOKIE)?.value;

  // На боевом *.geeapp.ru приоритет всегда у поддомена (для чистого SEO);
  // в Codespaces / localhost работает ?city=... или cookie.
  const resolvedCity = parsedHost?.isProductionDomain
    ? parsedHost.city
    : queryCity
    ? getCityBySlug(queryCity)
    : parsedHost
    ? parsedHost.city
    : getCityBySlug(cookieCity);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CITY_HEADER, resolvedCity.slug);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (queryCity && !parsedHost?.isProductionDomain) {
    response.cookies.set(CITY_COOKIE, resolvedCity.slug, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets|favicon.ico).*)"],
};