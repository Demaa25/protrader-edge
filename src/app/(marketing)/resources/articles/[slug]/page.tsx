//src/app/(marketing)/resources/articles/[slug]/page.tsx
import { notFound } from "next/navigation";
import styles from "./slug.module.css";

const ARTICLE_CONTENT: Record<string, { title: string; body: string }> = {
  "market-structure-not-direction": {
    title: "Why Market Structure Is Not Direction",
    body: `
Market structure is frequently misused as a directional forecasting tool.
Professionals treat structure as context, not prediction.

Structure defines where participation is permitted and where risk must be
controlled. Direction emerges from behavior, not structure itself.
`
  },
  "liquidity-is-a-behavior": {
    title: "Liquidity Is a Behavior, Not a Location",
    body: `
Liquidity does not sit at price levels. It emerges through behavior,
expectation, and participation imbalance.

Understanding liquidity as a process prevents static level fixation.
`
  },
  "trade-permission-vs-opportunity": {
    title: "Trade Permission vs Trade Opportunity",
    body: `
Professional execution requires more than opportunity. Permission is granted
only when context, risk, and structure align.
`
  },
  "risk-is-a-process": {
    title: "Risk Is a Process, Not a Percentage",
    body: `
Risk governance focuses on exposure sequencing, drawdown behavior, and regime
alignment—not fixed percentages.
`
  }
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = ARTICLE_CONTENT[slug];
  if (!article) return notFound();

  const paragraphs = article.body
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <article className={styles.article}>
          <h1 className={styles.title}>{article.title}</h1>

          {paragraphs.map((p, i) => (
            <p key={i} className={styles.paragraph}>
              {p}
            </p>
          ))}
        </article>

        <div className={styles.back}>
          <a href="/resources/articles" className={styles.backLink}>
            ← Back to Articles
          </a>
        </div>
      </div>
    </main>
  );
}
