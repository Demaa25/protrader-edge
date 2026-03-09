import Navbar from "./Navbar";
import Footer from "./Footer";
import styles from "./MarketingShell.module.css";

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <Navbar />
      <div className={styles.content}>{children}</div>
      <Footer />
    </div>
  );
}
