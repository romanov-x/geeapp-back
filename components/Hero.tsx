"use client";
import { useCity } from "./CityProvider";
import { BookingButton } from "./BookingButton";

export function Hero() {
  const { city, inCity, cityInfo } = useCity();

  return (
    <section
      className="hero hero--photo"
      data-enter=""
      aria-labelledby="hero-title"
    >
      <div className="wrap hero-body">
        <div className="hero-text">
          <p className="hero-kicker">
            <span data-city="">{city}</span> /{" "}
            {cityInfo.isHeadquarters
              ? "Сервис на Энтузиастов, 28а и онлайн-прошивка"
              : "Мастера-партнёры и онлайн-прошивка"}
          </p>
          <h1 id="hero-title" data-enter-whole="">
            Русификация, прошивка и установка приложений{" "}
            <span className="hero-title-gradient">
              для вашего авто {inCity}
            </span>
          </h1>
          <div
            className="hero-split-media"
            aria-label="Примеры интерфейсов мультимедиа"
          >
            <figure>
              <img
                src="/assets/hero-split/belgee.webp"
                alt="Навигация на экране Belgee"
                width="420"
                height="746"
                decoding="async"
              />
            </figure>
            <figure>
              <img
                src="/assets/hero-split/bmw.webp"
                alt="Приложения на экране BMW"
                width="420"
                height="746"
                decoding="async"
              />
            </figure>
            <figure>
              <img
                src="/assets/hero-split/exeed.webp"
                alt="Навигация на приборной панели Exeed"
                width="420"
                height="746"
                decoding="async"
              />
            </figure>
          </div>
          <div className="hero-bottom hero-benefits">
            <ul className="hero-stats" aria-label="Возможности GeeApp">
              <li>
                <strong>100+</strong>
                <span>моделей авто</span>
              </li>
              <li>
                <strong>25+</strong>
                <span>марок в каталоге</span>
              </li>
              <li>
                <strong>~1 час</strong>
                <span>на установку</span>
              </li>
            </ul>
            <div className="hero-benefits-action">
              <BookingButton className="button btn btn--primary" service="">
                Оставить заявку{" "}
                <svg className="m-arrow" viewBox="0 0 20 20" aria-hidden="true">
                  <path className="m-arrow__stem" d="M3 10h12"></path>
                  <path className="m-arrow__head" d="M10 5l5 5-5 5"></path>
                </svg>
              </BookingButton>
              <p>
                {cityInfo.isHeadquarters
                  ? "Проверим версию ГУ до визита в бокс или подключимся онлайн."
                  : `Администратор проверит версию ГУ и запишет к мастеру-партнёру ${inCity} или на онлайн-прошивку.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}