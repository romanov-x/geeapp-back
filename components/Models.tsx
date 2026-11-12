"use client";
import { HeroButton, HeroLink } from "@/components/HeroPrimitives";
import { Tabs, Tab } from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  brandSlug,
  buildCatalogFromModels,
  orderedMakesFromEntries,
  resolveBrandFromEntries,
  searchEntries,
  type ServiceFilter,
} from "@/lib/catalog";
import { useCms } from "./CmsProvider";
import { ModelCard } from "./ModelCard";

const PAGE = 9;

const FILTERS: { id: ServiceFilter; label: string }[] = [
  { id: "all", label: "Все решения" },
  { id: "apps", label: "Приложения и прошивка" },
  { id: "russian", label: "Русификация" },
];

export function Models() {
  const cms = useCms();
  const allEntries = useMemo(
    () => buildCatalogFromModels(cms.models, cms.brandAliases, cms.works),
    [cms.models, cms.brandAliases, cms.works]
  );
  const makes = useMemo(
    () => orderedMakesFromEntries(allEntries),
    [allEntries]
  );

  const [activeMake, setActiveMake] = useState(makes[0] || "Geely");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ServiceFilter>("all");
  const [visible, setVisible] = useState(PAGE);
  const [overflow, setOverflow] = useState({ left: false, right: false });

  const tabs = useRef<HTMLDivElement>(null);
  const results = useRef<HTMLDivElement>(null);

  const isGlobalSearch = query.trim().length > 0;
  const cards = searchEntries(
    allEntries,
    query,
    filter,
    isGlobalSearch ? undefined : activeMake
  );

  const sync = () => {
    const el =
      tabs.current?.querySelector<HTMLElement>('[role="tablist"]') ||
      tabs.current;
    if (el) {
      setOverflow({
        left: el.scrollLeft > 2,
        right: el.scrollWidth - el.clientWidth - el.scrollLeft > 2,
      });
    }
  };

  useEffect(() => {
    const read = () => {
      const rawMake = new URLSearchParams(location.search).get("make");
      const resolved = rawMake
        ? resolveBrandFromEntries(allEntries, rawMake)
        : null;
      setActiveMake(resolved ? resolved.make : makes[0] || "Geely");
      setVisible(PAGE);
    };
    const onSelectMake = (e: Event) => {
      const make = (e as CustomEvent<string>).detail;
      if (make) {
        setActiveMake(make);
        setQuery("");
        setVisible(PAGE);
      }
    };
    read();
    window.addEventListener("popstate", read);
    window.addEventListener("geeapp:select-make", onSelectMake);
    const observer = new ResizeObserver(sync);
    if (tabs.current) observer.observe(tabs.current);
    return () => {
      observer.disconnect();
      window.removeEventListener("popstate", read);
      window.removeEventListener("geeapp:select-make", onSelectMake);
    };
  }, [allEntries, makes]);

  const selectMake = (make: string) => {
    setActiveMake(make);
    setQuery("");
    setVisible(PAGE);
    history.replaceState(
      null,
      "",
      `?make=${encodeURIComponent(brandSlug(make))}#models`
    );
    requestAnimationFrame(() =>
      results.current?.scrollIntoView({
        block: "start",
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      })
    );
  };

  const scroll = (direction: number) => {
    const el = tabs.current?.querySelector<HTMLElement>('[role="tablist"]');
    el?.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section
      className="section models-section"
      id="models"
      aria-labelledby="models-title"
    >
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="kicker">Каталог моделей</p>
            <h2 id="models-title">Найдите свой автомобиль.</h2>
            <p>
              Выберите марку или введите название модели / кузова (например:{" "}
              <strong>Monjaro</strong>, <strong>KX11</strong>,{" "}
              <strong>Jolion</strong>, <strong>Camry XV80</strong>).
            </p>
          </div>
          <span className="section-aside">
            <span>Актуальные цены и пакеты</span>
            <span>Русификация и приложения</span>
          </span>
        </div>

        <div
          className="catalog-toolbar"
          role="search"
          aria-label="Поиск по моделям авто"
        >
          <div className="catalog-search-box">
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE);
              }}
              placeholder="Поиск по марке, модели или кузову (Монджаро, KX11, Танк 300, Камри…)"
              aria-label="Поиск автомобиля в каталоге"
              className="catalog-search-input"
            />
            {query && (
              <button
                type="button"
                className="catalog-search-clear"
                onClick={() => {
                  setQuery("");
                  setVisible(PAGE);
                }}
                aria-label="Очистить поиск"
              >
                ×
              </button>
            )}
          </div>

          <div
            className="catalog-filter-pills"
            role="group"
            aria-label="Фильтр по услуге"
          >
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`catalog-filter-pill${
                  filter === item.id ? " is-active" : ""
                }`}
                aria-pressed={filter === item.id}
                onClick={() => {
                  setFilter(item.id);
                  setVisible(PAGE);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="models-layout">
          <aside className="models-brands" aria-label="Выбор марки">
            <div className="models-controls" aria-label="Листать марки">
              <HeroButton
                type="button"
                id="models-prev"
                aria-label="Предыдущие марки"
                disabled={!overflow.left}
                onClick={() => scroll(-1)}
              >
                ←
              </HeroButton>
              <HeroButton
                type="button"
                id="models-next"
                aria-label="Следующие марки"
                disabled={!overflow.right}
                onClick={() => scroll(1)}
              >
                →
              </HeroButton>
            </div>
            <div
              className={`brands-scroll-edge${
                overflow.left ? " can-scroll-left" : ""
              }${overflow.right ? " can-scroll-right" : ""}`}
            >
              <div
                className="brand-tabs"
                id="brand-tabs"
                ref={tabs}
                onScroll={sync}
              >
                <Tabs
                  aria-label="Марки автомобилей"
                  selectedKey={activeMake}
                  onSelectionChange={(key) => selectMake(String(key))}
                  classNames={{
                    base: "hero-brand-tabs",
                    tabList: "hero-brand-tablist",
                    tab: "hero-brand-tab",
                    cursor: "bg-primary",
                    tabContent: "group-data-[selected=true]:text-white",
                  }}
                >
                  {makes.map((make) => (
                    <Tab key={make} title={make} />
                  ))}
                </Tabs>
              </div>
            </div>
          </aside>

          <div className="models-results" id="models-results" ref={results}>
            <div className="models-brand-heading">
              <h3 id="models-brand-title">
                {isGlobalSearch
                  ? `Результаты поиска «${query.trim()}»`
                  : activeMake}
              </h3>
              {!isGlobalSearch && (
                <HeroLink
                  className="brand-section-link text-link"
                  href={`/brand/${brandSlug(activeMake)}`}
                >
                  Все модели {activeMake} <span aria-hidden="true">↗</span>
                </HeroLink>
              )}
            </div>

            {cards.length === 0 ? (
              <div className="catalog-empty">
                <p>
                  По запросу <strong>«{query.trim() || activeMake}»</strong>{" "}
                  готовых карточек не найдено.
                </p>
                <HeroButton
                  type="button"
                  className="button btn btn--secondary"
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                  }}
                >
                  Сбросить фильтры
                </HeroButton>
              </div>
            ) : (
              <>
                <div className="model-cards" id="model-cards" aria-live="polite">
                  {cards.map((entry, index) => (
                    <ModelCard
                      key={entry.slug}
                      entry={entry}
                      hidden={index >= visible}
                    />
                  ))}
                </div>
                <div className="models-pagination">
                  <span id="models-count" role="status">
                    Показано {Math.min(visible, cards.length)} из {cards.length}
                  </span>
                  <HeroButton
                    id="models-more"
                    className="button btn btn--secondary"
                    hidden={visible >= cards.length}
                    onClick={() => setVisible((v) => v + PAGE)}
                  >
                    Показать ещё
                  </HeroButton>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}