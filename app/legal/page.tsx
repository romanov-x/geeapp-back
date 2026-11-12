import type { Metadata } from "next";
import { DetailFooter, DetailHeader } from "@/components/DetailChrome";
import { HeroLink } from "@/components/HeroPrimitives";
import { getCmsData } from "@/lib/cms-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Юридическая информация, реквизиты и обработка персональных данных — GeeApp",
  description:
    "Полные юридические реквизиты оператора, Политика обработки персональных данных (152-ФЗ), согласия субъекта ПДн и правила использования файлов Cookie.",
};

function renderParagraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, idx) => (
      <p key={idx} style={{ whiteSpace: "pre-line" }}>
        {block}
      </p>
    ));
}

export default function LegalPage() {
  const { legal } = getCmsData();

  return (
    <>
      <DetailHeader href="/#home" label="На главную" />
      <main id="model-main" className="model-page">
        <div className="wrap">
          <nav className="seo-breadcrumbs" aria-label="Хлебные крошки">
            <HeroLink href="/">Главная</HeroLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Юридическая информация</span>
          </nav>

          <p className="kicker">Документы и реквизиты · Редакция от {legal.updatedDate}</p>
          <h1>Юридическая информация</h1>

          <div className="sibling-pills" style={{ marginTop: "1.25rem", marginBottom: "2.5rem" }}>
            <a className="strip-pill" href="#requisites">Реквизиты оператора</a>
            <a className="strip-pill" href="#privacy">Политика ПДн (152-ФЗ)</a>
            <a className="strip-pill" href="#consent-1">Согласие №1 (Обработка заявки)</a>
            {legal.consentSecondaryEnabled && (
              <a className="strip-pill" href="#consent-2">Согласие №2 (Партнёры и связь)</a>
            )}
            <a className="strip-pill" href="#cookies">Политика файлов Cookie</a>
          </div>

          <div className="legal-docs-stack">
            <section id="requisites" className="model-package-card">
              <h2>Реквизиты Оператора</h2>
              <dl className="legal-req-grid">
                <div>
                  <dt>Наименование</dt>
                  <dd>{legal.companyFullName}</dd>
                </div>
                <div>
                  <dt>ИНН</dt>
                  <dd>{legal.inn}</dd>
                </div>
                <div>
                  <dt>ОГРНИП / ОГРН</dt>
                  <dd>{legal.ogrnip}</dd>
                </div>
                <div>
                  <dt>Адрес регистрации</dt>
                  <dd>{legal.legalAddress}</dd>
                </div>
                <div>
                  <dt>Адрес центрального сервиса</dt>
                  <dd>{legal.serviceAddress}</dd>
                </div>
                <div>
                  <dt>Контакты для обращений по ПДн</dt>
                  <dd>
                    <a href={`mailto:${legal.dpoEmail}`}>{legal.dpoEmail}</a> ·{" "}
                    <a href={`tel:${legal.phone}`}>{legal.phone}</a>
                  </dd>
                </div>
                {legal.bankDetails && (
                  <div>
                    <dt>Дополнительные реквизиты</dt>
                    <dd style={{ whiteSpace: "pre-line" }}>{legal.bankDetails}</dd>
                  </div>
                )}
              </dl>
            </section>

            <section id="privacy" className="model-package-card legal-prose">
              <h2>{legal.privacyTitle}</h2>
              {renderParagraphs(legal.privacyBody)}
            </section>

            <section id="consent-1" className="model-package-card legal-prose">
              <h2>{legal.consentPrimaryTitle}</h2>
              {renderParagraphs(legal.consentPrimaryBody)}
            </section>

            {legal.consentSecondaryEnabled && (
              <section id="consent-2" className="model-package-card legal-prose">
                <h2>{legal.consentSecondaryTitle}</h2>
                {renderParagraphs(legal.consentSecondaryBody)}
              </section>
            )}

            <section id="cookies" className="model-package-card legal-prose">
              <h2>{legal.cookieTitle}</h2>
              {renderParagraphs(legal.cookieBody)}
            </section>
          </div>
        </div>
      </main>
      <DetailFooter />
    </>
  );
}