import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/layout/page-intro";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import { getOrder, type Order } from "@/lib/orders-store";

export const Route = createFileRoute("/order-status")({
  validateSearch: (s: Record<string, unknown>) => ({
    id: typeof s.id === "string" ? s.id : undefined,
  }),
  component: OrderStatusPage,
  head: () => ({ meta: [{ title: "Order Status — UrbanTick" }] }),
});

function OrderStatusPage() {
  const { id } = Route.useSearch();
  const [query, setQuery] = useState(id ?? "");
  const [found, setFound] = useState<Order | undefined>(() =>
    typeof window !== "undefined" && id ? getOrder(id) : undefined,
  );

  const current = useMemo(() => found, [found]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFound(getOrder(query.trim()));
  }

  return (
    <main className="bg-void">
      <PageIntro
        kicker="Support"
        title="Order Status"
        lede="Enter the order id from your confirmation (UT-xxxxx)."
      />
      <div className="site-wrap max-w-xl py-12 pb-20">
        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="oid">Order id</Label>
            <Input
              id="oid"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="UT-48291"
              className="border-line-dark bg-void text-paper"
            />
          </div>
          <Button type="submit" variant="light">
            Look up
          </Button>
        </form>
        {query && current === undefined ? (
          <p className="mt-8 text-sm text-mist">No order with that id on this device.</p>
        ) : null}
        {current ? (
          <div className="mt-10 rounded-xl border border-line-dark p-6 text-sm">
            <p className="font-medium text-paper tabular-nums">{current.id}</p>
            <p className="mt-1 capitalize text-mist">{current.status}</p>
            <p className="mt-4 text-mist">
              {current.name} · {current.city} {current.pin}
            </p>
            <ul className="mt-4 space-y-2">
              {current.items.map((it) => (
                <li key={it.slug} className="flex justify-between text-cloud">
                  <span>
                    {it.name} × {it.qty}
                  </span>
                  <span className="tabular-nums">{formatPrice(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between border-t border-line-dark pt-4 text-paper">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(current.total)}</span>
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
