import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { useHasHydrated } from "@/lib/hydrate";
import { cartCount, useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact Us" },
  { to: "/about", label: "About Us" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const hydrated = useHasHydrated();
  const bag = useCartStore((s) => cartCount(s.lines));
  const wishes = useWishlistStore((s) => s.slugs.length);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // On the home page the bar is fully transparent over the hero until you scroll.
  // Everywhere else (dark pages) it is always frosted glass.
  const glass = scrolled || open || !isHome;

  return (
    <header className={cn("header-in sticky top-0 z-40 text-ink", isHome && "-mb-[72px]")}>
      {/* glass layer — separate from the content so the mobile menu can blur on its own */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out",
          glass
            ? cn(
                "border-white/40 bg-white/90 shadow-[0_1px_24px_rgba(0,0,0,0.06)] supports-[backdrop-filter]:backdrop-blur-xl supports-[backdrop-filter]:backdrop-saturate-150",
                isHome
                  ? "supports-[backdrop-filter]:bg-white/55"
                  : "supports-[backdrop-filter]:bg-white/80",
              )
            : "border-transparent bg-transparent",
        )}
      />

      <div className="site-wrap grid h-[72px] grid-cols-[1fr_auto_1fr] items-center">
        <nav className="hidden items-center gap-7 text-[13px] text-ash md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group relative py-1 transition-colors duration-200 hover:text-ink",
                  active && "text-ink",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-ink transition-transform duration-300 ease-out",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="flex size-11 items-center justify-center md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <IconLink to="/wishlist" label="Wishlist">
            <Heart className="size-[18px]" />
            {hydrated && wishes > 0 ? <Count n={wishes} /> : null}
          </IconLink>
          <IconLink to="/account" label="Account">
            <User className="size-[18px]" />
          </IconLink>
          <IconLink to="/cart" label="Cart">
            <ShoppingBag className="size-[18px]" />
            {hydrated && bag > 0 ? <Count n={bag} /> : null}
          </IconLink>
        </div>
      </div>

      {open ? (
        <div className="menu-panel absolute inset-x-0 top-full border-t border-white/40 bg-white/90 shadow-[0_18px_40px_rgba(0,0,0,0.08)] supports-[backdrop-filter]:bg-white/65 supports-[backdrop-filter]:backdrop-blur-xl supports-[backdrop-filter]:backdrop-saturate-150 md:hidden">
          <nav className="site-wrap flex flex-col py-2" aria-label="Mobile">
            {nav.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                className="menu-item flex h-12 items-center text-sm text-ink transition-opacity duration-150 active:opacity-60"
                style={{ animationDelay: `${60 + i * 60}ms` }}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function IconLink({
  to,
  label,
  children,
}: {
  to: "/wishlist" | "/account" | "/cart";
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="relative flex size-11 items-center justify-center text-ink transition-[opacity,transform] duration-200 hover:scale-110 hover:opacity-70 active:scale-95"
    >
      {children}
    </Link>
  );
}

function Count({ n }: { n: number }) {
  return (
    <span
      key={n}
      className="badge-pop absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-medium text-paper tabular-nums"
    >
      {n}
    </span>
  );
}
