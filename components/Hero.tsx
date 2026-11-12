import {CityLabel} from "./CityProvider";
import { BookingButton } from "./BookingButton";

// Markup and class names follow the reviewed Vanilla B source.
export function Hero() {

  return (
<section className="hero hero--photo" data-enter="" aria-labelledby="hero-title">
    <div className="hero-visual">
      <img src="/assets/hero-premium.webp" srcSet="/assets/hero-premium-small.webp 900w, /assets/hero-premium.webp 1672w" sizes="(max-width: 639px) calc(100vw - 16px), 100vw" width="1672" height="941" alt="Иллюстрация салона автомобиля с навигацией на штатном экране" fetchPriority="high" decoding="async" />
    </div>
    <div className="wrap hero-body"><div className="hero-text"><p className="hero-kicker"><span data-city=""><CityLabel/></span> / Настройка мультимедиа</p>
      <h1 id="hero-title" data-enter-whole="">Русификация, прошивка и установка приложений <span className="hero-title-gradient">для вашего авто</span></h1>
      <div className="hero-split-media" aria-label="Примеры интерфейсов мультимедиа"><figure><img src="/assets/hero-split/belgee.webp" alt="Навигация на экране Belgee" width="420" height="746" decoding="async" /></figure><figure><img src="/assets/hero-split/bmw.webp" alt="Приложения на экране BMW" width="420" height="746" decoding="async" /></figure><figure><img src="/assets/hero-split/exeed.webp" alt="Навигация на приборной панели Exeed" width="420" height="746" decoding="async" /></figure></div><div className="hero-bottom hero-benefits"><ul className="hero-stats" aria-label="Возможности GeeApp"><li><strong>50+</strong><span>моделей авто</span></li><li><strong>20+</strong><span>марок автомобилей</span></li><li><strong>~1 час</strong><span>на установку</span></li></ul><div className="hero-benefits-action"><BookingButton className="button btn btn--primary" service="">Подготовить заявку <svg className="m-arrow" viewBox="0 0 20 20" aria-hidden="true"><path className="m-arrow__stem" d="M3 10h12"></path><path className="m-arrow__head" d="M10 5l5 5-5 5"></path></svg></BookingButton><p>Возможности и стоимость уточним до работ.</p></div></div>
    </div></div>
  </section>
  );
}
