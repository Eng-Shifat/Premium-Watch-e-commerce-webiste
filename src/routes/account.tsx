import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/layout/page-intro";
import { formatPrice } from "@/lib/format";
import { useHasHydrated } from "@/lib/hydrate";
import { listOrders } from "@/lib/orders-store";
import { useState } from "react";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({ meta: [{ title: "Account — UrbanTick" }] }),
});

function AccountPage() {
  const hydrated = useHasHydrated();
  const [orders] = useState(() => (typeof window === "undefined" ? [] : listOrders()));
  const shown = hydrated ? listOrders() : orders;

  return (
    <main className="bg-void">
      <PageIntro
        kicker="Account"
        title="Your orders"
        lede="Orders placed on this device. No sign-in required — we keep the bag and the ledger locally."
      />
      <div className="site-wrap py-12 pb-20">
        {!hydrated ? (
          <p className="text-mist">Loading…</p>
        ) : shown.length === 0 ? (
          <p className="text-mist">
            No orders yet.{" "}
            <Link to="/shop" className="text-paper underline">
              Start in the shop
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-line-dark">
            {shown.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-5">
                <div>
                  <Link
                    to="/order-status"
                    search={{ id: o.id }}
                    className="font-medium text-paper tabular-nums"
                  >
                    {o.id}
                  </Link>
                  <p className="mt-1 text-[12px] text-mist">
                    {new Date(o.createdAt).toLocaleDateString("en-IN")} · {o.status} ·{" "}
                    {o.items.length} item{o.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <p className="tabular-nums text-paper">{formatPrice(o.total)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
