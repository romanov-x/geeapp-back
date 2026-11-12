"use client";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import {
  Button,
  Card,
  Checkbox,
  Chip,
  Input,
  Link,
  Textarea,
  type ButtonProps,
  type CardProps,
  type LinkProps,
} from "@heroui/react";

const INPUT_LABELS: Record<string, string> = {
  year: "Год выпуска",
  name: "Ваше имя",
  phone: "Телефон",
  makeCustom: "Название марки",
  modelCustom: "Название модели",
};

export const HeroButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function HeroButton({ className = "", disabled, ...props }, ref) {
  const isPrimary = className.includes("primary");
  const isSecondary = className.includes("secondary");

  return (
    <Button
      {...(props as unknown as ButtonProps)}
      ref={ref}
      isDisabled={disabled}
      radius="lg"
      color={isPrimary ? "primary" : "default"}
      variant={isSecondary ? "bordered" : isPrimary ? "solid" : "flat"}
      className={`hero-ui-button ${className}`.trim()}
    />
  );
});

export const HeroLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>(function HeroLink({ className = "", ...props }, ref) {
  return (
    <Link
      {...(props as unknown as LinkProps)}
      ref={ref}
      className={`hero-ui-link ${className}`.trim()}
    />
  );
});

export const HeroCard = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  function HeroCard(props, ref) {
    return (
      <Card
        as="article"
        radius="lg"
        shadow="none"
        {...(props as unknown as CardProps)}
        ref={ref as React.Ref<HTMLDivElement>}
      />
    );
  }
);

export function HeroChip({
  children,
  className = "",
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <Chip radius="full" size="sm" variant="flat" className={className}>
      {children}
    </Chip>
  );
}

export const HeroInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function HeroInput({ type, checked, onChange, ...props }, ref) {
  if (type === "checkbox") {
    return (
      <Checkbox
        {...(props as object)}
        isSelected={Boolean(checked)}
        onValueChange={(value) =>
          onChange?.({
            target: { checked: value },
            currentTarget: { checked: value },
          } as React.ChangeEvent<HTMLInputElement>)
        }
        classNames={{ base: "hero-consent-checkbox", label: "hidden" }}
        aria-label={
          props.name === "consent"
            ? "Согласие на обработку данных"
            : "Ознакомление с условиями"
        }
      />
    );
  }

  return (
    <Input
      {...(props as object)}
      ref={ref}
      aria-label={props["aria-label"] || INPUT_LABELS[props.name || ""]}
      type={type}
      onChange={onChange}
      variant="bordered"
      radius="lg"
      classNames={{
        inputWrapper: "hero-input-wrapper",
        input: "hero-native-input",
      }}
    />
  );
});

export const HeroTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function HeroTextarea(props, ref) {
  return (
    <Textarea
      {...(props as object)}
      aria-label="Что хотите настроить?"
      ref={ref}
      variant="bordered"
      radius="lg"
      minRows={3}
      classNames={{
        inputWrapper: "hero-input-wrapper",
        input: "hero-native-input",
      }}
    />
  );
});