"use client";
import { useState } from "react";
import type { CityInfo } from "@/lib/cities";
import type { CmsData } from "@/lib/cms-types";

export function CitiesEditor({
  cms,
  saving,
  onSave,
}: {
  cms: CmsData;
  saving: boolean;
  onSave: (patch: Partial<CmsData>) => Promise<boolean>;
}) {
  const [cities, setCities] = useState<CityInfo[]>(cms.cities);

  function updateCity(idx: number, patch: Partial<CityInfo>) {
    setCities((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, ...patch } : c))
    );
  }

  function addCity() {
    setCities((prev) => [
      ...prev,
      {
        slug: `city-${prev.length + 1}`,
        subdomain: `city-${prev.length + 1}`,
        name: "Новый город",
        inName: "в Новом городе",
        isHeadquarters: false,
      },
    ]);
  }

  function removeCity(idx: number) {
    if (cities[idx]?.isHeadquarters) {
      alert("Нельзя удалить главный город со стационарным сервисом.");
      return;
    }
    setCities((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <div>
          <h2>Города и поддомены ({cities.length})</h2>
          <p className="adm-muted">
            Поле «Поддомен» формирует адрес вида <code>ekb.geeapp.ru</code> (пустое значение = основной домен <code>geeapp.ru</code>).
          </p>
        </div>
        <div className="adm-row-actions">
          <button
            type="button"
            className="adm-btn adm-btn--ghost"
            onClick={addCity}
          >
            + Добавить город
          </button>
          <button
            type="button"
            disabled={saving}
            className="adm-btn adm-btn--primary"
            onClick={() => onSave({ cities })}
          >
            {saving ? "Сохранение…" : "Сохранить города"}
          </button>
        </div>
      </div>

      <div className="adm-list">
        {cities.map((c, idx) => (
          <div key={`${c.slug}-${idx}`} className="adm-subcard">
            <div className="adm-row-4">
              <label className="adm-field">
                <span>Город (Кто? Что?)</span>
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => updateCity(idx, { name: e.target.value })}
                />
              </label>

              <label className="adm-field">
                <span>Предложный падеж (Где?)</span>
                <input
                  type="text"
                  placeholder="в Екатеринбурге"
                  value={c.inName}
                  onChange={(e) => updateCity(idx, { inName: e.target.value })}
                />
              </label>

              <label className="adm-field">
                <span>Код / Slug</span>
                <input
                  type="text"
                  placeholder="ekb"
                  value={c.slug}
                  onChange={(e) =>
                    updateCity(idx, {
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                />
              </label>

              <label className="adm-field">
                <span>Поддомен (*.geeapp.ru)</span>
                <input
                  type="text"
                  placeholder={c.isHeadquarters ? "основной домен" : "ekb"}
                  value={c.subdomain}
                  onChange={(e) =>
                    updateCity(idx, {
                      subdomain: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                />
              </label>
            </div>

            <div className="adm-card-head">
              <label className="adm-check">
                <input
                  type="checkbox"
                  checked={Boolean(c.isHeadquarters)}
                  onChange={(e) =>
                    updateCity(idx, { isHeadquarters: e.target.checked })
                  }
                />
                <span>
                  Стационарный бокс GeeApp (показывать точный адрес и Яндекс.Карту вместо блока партнёров)
                </span>
              </label>

              {!c.isHeadquarters && (
                <button
                  type="button"
                  className="adm-btn adm-btn--danger"
                  onClick={() => removeCity(idx)}
                >
                  Удалить
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}