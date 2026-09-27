import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/layout/page-intro";
import { ProductCard } from "@/components/product/product-card";
import { buttonVariants } from "@/components/ui/button";
import { getProduct } from "@/data/products";
import { useHasHydrated } from "@/lib/hydrate";
import { useWishlistStore } from "@/lib/wishlist-store";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({ meta: [{ title: "Wishlist — UrbanTick" }] }),
});

function WishlistPage() {
  const hydrated = useHasHydrated();
  const slugs = useWishlistStore((s) => s.slugs);
  const items = hydrated ? slugs.map(getProduct).filter((p) => p != null) : [];

  return (
    <main className="bg-void">
      <PageIntro kicker="Saved" title="Wishlist" lede="Pieces you have set aside." />
      <div className="site-wrap py-12 pb-20">
        {!hydrated ? (
          <p className="text-mist">Loading…</p>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-mist">Nothing saved yet.</p>
            <Link to="/shop" className={buttonVariants({ variant: "line" }) + " mt-6"}>
              Browse the shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {items.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
