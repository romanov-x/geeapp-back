import {
  asset,
  brandLogo,
  config,
  money,
  orderedMakes,
  restrictionFor,
  vehicleImages,
  vehicles,
  type Vehicle,
} from "./data";

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

/** Русские и альтернативные названия марок для поиска и SEO */
export const BRAND_ALIASES: Record<string, string[]> = {
  Geely: ["Джили", "Джилли", "Jili"],
  Belgee: ["Белджи", "Белги", "Белджи Х50", "Белджи Х70"],
  Haval: ["Хавал", "Хавейл", "Great Wall"],
  Tank: ["Танк", "GWM Tank"],
  Changan: ["Чанган", "Чанъань"],
  Jaecoo: ["Джейку", "Джаеко"],
  Jetour: ["Джетур", "Жетур"],
  GAC: ["ГАК", "Trumpchi", "Трампчи"],
  KnewStar: ["НьюСтар", "Кньюстар", "Geely KnewStar"],
  Toyota: ["Тойота", "Тоета"],
  BYD: ["БИД", "Бид", "FangChengBao", "YangWang"],
  Hyundai: ["Хендай", "Хундай", "Хёндэ"],
  Kia: ["Киа", "Кия"],
  Genesis: ["Дженезис", "Генезис"],
  BMW: ["БМВ"],
  Ssangyong: ["Санг Йонг", "СсангЙонг", "KGM", "KG Mobility"],
  Exeed: ["Эксид"],
  Zeekr: ["Зикр"],
  Hongqi: ["Хунцы", "Хончи"],
  Lexus: ["Лексус"],
  Chevrolet: ["Шевроле"],
  Mazda: ["Мазда"],
  "Lynk&Co": ["Линк энд Ко", "Lynk Co", "Lynk & Co"],
  Lixiang: ["Лисян", "Ли Авто", "Li Auto"],
  Volga: ["Волга"],
  Volkswagen: ["Фольксваген", "VW"],
};

/** Кузовные индексы, китайские и русские народные названия моделей */
const MODEL_ALIASES: Record<string, string[]> = {
  "car-1": ["Монджаро", "Монжаро", "KX11", "Xingyue L"],
  "car-2": ["Монджаро рестайлинг", "Монжаро 2025", "KX11 Rest", "Xingyue L 2025"],
  "car-3": ["Монджаро 2026", "Flagship SE", "KX11 2026"],
  "car-4": ["Тугелла", "FY11", "Xingyue S", "KnewStar 001"],
  "car-5": ["Атлас", "Атлас Нью", "FX11", "Boyue L"],
  "car-6": ["Атлас 2026", "FX11 2026"],
  "car-7": ["Ситирей", "Ситирэй", "Boyue Cool", "G426"],
  "car-8": ["Атлас Про", "Belgee X70"],
  "car-9": ["Кулрей", "Кулрэй", "SX11", "Binyue"],
  "car-10": ["Префейс", "Префэйс", " Xingrui"],
  "car-11": ["Префейс 2026"],
  "car-12": ["Х50", "Белджи Х50", "SX11"],
  "car-13": ["Х50 2025", "Белджи Х50 рест"],
  "car-14": ["Х70 2025", "Белджи Х70"],
  "car-15": ["ЕХ5", "Galaxy E5"],
  "car-16": ["ЕХ5 ЕМИ", "Galaxy Starship 7", "EX5 EM-i"],
  "car-17": ["ЕХ5 ЕМР", "EX5 EM-R"],
  "car-18": ["Окаванго", "Haoyue L"],
  "car-19": ["Джолион", "Жолион", "Chulian"],
  "car-20": ["Ф7х", "F7x рест"],
  "car-21": ["Ф7 рестайлинг", "F7 1 поколение"],
  "car-22": ["Ф7", "F7 1G"],
  "car-23": ["Дарго", "Дарго Х", "Dargo X", "Big Dog"],
  "car-24": ["Н3", "Хавал Н3", "Cool Dog"],
  "car-25": ["Н6", "Хавал Н6"],
  "car-26": ["Н7", "Хавал Н7"],
  "car-27": ["Н9", "Хавал Н9"],
  "car-28": ["М6", "Хавал М6"],
  "car-29": ["Танк 300"],
  "car-30": ["Танк 400"],
  "car-31": ["Танк 500"],
  "car-32": ["Танк 700"],
  "car-33": ["Джейку J7", "Джейку 7"],
  "car-34": ["Джейку J7 2026"],
  "car-35": ["Джейку J8", "Джейку 8"],
  "car-36": ["Х70 Плюс"],
  "car-37": ["Х90 Плюс"],
  "car-38": ["Дашинг"],
  "car-39": ["Джетур Т2", "Т2"],
  "car-40": ["Трэвеллер", "Травеллер", "Shanhai T2"],
  "car-41": ["ГС8", "ГАК ГС8"],
  "car-42": ["ГС3", "ГАК ГС3"],
  "car-43": ["Юни-К", "Юни К", "Uni K"],
  "car-44": ["Юни-Т", "Юни Т", "Uni T"],
  "car-45": ["Юни-В", "Юни В", "Uni V"],
  "car-46": ["ЦС75 Плюс", "CS75 Plus"],
  "car-47": ["Юни-С", "ЦС55", "CS55 Plus", "Uni S"],
  "knewstar-001": ["Ньюстар 001", "Тугелла"],
  "russian-1": ["Атлас Кул", "Boyue Cool", "Bouye Cool"],
  "russian-2": ["Boyue L", "Bouye L", "Боюэ Л"],
  "russian-24": ["Камри 80", "Камри XV80"],
  "russian-25": ["Камри 70", "Камри 75", "XV70", "XV75"],
  "russian-26": ["РАВ4", "Рав 4 2024"],
  "russian-27": ["РАВ4 2026", "Рав 4"],
  "russian-28": ["Хайлендер"],
  "russian-29": ["Сиенна"],
  "russian-30": ["Венза"],
  "russian-31": ["Краун Клюгер", "Kluger"],
  "russian-37": ["Леопард 3", "FangChengBao Bao 3"],
  "russian-38": ["Леопард 5", "FangChengBao Bao 5"],
  "russian-54": ["Зикр 001"],
  "russian-61": ["Лисян Л6", "Li L6"],
  "russian-62": ["Лисян Л9", "Li L9"],
};

/** Явная склейка карточек apps + russian одной и той же модели без ложных срабатываний */
const EXPLICIT_MERGE: Record<string, string> = {
  "car-1": "russian-6",
  "car-2": "russian-7",
  "car-3": "russian-8",
  "car-4": "russian-9",
  "car-9": "russian-5",
  "car-10": "russian-11",
  "car-12": "russian-3",
  "car-25": "russian-22",
  "car-31": "russian-23",
  "car-36": "russian-36",
  "car-38": "russian-34",
  "car-39": "russian-35",
  "car-43": "russian-12",
  "car-45": "russian-14",
  "car-47": "russian-20",
};

export type ServicePackage = {
  kind: "apps" | "russian" | "inquiry";
  title: string;
  priceLabel: string;
  priceValue: number | null;
  badge: string;
  summary: string;
  features: string[];
};

export type FaqItem = {
  q: string;
  a: string;
};

export type CatalogEntry = {
  slug: string;
  make: string;
  brandSlug: string;
  cleanName: string;
  fullTitle: string;
  car: Vehicle | null;
  rus: Vehicle | null;
  primary: Vehicle;
  legacyIds: string[];
  photo: string | undefined;
  supported: boolean;
  needsCompatibility: boolean;
  needsModel: boolean;
  minPrice: number | null;
  priceDisplay: string;
  shortNote: string;
  compatibilityNote: string;
  aliases: string[];
  packages: ServicePackage[];
  expertSummary: string;
  faq: FaqItem[];
};

function cleanDisplayName(v: Vehicle): string {
  if (v.id === "russian-bmw") return "Модельный ряд BMW";
  return v.name
    .replace(/\s*\(прошиваются почти все модели\)/i, "")
    .replace(/\s*\(приборная панель \+ мультимедиа\)/i, "")
    .replace(/\s*\(мультимедиа без разбора\)/i, "")
    .replace(/\s*\(мультимедиа\)/i, "")
    .replace(/\s*\(любое поколение[^)]*\)/i, "")
    .trim();
}

function extractAppsFeatures(car: Vehicle): string[] {
  const src = (car.source || "").toLowerCase();
  const list: string[] = [];

  if (src.includes("андроид авто") || src.includes("android auto")) {
    list.push("Разблокировка Android Auto для быстрой навигации и музыки со смартфона");
  } else {
    list.push("Яндекс Навигатор с голосовым вводом и подсказками на штатном экране");
  }

  if (src.includes("carplay") || src.includes("carlinkit")) {
    list.push("Поддержка Apple CarPlay (при подключении через адаптер Carlinkit)");
  }

  list.push("Яндекс Музыка, VK Видео, Кинопоиск, RUTUBE, онлайн-ТВ и интернет-радио");

  if (src.includes("сплит")) {
    list.push("Разделение экрана (Split Screen) — навигатор и медиа одновременно");
  }
  if (src.includes("мультирул")) {
    list.push("Привязка переключения треков и вызовов к штатным кнопкам на руле");
  }
  if (src.includes("проекц")) {
    list.push("Вывод подсказок навигации на проекционный дисплей (HUD)");
  }
  if (src.includes("приборн") || src.includes("колодц")) {
    list.push("Интеграция с цифровой приборной панелью (включая расширенные темы/колодцы)");
  }
  if (src.includes("ассистент") || src.includes("ассисент") || src.includes("режима вождения")) {
    list.push("Сохранение выбранного режима вождения и отключение навязчивых ассистентов");
  }
  if (src.includes("голосов")) {
    list.push("Настройка удобного голосового помощника на русском языке");
  }
  if (src.includes("лаунчер")) {
    list.push("Адаптированный автомобильный лаунчер для быстрого доступа к приложениям в движении");
  }

  list.push("Магазин приложений RuStore и сохранение штатных функций автомобиля");
  return list;
}

function extractRussianScope(rus: Vehicle): string[] {
  const raw = `${rus.name} ${rus.source || ""}`.toLowerCase();
  const list: string[] = [
    "Качественный перевод меню мультимедиа, настроек автомобиля, климата и ассистентов на русский язык",
  ];
  if (raw.includes("приборн")) {
    list.push("Полная русификация цифровой приборной панели (уведомления, БК, статусы систем)");
  }
  if (raw.includes("без разбора")) {
    list.push("Программная установка без демонтажа и разбора центральной консоли");
  }
  if (raw.includes("частичная")) {
    list.push("Объём перевода зависит от ревизии прошивки ГУ (уточняем по фото версии системы)");
  }
  list.push("Корректные шрифты без обрезания слов и наложений в интерфейсе");
  return list;
}

function buildCompatibilityNote(car: Vehicle | null, rus: Vehicle | null): string {
  if (car && car.supported === false) {
    return "Штатное ГУ Haval M6 построено на закрытой платформе Linux без Android — программная установка сторонних приложений не поддерживается.";
  }
  if (car?.needsCompatibility) {
    return "Модель параллельного импорта / нового модельного года: проверяем ревизию штатного ГУ по фото версии ПО перед записью.";
  }
  if (car?.id === "car-2") {
    return "Комплекс «русификация + приложения» доступен для автомобилей Geely Monjaro Rest, выпущенных до марта 2025 года включительно.";
  }
  if (car?.id === "car-19") {
    return "По желанию доступна программная активация звукового процессора DTS (+1 000 ₽ к стоимости пакета).";
  }
  if (car?.id === "car-4" || car?.id === "knewstar-001") {
    return "Лицензия ПО приобретается индивидуально под VIN / серийный номер головного устройства каждого автомобиля.";
  }
  if (car && /Atlas Pro|Coolray|X50 \(1|Android Auto/.test(car.name)) {
    return "На данной платформе навигация оптимально работает через разблокированный Android Auto (прямой запуск тяжёлых карт внутри штатного планшета ограничен ресурсами процессора ГУ).";
  }
  if (car) {
    return restrictionFor(car);
  }
  if (rus?.needsModel) {
    return "Доступность перевода и состав работ зависят от поколения системы BMW (iDrive / MGU / NBT Evo) — проверим по VIN или фото меню.";
  }
  if (rus?.name.includes("без разбора")) {
    return "Выполняется программно без снятия и разбора головного устройства.";
  }
  return "";
}

function buildFaq(
  fullTitle: string,
  make: string,
  supported: boolean,
  packages: ServicePackage[],
  compatibilityNote: string
): FaqItem[] {
  if (!supported) {
    return [
      {
        q: `Почему нельзя прошить штатную магнитолу ${fullTitle}?`,
        a: `Штатное головное устройство ${fullTitle} работает на урезанной системе Linux без полноценного Android-окружения и достаточного объёма оперативной памяти. Установить туда Яндекс Навигатор или APK-приложения программным путём технически невозможно.`,
      },
      {
        q: `Какие есть альтернативы для навигации в ${fullTitle}?`,
        a: `Безопасные варианты для владельцев ${fullTitle}: использование штатного протокола проекции экрана смартфона (CarPlay / CarbitLink в зависимости от ревизии ГУ) либо полная аппаратная замена магнитолы в профильной студии автозвука.`,
      },
    ];
  }

  const appsPkg = packages.find((p) => p.kind === "apps");
  const rusPkg = packages.find((p) => p.kind === "russian");

  const priceAnswer = appsPkg
    ? `Стоимость установки пакета приложений и настройки мультимедиа на ${fullTitle} составляет ${appsPkg.priceLabel}.${rusPkg ? " Русификация интерфейса рассчитывается по запросу после проверки текущей версии прошивки ГУ." : ""}`
    : `Стоимость работ для ${fullTitle} рассчитывается индивидуально по запросу после быстрой проверки версии штатного головного устройства.`;

  return [
    {
      q: `Сколько стоит прошивка и настройка мультимедиа ${fullTitle}?`,
      a: `${priceAnswer}${compatibilityNote ? " " + compatibilityNote : ""}`,
    },
    {
      q: `Как проходит запись и можно ли выполнить работу в моём городе или онлайн?`,
      a: `Оставьте заявку на сайте: администратор проверит версию мультимедиа вашего ${fullTitle} и предложит оптимальный формат — визит в наш бокс в Челябинске, запись к проверенному мастеру-партнёру в вашем регионе или дистанционную онлайн-прошивку.`,
    },
    {
      q: `Сохраняется ли штатный функционал ${make} и можно ли вернуть заводское состояние?`,
      a: `Да. Мы работаем поверх штатной системы без пайки и вмешательства в силовую проводку: камеры кругового обзора, климат-контроль, ассистенты и микрофоны работают штатно. При необходимости перед визитом к дилеру систему можно вернуть к заводскому виду.`,
    },
    {
      q: `Сколько времени занимает установка на ${fullTitle}?`,
      a: `В среднем настройка занимает около 45–60 минут с учётом проверки всех функций, звука, GPS-позиционирования и краткого инструктажа владельца.`,
    },
  ];
}

function buildCatalog(): CatalogEntry[] {
  const mergedRusIds = new Set(Object.values(EXPLICIT_MERGE));
  const result: CatalogEntry[] = [];

  for (const v of vehicles) {
    if (v.service === "russian" && mergedRusIds.has(v.id)) continue;

    const car = v.service === "russian" ? null : v;
    const rus = EXPLICIT_MERGE[v.id]
      ? vehicles.find((r) => r.id === EXPLICIT_MERGE[v.id]) || null
      : v.service === "russian"
      ? v
      : null;

    const primary = (car || rus)!;
    const make = primary.make;
    const bSlug = brandSlug(make);
    const cleanName = cleanDisplayName(primary);
    const fullTitle =
      primary.id === "russian-bmw"
        ? "BMW — русификация мультимедиа и приборной панели"
        : cleanName.toLowerCase().startsWith(make.toLowerCase() + " ")
        ? cleanName
        : `${make} ${cleanName}`;

    const slug =
      primary.id === "russian-bmw"
        ? "bmw-rusifikaciya"
        : slugify(`${make} ${cleanName}`);

    const legacyIds = [car?.id, rus?.id].filter((x): x is string => Boolean(x));
    const supported = !car || car.supported !== false;
    const needsCompatibility = Boolean(car?.needsCompatibility);
    const needsModel = Boolean(primary.needsModel);
    const photo =
      (car && vehicleImages[car.id]) ||
      (rus && vehicleImages[rus.id]) ||
      undefined;

    const packages: ServicePackage[] = [];
    if (car && car.service === "apps" && supported) {
      const includesRusInApps = car.id === "car-2";
      packages.push({
        kind: "apps",
        title: includesRusInApps
          ? "Комплекс: русификация + пакет приложений"
          : "Установка приложений и адаптация мультимедиа",
        priceLabel: car.price ? money(car.price) : "По запросу",
        priceValue: car.price ?? null,
        badge: "Основной пакет",
        summary: includesRusInApps
          ? "Полный перевод интерфейса на русский язык и установка навигации, мультимедиа-сервисов и функций комфорта."
          : "Установка российских сервисов навигации, музыки и видео на штатный экран с сохранением заводской прошивки.",
        features: extractAppsFeatures(car),
      });
    }

    if (rus && car?.id !== "car-2") {
      packages.push({
        kind: "russian",
        title: "Русификация штатной системы",
        priceLabel: rus.price ? money(rus.price) : "По запросу",
        priceValue: rus.price ?? null,
        badge: car ? "Дополнительно" : "Русификация",
        summary: `Программный перевод интерфейса ${make} ${cleanName} на русский язык с проверкой совместимости по версии ПО.`,
        features: extractRussianScope(rus),
      });
    }

    if (car && car.service === "inquiry") {
      packages.push({
        kind: "inquiry",
        title: "Индивидуальный подбор решения (прошивка / русификация)",
        priceLabel: "По запросу",
        priceValue: null,
        badge: "Проверка по фото ГУ",
        summary:
          "Для этой модели состав доступных приложений, возможность русификации и точная стоимость подтверждаются администратором по фотографии версии системы.",
        features: [
          "Проверка аппаратной ревизии и версии прошивки штатного ГУ по фото",
          "Подбор безопасного пакета приложений (Яндекс Навигатор, музыка, видео)",
          "Уточнение возможности полной или частичной русификации меню",
          "Выбор удобного формата: сервис в Челябинске, мастер-партнёр в вашем городе или онлайн",
        ],
      });
    }

    const minPrice = car?.price ?? rus?.price ?? null;
    const priceDisplay = !supported
      ? "Не прошивается"
      : minPrice
      ? money(minPrice)
      : "По запросу";

    const compatibilityNote = buildCompatibilityNote(car, rus);
    const shortNote = !supported
      ? "Штатное ГУ на закрытом Linux — установка приложений не поддерживается."
      : needsCompatibility
      ? "Состав пакета и стоимость подтвердим после быстрой проверки версии ГУ."
      : car && rus && car.price && car.id !== "car-2"
      ? compatibilityNote || "Также доступна полная русификация интерфейса (по запросу)."
      : compatibilityNote ||
        (rus && !car
          ? "Точную стоимость русификации подтвердим по фото версии мультимедиа."
          : "Установка поверх штатного ПО с сохранением всех заводских функций.");

    const aliases = Array.from(
      new Set([
        ...(BRAND_ALIASES[make] || []),
        ...(car ? MODEL_ALIASES[car.id] || [] : []),
        ...(rus ? MODEL_ALIASES[rus.id] || [] : []),
      ])
    );

    const expertSummary = !supported
      ? `Головное устройство ${fullTitle} использует аппаратно ограниченную платформу Linux без подсистемы Android, поэтому безопасная программная установка Яндекс Навигатора и сторонних APK на заводской экран невозможна. Мы честно предупреждаем об этом до записи, чтобы сэкономить ваше время.`
      : `Настройка штатной мультимедиа ${fullTitle} выполняется программно без вмешательства в заводскую проводку. После подачи заявки администратор проверяет модификацию ГУ вашего автомобиля и распределяет запись: в стационарный сервис в Челябинске, к проверенному мастеру-партнёру в вашем городе или в формат дистанционной онлайн-прошивки.`;

    const faq = buildFaq(fullTitle, make, supported, packages, compatibilityNote);

    result.push({
      slug,
      make,
      brandSlug: bSlug,
      cleanName,
      fullTitle,
      car,
      rus,
      primary,
      legacyIds,
      photo,
      supported,
      needsCompatibility,
      needsModel,
      minPrice,
      priceDisplay,
      shortNote,
      compatibilityNote,
      aliases,
      packages,
      expertSummary,
      faq,
    });
  }

  return result;
}

export const catalogEntries: CatalogEntry[] = buildCatalog();

const bySlug = new Map<string, CatalogEntry>();
const byLegacyId = new Map<string, CatalogEntry>();

for (const entry of catalogEntries) {
  bySlug.set(entry.slug, entry);
  for (const id of entry.legacyIds) {
    byLegacyId.set(id.toLowerCase(), entry);
  }
}

export function resolveModelParam(
  rawParam: string
): { entry: CatalogEntry; isCanonical: boolean } | null {
  const decoded = decodeURIComponent(rawParam).trim();
  const lower = decoded.toLowerCase();

  const exactSlug = bySlug.get(lower);
  if (exactSlug) {
    return { entry: exactSlug, isCanonical: decoded === exactSlug.slug };
  }

  const fromLegacy = byLegacyId.get(lower);
  if (fromLegacy) {
    return { entry: fromLegacy, isCanonical: false };
  }

  return null;
}

export function resolveBrandParam(
  rawParam: string
): { make: string; slug: string; isCanonical: boolean } | null {
  const decoded = decodeURIComponent(rawParam).trim();
  const targetSlug = brandSlug(decoded);
  const makes = orderedMakes();

  const found = makes.find(
    (m) => m.toLowerCase() === decoded.toLowerCase() || brandSlug(m) === targetSlug
  );
  if (!found) return null;

  const canonical = brandSlug(found);
  return {
    make: found,
    slug: canonical,
    isCanonical: decoded === canonical,
  };
}

export function entriesByMake(make: string): CatalogEntry[] {
  return catalogEntries.filter((e) => e.make === make);
}

export function entryForVehicleId(id: string): CatalogEntry | undefined {
  return byLegacyId.get(id.toLowerCase()) || bySlug.get(id.toLowerCase());
}

export type ServiceFilter = "all" | "apps" | "russian";

export function searchCatalog(
  query: string,
  filter: ServiceFilter = "all",
  make?: string
): CatalogEntry[] {
  const q = query.trim().toLowerCase();
  const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

  return catalogEntries.filter((entry) => {
    if (make && !q && entry.make !== make) return false;

    if (filter === "apps" && entry.car?.service !== "apps") return false;
    if (filter === "russian" && !entry.rus && entry.car?.id !== "car-2") return false;

    if (!tokens.length) return true;

    const haystack = [
      entry.make,
      entry.cleanName,
      entry.fullTitle,
      entry.slug.replace(/-/g, " "),
      ...entry.aliases,
    ]
      .join(" ")
      .toLowerCase();

    return tokens.every((t) => haystack.includes(t));
  });
}

export function buildModelJsonLd(
  entry: CatalogEntry,
  baseUrl = SITE_URL,
  cityName = "Челябинск"
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

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Прошивка, русификация и установка приложений ${entry.fullTitle}`,
    description: entry.expertSummary,
    url: pageUrl,
    ...(imageUrl ? { image: imageUrl } : {}),
    provider: {
      "@type": "Organization",
      name: config.brand || "GeeApp",
      telephone: config.phone,
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
  };

  return [breadcrumb, serviceSchema, faqSchema];
}

export function buildBrandJsonLd(make: string, baseUrl = SITE_URL) {
  const slug = brandSlug(make);
  const brandUrl = `${baseUrl}/brand/${slug}`;
  const list = entriesByMake(make);
  const logo = brandLogo(make);

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
      name: `Модели ${make} — прошивка, русификация и установка приложений GeeApp`,
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