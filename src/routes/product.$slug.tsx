import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Star, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/product/product-card";
import { getProduct, relatedProducts } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { useHasHydrated } from "@/lib/hydrate";
import { useWishlistStore } from "@/lib/wishlist-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  component: ProductPage,
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.product.name ?? "Watch"} — UrbanTick` }],
  }),
  notFoundComponent: () => (
    <main className="bg-paper px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-ink">This watch has left the atelier.</h1>
      <Link to="/shop" className="mt-6 inline-block text-sm text-ash underline">
        Back to the shop
      </Link>
    </main>
  ),
});

const PRODUCT_META: Record<string, { rating: number; reviews: number; colors: string[] }> = {
  "chronographs":            { rating: 4.3, reviews: 214, colors: ["Brown", "Black"] },
  "aviator-watches":         { rating: 4.7, reviews: 386, colors: ["Rose Gold", "Silver"] },
  "onlyou-3rd-edition":      { rating: 4.5, reviews: 301, colors: ["Silver", "Black"] },
  "sunmate-green-edition":   { rating: 4.6, reviews: 158, colors: ["Green", "Blue"] },
  "chronographs-nl":         { rating: 4.3, reviews: 214, colors: ["Brown", "Black"] },
  "aviator-watches-nl":      { rating: 4.7, reviews: 386, colors: ["Rose Gold", "Silver"] },
  "onlyou-3rd-edition-nl":   { rating: 4.5, reviews: 301, colors: ["Silver", "Black"] },
  "sunmate-green-edition-nl":{ rating: 4.6, reviews: 158, colors: ["Green", "Blue"] },
};

function getMeta(slug: string) {
  return PRODUCT_META[slug] ?? { rating: 4.4, reviews: 120, colors: ["Silver"] };
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  const add = useCartStore((s) => s.add);
  const hydrated = useHasHydrated();
  const wished = useWishlistStore((s) => s.slugs.includes(product.slug));
  const toggleWish = useWishlistStore((s) => s.toggle);
  const related = relatedProducts(product.slug);

  const gallery =
    product.gallery.length > 1
      ? product.gallery
      : [product.image, product.image, product.image];

  const [activeImg, setActiveImg] = useState(0);
  const meta = getMeta(product.slug);
  const [selectedColor, setSelectedColor] = useState(meta.colors[0]);

  const hasDiscount = Boolean(product.compareAt && product.compareAt > product.price);
  const discountPct =
    hasDiscount && product.compareAt
      ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
      : 0;

  return (
    <main className="bg-paper text-ink">

      {/* ── Product section ── */}
      <div className="site-wrap py-6 md:py-10 lg:py-14">

        {/* Mobile: stacked. Desktop: side by side */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-10 lg:gap-16">

          {/* ── Image area ── */}
          <div className="flex w-full gap-3 md:w-auto md:flex-1 md:max-w-[500px] md:gap-4">

            {/* Thumbnail strip — vertical on desktop, hidden on mobile */}
            {gallery.length > 1 && (
              <div className="hidden md:flex md:flex-col md:gap-2.5">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      "size-[80px] shrink-0 overflow-hidden rounded-xl border-2 bg-soft p-1.5 transition-all duration-200",
                      activeImg === i ? "border-ink" : "border-line hover:border-ink/40",
                    )}
                  >
                    <img src={src} alt={`View ${i + 1}`} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="relative flex-1 overflow-hidden rounded-2xl bg-soft aspect-[4/5] p-6 sm:p-8">
              <img
                src={gallery[activeImg]}
                alt={product.name}
                className="h-full w-full object-contain transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Mobile thumbnail strip — horizontal, shown only on mobile */}
          {gallery.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 md:hidden -mt-1">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "size-[60px] shrink-0 overflow-hidden rounded-xl border-2 bg-soft p-1 transition-all duration-200",
                    activeImg === i ? "border-ink" : "border-line hover:border-ink/40",
                  )}
                >
                  <img src={src} alt={`View ${i + 1}`} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* ── Details ── */}
          <div className="flex w-full flex-col md:flex-1">

            {/* Title + wishlist */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-[20px] font-semibold leading-snug text-ink sm:text-[22px] md:text-[24px] lg:text-[26px]">
                {product.name}
              </h1>
              <button
                type="button"
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                onClick={() => toggleWish(product.slug)}
                className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-line transition-all hover:border-ink/40 hover:bg-soft active:scale-90"
              >
                <Heart
                  className={cn(
                    "size-[18px] text-ink/40",
                    hydrated && wished && "fill-ink text-ink",
                  )}
                  strokeWidth={1.6}
                />
              </button>
            </div>

            {/* Price */}
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <span className="text-[22px] font-bold text-ink tabular-nums sm:text-[24px]">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && product.compareAt && (
                <>
                  <span className="text-[14px] text-ash line-through tabular-nums">
                    {formatPrice(product.compareAt)}
                  </span>
                  <span className="rounded-md bg-green-50 px-2 py-0.5 text-[12px] font-semibold text-green-600">
                    {discountPct}% off
                  </span>
                </>
              )}
            </div>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-2">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <span className="text-[14px] font-semibold text-ink">{meta.rating.toFixed(1)}</span>
              <span className="text-[13px] text-ash">| {meta.reviews} reviews</span>
            </div>

            <div className="my-5 h-px bg-line" />

            {/* Product Details */}
            <div>
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-ink/50">
                Product Details
              </p>
              <dl className="space-y-2">
                {product.specs.slice(0, 3).map((spec) => (
                  <div key={spec.label} className="flex gap-1.5 text-[14px]">
                    <dt className="text-ash">{spec.label}:</dt>
                    <dd className="font-medium text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Color selector */}
            {meta.colors.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-[14px] font-medium text-ink">Select Color</span>
                <div className="flex gap-2">
                  {meta.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={cn(
                        "h-8 rounded-full px-4 text-[12px] font-medium transition-all duration-150 border",
                        selectedColor === c
                          ? "bg-ink text-paper border-ink"
                          : "bg-paper text-ink border-line hover:border-ink/50"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  add(product.slug, 1);
                  toast.success(`${product.name} added to bag`);
                }}
                className="h-12 flex-1 rounded-full bg-ink px-6 text-[14px] font-semibold text-paper transition-all duration-200 hover:bg-ink/85 hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] active:scale-95 sm:flex-none sm:px-10"
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={() => {
                  add(product.slug, 1);
                  toast.success(`${product.name} added to cart`);
                }}
                className="h-12 flex-1 rounded-full border-2 border-ink bg-paper px-6 text-[14px] font-semibold text-ink transition-all duration-200 hover:bg-soft active:scale-95 sm:flex-none sm:px-10"
              >
                Add To Cart
              </button>
            </div>

          </div>
        </div>

        {/* Desktop-only: thumbnail strip shown inline left of main image */}
        {/* Already handled above via column layout on md */}
      </div>

      {/* ── Similar Collection ── */}
      <div className="border-t border-line">
        <div className="site-wrap py-10 pb-16 md:py-12 md:pb-20">
          <h2 className="mb-6 text-[20px] font-semibold text-ink md:mb-8 md:text-[24px]">
            Similar Collection
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} variant="inline" />
            ))}
          </div>
        </div>
      </div>

    </main>
  );
}
