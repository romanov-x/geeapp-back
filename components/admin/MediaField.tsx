"use client";
import { useState } from "react";

export type MediaPreset =
  | "vehiclePhoto"
  | "vehicleVideo"
  | "heroImage"
  | "heroVideo"
  | "brandLogo"
  | "workPoster"
  | "workVideo"
  | "socialIcon"
  | "customMedia";

const PRESET_HINTS: Record<
  MediaPreset,
  { text: string; maxWarnMb: number; accept: string }
> = {
  vehiclePhoto: {
    text: "Оптимально: WEBP (или PNG/JPG), 1280×640 px (соотношение 2:1, горизонтальное), прозрачный или светлый фон, до 250 КБ.",
    maxWarnMb: 0.6,
    accept: "image/webp,image/png,image/jpeg,image/svg+xml",
  },
  vehicleVideo: {
    text: "Оптимально: MP4 (кодек H.264) или WEBM, 1280×720 px (16:9) или 1280×640 px, длительность 5–20 сек, до 8 МБ.",
    maxWarnMb: 10,
    accept: "video/mp4,video/webm",
  },
  heroImage: {
    text: "Оптимально: WEBP, 840×1492 px или 420×746 px (вертикальный экран 9:16), до 200 КБ для мгновенной загрузки первого экрана.",
    maxWarnMb: 0.5,
    accept: "image/webp,image/png,image/jpeg",
  },
  heroVideo: {
    text: "Оптимально: MP4 (H.264, без звуковой дорожки для автоплея) или WEBM, 720×1280 px (9:16), 5–12 сек, до 5 МБ.",
    maxWarnMb: 7,
    accept: "video/mp4,video/webm",
  },
  brandLogo: {
    text: "Оптимально: векторный SVG или PNG/WEBP с прозрачным фоном, 128×128 px (1:1), до 40 КБ.",
    maxWarnMb: 0.15,
    accept: "image/svg+xml,image/webp,image/png",
  },
  workPoster: {
    text: "Оптимально: WEBP или JPG, 720×1280 px (вертикальный кадр 9:16), до 250 КБ.",
    maxWarnMb: 0.6,
    accept: "image/webp,image/jpeg,image/png",
  },
  workVideo: {
    text: "Оптимально: MP4 (H.264) или WEBM, 720×1280 px (вертикальное 9:16), до 10 МБ.",
    maxWarnMb: 12,
    accept: "video/mp4,video/webm",
  },
  socialIcon: {
    text: "Оптимально: SVG или прозрачный PNG 64×64 px, до 25 КБ.",
    maxWarnMb: 0.1,
    accept: "image/svg+xml,image/png,image/webp",
  },
  customMedia: {
    text: "Оптимально: WEBP 1600×900 px (16:9, до 300 КБ) для фото или MP4 1280×720 px (до 10 МБ) для видео.",
    maxWarnMb: 10,
    accept: "image/webp,image/png,image/jpeg,video/mp4,video/webm",
  },
};

export function MediaField({
  label,
  value,
  folder = "media",
  preset,
  hint,
  accept,
  onChange,
}: {
  label: string;
  value: string;
  folder?: string;
  preset?: MediaPreset;
  hint?: string;
  accept?: string;
  onChange: (nextUrl: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [infoNote, setInfoNote] = useState("");

  const presetCfg = preset ? PRESET_HINTS[preset] : undefined;
  const resolvedHint = hint || presetCfg?.text;
  const resolvedAccept = accept || presetCfg?.accept || "image/*";

  const previewSrc = value
    ? value.startsWith("/") || value.startsWith("http")
      ? value
      : `/${value}`
    : "";

  const isVideo = /\.(mp4|webm)(\?|$)/i.test(previewSrc);

  async function inspectImageDimensions(file: File): Promise<string> {
    if (!file.type.startsWith("image/") || file.type.includes("svg")) return "";
    return new Promise((resolve) => {
      const img = new Image();
      const objUrl = URL.createObjectURL(file);
      img.onload = () => {
        const dim = `${img.naturalWidth}×${img.naturalHeight} px`;
        URL.revokeObjectURL(objUrl);
        resolve(dim);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        resolve("");
      };
      img.src = objUrl;
    });
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr("");
    setInfoNote("");

    const sizeMb = file.size / (1024 * 1024);
    const dims = await inspectImageDimensions(file);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) {
        setErr(json.error || "Ошибка загрузки файла");
      } else {
        onChange(json.url);
        const sizeStr =
          sizeMb >= 1
            ? `${sizeMb.toFixed(1)} МБ`
            : `${Math.round(file.size / 1024)} КБ`;
        const warn =
          presetCfg && sizeMb > presetCfg.maxWarnMb
            ? " (файл тяжелее рекомендуемого — для ускорения загрузки сайта лучше сжать в WEBP/MP4)"
            : " — отличный размер!";
        setInfoNote(
          `Загружено: ${dims ? `${dims}, ` : ""}${sizeStr}${warn}`
        );
      }
    } catch {
      setErr("Не удалось загрузить файл");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="adm-field">
      <span>{label}</span>
      {resolvedHint && <small className="adm-media-hint">💡 {resolvedHint}</small>}
      <div className="adm-media-row">
        <input
          type="text"
          value={value}
          placeholder="/uploads/... или /assets/..."
          onChange={(e) => onChange(e.target.value)}
        />
        <label className="adm-btn adm-btn--ghost adm-upload-label">
          {uploading ? "Загрузка…" : "Выбрать файл"}
          <input
            type="file"
            accept={resolvedAccept}
            hidden
            disabled={uploading}
            onChange={handleFile}
          />
        </label>
        {value && (
          <button
            type="button"
            className="adm-btn adm-btn--ghost"
            onClick={() => {
              onChange("");
              setInfoNote("");
            }}
            title="Очистить поле"
          >
            ×
          </button>
        )}
      </div>
      {err && <small style={{ color: "#b91c1c" }}>{err}</small>}
      {infoNote && <small style={{ color: "#065f46" }}>{infoNote}</small>}
      {previewSrc && (
        <div className="adm-media-preview">
          {isVideo ? (
            <video src={previewSrc} muted controls preload="metadata" />
          ) : (
            <img src={previewSrc} alt="Превью" />
          )}
        </div>
      )}
    </div>
  );
}