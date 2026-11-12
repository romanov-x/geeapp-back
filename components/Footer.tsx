"use client";
import { HeroLink } from "@/components/HeroPrimitives";
import { BookingButton } from "./BookingButton";
import { ContactChannels } from "./SocialLinks";
import { useCity } from "./CityProvider";

export function Footer() {
  const { inCity, cityInfo } = useCity();

  return (
    <footer className="footer closing" id="contacts">
      <div className="wrap footer-wrap">
        <div className="footer-close">
          <div className="footer-close-intro">
            <h2>Начнём с вашего автомобиля.</h2>
            <p className="footer-description">
              Укажите модель и задачу. Администратор проверит версию мультимедиа до записи и подберёт оптимальный формат работы {inCity}.
            </p>
            <BookingButton className="button btn btn--primary" service="">
              Оставить заявку{" "}
              <svg className="m-arrow" viewBox="0 0 20 20" aria-hidden="true">
                <path className="m-arrow__stem" d="M3 10h12"></path>
                <path className="m-arrow__head" d="M10 5l5 5-5 5"></path>
              </svg>
            </BookingButton>

            <div className="footer-visit">
              <h3>
                {cityInfo.isHeadquarters ? "Встречаемся " : "Работаем "}
                <span data-in-city="">{inCity}</span>
              </h3>
              {cityInfo.isHeadquarters ? (
                <p id="contact-details">
                  ул. Энтузиастов, 28а
                  <br />
                  На связи с 10:00 до 22:00.
                  <br />
                  Большая парковка. Также доступна дистанционная онлайн-прошивка.
                </p>
              ) : (
                <p id="contact-details">
                  Мастера-партнёры {inCity} и дистанционная онлайн-прошивка.
                  <br />
                  На связи ежедневно с 10:00 до 22:00.
                  <br />
                  Центральный сервис сети: г. Челябинск, ул. Энтузиастов, 28а.
                </p>
              )}
            </div>
          </div>

          {cityInfo.isHeadquarters ? (
            <div className="footer-map" aria-label="Как добраться до GeeApp">
              <iframe
                title="Яндекс Карта: Челябинск, улица Энтузиастов, 28а"
                src="https://yandex.ru/map-widget/v1/?ll=61.375919%2C55.150900&z=17&l=map&pt=61.375919%2C55.150900%2Cpm2rdm"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
              <div className="map-actions">
                <HeroLink
                  className="button btn btn--primary"
                  href="yandexnavi://build_route_on_map?lat_to=55.150900&lon_to=61.375919"
                  aria-label="Построить маршрут в Яндекс Навигаторе"
                >
                  Построить маршрут <span aria-hidden="true">↗</span>
                </HeroLink>
                <HeroLink
                  className="map-browser-link"
                  href="https://yandex.ru/maps/?rtext=~55.150900%2C61.375919&rtt=auto&z=16"
                  target="_blank"
                  rel="noopener"
                >
                  Открыть маршрут в браузере
                </HeroLink>
              </div>
            </div>
          ) : (
            <div
              className="footer-regional-card"
              aria-label={`Как записаться ${inCity}`}
            >
              <span className="format-badge">Формат работы {inCity}</span>
              <h3>Единое окно записи через администратора</h3>
              <ol className="footer-regional-steps">
                <li>
                  <strong>1. Оставляете заявку на сайте или в мессенджере</strong>
                  <span>Указываете марку, модель, год выпуска и желаемые услуги.</span>
                </li>
                <li>
                  <strong>2. Проверяем совместимость по версии ГУ</strong>
                  <span>Подтверждаем точный состав пакета и фиксируем стоимость до начала работ.</span>
                </li>
                <li>
                  <strong>3. Назначаем удобный формат {inCity}</strong>
                  <span>Передаём запись проверенному мастеру-партнёру в вашем городе или проводим онлайн-прошивку.</span>
                </li>
              </ol>
            </div>
          )}
        </div>

        <div className="footer-lower">
          <nav className="footer-navigation" aria-label="Навигация в подвале">
            <div>
              <h3>Услуги</h3>
              <HeroLink href="#services">Установка приложений</HeroLink>
              <HeroLink href="#russian">Русификация</HeroLink>
              <HeroLink href="#formats">Тарифы</HeroLink>
            </div>
            <div>
              <h3>Модели</h3>
              <HeroLink href="/brand/geely">Geely</HeroLink>
              <HeroLink href="/brand/haval">Haval</HeroLink>
              <HeroLink href="/brand/tank">Tank</HeroLink>
              <HeroLink href="/brand/toyota">Toyota</HeroLink>
              <HeroLink href="#models">Все марки</HeroLink>
            </div>
          </nav>
          <div className="footer-connection">
            <h3>Связаться с нами</h3>
            <div className="footer-direct">
              <HeroLink id="footer-phone" href="tel:+79995811533">
                +7 (999) 581-15-33
              </HeroLink>
              <HeroLink href="mailto:info@geeapp.ru">info@geeapp.ru</HeroLink>
            </div>
            <ContactChannels />
          </div>
        </div>

        <div className="footer-base">
          <HeroLink
            className="footer-wordmark"
            href="#home"
            aria-label="GeeApp — к началу страницы"
          >
            geeapp.
          </HeroLink>
          <div className="footer-legal">
            <HeroLink href="/privacy">О данных заявки</HeroLink>
            <span>Онлайн-форма сохраняет черновик</span>
            <p className="image-credit">
              Изображения салона созданы с помощью ИИ и не являются фотографиями выполненных работ.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}