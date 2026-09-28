import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getProduct } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";
import { useHasHydrated } from "@/lib/hydrate";
import { placeOrder } from "@/lib/orders-store";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/payment")({
  validateSearch: (s: Record<string, unknown>) => ({
    name: typeof s.name === "string" ? s.name : "",
    email: typeof s.email === "string" ? s.email : "",
    phone: typeof s.phone === "string" ? s.phone : "",
    address: typeof s.address === "string" ? s.address : "",
    city: typeof s.city === "string" ? s.city : "",
    zip: typeof s.zip === "string" ? s.zip : "",
    country: typeof s.country === "string" ? s.country : "",
  }),
  component: PaymentPage,
  head: () => ({ meta: [{ title: "Payment — UrbanTick" }] }),
});

type PayMethod = "bkash" | "nagad" | "rocket" | "card" | "netbanking" | "cod";

const METHODS: { id: PayMethod; label: string; color: string; bg: string; desc: string }[] = [
  { id: "bkash",      label: "bKash",             color: "#E2136E", bg: "#FFF0F7", desc: "Pay with your bKash mobile wallet" },
  { id: "nagad",      label: "Nagad",              color: "#F15A22", bg: "#FFF4EF", desc: "Pay with Nagad mobile banking" },
  { id: "rocket",     label: "Rocket",             color: "#8B1FA9", bg: "#F9F0FC", desc: "Pay via Dutch-Bangla Rocket wallet" },
  { id: "card",       label: "Credit / Debit Card",color: "#1A56DB", bg: "#EFF6FF", desc: "Visa, Mastercard, AMEX accepted" },
  { id: "netbanking", label: "Net Banking",        color: "#0E7490", bg: "#ECFEFF", desc: "All major Bangladesh banks supported" },
  { id: "cod",        label: "Cash On Delivery",   color: "#374151", bg: "#F3F4F6", desc: "Pay in cash when your order arrives" },
];

// bKash icon SVG
function BkashIcon() {
  return (
    <svg viewBox="0 0 40 40" className="size-9" fill="none">
      <rect width="40" height="40" rx="8" fill="#E2136E" />
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="sans-serif">bKash</text>
    </svg>
  );
}
function NagadIcon() {
  return (
    <svg viewBox="0 0 40 40" className="size-9" fill="none">
      <rect width="40" height="40" rx="8" fill="#F15A22" />
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="sans-serif">Nagad</text>
    </svg>
  );
}
function RocketIcon() {
  return (
    <svg viewBox="0 0 40 40" className="size-9" fill="none">
      <rect width="40" height="40" rx="8" fill="#8B1FA9" />
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">Rocket</text>
    </svg>
  );
}
function CardIcon() {
  return (
    <svg viewBox="0 0 40 40" className="size-9" fill="none">
      <rect width="40" height="40" rx="8" fill="#1A56DB" />
      <rect x="7" y="13" width="26" height="14" rx="2" fill="white" opacity="0.9"/>
      <rect x="7" y="19" width="26" height="3" fill="#1A56DB" opacity="0.4"/>
      <rect x="9" y="22" width="6" height="3" rx="1" fill="white" opacity="0.8"/>
    </svg>
  );
}
function NetBankIcon() {
  return (
    <svg viewBox="0 0 40 40" className="size-9" fill="none">
      <rect width="40" height="40" rx="8" fill="#0E7490" />
      <text x="50%" y="44%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="7" fontWeight="600" fontFamily="sans-serif">NET</text>
      <text x="50%" y="64%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="7" fontWeight="600" fontFamily="sans-serif">BANK</text>
    </svg>
  );
}
function CodIcon() {
  return (
    <svg viewBox="0 0 40 40" className="size-9" fill="none">
      <rect width="40" height="40" rx="8" fill="#374151" />
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="sans-serif">COD</text>
    </svg>
  );
}

function MethodIcon({ id }: { id: PayMethod }) {
  if (id === "bkash") return <BkashIcon />;
  if (id === "nagad") return <NagadIcon />;
  if (id === "rocket") return <RocketIcon />;
  if (id === "card") return <CardIcon />;
  if (id === "netbanking") return <NetBankIcon />;
  return <CodIcon />;
}

function PaymentPage() {
  const hydrated = useHasHydrated();
  const search = Route.useSearch();
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const navigate = useNavigate();
  const [method, setMethod] = useState<PayMethod>("bkash");
  const [busy, setBusy] = useState(false);

  // Card fields
  const [cardNo, setCardNo] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  // Mobile wallet fields
  const [walletNo, setWalletNo] = useState("");

  const resolved = hydrated
    ? lines.map((l) => {
        const product = getProduct(l.slug);
        return product ? { ...l, product } : null;
      }).filter((x): x is NonNullable<typeof x> => x !== null)
    : [];

  const subtotal = resolved.reduce((n, l) => n + l.product.price * l.qty, 0);

  function handlePay() {
    if (resolved.length === 0) return;
    setBusy(true);
    const order = placeOrder({
      name: search.name || "Customer",
      email: search.email || "",
      phone: search.phone || "",
      address: search.address || "",
      city: search.city || "",
      pin: search.zip || "",
      items: resolved.map((l) => ({
        slug: l.slug,
        name: l.product.name,
        price: l.product.price,
        qty: l.qty,
      })),
      total: subtotal,
    });
    clear();
    toast.success(`Order ${order.id} placed! Payment via ${METHODS.find(m => m.id === method)?.label}`);
    void navigate({ to: "/order-status", search: { id: order.id } });
  }

  const selected = METHODS.find((m) => m.id === method)!;

  if (hydrated && resolved.length === 0) {
    return (
      <main className="min-h-screen bg-paper">
        <div className="site-wrap py-20 text-center">
          <p className="mb-4 text-mist">No items to pay for.</p>
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
        <h1 className="mb-2 text-[20px] font-medium text-ink sm:text-[22px]">Payment</h1>
        <p className="mb-6 text-[13px] text-mist">Complete your order securely</p>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* ── Left: Shipping info + Payment methods ── */}
          <div className="min-w-0 flex-1 space-y-5">

            {/* Shipping address card */}
            {search.name && (
              <div className="rounded-xl border border-line p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ash">Shipping Address</h2>
                  <Link to="/checkout" className="text-[12px] text-ink underline underline-offset-2 hover:opacity-70 transition-opacity">
                    Edit
                  </Link>
                </div>
                <p className="text-[13px] font-medium text-ink">{search.name}</p>
                <p className="mt-0.5 text-[13px] text-ash">{search.address}</p>
                {search.city && <p className="text-[13px] text-ash">{search.city}{search.zip ? ` - ${search.zip}` : ""}</p>}
                {search.country && <p className="text-[13px] text-ash">{search.country}</p>}
                {search.phone && <p className="mt-1 text-[13px] text-ash">Contact : {search.phone}</p>}
              </div>
            )}

            {/* Payment method selector */}
            <div className="rounded-xl border border-line overflow-hidden">
              <div className="border-b border-line bg-[#f9f8f7] px-5 py-4">
                <h2 className="text-[14px] font-medium text-ink">Payment Method</h2>
              </div>

              <div className="divide-y divide-line">
                {METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors ${
                      method === m.id ? "bg-[#fafaf9]" : "hover:bg-[#fafaf9]/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={method === m.id}
                      onChange={() => setMethod(m.id)}
                      className="shrink-0 accent-ink"
                    />
                    <MethodIcon id={m.id} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-ink">{m.label}</p>
                      <p className="text-[12px] text-mist">{m.desc}</p>
                    </div>
                    {method === m.id && (
                      <span
                        className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                        style={{ background: m.bg, color: m.color }}
                      >
                        Selected
                      </span>
                    )}
                  </label>
                ))}
              </div>

              {/* Dynamic input area */}
              {(method === "bkash" || method === "nagad" || method === "rocket") && (
                <div className="border-t border-line bg-[#fafaf9] px-5 py-5">
                  <p className="mb-3 text-[13px] font-medium text-ink">
                    Enter your {selected.label} number
                  </p>
                  <input
                    type="tel"
                    value={walletNo}
                    onChange={(e) => setWalletNo(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-[13px] text-ink outline-none placeholder:text-ash/60 focus:border-ink transition-colors sm:max-w-xs"
                  />
                  <p className="mt-2 text-[11px] text-mist">
                    You will receive a confirmation push on your {selected.label} app.
                  </p>
                </div>
              )}

              {method === "card" && (
                <div className="border-t border-line bg-[#fafaf9] px-5 py-5 space-y-3">
                  <p className="text-[13px] font-medium text-ink">Card details</p>
                  <input
                    type="text"
                    value={cardNo}
                    onChange={(e) => setCardNo(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())}
                    placeholder="Card number"
                    className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-[13px] text-ink outline-none placeholder:text-ash/60 focus:border-ink transition-colors"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                        setExpiry(v);
                      }}
                      placeholder="MM/YY"
                      className="rounded-lg border border-line bg-paper px-4 py-3 text-[13px] text-ink outline-none placeholder:text-ash/60 focus:border-ink transition-colors"
                    />
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      placeholder="CVV"
                      className="rounded-lg border border-line bg-paper px-4 py-3 text-[13px] text-ink outline-none placeholder:text-ash/60 focus:border-ink transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-mist">Your card details are encrypted and secure.</p>
                </div>
              )}

              {method === "netbanking" && (
                <div className="border-t border-line bg-[#fafaf9] px-5 py-5">
                  <p className="mb-3 text-[13px] font-medium text-ink">Select your bank</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {["Dutch-Bangla Bank", "BRAC Bank", "Islami Bank", "Prime Bank", "Southeast Bank", "Other"].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        className="rounded-lg border border-line bg-paper px-3 py-2.5 text-[12px] text-ash transition-colors hover:border-ink hover:text-ink text-left"
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {method === "cod" && (
                <div className="border-t border-line bg-[#f3f4f6] px-5 py-5">
                  <p className="text-[13px] text-ash">
                    Pay <span className="font-medium text-ink">৳ {subtotal.toLocaleString("en-IN")}</span> in cash when your order is delivered. Our delivery agent will collect the payment.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Order summary ── */}
          <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0 rounded-xl border border-line bg-[#fafaf9] p-6">
            <p className="mb-5 text-[15px] font-medium text-ink">Order Summary</p>

            {resolved.length > 0 && (
              <ul className="mb-4 space-y-2 border-b border-line pb-4">
                {resolved.map((l) => (
                  <li key={l.slug} className="flex items-center gap-3">
                    <img src={l.product.image} alt={l.product.name} className="h-10 w-10 shrink-0 rounded-md bg-soft object-contain p-1" />
                    <div className="flex flex-1 justify-between gap-2 min-w-0">
                      <span className="truncate text-[12px] text-ash">{l.product.name} × {l.qty}</span>
                      <span className="shrink-0 text-[12px] font-medium text-ink tabular-nums">৳{(l.product.price * l.qty).toLocaleString("en-IN")}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-between text-[13px] text-ash mb-2">
              <span>Subtotal</span>
              <span className="tabular-nums text-ink">৳ {subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-[13px] text-ash mb-5">
              <span>Shipping</span>
              <span className="text-ink">Free</span>
            </div>

            <div className="border-t border-line pt-4 mb-6 flex justify-between text-[14px] font-medium text-ink">
              <span>Total</span>
              <span className="tabular-nums">৳ {subtotal.toLocaleString("en-IN")}</span>
            </div>

            {/* Security note */}
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-2.5">
              <svg className="mt-0.5 size-4 shrink-0 text-[#16a34a]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              <p className="text-[11px] text-[#166534] leading-relaxed">
                Secured by SSL encryption. Your payment info is never stored.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePay}
              disabled={busy}
              style={method !== "cod" && method !== "netbanking" ? { background: selected.color } : {}}
              className={`flex w-full items-center justify-center rounded-full py-3.5 text-[13px] font-semibold tracking-[0.08em] text-paper transition-opacity hover:opacity-90 disabled:opacity-50 ${
                method === "cod" || method === "netbanking" ? "bg-ink" : ""
              }`}
            >
              {busy ? "Processing…" : method === "cod" ? "PLACE ORDER" : `PAY NOW · ৳${subtotal.toLocaleString("en-IN")}`}
            </button>

            <p className="mt-3 text-center text-[11px] text-mist">
              By placing the order you agree to our{" "}
              <Link to="/terms" className="underline hover:text-ink transition-colors">Terms</Link>
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
