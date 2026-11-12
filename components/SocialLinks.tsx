import {HeroLink} from "@/components/HeroPrimitives";
import {asset,config} from "@/lib/data";
const channels=[{key:"whatsapp",label:"WhatsApp",short:"WA",icon:"wa-logo.svg"},{key:"max",label:"MAX",short:"MAX",icon:"max-logo.webp"},{key:"telegram",label:"Telegram",short:"TG",icon:"tg-logo.svg"},{key:"avito",label:"Авито",short:"Avito",icon:"avito-logo.svg"}];
export function SocialLinks({className}:{className:string}){
  return <div className={className} aria-label="Связаться с GeeApp">{channels.map(c=>{
    const url=config.channels[c.key],content=<><img src={asset(`assets/contacts/${c.icon}`)} alt="" width={28} height={28}/><span>{c.short}</span></>;
    return url?<HeroLink className="social-circle" key={c.key} href={url} target="_blank" rel="noopener noreferrer" aria-label={c.label}>{content}</HeroLink>:<span className="social-circle" key={c.key} aria-disabled="true" aria-label={`${c.label} — контакт ещё не подключён`}>{content}</span>;
  })}</div>;
}
export function ContactChannels(){return <div id="contact-channels" className="contact-channels" aria-label="Мессенджеры и Авито">{Object.entries(config.channels).filter(([,url])=>/^https:\/\//i.test(url)).map(([key,url])=>{const c=channels.find(c=>c.key===key);return <HeroLink key={key} className="contact-card" href={url} target="_blank" rel="noopener noreferrer"><img src={asset(`assets/contacts/${c?.icon}`)} alt="" width={40} height={40} loading="lazy"/><span>{c?.label||key}</span><span className="contact-card-arrow" aria-hidden="true">↗</span></HeroLink>;})}</div>;}
