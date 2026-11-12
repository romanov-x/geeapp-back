"use client";
import { useEffect, useState } from "react";
import { HeroButton, HeroLink } from "./HeroPrimitives";
import { useCms } from "./CmsProvider";

const STORAGE_KEY = "geeapp-cookie-accepted";

export function CookieBanner() {
  const { legal } = useCms();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!legal.cookieBannerEnabled) return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, [legal.cookieBannerEnabled]);

  if (!visible || !legal.cookieBannerEnabled) return null;

  return (
    <aside className="cookie-banner" aria-label="Уведомление об использовании Cookie">
      <p>
        {legal.cookieBannerText}{" "}
        <HeroLink href="/legal#cookies" className="text-link">
          Подробнее о Cookie
        </HeroLink>
      </p>
      <HeroButton
        type="button"
        className="button btn btn--primary cookie-accept-btn"
        onClick={() => {
          try {
            localStorage.setItem(STORAGE_KEY, "1");
          } catch {}
          setVisible(false);
        }}
      >
        Понятно
      </HeroButton>
    </aside>
  );
}