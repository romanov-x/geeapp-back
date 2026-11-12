import {HeroCard} from "@/components/HeroPrimitives";
import { BookingButton } from "./BookingButton";

// Markup and class names follow the reviewed Vanilla B source.
export function Formats() {

  return (
<section className="section formats-section" id="formats" aria-labelledby="formats-title"><div className="wrap">
    <div className="section-heading"><div><p className="kicker">Тарифы</p><h2 id="formats-title">Выберите услугу.</h2><p>Выберите задачу для вашей мультимедиа. Состав пакета и стоимость подтвердим после проверки модели.</p></div></div>
    <div className="format-cards">
      <HeroCard className="format-card"><h3 className="format-name">Прошивка</h3><p className="format-desc">Изменения и настройки под вашу версию мультимедиа.</p><p className="format-price">По запросу</p><ul className="format-list"><li>Проверим текущую версию ПО</li><li>Подберём доступное решение</li><li>Согласуем изменения до работ</li></ul><BookingButton className="button btn btn--secondary" service="firmware">Обсудить прошивку</BookingButton></HeroCard>
      <HeroCard className="format-card format-card--featured"><span className="format-badge">Рекомендуем</span><h3 className="format-name">Установка приложений</h3><p className="format-desc">Навигация, музыка и другие приложения на штатном экране.</p><p className="format-price">от 8 000 ₽</p><ul className="format-list"><li>Пакет под вашу модель</li><li>Установка и настройка мастером</li><li>Проверяем результат вместе</li><li>Покажем, как пользоваться</li></ul><BookingButton className="button btn btn--primary" service="apps">Оставить заявку</BookingButton></HeroCard>
      <HeroCard className="format-card"><h3 className="format-name">Русификация</h3><p className="format-desc">Мультимедиа и приборная панель — где поддерживается.</p><p className="format-price">По запросу</p><ul className="format-list"><li>Перевод интерфейса мультимедиа</li><li>Приборная панель — где поддерживается</li><li>Проверим возможность для вашей модели</li></ul><BookingButton className="button btn btn--secondary" service="russian">Обсудить русификацию</BookingButton></HeroCard>
    </div>
    <p className="fine-print">Итоговая стоимость зависит от модели автомобиля и подтверждается до начала работ.</p>
  </div></section>
  );
}
