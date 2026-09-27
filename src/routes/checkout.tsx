import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageIntro } from "@/components/layout/page-intro";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { getProduct } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { useHasHydrated } from "@/lib/hydrate";
import { placeOrder } from "@/lib/orders-store";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout — UrbanTick" }] }),
});

function CheckoutPage() {
  const hydrated = useHasHydrated();
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const resolved = hydrated
    ? lines
        .map((l) => {
          const product = getProduct(l.slug);
          return product ? { ...l, product } : null;
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
    : [];
  const total = resolved.reduce((n, l) => n + l.product.price * l.qty, 0);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (resolved.length === 0) return;
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const order = placeOrder({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
      city: String(form.get("city") ?? ""),
      pin: String(form.get("pin") ?? ""),
      items: resolved.map((l) => ({
        slug: l.slug,
        name: l.product.name,
        price: l.product.price,
        qty: l.qty,
      })),
      total,
    });
    clear();
    toast.success(`Order ${order.id} placed`);
    void navigate({ to: "/order-status", search: { id: order.id } });
  }

  if (hydrated && resolved.length === 0) {
    return (
      <main className="bg-void">
        <PageIntro title="Checkout" />
        <div className="site-wrap py-16 text-center">
          <p className="text-mist">Your bag is empty.</p>
          <Link to="/shop" className="mt-4 inline-block text-sm text-paper underline">
            Shop watches
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-void">
      <PageIntro kicker="Checkout" title="Shipping details" />
      <form onSubmit={onSubmit} className="site-wrap grid gap-10 py-12 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4 rounded-xl border border-line-dark p-6">
          <Field name="name" label="Full name" required autoComplete="name" />
          <Field name="email" label="Email" type="email" required autoComplete="email" />
          <Field name="phone" label="Phone" type="tel" required autoComplete="tel" />
          <Field name="address" label="Address" required autoComplete="street-address" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="city" label="City" required autoComplete="address-level2" />
            <Field name="pin" label="PIN code" required autoComplete="postal-code" />
          </div>
        </div>
        <aside className="h-fit rounded-xl border border-line-dark p-6">
          <p className="text-[11px] tracking-[0.18em] text-ash uppercase">Order</p>
          <ul className="mt-4 space-y-3 text-sm">
            {resolved.map((l) => (
              <li key={l.slug} className="flex justify-between gap-3 text-mist">
                <span>
                  {l.product.name} × {l.qty}
                </span>
                <span className="tabular-nums text-paper">
                  {formatPrice(l.product.price * l.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-line-dark pt-4 text-paper">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(total)}</span>
          </div>
          <Button type="submit" variant="light" className="mt-6 w-full" disabled={busy}>
            Place order
          </Button>
          <p className="mt-3 text-[11px] text-ash">
            Demo checkout — the order is saved on this device only. No payment is taken.
          </p>
        </aside>
      </form>
    </main>
  );
}

function Field({
  name,
  label,
  ...props
}: { name: string; label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} className="border-line-dark bg-void text-paper" {...props} />
    </div>
  );
}
