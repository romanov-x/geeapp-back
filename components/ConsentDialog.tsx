"use client";
import { Modal, ModalContent, ModalHeader } from "@heroui/react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { HeroButton, HeroLink } from "@/components/HeroPrimitives";

export type ConsentHandle = { open: () => void };

export const ConsentDialog = forwardRef<ConsentHandle>(function ConsentDialog(
  _,
  ref
) {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
  }));

  useEffect(() => {
    if (location.hash === "#data-consent") {
      setIsOpen(true);
    }
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      hideCloseButton
      backdrop="blur"
      scrollBehavior="inside"
      size="2xl"
      aria-labelledby="consent-title"
      classNames={{
        base: "hero-ui-modal",
        backdrop: "hero-ui-backdrop",
      }}
    >
      <ModalContent>
        <ModalHeader className="sr-only">
          Согласие на обработку данных
        </ModalHeader>
        <div id="data-consent" className="hero-dialog-body">
          <div className="dialog-controls">
            <HeroButton
              className="close-modal"
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть согласие"
            >
              ×
            </HeroButton>
          </div>
          <div className="consent-document">
            <HeroLink className="brand" href="/">
              geeapp.
            </HeroLink>
            <h2 id="consent-title">Согласие на обработку данных.</h2>
            <p>
              Версия от 12 ноября 2026 года. Действует для локального черновика
              заявки.
            </p>
            <h2>Оператор</h2>
            <p>
              ИП Романов Сергей Владимирович, ИНН 745901691501. Адрес: г. Верхний
              Уфалей, ул. Ленина. Электронная почта:{" "}
              <HeroLink href="mailto:info@geeapp.ru">info@geeapp.ru</HeroLink>.
            </p>
            <p>
              Ставя отдельную отметку в форме, я соглашаюсь на обработку
              введённых мной имени, телефона, сведений об автомобиле, выбранной
              услуге и описания задачи в открытой вкладке браузера исключительно
              для подготовки и скачивания черновика заявки.
            </p>
            <p>
              Обработка включает ввод, проверку, форматирование и формирование
              текстового файла. Данные не передаются на сервер, в мессенджеры или
              третьим лицам и не используются для рекламы. Отметки формы не
              являются согласием на рекламные рассылки.
            </p>
            <p>
              До подготовки черновика можно снять отметку согласия. Для удаления
              данных из формы закройте или перезагрузите вкладку. Скачанный файл
              удаляется пользователем со своего устройства самостоятельно.
            </p>
            <p>
              Отправка заявки пока не подключена. Обратиться к оператору или
              отозвать согласие можно по адресу info@geeapp.ru. В этой версии
              данные существуют в открытой вкладке до её перезагрузки или
              закрытия; оператор их не получает. Перед подключением отправки
              будут отдельно описаны серверное хранение, сроки удаления и
              получатели данных.
            </p>
            <HeroLink className="text-link" href="/privacy">
              Условия обработки данных
            </HeroLink>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
});