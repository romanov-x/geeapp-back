import fs from "node:fs";
import path from "node:path";
import { brandLogos, vehicleImages, vehicles, works } from "./data";
import { BRAND_ALIASES } from "./catalog";
import { CITIES } from "./cities";
import type { CmsData } from "./cms-types";

const STORAGE_DIR = path.join(process.cwd(), "storage");
const CMS_FILE = path.join(STORAGE_DIR, "cms-data.json");

function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

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
        { src: "/assets/hero-split/belgee.webp", alt: "Навигация на экране Belgee" },
        { src: "/assets/hero-split/bmw.webp", alt: "Приложения на экране BMW" },
        { src: "/assets/hero-split/exeed.webp", alt: "Навигация на приборной панели Exeed" },
      ],
    },
    serviceTiles: [
      {
        id: "apps",
        kicker: "Навигация и медиа",
        title: "Установка приложений",
        price: "от 8 000 ₽",
        description:
          "Яндекс Навигатор, музыка, видео, RuStore, разделение экрана и вывод подсказок на приборку или проекцию.",
        chips: ["Яндекс Навигатор", "Split Screen", "Мультируль", "RuStore"],
        featured: true,
      },
      {
        id: "russian",
        kicker: "Штатный интерфейс",
        title: "Русификация меню и приборки",
        price: "По запросу",
        description:
          "Перевод настроек автомобиля, климата, ассистентов вождения и цифровой приборной панели на русский язык.",
        chips: ["Мультимедиа", "Приборная панель", "Без разбора торпедо"],
      },
      {
        id: "firmware",
        kicker: "Оптимизация ГУ",
        title: "Прошивка и звук",
        price: "от 8 000 ₽",
        description:
          "Адаптация штатного ПО, разблокировка Android Auto / CarPlay, активация DTS, голосового помощника и комфортных функций.",
        chips: ["Android Auto", "Голосовое управление", "Сохранение гарантии"],
      },
    ],
    about: {
      kicker: "О компании GeeApp",
      title: "Работаем со штатной мультимедиа бережно и предсказуемо.",
      lead: "Не меняем заводской экран на неоригинальные планшеты и не режем штатную проводку. Программно раскрываем возможности вашей заводской системы.",
      points: [
        {
          title: "Проверка до записи",
          text: "Сначала уточняем год выпуска и ревизию прошивки по фото меню, чтобы назвать честный состав пакета и точную цену.",
        },
        {
          title: "Штатные системы в безопасности",
          text: "Камеры 360°, парктроники, климат-контроль, микрофоны и заводской усилитель продолжают работать в штатном режиме.",
        },
        {
          title: "Челябинск, партнёры в РФ и онлайн",
          text: "Принимаем в собственном боксе в Челябинске, передаём заявки проверенным мастерам-партнёрам в городах России или прошиваем дистанционно.",
        },
      ],
    },
    formats: [
      {
        id: "apps-pack",
        badge: "Популярный выбор",
        title: "Пакет приложений и прошивка",
        price: "8 000 – 18 000 ₽",
        description: "Для дилерских и импортных авто, где уже есть русский язык, но не хватает навигации и медиа.",
        features: [
          "Яндекс Навигатор, Яндекс Музыка, VK Видео, Кинопоиск, ТВ",
          "Привязка кнопок на руле и сплит-экран (где поддерживается ГУ)",
          "Вывод подсказок на приборную панель / проекцию HUD",
          "Установка за ~45–60 минут с проверкой всех систем",
        ],
        ctaLabel: "Выбрать пакет приложений",
        serviceId: "apps",
        featured: true,
      },
      {
        id: "full-complex",
        badge: "Параллельный импорт",
        title: "Русификация + приложения",
        price: "По запросу / до 30 000 ₽",
        description: "Полная адаптация автомобилей из Китая, Кореи, США и ОАЭ под комфортную эксплуатацию в России.",
        features: [
          "Полный перевод экрана мультимедиа и приборной панели",
          "Установка российских навигационных и видео-сервисов",
          "Активация локальных частот радио и голосового управления",
          "Индивидуальная проверка ревизии блока по фото версии ПО",
        ],
        ctaLabel: "Рассчитать русификацию",
        serviceId: "russian",
      },
      {
        id: "online-partner",
        badge: "Регионы РФ и онлайн",
        title: "Онлайн-прошивка или мастер-партнёр",
        price: "По прайсу модели",
        description: "Единая заявка через администратора GeeApp с распределением в вашем городе или удалённым подключением.",
        features: [
          "Диагностика совместимости по фотографии экрана ГУ",
          "Запись к проверенному мастеру-партнёру в вашем городе",
          "Либо пошаговая дистанционная прошивка с ноутбуком",
          "Сопровождение и поддержка после выполнения работ",
        ],
        ctaLabel: "Уточнить формат для моего города",
        serviceId: "inquiry",
      },
    ],
    faq: [
      {
        id: "faq-1",
        q: "Влияет ли установка приложений и прошивка на гарантию дилера?",
        a: "Мы работаем программно поверх штатной системы без пайки и вмешательства в проводку. Все заводские функции сохраняются, а при необходимости перед поездкой к дилеру систему можно вернуть к заводскому состоянию.",
      },
      {
        id: "faq-2",
        q: "Как записаться, если я нахожусь не в Челябинске?",
        a: "Оставьте заявку на сайте и укажите свой город. Администратор проверит версию мультимедиа вашего авто и направит вас к проверенному мастеру-партнёру в вашем регионе либо организует дистанционную онлайн-прошивку.",
      },
      {
        id: "faq-3",
        q: "Сколько времени занимает работа?",
        a: "Стандартная установка пакета приложений и настройка занимают около 45–60 минут, включая проверку звука, GPS и демонстрацию возможностей.",
      },
      {
        id: "faq-4",
        q: "Откуда берётся интернет в магнитоле для навигатора и музыки?",
        a: "Штатное ГУ подключается по Wi-Fi к точке доступа вашего смартфона (можно настроить автоматическое включение при посадке в авто) либо к USB/Wi-Fi модему в автомобиле.",
      },
      {
        id: "faq-5",
        q: "Почему у некоторых моделей цена указана «По запросу»?",
        a: "На автомобилях параллельного импорта и свежих партий 2025–2026 годов один и тот же кузов может комплектоваться разными ревизиями головных устройств. Быстрая проверка по фото версии прошивки позволяет назвать точную цену до визита.",
      },
    ],
    works: works.map((w, idx) => ({
      id: `work-${idx + 1}`,
      car: w.car,
      done: w.done,
      img: w.img || "",
      video: w.video,
    })),
    cities: CITIES,
    brandLogos: { ...brandLogos },
    brandAliases: { ...BRAND_ALIASES },
    vehicleImages: { ...vehicleImages },
    modelAliases: {},
    vehicles: [...vehicles],
    settings: {
      brandName: "GeeApp",
      phoneDisplay: "+7 (999) 581-15-33",
      phoneRaw: "+79995811533",
      email: "info@geeapp.ru",
      hours: "На связи ежедневно с 10:00 до 22:00",
      hqAddress: "г. Челябинск, ул. Энтузиастов, 28а",
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
      legalOperator: "ИП Романов Сергей Владимирович, ИНН 745901691501, г. Верхний Уфалей, ул. Ленина.",
      privacyIntro: "Условия обработки персональных данных при оформлении заявки на сайте GeeApp.",
      consentText: "Даю согласие на обработку введённых контактных данных и сведений об автомобиле для связи с администратором и подбора услуги.",
    },
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
    return JSON.parse(raw) as CmsData;
  } catch {
    return createSeedCmsData();
  }
}

export function saveCmsData(next: CmsData): CmsData {
  ensureStorageDir();
  const stamped: CmsData = {
    ...next,
    updatedAt: new Date().toISOString(),
  };
  const tmpFile = `${CMS_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(stamped, null, 2) + "\n", "utf8");
  fs.renameSync(tmpFile, CMS_FILE);
  return stamped;
}

export function updateCmsSection<K extends keyof CmsData>(
  key: K,
  value: CmsData[K]
): CmsData {
  const current = getCmsData();
  return saveCmsData({ ...current, [key]: value });
}