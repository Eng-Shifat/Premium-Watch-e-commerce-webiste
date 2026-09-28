import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getProduct } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";
import { useHasHydrated } from "@/lib/hydrate";
import { placeOrder } from "@/lib/orders-store";

export const Route = createFileRoute("/payment")({
  validateSearch: (s: Record<string, unknown>) => ({
    name:    typeof s.name    === "string" ? s.name    : "",
    email:   typeof s.email   === "string" ? s.email   : "",
    phone:   typeof s.phone   === "string" ? s.phone   : "",
    address: typeof s.address === "string" ? s.address : "",
    city:    typeof s.city    === "string" ? s.city    : "",
    zip:     typeof s.zip     === "string" ? s.zip     : "",
    country: typeof s.country === "string" ? s.country : "",
  }),
  component: PaymentPage,
  head: () => ({ meta: [{ title: "Payment — UrbanTick" }] }),
});

/* ─── Types ─────────────────────────────────────────── */
type Tab      = "mobile" | "bank" | "cod";
type MobileWallet = "bkash" | "nagad" | "rocket";

/* ─── Tab definitions ────────────────────────────────── */
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "mobile", label: "Mobile Banking", icon: "📱" },
  { id: "bank",   label: "Bank & Card",    icon: "💳" },
  { id: "cod",    label: "Cash On Delivery", icon: "🚚" },
];

/* ─── Mobile wallet definitions ──────────────────────── */
const WALLETS: { id: MobileWallet; label: string; logo: string; color: string; bg: string; border: string }[] = [
  { id: "bkash",  label: "bKash",  logo: "/payment logo/bkash.png",  color: "#E2136E", bg: "#FFF0F7", border: "#F7A8CB" },
  { id: "nagad",  label: "Nagad",  logo: "/payment logo/nagad.png",  color: "#F15A22", bg: "#FFF4EF", border: "#F9C4AA" },
  { id: "rocket", label: "Rocket", logo: "/payment logo/rocket.png", color: "#8B1FA9", bg: "#F9F0FC", border: "#D4A9E8" },
];

/* ─── Main component ─────────────────────────────────── */
function PaymentPage() {
  const hydrated   = useHasHydrated();
  const search     = Route.useSearch();
  const lines      = useCartStore((s) => s.lines);
  const clear      = useCartStore((s) => s.clear);
  const navigate   = useNavigate();

  // tab state
  const [tab, setTab]           = useState<Tab>("mobile");
  // mobile banking
  const [wallet, setWallet]     = useState<MobileWallet | null>(null);
  const [walletNo, setWalletNo] = useState("");
  // bank / card
  const [cardNo, setCardNo]     = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry]     = useState("");
  const [cvv, setCvv]           = useState("");

  const [busy, setBusy] = useState(false);

  const resolved = hydrated
    ? lines.map((l) => {
        const p = getProduct(l.slug);
        return p ? { ...l, product: p } : null;
      }).filter((x): x is NonNullable<typeof x> => x !== null)
    : [];

  const subtotal = resolved.reduce((n, l) => n + l.product.price * l.qty, 0);

  function handlePay() {
    if (resolved.length === 0) return;
    setBusy(true);
    const order = placeOrder({
      name:    search.name    || "Customer",
      email:   search.email   || "",
      phone:   search.phone   || "",
      address: search.address || "",
      city:    search.city    || "",
      pin:     search.zip     || "",
      items: resolved.map((l) => ({
        slug: l.slug, name: l.product.name,
        price: l.product.price, qty: l.qty,
      })),
      total: subtotal,
    });
    clear();
    toast.success(`Order ${order.id} placed!`);
    void navigate({ to: "/order-status", search: { id: order.id } });
  }

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
        <h1 className="mb-6 text-[20px] font-medium text-ink sm:text-[22px]">Payment</h1>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">

          {/* ══ LEFT PANEL ══════════════════════════════════════════════ */}
          <div className="min-w-0 flex-1 space-y-5">

            {/* Shipping address */}
            {search.name && (
              <div className="rounded-xl border border-line p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ash">Shipping Address</h2>
                  <Link to="/checkout" className="text-[12px] text-ink underline underline-offset-2 hover:opacity-60 transition-opacity">Edit</Link>
                </div>
                <p className="text-[13px] font-medium text-ink">{search.name}</p>
                <p className="text-[13px] text-ash">{search.address}</p>
                {search.city && <p className="text-[13px] text-ash">{search.city}{search.zip ? ` — ${search.zip}` : ""}</p>}
                {search.country && <p className="text-[13px] text-ash">{search.country}</p>}
                {search.phone && <p className="mt-1 text-[12px] text-mist">Contact : {search.phone}</p>}
              </div>
            )}

            {/* ── Payment gateway ─────────────────────────── */}
            <div className="rounded-xl border border-line overflow-hidden">

              {/* Tab header — 3 equal columns */}
              <div className="grid grid-cols-3 border-b border-line">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { setTab(t.id); setWallet(null); }}
                    className={`flex flex-col items-center gap-1.5 px-3 py-4 text-center transition-colors duration-150 ${
                      tab === t.id
                        ? "border-b-2 border-ink bg-paper text-ink"
                        : "bg-[#f9f8f7] text-ash hover:text-ink"
                    }`}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-[12px] font-medium leading-tight">{t.label}</span>
                  </button>
                ))}
              </div>

              {/* ── Tab: Mobile Banking ── */}
              {tab === "mobile" && (
                <div className="p-5 space-y-4">
                  <p className="text-[13px] text-ash">Select your mobile banking app</p>

                  {/* Wallet cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {WALLETS.map((w) => {
                      const active = wallet === w.id;
                      return (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setWallet(w.id)}
                          className="flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-150"
                          style={{
                            borderColor: active ? w.color : "var(--color-line)",
                            background:  active ? w.bg    : "white",
                            boxShadow:   active ? `0 4px 16px ${w.color}22` : "none",
                          }}
                        >
                          {/* Logo */}
                          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl"
                            style={{ background: active ? "white" : "#f6f4f2" }}>
                            <img
                              src={w.logo}
                              alt={w.label}
                              className="h-12 w-12 object-contain"
                              onError={(e) => {
                                // fallback text if logo missing
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                (e.currentTarget.parentElement as HTMLElement).innerHTML =
                                  `<span style="font-size:11px;font-weight:700;color:${w.color}">${w.label}</span>`;
                              }}
                            />
                          </div>
                          <span
                            className="text-[13px] font-semibold"
                            style={{ color: active ? w.color : "var(--color-ink)" }}
                          >
                            {w.label}
                          </span>
                          {active && (
                            <span
                              className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                              style={{ background: w.color, color: "white" }}
                            >
                              Selected
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Number input — appears after wallet selected */}
                  {wallet && (
                    <div
                      className="rounded-xl border p-4 space-y-2 transition-all"
                      style={{ borderColor: WALLETS.find(w => w.id === wallet)!.border,
                               background: WALLETS.find(w => w.id === wallet)!.bg }}
                    >
                      <p className="text-[13px] font-medium text-ink">
                        Enter your {WALLETS.find(w => w.id === wallet)!.label} number
                      </p>
                      <input
                        type="tel"
                        value={walletNo}
                        onChange={(e) => setWalletNo(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full rounded-xl border border-white/80 bg-white px-4 py-3 text-[14px] text-ink outline-none placeholder:text-ash/50 focus:ring-2 transition-all sm:max-w-xs"
                        style={{ focusRingColor: WALLETS.find(w => w.id === wallet)!.color } as React.CSSProperties}
                      />
                      <p className="text-[11px] text-ash">
                        A confirmation request will be sent to your {WALLETS.find(w => w.id === wallet)!.label} app.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Tab: Bank & Card ── */}
              {tab === "bank" && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <img src="/payment logo/bank transfer.png" alt="Bank Transfer"
                      className="h-10 object-contain"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display="none"; }}
                    />
                    <p className="text-[13px] font-medium text-ink">Enter your card details</p>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={cardNo}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 16);
                        v = v.replace(/(.{4})/g, "$1 ").trim();
                        setCardNo(v);
                      }}
                      placeholder="Card number"
                      className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-[13px] text-ink outline-none placeholder:text-ash/60 focus:border-ink transition-colors"
                    />
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name on card"
                      className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-[13px] text-ink outline-none placeholder:text-ash/60 focus:border-ink transition-colors"
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
                        placeholder="MM / YY"
                        className="rounded-xl border border-line bg-paper px-4 py-3 text-[13px] text-ink outline-none placeholder:text-ash/60 focus:border-ink transition-colors"
                      />
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="CVV / CVC"
                        className="rounded-xl border border-line bg-paper px-4 py-3 text-[13px] text-ink outline-none placeholder:text-ash/60 focus:border-ink transition-colors"
                      />
                    </div>
                  </div>

                  {/* Accepted logos */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-mist">Accepted:</span>
                    {["VISA", "MC", "AMEX"].map((brand) => (
                      <span key={brand}
                        className="rounded border border-line px-2 py-0.5 text-[10px] font-bold text-ash">
                        {brand}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-mist">🔒 Your card details are encrypted and secure.</p>
                </div>
              )}

              {/* ── Tab: Cash On Delivery ── */}
              {tab === "cod" && (
                <div className="p-5">
                  <div className="flex flex-col items-center gap-4 py-4 text-center">
                    <img
                      src="/payment logo/COD.png"
                      alt="Cash On Delivery"
                      className="h-16 object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div>
                      <p className="text-[15px] font-medium text-ink">Cash On Delivery</p>
                      <p className="mt-1 text-[13px] text-ash max-w-xs">
                        Pay <span className="font-semibold text-ink">৳ {subtotal.toLocaleString("en-IN")}</span> in cash when your order arrives at your doorstep. Our delivery agent will collect the payment.
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] px-5 py-3 text-[12px] text-[#166534] w-full text-left space-y-1">
                      <p>✅ No advance payment required</p>
                      <p>✅ Pay only after receiving your order</p>
                      <p>✅ Available all over Bangladesh</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ══ RIGHT: Order Summary ════════════════════════════════════ */}
          <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0 rounded-xl border border-line bg-[#fafaf9] p-6">
            <p className="mb-5 text-[15px] font-medium text-ink">Order Summary</p>

            {resolved.length > 0 && (
              <ul className="mb-4 space-y-2.5 border-b border-line pb-4">
                {resolved.map((l) => (
                  <li key={l.slug} className="flex items-center gap-3">
                    <img src={l.product.image} alt={l.product.name}
                      className="h-10 w-10 shrink-0 rounded-lg bg-soft object-contain p-1" />
                    <div className="flex flex-1 min-w-0 justify-between gap-2">
                      <span className="truncate text-[12px] text-ash">{l.product.name} × {l.qty}</span>
                      <span className="shrink-0 text-[12px] font-medium text-ink tabular-nums">
                        ৳{(l.product.price * l.qty).toLocaleString("en-IN")}
                      </span>
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
            <div className="border-t border-line pt-4 mb-6 flex justify-between text-[14px] font-semibold text-ink">
              <span>Total</span>
              <span className="tabular-nums">৳ {subtotal.toLocaleString("en-IN")}</span>
            </div>

            {/* Security */}
            <div className="mb-5 flex items-start gap-2 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-2.5">
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
              className="flex w-full items-center justify-center rounded-full bg-ink py-3.5 text-[13px] font-semibold tracking-[0.08em] text-paper transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {busy
                ? "Processing…"
                : tab === "cod"
                ? "PLACE ORDER"
                : `PAY NOW  ৳${subtotal.toLocaleString("en-IN")}`}
            </button>

            <p className="mt-3 text-center text-[11px] text-mist">
              By placing this order you agree to our{" "}
              <Link to="/terms" className="underline hover:text-ink transition-colors">Terms & Conditions</Link>
            </p>
          </aside>

        </div>
      </div>
    </main>
  );
}
