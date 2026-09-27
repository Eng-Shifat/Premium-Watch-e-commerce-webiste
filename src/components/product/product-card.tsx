import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useHasHydrated } from "@/lib/hydrate";
import { useWishlistStore } from "@/lib/wishlist-store";

export function ProductCard({ product }: { product: Product }) {
  const hydrated = useHasHydrated();
  const wished = useWishlistStore((s) => s.slugs.includes(product.slug));
  const toggle = useWishlistStore((s) => s.toggle);
  const editorial = product.collection === "atelier";

  return (
    <article className="group relative">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl bg-card",
            editorial ? "aspect-[4/5]" : "aspect-[4/5] p-5 sm:p-7",
          )}
        >
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]",
              editorial ? "object-cover" : "object-contain",
            )}
            loading="lazy"
            decoding="async"
          />
        </div>
        <h3 className="mt-3 text-[13px] text-muted-dark">{product.name}</h3>
        <p className="mt-1 text-[12px] text-mist tabular-nums">{formatPrice(product.price)}</p>
      </Link>
      <button
        type="button"
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => toggle(product.slug)}
        className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full bg-void/40 text-paper opacity-100 backdrop-blur-sm transition-[opacity,transform] duration-200 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100"
      >
        <Heart
          className={cn("size-4", hydrated && wished && "fill-paper")}
          strokeWidth={1.6}
        />
      </button>
    </article>
  );
}
