"use client";
import { useState } from "react";
import type { CmsData } from "@/lib/cms-types";

export function LegalEditor({
  cms,
  saving,
  onSave,
}: {
  cms: CmsData;
  saving: boolean;
  onSave: (patch: Partial<CmsData>) => Promise<boolean>;
}) {
  const [legal, setLegal] = useState(cms.legal);

  return (
    <div className="adm-list">
      <div className="adm-sticky-bar">
        <div>
          <strong>Юридические документы по законодательству РФ (152-ФЗ)</strong>
          <span className="adm-muted"> — публикуются на странице /legal, в форме заявки и Cookie-баннере</span>
        </div>
        <button
          type="button"
          disabled={saving}
          className="adm-btn adm-btn--primary"
          onClick={() => onSave({ legal })}
        >
          {saving ? "Сохранение…" : "Сохранить все документы"}
        </button>
      </div>

      <section className="adm-card">
        <h2>1. Полные юридические реквизиты Оператора</h2>
        <div className="adm-row-2">
          <label className="adm-field">
            <span>Полное наименование ИП / юридического лица</span>
            <input
              type="text"
              value={legal.companyFullName}
              onChange={(e) =>
                setLegal({ ...legal, companyFullName: e.target.value })
              }
            />
          </label>
          <label className="adm-field">
            <span>Дата актуальной редакции документов</span>
            <input
              type="text"
              value={legal.updatedDate}
              onChange={(e) =>
                setLegal({ ...legal, updatedDate: e.target.value })
              }
            />
          </label>
        </div>

        <div className="adm-row-4">
          <label className="adm-field">
            <span>ИНН</span>
            <input
              type="text"
              value={legal.inn}
              onChange={(e) => setLegal({ ...legal, inn: e.target.value })}
            />
          </label>
          <label className="adm-field">
            <span>ОГРНИП / ОГРН</span>
            <input
              type="text"
              value={legal.ogrnip}
              onChange={(e) => setLegal({ ...legal, ogrnip: e.target.value })}
            />
          </label>
          <label className="adm-field">
            <span>Email для обращений по ПДн</span>
            <input
              type="email"
              value={legal.dpoEmail}
              onChange={(e) => setLegal({ ...legal, dpoEmail: e.target.value })}
            />
          </label>
          <label className="adm-field">
            <span>Контактный телефон</span>
            <input
              type="text"
              value={legal.phone}
              onChange={(e) => setLegal({ ...legal, phone: e.target.value })}
            />
          </label>
        </div>

        <div className="adm-row-2">
          <label className="adm-field">
            <span>Юридический адрес регистрации</span>
            <input
              type="text"
              value={legal.legalAddress}
              onChange={(e) =>
                setLegal({ ...legal, legalAddress: e.target.value })
              }
            />
          </label>
          <label className="adm-field">
            <span>Фактический адрес центрального сервиса</span>
            <input
              type="text"
              value={legal.serviceAddress}
              onChange={(e) =>
                setLegal({ ...legal, serviceAddress: e.target.value })
              }
            />
          </label>
        </div>

        <label className="adm-field">
          <span>Банковские или дополнительные реквизиты (необязательно)</span>
          <textarea
            rows={2}
            placeholder="Р/с, Банк, БИК, К/с (если нужно отображать в карточке реквизитов)"
            value={legal.bankDetails}
            onChange={(e) =>
              setLegal({ ...legal, bankDetails: e.target.value })
            }
          />
        </label>
      </section>

      <section className="adm-card">
        <h2>2. Политика обработки персональных данных (152-ФЗ)</h2>
        <label className="adm-field">
          <span>Заголовок документа</span>
          <input
            type="text"
            value={legal.privacyTitle}
            onChange={(e) =>
              setLegal({ ...legal, privacyTitle: e.target.value })
            }
          />
        </label>
        <label className="adm-field">
          <span>Полный текст Политики (разделяйте абзацы пустой строкой)</span>
          <textarea
            rows={10}
            value={legal.privacyBody}
            onChange={(e) =>
              setLegal({ ...legal, privacyBody: e.target.value })
            }
          />
        </label>
      </section>

      <section className="adm-card">
        <h2>3. Согласие №1 (основная галочка обработки ПДн в форме заявки)</h2>
        <label className="adm-field">
          <span>Текст рядом с чекбоксом №1 в форме заявки</span>
          <input
            type="text"
            value={legal.consentPrimaryLabel}
            onChange={(e) =>
              setLegal({ ...legal, consentPrimaryLabel: e.target.value })
            }
          />
        </label>
        <label className="adm-field">
          <span>Заголовок документа Согласия №1</span>
          <input
            type="text"
            value={legal.consentPrimaryTitle}
            onChange={(e) =>
              setLegal({ ...legal, consentPrimaryTitle: e.target.value })
            }
          />
        </label>
        <label className="adm-field">
          <span>Полный текст Согласия №1</span>
          <textarea
            rows={7}
            value={legal.consentPrimaryBody}
            onChange={(e) =>
              setLegal({ ...legal, consentPrimaryBody: e.target.value })
            }
          />
        </label>
      </section>

      <section className="adm-card">
        <h2>4. Согласие №2 (вторая галочка — передача мастеру-партнёру / сервисная связь)</h2>
        <div className="adm-row-2">
          <label className="adm-check">
            <input
              type="checkbox"
              checked={legal.consentSecondaryEnabled}
              onChange={(e) =>
                setLegal({
                  ...legal,
                  consentSecondaryEnabled: e.target.checked,
                })
              }
            />
            <span>Показывать вторую галочку согласия в форме заявки</span>
          </label>
          <label className="adm-check">
            <input
              type="checkbox"
              checked={legal.consentSecondaryRequired}
              onChange={(e) =>
                setLegal({
                  ...legal,
                  consentSecondaryRequired: e.target.checked,
                })
              }
            />
            <span>Сделать вторую галочку обязательной для отправки формы</span>
          </label>
        </div>
        <label className="adm-field">
          <span>Текст рядом с чекбоксом №2 в форме заявки</span>
          <input
            type="text"
            value={legal.consentSecondaryLabel}
            onChange={(e) =>
              setLegal({ ...legal, consentSecondaryLabel: e.target.value })
            }
          />
        </label>
        <label className="adm-field">
          <span>Заголовок документа Согласия №2</span>
          <input
            type="text"
            value={legal.consentSecondaryTitle}
            onChange={(e) =>
              setLegal({ ...legal, consentSecondaryTitle: e.target.value })
            }
          />
        </label>
        <label className="adm-field">
          <span>Полный текст Согласия №2</span>
          <textarea
            rows={7}
            value={legal.consentSecondaryBody}
            onChange={(e) =>
              setLegal({ ...legal, consentSecondaryBody: e.target.value })
            }
          />
        </label>
      </section>

      <section className="adm-card">
        <h2>5. Политика файлов Cookie и всплывающая плашка</h2>
        <label className="adm-check">
          <input
            type="checkbox"
            checked={legal.cookieBannerEnabled}
            onChange={(e) =>
              setLegal({ ...legal, cookieBannerEnabled: e.target.checked })
            }
          />
          <span>Показывать плашку уведомления о файлах Cookie новым посетителям</span>
        </label>
        <label className="adm-field">
          <span>Текст на плашке Cookie-уведомления</span>
          <input
            type="text"
            value={legal.cookieBannerText}
            onChange={(e) =>
              setLegal({ ...legal, cookieBannerText: e.target.value })
            }
          />
        </label>
        <label className="adm-field">
          <span>Заголовок Политики Cookie</span>
          <input
            type="text"
            value={legal.cookieTitle}
            onChange={(e) =>
              setLegal({ ...legal, cookieTitle: e.target.value })
            }
          />
        </label>
        <label className="adm-field">
          <span>Полный текст Политики Cookie</span>
          <textarea
            rows={7}
            value={legal.cookieBody}
            onChange={(e) =>
              setLegal({ ...legal, cookieBody: e.target.value })
            }
          />
        </label>
      </section>
    </div>
  );
}