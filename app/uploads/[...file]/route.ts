import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const UPLOAD_ROOT = path.join(process.cwd(), "storage", "uploads");

const MIME: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ file: string[] }> }
) {
  const { file } = await context.params;
  const resolved = path.resolve(UPLOAD_ROOT, ...file);

  if (!resolved.startsWith(UPLOAD_ROOT) || !fs.existsSync(resolved)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = path.extname(resolved).toLowerCase();
  const data = fs.readFileSync(resolved);

  return new NextResponse(data, {
    headers: {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}