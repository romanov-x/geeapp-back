"use client";
import { useState } from "react";
import type { CmsData, FaqItemContent } from "@/lib/cms-types";

export function FaqEditor({
  cms,
  saving,
  onSave,
}: {
  cms: CmsData;
  saving: boolean;
  onSave: (patch: Partial<CmsData>) => Promise<boolean>;
}) {
  const [faq, setFaq] = useState<FaqItemContent[]>(cms.faq);

  function addItem() {
    setFaq((prev) => [
      ...prev,
      {
        id: `faq-${Date.now().toString(36)}`,
        q: "Новый вопрос клиента?",
        a: "Подробный ответ…",
      },
    ]);
  }

  function move(idx: number, dir: -1 | 1) {
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= faq.length) return;
    const copy = [...faq];
    [copy[idx], copy[nextIdx]] = [copy[nextIdx], copy[idx]];
    setFaq(copy);
  }

  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <div>
          <h2>Частые вопросы и ответы ({faq.length})</h2>
          <p className="adm-muted">
            Отображаются в аккордеоне на главной странице и попадают в микроразметку для поисковиков.
          </p>
        </div>
        <div className="adm-row-actions">
          <button
            type="button"
            className="adm-btn adm-btn--ghost"
            onClick={addItem}
          >
            + Добавить вопрос
          </button>
          <button
            type="button"
            disabled={saving}
            className="adm-btn adm-btn--primary"
            onClick={() => onSave({ faq })}
          >
            {saving ? "Сохранение…" : "Сохранить FAQ"}
          </button>
        </div>
      </div>

      <div className="adm-list">
        {faq.map((item, idx) => (
          <div key={item.id} className="adm-subcard">
            <div className="adm-card-head">
              <strong>Вопрос #{idx + 1}</strong>
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
                  disabled={idx === faq.length - 1}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn--danger"
                  onClick={() => setFaq((prev) => prev.filter((_, i) => i !== idx))}
                >
                  Удалить
                </button>
              </div>
            </div>

            <label className="adm-field">
              <span>Вопрос</span>
              <input
                type="text"
                value={item.q}
                onChange={(e) =>
                  setFaq((prev) =>
                    prev.map((f, i) => (i === idx ? { ...f, q: e.target.value } : f))
                  )
                }
              />
            </label>

            <label className="adm-field">
              <span>Ответ</span>
              <textarea
                rows={3}
                value={item.a}
                onChange={(e) =>
                  setFaq((prev) =>
                    prev.map((f, i) => (i === idx ? { ...f, a: e.target.value } : f))
                  )
                }
              />
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}