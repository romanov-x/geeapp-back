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
      aria-label={`Выбрать город. Сейчас ${city}`}
    >
      <span className="city-dot" />
      <span className="city-name">{city}</span>
      <span aria-hidden="true">⌄</span>
    </Button>
  );
}

export function CityProvider({
  initialSlug = DEFAULT_CITY.slug,
  children,
}: {
  initialSlug?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [cityInfo, setCityInfo] = useState<CityInfo>(() =>
    getCityBySlug(initialSlug)
  );
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setCityInfo(getCityBySlug(initialSlug));
  }, [initialSlug]);

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

    // В Codespaces / localhost переключаем cookie и обновляем серверные компоненты без смены домена
    document.cookie = `${CITY_COOKIE}=${target.slug}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  const filtered = CITIES.filter((item) =>
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
          <ModalHeader>Выберите ваш город</ModalHeader>
          <ModalBody className="pb-6">
            <Input
              aria-label="Поиск города"
              placeholder="Найти город"
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
            {filtered.length === 0 && <p>Город не найден в быстром списке — оставьте заявку, подберём онлайн-формат.</p>}
            <p className="city-note">
              В Челябинске работает наш стационарный сервис (ул. Энтузиастов, 28а). В других городах работают проверенные мастера-партнёры и доступна онлайн-прошивка — администратор распределит вашу заявку.
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Context.Provider>
  );
}