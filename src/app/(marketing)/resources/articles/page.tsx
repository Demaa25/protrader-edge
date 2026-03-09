//src/app/(marketing)/resources/articles/page.tsx
import Link from "next/link";
import styles from "./articles.module.css";

const articles = [
  {
    title: "Why Market Structure Is Not Direction",
    slug: "market-structure-not-direction",
    category: "Market Structure",
    excerpt: "Market structure contextualizes behavior. It does not predict price.",
  },
  {
    title: "Liquidity Is a Behavior, Not a Location",
    slug: "liquidity-is-a-behavior",
    category: "Liquidity",
    excerpt: "Liquidity forms through participant behavior, not static price levels.",
  },
  {
    title: "Trade Permission vs Trade Opportunity",
    slug: "trade-permission-vs-opportunity",
    category: "Execution",
    excerpt: "A valid setup is not a mandate to trade.",
  },
  {
    title: "Risk Is a Process, Not a Percentage",
    slug: "risk-is-a-process",
    category: "Risk",
    excerpt: "Institutional risk management governs exposure, not just position size.",
  },
];

export default function ArticlesPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* HERO */}
        <header className={styles.hero}>
          <h1 className={styles.title}>Articles &amp; Insights</h1>
          <p className={styles.intro}>
            Applied thinking on market behavior, execution discipline, and professional risk
            management.
          </p>
        </header>

        {/* EXPLAINER */}
        <section className={styles.section}>
          <p className={styles.p}>
            Articles clarify professional trading concepts and dismantle common misconceptions. They
            are not lessons, signals, or strategies.
          </p>
        </section>

        {/* LIST */}
        <section className={`${styles.section} ${styles.grid}`} aria-label="Articles list">
          {articles.map((article) => (
            <div key={article.slug} className={styles.card}>
              <div>
                <h2 className={styles.cardTitle}>{article.title}</h2>
                <p className={styles.category}>{article.category}</p>
                <p className={styles.excerpt}>{article.excerpt}</p>
              </div>

              <Link href={`/resources/articles/${article.slug}`} className={styles.readLink}>
                Read Article <span className={styles.arrow}>→</span>
              </Link>
            </div>
          ))}
        </section>

        {/* MUTED NOTE */}
        <section className={`${styles.section} ${styles.muted}`}>
          <p className={styles.p}>
            Formal skill acquisition, assessment, and certification occur inside the ProTrader Edge
            LMS.
          </p>
        </section>

        {/* CTA */}
        <section className={`${styles.section} ${styles.cta}`}>
          <Link href="/how-progression-works" className={styles.ctaLink}>
            How Progression Works <span className={styles.arrow}>→</span>
          </Link>
          <Link href="/programs" className={styles.ctaLink}>
            View Programs <span className={styles.arrow}>→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
