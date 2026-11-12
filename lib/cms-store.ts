import fs from "node:fs";
import path from "node:path";
import { brandLogos, vehicleImages, vehicles, works } from "./data";
import { BRAND_ALIASES } from "./catalog";
import { CITIES } from "./cities";
import type { CmsData, LegalDocsContent, PageBlockInstance, ReviewLabSettings } from "./cms-types";
import { migrateVehiclesToModels } from "./models-migration";

const STORAGE_DIR = path.join(process.cwd(), "storage");
const CMS_FILE = path.join(STORAGE_DIR, "cms-data.json");

function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

export const DEFAULT_HOME_BLOCKS: PageBlockInstance[] = [
  { id: "blk-hero", type: "hero", enabled: true },
  { id: "blk-brands", type: "brands", enabled: true },
  { id: "blk-services", type: "services", enabled: true },
  { id: "blk-models", type: "models", enabled: true },
  { id: "blk-russian", type: "russian", enabled: true },
  { id: "blk-about", type: "about", enabled: true },
  { id: "blk-reviews", type: "reviews", enabled: true },
  { id: "blk-formats", type: "formats", enabled: true },
  { id: "blk-faq", type: "faq", enabled: true },
];

export const DEFAULT_REVIEWS: ReviewLabSettings = {
  enabled: true,
  mode: "api",
  widgetId: "",
  embedHtml: "",
  kicker: "Отзывы клиентов",
  title: "Реальные оценки владельцев автомобилей.",
  subtitle:
    "Отзывы собираются напрямую с Яндекс Карт, 2ГИС, Авито и ВКонтакте через агрегатор ReviewLab.",
  limit: 12,
};

export const DEFAULT_LEGAL: LegalDocsContent = {
  updatedDate: "12 ноября 2026 г.",
  companyFullName: "Индивидуальный предприниматель Романов Сергей Владимирович",
  inn: "745901691501",
  ogrnip: "Укажите ОГРНИП в админ-панели",
  legalAddress: "Челябинская обл., г. Верхний Уфалей, ул. Ленина",
  serviceAddress: "г. Челябинск, ул. Энтузиастов, 28а",
  dpoEmail: "info@geeapp.ru",
  phone: "+7 (999) 581-15-33",
  bankDetails: "",
  privacyTitle: "Политика в отношении обработки персональных данных",
  privacyBody: `1. Общие положения
Настоящая Политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению их безопасности Оператором.

2. Какие персональные данные мы обрабатываем
• Имя (при указании пользователем);
• Контактный номер мобильного телефона;
• Сведения об автомобиле (марка, модель, год выпуска, пожелания к настройке ГУ) и выбранный город;
• Технические данные сессии и файлы cookie (IP-адрес, тип браузера, выбранный регион).

3. Цели обработки персональных данных
• Обработка входящих заявок, проверка технической совместимости штатного ГУ и расчёт стоимости услуг;
• Обратная связь с пользователем по телефону или в мессенджерах для согласования записи;
• Направление заявки профильному мастеру-партнёру в городе пользователя (при наличии отдельного согласия).

4. Хранение, защита и отзыв согласия
Обработка и хранение осуществляются с использованием баз данных на территории Российской Федерации (ч. 5 ст. 18 152-ФЗ). Субъект персональных данных вправе в любой момент отозвать согласие или запросить удаление данных, направив письмо на электронную почту Оператора.`,

  consentPrimaryLabel:
    "Даю согласие на обработку персональных данных в соответствии с Политикой",
  consentPrimaryTitle: "Согласие №1 на обработку персональных данных при оформлении заявки",
  consentPrimaryBody: `Настоящим я, действуя свободно, своей волей и в своём интересе, в соответствии со ст. 9 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных», даю конкретное, предметное и информированное согласие Оператору на обработку моих персональных данных: имени, номера телефона, города обращения и сведений об автомобиле.

Цель обработки: консультирование по услугам русификации, прошивки и установки приложений на мультимедиа автомобиля, проверка совместимости и согласование времени записи.
Перечень действий: сбор, запись, систематизация, накопление, хранение, уточнение, использование и уничтожение.
Срок действия согласия: до достижения целей обработки либо до момента отзыва согласия путём направления обращения на электронную почту Оператора.`,

  consentSecondaryEnabled: true,
  consentSecondaryRequired: true,
  consentSecondaryLabel:
    "Согласен(а) на передачу данных заявки мастеру-партнёру в моём городе для выполнения работ",
  consentSecondaryTitle:
    "Согласие №2 на передачу данных региональному исполнителю (мастеру-партнёру) и сервисные уведомления",
  consentSecondaryBody: `Настоящим я даю согласие Оператору на поручение обработки / передачу указанных в заявке контактных данных (имя, номер телефона, марка, модель, год выпуска авто и описание задачи) уполномоченному мастеру-партнёру сети GeeApp в выбранном мною регионе РФ исключительно в целях согласования визита, диагностики версии ГУ и оказания заказанной услуги, а также на получение сервисных сообщений по статусу моей заявки (без рекламных рассылок).

Согласие может быть отозвано в любой момент по письменному обращению на электронную почту Оператора.`,

  cookieTitle: "Политика использования файлов Cookie и метрических программ",
  cookieBody: `1. Что такое файлы Cookie
Файлы cookie — это небольшие текстовые фрагменты, сохраняемые в браузере вашего устройства для корректной работы сайта (запоминание выбранного города и поддомена, сохранение сессии и настроек интерфейса).

2. Какие категории Cookie используются на сайте
• Технические (обязательные) — хранят выбранный город (geeapp-city), отметку о принятии уведомления cookie и защищённую сессию сотрудников;
• Функциональные и сторонние виджеты — при загрузке интерактивной карты Яндекс.Карт и блока отзывов ReviewLab соответствующие сервисы могут обрабатывать технические параметры соединения согласно своим политикам конфиденциальности.

3. Как отключить Cookie
Вы можете в любой момент ограничить или удалить файлы cookie в настройках вашего браузера. Продолжая использование сайта, вы соглашаетесь с настоящими правилами.`,
  cookieBannerEnabled: true,
  cookieBannerText:
    "Мы используем файлы cookie для запоминания вашего города и корректной работы сайта в соответствии с законодательством РФ.",
};

export function createSeedCmsData(): CmsData {
  return {
    updatedAt: new Date().toISOString(),
    hero: {
      hqBadge: "Сервис на Энтузиастов, 28а и онлайн-прошивка",
      regionalBadge: "Мастера-партнёры и онлайн-прошивка",
      titleBefore: "Русификация, прошивка и установка приложений",
      titleGradient: "для вашего авто",
      stats: [
        { value: "100+", label: "моделей авто" },
        { value: "25+", label: "марок в каталоге" },
        { value: "~1 час", label: "на установку" },
      ],
      ctaLabel: "Оставить заявку",
      hqSubnote: "Проверим версию ГУ до визита в бокс или подключимся онлайн.",
      regionalSubnote:
        "Администратор проверит версию ГУ и запишет к мастеру-партнёру или на онлайн-прошивку.",
      splitImages: [
        { kind: "image", src: "/assets/hero-split/belgee.webp", videoSrc: "", alt: "Навигация на экране Belgee" },
        { kind: "image", src: "/assets/hero-split/bmw.webp", videoSrc: "", alt: "Приложения на экране BMW" },
        { kind: "image", src: "/assets/hero-split/exeed.webp", videoSrc: "", alt: "Навигация на приборной панели Exeed" },
      ],
    },
    serviceTiles: [
      {
        id: "apps",
        kicker: "Навигация и медиа",
        title: "Установка приложений",
        price: "от 8 000 ₽",
        description:
          "Яндекс Навигатор, Музыка, Кинопоиск, VK Видео, RUTUBE, ТВ, радио и RuStore на штатный экран.",
        chips: ["Яндекс Навигатор", "Split Screen", "Мультируль", "RuStore"],
        featured: true,
      },
      {
        id: "russian",
        kicker: "Штатный интерфейс",
        title: "Русификация мультимедиа",
        price: "По запросу",
        description:
          "Переводим интерфейс головного устройства на русский: меню, настройки, климат и ассистенты.",
        chips: ["Мультимедиа", "Приборная панель", "Без разбора"],
      },
      {
        id: "dash",
        kicker: "Приборка",
        title: "Русификация приборной панели",
        price: "По запросу",
        description:
          "Русский язык на цифровой приборке — уведомления, бортовой компьютер и статусы систем.",
        chips: ["Штатные шрифты", "Без ошибок"],
      },
      {
        id: "format",
        kicker: "География",
        title: "Бокс в Челябинске, партнёры и онлайн",
        price: "По всей РФ",
        description:
          "Принимаем в Челябинске, записываем к мастерам-партнёрам в регионах или прошиваем дистанционно.",
        chips: ["Челябинск", "Партнёры РФ", "Онлайн"],
      },
      {
        id: "rollback",
        kicker: "Безопасность",
        title: "Возврат к заводскому",
        price: "Сохранение штатного ПО",
        description:
          "Работаем поверх штатной системы без пайки: перед визитом к дилеру всё сбрасывается в пару действий.",
        chips: ["Без пайки", "Дилерская гарантия"],
      },
      {
        id: "check",
        kicker: "Диагностика",
        title: "Подбор под вашу модель",
        price: "Бесплатно до записи",
        description:
          "Проверяем совместимость и ревизию ГУ по фото до записи. Модели нет в списке — напишите, проверим.",
        chips: ["Проверка по фото ГУ"],
      },
    ],
    about: {
      kicker: "О компании GeeApp",
      title: "Два года настраиваем автомобильное мультимедиа.",
      lead: "Ставим приложения на штатные экраны, русифицируем мультимедиа и приборные панели, подбираем прошивку под модель. Работаем поверх штатной системы — всё можно вернуть к заводскому состоянию.",
      points: [
        { title: "2 года", text: "настраиваем автомобильное мультимедиа" },
        { title: "Поверх штатной системы", text: "заводскую проводку не трогаем" },
        { title: "В пару действий", text: "возврат к заводскому состоянию" },
      ],
    },
    formats: [
      {
        id: "firmware",
        badge: "Оптимизация",
        title: "Прошивка",
        price: "По запросу",
        description: "Изменения и настройки под вашу версию мультимедиа.",
        features: [
          "Проверим текущую версию ПО",
          "Подберём доступное решение",
          "Согласуем изменения до работ",
        ],
        ctaLabel: "Обсудить прошивку",
        serviceId: "firmware",
      },
      {
        id: "apps-pack",
        badge: "Рекомендуем",
        title: "Установка приложений",
        price: "от 8 000 ₽",
        description: "Навигация, музыка и видео-сервисы на штатном экране.",
        features: [
          "Пакет под вашу модель",
          "Установка и настройка мастером или онлайн",
          "Проверяем результат вместе",
          "Покажем, как пользоваться",
        ],
        ctaLabel: "Оставить заявку",
        serviceId: "apps",
        featured: true,
      },
      {
        id: "russian-pack",
        badge: "Импортные авто",
        title: "Русификация",
        price: "По запросу",
        description: "Мультимедиа и приборная панель — где поддерживается.",
        features: [
          "Перевод интерфейса мультимедиа",
          "Приборная панель — где поддерживается",
          "Проверим возможность для вашей модели",
        ],
        ctaLabel: "Обсудить русификацию",
        serviceId: "russian",
      },
    ],
    faq: [
      {
        id: "faq-1",
        q: "Влияет ли установка приложений и прошивка на гарантию дилера?",
        a: "Мы работаем программно поверх штатной системы без пайки и вмешательства в проводку. Все заводские функции сохраняются, а перед визитом к дилеру систему можно вернуть к заводскому состоянию.",
      },
      {
        id: "faq-2",
        q: "Как записаться, если я нахожусь не в Челябинске?",
        a: "Оставьте заявку на сайте и укажите свой город. Администратор проверит версию мультимедиа вашего авто и направит к проверенному мастеру-партнёру в вашем регионе либо организует дистанционную онлайн-прошивку.",
      },
      {
        id: "faq-3",
        q: "Сколько времени занимает работа?",
        a: "В среднем около 45–60 минут, включая проверку всех функций, GPS, звука и инструктаж.",
      },
      {
        id: "faq-4",
        q: "Почему у некоторых моделей цена указана «По запросу»?",
        a: "На автомобилях параллельного импорта и свежих партий 2025–2026 годов один кузов может оснащаться разными ревизиями ГУ. Проверка по фото версии ПО позволяет назвать точную цену до начала работ.",
      },
    ],
    works: works.map((w, idx) => ({
      id: `work-${idx + 1}`,
      car: w.car,
      done: w.done,
      img: w.img || "",
      video: w.video,
    })),
    reviews: DEFAULT_REVIEWS,
    legal: DEFAULT_LEGAL,
    homeBlocks: DEFAULT_HOME_BLOCKS,
    customPages: [],
    cities: CITIES,
    brandLogos: { ...brandLogos },
    brandAliases: { ...BRAND_ALIASES },
    vehicleImages: { ...vehicleImages },
    vehicleVideos: {},
    vehicleGalleries: {},
    modelAliases: {},
    vehicles: [...vehicles],
    models: migrateVehiclesToModels({
    vehicles,
    vehicleImages,
  }),
    settings: {
      brandName: "GeeApp",
      phoneDisplay: "+7 (999) 581-15-33",
      phoneRaw: "+79995811533",
      email: "info@geeapp.ru",
      hours: "На связи с 10:00 до 22:00",
      hqAddress: "ул. Энтузиастов, 28а",
      hqNote: "Большая парковка. Также доступна дистанционная онлайн-прошивка.",
      mapIframeSrc:
        "https://yandex.ru/map-widget/v1/?ll=61.375919%2C55.150900&z=17&l=map&pt=61.375919%2C55.150900%2Cpm2rdm",
      mapNaviHref:
        "yandexnavi://build_route_on_map?lat_to=55.150900&lon_to=61.375919",
      mapBrowserHref:
        "https://yandex.ru/maps/?rtext=~55.150900%2C61.375919&rtt=auto&z=16",
      socials: [
        { id: "tg", label: "Telegram", href: "https://t.me/geeapp", icon: "/assets/social/telegram.svg", enabled: true },
        { id: "vk", label: "VK", href: "https://vk.com/geeapp", icon: "/assets/social/vk.svg", enabled: true },
        { id: "max", label: "Max", href: "https://max.ru", icon: "/assets/social/max.svg", enabled: true },
        { id: "yt", label: "YouTube", href: "https://youtube.com", icon: "/assets/social/youtube.svg", enabled: true },
      ],
      legalOperator:
        "ИП Романов Сергей Владимирович, ИНН 745901691501, г. Верхний Уфалей, ул. Ленина.",
      privacyIntro:
        "Условия обработки персональных данных при оформлении заявки на сайте GeeApp.",
      consentText:
        "Даю согласие на обработку введённых контактных данных и сведений об автомобиле.",
    },
  };
}

function mergeDefaults(parsed: Partial<CmsData>): CmsData {
  const seed = createSeedCmsData();
  return {
    ...seed,
    ...parsed,
    hero: {
      ...seed.hero,
      ...(parsed.hero || {}),
      splitImages: (parsed.hero?.splitImages || seed.hero.splitImages).map((s) => ({
        kind: s.kind || (s.videoSrc ? "video" : "image"),
        src: s.src || "",
        videoSrc: s.videoSrc || "",
        alt: s.alt || "",
      })),
    },
    models:
      parsed.models && parsed.models.length > 0
        ? parsed.models
        : migrateVehiclesToModels({
            vehicles: parsed.vehicles || seed.vehicles,
            vehicleImages: parsed.vehicleImages || seed.vehicleImages,
            vehicleVideos: parsed.vehicleVideos,
            vehicleGalleries: parsed.vehicleGalleries,
            modelAliases: parsed.modelAliases,
          }),
    reviews: { ...DEFAULT_REVIEWS, ...(parsed.reviews || {}) },
    legal: { ...DEFAULT_LEGAL, ...(parsed.legal || {}) },
    homeBlocks:
      parsed.homeBlocks && parsed.homeBlocks.length > 0
        ? parsed.homeBlocks
        : DEFAULT_HOME_BLOCKS,
    customPages: parsed.customPages || [],
    vehicleVideos: parsed.vehicleVideos || {},
    vehicleGalleries: parsed.vehicleGalleries || {},
    modelAliases: parsed.modelAliases || {},
    settings: { ...seed.settings, ...(parsed.settings || {}) },
  };
}

export function getCmsData(): CmsData {
  ensureStorageDir();
  if (!fs.existsSync(CMS_FILE)) {
    const seed = createSeedCmsData();
    fs.writeFileSync(CMS_FILE, JSON.stringify(seed, null, 2) + "\n", "utf8");
    return seed;
  }
  try {
    const raw = fs.readFileSync(CMS_FILE, "utf8");
    return mergeDefaults(JSON.parse(raw) as Partial<CmsData>);
  } catch {
    return createSeedCmsData();
  }
}

export function saveCmsData(next: CmsData): CmsData {
  ensureStorageDir();
  const stamped: CmsData = {
    ...mergeDefaults(next),
    updatedAt: new Date().toISOString(),
  };
  const tmpFile = `${CMS_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(stamped, null, 2) + "\n", "utf8");
  fs.renameSync(tmpFile, CMS_FILE);
  return stamped;
}