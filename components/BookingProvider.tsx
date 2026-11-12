"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { BookingDialog } from "./BookingDialog";
import {vehicles, type Vehicle} from "@/lib/data";

export type BookingOptions={service?:string;manual?:boolean;car?:Vehicle};

type BookingContextValue = {
  open: (options?:BookingOptions) => void;
  close: () => void;
};

const BookingContext = createContext<BookingContextValue>({
  open: () => {},
  close: () => {},
});

export const useBooking = () => useContext(BookingContext);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [request,setRequest]=useState<{options:BookingOptions;revision:number}>({options:{},revision:0});
  const show=useCallback((options:BookingOptions={})=>{setRequest(previous=>({options,revision:previous.revision+1}));setOpen(true);},[]);
  useEffect(()=>{const id=new URLSearchParams(location.search).get("book"),car=vehicles.find(v=>v.id===id&&v.supported!==false);if(car)show({service:car.service,car});},[show]);
  return (
    <BookingContext.Provider
      value={{ open: show, close: () => setOpen(false) }}
    >
      {children}
      <BookingDialog open={open} request={request} onClose={() => setOpen(false)} />
    </BookingContext.Provider>
  );
}
