import {HeroLink, HeroChip} from "@/components/HeroPrimitives";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {asset,money,restrictionFor,vehicleImages,vehicles} from "@/lib/data";
import {Arrow} from "@/components/Arrow";
import {DetailHeader,DetailFooter} from "@/components/DetailChrome";
type Props={params:Promise<{id:string}>};
export function generateStaticParams(){return vehicles.map(car=>({id:car.id}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {id}=await params,car=vehicles.find(v=>v.id===id);return {title:car?`${car.make} ${car.name} — Geeapp`:"Модель — Geeapp"};}
export default async function Page({params}:Props){
  const {id}=await params,car=vehicles.find(v=>v.id===id);if(!car)notFound();
  const href=car.supported!==false?`/?book=${encodeURIComponent(car.id)}#home`:"/#models",photo=vehicleImages[car.id];
  const note=car.needsCompatibility?"Модель добавлена по фотографии. Доступность услуг и стоимость требуют проверки.":car.name==="Monjaro Rest 2025"?"Пакет русификации и приложений. Только для автомобилей, выпущенных до марта 2025 года.":restrictionFor(car)||(car.supported===false?"Haval M6 не прошиваем.":car.service==="russian"?"Цена русификации — по запросу. Объём работ подтвердим после проверки.":"");
  return <><DetailHeader href={href}/><main id="model-main" className="model-page"><div className="wrap"><HeroLink className="text-link back-link" href="/#models">Все марки</HeroLink><div className="model-hero" id="model-hero"><div><p className="kicker" id="model-make">{car.make}</p><h1 id="model-name">{car.name}</h1><div className="chips" id="model-chips">{car.service==="apps"&&<><HeroChip className="chip">Установка приложений</HeroChip><HeroChip className="chip">Прошивка</HeroChip></>}{car.service==="russian"&&<HeroChip className="chip">Русификация</HeroChip>}{car.supported===false&&<HeroChip className="chip">Не обслуживается</HeroChip>}{car.needsCompatibility&&<HeroChip className="chip">Совместимость уточняется</HeroChip>}</div><p className="model-price" id="model-price">{car.supported===false?"—":car.price?money(car.price):"По запросу"}</p><p className="catalog-restriction" id="model-restriction" hidden={!note}>{note}</p><HeroLink className="button btn btn--primary" id="model-cta" href={href}>Подготовить заявку <Arrow/></HeroLink><p className="fine-print model-fine">Совместимость и состав работ подтверждаем перед записью. Цена относится к указанному пакету. Выезд оплачивается отдельно.</p></div><div className="vehicle-photo model-photo"><img id="model-photo" src={asset(photo||"assets/car-placeholder.svg")} alt={photo?`${car.make} ${car.name}`:"Место для фотографии автомобиля"} width={640} height={320}/></div></div><section className="model-detail" id="model-detail"><h2 id="model-detail-title">{car.service==="apps"?"Состав пакета":"О работе"}</h2><p id="model-detail-text">{car.source}</p></section></div></main><DetailFooter/></>;
}
