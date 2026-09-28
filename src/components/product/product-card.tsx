import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useHasHydrated } from "@/lib/hydrate";
import { useWishlistStore } from "@/lib/wishlist-store";
import { Reveal } from "@/components/motion/reveal";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const hydrated = useHasHydrated();
  const wished = useWishlistStore((s) => s.slugs.includes(product.slug));
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <Reveal delay={(index % 4) * 90}>
    <article className="group relative">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-soft aspect-[4/5] p-3 sm:p-4 md:p-6">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
        </div>
        <h3 className="mt-2 sm:mt-3 text-[12px] sm:text-[13px] text-ink">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          {product.compareAt && product.compareAt > product.price && (
            <span className="text-[11px] sm:text-[12px] text-ash line-through tabular-nums">
              {formatPrice(product.compareAt)}
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
        className="absolute top-2 right-2 sm:top-3 sm:right-3 flex size-8 sm:size-10 items-center justify-center rounded-full bg-black/30 text-white opacity-100 backdrop-blur-sm transition-[opacity,transform] duration-200 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100"
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
