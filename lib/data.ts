import raw from "./data.json";
export type Vehicle = {id:string;service:string;make:string;name:string;price?:number|null;supported?:boolean;source?:string;original?:string;needsModel?:boolean;needsCompatibility?:boolean};
export type Work = {car:string;img:string;video?:string;done:string};
export type Service = {id:string;title:string;summary:string;detail:string;price?:string|null};
export type SiteConfig = {brand:string;defaultCity:string;cities:Record<string,{name:string;inName:string;subdomain?:string}>;vehicleImages:Record<string,string>;brandLogos:Record<string,string>;services:Service[];channels:Record<string,string>;phone:string;address:string;hours:string};
export const data=raw as unknown as {vehicles:Vehicle[];config:SiteConfig;works:Work[]};
export const {vehicles,works,config}=data;
export const vehicleImages=config.vehicleImages, services=config.services, brandLogos=config.brandLogos;
export const asset=(path:string)=>path.startsWith("assets/")?"/"+path:path;
export const money=(value:number)=>new Intl.NumberFormat("ru-RU").format(value)+" ₽";
export const baseName=(name:string)=>name.split("(")[0].trim().toLowerCase();
export const sameModel=(a:string,b:string)=>{const x=baseName(a),y=baseName(b);return x===y||x.startsWith(y)||y.startsWith(x);};
export const brandLogo=(make:string)=>config.brandLogos[make];
export const monogram=(make:string)=>make.replace(/[^A-Za-zА-Яа-я0-9]/g,"").slice(0,2).toUpperCase();
export function orderedMakes():string[]{
  const apps=vehicles.filter(c=>c.service==="apps");
  const first=[...new Set(apps.map(c=>c.make))].sort((a,b)=>apps.filter(c=>c.make===b).length-apps.filter(c=>c.make===a).length);
  const russian=[...new Set(vehicles.filter(c=>c.service==="russian").map(c=>c.make))].filter(m=>!first.includes(m)).sort();
  const inquiry=[...new Set(vehicles.filter(c=>c.service==="inquiry").map(c=>c.make))].filter(m=>!first.includes(m)&&!russian.includes(m)).sort();
  return [...first,...russian,...inquiry];
}
export function restrictionFor(car:Vehicle):string{
  if(car.name==="Monjaro Rest 2025")return "Только автомобили, выпущенные до марта 2025 года.";
  if(car.make==="Haval"&&car.name==="Jolion")return "Открытие DTS: дополнительно 1 000 ₽.";
  if(/Atlas Pro|Coolray|X50 \(1|Android Auto/.test(car.name))return "Пакет с Android Auto. Яндекс Навигатор непосредственно на устройстве может работать медленно.";
  return "";
}
export function modelEntries(make:string){
  const entries=vehicles.filter(c=>c.make===make),apps=entries.filter(c=>c.service==="apps"),russian=entries.filter(c=>c.service==="russian");
  const cards:{car:Vehicle|null;rus:Vehicle|null}[]=apps.map(car=>({car,rus:russian.find(r=>sameModel(car.name,r.name))||null}));
  russian.filter(r=>!apps.some(c=>sameModel(c.name,r.name))).forEach(rus=>cards.push({car:null,rus}));
  entries.filter(c=>c.service==="inquiry").forEach(car=>cards.push({car,rus:null}));return cards;
}
