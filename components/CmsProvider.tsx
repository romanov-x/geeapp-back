"use client";
import { createContext, useContext } from "react";
import type { CmsData } from "@/lib/cms-types";

const CmsContext = createContext<CmsData | null>(null);

export function CmsProvider({
  data,
  children,
}: {
  data: CmsData;
  children: React.ReactNode;
}) {
  return <CmsContext.Provider value={data}>{children}</CmsContext.Provider>;
}

export function useCms(): CmsData {
  const ctx = useContext(CmsContext);
  if (!ctx) {
    throw new Error("useCms must be used within CmsProvider");
  }
  return ctx;
}