import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const light = pathname === "/" || pathname === "/shop" || pathname.startsWith("/product/") || pathname === "/wishlist" || pathname === "/cart" || pathname === "/checkout" || pathname === "/account" || pathname === "/contact" || pathname === "/about" || pathname === "/support" || pathname === "/order-status" || pathname === "/privacy" || pathname === "/shipping" || pathname === "/terms" || pathname === "/complaint" || pathname === "/payment" || pathname === "/login" || pathname === "/signup" || pathname === "/verify-otp";
  return (
    <div className={cn("flex min-h-svh flex-col", light ? "bg-paper text-ink" : "bg-void text-paper")}>
      <Header />
      <div key={pathname} className="page-enter flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
