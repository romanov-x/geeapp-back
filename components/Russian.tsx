import { BookingButton } from "./BookingButton";
import { RussianTable } from "./RussianTable";

// Markup and class names follow the reviewed Vanilla B source.
export function Russian() {

  return (
<section className="section russian-section" id="russian" aria-labelledby="russian-title"><div className="wrap russian-layout">
    <div className="russian-intro"><p className="kicker">Русификация</p><h2 id="russian-title">Русский язык на мультимедиа и приборной панели.</h2><p className="section-lead">Русифицируем автомобили для внутреннего рынка Китая, Кореи, Японии и США. Список моделей постоянно пополняется — если вашей нет, напишите, проверим возможность.</p><BookingButton className="button btn btn--primary" service="" manual>Узнать про мою модель <svg className="m-arrow" viewBox="0 0 20 20" aria-hidden="true"><path className="m-arrow__stem" d="M3 10h12"></path><path className="m-arrow__head" d="M10 5l5 5-5 5"></path></svg></BookingButton></div>
    <RussianTable />
  </div></section>
  );
}
