import { restrictionFor, type Vehicle } from "./data";
import type {
  ModelGalleryItem,
  ModelServiceConfig,
  ModelServiceKey,
  VehicleModel,
} from "./cms-types";

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function toModelSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[а-яё]/g, (ch) => TRANSLIT[ch] ?? "")
    .replace(/&/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

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

const SEED_ALIASES: Record<string, string[]> = {
  "car-1": ["Монджаро", "Монжаро", "KX11", "Xingyue L"],
  "car-2": ["Монджаро рестайлинг", "Монжаро 2025", "KX11 Rest"],
  "car-4": ["Тугелла", "FY11", "KnewStar 001"],
  "car-5": ["Атлас", "FX11", "Boyue L"],
  "car-7": ["Ситирей", "Boyue Cool"],
  "car-9": ["Кулрей", "SX11", "Binyue"],
  "car-10": ["Префейс"],
  "car-19": ["Джолион", "Жолион"],
  "car-23": ["Дарго"],
  "car-29": ["Танк 300"],
  "car-31": ["Танк 500"],
  "car-43": ["Юни-К", "Uni K"],
  "russian-24": ["Камри 80", "Камри XV80"],
  "russian-25": ["Камри 70", "Камри 75"],
  "russian-54": ["Зикр 001"],
  "russian-61": ["Лисян Л6", "Li L6"],
  "russian-62": ["Лисян Л9", "Li L9"],
};

function cleanName(v: Vehicle): string {
  if (v.id === "russian-bmw") return "Модельный ряд BMW";
  return v.name
    .replace(/\s*\(прошиваются почти все модели\)/i, "")
    .replace(/\s*\(приборная панель \+ мультимедиа\)/i, "")
    .replace(/\s*\(мультимедиа без разбора\)/i, "")
    .replace(/\s*\(мультимедиа\)/i, "")
    .replace(/\s*\(любое поколение[^)]*\)/i, "")
    .trim();
}

export function createEmptyServices(): Record<ModelServiceKey, ModelServiceConfig> {
  return {
    apps: { enabled: false, price: null, note: "" },
    russian: { enabled: false, price: null, note: "" },
    dashboard: { enabled: false, price: null, note: "" },
    firmware: { enabled: false, price: null, note: "" },
  };
}

export function migrateVehiclesToModels(params: {
  vehicles: Vehicle[];
  vehicleImages: Record<string, string>;
  vehicleVideos?: Record<string, string>;
  vehicleGalleries?: Record<string, ModelGalleryItem[]>;
  modelAliases?: Record<string, string[]>;
}): VehicleModel[] {
  const {
    vehicles,
    vehicleImages,
    vehicleVideos = {},
    vehicleGalleries = {},
    modelAliases = {},
  } = params;

  const mergedRusIds = new Set(Object.values(EXPLICIT_MERGE));
  const models: VehicleModel[] = [];

  for (const v of vehicles) {
    if (v.service === "russian" && mergedRusIds.has(v.id)) continue;

    const car = v.service === "russian" ? null : v;
    const rus = EXPLICIT_MERGE[v.id]
      ? vehicles.find((r) => r.id === EXPLICIT_MERGE[v.id]) || null
      : v.service === "russian"
      ? v
      : null;

    const primary = (car || rus)!;
    const name = cleanName(primary);
    const slug =
      primary.id === "russian-bmw"
        ? "bmw-rusifikaciya"
        : toModelSlug(`${primary.make} ${name}`);

    const supported = !car || car.supported !== false;
    const services = createEmptyServices();

    if (supported) {
      if (car && car.service === "apps") {
        services.apps = {
          enabled: true,
          price: car.price ?? null,
          note: car.source || "",
        };
        const rawSrc = (car.source || "").toLowerCase();
        if (
          rawSrc.includes("андроид авто") ||
          rawSrc.includes("carplay") ||
          rawSrc.includes("dts") ||
          rawSrc.includes("ассистент")
        ) {
          services.firmware = {
            enabled: true,
            price: car.id === "car-19" ? 1000 : null,
            note:
              car.id === "car-19"
                ? "Активация звукового процессора DTS (+1 000 ₽ к пакету)"
                : "Прошивка и активация скрытых функций комфорта / Android Auto",
          };
        }
      }

      if (rus || car?.id === "car-2") {
        services.russian = {
          enabled: true,
          price: rus?.price ?? null,
          note:
            car?.id === "car-2"
              ? "Входит в единый комплекс «Русификация + приложения» (для авто до марта 2025 г.)"
              : rus?.source || "",
        };
        const rusRaw = `${rus?.name || ""} ${rus?.source || ""}`.toLowerCase();
        if (rusRaw.includes("приборн") || car?.id === "car-2") {
          services.dashboard = {
            enabled: true,
            price: null,
            note: "Русификация цифровой приборной панели",
          };
        }
      }

      if (car && car.service === "inquiry") {
        services.apps = {
          enabled: true,
          price: null,
          note: "Состав пакета уточняется по фото версии прошивки ГУ.",
        };
        services.russian = {
          enabled: true,
          price: null,
          note: "Возможность перевода проверяется по фото версии системы.",
        };
      }
    }

    const legacyIds = [car?.id, rus?.id].filter((x): x is string => Boolean(x));
    const photo =
      (car && vehicleImages[car.id]) ||
      (rus && vehicleImages[rus.id]) ||
      "";
    const video =
      (car && vehicleVideos[car.id]) ||
      (rus && vehicleVideos[rus.id]) ||
      "";
    const gallery = [
      ...(car ? vehicleGalleries[car.id] || [] : []),
      ...(rus ? vehicleGalleries[rus.id] || [] : []),
    ];
    const combinedAliases = Array.from(
      new Set([
        ...(car ? SEED_ALIASES[car.id] || [] : []),
        ...(rus ? SEED_ALIASES[rus.id] || [] : []),
        ...(car ? modelAliases[car.id] || [] : []),
        ...(rus ? modelAliases[rus.id] || [] : []),
      ])
    );

    const compatibilityNote = !supported
      ? "Штатное ГУ построено на закрытой платформе Linux без Android — установка сторонних приложений не поддерживается."
      : car?.needsCompatibility
      ? "Модель параллельного импорта / свежего модельного года: проверяем ревизию ГУ по фото версии ПО до записи."
      : car
      ? restrictionFor(car)
      : rus?.needsModel
      ? "Доступность перевода зависит от поколения системы (проверим по VIN или фото экрана)."
      : "";

    models.push({
      id: primary.id,
      slug,
      make: primary.make,
      name,
      supported,
      needsCompatibility: Boolean(car?.needsCompatibility),
      needsModel: Boolean(primary.needsModel),
      photo,
      video,
      aliases: combinedAliases,
      compatibilityNote,
      summary: "",
      services,
      gallery,
      legacyIds,
    });
  }

  return models;
}