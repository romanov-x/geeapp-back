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
  { label: "Услуги", href: "#services" },
  { label: "Модели", href: "#models" },
  { label: "О компании", href: "#about" },
  { label: "Тарифы", href: "#formats" },
  { label: "Вопросы", href: "#faq" },
  { label: "Контакты", href: "#contacts" },
];

export function Header({
  bookingHref,
  bookingLabel = "Оставить заявку",
}: {
  bookingHref?: string;
  bookingLabel?: string;
} = {}) {
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);


  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!header.current) return;
      // Evaluate each control separately: the header can cross several surfaces at once.
      const darkSurfaces = Array.from(document.querySelectorAll(
        ".russian-section, .footer, .mini-footer, .service-tile:first-child, .format-card--featured, .hero-split-media figure"
      )).map((surface) => surface.getBoundingClientRect());
      header.current.querySelectorAll<HTMLElement>(
        ".brand, .city-button, .nav-link, .action-button, .header-phone, .menu-toggle, [data-header-call]"
      ).forEach((control) => {
        const rect = control.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = (rect.left + rect.right) / 2;
        const y = (rect.top + rect.bottom) / 2;
        control.dataset.headerTone = darkSurfaces.some((surface) =>
          surface.left <= x && surface.right >= x && surface.top <= y && surface.bottom >= y
        ) ? "dark" : "light";
      });
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
      <header className={`header ${styles.root}`} ref={header}>
        <div className={`wrap ${styles.inner}`} data-header-layout>
          <HeroLink
            className="skip-link"
            href={bookingHref ? "#model-main" : "#home"}
          >
            Перейти к содержимому
          </HeroLink>

          <HeroLink
            className={`brand ${styles.brand}`}
            data-header-part="brand"
            href={bookingHref ? "/#home" : "#home"}
            aria-label="GeeApp — на главную"
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
            aria-label="Основная навигация"
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
                className="button btn btn--primary action-button"
                href={bookingHref}
              >
                {bookingLabel} <Arrow />
              </HeroLink>
            ) : (
              <BookingButton className="button btn btn--primary action-button">
                Оставить заявку <Arrow />
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
              data-header-call
              href="tel:+79995811533"
              aria-label="Позвонить +7 (999) 581-15-33"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </HeroLink>

            <HeroButton
              className={`menu-toggle ${styles.toggle}`}
              data-header-part="menu"
              aria-label="Открыть меню"
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
          <ModalHeader className="sr-only">Меню навигации</ModalHeader>
          <div id="mobile-nav" className="hero-dialog-body mobile-nav">
            <div className="mobile-menu-head">
              <h2 id="mobile-menu-title" className="brand">
                geeapp
                <span className="brand-dot" aria-hidden="true" />
              </h2>
              <HeroButton
                className="close-modal close-menu"
                aria-label="Закрыть меню"
                onClick={close}
              >
                ×
              </HeroButton>
            </div>

            <div className="mobile-city-row">
              <CityButton />
            </div>

            <nav className="mobile-nav-links" aria-label="Мобильная навигация">
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
                className="button btn btn--primary action-button"
                onClick={close}
              >
                Оставить заявку <Arrow />
              </BookingButton>
              <p className="mobile-menu-note">
                <span data-city="">
                  <CityLabel />
                </span>{" "}
                · На связи с 10:00 до 22:00
              </p>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}