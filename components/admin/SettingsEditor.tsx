"use client";
import { useState } from "react";
import type { CmsData } from "@/lib/cms-types";
import { MediaField } from "./MediaField";

export function SettingsEditor({
  cms,
  saving,
  onSave,
}: {
  cms: CmsData;
  saving: boolean;
  onSave: (patch: Partial<CmsData>) => Promise<boolean>;
}) {
  const [settings, setSettings] = useState(cms.settings);

  function addSocial() {
    setSettings((prev) => ({
      ...prev,
      socials: [
        ...prev.socials,
        {
          id: `soc-${Date.now().toString(36)}`,
          label: "Канал",
          href: "https://",
          icon: "/assets/social/telegram.svg",
          enabled: true,
        },
      ],
    }));
  }

  return (
    <div className="adm-list">
      <div className="adm-sticky-bar">
        <strong>Контакты, карта, соцсети и юридическая информация</strong>
        <button
          type="button"
          disabled={saving}
          className="adm-btn adm-btn--primary"
          onClick={() => onSave({ settings })}
        >
          {saving ? "Сохранение…" : "Сохранить настройки"}
        </button>
      </div>

      <section className="adm-card">
        <h2>Основные контакты и адрес сервиса</h2>
        <div className="adm-row-3">
          <label className="adm-field">
            <span>Название бренда</span>
            <input
              type="text"
              value={settings.brandName}
              onChange={(e) =>
                setSettings({ ...settings, brandName: e.target.value })
              }
            />
          </label>
          <label className="adm-field">
            <span>Телефон (отображаемый)</span>
            <input
              type="text"
              value={settings.phoneDisplay}
              onChange={(e) =>
                setSettings({ ...settings, phoneDisplay: e.target.value })
              }
            />
          </label>
          <label className="adm-field">
            <span>Телефон для звонка (tel:)</span>
            <input
              type="text"
              placeholder="+79995811533"
              value={settings.phoneRaw}
              onChange={(e) =>
                setSettings({ ...settings, phoneRaw: e.target.value })
              }
            />
          </label>
        </div>

        <div className="adm-row-2">
          <label className="adm-field">
            <span>Email</span>
            <input
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
            />
          </label>
          <label className="adm-field">
            <span>График работы</span>
            <input
              type="text"
              value={settings.hours}
              onChange={(e) =>
                setSettings({ ...settings, hours: e.target.value })
              }
            />
          </label>
        </div>

        <div className="adm-row-2">
          <label className="adm-field">
            <span>Адрес центрального сервиса (Челябинск)</span>
            <input
              type="text"
              value={settings.hqAddress}
              onChange={(e) =>
                setSettings({ ...settings, hqAddress: e.target.value })
              }
            />
          </label>
          <label className="adm-field">
            <span>Примечание к адресу (парковка, онлайн и т.д.)</span>
            <input
              type="text"
              value={settings.hqNote}
              onChange={(e) =>
                setSettings({ ...settings, hqNote: e.target.value })
              }
            />
          </label>
        </div>

        <div className="adm-row-3">
          <label className="adm-field">
            <span>Виджет Яндекс.Карты (iframe src)</span>
            <input
              type="text"
              value={settings.mapIframeSrc}
              onChange={(e) =>
                setSettings({ ...settings, mapIframeSrc: e.target.value })
              }
            />
          </label>
          <label className="adm-field">
            <span>Ссылка для Яндекс.Навигатора</span>
            <input
              type="text"
              value={settings.mapNaviHref}
              onChange={(e) =>
                setSettings({ ...settings, mapNaviHref: e.target.value })
              }
            />
          </label>
          <label className="adm-field">
            <span>Ссылка на маршрут в браузере</span>
            <input
              type="text"
              value={settings.mapBrowserHref}
              onChange={(e) =>
                setSettings({ ...settings, mapBrowserHref: e.target.value })
              }
            />
          </label>
        </div>
      </section>

      <section className="adm-card">
        <div className="adm-card-head">
          <h2>Мессенджеры и соцсети</h2>
          <button
            type="button"
            className="adm-btn adm-btn--ghost"
            onClick={addSocial}
          >
            + Добавить ссылку
          </button>
        </div>

        <div className="adm-grid-2">
          {settings.socials.map((soc, idx) => (
            <div key={soc.id} className="adm-subcard">
              <div className="adm-card-head">
                <label className="adm-check">
                  <input
                    type="checkbox"
                    checked={soc.enabled}
                    onChange={(e) => {
                      const next = [...settings.socials];
                      next[idx] = { ...next[idx], enabled: e.target.checked };
                      setSettings({ ...settings, socials: next });
                    }}
                  />
                  <span>Показывать на сайте</span>
                </label>
                <button
                  type="button"
                  className="adm-btn adm-btn--danger"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      socials: settings.socials.filter((_, i) => i !== idx),
                    })
                  }
                >
                  Удалить
                </button>
              </div>

              <div className="adm-row-2">
                <label className="adm-field">
                  <span>Название</span>
                  <input
                    type="text"
                    value={soc.label}
                    onChange={(e) => {
                      const next = [...settings.socials];
                      next[idx] = { ...next[idx], label: e.target.value };
                      setSettings({ ...settings, socials: next });
                    }}
                  />
                </label>
                <label className="adm-field">
                  <span>Ссылка (URL)</span>
                  <input
                    type="text"
                    value={soc.href}
                    onChange={(e) => {
                      const next = [...settings.socials];
                      next[idx] = { ...next[idx], href: e.target.value };
                      setSettings({ ...settings, socials: next });
                    }}
                  />
                </label>
              </div>

              <MediaField
                label="Иконка соцсети"
                folder="social"
                value={soc.icon}
                onChange={(url) => {
                  const next = [...settings.socials];
                  next[idx] = { ...next[idx], icon: url };
                  setSettings({ ...settings, socials: next });
                }}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="adm-card">
        <h2>Юридические реквизиты и тексты согласий</h2>
        <label className="adm-field">
          <span>Сведения об операторе персональных данных (ИП / ИНН / адрес)</span>
          <input
            type="text"
            value={settings.legalOperator}
            onChange={(e) =>
              setSettings({ ...settings, legalOperator: e.target.value })
            }
          />
        </label>
        <label className="adm-field">
          <span>Вводный текст политики обработки данных (/privacy)</span>
          <textarea
            rows={3}
            value={settings.privacyIntro}
            onChange={(e) =>
              setSettings({ ...settings, privacyIntro: e.target.value })
            }
          />
        </label>
        <label className="adm-field">
          <span>Текст согласия в модальном окне</span>
          <textarea
            rows={3}
            value={settings.consentText}
            onChange={(e) =>
              setSettings({ ...settings, consentText: e.target.value })
            }
          />
        </label>
      </section>
    </div>
  );
}