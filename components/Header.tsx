"use client";
import { Modal, ModalContent, ModalHeader } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { HeroButton, HeroLink } from "@/components/HeroPrimitives";
import { BookingButton } from "./BookingButton";
import { SocialLinks } from "./SocialLinks";
import { CityButton, CityLabel } from "./CityProvider";
import styles from "./Header.module.css";
import { Arrow } from "./Arrow";

const items = [
  { label: "РЈСЃР»СѓРіРё", href: "#services" },
  { label: "РњРѕРґРµР»Рё", href: "#models" },
  { label: "Рћ РєРѕРјРїР°РЅРёРё", href: "#about" },
  { label: "РўР°СЂРёС„С‹", href: "#formats" },
  { label: "Р’РѕРїСЂРѕСЃС‹", href: "#faq" },
  { label: "РљРѕРЅС‚Р°РєС‚С‹", href: "#contacts" },
];

export function Header({
  bookingHref,
  bookingLabel = "РћСЃС‚Р°РІРёС‚СЊ Р·Р°СЏРІРєСѓ",
}: {
  bookingHref?: string;
  bookingLabel?: string;
} = {}) {
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [darkUnderlay, setDarkUnderlay] = useState(false);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const bounds = header.current?.getBoundingClientRect();
      if (!bounds) return;
      const midpoint = (bounds.top + bounds.bottom) / 2;
      setDarkUnderlay(Array.from(document.querySelectorAll(".russian-section, .footer, .mini-footer")).some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= midpoint && rect.bottom >= midpoint;
      }));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (header.current) {
        const rem =
          header.current.getBoundingClientRect().height /
          parseFloat(getComputedStyle(document.documentElement).fontSize);
        document.documentElement.style.setProperty("--header-offset", `${rem}rem`);
      }
    });
    if (header.current) observer.observe(header.current);
    return () => observer.disconnect();
  }, []);

  const close = () => {
    setExpanded(false);
    requestAnimationFrame(() => toggle.current?.focus({ preventScroll: true }));
  };

  return (
    <>
      <header className={`header ${styles.root}`} ref={header} data-tone={darkUnderlay ? "dark" : "light"}>
        <div className={`wrap ${styles.inner}`} data-header-layout>
          <HeroLink
            className="skip-link"
            href={bookingHref ? "#model-main" : "#home"}
          >
            РџРµСЂРµР№С‚Рё Рє СЃРѕРґРµСЂР¶РёРјРѕРјСѓ
          </HeroLink>

          <HeroLink
            className={`brand ${styles.brand}`}
            data-header-part="brand"
            href={bookingHref ? "/#home" : "#home"}
            aria-label="GeeApp вЂ” РЅР° РіР»Р°РІРЅСѓСЋ"
          >
            geeapp
            <span className="brand-dot" aria-hidden="true" />
          </HeroLink>

          <div className={styles.city} data-header-part="city">
            <CityButton />
          </div>

          <nav
            className={`desktop-nav ${styles.nav}`}
            data-header-part="nav"
            aria-label="РћСЃРЅРѕРІРЅР°СЏ РЅР°РІРёРіР°С†РёСЏ"
          >
            {items
              .filter((i) => !["#formats", "#contacts"].includes(i.href))
              .map((i) => (
                <HeroLink
                  key={i.href}
                  className="nav-link"
                  href={bookingHref ? "/" + i.href : i.href}
                >
                  {i.label}
                </HeroLink>
              ))}
          </nav>

          <div className={styles.action} data-header-part="action">
            {bookingHref ? (
              <HeroLink
                className="button btn btn--primary"
                href={bookingHref}
              >
                {bookingLabel} <Arrow />
              </HeroLink>
            ) : (
              <BookingButton className="button btn btn--primary">
                РћСЃС‚Р°РІРёС‚СЊ Р·Р°СЏРІРєСѓ <Arrow />
              </BookingButton>
            )}
          </div>

          <div
            className={`header-contacts ${styles.contacts}`}
            data-header-part="contacts"
          >
            <HeroLink className="header-phone" href="tel:+79995811533">
              +7 (999) 581-15-33
            </HeroLink>
            <SocialLinks className="header-socials social-links" />
          </div>

          <div className={styles.mobileActions}>
            <HeroLink
              className={styles.quickCall}
              href="tel:+79995811533"
              aria-label="РџРѕР·РІРѕРЅРёС‚СЊ +7 (999) 581-15-33"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </HeroLink>

            <HeroButton
              className={`menu-toggle ${styles.toggle}`}
              data-header-part="menu"
              aria-label="РћС‚РєСЂС‹С‚СЊ РјРµРЅСЋ"
              aria-expanded={expanded}
              aria-controls="mobile-nav"
              ref={toggle}
              onClick={() => setExpanded(true)}
            >
              <span />
              <span />
            </HeroButton>
          </div>
        </div>
      </header>

      <Modal
        isOpen={expanded}
        onClose={close}
        hideCloseButton
        backdrop="blur"
        scrollBehavior="inside"
        size="full"
        aria-labelledby="mobile-menu-title"
        classNames={{
          base: "hero-ui-modal mobile-nav",
          backdrop: "hero-ui-backdrop",
        }}
      >
        <ModalContent>
          <ModalHeader className="sr-only">РњРµРЅСЋ РЅР°РІРёРіР°С†РёРё</ModalHeader>
          <div id="mobile-nav" className="hero-dialog-body mobile-nav">
            <div className="mobile-menu-head">
              <h2 id="mobile-menu-title" className="brand">
                geeapp
                <span className="brand-dot" aria-hidden="true" />
              </h2>
              <HeroButton
                className="close-modal close-menu"
                aria-label="Р—Р°РєСЂС‹С‚СЊ РјРµРЅСЋ"
                onClick={close}
              >
                Г—
              </HeroButton>
            </div>

            <div className="mobile-city-row">
              <CityButton />
            </div>

            <nav className="mobile-nav-links" aria-label="РњРѕР±РёР»СЊРЅР°СЏ РЅР°РІРёРіР°С†РёСЏ">
              {items.map((i) => (
                <HeroLink
                  key={i.href}
                  href={bookingHref ? "/" + i.href : i.href}
                  onClick={close}
                >
                  {i.label}
                </HeroLink>
              ))}
            </nav>

            <div className="mobile-menu-foot">
              <HeroLink className="mobile-menu-phone" href="tel:+79995811533">
                +7 (999) 581-15-33
              </HeroLink>
              <SocialLinks className="mobile-socials social-links" />
              <BookingButton
                className="button btn btn--primary"
                onClick={close}
              >
                РћСЃС‚Р°РІРёС‚СЊ Р·Р°СЏРІРєСѓ <Arrow />
              </BookingButton>
              <p className="mobile-menu-note">
                <span data-city="">
                  <CityLabel />
                </span>{" "}
                В· РќР° СЃРІСЏР·Рё СЃ 10:00 РґРѕ 22:00
              </p>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}