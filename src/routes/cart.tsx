import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { PageIntro } from "@/components/layout/page-intro";
import { QtyControl } from "@/components/product/qty-control";
import { buttonVariants } from "@/components/ui/button";
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

  const resolved = hydrated
    ? lines
        .map((l) => {
          const product = getProduct(l.slug);
          return product ? { ...l, product } : null;
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
    : [];

  const total = resolved.reduce((n, l) => n + l.product.price * l.qty, 0);

  return (
    <main className="bg-void">
      <PageIntro kicker="Bag" title="Your Cart" />
      <div className="site-wrap py-12">
        {!hydrated ? (
          <p className="text-mist">Loading bag…</p>
        ) : resolved.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-mist">Your bag is empty.</p>
            <Link to="/shop" className={buttonVariants({ variant: "line" }) + " mt-6"}>
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <ul className="divide-y divide-line-dark">
              {resolved.map((line) => (
                <li key={line.slug} className="flex gap-4 py-6">
                  <Link
                    to="/product/$slug"
                    params={{ slug: line.slug }}
                    className="size-24 shrink-0 overflow-hidden rounded-lg bg-card"
                  >
                    <img
                      src={line.product.image}
                      alt=""
                      className="h-full w-full object-contain p-2"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <Link
                        to="/product/$slug"
                        params={{ slug: line.slug }}
                        className="font-display text-lg text-paper"
                      >
                        {line.product.name}
                      </Link>
                      <p className="mt-1 text-sm text-mist tabular-nums">
                        {formatPrice(line.product.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <QtyControl
                        value={line.qty}
                        onChange={(n) => setQty(line.slug, n)}
                        className="border-line-dark text-paper"
                      />
                      <button
                        type="button"
                        aria-label="Remove"
                        className="flex size-11 items-center justify-center text-mist hover:text-paper"
                        onClick={() => remove(line.slug)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="h-fit rounded-xl border border-line-dark p-6">
              <p className="text-[11px] tracking-[0.18em] text-ash uppercase">Summary</p>
              <div className="mt-4 flex justify-between text-sm text-mist">
                <span>Subtotal</span>
                <span className="tabular-nums text-paper">{formatPrice(total)}</span>
              </div>
              <p className="mt-2 text-[12px] text-ash">Shipping calculated at checkout. Prepaid & COD in India.</p>
              <Link to="/checkout" className={buttonVariants({ variant: "light" }) + " mt-6 w-full"}>
                Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
