import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, LogOut, PackageOpen } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";
import { useHasHydrated } from "@/lib/hydrate";
import { logoutLocal, useLocalUser } from "@/lib/local-auth";
import { listOrders, type Order } from "@/lib/orders-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({ meta: [{ title: "My Orders — UrbanTick" }] }),
});

const STATUS_STYLE: Record<Order["status"], string> = {
  processing: "border-amber-200 bg-amber-50 text-amber-700",
  shipped: "border-sky-200 bg-sky-50 text-sky-700",
  delivered: "border-green-200 bg-green-50 text-green-700",
};

function AccountPage() {
  const hydrated = useHasHydrated();
  const user = useLocalUser();
  const orders = hydrated ? listOrders() : [];

  return (
    <main className="min-h-screen bg-paper">
      <div className="site-wrap py-8 pb-24">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[20px] font-medium text-ink sm:text-[22px]">Your orders</h1>
            {hydrated && user ? (
              <p className="mt-1 text-[13px] text-ash">Signed in as {user.username}</p>
            ) : null}
          </div>
          {hydrated && user ? (
            <button
              type="button"
              onClick={() => {
                logoutLocal();
                toast.success("Signed out");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              <LogOut className="size-4" strokeWidth={1.7} />
              Sign out
            </button>
          ) : null}
        </div>

        {!hydrated ? (
          <p className="text-mist">Loading…</p>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-line py-20 text-center">
            <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-soft text-ink">
              <PackageOpen className="size-7" strokeWidth={1.4} />
            </span>
            <p className="mb-4 text-mist">No orders yet.</p>
            <Link
              to="/shop"
              className="inline-block rounded-full bg-ink px-6 py-2.5 text-[13px] font-medium text-paper transition-opacity hover:opacity-75"
            >
              Start in the shop
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  to="/order-status"
                  search={{ id: o.id }}
                  className="group flex items-center justify-between gap-4 px-5 py-5 transition-colors hover:bg-soft"
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold tabular-nums text-ink">{o.id}</p>
                    <p className="mt-1 text-[12px] text-ash">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")} · {o.items.length} item
                      {o.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:gap-5">
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1 text-[11px] font-medium capitalize",
                        STATUS_STYLE[o.status],
                      )}
                    >
                      {o.status}
                    </span>
                    <span className="min-w-[72px] text-right text-[15px] font-semibold tabular-nums text-ink">
                      {formatPrice(o.total)}
                    </span>
                    <ChevronRight className="size-4 text-mist transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
