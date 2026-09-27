import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/product/product-card";
import { QtyControl } from "@/components/product/qty-control";
import { Button } from "@/components/ui/button";
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
    <main className="bg-void px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-paper">This watch has left the atelier.</h1>
      <Link to="/shop" className="mt-6 inline-block text-sm text-mist underline">
        Back to the shop
      </Link>
    </main>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const add = useCartStore((s) => s.add);
  const hydrated = useHasHydrated();
  const wished = useWishlistStore((s) => s.slugs.includes(product.slug));
  const toggleWish = useWishlistStore((s) => s.toggle);
  const related = relatedProducts(product.slug);

  return (
    <main className="bg-void">
      <div className="site-wrap grid gap-10 py-10 md:grid-cols-2 md:gap-14 md:py-16">
        <div
          className={cn(
            "overflow-hidden rounded-2xl bg-card",
            product.collection === "atelier" ? "aspect-[4/5]" : "aspect-[4/5] p-8 md:p-12",
          )}
        >
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "h-full w-full",
              product.collection === "atelier" ? "object-cover" : "object-contain",
            )}
          />
        </div>
        <div className="flex flex-col justify-center text-paper">
          <p className="text-[11px] tracking-[0.22em] text-rose uppercase">{product.category}</p>
          <h1 className="mt-3 font-display text-4xl font-medium md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-xl tabular-nums text-cloud">{formatPrice(product.price)}</p>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mist">{product.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QtyControl value={qty} onChange={setQty} className="border-line-dark bg-void text-paper" />
            <Button
              variant="light"
              onClick={() => {
                add(product.slug, qty);
                toast.success(`${product.name} added to bag`);
              }}
            >
              Add to bag
            </Button>
            <Button
              variant="line"
              size="icon"
              aria-label="Wishlist"
              onClick={() => toggleWish(product.slug)}
            >
              <Heart className={cn("size-4", hydrated && wished && "fill-paper")} />
            </Button>
          </div>
          <dl className="mt-10 grid grid-cols-1 gap-3 border-t border-line-dark pt-8 sm:grid-cols-2">
            {product.specs.map((spec) => (
              <div key={spec.label}>
                <dt className="text-[11px] tracking-[0.16em] text-ash uppercase">{spec.label}</dt>
                <dd className="mt-1 text-sm text-cloud">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <section className="site-wrap pb-20">
        <h2 className="mb-8 font-display text-2xl text-mist">You may also like</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
