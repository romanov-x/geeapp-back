"use client";
import { useState } from "react";
import type { CmsData } from "@/lib/cms-types";

export function ReviewsEditor({
  cms,
  saving,
  onSave,
}: {
  cms: CmsData;
  saving: boolean;
  onSave: (patch: Partial<CmsData>) => Promise<boolean>;
}) {
  const [reviews, setReviews] = useState(cms.reviews);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  async function testConnection() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/reviewlab-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          widgetId: reviews.widgetId,
          limit: reviews.limit,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setTestResult({ ok: false, text: json.error || "Ошибка проверки" });
      } else {
        const platforms = (json.platforms || [])
          .map((p: { label: string; rating: number }) => `${p.label}: ${p.rating}★`)
          .join(", ");
        setTestResult({
          ok: true,
          text: `Успешно! Общий рейтинг: ${json.totalRating || "—"}★, всего отзывов в виджете: ${json.totalReviewAmount}, загружено карточек: ${json.loadedCount}.${platforms ? ` Площадки: ${platforms}.` : ""} Кэш обновлён.`,
        });
      }
    } catch {
      setTestResult({ ok: false, text: "Сетевая ошибка запроса" });
    } finally {
      setTesting(false);
    }
  }

  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <div>
          <h2>Отзывы клиентов через ReviewLab (reviewlab.ru)</h2>
          <p className="adm-muted">
            Вставьте <code>widgetId</code> из адресной строки вашего виджета в личном кабинете ReviewLab (например, <code>65f3c0a1b2d4e5f60718293a</code>). Сервер кэширует ответы на 24 часа, экономя лимит запросов вашего тарифа.
          </p>
        </div>
        <button
          type="button"
          disabled={saving}
          className="adm-btn adm-btn--primary"
          onClick={() => onSave({ reviews })}
        >
          {saving ? "Сохранение…" : "Сохранить настройки отзывов"}
        </button>
      </div>

      <label className="adm-check">
        <input
          type="checkbox"
          checked={reviews.enabled}
          onChange={(e) => setReviews({ ...reviews, enabled: e.target.checked })}
        />
        <span>Показывать секцию отзывов на сайте</span>
      </label>

      <div className="adm-row-3">
        <label className="adm-field">
          <span>Режим интеграции ReviewLab</span>
          <select
            value={reviews.mode}
            onChange={(e) =>
              setReviews({
                ...reviews,
                mode: e.target.value as "api" | "embed",
              })
            }
          >
            <option value="api">
              Через JSON API ReviewLab (фирменный дизайн GeeApp + микроразметка SEO)
            </option>
            <option value="embed">
              Готовый HTML-код виджета ReviewLab (стандартный блок)
            </option>
          </select>
        </label>

        <label className="adm-field">
          <span>Идентификатор виджета (widgetId)</span>
          <input
            type="text"
            placeholder="65f3c0a1b2d4e5f60718293a"
            value={reviews.widgetId}
            onChange={(e) =>
              setReviews({ ...reviews, widgetId: e.target.value.trim() })
            }
          />
        </label>

        <label className="adm-field">
          <span>Количество загружаемых отзывов (1–100)</span>
          <input
            type="number"
            min={3}
            max={100}
            value={reviews.limit}
            onChange={(e) =>
              setReviews({ ...reviews, limit: Number(e.target.value) || 12 })
            }
          />
        </label>
      </div>

      {reviews.mode === "api" ? (
        <div className="adm-row-actions">
          <button
            type="button"
            disabled={testing || !reviews.widgetId}
            className="adm-btn adm-btn--ghost"
            onClick={testConnection}
          >
            {testing
              ? "Запрос к app.reviewlab.ru…"
              : "Проверить widgetId и обновить кэш отзывов сейчас"}
          </button>
        </div>
      ) : (
        <label className="adm-field">
          <span>HTML-код виджета из личного кабинета ReviewLab</span>
          <textarea
            rows={4}
            placeholder="<div class='reviewlab-widget' ...></div><script src='...'></script>"
            value={reviews.embedHtml}
            onChange={(e) =>
              setReviews({ ...reviews, embedHtml: e.target.value })
            }
          />
        </label>
      )}

      {testResult && (
        <p
          className={`adm-alert ${
            testResult.ok ? "adm-alert--ok" : "adm-alert--error"
          }`}
        >
          {testResult.text}
        </p>
      )}

      <div className="adm-row-3">
        <label className="adm-field">
          <span>Надзаголовок секции</span>
          <input
            type="text"
            value={reviews.kicker}
            onChange={(e) => setReviews({ ...reviews, kicker: e.target.value })}
          />
        </label>
        <label className="adm-field">
          <span>Заголовок H2</span>
          <input
            type="text"
            value={reviews.title}
            onChange={(e) => setReviews({ ...reviews, title: e.target.value })}
          />
        </label>
        <label className="adm-field">
          <span>Подзаголовок</span>
          <input
            type="text"
            value={reviews.subtitle}
            onChange={(e) =>
              setReviews({ ...reviews, subtitle: e.target.value })
            }
          />
        </label>
      </div>
    </section>
  );
}