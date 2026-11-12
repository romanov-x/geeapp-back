"use client";
import {HeroButton} from "@/components/HeroPrimitives";
import {type ButtonHTMLAttributes} from "react";
import {useBooking} from "./BookingProvider";
export function BookingButton({service,manual,onClick,...props}:ButtonHTMLAttributes<HTMLButtonElement>&{service?:string;manual?:boolean}){
  const {open}=useBooking();
  return <HeroButton type="button" {...props} onClick={event=>{onClick?.(event);open({service,manual});}}/>;
}
