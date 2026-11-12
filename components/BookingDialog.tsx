"use client";
import { Modal, ModalContent, ModalHeader } from "@heroui/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  HeroButton,
  HeroInput,
  HeroLink,
  HeroTextarea,
} from "@/components/HeroPrimitives";
import { useCity } from "./CityProvider";
import { money, services, vehicles } from "@/lib/data";
import { Dropdown, type DropdownItem } from "./ui/dropdown";
import { Arrow } from "./Arrow";
import { ConsentDialog, type ConsentHandle } from "./ConsentDialog";
import type { BookingOptions } from "./BookingProvider";

const OTHER = "__other__";

type Fields = {
  service: string;
  make: string;
  makeCustom: string;
  model: string;
  modelCustom: string;
  year: string;
  name: string;
  phone: string;
  task: string;
  consent: boolean;
  privacy: boolean;
};

const empty: Fields = {
  service: "",
  make: "",
  makeCustom: "",
  model: "",
  modelCustom: "",
  year: "",
  name: "",
  phone: "",
  task: "",
  consent: false,
  privacy: false,
};

const eligible = (service: string) =>
  vehicles.filter(
    (car) =>
      service === "inquiry" ||
      car.service === (service === "firmware" ? "apps" : service)
  );

const makesFor = (service: string) =>
  [...new Set(eligible(service).map((car) => car.make))].sort();

const modelsFor = (service: string, make: string) =>
  eligible(service)
    .filter((car) => car.make === make && !car.needsModel)
    .filter(
      (car, index, list) =>
        list.findIndex((c) => c.name === car.name) === index
    );

function phoneFormat(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (digits.startsWith("9")) digits = "7" + digits;
  if (!digits) return "";
  digits = digits.slice(0, 11);
  if (!digits.startsWith("79")) return "+" + digits;
  return (
    "+7 (" +
    digits.slice(1, 4) +
    (digits.length >= 4 ? ")" : "") +
    (digits.length > 4 ? " " + digits.slice(4, 7) : "") +
    (digits.length > 7 ? "-" + digits.slice(7, 9) : "") +
    (digits.length > 9 ? "-" + digits.slice(9, 11) : "")
  );
}

function findCar(fields: Fields) {
  const make =
    fields.make === OTHER ? fields.makeCustom.trim() : fields.make;
  const model =
    fields.model === OTHER ? fields.modelCustom.trim() : fields.model;
  return vehicles.find(
    (car) =>
      car.make.toLowerCase() === make.toLowerCase() &&
      car.name.toLowerCase() === model.toLowerCase() &&
      (car.supported === false || car.service === fields.service)
  );
}

function validate(fields: Fields) {
  const errors: Record<string, string> = {};
  if (!services.some((service) => service.id === fields.service))
    errors.service = "Выберите услугу из списка.";
  if (!(fields.make === OTHER ? fields.makeCustom.trim() : fields.make))
    errors.make = "Укажите марку автомобиля.";
  if (!(fields.model === OTHER ? fields.modelCustom.trim() : fields.model))
    errors.model = "Укажите модель автомобиля.";
  const latest = new Date().getFullYear() + 1;
  if (
    !/^\d{4}$/.test(fields.year) ||
    +fields.year < 2015 ||
    +fields.year > latest
  )
    errors.year = `Укажите год выпуска от 2015 до ${latest}.`;
  if (!/^79\d{9}$/.test(fields.phone.replace(/\D/g, "")))
    errors.phone =
      "Введите 11 цифр российского мобильного номера: +7 (9XX) XXX-XX-XX.";
  if (!fields.consent)
    errors.consent = "Подтвердите согласие на обработку данных.";
  if (!fields.privacy)
    errors.privacy =
      "Подтвердите ознакомление с условиями обработки данных.";
  if (findCar(fields)?.supported === false)
    errors.model = "Haval M6 не прошиваем. Укажите другую модель.";
  return errors;
}

export function BookingDialog({
  open,
  request,
  onClose,
}: {
  open: boolean;
  request: { options: BookingOptions; revision: number };
  onClose: () => void;
}) {
  const { city } = useCity();
  const consentDialog = useRef<ConsentHandle>(null);
  const opener = useRef<HTMLElement | null>(null);
  const success = useRef<HTMLDivElement>(null);

  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement;
    setDraft("");
    setErrors({});

    const { service, manual, car } = request.options;
    setFields((previous) => {
      let next = { ...previous };
      if (manual) {
        next = {
          ...next,
          service: service || "",
          make: "",
          makeCustom: "",
          model: "",
          modelCustom: "",
          year: "",
        };
      } else if (car) {
        next = {
          ...next,
          service: service || car.service,
          make: car.make,
          makeCustom: car.make,
          model: car.needsModel ? OTHER : car.name,
          modelCustom: car.needsModel ? "" : car.name,
          year:
            next.make === car.make && next.model === car.name ? next.year : "",
        };
      } else if (service) {
        next.service = service;
        if (!makesFor(service).includes(next.make) && next.make !== OTHER)
          next.make = "";
        if (
          !modelsFor(service, next.make).some((c) => c.name === next.model) &&
          next.model !== OTHER
        )
          next.model = "";
      }
      return next;
    });

    requestAnimationFrame(() => {
      const target = request.options.car?.needsModel
        ? document.getElementById("booking-model-custom")
        : document.querySelector<HTMLElement>(
            '[data-select-id="booking-service"]'
          );
      target?.focus();
    });
  }, [open, request]);

  useEffect(() => {
    if (draft) {
      success.current?.querySelector<HTMLElement>("h2")?.focus();
    }
  }, [draft]);

  function handleClose() {
    onClose();
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  }

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    const next = { ...fields, [key]: value };
    if (key === "service") {
      if (!makesFor(next.service).includes(next.make) && next.make !== OTHER)
        next.make = "";
      if (
        !modelsFor(next.service, next.make).some((c) => c.name === next.model) &&
        next.model !== OTHER
      )
        next.model = "";
    }
    if (key === "make") {
      next.model = "";
      if (
        next.make === OTHER ||
        eligible(next.service)
          .filter((c) => c.make === next.make)
          .every((c) => c.needsModel)
      )
        next.model = OTHER;
    }
    const invalid = validate(next);
    setErrors((current) =>
      Object.fromEntries(
        Object.entries(current).filter(([name]) => invalid[name])
      )
    );
    setFields(next);
  }

  const invalid = validate(fields);
  const car = findCar(fields);
  const modelInfo = car
    ? car.supported === false
      ? "Haval M6 не прошиваем. Выберите другую модель."
      : car.needsCompatibility || fields.service === "inquiry"
      ? "Доступные услуги и стоимость требуют проверки."
      : car.price
      ? `Пакет по прайсу: ${money(car.price)}. Состав и итоговую стоимость подтвердим после проверки.`
      : "Цена по запросу. Объём работ подтвердим после проверки."
    : "";

  const error = (name: string) => (
    <p className="field-error" id={`${name}-error`} hidden={!errors[name]}>
      {errors[name]}
    </p>
  );

  const focus = (name: string) =>
    (
      document.querySelector<HTMLElement>(
        `[data-select-id="booking-${name}"]`
      ) ||
      document.getElementById(
        `booking-${
          name === "make" && fields.make === OTHER
            ? "make-custom"
            : name === "model" && fields.model === OTHER
            ? "model-custom"
            : name
        }`
      )
    )?.focus();

  const select = (
    name: "service" | "make" | "model",
    label: string,
    items: DropdownItem[],
    disabled = false
  ) => (
    <div className="field">
      <label
        htmlFor={`booking-${name}`}
        onClick={(e) => {
          e.preventDefault();
          focus(name);
        }}
      >
        {label}
      </label>
      <div className="select-mount">
        <Dropdown
          label={label}
          controlId={`booking-${name}`}
          items={items}
          value={fields[name]}
          required
          disabled={disabled}
          invalid={!!errors[name]}
          complete={
            !!fields[name] && fields[name] !== OTHER && !invalid[name]
          }
          describedBy={`${name}-error${
            name === "model" ? " booking-model-info" : ""
          }`}
          onChange={(value) => update(name, value)}
        />
      </div>
      {name === "make" && fields.make === OTHER && (
        <div id="manual-make" className="manual-field">
          <label htmlFor="booking-make-custom">Название марки</label>
          {input("makeCustom", {
            id: "booking-make-custom",
            placeholder: "Введите марку",
            maxLength: 60,
            autoComplete: "off",
            "aria-describedby": "make-error",
          })}
        </div>
      )}
      {name === "model" && fields.model === OTHER && (
        <div id="manual-model" className="manual-field">
          <label htmlFor="booking-model-custom">Название модели</label>
          {input("modelCustom", {
            id: "booking-model-custom",
            placeholder: "Введите модель",
            maxLength: 80,
            "aria-describedby": "model-error booking-model-info",
          })}
        </div>
      )}
      {error(name)}
    </div>
  );

  function input(
    name: "makeCustom" | "modelCustom" | "year" | "name" | "phone",
    props: React.InputHTMLAttributes<HTMLInputElement>
  ) {
    const logical =
      name === "makeCustom" ? "make" : name === "modelCustom" ? "model" : name;
    const complete = !!fields[name] && !invalid[logical];
    return (
      <div
        className="input-glass liquid-surface"
        data-complete={String(complete)}
      >
        <HeroInput
          {...props}
          name={name}
          id={props.id || `booking-${name}`}
          value={fields[name]}
          data-complete={String(complete)}
          aria-invalid={errors[logical] ? true : undefined}
          onChange={(e) =>
            update(
              name,
              name === "phone"
                ? phoneFormat(e.target.value)
                : name === "year"
                ? e.target.value.replace(/\D/g, "").slice(0, 4)
                : e.target.value
            )
          }
        />
      </div>
    );
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const messages = validate(fields);
    setErrors(messages);
    if (Object.keys(messages).length) {
      focus(Object.keys(messages)[0]);
      return;
    }
    const make =
      fields.make === OTHER ? fields.makeCustom.trim() : fields.make;
    const model =
      fields.model === OTHER ? fields.modelCustom.trim() : fields.model;
    setDraft(
      `Заявка Geeapp\nГород: ${city}\nУслуга: ${
        services.find((s) => s.id === fields.service)?.title
      }\nАвтомобиль: ${make} ${model}, ${fields.year}\n${
        car?.price
          ? `Пакет по прайсу: ${money(car.price)}\n`
          : car?.service === "russian"
          ? "Цена русификации: по запросу\n"
          : ""
      }Телефон: ${fields.phone}\n${
        fields.name ? `Имя: ${fields.name}\n` : ""
      }${
        fields.task ? `Задача: ${fields.task}\n` : ""
      }\nСовместимость, состав пакета, итоговая стоимость и формат записи подтверждаются администратором.`
    );
  }

  function download() {
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + draft], { type: "text/plain;charset=utf-8" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "Geeapp-заявка.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <Modal
        isOpen={open}
        onClose={handleClose}
        hideCloseButton
        backdrop="blur"
        scrollBehavior="inside"
        size="2xl"
        placement="center"
        aria-labelledby={draft ? "success-title" : "booking-title"}
        classNames={{
          base: "hero-ui-modal",
          backdrop: "hero-ui-backdrop",
        }}
      >
        <ModalContent>
          <ModalHeader className="sr-only">
            {draft ? "Черновик заявки готов" : "Заявка на настройку"}
          </ModalHeader>
          <div id="booking" className="hero-dialog-body">
            <div className="dialog-controls">
              <HeroButton
                className="close-modal"
                aria-label="Закрыть форму"
                onClick={handleClose}
              >
                ×
              </HeroButton>
            </div>

            <div id="form-panel" hidden={!!draft}>
              <p className="dialog-kicker">
                Geeapp / <span data-city="">{city}</span>
              </p>
              <h2 id="booking-title">Заявка на настройку.</h2>
              <p className="dialog-description">
                Укажите услугу и автомобиль. Администратор проверит версию ГУ и
                предложит удобный формат работы в вашем городе или онлайн.
              </p>
              <p className="required-note">
                Услуга, марка, модель, год и телефон обязательны.
              </p>

              <form id="booking-form" noValidate onSubmit={submit}>
                {select("service", "Услуга", [
                  { value: "", label: "Выберите услугу" },
                  ...services.map((s) => ({ value: s.id, label: s.title })),
                ])}

                <div className="form-row">
                  {select(
                    "make",
                    "Марка",
                    [
                      {
                        value: "",
                        label: fields.service
                          ? "Выберите марку"
                          : "Сначала выберите услугу",
                      },
                      ...(fields.service
                        ? [
                            ...makesFor(fields.service).map((make) => ({
                              value: make,
                              label: make,
                            })),
                            {
                              value: OTHER,
                              label: "Другая марка — указать вручную",
                            },
                          ]
                        : []),
                    ],
                    !fields.service
                  )}

                  {select(
                    "model",
                    "Модель",
                    [
                      {
                        value: "",
                        label: fields.make
                          ? "Выберите модель"
                          : "Сначала выберите марку",
                      },
                      ...(fields.service && fields.make
                        ? [
                            ...modelsFor(fields.service, fields.make).map(
                              (c) => ({
                                value: c.name,
                                label:
                                  c.name +
                                  (c.supported === false
                                    ? " — не поддерживается"
                                    : ""),
                                disabled: c.supported === false,
                              })
                            ),
                            {
                              value: OTHER,
                              label:
                                "Другой модели нет в списке — указать вручную",
                            },
                          ]
                        : []),
                    ],
                    !fields.service || !fields.make
                  )}
                </div>

                <p
                  className="model-info"
                  id="booking-model-info"
                  hidden={!modelInfo}
                >
                  {modelInfo}
                </p>

                <div className="form-row">
                  <div className="field">
                    <label htmlFor="booking-year">Год выпуска</label>
                    {input("year", {
                      inputMode: "numeric",
                      pattern: "[0-9]{4}",
                      placeholder: "От 2015",
                      required: true,
                      maxLength: 4,
                      "aria-describedby": "year-error",
                    })}
                    {error("year")}
                  </div>
                  <div className="field">
                    <label htmlFor="booking-name">
                      Ваше имя{" "}
                      <span className="optional">необязательно</span>
                    </label>
                    {input("name", {
                      autoComplete: "given-name",
                      maxLength: 60,
                      placeholder: "Как к вам обращаться",
                    })}
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="booking-phone">Телефон</label>
                  {input("phone", {
                    type: "tel",
                    inputMode: "tel",
                    autoComplete: "tel",
                    placeholder: "+7 (9XX) XXX-XX-XX",
                    required: true,
                    maxLength: 18,
                    "aria-describedby": "phone-hint phone-error",
                  })}
                  <p className="field-hint" id="phone-hint">
                    Российский мобильный номер, начинающийся с +7 9.
                  </p>
                  {error("phone")}
                </div>

                <div className="field">
                  <label htmlFor="booking-task">
                    Что хотите настроить?{" "}
                    <span className="optional">необязательно</span>
                  </label>
                  <div
                    className="input-glass liquid-surface"
                    data-complete={String(!!fields.task)}
                  >
                    <HeroTextarea
                      id="booking-task"
                      name="task"
                      rows={3}
                      maxLength={1200}
                      placeholder="Нужные приложения, язык меню, версия системы…"
                      value={fields.task}
                      data-complete={String(!!fields.task)}
                      onChange={(e) => update("task", e.target.value)}
                    />
                  </div>
                </div>

                <p
                  id="form-error"
                  className="form-error"
                  role="status"
                  hidden={!Object.keys(errors).length}
                >
                  Проверьте отмеченные поля.
                </p>

                <p className="form-note">
                  Пока отправка не подключена. Форма подготовит черновик для
                  скачивания. Заявка не отправляется, время не бронируется.
                </p>

                <HeroButton
                  className="button btn btn--primary full"
                  type="submit"
                >
                  Подготовить заявку <Arrow />
                </HeroButton>

                <div className="form-consents">
                  {(["consent", "privacy"] as const).map((name) => (
                    <div className="consent-field" key={name}>
                      <label className="consent-option" htmlFor={`booking-${name}`}>
                        <HeroInput
                          id={`booking-${name}`}
                          name={name}
                          type="checkbox"
                          required
                          checked={fields[name]}
                          aria-invalid={errors[name] ? true : undefined}
                          aria-describedby={`${name}-error`}
                          data-complete={String(fields[name])}
                          onChange={(e) => update(name, e.target.checked)}
                        />
                        <span className="consent-label">
                          {name === "consent" ? (
                            <>
                              Даю{" "}
                              <HeroLink
                                href="#data-consent"
                                onClick={(e) => {
                                  e.preventDefault();
                                  consentDialog.current?.open();
                                }}
                              >
                                согласие на обработку персональных данных
                              </HeroLink>{" "}
                              для подготовки заявки.
                            </>
                          ) : (
                            <>
                              Ознакомлен(а) с{" "}
                              <HeroLink
                                href="/privacy"
                                target="_blank"
                                rel="noopener"
                              >
                                условиями обработки данных
                              </HeroLink>
                              .
                            </>
                          )}
                        </span>
                      </label>
                      {error(name)}
                    </div>
                  ))}
                </div>
              </form>
            </div>

            <div id="success-panel" hidden={!draft} ref={success}>
              <span className="success-icon" aria-hidden="true">
                ✓
              </span>
              <h2 tabIndex={-1} id="success-title">
                Черновик заявки готов.
              </h2>
              <p>
                Проверьте детали. Заявка ещё не отправлена, запись не
                подтверждена.
              </p>
              <div id="booking-summary" className="booking-summary">
                {draft}
              </div>
              <HeroButton
                id="download-request"
                className="button btn btn--primary full"
                onClick={download}
              >
                Скачать черновик
              </HeroButton>
              <HeroButton
                id="edit-request"
                className="text-link link full"
                onClick={() => {
                  setDraft("");
                  requestAnimationFrame(() => focus("service"));
                }}
              >
                Изменить данные
              </HeroButton>
            </div>
          </div>
        </ModalContent>
      </Modal>
      <ConsentDialog ref={consentDialog} />
    </>
  );
}
