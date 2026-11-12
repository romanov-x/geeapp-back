"use client";
import { useMemo, useState } from "react";
import {
  MODEL_SERVICE_OPTIONS,
  type CmsData,
  type ModelGalleryItem,
  type ModelServiceKey,
  type VehicleModel,
} from "@/lib/cms-types";
import { createEmptyServices, toModelSlug } from "@/lib/models-migration";
import { MediaField } from "./MediaField";

export function CatalogEditor({
  cms,
  saving,
  onSave,
}: {
  cms: CmsData;
  saving: boolean;
  onSave: (patch: Partial<CmsData>) => Promise<boolean>;
}) {
  const [models, setModels] = useState<VehicleModel[]>(cms.models || []);
  const [search, setSearch] = useState("");
  const [makeFilter, setMakeFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState<"all" | ModelServiceKey | "unsupported">("all");
  const [selectedId, setSelectedId] = useState<string>(cms.models?.[0]?.id || "");

  const makes = useMemo(
    () => Array.from(new Set(models.map((m) => m.make))).sort(),
    [models]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return models.filter((m) => {
      if (makeFilter !== "all" && m.make !== makeFilter) return false;
      if (serviceFilter === "unsupported") {
        if (m.supported) return false;
      } else if (serviceFilter !== "all") {
        if (!m.supported || !m.services[serviceFilter]?.enabled) return false;
      }
      if (!q) return true;
      const hay = `${m.make} ${m.name} ${m.slug} ${m.aliases.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [models, search, makeFilter, serviceFilter]);

  const current = models.find((m) => m.id === selectedId) || null;

  const linkedWorksCount = current
    ? cms.works.filter(
        (w) => w.car === current.id || current.legacyIds.includes(w.car)
      ).length
    : 0;

  function minPriceLabel(m: VehicleModel): string {
    if (!m.supported) return "Не прошивается";
    const enabled = Object.values(m.services).filter((s) => s.enabled);
    if (!enabled.length) return "Нет активных услуг";
    const numeric = enabled
      .map((s) => s.price)
      .filter((p): p is number => typeof p === "number" && p > 0);
    if (!numeric.length) return "По запросу";
    const min = Math.min(...numeric);
    return enabled.length > 1
      ? `от ${min.toLocaleString("ru-RU")} ₽`
      : `${min.toLocaleString("ru-RU")} ₽`;
  }

  function patchCurrent(patch: Partial<VehicleModel>) {
    if (!current) return;
    setModels((prev) =>
      prev.map((m) => {
        if (m.id !== current.id) return m;
        const updated = { ...m, ...patch };
        if (patch.make !== undefined || patch.name !== undefined) {
          updated.slug = toModelSlug(`${updated.make} ${updated.name}`);
        }
        return updated;
      })
    );
  }

  function patchService(
    key: ModelServiceKey,
    patch: Partial<{ enabled: boolean; price: number | null; note: string }>
  ) {
    if (!current) return;
    patchCurrent({
      services: {
        ...current.services,
        [key]: { ...current.services[key], ...patch },
      },
    });
  }

  function addModel() {
    const newId = `mdl-${Date.now().toString(36)}`;
    const defaultMake = makeFilter !== "all" ? makeFilter : makes[0] || "Geely";
    const services = createEmptyServices();
    services.apps = { enabled: true, price: 12000, note: "" };

    const item: VehicleModel = {
      id: newId,
      slug: toModelSlug(`${defaultMake} Новая модель ${models.length + 1}`),
      make: defaultMake,
      name: "Новая модель",
      supported: true,
      needsCompatibility: false,
      needsModel: false,
      photo: "",
      video: "",
      aliases: [],
      compatibilityNote: "",
      summary: "",
      services,
      gallery: [],
      legacyIds: [newId],
    };
    setModels((prev) => [item, ...prev]);
    setSelectedId(newId);
  }

  function removeCurrent() {
    if (!current) return;
    if (!confirm(`Удалить карточку автомобиля «${current.make} ${current.name}»?`))
      return;
    const next = models.filter((m) => m.id !== current.id);
    setModels(next);
    setSelectedId(next[0]?.id || "");
  }

  function addGalleryItem() {
    if (!current) return;
    const item: ModelGalleryItem = {
      id: `gal-${Date.now().toString(36)}`,
      kind: "image",
      src: "",
      caption: "",
    };
    patchCurrent({ gallery: [...current.gallery, item] });
  }

  function updateGallery(idx: number, patch: Partial<ModelGalleryItem>) {
    if (!current) return;
    patchCurrent({
      gallery: current.gallery.map((g, i) => (i === idx ? { ...g, ...patch } : g)),
    });
  }

  return (
    <div className="adm-split-editor">
      {/* ЛЕВЫЙ САЙДБАР: Поиск + Фильтр по марке + Фильтр по категории услуги */}
      <section className="adm-card">
        <div className="adm-card-head">
          <h2>Автомобили ({filtered.length})</h2>
          <button
            type="button"
            className="adm-btn adm-btn--primary"
            onClick={addModel}
          >
            + Новая модель
          </button>
        </div>

        <div className="adm-field">
          <input
            type="search"
            placeholder="Поиск по названию, кузову или индексу…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="adm-row-2">
          <label className="adm-field">
            <span>Марка</span>
            <select
              value={makeFilter}
              onChange={(e) => setMakeFilter(e.target.value)}
            >
              <option value="all">Все марки ({makes.length})</option>
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m} ({models.filter((item) => item.make === m).length})
                </option>
              ))}
            </select>
          </label>

          <label className="adm-field">
            <span>Категория услуги</span>
            <select
              value={serviceFilter}
              onChange={(e) =>
                setServiceFilter(
                  e.target.value as "all" | ModelServiceKey | "unsupported"
                )
              }
            >
              <option value="all">Все категории</option>
              <option value="apps">Установка приложений</option>
              <option value="russian">Русификация мультимедиа</option>
              <option value="dashboard">Русификация приборки</option>
              <option value="firmware">Прошивка / доп. функции</option>
              <option value="unsupported">Не прошиваются</option>
            </select>
          </label>
        </div>

        {(makeFilter !== "all" || serviceFilter !== "all" || search) && (
          <button
            type="button"
            className="adm-btn adm-btn--ghost"
            onClick={() => {
              setMakeFilter("all");
              setServiceFilter("all");
              setSearch("");
            }}
          >
            Сбросить фильтры сайдбара
          </button>
        )}

        <div className="adm-scroll-list">
          {filtered.map((m) => {
            const activeTags = MODEL_SERVICE_OPTIONS.filter(
              (opt) => m.supported && m.services[opt.key]?.enabled
            ).map((opt) =>
              opt.key === "apps"
                ? "Приложения"
                : opt.key === "russian"
                ? "Русиф. ГУ"
                : opt.key === "dashboard"
                ? "Приборка"
                : "Прошивка"
            );

            return (
              <button
                key={m.id}
                type="button"
                className={`adm-item-btn${
                  m.id === selectedId ? " is-selected" : ""
                }`}
                onClick={() => setSelectedId(m.id)}
              >
                <div>
                  <strong>
                    {m.make} {m.name}
                  </strong>
                  <small>
                    {!m.supported
                      ? "Не прошивается"
                      : activeTags.join(" · ") || "Услуги не выбраны"}
                    {m.video ? " · 🎬" : ""}
                    {m.gallery.length > 0 ? ` · 🖼${m.gallery.length}` : ""}
                  </small>
                </div>
                <span className="adm-price-pill">{minPriceLabel(m)}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ПРАВАЯ ЧАСТЬ: Карточка модели с чекбоксами услуг и ценами */}
      <section className="adm-card">
        <div className="adm-card-head">
          <div>
            <h2>
              {current ? `${current.make} ${current.name}` : "Выберите модель"}
            </h2>
            {current && (
              <a
                href={`/model/${current.slug}`}
                target="_blank"
                rel="noopener"
                className="adm-ext-link"
              >
                Открыть страницу /model/{current.slug} ↗
              </a>
            )}
          </div>
          <button
            type="button"
            disabled={saving}
            className="adm-btn adm-btn--primary"
            onClick={() => onSave({ models })}
          >
            {saving ? "Сохранение…" : "Сохранить каталог на сайте"}
          </button>
        </div>

        {current ? (
          <div className="adm-form">
            <div className="adm-row-2">
              <label className="adm-field">
                <span>Марка (выберите или впишите новую)</span>
                <input
                  list="adm-makes-datalist"
                  value={current.make}
                  onChange={(e) => patchCurrent({ make: e.target.value })}
                />
                <datalist id="adm-makes-datalist">
                  {makes.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </label>

              <label className="adm-field">
                <span>Модель и поколение</span>
                <input
                  type="text"
                  value={current.name}
                  onChange={(e) => patchCurrent({ name: e.target.value })}
                />
              </label>
            </div>

            {/* ЧЕКБОКСЫ УСЛУГ И МГНОВЕННЫЕ ЦЕНЫ */}
            <fieldset className="adm-fieldset">
              <legend>
                Доступные услуги и стоимость по автомобилю (пустая цена = «По запросу»)
              </legend>

              <label className="adm-check" style={{ marginBottom: "0.4rem" }}>
                <input
                  type="checkbox"
                  checked={current.supported}
                  onChange={(e) => patchCurrent({ supported: e.target.checked })}
                />
                <span>
                  <strong>Автомобиль поддерживается</strong> (снимите галочку для авто на закрытом Linux типа Haval M6)
                </span>
              </label>

              {current.supported && (
                <div className="adm-list">
                  {MODEL_SERVICE_OPTIONS.map((opt) => {
                    const srv = current.services[opt.key] || {
                      enabled: false,
                      price: null,
                      note: "",
                    };
                    return (
                      <div
                        key={opt.key}
                        className="adm-subcard"
                        style={{
                          borderColor: srv.enabled ? "var(--accent)" : undefined,
                          background: srv.enabled ? "#faf7ff" : "#fcfbfd",
                        }}
                      >
                        <div className="adm-row-2" style={{ alignItems: "center" }}>
                          <label className="adm-check">
                            <input
                              type="checkbox"
                              checked={srv.enabled}
                              onChange={(e) =>
                                patchService(opt.key, {
                                  enabled: e.target.checked,
                                })
                              }
                            />
                            <div>
                              <strong>{opt.label}</strong>
                              <small style={{ display: "block", color: "var(--muted)" }}>
                                {srv.enabled
                                  ? srv.price
                                    ? `На сайте: ${srv.price.toLocaleString("ru-RU")} ₽`
                                    : "На сайте автоматически: «По запросу»"
                                  : "Услуга выключена для этой модели"}
                              </small>
                            </div>
                          </label>

                          {srv.enabled && (
                            <label className="adm-field">
                              <span>Стоимость в ₽ (пусто = «По запросу»)</span>
                              <input
                                type="number"
                                min={0}
                                step={500}
                                placeholder="По запросу"
                                value={srv.price ?? ""}
                                onChange={(e) =>
                                  patchService(opt.key, {
                                    price:
                                      e.target.value.trim() === ""
                                        ? null
                                        : Number(e.target.value),
                                  })
                                }
                              />
                            </label>
                          )}
                        </div>

                        {srv.enabled && (
                          <label className="adm-field">
                            <span>
                              Уточнение по услуге для этой модели (необязательно — состав пакета, фишки мультируля/сплита/HUD)
                            </span>
                            <input
                              type="text"
                              placeholder={opt.defaultNote}
                              value={srv.note || ""}
                              onChange={(e) =>
                                patchService(opt.key, { note: e.target.value })
                              }
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </fieldset>

            <div className="adm-fieldset">
              <legend>Дополнительные флаги и ограничения</legend>
              <div className="adm-row-2">
                <label className="adm-check">
                  <input
                    type="checkbox"
                    checked={current.needsCompatibility}
                    onChange={(e) =>
                      patchCurrent({ needsCompatibility: e.target.checked })
                    }
                  />
                  <span>Показывать бейдж «Проверка по фото ГУ»</span>
                </label>
                <label className="adm-check">
                  <input
                    type="checkbox"
                    checked={current.needsModel}
                    onChange={(e) =>
                      patchCurrent({ needsModel: e.target.checked })
                    }
                  />
                  <span>В форме записи просить вписать точную модель вручную (как у BMW)</span>
                </label>
              </div>

              <label className="adm-field">
                <span>Важное примечание / ограничение (выводится заметной плашкой под ценой)</span>
                <input
                  type="text"
                  placeholder="Например: Доступно для авто выпуска до марта 2025 г. включительно"
                  value={current.compatibilityNote}
                  onChange={(e) =>
                    patchCurrent({ compatibilityNote: e.target.value })
                  }
                />
              </label>

              <label className="adm-field">
                <span>Кузовные индексы, китайские и народные названия (через запятую для поиска и SEO)</span>
                <input
                  type="text"
                  placeholder="Монджаро, KX11, Xingyue L"
                  value={current.aliases.join(", ")}
                  onChange={(e) =>
                    patchCurrent({
                      aliases: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </label>
            </div>

            <MediaField
              label="Главное фото автомобиля (карточка каталога и постер)"
              folder="vehicles"
              preset="vehiclePhoto"
              value={current.photo}
              onChange={(url) => patchCurrent({ photo: url })}
            />

            <MediaField
              label="Главное видео в шапке карточки модели (если загружено — воспроизводится на странице товара)"
              folder="vehicles"
              preset="vehicleVideo"
              value={current.video}
              onChange={(url) => patchCurrent({ video: url })}
            />

            <div className="adm-fieldset">
              <legend>
                Галерея выполненных работ модели (своих файлов:{" "}
                {current.gallery.length} + привязано из общего Портфолио:{" "}
                {linkedWorksCount})
              </legend>

              {current.gallery.map((g, idx) => (
                <div key={g.id} className="adm-subcard">
                  <div className="adm-card-head">
                    <strong>Кадр #{idx + 1}</strong>
                    <button
                      type="button"
                      className="adm-btn adm-btn--danger"
                      onClick={() =>
                        patchCurrent({
                          gallery: current.gallery.filter((_, i) => i !== idx),
                        })
                      }
                    >
                      Удалить
                    </button>
                  </div>
                  <div className="adm-row-2">
                    <label className="adm-field">
                      <span>Тип медиа</span>
                      <select
                        value={g.kind}
                        onChange={(e) =>
                          updateGallery(idx, {
                            kind: e.target.value as "image" | "video",
                          })
                        }
                      >
                        <option value="image">Фотография</option>
                        <option value="video">Видеоролик</option>
                      </select>
                    </label>
                    <label className="adm-field">
                      <span>Подпись к работе</span>
                      <input
                        type="text"
                        placeholder="Навигатор + разделение экрана"
                        value={g.caption}
                        onChange={(e) =>
                          updateGallery(idx, { caption: e.target.value })
                        }
                      />
                    </label>
                  </div>
                  <MediaField
                    label={g.kind === "video" ? "Видеофайл" : "Фотография"}
                    folder="works"
                    preset={g.kind === "video" ? "workVideo" : "workPoster"}
                    value={g.src}
                    onChange={(url) => updateGallery(idx, { src: url })}
                  />
                </div>
              ))}

              <button
                type="button"
                className="adm-btn adm-btn--ghost"
                onClick={addGalleryItem}
              >
                + Добавить фото/видео в галерею модели
              </button>
            </div>

            <div className="adm-row-actions">
              <button
                type="button"
                className="adm-btn adm-btn--danger"
                onClick={removeCurrent}
              >
                Удалить карточку автомобиля
              </button>
            </div>
          </div>
        ) : (
          <p className="adm-muted">Выберите модель в левом сайдбаре.</p>
        )}
      </section>
    </div>
  );
}