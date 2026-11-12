import type { Vehicle } from "./data";
import type { CityInfo } from "./cities";

export const PERMISSIONS = [
  {
    id: "catalog",
    label: "Каталог моделей и цены",
    description: "Добавление и редактирование авто, цен, пакетов и фото моделей",
  },
  {
    id: "brands",
    label: "Марки и логотипы",
    description: "Редактирование списка марок, синонимов и загрузка логотипов",
  },
  {
    id: "cities",
    label: "Города и поддомены",
    description: "Управление регионами, поддоменами и форматами работы в городах",
  },
  {
    id: "sections",
    label: "Контент главной страницы",
    description: "Первый экран (Hero), карточки услуг, блок «О компании» и тарифы",
  },
  {
    id: "works",
    label: "Портфолио работ",
    description: "Загрузка фото/видео кейсов и описаний выполненных работ",
  },
  {
    id: "faq",
    label: "Вопросы и ответы (FAQ)",
    description: "Добавление, изменение и сортировка частых вопросов",
  },
  {
    id: "settings",
    label: "Контакты, соцсети и документы",
    description: "Телефон, почта, ссылки на мессенджеры и юридические страницы",
  },
  {
    id: "staff",
    label: "Сотрудники и права доступа",
    description: "Создание учётных записей по email, назначение ролей и галочек прав",
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

export type HeroContent = {
  hqBadge: string;
  regionalBadge: string;
  titleBefore: string;
  titleGradient: string;
  stats: { value: string; label: string }[];
  ctaLabel: string;
  hqSubnote: string;
  regionalSubnote: string;
  splitImages: { src: string; alt: string }[];
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
  cities: CityInfo[];
  brandLogos: Record<string, string>;
  brandAliases: Record<string, string[]>;
  vehicleImages: Record<string, string>;
  modelAliases: Record<string, string[]>;
  vehicles: Vehicle[];
  settings: SiteSettingsContent;
};