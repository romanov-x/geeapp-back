"use client";
import { HeroButton, HeroLink } from "@/components/HeroPrimitives";
import { Tabs, Tab } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { orderedMakes } from "@/lib/data";
import {
  brandSlug,
  resolveBrandParam,
  searchCatalog,
  type ServiceFilter,
} from "@/lib/catalog";
import { ModelCard } from "./ModelCard";

const makes = orderedMakes();
const PAGE = 9;

const FILTERS: { id: ServiceFilter; label: string }[] = [
  { id: "all", label: "Все решения" },
  { id: "apps", label: "Приложения и прошивка" },
  { id: "russian", label: "Русификация" },
];

export function Models() {
  const [activeMake, setActiveMake] = useState(makes[0]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ServiceFilter>("all");
  const [visible, setVisible] = useState(PAGE);
  const [overflow, setOverflow] = useState({ left: false, right: false });

  const tabs = useRef<HTMLDivElement>(null);
  const results = useRef<HTMLDivElement>(null);

  const isGlobalSearch = query.trim().length > 0;
  const cards = searchCatalog(query, filter, isGlobalSearch ? undefined : activeMake);

  const sync = () => {
    const el =
      tabs.current?.querySelector<HTMLElement>('[role="tablist"]') || tabs.current;
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
      const resolved = rawMake ? resolveBrandParam(rawMake) : null;
      setActiveMake(resolved ? resolved.make : makes[0]);
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
  }, []);

  useEffect(() => {
    const active = tabs.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    const el = tabs.current;
    if (active && el) {
      const r = active.getBoundingClientRect();
      const box = el.getBoundingClientRect();
      if (r.left < box.left || r.right > box.right) {
        el.scrollLeft += r.left - box.left - (box.width - r.width) / 2;
      }
    }
    sync();
  }, [activeMake]);

  const selectMake = (make: string) => {
    setActiveMake(make);
    setQuery("");
    setVisible(PAGE);
    history.replaceState(null, "", `?make=${encodeURIComponent(brandSlug(make))}#models`);
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
              <strong>Monjaro</strong>, <strong>KX11</strong>, <strong>Jolion</strong>,{" "}
              <strong>Camry XV80</strong>). Покажем доступные пакеты, цены и ограничения.
            </p>
          </div>
          <span className="section-aside">
            <span>Приложения 8&nbsp;000–30&nbsp;000&nbsp;₽</span>
            <span>Русификация по запросу</span>
          </span>
        </div>

        <div className="catalog-toolbar" role="search" aria-label="Поиск по моделям авто">
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

          <div className="catalog-filter-pills" role="group" aria-label="Фильтр по услуге">
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
                aria-controls="brand-tabs"
                disabled={!overflow.left}
                onClick={() => scroll(-1)}
              >
                ←
              </HeroButton>
              <HeroButton
                type="button"
                id="models-next"
                aria-label="Следующие марки"
                aria-controls="brand-tabs"
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
                aria-label="Выбор марки"
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
                  id="brand-section-link"
                  href={`/brand/${brandSlug(activeMake)}`}
                >
                  Все модели {activeMake} <span aria-hidden="true">↗</span>
                </HeroLink>
              )}
            </div>

            {cards.length === 0 ? (
              <div className="catalog-empty">
                <p>
                  По запросу <strong>«{query.trim() || activeMake}»</strong> с выбранным
                  фильтром готовых карточек не найдено.
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
                    aria-controls="model-cards"
                    hidden={visible >= cards.length}
                    onClick={(e) => {
                      const first = visible;
                      setVisible((v) => v + PAGE);
                      if (e.detail === 0) {
                        requestAnimationFrame(() =>
                          document
                            .querySelectorAll<HTMLAnchorElement>(
                              "#model-cards .model-link"
                            )
                            [first]?.focus({ preventScroll: true })
                        );
                      }
                    }}
                  >
                    Показать ещё
                  </HeroButton>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="fine-print">
          Совместимость и состав работ подтверждаем перед записью. Работаем в сервисе в
          Челябинске, через мастеров-партнёров в регионах и в формате онлайн-прошивки.
        </p>
      </div>
    </section>
  );
}