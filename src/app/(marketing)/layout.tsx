//src/app/(marketing)/layout.tsx
import "./marketing-globals.css";
import MarketingShell from "@/components/marketing/MarketingShell";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>;
}
