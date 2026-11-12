"use client";
import {HeroButton, HeroLink, HeroDialog} from "@/components/HeroPrimitives";
import {useEffect,useRef,useState} from "react";
import {BookingButton} from "./BookingButton";
import {SocialLinks} from "./SocialLinks";
import {CityButton} from "./CityProvider";
import styles from "./Header.module.css";
import {Arrow} from "./Arrow";
const items=[{label:"Услуги",href:"#services"},{label:"Модели",href:"#models"},{label:"О компании",href:"#about"},{label:"Тарифы",href:"#formats"},{label:"Вопросы",href:"#faq"},{label:"Контакты",href:"#contacts"}];
export function Header({bookingHref,bookingLabel="Оставить заявку"}:{bookingHref?:string;bookingLabel?:string}={}){
  const header=useRef<HTMLElement>(null),menu=useRef<HTMLDialogElement>(null),toggle=useRef<HTMLButtonElement>(null);
  const [expanded,setExpanded]=useState(false);
  useEffect(()=>{const observer=new ResizeObserver(()=>{if(header.current)document.documentElement.style.setProperty("--header-offset",`${header.current.getBoundingClientRect().height/parseFloat(getComputedStyle(document.documentElement).fontSize)}rem`);});if(header.current)observer.observe(header.current);return()=>observer.disconnect();},[]);
  const close=()=>menu.current?.close();
  return <>
    <header className={`header ${styles.root}`} ref={header}><div className={`wrap ${styles.inner}`} data-header-layout><HeroLink className="skip-link" href={bookingHref?"#model-main":"#home"}>Перейти к содержимому</HeroLink><HeroLink className={`brand ${styles.brand}`} data-header-part="brand" href={bookingHref?"/#home":"#home"} aria-label="Geeapp — на главную">geeapp<span className="brand-dot" aria-hidden="true"/></HeroLink><div className={styles.city} data-header-part="city"><CityButton/></div><nav className={`desktop-nav ${styles.nav}`} data-header-part="nav" aria-label="Основная навигация">{items.filter(i=>!["#formats","#contacts"].includes(i.href)).map(i=><HeroLink key={i.href} className="nav-link" href={bookingHref?"/"+i.href:i.href}>{i.label}</HeroLink>)}</nav><div className={styles.action} data-header-part="action">{bookingHref?<HeroLink className="button btn btn--primary" href={bookingHref}>{bookingLabel} <Arrow/></HeroLink>:<BookingButton className="button btn btn--primary">Оставить заявку <Arrow/></BookingButton>}</div><div className={`header-contacts ${styles.contacts}`} data-header-part="contacts"><HeroLink className="header-phone" href="tel:+79995811533">+7 (999) 581-15-33</HeroLink><SocialLinks className="header-socials social-links"/></div>
    <HeroButton className={`menu-toggle ${styles.toggle}`} data-header-part="menu" aria-label="Открыть меню" aria-expanded={expanded} aria-controls="mobile-nav" ref={toggle} onClick={()=>{menu.current?.showModal();setExpanded(true);menu.current?.querySelector<HTMLButtonElement>(".close-menu")?.focus();}}><span/><span/></HeroButton></div></header>
    <HeroDialog id="mobile-nav" className="mobile-nav" aria-labelledby="mobile-menu-title" ref={menu} onClose={()=>{setExpanded(false);toggle.current?.focus({preventScroll:true});}}><div className="mobile-menu-head"><h2 id="mobile-menu-title" className="brand">geeapp<span className="brand-dot" aria-hidden="true"/></h2><HeroButton className="close-modal close-menu" aria-label="Закрыть меню" onClick={close}>×</HeroButton></div><nav className="mobile-nav-links" aria-label="Мобильная навигация">{items.map(i=><HeroLink key={i.href} href={bookingHref?"/"+i.href:i.href} onClick={close}>{i.label}</HeroLink>)}</nav><div className="mobile-menu-foot"><HeroLink className="mobile-menu-phone" href="tel:+79995811533">+7 (999) 581-15-33</HeroLink><SocialLinks className="mobile-socials social-links"/><BookingButton className="button btn btn--primary" onClick={close}>Оставить заявку <Arrow/></BookingButton><p className="mobile-menu-note"><span data-city="">Челябинск</span> · На связи с 10:00 до 22:00</p></div></HeroDialog>
  </>;
}
