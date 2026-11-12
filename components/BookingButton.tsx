"use client";
import { HeroButton } from "@/components/HeroPrimitives";
import { type ButtonHTMLAttributes } from "react";
import { type Vehicle } from "@/lib/data";
import { useBooking } from "./BookingProvider";

export function BookingButton({
  service,
  manual,
  car,
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  service?: string;
  manual?: boolean;
  car?: Vehicle;
}) {
  const { open } = useBooking();
  return (
    <HeroButton
      type="button"
      {...props}
      onClick={(event) => {
        onClick?.(event);
        open({ service, manual, car });
      }}
    />
  );
}