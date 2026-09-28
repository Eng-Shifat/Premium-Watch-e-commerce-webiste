import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useHasHydrated } from "@/lib/hydrate";
import { useWishlistStore } from "@/lib/wishlist-store";
import { Reveal } from "@/components/motion/reveal";

type ProductCardProps = {
  product: Product;
  index?: number;
  variant?: "overlay" | "inline";
};

export function ProductCard({ product, index = 0, variant = "overlay" }: ProductCardProps) {
  const hydrated = useHasHydrated();
  const wished = useWishlistStore((s) => s.slugs.includes(product.slug));
  const toggle = useWishlistStore((s) => s.toggle);
  const hasDiscount = Boolean(product.compareAt && product.compareAt > product.price);

  const photo = (
    <div className="relative overflow-hidden rounded-2xl bg-[#f5f3f1] aspect-[4/5] p-4 sm:p-5 transition-all duration-500 group-hover:bg-[#eeecea]">
      <img
        src={product.image}
        alt={product.name}
        className="h-full w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        loading="lazy"
        decoding="async"
      />
      {/* subtle shine on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl" />
    </div>
  );

  if (variant === "inline") {
    return (
      <Reveal delay={(index % 3) * 90}>
        <article className="group shop-card">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
            {photo}
          </Link>
          <div className="mt-3.5 px-0.5">
            <div className="flex items-start justify-between gap-2">
              <Link to="/product/$slug" params={{ slug: product.slug }} className="min-w-0 flex-1">
                <h3 className="truncate text-[13px] font-medium leading-snug text-ink/80 transition-colors group-hover:text-ink sm:text-[15px]">
                  {product.name}
                </h3>
                <div className="mt-1.5 flex items-center gap-2">
                  {hasDiscount && (
                    <span className="text-[11px] text-ash/60 line-through tabular-nums">
                      {formatPrice(product.compareAt!)}
                    </span>
                  )}
                  <span className="text-[13px] font-semibold text-ink tabular-nums sm:text-[14px]">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </Link>
              <button
                type="button"
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={hydrated && wished}
                onClick={() => toggle(product.slug)}
                className={cn(
                  "-mr-1 -mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-90",
                  hydrated && wished
                    ? "bg-ink/8 text-ink"
                    : "text-ink/40 hover:text-ink",
                )}
              >
                <Heart
                  className={cn("size-[17px]", hydrated && wished && "fill-ink text-ink")}
                  strokeWidth={1.6}
                />
              </button>
            </div>
          </div>
        </article>
      </Reveal>
    );
  }

  return (
    <Reveal delay={(index % 4) * 90}>
      <article className="group relative">
        <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
          {photo}
          <h3 className="mt-2 sm:mt-3 text-[12px] sm:text-[13px] text-ink">{product.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            {hasDiscount && (
              <span className="text-[11px] sm:text-[12px] text-ash line-through tabular-nums">
                {formatPrice(product.compareAt!)}
              </span>
            )}
            <span className="text-[11px] sm:text-[12px] text-rose font-medium tabular-nums">
              {formatPrice(product.price)}
            </span>
          </div>
        </Link>
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggle(product.slug)}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 flex size-8 sm:size-10 items-center justify-center rounded-full bg-black/25 text-white opacity-100 backdrop-blur-sm transition-[opacity,transform] duration-200 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Heart
            className={cn("size-3.5 sm:size-4", hydrated && wished && "fill-white")}
            strokeWidth={1.6}
          />
        </button>
      </article>
    </Reveal>
  );
}
