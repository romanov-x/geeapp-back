"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// One entrance per heading. Content stays visible if JS or motion is unavailable.
export function SiteMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const easing = getComputedStyle(document.documentElement).getPropertyValue("--ease-out").trim();
    const elements = document.querySelectorAll<HTMLElement>(
      "main .section-heading, main .about-title, main .faq-intro, main .model-hero > div:first-child"
    );
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches) continue;
        const animation = entry.target.animate(
          [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 300, easing }
        );
        animations.add(animation);
        void animation.finished.then(() => animations.delete(animation)).catch(() => {});
      }
    }, { threshold: .15 });
    elements.forEach((element) => observer.observe(element));
    const cancel = () => { if (preference.matches) animations.forEach((animation) => animation.cancel()); };
    preference.addEventListener("change", cancel);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", cancel);
      animations.forEach((animation) => animation.cancel());
    };
  }, [pathname]);
  return null;
}
