import { createFileRoute, Link } from "@tanstack/react-router";
import { getProduct } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useHasHydrated } from "@/lib/hydrate";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useCartStore } from "@/lib/cart-store";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({ meta: [{ title: "Wishlist — UrbanTick" }] }),
});

function WishlistPage() {
  const hydrated = useHasHydrated();
  const slugs = useWishlistStore((s) => s.slugs);
  const remove = useWishlistStore((s) => s.remove);
  const addToCart = useCartStore((s) => s.add);
  const items = hydrated ? slugs.map(getProduct).filter((p) => p != null) : [];

  return (
    <main className="min-h-screen bg-paper">
      <div className="site-wrap py-8 pb-24">
        {/* Page heading */}
        <h1 className="mb-6 text-[20px] font-medium text-ink sm:text-[22px]">My Wishlist</h1>

        {!hydrated ? (
          <p className="text-mist">Loading…</p>
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-4 text-mist">Your wishlist is empty.</p>
            <Link
              to="/shop"
              className="inline-block rounded-full bg-ink px-6 py-2.5 text-[13px] font-medium text-paper transition-opacity hover:opacity-75"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-line overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid sm:grid-cols-[2fr_3fr_1.5fr] bg-[#f0eeec] px-6 py-4 text-[13px] font-medium text-ink">
              <span>Product</span>
              <span>Details</span>
              <span>Price</span>
            </div>

            {/* Rows */}
            {items.map((product, idx) => (
              <div
                key={product.slug}
                className={`px-4 py-5 sm:px-6 ${
                  idx < items.length - 1 ? "border-b border-line" : ""
                }`}
              >
                {/* Mobile layout: stack */}
                <div className="flex gap-4 sm:hidden">
                  <div className="flex flex-col items-start gap-2 shrink-0">
                    <div className="h-[80px] w-[80px] overflow-hidden rounded-lg bg-soft">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain p-2"
                        loading="lazy"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(product.slug)}
                      className="text-[12px] text-ash underline underline-offset-2 hover:text-ink transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-2">
                    <span className="text-[14px] font-medium text-ink">{product.name}</span>
                    <span className="text-[13px] text-ash tabular-nums">
                      {formatPrice(product.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => addToCart(product.slug)}
                      className="mt-1 w-fit rounded-full bg-ink px-4 py-2 text-[12px] font-medium text-paper transition-opacity hover:opacity-75"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>

                {/* Desktop layout: 3-column grid */}
                <div className="hidden sm:grid sm:grid-cols-[2fr_3fr_1.5fr] sm:items-center">
                  {/* Product image + Remove */}
                  <div className="flex flex-col items-start gap-2">
                    <div className="h-[90px] w-[90px] overflow-hidden rounded-lg bg-soft">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain p-2"
                        loading="lazy"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(product.slug)}
                      className="text-[12px] text-ash underline underline-offset-2 hover:text-ink transition-colors"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[14px] text-ink">{product.name}</span>
                    <button
                      type="button"
                      onClick={() => addToCart(product.slug)}
                      className="w-fit rounded-full bg-ink px-5 py-2 text-[13px] font-medium text-paper transition-opacity hover:opacity-75"
                    >
                      Add To Cart
                    </button>
                  </div>

                  {/* Price */}
                  <span className="text-[14px] font-medium text-ink tabular-nums">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
