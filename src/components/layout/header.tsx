import { useState, type ReactNode } from "react";
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
  const hydrated = useHasHydrated();
  const bag = useCartStore((s) => cartCount(s.lines));
  const wishes = useWishlistStore((s) => s.slugs.length);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper text-ink">
      <div className="site-wrap grid h-[72px] grid-cols-[1fr_auto_1fr] items-center">
        <nav className="hidden items-center gap-7 text-[13px] text-ash md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "transition-colors duration-150 hover:text-ink",
                  active && "text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="flex size-11 items-center justify-center md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
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
        <div className="border-t border-line bg-paper md:hidden">
          <nav className="site-wrap flex flex-col py-3" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex h-12 items-center text-sm text-ink"
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
      className="relative flex size-11 items-center justify-center text-ink transition-opacity duration-150 hover:opacity-70"
    >
      {children}
    </Link>
  );
}

function Count({ n }: { n: number }) {
  return (
    <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-medium text-paper tabular-nums">
      {n}
    </span>
  );
}
