import type { Vehicle } from "./data";
import type { CityInfo } from "./cities";

export const PERMISSIONS = [
  {
    id: "catalog",
    label: "Каталог моделей, цены и медиа авто",
    description: "Автомобили, цены, главное фото/видео карточки и галерея работ модели",
  },
  {
    id: "brands",
    label: "Марки и логотипы",
    description: "Список марок, русские синонимы и логотипы брендов",
  },
  {
    id: "cities",
    label: "Города и поддомены",
    description: "Регионы, поддомены *.geeapp.ru и форматы работы",
  },
  {
    id: "sections",
    label: "Контент блоков",
    description: "Первый экран (фото/видео), карточки услуг, «О компании» и тарифы",
  },
  {
    id: "templates",
    label: "Шаблоны страниц и конструктор",
    description: "Порядок блоков на главной и создание новых страниц из готовых компонентов",
  },
  {
    id: "works",
    label: "Портфолио работ",
    description: "Кейсы выполненных работ с фото и видео",
  },
  {
    id: "reviews",
    label: "Отзывы (ReviewLab)",
    description: "Подключение виджета и API ReviewLab, фильтрация площадок",
  },
  {
    id: "faq",
    label: "Вопросы и ответы (FAQ)",
    description: "Добавление, изменение и сортировка частых вопросов",
  },
  {
    id: "legal",
    label: "Юридические документы РФ и Cookie",
    description: "Реквизиты, Политика 152-ФЗ, два согласия и политика Cookie",
  },
  {
    id: "settings",
    label: "Контакты и соцсети",
    description: "Телефон, почта, карта и мессенджеры",
  },
  {
    id: "staff",
    label: "Сотрудники и права доступа",
    description: "Учётные записи по email, роли и галочки возможностей",
  },
] as const;

export type PermissionId = (typeof PERMISSIONS)[number]["id"];

export type StaffUser = {
  id: string;
  email: string;
  name: string;
  roleTitle: string;
  isOwner: boolean;
  active: boolean;
  permissions: PermissionId[];
  passwordHash: string;
  createdAt: string;
};

export type StaffPublic = Omit<StaffUser, "passwordHash">;

export type HeroMediaSlot = {
  kind?: "image" | "video";
  src: string;
  videoSrc?: string;
  alt: string;
};

export type HeroContent = {
  hqBadge: string;
  regionalBadge: string;
  titleBefore: string;
  titleGradient: string;
  stats: { value: string; label: string }[];
  ctaLabel: string;
  hqSubnote: string;
  regionalSubnote: string;
  splitImages: HeroMediaSlot[];
};

export type ServiceTileContent = {
  id: string;
  kicker: string;
  title: string;
  price: string;
  description: string;
  chips: string[];
  featured?: boolean;
};

export type FormatCardContent = {
  id: string;
  badge: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  ctaLabel: string;
  serviceId: string;
  featured?: boolean;
};

export type WorkItemContent = {
  id: string;
  car: string;
  done: string;
  img: string;
  video?: string;
};

export type ModelGalleryItem = {
  id: string;
  kind: "image" | "video";
  src: string;
  poster?: string;
  caption: string;
};

export type FaqItemContent = {
  id: string;
  q: string;
  a: string;
};

export type SocialChannel = {
  id: string;
  label: string;
  href: string;
  icon: string;
  enabled: boolean;
};

export type ReviewLabSettings = {
  enabled: boolean;
  mode: "api" | "embed";
  widgetId: string;
  embedHtml: string;
  kicker: string;
  title: string;
  subtitle: string;
  limit: number;
};

export type LegalDocsContent = {
  updatedDate: string;
  companyFullName: string;
  inn: string;
  ogrnip: string;
  legalAddress: string;
  serviceAddress: string;
  dpoEmail: string;
  phone: string;
  bankDetails: string;
  privacyTitle: string;
  privacyBody: string;
  consentPrimaryLabel: string;
  consentPrimaryTitle: string;
  consentPrimaryBody: string;
  consentSecondaryEnabled: boolean;
  consentSecondaryRequired: boolean;
  consentSecondaryLabel: string;
  consentSecondaryTitle: string;
  consentSecondaryBody: string;
  cookieTitle: string;
  cookieBody: string;
  cookieBannerEnabled: boolean;
  cookieBannerText: string;
};

export type PageBlockType =
  | "hero"
  | "brands"
  | "services"
  | "models"
  | "russian"
  | "about"
  | "reviews"
  | "formats"
  | "faq"
  | "custom";

export type PageBlockInstance = {
  id: string;
  type: PageBlockType;
  enabled: boolean;
  customKicker?: string;
  customTitle?: string;
  customText?: string;
  customMediaKind?: "none" | "image" | "video";
  customMediaSrc?: string;
  customCtaLabel?: string;
  customCtaHref?: string;
  customOpenBooking?: boolean;
};

export type CustomPageTemplate = {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  published: boolean;
  showInFooter: boolean;
  blocks: PageBlockInstance[];
};

export type SiteSettingsContent = {
  brandName: string;
  phoneDisplay: string;
  phoneRaw: string;
  email: string;
  hours: string;
  hqAddress: string;
  hqNote: string;
  mapIframeSrc: string;
  mapNaviHref: string;
  mapBrowserHref: string;
  socials: SocialChannel[];
  legalOperator: string;
  privacyIntro: string;
  consentText: string;
};

export const MODEL_SERVICE_OPTIONS = [
  {
    key: "apps",
    label: "Установка приложений",
    defaultNote:
      "Яндекс Навигатор, Яндекс Музыка, VK Видео, Кинопоиск, RuStore, разделение экрана и мультируль.",
  },
  {
    key: "russian",
    label: "Русификация мультимедиа",
    defaultNote:
      "Полный программный перевод меню головного устройства, настроек автомобиля, климата и ассистентов.",
  },
  {
    key: "dashboard",
    label: "Русификация приборной панели",
    defaultNote:
      "Перевод цифровой приборной панели: бортовой компьютер, статусы систем и уведомления.",
  },
  {
    key: "firmware",
    label: "Прошивка ГУ / доп. функции (Android Auto, CarPlay, звук DTS)",
    defaultNote:
      "Оптимизация штатного ПО, разблокировка протоколов смартфона, голосового управления и аудиопроцессора.",
  },
] as const;

export type ModelServiceKey = (typeof MODEL_SERVICE_OPTIONS)[number]["key"];

export type ModelServiceConfig = {
  enabled: boolean;
  price: number | null; // null = автоматически «По запросу»
  note?: string;
};

export type VehicleModel = {
  id: string;
  slug: string;
  make: string;
  name: string;
  supported: boolean;
  needsCompatibility: boolean;
  needsModel: boolean;
  photo: string;
  video: string;
  aliases: string[];
  compatibilityNote: string;
  summary: string;
  services: Record<ModelServiceKey, ModelServiceConfig>;
  gallery: ModelGalleryItem[];
  legacyIds: string[];
};

export type CmsData = {
  updatedAt: string;
  hero: HeroContent;
  serviceTiles: ServiceTileContent[];
  about: {
    kicker: string;
    title: string;
    lead: string;
    points: { title: string; text: string }[];
  };
  formats: FormatCardContent[];
  faq: FaqItemContent[];
  works: WorkItemContent[];
  reviews: ReviewLabSettings;
  legal: LegalDocsContent;
  homeBlocks: PageBlockInstance[];
  customPages: CustomPageTemplate[];
  cities: CityInfo[];
  brandLogos: Record<string, string>;
  brandAliases: Record<string, string[]>;
  vehicleImages: Record<string, string>;
  vehicleVideos: Record<string, string>;
  vehicleGalleries: Record<string, ModelGalleryItem[]>;
  modelAliases: Record<string, string[]>;
  vehicles: Vehicle[];
  settings: SiteSettingsContent;
  models: VehicleModel[];
};