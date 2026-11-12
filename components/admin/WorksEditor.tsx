"use client";
import { useState } from "react";
import type { CmsData, WorkItemContent } from "@/lib/cms-types";
import { MediaField } from "./MediaField";

export function WorksEditor({
  cms,
  saving,
  onSave,
}: {
  cms: CmsData;
  saving: boolean;
  onSave: (patch: Partial<CmsData>) => Promise<boolean>;
}) {
  const [works, setWorks] = useState<WorkItemContent[]>(cms.works);

  function update(idx: number, patch: Partial<WorkItemContent>) {
    setWorks((prev) =>
      prev.map((w, i) => (i === idx ? { ...w, ...patch } : w))
    );
  }

  function addWork() {
    setWorks((prev) => [
      {
        id: `work-${Date.now().toString(36)}`,
        car: cms.vehicles[0]?.id || "car-1",
        done: "Установлен пакет приложений: Яндекс Навигатор, музыка, сплит-экран.",
        img: "",
        video: "",
      },
      ...prev,
    ]);
  }

  function move(idx: number, dir: -1 | 1) {
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= works.length) return;
    const copy = [...works];
    [copy[idx], copy[nextIdx]] = [copy[nextIdx], copy[idx]];
    setWorks(copy);
  }

  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <div>
          <h2>Портфолио выполненных работ ({works.length})</h2>
          <p className="adm-muted">
            Карточки карусели в блоке «О компании» (также автоматически подтягиваются в галерею соответствующей модели авто).
          </p>
        </div>
        <div className="adm-row-actions">
          <button
            type="button"
            className="adm-btn adm-btn--ghost"
            onClick={addWork}
          >
            + Добавить кейс
          </button>
          <button
            type="button"
            disabled={saving}
            className="adm-btn adm-btn--primary"
            onClick={() => onSave({ works })}
          >
            {saving ? "Сохранение…" : "Сохранить портфолио"}
          </button>
        </div>
      </div>

      <div className="adm-grid-2">
        {works.map((w, idx) => (
          <div key={w.id} className="adm-subcard">
            <div className="adm-card-head">
              <strong>Кейс #{idx + 1}</strong>
              <div className="adm-row-actions">
                <button
                  type="button"
                  className="adm-btn adm-btn--ghost"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn--ghost"
                  onClick={() => move(idx, 1)}
                  disabled={idx === works.length - 1}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn--danger"
                  onClick={() => setWorks((prev) => prev.filter((_, i) => i !== idx))}
                >
                  Удалить
                </button>
              </div>
            </div>

            <label className="adm-field">
              <span>Привязанный автомобиль из каталога</span>
              <select
                value={w.car}
                onChange={(e) => update(idx, { car: e.target.value })}
              >
                {cms.vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.make} {v.name} ({v.service})
                  </option>
                ))}
              </select>
            </label>

            <label className="adm-field">
              <span>Что было сделано по автомобилю</span>
              <textarea
                rows={3}
                value={w.done}
                onChange={(e) => update(idx, { done: e.target.value })}
              />
            </label>

            <MediaField
              label="Фото-обложка (постер)"
              folder="works"
              preset="workPoster"
              value={w.img}
              onChange={(url) => update(idx, { img: url })}
            />

            <MediaField
              label="Видео работы (необязательно, MP4 / WEBM)"
              folder="works"
              preset="workVideo"
              value={w.video || ""}
              onChange={(url) => update(idx, { video: url || undefined })}
            />
          </div>
        ))}
      </div>
    </section>
  );
}