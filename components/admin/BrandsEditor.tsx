"use client";
import { useState } from "react";
import type { CmsData } from "@/lib/cms-types";
import { MediaField } from "./MediaField";

export function BrandsEditor({
  cms,
  saving,
  onSave,
}: {
  cms: CmsData;
  saving: boolean;
  onSave: (patch: Partial<CmsData>) => Promise<boolean>;
}) {
  const [logos, setLogos] = useState<Record<string, string>>(cms.brandLogos);
  const [aliases, setAliases] = useState<Record<string, string[]>>(cms.brandAliases);
  const [newMake, setNewMake] = useState("");

  const allMakes = Array.from(
    new Set([
      ...cms.vehicles.map((v) => v.make),
      ...Object.keys(logos),
      ...Object.keys(aliases),
    ])
  ).sort();

  function addBrand() {
    const clean = newMake.trim();
    if (!clean) return;
    setLogos((prev) => ({ ...prev, [clean]: prev[clean] || "" }));
    setAliases((prev) => ({ ...prev, [clean]: prev[clean] || [] }));
    setNewMake("");
  }

  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <div>
          <h2>Марки автомобилей и логотипы ({allMakes.length})</h2>
          <p className="adm-muted">
            Настройте логотипы брендов и русские варианты написания (для живого поиска и SEO-заголовков).
          </p>
        </div>
        <button
          type="button"
          disabled={saving}
          className="adm-btn adm-btn--primary"
          onClick={() => onSave({ brandLogos: logos, brandAliases: aliases })}
        >
          {saving ? "Сохранение…" : "Сохранить марки"}
        </button>
      </div>

      <div className="adm-media-row">
        <input
          type="text"
          className="adm-inline-input"
          placeholder="Название новой марки (например: Avatr, Omoda, Chery)…"
          value={newMake}
          onChange={(e) => setNewMake(e.target.value)}
        />
        <button
          type="button"
          className="adm-btn adm-btn--ghost"
          onClick={addBrand}
        >
          + Добавить марку
        </button>
      </div>

      <div className="adm-grid-2">
        {allMakes.map((make) => (
          <div key={make} className="adm-subcard">
            <h3>{make}</h3>
            <MediaField
              label="Логотип марки"
              folder="brands"
              preset="brandLogo"
              value={logos[make] || ""}
              onChange={(url) => setLogos((prev) => ({ ...prev, [make]: url }))}
            />
            <label className="adm-field">
              <span>Русские названия и синонимы (через запятую)</span>
              <input
                type="text"
                placeholder="Джили, Jili"
                value={(aliases[make] || []).join(", ")}
                onChange={(e) =>
                  setAliases((prev) => ({
                    ...prev,
                    [make]: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}