"use client";
import { Accordion, AccordionItem } from "@heroui/react";
import { useCms } from "./CmsProvider";

export function Faq() {
  const { faq } = useCms();
  return (
    <section className="section faq-section" id="faq" aria-labelledby="faq-title">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="kicker">Вопросы</p>
            <h2 id="faq-title">Отвечаем до начала работ.</h2>
          </div>
        </div>
        <Accordion variant="splitted" className="faq-list px-0">
          {faq.map((item) => (
            <AccordionItem key={item.id} aria-label={item.q} title={item.q}>
              <p className="text-muted pb-2">{item.a}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}