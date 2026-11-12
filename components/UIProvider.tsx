"use client";
import { HeroUIProvider } from "@heroui/react";
import { MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";
import { SiteMotion } from "./SiteMotion";

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [reduce, setReduce] = useState(true);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <HeroUIProvider disableAnimation={reduce}>
        {children}
        <SiteMotion />
      </HeroUIProvider>
    </MotionConfig>
  );
}
