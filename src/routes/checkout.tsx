import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Tag } from "lucide-react";
import { toast } from "sonner";
import { getProduct } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";
import { useHasHydrated } from "@/lib/hydrate";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout — UrbanTick" }] }),
});

type SavedAddress = {
  id: string;
  name: string;
  house: string;
  po: string;
  contact: string;
};

function CheckoutPage() {
  const hydrated = useHasHydrated();
  const lines = useCartStore((s) => s.lines);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);

  const [form, setForm] = useState({
    email: "", firstName: "", secondName: "",
    address: "", city: "", zip: "", country: "", phone: "",
  });

  const resolved = hydrated
    ? lines.map((l) => {
        const product = getProduct(l.slug);
        return product ? { ...l, product } : null;
      }).filter((x): x is NonNullable<typeof x> => x !== null)
    : [];

  const subtotal = resolved.reduce((n, l) => n + l.product.price * l.qty, 0);

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));
  }

  function handleAddNewAddress() {
    if (!form.firstName && !form.address) {
      toast.error("Please fill in the address fields first.");
      return;
    }
    if (savedAddresses.length >= 2) {
      toast.error("Maximum 2 addresses allowed.");
      return;
    }
    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      name: `${form.firstName} ${form.secondName}`.trim(),
      house: form.address,
      po: `${form.city}${form.zip ? ` - ${form.zip}` : ""}`,
      contact: form.phone,
    };
    setSavedAddresses((prev) => [...prev, newAddr]);
    setSelectedAddress(newAddr.id);
    toast.success("Address saved!");
    // clear form for next entry
    setForm({ email: form.email, firstName: "", secondName: "", address: "", city: "", zip: "", country: "", phone: "" });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (resolved.length === 0) return;
    const picked = savedAddresses.find((a) => a.id === selectedAddress);
    void navigate({
      to: "/payment",
      search: {
        name: picked ? picked.name : `${form.firstName} ${form.secondName}`.trim(),
        email: form.email,
        phone: picked ? picked.contact : form.phone,
        address: picked ? picked.house : form.address,
        city: picked ? picked.po : form.city,
        zip: form.zip,
        country: form.country,
      },
    });
  }

  if (hydrated && resolved.length === 0) {
    return (
      <main className="min-h-screen bg-paper">
        <div className="site-wrap py-20 text-center">
          <p className="mb-4 text-mist">Your cart is empty.</p>
          <Link to="/shop" className="inline-block rounded-full bg-ink px-6 py-2.5 text-[13px] font-medium text-paper hover:opacity-75 transition-opacity">
            Shop watches
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper">
      <div className="site-wrap py-8 pb-24">
        <h1 className="mb-6 text-[20px] font-medium text-ink sm:text-[22px]">Checkout</h1>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* ── Shipping form ── */}
          <div className="min-w-0 flex-1 rounded-xl border border-line">
            <div className="border-b border-line px-6 py-4">
              <h2 className="text-[15px] font-medium text-ink">Shipping</h2>
            </div>

            <form onSubmit={onSubmit} className="px-6 py-6 space-y-4">
              <Field placeholder="Email*" type="email" value={form.email} onChange={set("email")} required />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field placeholder="First Name*" value={form.firstName} onChange={set("firstName")} />
                <Field placeholder="Second Name*" value={form.secondName} onChange={set("secondName")} />
              </div>

              <Field placeholder="Address*" value={form.address} onChange={set("address")} />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field placeholder="City*" value={form.city} onChange={set("city")} />
                <Field placeholder="Zip Code*" value={form.zip} onChange={set("zip")} />
              </div>

              <Field placeholder="Country*" value={form.country} onChange={set("country")} />
              <Field placeholder="Phone number*" type="tel" value={form.phone} onChange={set("phone")} />

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleAddNewAddress}
                  className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-paper transition-opacity hover:opacity-75"
                >
                  Add New Address
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-full border border-ink px-5 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
                >
                  {busy ? "Placing…" : "Continue"}
                </button>
              </div>

              {/* Saved addresses grid */}
              {savedAddresses.length > 0 && (
                <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                  {savedAddresses.map((addr, i) => (
                    <div key={addr.id}>
                      <p className="mb-2 text-[13px] font-medium text-ink">Address{i + 1}</p>
                      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-paper p-3 transition-colors hover:border-ash">
                        <input
                          type="radio"
                          name="saved-address"
                          value={addr.id}
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                          className="mt-0.5 shrink-0 accent-ink"
                        />
                        <div className="text-[12px] leading-relaxed text-ash">
                          <p className="font-medium text-ink">{addr.name}</p>
                          <p>{addr.house}</p>
                          <p>{addr.po}</p>
                          {addr.contact && <p>Contact number : {addr.contact}</p>}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </form>
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

            {/* Coupon */}
            <button
              type="button"
              onClick={() => setCouponOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg border border-line bg-paper px-4 py-3 text-[13px] text-ash transition-colors hover:text-ink mb-1"
            >
              <span className="flex items-center gap-2">
                <Tag className="size-4 shrink-0" />
                Coupon code
              </span>
              <ChevronDown className={`size-4 shrink-0 transition-transform duration-200 ${couponOpen ? "rotate-180" : ""}`} />
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
                <button type="button" className="rounded-lg bg-ink px-4 py-2.5 text-[13px] font-medium text-paper hover:opacity-80 transition-opacity">
                  Apply
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => { document.querySelector("form")?.requestSubmit(); }}
              disabled={busy}
              className="mt-4 flex w-full items-center justify-center rounded-full bg-ink py-3.5 text-[13px] font-semibold tracking-[0.1em] text-paper transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              CHECKOUT
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { placeholder: string }) {
  return (
    <input
      className="w-full rounded-lg border border-line bg-[#f0f4ff]/40 px-4 py-3 text-[13px] text-ink outline-none placeholder:text-ash/70 focus:border-ink focus:bg-paper transition-colors"
      {...props}
    />
  );
}
