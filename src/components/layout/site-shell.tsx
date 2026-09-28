import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // pages designed on a white canvas; every other page still uses the dark theme
  const light = pathname === "/" || pathname === "/shop";
  return (
    <div className={cn("flex min-h-svh flex-col", light ? "bg-paper text-ink" : "bg-void text-paper")}>
      <Header />
      {/* keyed by path so every page change plays the enter animation */}
      <div key={pathname} className="page-enter flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
