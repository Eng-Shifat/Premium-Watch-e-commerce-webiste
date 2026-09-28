import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { formatPrice } from "@/lib/format";
import { getOrder, type Order } from "@/lib/orders-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/order-status")({
  validateSearch: (s: Record<string, unknown>) => ({
    id: typeof s.id === "string" ? s.id : undefined,
  }),
  component: OrderStatusPage,
  head: () => ({ meta: [{ title: "Order Status — UrbanTick" }] }),
});

const STATUS_STYLE: Record<Order["status"], string> = {
  processing: "border-amber-200 bg-amber-50 text-amber-700",
  shipped: "border-sky-200 bg-sky-50 text-sky-700",
  delivered: "border-green-200 bg-green-50 text-green-700",
};

// accept "#UT-12345" as shown in the order confirmation popup
const clean = (v: string) => v.trim().replace(/^#/, "");

function OrderStatusPage() {
  const { id } = Route.useSearch();
  const [query, setQuery] = useState(id ?? "");
  const [found, setFound] = useState<Order | undefined>(() =>
    typeof window !== "undefined" && id ? getOrder(clean(id)) : undefined,
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFound(getOrder(clean(query)));
  }

  return (
    <main className="min-h-screen bg-paper">
      <div className="site-wrap max-w-2xl py-8 pb-24">
        <h1 className="text-[20px] font-medium text-ink sm:text-[22px]">Order Status</h1>
        <p className="mt-1 mb-6 text-[13px] text-ash">Enter the order id from your confirmation (UT-xxxxx).</p>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
          <input
            id="oid"
            aria-label="Order id"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="UT-48291"
            className="h-12 flex-1 rounded-xl border border-line bg-paper px-4 text-[14px] text-ink outline-none transition-all placeholder:text-ash/60 focus:border-ink focus:ring-4 focus:ring-ink/5"
          />
          <button
            type="submit"
            className="h-12 rounded-full bg-ink px-8 text-[13px] font-semibold text-paper transition-opacity hover:opacity-80 active:scale-95"
          >
            Look up
          </button>
        </form>

        {query && found === undefined ? (
          <p className="mt-8 text-[13px] text-ash">No order with that id on this device.</p>
        ) : null}

        {found ? (
          <div className="mt-8 rounded-xl border border-line p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ash">Order</p>
                <p className="mt-1 text-[17px] font-semibold tabular-nums text-ink">{found.id}</p>
              </div>
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-medium capitalize",
                  STATUS_STYLE[found.status],
                )}
              >
                {found.status}
              </span>
            </div>

            <div className="mt-5 border-t border-line pt-4 text-[13px]">
              <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-ash">Shipping to</p>
              <p className="font-medium text-ink">{found.name}</p>
              {found.address ? <p className="text-ash">{found.address}</p> : null}
              <p className="text-ash">
                {found.city} {found.pin}
              </p>
            </div>

            <ul className="mt-5 space-y-2.5 border-t border-line pt-4 text-[13px]">
              {found.items.map((it) => (
                <li key={it.slug} className="flex justify-between gap-3 text-ash">
                  <span>
                    {it.name} × {it.qty}
                  </span>
                  <span className="tabular-nums text-ink">{formatPrice(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 flex justify-between border-t border-line pt-4 text-[14px] font-semibold text-ink">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(found.total)}</span>
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
