export type ReviewLabPlatformCode =
  | "yaSprav"
  | "yaBusiness"
  | "yaService"
  | "doubleGis"
  | "avito"
  | "vkontakte"
  | "googleMap"
  | "flamp"
  | "zoon"
  | "otzovik"
  | "irecommend"
  | "yell"
  | string;

export const PLATFORM_LABELS: Record<string, string> = {
  yaSprav: "Яндекс Карты",
  yaBusiness: "Яндекс Бизнес",
  yaService: "Яндекс Услуги",
  doubleGis: "2ГИС",
  avito: "Авито",
  vkontakte: "ВКонтакте",
  googleMap: "Google Maps",
  flamp: "Flamp",
  zoon: "Zoon",
  otzovik: "Отзовик",
  irecommend: "Irecommend",
  yell: "Yell",
};

export type ReviewLabItem = {
  _id: string;
  name: string;
  photo?: string;
  message?: string;
  images?: string[];
  rating?: number;
  date?: string;
  src: string;
  type: ReviewLabPlatformCode;
};

export type ReviewLabBundle = {
  ok: boolean;
  totalRating: number | null;
  totalReviewAmount: number;
  platformRatings: { code: string; label: string; rating: number }[];
  reviews: ReviewLabItem[];
};

const API_BASE = "https://app.reviewlab.ru/api/v1/widgets/widget";

export async function fetchReviewLabData(
  widgetId: string,
  limit = 12,
  bypassCache = false
): Promise<ReviewLabBundle> {
  const cleanId = widgetId.trim();
  if (!cleanId) {
    return {
      ok: false,
      totalRating: null,
      totalReviewAmount: 0,
      platformRatings: [],
      reviews: [],
    };
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 100);
  const fetchOpts: RequestInit & { next?: { revalidate?: number; tags?: string[] } } =
    bypassCache
      ? { cache: "no-store" }
      : { next: { revalidate: 86400, tags: ["reviewlab"] } };

  try {
    const [summaryRes, reviewsRes] = await Promise.all([
      fetch(`${API_BASE}/${encodeURIComponent(cleanId)}/remote`, fetchOpts),
      fetch(
        `${API_BASE}/${encodeURIComponent(cleanId)}/reviews/remote?limit=${safeLimit}`,
        fetchOpts
      ),
    ]);

    if (!reviewsRes.ok) {
      return {
        ok: false,
        totalRating: null,
        totalReviewAmount: 0,
        platformRatings: [],
        reviews: [],
      };
    }

    const summary = summaryRes.ok
      ? ((await summaryRes.json().catch(() => ({}))) as Record<string, unknown>)
      : {};
    const reviewsRaw = await reviewsRes.json().catch(() => []);
    const reviews: ReviewLabItem[] = Array.isArray(reviewsRaw) ? reviewsRaw : [];

    const platformRatings: { code: string; label: string; rating: number }[] = [];
    for (const [code, label] of Object.entries(PLATFORM_LABELS)) {
      const val = summary[`${code}Rating`];
      if (typeof val === "number" && val > 0) {
        platformRatings.push({ code, label, rating: Number(val.toFixed(1)) });
      }
    }

    const computedAvg =
      reviews.length > 0
        ? Number(
            (
              reviews.reduce((acc, r) => acc + (r.rating || 5), 0) /
              reviews.length
            ).toFixed(1)
          )
        : null;

    const totalRating =
      typeof summary.totalRating === "number" && summary.totalRating > 0
        ? Number(summary.totalRating.toFixed(1))
        : typeof summary.rating === "number" && summary.rating > 0
        ? Number(summary.rating.toFixed(1))
        : computedAvg;

    const totalReviewAmount =
      typeof summary.totalReviewAmount === "number"
        ? summary.totalReviewAmount
        : reviews.length;

    return {
      ok: true,
      totalRating,
      totalReviewAmount,
      platformRatings,
      reviews,
    };
  } catch {
    return {
      ok: false,
      totalRating: null,
      totalReviewAmount: 0,
      platformRatings: [],
      reviews: [],
    };
  }
}