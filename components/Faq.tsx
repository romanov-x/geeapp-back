"use client";
import { Accordion, AccordionItem } from "@heroui/react";
import { useCms } from "./CmsProvider";
import { BookingButton } from "./BookingButton";

export function Faq() {
  const { faq } = useCms();
  return (
    <section className="section faq-section" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq-layout">
        <div className="faq-intro">
          <p className="kicker">Вопросы</p>
          <h2 id="faq-title">Отвечаем до начала работ.</h2>
          <p>О совместимости, стоимости и настройке штатной мультимедиа.</p>
        </div>
        <div className="faq-list">
          <Accordion variant="splitted" selectionMode="multiple" className="hero-faq">
            {faq.map((item) => (
              <AccordionItem
                key={item.id}
                aria-label={item.q}
                title={item.q}
                classNames={{
                  base: "hero-faq-item",
                  title: "text-ink text-base font-medium",
                  content: "text-muted leading-relaxed",
                }}
              >
                <p className="text-muted pb-2">{item.a}</p>
              </AccordionItem>
            ))}
          </Accordion>
          <BookingButton className="button faq-question" manual>
            Задать вопрос в заявке
          </BookingButton>
        </div>
      </div>
    </section>
  );
}
