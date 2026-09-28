import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-svh flex-col bg-void text-paper">
      <Header />
      {/* keyed by path so every page change plays the enter animation */}
      <div key={pathname} className="page-enter flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
