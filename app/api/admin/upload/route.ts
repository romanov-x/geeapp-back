import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";

const UPLOAD_ROOT = path.join(process.cwd(), "storage", "uploads");
const ALLOWED_EXT = new Set([
  ".webp",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".mp4",
  ".webm",
]);

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Требуется авторизация." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folderRaw = String(formData.get("folder") || "media");
  const folder = folderRaw.replace(/[^a-z0-9-_]/gi, "") || "media";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не передан." }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json(
      { error: "Допустимые форматы: WEBP, PNG, JPG, SVG, MP4, WEBM." },
      { status: 400 }
    );
  }

  if (file.size > 35 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Максимальный размер файла — 35 МБ." },
      { status: 400 }
    );
  }

  const targetDir = path.join(UPLOAD_ROOT, folder);
  fs.mkdirSync(targetDir, { recursive: true });

  const base = path
    .basename(file.name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "file";

  const fileName = `${base}-${crypto.randomBytes(4).toString("hex")}${ext}`;
  const fullPath = path.join(targetDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(fullPath, buffer);

  return NextResponse.json({
    url: `/uploads/${folder}/${fileName}`,
  });
}