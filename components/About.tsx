"use client";
import { WorksCarousel } from "./WorksCarousel";
import { useCms } from "./CmsProvider";

export function About() {
  const { about } = useCms();
  return (
    <section
      className="section about-section"
      id="about"
      aria-labelledby="about-title"
    >
      <div className="wrap">
        <p className="kicker">Подход к работе</p>
        <h2 id="about-title" className="about-title">
          {about.title}
        </h2>
        <p className="about-lead">{about.lead}</p>
        <ul className="about-facts">
          {about.points.map((pt, idx) => (
            <li key={idx}>
              <strong>{pt.title}</strong>
              <span>{pt.text}</span>
            </li>
          ))}
        </ul>
        <div className="works-head">
          <h3>Выполненные работы</h3>
          <span>листайте</span>
        </div>
        <WorksCarousel />
        <p className="fine-print">Изображения салона — иллюстрации, созданные с помощью ИИ. Это не фотографии выполненных работ.</p>
      </div>
    </section>
  );
}
