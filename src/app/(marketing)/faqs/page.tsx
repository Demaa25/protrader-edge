//src/app/(marketing)/faqs/page.tsx
"use client";

import { useMemo, useState } from "react";
import styles from "./faqs.module.css";

type FAQItem = {
  question: string;
  answer: string;
};

export default function FAQsPage() {
  const items: FAQItem[] = useMemo(
    () => [
      {
        question: "Who are the programs for?",
        answer:
          "Our programs are designed for serious traders who want structured, professional training. Level 1 is suitable for beginners. Higher levels require prior knowledge or certification.",
      },
      {
        question: "Can I skip levels?",
        answer:
          "Yes, if you already have trading experience, you may start at a higher level after screening. Beginners must start from Level 1.",
      },
      {
        question: "How long does each level take?",
        answer:
          "Each level is self-paced but gated. You progress after completing all lessons and passing assessments.",
      },
      {
        question: "Is certification automatic?",
        answer:
          "No. Certification is earned by completing lessons, passing assessments, and meeting progression criteria.",
      },
      {
        question: "Do you provide signals?",
        answer:
          "No. We train traders to think, analyze, and execute independently. Signals are not part of professional trading education.",
      },
      {
        question: "What markets do you cover?",
        answer:
          "Our primary focus is Forex and related derivatives, using institutional market structure principles.",
      },
      {
        question: "Do I get lifetime access?",
        answer:
          "Access terms depend on your enrollment plan. Certification records are permanent.",
      },
      {
        question: "Can I buy tools without joining the program?",
        answer:
          "Yes. Trading tools are sold separately and delivered by email. An LMS account is not required.",
      },
    ],
    []
  );

  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>FAQs</h1>
        </header>

        <section className={styles.accordion} aria-label="Frequently Asked Questions">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question} className={styles.item}>
                <button
                  type="button"
                  className={styles.questionRow}
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                >
                  <span className={styles.questionText}>
                    <span className={styles.qIndex}>{idx + 1}.</span> {item.question}
                  </span>

                  <span className={styles.icon} aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div className={`${styles.answerWrap} ${isOpen ? styles.open : ""}`}>
                  <div className={styles.answerInner}>
                    <p className={styles.answer}>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
