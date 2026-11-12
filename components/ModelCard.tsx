"use client";
import {HeroLink, HeroCard, HeroChip} from "@/components/HeroPrimitives";
import {asset,money,restrictionFor,vehicleImages,type Vehicle} from "@/lib/data";
import {Arrow} from "./Arrow";
export function ModelCard({car,rus,hidden=false}:{car:Vehicle|null;rus:Vehicle|null;hidden?:boolean}){
  const model=(car||rus)!,supported=!car||car.supported!==false,photo=vehicleImages[model.id];
  const title=model.name.toLowerCase().startsWith(model.make.toLowerCase()+" ")?model.name:`${model.make} ${model.name}`;
  const note=car?.needsCompatibility?"Доступные услуги и стоимость подтвердим после проверки.":car&&car.supported===false?"Haval M6 не прошиваем.":car&&rus&&car.price?"Русификация — по запросу.":restrictionFor(model);
  return <HeroCard className={`model-card${supported?"":" model-card--unsupported"}`} hidden={hidden}><div className="vehicle-photo"><img src={asset(photo||"assets/car-placeholder.svg")} alt={photo?`${model.make} ${model.name}`:"Место для фотографии автомобиля"} width={640} height={320} loading="lazy" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src="/assets/car-placeholder.svg";e.currentTarget.alt="Место для фотографии автомобиля";}}/></div><h3>{title}</h3><div className="chips">{car?.service==="apps"&&<><HeroChip className="chip chip--primary">Установка приложений</HeroChip><HeroChip className="chip">Прошивка</HeroChip></>}{car?.needsCompatibility&&<HeroChip className="chip">Совместимость уточняется</HeroChip>}{rus&&<HeroChip className="chip">Русификация</HeroChip>}{!supported&&<HeroChip className="chip">Не обслуживается</HeroChip>}</div><p className="model-price">{!supported?"—":car?.price?money(car.price):"По запросу"}</p><p className="model-note">{note}</p><HeroLink className="button btn btn--primary model-link" href={`/model/${model.id}`}><span>Страница модели</span><Arrow/></HeroLink></HeroCard>;
}
