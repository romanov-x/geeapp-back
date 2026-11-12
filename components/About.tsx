import { WorksCarousel } from "./WorksCarousel";

// Markup and class names follow the reviewed Vanilla B source.
export function About() {

  return (
<section className="section about-section" id="about" aria-labelledby="about-title"><div className="wrap">
    <h2 id="about-title" className="about-title">Два года настраиваем автомобильное мультимедиа.</h2>
    <p className="about-lead">Ставим приложения на штатные экраны, русифицируем мультимедиа и приборные панели, подбираем прошивку под модель. Работаем поверх штатной системы — файлы прошивки не меняем, всё можно вернуть к заводскому состоянию.</p>
    <ul className="about-facts">
      <li><strong>2 года</strong><span>настраиваем автомобильное мультимедиа</span></li>
      <li><strong>Поверх штатной системы</strong><span>файлы прошивки не меняем</span></li>
      <li><strong>В пару действий</strong><span>возврат к заводскому состоянию</span></li>
    </ul>
    <div className="works-head"><h3>Выполненные работы</h3><span>листайте</span></div>
    <WorksCarousel />
    
    <p className="fine-print">Фото — иллюстрации, не фотографии выполненных работ; описания — примеры оформления. Заменим на реальные работы по мере появления.</p>
  </div></section>
  );
}
