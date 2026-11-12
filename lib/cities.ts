export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "geeapp.ru";
export const CITY_COOKIE = "geeapp-city";
export const CITY_HEADER = "x-geeapp-city";

export type CityInfo = {
  slug: string;
  subdomain: string;
  name: string;
  inName: string;
  isHeadquarters?: boolean;
};

export const CITIES: CityInfo[] = [
  { slug: "chelyabinsk", subdomain: "", name: "Челябинск", inName: "в Челябинске", isHeadquarters: true },
  { slug: "ekb", subdomain: "ekb", name: "Екатеринбург", inName: "в Екатеринбурге" },
  { slug: "msk", subdomain: "msk", name: "Москва", inName: "в Москве" },
  { slug: "spb", subdomain: "spb", name: "Санкт-Петербург", inName: "в Санкт-Петербурге" },
  { slug: "kazan", subdomain: "kazan", name: "Казань", inName: "в Казани" },
  { slug: "nsk", subdomain: "nsk", name: "Новосибирск", inName: "в Новосибирске" },
  { slug: "krd", subdomain: "krd", name: "Краснодар", inName: "в Краснодаре" },
  { slug: "nn", subdomain: "nn", name: "Нижний Новгород", inName: "в Нижнем Новгороде" },
  { slug: "ufa", subdomain: "ufa", name: "Уфа", inName: "в Уфе" },
  { slug: "perm", subdomain: "perm", name: "Пермь", inName: "в Перми" },
  { slug: "tmn", subdomain: "tmn", name: "Тюмень", inName: "в Тюмени" },
  { slug: "samara", subdomain: "samara", name: "Самара", inName: "в Самаре" },
  { slug: "rostov", subdomain: "rostov", name: "Ростов-на-Дону", inName: "в Ростове-на-Дону" },
  { slug: "krsk", subdomain: "krsk", name: "Красноярск", inName: "в Красноярске" },
  { slug: "omsk", subdomain: "omsk", name: "Омск", inName: "в Омске" },
  { slug: "voronezh", subdomain: "voronezh", name: "Воронеж", inName: "в Воронеже" },
  { slug: "volgograd", subdomain: "volgograd", name: "Волгоград", inName: "в Волгограде" },
];

export const DEFAULT_CITY: CityInfo = CITIES[0];

const SLUG_SET = new Set(CITIES.map((c) => c.slug));

export function getCityBySlug(slug?: string | null): CityInfo {
  if (!slug) return DEFAULT_CITY;
  const clean = slug.toLowerCase().trim();
  return CITIES.find((c) => c.slug === clean || c.subdomain === clean) || DEFAULT_CITY;
}

export function getCityByName(name?: string | null): CityInfo {
  if (!name) return DEFAULT_CITY;
  const clean = name.toLowerCase().trim();
  return CITIES.find((c) => c.name.toLowerCase() === clean) || DEFAULT_CITY;
}

export function cityOrigin(city: CityInfo): string {
  return city.subdomain
    ? `https://${city.subdomain}.${ROOT_DOMAIN}`
    : `https://${ROOT_DOMAIN}`;
}

export function parseHostCity(hostHeader?: string | null): {
  city: CityInfo;
  isProductionDomain: boolean;
  needsCanonicalRedirect?: boolean;
} | null {
  const host = (hostHeader || "").split(":")[0].toLowerCase().trim();
  if (!host) return null;

  if (host === ROOT_DOMAIN) {
    return { city: DEFAULT_CITY, isProductionDomain: true };
  }
  if (
    host === `www.${ROOT_DOMAIN}` ||
    host === `chelyabinsk.${ROOT_DOMAIN}` ||
    host === `chel.${ROOT_DOMAIN}`
  ) {
    return {
      city: DEFAULT_CITY,
      isProductionDomain: true,
      needsCanonicalRedirect: true,
    };
  }
  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const sub = host.slice(0, -(ROOT_DOMAIN.length + 1));
    if (SLUG_SET.has(sub)) {
      return { city: getCityBySlug(sub), isProductionDomain: true };
    }
    return { city: DEFAULT_CITY, isProductionDomain: true };
  }
  if (host.endsWith(".localhost")) {
    const sub = host.slice(0, -".localhost".length);
    if (SLUG_SET.has(sub)) {
      return { city: getCityBySlug(sub), isProductionDomain: false };
    }
  }
  return null;
}

export function formatWorkSummary(city: CityInfo): string {
  if (city.isHeadquarters) {
    return "Принимаем в нашем сервисе в Челябинске (ул. Энтузиастов, 28а) и выполняем дистанционную онлайн-прошивку.";
  }
  return `Работаем ${city.inName} через проверенных мастеров-партнёров и в формате онлайн-прошивки — администратор проверит ГУ и распределит заявку.`;
}