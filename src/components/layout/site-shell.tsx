import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-void text-paper">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
