import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getCurrentAdmin, hasPermission } from "@/lib/auth";
import { getCmsData, saveCmsData } from "@/lib/cms-store";
import type { CmsData, PermissionId } from "@/lib/cms-types";

const SECTION_PERMISSION: Record<string, PermissionId> = {
  vehicles: "catalog",
  vehicleImages: "catalog",
  vehicleVideos: "catalog",
  vehicleGalleries: "catalog",
  modelAliases: "catalog",
  brandLogos: "brands",
  brandAliases: "brands",
  cities: "cities",
  hero: "sections",
  serviceTiles: "sections",
  about: "sections",
  formats: "sections",
  homeBlocks: "templates",
  customPages: "templates",
  works: "works",
  reviews: "reviews",
  faq: "faq",
  legal: "legal",
  settings: "settings",
  models: "catalog",
};

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Требуется авторизация." }, { status: 401 });
  }
  return NextResponse.json({ data: getCmsData() });
}

export async function PUT(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Требуется авторизация." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    patch?: Partial<CmsData>;
    fullRestore?: CmsData;
  };

  if (body.fullRestore) {
    if (!admin.isOwner) {
      return NextResponse.json(
        { error: "Импорт резервной копии доступен только владельцу." },
        { status: 403 }
      );
    }
    const saved = saveCmsData(body.fullRestore);
    revalidatePath("/", "layout");
    return NextResponse.json({ data: saved });
  }

  if (!body.patch || typeof body.patch !== "object") {
    return NextResponse.json({ error: "Пустой запрос." }, { status: 400 });
  }

  for (const key of Object.keys(body.patch)) {
    const requiredPerm = SECTION_PERMISSION[key];
    if (!requiredPerm || !hasPermission(admin, requiredPerm)) {
      return NextResponse.json(
        { error: `Недостаточно прав для раздела «${key}».` },
        { status: 403 }
      );
    }
  }

  const current = getCmsData();
  const saved = saveCmsData({ ...current, ...body.patch });

  revalidatePath("/", "layout");
  revalidatePath("/legal");
  revalidatePath("/privacy");
  revalidatePath("/consent");
  revalidatePath("/llms.txt");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ data: saved });
}