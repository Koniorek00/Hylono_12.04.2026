import type { ReactNode } from "react";

export const metadata = {
  title: "Stack — Hylono Control Panel",
  description: "Hylono Stack v5.6 — master implementation plan, 59 services across 4 phases.",
};

export default function StackLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}