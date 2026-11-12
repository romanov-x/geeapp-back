"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { BookingDialog } from "./BookingDialog";
import { type Vehicle } from "@/lib/data";
import { resolveModelParam } from "@/lib/catalog";

export type BookingOptions = {
  service?: string;
  manual?: boolean;
  car?: Vehicle;
};

type BookingContextValue = {
  open: (options?: BookingOptions) => void;
  close: () => void;
};

const BookingContext = createContext<BookingContextValue>({
  open: () => {},
  close: () => {},
});

export const useBooking = () => useContext(BookingContext);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState<{
    options: BookingOptions;
    revision: number;
  }>({ options: {}, revision: 0 });

  const show = useCallback((options: BookingOptions = {}) => {
    setRequest((previous) => ({ options, revision: previous.revision + 1 }));
    setOpen(true);
  }, []);

  useEffect(() => {
    const bookParam = new URLSearchParams(location.search).get("book");
    if (!bookParam) return;
    const resolved = resolveModelParam(bookParam);
    if (resolved && resolved.entry.supported) {
      const car = resolved.entry.primary;
      show({ service: car.service, car });
    }
  }, [show]);

  return (
    <BookingContext.Provider
      value={{ open: show, close: () => setOpen(false) }}
    >
      {children}
      <BookingDialog
        open={open}
        request={request}
        onClose={() => setOpen(false)}
      />
    </BookingContext.Provider>
  );
}