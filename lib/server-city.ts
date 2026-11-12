import { cookies, headers } from "next/headers";
import {
  CITY_COOKIE,
  CITY_HEADER,
  cityOrigin,
  getCityBySlug,
  parseHostCity,
  type CityInfo,
} from "./cities";

export async function getServerCity(): Promise<{
  city: CityInfo;
  origin: string;
}> {
  const hdrs = await headers();

  const fromMiddleware = hdrs.get(CITY_HEADER);
  if (fromMiddleware) {
    const city = getCityBySlug(fromMiddleware);
    return { city, origin: cityOrigin(city) };
  }

  const host = hdrs.get("x-forwarded-host") || hdrs.get("host");
  const parsed = parseHostCity(host);
  if (parsed) {
    return { city: parsed.city, origin: cityOrigin(parsed.city) };
  }

  const jar = await cookies();
  const saved = jar.get(CITY_COOKIE)?.value;
  const city = getCityBySlug(saved);
  return { city, origin: cityOrigin(city) };
}