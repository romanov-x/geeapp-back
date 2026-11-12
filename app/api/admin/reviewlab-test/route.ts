import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getCurrentAdmin, hasPermission } from "@/lib/auth";
import { fetchReviewLabData } from "@/lib/reviewlab";

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!hasPermission(admin, "reviews")) {
    return NextResponse.json({ error: "Нет прав доступа." }, { status: 403 });
  }

  const { widgetId, limit } = (await request.json().catch(() => ({}))) as {
    widgetId?: string;
    limit?: number;
  };

  if (!widgetId?.trim()) {
    return NextResponse.json(
      { error: "Укажите идентификатор виджета (widgetId) из ReviewLab." },
      { status: 400 }
    );
  }

  revalidateTag("reviewlab");
  const bundle = await fetchReviewLabData(widgetId, limit || 12, true);

  if (!bundle.ok) {
    return NextResponse.json(
      {
        error:
          "Не удалось получить отзывы по этому widgetId. Проверьте ID виджета и доступность API на вашем тарифе ReviewLab.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    totalRating: bundle.totalRating,
    totalReviewAmount: bundle.totalReviewAmount,
    loadedCount: bundle.reviews.length,
    platforms: bundle.platformRatings,
  });
}