"use client";
import { useState } from "react";
import type {
  CmsData,
  CustomPageTemplate,
  PageBlockInstance,
  PageBlockType,
} from "@/lib/cms-types";
import { MediaField } from "./MediaField";

const BLOCK_CATALOG: { type: PageBlockType; label: string; desc: string }[] = [
  { type: "hero", label: "Первый экран (Hero)", desc: "Главный заголовок с городом, статистика и 3 экрана (фото/видео)" },
  { type: "brands", label: "Облако марок (BrandsCloud)", desc: "Плашки всех поддерживаемых брендов с логотипами" },
  { type: "services", label: "Карточки услуг (Services)", desc: "Сетка ключевых услуг сервиса" },
  { type: "models", label: "Каталог моделей с поиском (Models)", desc: "Живой поиск по кузовам, фильтры и карточки авто" },
  { type: "russian", label: "Таблица русификации (Russian)", desc: "Сводка русифицируемых марок и моделей" },
  { type: "about", label: "О компании + карусель работ (About)", desc: "Факты о подходе и видео/фото портфолио" },
  { type: "reviews", label: "Отзывы клиентов (ReviewLab)", desc: "Блок отзывов и рейтингов с площадок по API ReviewLab" },
  { type: "formats", label: "Тарифы и пакеты (Formats)", desc: "3 карточки тарифов с кнопками записи" },
  { type: "faq", label: "Частые вопросы (FAQ)", desc: "Аккордеон вопросов и ответов" },
  { type: "custom", label: "Универсальный контент-блок (Custom)", desc: "Свой заголовок, текст, фото/видео и кнопка в любом месте" },
];

function BlockListBuilder({
  blocks,
  onChange,
}: {
  blocks: PageBlockInstance[];
  onChange: (next: PageBlockInstance[]) => void;
}) {
  const [addType, setAddType] = useState<PageBlockType>("custom");

  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= blocks.length) return;
    const copy = [...blocks];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    onChange(copy);
  }

  function update(idx: number, patch: Partial<PageBlockInstance>) {
    onChange(blocks.map((b, i) => (i === idx ? { ...b, ...patch } : b)));
  }

  function addBlock() {
    const item: PageBlockInstance = {
      id: `blk-${Date.now().toString(36)}`,
      type: addType,
      enabled: true,
      ...(addType === "custom"
        ? {
            customKicker: "Дополнительно",
            customTitle: "Новый информационный блок",
            customText: "Описание услуги, акции или условий работы…",
            customMediaKind: "none",
            customMediaSrc: "",
            customCtaLabel: "Оставить заявку",
            customOpenBooking: true,
          }
        : {}),
    };
    onChange([...blocks, item]);
  }

  return (
    <div className="adm-list">
      {blocks.map((blk, idx) => {
        const meta = BLOCK_CATALOG.find((c) => c.type === blk.type);
        return (
          <div key={blk.id} className="adm-subcard">
            <div className="adm-card-head">
              <div>
                <strong>
                  {idx + 1}. {meta?.label || blk.type}
                </strong>
                <div className="adm-muted" style={{ fontSize: "0.8rem" }}>
                  {meta?.desc}
                </div>
              </div>
              <div className="adm-row-actions">
                <label className="adm-check" style={{ alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={blk.enabled}
                    onChange={(e) => update(idx, { enabled: e.target.checked })}
                  />
                  <span>Включён</span>
                </label>
                <button
                  type="button"
                  className="adm-btn adm-btn--ghost"
                  disabled={idx === 0}
                  onClick={() => move(idx, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn--ghost"
                  disabled={idx === blocks.length - 1}
                  onClick={() => move(idx, 1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn--danger"
                  onClick={() => onChange(blocks.filter((_, i) => i !== idx))}
                >
                  Убрать
                </button>
              </div>
            </div>

            {blk.type === "custom" && (
              <div className="adm-form" style={{ marginTop: "0.5rem" }}>
                <div className="adm-row-2">
                  <label className="adm-field">
                    <span>Надзаголовок</span>
                    <input
                      type="text"
                      value={blk.customKicker || ""}
                      onChange={(e) =>
                        update(idx, { customKicker: e.target.value })
                      }
                    />
                  </label>
                  <label className="adm-field">
                    <span>Заголовок секции</span>
                    <input
                      type="text"
                      value={blk.customTitle || ""}
                      onChange={(e) =>
                        update(idx, { customTitle: e.target.value })
                      }
                    />
                  </label>
                </div>
                <label className="adm-field">
                  <span>Текст секции (поддерживаются абзацы)</span>
                  <textarea
                    rows={4}
                    value={blk.customText || ""}
                    onChange={(e) =>
                      update(idx, { customText: e.target.value })
                    }
                  />
                </label>
                <div className="adm-row-3">
                  <label className="adm-field">
                    <span>Медиа в блоке</span>
                    <select
                      value={blk.customMediaKind || "none"}
                      onChange={(e) =>
                        update(idx, {
                          customMediaKind: e.target.value as
                            | "none"
                            | "image"
                            | "video",
                        })
                      }
                    >
                      <option value="none">Без медиа (только текст)</option>
                      <option value="image">Изображение справа</option>
                      <option value="video">Видео справа</option>
                    </select>
                  </label>
                  <label className="adm-field">
                    <span>Текст кнопки (пусто = без кнопки)</span>
                    <input
                      type="text"
                      value={blk.customCtaLabel || ""}
                      onChange={(e) =>
                        update(idx, { customCtaLabel: e.target.value })
                      }
                    />
                  </label>
                  <label className="adm-field">
                    <span>Ссылка кнопки (если не открывает заявку)</span>
                    <input
                      type="text"
                      placeholder="/#models или https://..."
                      disabled={Boolean(blk.customOpenBooking)}
                      value={blk.customCtaHref || ""}
                      onChange={(e) =>
                        update(idx, { customCtaHref: e.target.value })
                      }
                    />
                  </label>
                </div>
                <label className="adm-check">
                  <input
                    type="checkbox"
                    checked={Boolean(blk.customOpenBooking)}
                    onChange={(e) =>
                      update(idx, { customOpenBooking: e.target.checked })
                    }
                  />
                  <span>Кнопка открывает модальное окно записи GeeApp</span>
                </label>

                {blk.customMediaKind && blk.customMediaKind !== "none" && (
                  <MediaField
                    label={
                      blk.customMediaKind === "video"
                        ? "Видеофайл блока"
                        : "Изображение блока"
                    }
                    folder="sections"
                    preset="customMedia"
                    value={blk.customMediaSrc || ""}
                    onChange={(url) => update(idx, { customMediaSrc: url })}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="adm-media-row">
        <select
          className="adm-inline-input"
          value={addType}
          onChange={(e) => setAddType(e.target.value as PageBlockType)}
        >
          {BLOCK_CATALOG.map((item) => (
            <option key={item.type} value={item.type}>
              {item.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="adm-btn adm-btn--ghost"
          onClick={addBlock}
        >
          + Вставить компонент в шаблон
        </button>
      </div>
    </div>
  );
}

export function TemplatesEditor({
  cms,
  saving,
  onSave,
}: {
  cms: CmsData;
  saving: boolean;
  onSave: (patch: Partial<CmsData>) => Promise<boolean>;
}) {
  const [homeBlocks, setHomeBlocks] = useState<PageBlockInstance[]>(
    cms.homeBlocks
  );
  const [pages, setPages] = useState<CustomPageTemplate[]>(cms.customPages);
  const [selectedPageId, setSelectedPageId] = useState<string>("__home__");

  function createPage() {
    const id = `page-${Date.now().toString(36)}`;
    const next: CustomPageTemplate = {
      id,
      slug: `page-${pages.length + 1}`,
      title: "Новая страница GeeApp",
      metaDescription: "Описание страницы для поисковых систем",
      published: true,
      showInFooter: true,
      blocks: [
        {
          id: `blk-${Date.now().toString(36)}`,
          type: "custom",
          enabled: true,
          customKicker: "GeeApp",
          customTitle: "Заголовок новой страницы",
          customText: "Добавьте сюда любые готовые компоненты сайта: каталог, отзывы, тарифы, FAQ или текстовые секции.",
          customMediaKind: "none",
          customCtaLabel: "Оставить заявку",
          customOpenBooking: true,
        },
        { id: `blk-rev-${Date.now().toString(36)}`, type: "reviews", enabled: true },
        { id: `blk-faq-${Date.now().toString(36)}`, type: "faq", enabled: true },
      ],
    };
    setPages((prev) => [...prev, next]);
    setSelectedPageId(id);
  }

  const activePage = pages.find((p) => p.id === selectedPageId) || null;

  function patchActivePage(patch: Partial<CustomPageTemplate>) {
    if (!activePage) return;
    setPages((prev) =>
      prev.map((p) => (p.id === activePage.id ? { ...p, ...patch } : p))
    );
  }

  return (
    <div className="adm-split-editor">
      <section className="adm-card">
        <div className="adm-card-head">
          <h2>Шаблоны страниц</h2>
          <button
            type="button"
            className="adm-btn adm-btn--ghost"
            onClick={createPage}
          >
            + Новая страница
          </button>
        </div>
        <p className="adm-muted">
          Меняйте порядок готовых компонентов на главной или собирайте новые посадочные страницы (например, <code>/online</code>, <code>/partners</code>).
        </p>

        <div className="adm-list">
          <button
            type="button"
            className={`adm-item-btn${
              selectedPageId === "__home__" ? " is-selected" : ""
            }`}
            onClick={() => setSelectedPageId("__home__")}
          >
            <div>
              <strong>Главная страница (/)</strong>
              <small>Блоков: {homeBlocks.length}</small>
            </div>
            <span className="adm-price-pill">Основная</span>
          </button>

          {pages.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`adm-item-btn${
                selectedPageId === p.id ? " is-selected" : ""
              }`}
              onClick={() => setSelectedPageId(p.id)}
            >
              <div>
                <strong>{p.title}</strong>
                <small>/{p.slug} · Блоков: {p.blocks.length}</small>
              </div>
              <span className="adm-price-pill">
                {p.published ? "Опубл." : "Черновик"}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="adm-card">
        <div className="adm-card-head">
          <h2>
            {selectedPageId === "__home__"
              ? "Структура главной страницы (/)"
              : `Страница /${activePage?.slug || ""}`}
          </h2>
          <button
            type="button"
            disabled={saving}
            className="adm-btn adm-btn--primary"
            onClick={() => onSave({ homeBlocks, customPages: pages })}
          >
            {saving ? "Сохранение…" : "Сохранить шаблоны"}
          </button>
        </div>

        {selectedPageId === "__home__" ? (
          <BlockListBuilder blocks={homeBlocks} onChange={setHomeBlocks} />
        ) : activePage ? (
          <div className="adm-form">
            <div className="adm-row-2">
              <label className="adm-field">
                <span>URL-адрес страницы (без слэша, латиницей)</span>
                <input
                  type="text"
                  placeholder="online-proshivka"
                  value={activePage.slug}
                  onChange={(e) =>
                    patchActivePage({
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                />
              </label>
              <label className="adm-field">
                <span>SEO Title (заголовок вкладки)</span>
                <input
                  type="text"
                  value={activePage.title}
                  onChange={(e) => patchActivePage({ title: e.target.value })}
                />
              </label>
            </div>

            <label className="adm-field">
              <span>SEO Description</span>
              <input
                type="text"
                value={activePage.metaDescription}
                onChange={(e) =>
                  patchActivePage({ metaDescription: e.target.value })
                }
              />
            </label>

            <div className="adm-row-2">
              <label className="adm-check">
                <input
                  type="checkbox"
                  checked={activePage.published}
                  onChange={(e) =>
                    patchActivePage({ published: e.target.checked })
                  }
                />
                <span>Страница опубликована (доступна по адресу /{activePage.slug})</span>
              </label>
              <label className="adm-check">
                <input
                  type="checkbox"
                  checked={activePage.showInFooter}
                  onChange={(e) =>
                    patchActivePage({ showInFooter: e.target.checked })
                  }
                />
                <span>Добавить ссылку на эту страницу в подвал сайта</span>
              </label>
            </div>

            <h3>Компоненты на странице /{activePage.slug}</h3>
            <BlockListBuilder
              blocks={activePage.blocks}
              onChange={(nextBlocks) => patchActivePage({ blocks: nextBlocks })}
            />

            <div className="adm-row-actions">
              <a
                href={`/${activePage.slug}`}
                target="_blank"
                rel="noopener"
                className="adm-btn adm-btn--ghost"
              >
                Открыть /{activePage.slug} ↗
              </a>
              <button
                type="button"
                className="adm-btn adm-btn--danger"
                onClick={() => {
                  if (!confirm(`Удалить страницу /${activePage.slug}?`)) return;
                  setPages((prev) => prev.filter((p) => p.id !== activePage.id));
                  setSelectedPageId("__home__");
                }}
              >
                Удалить страницу
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}