import {Header} from "./Header";
import {HeroLink} from "@/components/HeroPrimitives";
import {Arrow} from "./Arrow";
export function DetailHeader(_props:{href:string;label?:string}){return <Header bookingHref={_props.href} bookingLabel={_props.label}/>;}
export function DetailFooter(){return <footer className="mini-footer"><div className="wrap mini-footer-inner"><HeroLink className="brand" href="/#home" aria-label="Geeapp — на главную">geeapp<span className="brand-dot" aria-hidden="true"/></HeroLink><p className="image-credit">Изображения салона созданы с помощью ИИ и не являются фотографиями выполненных работ.</p><HeroLink className="link" href="/privacy">О данных заявки</HeroLink></div></footer>;}
