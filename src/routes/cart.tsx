import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Tag } from "lucide-react";
import { QtyControl } from "@/components/product/qty-control";
import { getProduct } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { useHasHydrated } from "@/lib/hydrate";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Cart — UrbanTick" }] }),
});

function CartPage() {
  const hydrated = useHasHydrated();
  const lines = useCartStore((s) => s.lines);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");

  const resolved = hydrated
    ? lines
        .map((l) => {
          const product = getProduct(l.slug);
          return product ? { ...l, product } : null;
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
    : [];

  const subtotal = resolved.reduce((n, l) => n + l.product.price * l.qty, 0);

  return (
    <main className="min-h-screen bg-paper">
      <div className="site-wrap py-8 pb-24">
        <h1 className="mb-6 text-[20px] font-medium text-ink sm:text-[22px]">My Cart</h1>

        {!hydrated ? (
          <p className="text-mist">Loading…</p>
        ) : resolved.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-4 text-mist">Your cart is empty.</p>
            <Link
              to="/shop"
              className="inline-block rounded-full bg-ink px-6 py-2.5 text-[13px] font-medium text-paper transition-opacity hover:opacity-75"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
            {/* ── Cart table ── */}
            <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-line">
              {/* Header — hidden on mobile */}
              <div className="hidden sm:grid sm:grid-cols-[2.5fr_1fr_1.5fr_1fr] bg-[#f0eeec] px-6 py-4 text-[13px] font-medium text-ink">
                <span>Product</span>
                <span>Price</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
              </div>

              {/* Rows */}
              {resolved.map((line, idx) => (
                <div
                  key={line.slug}
                  className={`px-4 py-5 sm:px-6 ${
                    idx < resolved.length - 1 ? "border-b border-line" : ""
                  }`}
                >
                  {/* Mobile layout */}
                  <div className="flex gap-4 sm:hidden">
                    <Link
                      to="/product/$slug"
                      params={{ slug: line.slug }}
                      className="h-[80px] w-[80px] shrink-0 overflow-hidden rounded-lg bg-soft"
                    >
                      <img
                        src={line.product.image}
                        alt={line.product.name}
                        className="h-full w-full object-contain p-2"
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col gap-1.5">
                      <span className="text-[14px] font-medium text-ink leading-snug">
                        {line.product.name}
                      </span>
                      <span className="text-[12px] text-ash tabular-nums">
                        {formatPrice(line.product.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(line.slug)}
                        className="w-fit text-[12px] text-ash underline underline-offset-2 hover:text-ink transition-colors"
                      >
                        Remove
                      </button>
                      <span className="text-[11px] text-mist">In Stock</span>
                      <div className="mt-1 flex items-center justify-between">
                        <QtyControl
                          value={line.qty}
                          onChange={(n) => setQty(line.slug, n)}
                        />
                        <span className="text-[14px] font-medium text-ink tabular-nums">
                          {formatPrice(line.product.price * line.qty)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:grid sm:grid-cols-[2.5fr_1fr_1.5fr_1fr] sm:items-center">
                    {/* Product */}
                    <div className="flex items-center gap-4">
                      <Link
                        to="/product/$slug"
                        params={{ slug: line.slug }}
                        className="h-[90px] w-[90px] shrink-0 overflow-hidden rounded-lg bg-soft"
                      >
                        <img
                          src={line.product.image}
                          alt={line.product.name}
                          className="h-full w-full object-contain p-2"
                          loading="lazy"
                        />
                      </Link>
                      <div className="flex flex-col gap-1">
                        <span className="text-[14px] text-ink leading-snug">
                          {line.product.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(line.slug)}
                          className="w-fit text-[12px] text-ash underline underline-offset-2 hover:text-ink transition-colors"
                        >
                          Remove
                        </button>
                        <span className="text-[12px] text-mist">In Stock</span>
                      </div>
                    </div>

                    {/* Price */}
                    <span className="text-[14px] text-ink tabular-nums">
                      {formatPrice(line.product.price)}
                    </span>

                    {/* Quantity */}
                    <div className="flex justify-center">
                      <QtyControl
                        value={line.qty}
                        onChange={(n) => setQty(line.slug, n)}
                      />
                    </div>

                    {/* Total */}
                    <span className="text-right text-[14px] font-medium text-ink tabular-nums">
                      {formatPrice(line.product.price * line.qty)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order Summary ── */}
            <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0 rounded-xl border border-line bg-[#fafaf9] p-6">
              <p className="mb-5 text-[15px] font-medium text-ink">Order Summary</p>

              <div className="flex justify-between text-[13px] text-ash mb-2">
                <span>Item Sub Total</span>
                <span className="tabular-nums text-ink">₹ {subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[13px] text-ash mb-5">
                <span>Shipping</span>
                <span className="text-ink">Free</span>
              </div>

              <div className="border-t border-line pt-4 mb-5 flex justify-between text-[14px] font-medium text-ink">
                <span>Total</span>
                <span className="tabular-nums">₹ {subtotal.toLocaleString("en-IN")}</span>
              </div>

              {/* Coupon code */}
              <button
                type="button"
                onClick={() => setCouponOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg border border-line bg-paper px-4 py-3 text-[13px] text-ash transition-colors hover:text-ink mb-1"
              >
                <span className="flex items-center gap-2">
                  <Tag className="size-4 shrink-0" />
                  Coupon code
                </span>
                <ChevronDown
                  className={`size-4 shrink-0 transition-transform duration-200 ${
                    couponOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {couponOpen && (
                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 rounded-lg border border-line px-3 py-2.5 text-[13px] text-ink outline-none focus:border-ink transition-colors"
                  />
                  <button
                    type="button"
                    className="rounded-lg bg-ink px-4 py-2.5 text-[13px] font-medium text-paper hover:opacity-80 transition-opacity"
                  >
                    Apply
                  </button>
                </div>
              )}

              <Link
                to="/checkout"
                className="mt-4 flex w-full items-center justify-center rounded-full bg-ink py-3.5 text-[13px] font-semibold tracking-[0.1em] text-paper transition-opacity hover:opacity-80"
              >
                CHECKOUT
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
