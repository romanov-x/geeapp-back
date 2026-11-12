"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import {
  CITIES,
  CITY_COOKIE,
  DEFAULT_CITY,
  ROOT_DOMAIN,
  cityOrigin,
  getCityBySlug,
  type CityInfo,
} from "@/lib/cities";

export const cities = CITIES.map((c) => c.name);

type CityContextValue = {
  city: string;
  inCity: string;
  cityInfo: CityInfo;
  choose: () => void;
};

const Context = createContext<CityContextValue>({
  city: DEFAULT_CITY.name,
  inCity: DEFAULT_CITY.inName,
  cityInfo: DEFAULT_CITY,
  choose: () => {},
});

export const useCity = () => useContext(Context);

export function CityLabel() {
  return <>{useCity().city}</>;
}

export function CityInLabel() {
  return <>{useCity().inCity}</>;
}

export function CityButton() {
  const { city, choose } = useCity();
  return (
    <Button
      variant="light"
      radius="full"
      className="city-button"
      title={city}
      onPress={choose}
      aria-label={`Р’С‹Р±СЂР°С‚СЊ РіРѕСЂРѕРґ. РЎРµР№С‡Р°СЃ ${city}`}
    >
      <svg className="city-location" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
      <span className="city-name">{city}</span>
    </Button>
  );
}

export function CityProvider({
  initialSlug = DEFAULT_CITY.slug,
  citiesList,
  children,
}: {
  initialSlug?: string;
  citiesList?: CityInfo[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const activeCities = citiesList && citiesList.length > 0 ? citiesList : CITIES;

  const resolveFromList = (slug?: string | null): CityInfo => {
    if (!slug) return activeCities[0] || DEFAULT_CITY;
    const clean = slug.toLowerCase().trim();
    return (
      activeCities.find((c) => c.slug === clean || c.subdomain === clean) ||
      getCityBySlug(clean)
    );
  };

  const [cityInfo, setCityInfo] = useState<CityInfo>(() =>
    resolveFromList(initialSlug)
  );
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setCityInfo(resolveFromList(initialSlug));
  }, [initialSlug, citiesList]);

  function select(target: CityInfo) {
    setCityInfo(target);
    setOpen(false);

    const host = window.location.hostname.toLowerCase();
    const isProdDomain =
      host === ROOT_DOMAIN || host.endsWith(`.${ROOT_DOMAIN}`);

    try {
      localStorage.setItem(CITY_COOKIE, target.slug);
    } catch {}

    if (isProdDomain) {
      document.cookie = `${CITY_COOKIE}=${target.slug}; path=/; domain=.${ROOT_DOMAIN}; max-age=31536000; SameSite=Lax`;
      const nextUrl = `${cityOrigin(target)}${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (nextUrl !== window.location.href) {
        window.location.assign(nextUrl);
      }
      return;
    }

    document.cookie = `${CITY_COOKIE}=${target.slug}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  const filtered = activeCities.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <Context.Provider
      value={{
        city: cityInfo.name,
        inCity: cityInfo.inName,
        cityInfo,
        choose: () => {
          setSearch("");
          setOpen(true);
        },
      }}
    >
      {children}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        scrollBehavior="inside"
        size="2xl"
        placement="center"
        classNames={{ base: "city-modal" }}
      >
        <ModalContent>
          <ModalHeader>Р’С‹Р±РµСЂРёС‚Рµ РІР°С€ РіРѕСЂРѕРґ</ModalHeader>
          <ModalBody className="pb-6">
            <Input
              aria-label="РџРѕРёСЃРє РіРѕСЂРѕРґР°"
              placeholder="РќР°Р№С‚Рё РіРѕСЂРѕРґ"
              value={search}
              onValueChange={setSearch}
              isClearable
              onClear={() => setSearch("")}
              variant="bordered"
            />
            <div className="city-grid">
              {filtered.map((item) => (
                <Button
                  key={item.slug}
                  variant={cityInfo.slug === item.slug ? "solid" : "flat"}
                  color={cityInfo.slug === item.slug ? "primary" : "default"}
                  onPress={() => select(item)}
                  aria-pressed={cityInfo.slug === item.slug}
                >
                  {item.name}
                </Button>
              ))}
            </div>
            {filtered.length === 0 && (
              <p>
                Р“РѕСЂРѕРґ РЅРµ РЅР°Р№РґРµРЅ РІ Р±С‹СЃС‚СЂРѕРј СЃРїРёСЃРєРµ вЂ” РѕСЃС‚Р°РІСЊС‚Рµ Р·Р°СЏРІРєСѓ, РїРѕРґР±РµСЂС‘Рј
                РѕРЅР»Р°Р№РЅ-С„РѕСЂРјР°С‚.
              </p>
            )}
            <p className="city-note">
              Р’ Р§РµР»СЏР±РёРЅСЃРєРµ СЂР°Р±РѕС‚Р°РµС‚ РЅР°С€ СЃС‚Р°С†РёРѕРЅР°СЂРЅС‹Р№ СЃРµСЂРІРёСЃ (СѓР». Р­РЅС‚СѓР·РёР°СЃС‚РѕРІ,
              28Р°). Р’ РґСЂСѓРіРёС… РіРѕСЂРѕРґР°С… СЂР°Р±РѕС‚Р°СЋС‚ РїСЂРѕРІРµСЂРµРЅРЅС‹Рµ РјР°СЃС‚РµСЂР°-РїР°СЂС‚РЅС‘СЂС‹ Рё
              РґРѕСЃС‚СѓРїРЅР° РѕРЅР»Р°Р№РЅ-РїСЂРѕС€РёРІРєР° вЂ” Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ СЂР°СЃРїСЂРµРґРµР»РёС‚ РІР°С€Сѓ Р·Р°СЏРІРєСѓ.
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Context.Provider>
  );
}