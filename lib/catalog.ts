import { asset, money, type Vehicle } from "./data";
import {
  MODEL_SERVICE_OPTIONS,
  type CmsData,
  type ModelGalleryItem,
  type ModelServiceKey,
  type VehicleModel,
} from "./cms-types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://geeapp.ru";

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[а-яё]/g, (ch) => TRANSLIT[ch] ?? "")
    .replace(/&/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function brandSlug(make: string): string {
  return slugify(make);
}

export const BRAND_ALIASES: Record<string, string[]> = {
  Geely: ["Джили", "Jili"],
  Belgee: ["Белджи"],
  Haval: ["Хавал", "Хавейл"],
  Tank: ["Танк"],
  Changan: ["Чанган"],
  Jaecoo: ["Джейку"],
  Jetour: ["Джетур"],
  GAC: ["ГАК"],
  KnewStar: ["НьюСтар"],
  Toyota: ["Тойота"],
  BYD: ["БИД"],
  Hyundai: ["Хендай", "Хёндэ"],
  Kia: ["Киа"],
  Genesis: ["Дженезис"],
  BMW: ["БМВ"],
  Ssangyong: ["Санг Йонг", "KGM"],
  Exeed: ["Эксид"],
  Zeekr: ["Зикр"],
  Hongqi: ["Хунцы"],
  Lexus: ["Лексус"],
  Chevrolet: ["Шевроле"],
  Mazda: ["Мазда"],
  "Lynk&Co": ["Линк энд Ко"],
  Lixiang: ["Лисян", "Li Auto"],
  Volga: ["Волга"],
  Volkswagen: ["Фольксваген", "VW"],
};

export type ServicePackage = {
  kind: ModelServiceKey;
  title: string;
  priceLabel: string;
  priceValue: number | null;
  badge: string;
  summary: string;
  features: string[];
};

export type FaqItem = { q: string; a: string };

export type CatalogEntry = {
  id: string;
  slug: string;
  make: string;
  brandSlug: string;
  cleanName: string;
  fullTitle: string;
  primary: Vehicle;
  services: VehicleModel["services"];
  legacyIds: string[];
  photo: string | undefined;
  video: string | undefined;
  gallery: ModelGalleryItem[];
  supported: boolean;
  needsCompatibility: boolean;
  needsModel: boolean;
  minPrice: number | null;
  hasMultiplePrices: boolean;
  priceDisplay: string;
  shortNote: string;
  compatibilityNote: string;
  aliases: string[];
  packages: ServicePackage[];
  expertSummary: string;
  faq: FaqItem[];
};

function featuresForService(key: ModelServiceKey, note: string): string[] {
  const lower = note.toLowerCase();
  if (key === "apps") {
    const list = [
      lower.includes("андроид авто")
        ? "Разблокировка Android Auto для навигации и музыки со смартфона"
        : "Яндекс Навигатор с голосовым поиском и подсказками на штатном экране",
      "Яндекс Музыка, VK Видео, Кинопоиск, RUTUBE, онлайн-ТВ и радио",
    ];
    if (lower.includes("сплит")) list.push("Разделение экрана (Split Screen) — карты и музыка одновременно");
    if (lower.includes("мультирул")) list.push("Управление треками и вызовами со штатных кнопок на руле");
    if (lower.includes("проекц")) list.push("Вывод манёвров навигации на проекционный экран (HUD)");
    if (lower.includes("приборн") || lower.includes("колодц")) list.push("Интеграция с цифровой приборной панелью");
    list.push("Магазин приложений RuStore и сохранение штатных систем авто");
    return list;
  }
  if (key === "russian") {
    return [
      "Качественный перевод меню мультимедиа, настроек авто, климата и ассистентов",
      "Корректные русские шрифты без обрезаний и наложений",
      "Программная установка с сохранением штатного функционала камер и парктроников",
    ];
  }
  if (key === "dashboard") {
    return [
      "Полная русификация цифровой приборной панели водителя",
      "Перевод уведомлений бортового компьютера и статусов ассистентов",
    ];
  }
  return [
    note || "Программная оптимизация ГУ и активация скрытых заводских опций",
    "Безопасная работа поверх заводской архитектуры без пайки проводки",
  ];
}

export function buildCatalogFromModels(
  models: VehicleModel[],
  brandAliases: Record<string, string[]> = BRAND_ALIASES,
  works: CmsData["works"] = []
): CatalogEntry[] {
  return models.map((m) => {
    const bSlug = brandSlug(m.make);
    const fullTitle =
      m.slug === "bmw-rusifikaciya"
        ? "BMW — русификация мультимедиа и приборной панели"
        : m.name.toLowerCase().startsWith(m.make.toLowerCase() + " ")
        ? m.name
        : `${m.make} ${m.name}`;

    const packages: ServicePackage[] = [];
    if (m.supported) {
      for (const opt of MODEL_SERVICE_OPTIONS) {
        const cfg = m.services[opt.key];
        if (!cfg?.enabled) continue;
        packages.push({
          kind: opt.key,
          title: opt.label,
          priceLabel: cfg.price && cfg.price > 0 ? money(cfg.price) : "По запросу",
          priceValue: cfg.price && cfg.price > 0 ? cfg.price : null,
          badge:
            opt.key === "apps"
              ? "Приложения"
              : opt.key === "russian"
              ? "Русификация ГУ"
              : opt.key === "dashboard"
              ? "Приборка"
              : "Прошивка / Опции",
          summary: cfg.note?.trim() || opt.defaultNote,
          features: featuresForService(opt.key, cfg.note || ""),
        });
      }
    }

    const numericPrices = packages
      .map((p) => p.priceValue)
      .filter((p): p is number => typeof p === "number" && p > 0);
    const minPrice = numericPrices.length ? Math.min(...numericPrices) : null;
    const hasMultiplePrices = packages.length > 1 && minPrice !== null;

    const priceDisplay = !m.supported
      ? "Не прошивается"
      : minPrice
      ? hasMultiplePrices
        ? `от ${money(minPrice)}`
        : money(minPrice)
      : "По запросу";

    const primaryService = m.services.apps?.enabled
      ? "apps"
      : m.services.russian?.enabled || m.services.dashboard?.enabled
      ? "russian"
      : "firmware";

    const primary: Vehicle = {
      id: m.id,
      service: primaryService,
      make: m.make,
      name: m.name,
      price: minPrice,
      supported: m.supported,
      needsCompatibility: m.needsCompatibility,
      needsModel: m.needsModel,
    };

    // Сборка галереи: собственные кадры модели + привязанные кейсы из Портфолио работ
    const matchIds = new Set([m.id, ...m.legacyIds]);
    const fromWorks: ModelGalleryItem[] = works
      .filter((w) => matchIds.has(w.car) && (w.img || w.video))
      .map((w) => ({
        id: `wrk-${w.id}`,
        kind: w.video ? "video" : "image",
        src: w.video || w.img,
        poster: w.img || undefined,
        caption: w.done,
      }));

    const gallery = [
      ...(m.gallery || []).filter((g) => Boolean(g.src)),
      ...fromWorks,
    ];

    const shortNote = !m.supported
      ? m.compatibilityNote ||
        "Штатное ГУ на закрытом Linux — установка приложений не поддерживается."
      : m.compatibilityNote ||
        (packages.length > 1
          ? `Доступно услуг: ${packages.map((p) => p.badge.toLowerCase()).join(", ")}.`
          : packages[0]?.summary ||
            "Программная настройка поверх штатного ПО с сохранением гарантии.");

    const expertSummary =
      m.summary?.trim() ||
      (!m.supported
        ? `Головное устройство ${fullTitle} работает на закрытой платформе Linux без Android-подсистемы, поэтому программная установка сторонних APK-приложений на штатный экран не поддерживается.`
        : `Настройка штатной мультимедиа ${fullTitle} выполняется программно без вмешательства в заводскую проводку. Администратор проверит версию прошивки вашего ГУ по фото экрана и распределит запись: в сервис в Челябинске, к мастеру-партнёру в вашем городе или в формат онлайн-прошивки.`);

    const faq: FaqItem[] = !m.supported
      ? [
          {
            q: `Почему не прошивается штатная магнитола ${fullTitle}?`,
            a: expertSummary,
          },
        ]
      : [
          {
            q: `Какие услуги и цены доступны для ${fullTitle}?`,
            a: packages.length
              ? packages.map((p) => `${p.title}: ${p.priceLabel}`).join("; ") + "."
              : `Стоимость рассчитывается по запросу после проверки версии ГУ.`,
          },
          {
            q: `Можно ли настроить ${fullTitle} в моём городе или онлайн?`,
            a: `Да. Оставьте заявку — администратор проверит ревизию ГУ и запишет вас в наш бокс в Челябинске, к проверенному мастеру-партнёру в вашем регионе или на дистанционную онлайн-прошивку.`,
          },
          {
            q: `Сохраняются ли заводские камеры 360°, климат и гарантия?`,
            a: `Да, работаем поверх штатного ПО без пайки проводки. Все заводские ассистенты работают штатно, возможен возврат к заводскому состоянию.`,
          },
        ];

    return {
      id: m.id,
      slug: m.slug,
      make: m.make,
      brandSlug: bSlug,
      cleanName: m.name,
      fullTitle,
      primary,
      services: m.services,
      legacyIds: m.legacyIds || [m.id],
      photo: m.photo || undefined,
      video: m.video || undefined,
      gallery,
      supported: m.supported,
      needsCompatibility: m.needsCompatibility,
      needsModel: m.needsModel,
      minPrice,
      hasMultiplePrices,
      priceDisplay,
      shortNote,
      compatibilityNote: m.compatibilityNote,
      aliases: Array.from(
        new Set([...(brandAliases[m.make] || []), ...(m.aliases || [])])
      ),
      packages,
      expertSummary,
      faq,
    };
  });
}

export function orderedMakesFromEntries(entries: CatalogEntry[]): string[] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    counts.set(e.make, (counts.get(e.make) || 0) + 1);
  }
  return Array.from(counts.keys()).sort(
    (a, b) => (counts.get(b)! - counts.get(a)!) || a.localeCompare(b)
  );
}

export function resolveModelFromEntries(
  entries: CatalogEntry[],
  rawParam: string
): { entry: CatalogEntry; isCanonical: boolean } | null {
  const decoded = decodeURIComponent(rawParam).trim();
  const lower = decoded.toLowerCase();

  const bySlug = entries.find((e) => e.slug.toLowerCase() === lower);
  if (bySlug) return { entry: bySlug, isCanonical: decoded === bySlug.slug };

  const byId = entries.find(
    (e) =>
      e.id.toLowerCase() === lower ||
      e.legacyIds.some((id) => id.toLowerCase() === lower)
  );
  if (byId) return { entry: byId, isCanonical: false };

  return null;
}

export function resolveBrandFromEntries(
  entries: CatalogEntry[],
  rawParam: string
): { make: string; slug: string; isCanonical: boolean } | null {
  const decoded = decodeURIComponent(rawParam).trim();
  const targetSlug = brandSlug(decoded);
  const makes = orderedMakesFromEntries(entries);
  const found = makes.find(
    (m) => m.toLowerCase() === decoded.toLowerCase() || brandSlug(m) === targetSlug
  );
  if (!found) return null;
  const canonical = brandSlug(found);
  return { make: found, slug: canonical, isCanonical: decoded === canonical };
}

export type ServiceFilter = "all" | "apps" | "russian";

export function searchEntries(
  entries: CatalogEntry[],
  query: string,
  filter: ServiceFilter = "all",
  make?: string
): CatalogEntry[] {
  const q = query.trim().toLowerCase();
  const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

  return entries.filter((entry) => {
    if (make && !q && entry.make !== make) return false;
    if (
      filter === "apps" &&
      !entry.services.apps?.enabled &&
      !entry.services.firmware?.enabled
    ) {
      return false;
    }
    if (
      filter === "russian" &&
      !entry.services.russian?.enabled &&
      !entry.services.dashboard?.enabled
    ) {
      return false;
    }
    if (!tokens.length) return true;
    const hay = [
      entry.make,
      entry.cleanName,
      entry.fullTitle,
      entry.slug.replace(/-/g, " "),
      ...entry.aliases,
    ]
      .join(" ")
      .toLowerCase();
    return tokens.every((t) => hay.includes(t));
  });
}

export function buildModelJsonLd(
  entry: CatalogEntry,
  baseUrl = SITE_URL,
  cityName = "Челябинск",
  phone = "+7 (999) 581-15-33"
) {
  const pageUrl = `${baseUrl}/model/${entry.slug}`;
  const brandUrl = `${baseUrl}/brand/${entry.brandSlug}`;
  const imageUrl = entry.photo ? `${baseUrl}${asset(entry.photo)}` : undefined;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "GeeApp", item: baseUrl },
      { "@type": "ListItem", position: 2, name: entry.make, item: brandUrl },
      { "@type": "ListItem", position: 3, name: entry.fullTitle, item: pageUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entry.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  if (!entry.supported) return [breadcrumb, faqSchema];

  return [
    breadcrumb,
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Прошивка, русификация и установка приложений ${entry.fullTitle}`,
      description: entry.expertSummary,
      url: pageUrl,
      ...(imageUrl ? { image: imageUrl } : {}),
      provider: {
        "@type": "Organization",
        name: "GeeApp",
        telephone: phone,
        url: baseUrl,
      },
      areaServed: { "@type": "City", name: cityName },
      ...(entry.minPrice
        ? {
            offers: {
              "@type": "Offer",
              url: pageUrl,
              priceCurrency: "RUB",
              price: String(entry.minPrice),
              availability: "https://schema.org/InStock",
            },
          }
        : {}),
    },
    faqSchema,
  ];
}

export function buildBrandJsonLd(
  make: string,
  list: CatalogEntry[],
  baseUrl = SITE_URL,
  inCity = "",
  logo?: string
) {
  const slug = brandSlug(make);
  const brandUrl = `${baseUrl}/brand/${slug}`;
  const citySuffix = inCity ? ` ${inCity}` : "";

  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "GeeApp", item: baseUrl },
        { "@type": "ListItem", position: 2, name: make, item: brandUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Модели ${make} — прошивка, русификация и установка приложений${citySuffix} | GeeApp`,
      url: brandUrl,
      ...(logo ? { image: `${baseUrl}${asset(logo)}` } : {}),
      numberOfItems: list.length,
      itemListElement: list.map((entry, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: entry.fullTitle,
        url: `${baseUrl}/model/${entry.slug}`,
      })),
    },
  ];
}

export function entriesFromMake(
  entries: CatalogEntry[],
  make: string
): CatalogEntry[] {
  return entries.filter((e) => e.make === make);
}

export function entryByVehicleId(
  entries: CatalogEntry[],
  id: string
): CatalogEntry | undefined {
  const lower = id.toLowerCase();
  return entries.find(
    (e) =>
      e.id.toLowerCase() === lower ||
      e.slug.toLowerCase() === lower ||
      e.legacyIds.some((lid) => lid.toLowerCase() === lower)
  );
}