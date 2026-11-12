"use client";
import {createContext,useContext,useEffect,useState} from "react";
import {Button,Input,Modal,ModalContent,ModalHeader,ModalBody} from "@heroui/react";

// Rosstat, 2026 publication catalogue, table 16054 (2025 reference year):
// https://61.rosstat.gov.ru/storage/mediabank/Каталог%202026(6).pdf
export const cities=["Волгоград","Воронеж","Екатеринбург","Казань","Краснодар","Красноярск","Москва","Нижний Новгород","Новосибирск","Омск","Пермь","Ростов-на-Дону","Самара","Санкт-Петербург","Уфа","Челябинск"];
const Context=createContext({city:"Челябинск",choose:()=>{}});
export const useCity=()=>useContext(Context);
export function CityLabel(){return <>{useCity().city}</>;}
export function CityButton(){const {city,choose}=useCity();return <Button variant="light" radius="full" className="city-button" title={city} onPress={choose} aria-label={`Выбрать город. Сейчас ${city}`}><span className="city-dot"/><span className="city-name">{city}</span><span aria-hidden="true">⌄</span></Button>;}
export function CityProvider({children}:{children:React.ReactNode}){
 const [city,setCity]=useState("Челябинск"),[open,setOpen]=useState(false),[search,setSearch]=useState("");
 useEffect(()=>{try{const saved=localStorage.getItem("geeapp-city");if(saved&&cities.includes(saved))setCity(saved);}catch{}},[]);
 function select(name:string){setCity(name);try{localStorage.setItem("geeapp-city",name);}catch{}setOpen(false);}
 return <Context.Provider value={{city,choose:()=>{setSearch("");setOpen(true);}}}>{children}<Modal isOpen={open} onClose={()=>setOpen(false)} scrollBehavior="inside" size="2xl" placement="center" classNames={{base:"city-modal"}}><ModalContent><ModalHeader>Выберите город</ModalHeader><ModalBody className="pb-6"><Input aria-label="Поиск города" placeholder="Найти город" value={search} onValueChange={setSearch} isClearable onClear={()=>setSearch("")} variant="bordered"/><div className="city-grid">{cities.filter(name=>name.toLowerCase().includes(search.toLowerCase().trim())).map(name=><Button key={name} variant={city===name?"solid":"flat"} color={city===name?"primary":"default"} onPress={()=>select(name)} aria-pressed={city===name}>{name}</Button>)}</div>{!cities.some(name=>name.toLowerCase().includes(search.toLowerCase().trim()))&&<p>Город не найден.</p>}<p className="city-note">Выбранный город добавим в черновик заявки. Сервис находится в Челябинске; возможность работы в другом городе уточним отдельно.</p></ModalBody></ModalContent></Modal></Context.Provider>;
}
