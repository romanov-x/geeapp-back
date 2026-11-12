"use client";
import { useState } from "react";
import type { CmsData } from "@/lib/cms-types";
import { MediaField } from "./MediaField";

export function SectionsEditor({
  cms,
  saving,
  onSave,
}: {
  cms: CmsData;
  saving: boolean;
  onSave: (patch: Partial<CmsData>) => Promise<boolean>;
}) {
  const [hero, setHero] = useState(cms.hero);
  const [tiles, setTiles] = useState(cms.serviceTiles);
  const [about, setAbout] = useState(cms.about);
  const [formats, setFormats] = useState(cms.formats);

  return (
    <div className="adm-list">
      <div className="adm-sticky-bar">
        <div>
          <strong>Редактор блоков главной страницы</strong>
          <span className="adm-muted"> — Первый экран (фото/видео), Услуги, О компании, Тарифы</span>
        </div>
        <button
          type="button"
          disabled={saving}
          className="adm-btn adm-btn--primary"
          onClick={() => onSave({ hero, serviceTiles: tiles, about, formats })}
        >
          {saving ? "Сохранение…" : "Сохранить все блоки"}
        </button>
      </div>

      <section className="adm-card">
        <h2>1. Первый экран (Hero)</h2>
        <div className="adm-row-2">
          <label className="adm-field">
            <span>Верхняя подпись (для Челябинска)</span>
            <input
              type="text"
              value={hero.hqBadge}
              onChange={(e) => setHero({ ...hero, hqBadge: e.target.value })}
            />
          </label>
          <label className="adm-field">
            <span>Верхняя подпись (для других городов)</span>
            <input
              type="text"
              value={hero.regionalBadge}
              onChange={(e) => setHero({ ...hero, regionalBadge: e.target.value })}
            />
          </label>
        </div>

        <div className="adm-row-2">
          <label className="adm-field">
            <span>Главный заголовок H1 (начало)</span>
            <input
              type="text"
              value={hero.titleBefore}
              onChange={(e) => setHero({ ...hero, titleBefore: e.target.value })}
            />
          </label>
          <label className="adm-field">
            <span>Градиентная часть H1 (перед «в Городе»)</span>
            <input
              type="text"
              value={hero.titleGradient}
              onChange={(e) => setHero({ ...hero, titleGradient: e.target.value })}
            />
          </label>
        </div>

        <div className="adm-row-3">
          {hero.stats.map((st, idx) => (
            <div key={idx} className="adm-subcard">
              <label className="adm-field">
                <span>Цифра #{idx + 1}</span>
                <input
                  type="text"
                  value={st.value}
                  onChange={(e) => {
                    const next = [...hero.stats];
                    next[idx] = { ...next[idx], value: e.target.value };
                    setHero({ ...hero, stats: next });
                  }}
                />
              </label>
              <label className="adm-field">
                <span>Подпись</span>
                <input
                  type="text"
                  value={st.label}
                  onChange={(e) => {
                    const next = [...hero.stats];
                    next[idx] = { ...next[idx], label: e.target.value };
                    setHero({ ...hero, stats: next });
                  }}
                />
              </label>
            </div>
          ))}
        </div>

        <div className="adm-row-3">
          <label className="adm-field">
            <span>Текст главной кнопки</span>
            <input
              type="text"
              value={hero.ctaLabel}
              onChange={(e) => setHero({ ...hero, ctaLabel: e.target.value })}
            />
          </label>
          <label className="adm-field">
            <span>Подсказка под кнопкой (Челябинск)</span>
            <input
              type="text"
              value={hero.hqSubnote}
              onChange={(e) => setHero({ ...hero, hqSubnote: e.target.value })}
            />
          </label>
          <label className="adm-field">
            <span>Подсказка под кнопкой (Регионы)</span>
            <input
              type="text"
              value={hero.regionalSubnote}
              onChange={(e) => setHero({ ...hero, regionalSubnote: e.target.value })}
            />
          </label>
        </div>

        <h3>Экраны мультимедиа в Hero (картинка или видео в каждом слоте)</h3>
        <div className="adm-row-3">
          {hero.splitImages.map((slot, idx) => {
            const kind = slot.kind || (slot.videoSrc ? "video" : "image");
            return (
              <div key={idx} className="adm-subcard">
                <label className="adm-field">
                  <span>Формат элемента #{idx + 1}</span>
                  <select
                    value={kind}
                    onChange={(e) => {
                      const next = [...hero.splitImages];
                      next[idx] = {
                        ...next[idx],
                        kind: e.target.value as "image" | "video",
                      };
                      setHero({ ...hero, splitImages: next });
                    }}
                  >
                    <option value="image">Статичная картинка (WEBP/PNG)</option>
                    <option value="video">Автовоспроизводимое видео (MP4/WEBM)</option>
                  </select>
                </label>

                <MediaField
                  label={
                    kind === "video"
                      ? `Постер-обложка для видео #${idx + 1}`
                      : `Картинка экрана #${idx + 1}`
                  }
                  folder="hero"
                  preset="heroImage"
                  value={slot.src}
                  onChange={(url) => {
                    const next = [...hero.splitImages];
                    next[idx] = { ...next[idx], src: url };
                    setHero({ ...hero, splitImages: next });
                  }}
                />

                {kind === "video" && (
                  <MediaField
                    label={`Видеофайл экрана #${idx + 1}`}
                    folder="hero"
                    preset="heroVideo"
                    value={slot.videoSrc || ""}
                    onChange={(url) => {
                      const next = [...hero.splitImages];
                      next[idx] = { ...next[idx], videoSrc: url };
                      setHero({ ...hero, splitImages: next });
                    }}
                  />
                )}

                <label className="adm-field">
                  <span>Описание (alt) для SEO и доступности</span>
                  <input
                    type="text"
                    value={slot.alt}
                    onChange={(e) => {
                      const next = [...hero.splitImages];
                      next[idx] = { ...next[idx], alt: e.target.value };
                      setHero({ ...hero, splitImages: next });
                    }}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </section>

      <section className="adm-card">
        <div className="adm-card-head">
          <h2>2. Карточки услуг (#services)</h2>
          <button
            type="button"
            className="adm-btn adm-btn--ghost"
            onClick={() =>
              setTiles((prev) => [
                ...prev,
                {
                  id: `srv-${Date.now().toString(36)}`,
                  kicker: "Услуга",
                  title: "Новая карточка услуги",
                  price: "По запросу",
                  description: "Описание услуги…",
                  chips: [],
                },
              ])
            }
          >
            + Добавить карточку
          </button>
        </div>
        <div className="adm-row-3">
          {tiles.map((tile, idx) => (
            <div key={tile.id} className="adm-subcard">
              <div className="adm-card-head">
                <strong>Карточка #{idx + 1}</strong>
                {tiles.length > 1 && (
                  <button
                    type="button"
                    className="adm-btn adm-btn--danger"
                    onClick={() => setTiles(tiles.filter((_, i) => i !== idx))}
                  >
                    Удалить
                  </button>
                )}
              </div>
              <label className="adm-field">
                <span>Заголовок услуги</span>
                <input
                  type="text"
                  value={tile.title}
                  onChange={(e) => {
                    const next = [...tiles];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setTiles(next);
                  }}
                />
              </label>
              <label className="adm-field">
                <span>Описание</span>
                <textarea
                  rows={3}
                  value={tile.description}
                  onChange={(e) => {
                    const next = [...tiles];
                    next[idx] = { ...next[idx], description: e.target.value };
                    setTiles(next);
                  }}
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="adm-card">
        <h2>3. Блок «О компании» (#about)</h2>
        <label className="adm-field">
          <span>Заголовок секции</span>
          <input
            type="text"
            value={about.title}
            onChange={(e) => setAbout({ ...about, title: e.target.value })}
          />
        </label>
        <label className="adm-field">
          <span>Вводный абзац</span>
          <textarea
            rows={2}
            value={about.lead}
            onChange={(e) => setAbout({ ...about, lead: e.target.value })}
          />
        </label>
        <div className="adm-row-3">
          {about.points.map((pt, idx) => (
            <div key={idx} className="adm-subcard">
              <label className="adm-field">
                <span>Акцент #{idx + 1}</span>
                <input
                  type="text"
                  value={pt.title}
                  onChange={(e) => {
                    const next = [...about.points];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setAbout({ ...about, points: next });
                  }}
                />
              </label>
              <label className="adm-field">
                <span>Подпись</span>
                <input
                  type="text"
                  value={pt.text}
                  onChange={(e) => {
                    const next = [...about.points];
                    next[idx] = { ...next[idx], text: e.target.value };
                    setAbout({ ...about, points: next });
                  }}
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="adm-card">
        <h2>4. Тарифы (#formats)</h2>
        <div className="adm-row-3">
          {formats.map((fmt, idx) => (
            <div key={fmt.id} className="adm-subcard">
              <label className="adm- check adm-check">
                <input
                  type="checkbox"
                  checked={Boolean(fmt.featured)}
                  onChange={(e) => {
                    const next = [...formats];
                    next[idx] = { ...next[idx], featured: e.target.checked };
                    setFormats(next);
                  }}
                />
                <span>Выделить как рекомендуемый тариф</span>
              </label>
              <label className="adm-field">
                <span>Бейдж</span>
                <input
                  type="text"
                  value={fmt.badge}
                  onChange={(e) => {
                    const next = [...formats];
                    next[idx] = { ...next[idx], badge: e.target.value };
                    setFormats(next);
                  }}
                />
              </label>
              <label className="adm-field">
                <span>Название тарифа</span>
                <input
                  type="text"
                  value={fmt.title}
                  onChange={(e) => {
                    const next = [...formats];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setFormats(next);
                  }}
                />
              </label>
              <label className="adm-field">
                <span>Цена</span>
                <input
                  type="text"
                  value={fmt.price}
                  onChange={(e) => {
                    const next = [...formats];
                    next[idx] = { ...next[idx], price: e.target.value };
                    setFormats(next);
                  }}
                />
              </label>
              <label className="adm-field">
                <span>Описание</span>
                <textarea
                  rows={2}
                  value={fmt.description}
                  onChange={(e) => {
                    const next = [...formats];
                    next[idx] = { ...next[idx], description: e.target.value };
                    setFormats(next);
                  }}
                />
              </label>
              <label className="adm-field">
                <span>Пункты списка (по одному на строке)</span>
                <textarea
                  rows={4}
                  value={fmt.features.join("\n")}
                  onChange={(e) => {
                    const next = [...formats];
                    next[idx] = {
                      ...next[idx],
                      features: e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    };
                    setFormats(next);
                  }}
                />
              </label>
              <label className="adm-field">
                <span>Текст кнопки</span>
                <input
                  type="text"
                  value={fmt.ctaLabel}
                  onChange={(e) => {
                    const next = [...formats];
                    next[idx] = { ...next[idx], ctaLabel: e.target.value };
                    setFormats(next);
                  }}
                />
              </label>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}