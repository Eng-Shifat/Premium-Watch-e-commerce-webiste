import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Banknote,
  BadgeCheck,
  Check,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  ShieldCheck,
  Smartphone,
  Truck,
  type LucideIcon,
} from "lucide-react";
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
type Tab = "mobile" | "bank" | "cod";
type MobileWallet = "bkash" | "nagad" | "rocket";
type PlacedItem = { slug: string; name: string; price: number; qty: number; image: string };
type Placed = { orderId: string; method: Tab; items: PlacedItem[]; total: number };

/* ─── Tab definitions ────────────────────────────────── */
const TABS: { id: Tab; label: string; Icon: LucideIcon }[] = [
  { id: "mobile", label: "Mobile Banking",   Icon: Smartphone },
  { id: "bank",   label: "Bank & Card",      Icon: CreditCard },
  { id: "cod",    label: "Cash On Delivery", Icon: Truck },
];

/* ─── Mobile wallet definitions ──────────────────────── */
const WALLETS: { id: MobileWallet; label: string; logo: string; color: string; bg: string; border: string }[] = [
  { id: "bkash",  label: "bKash",  logo: "/payment logo/bkash.png",  color: "#E2136E", bg: "#FFF0F7", border: "#F7A8CB" },
  { id: "nagad",  label: "Nagad",  logo: "/payment logo/nagad.png",  color: "#F15A22", bg: "#FFF4EF", border: "#F9C4AA" },
  { id: "rocket", label: "Rocket", logo: "/payment logo/rocket.png", color: "#8B1FA9", bg: "#F9F0FC", border: "#D4A9E8" },
];

const money = (n: number) => n.toLocaleString("en-IN");

/* ─── Validation helpers ─────────────────────────────── */
const isBdMobile = (v: string) => /^01[3-9]\d{8}$/.test(v.replace(/\D/g, ""));

function isValidExpiry(v: string) {
  const m = /^(\d{2})\/(\d{2})$/.exec(v);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

/* ─── Small pieces ───────────────────────────────────── */
function WalletLogo({ src, label, color }: { src: string; label: string; color: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className="text-[11px] font-bold" style={{ color }}>{label}</span>;
  }
  return (
    <img
      src={src}
      alt={label}
      className="h-11 w-11 object-contain sm:h-12 sm:w-12"
      onError={() => setFailed(true)}
    />
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-[13px] text-ink outline-none placeholder:text-ash/60 focus:border-ink focus:ring-4 focus:ring-ink/5 transition-all";

/* ─── Main component ─────────────────────────────────── */
function PaymentPage() {
  const hydrated  = useHasHydrated();
  const search    = Route.useSearch();
  const lines     = useCartStore((s) => s.lines);
  const clear     = useCartStore((s) => s.clear);
  const navigate  = useNavigate();

  const [tab, setTab]           = useState<Tab>("mobile");
  const [wallet, setWallet]     = useState<MobileWallet | null>(null);
  const [walletNo, setWalletNo] = useState("");
  const [cardNo, setCardNo]     = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry]     = useState("");
  const [cvv, setCvv]           = useState("");

  const [busy, setBusy]     = useState(false);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const resolved = hydrated
    ? lines.map((l) => {
        const p = getProduct(l.slug);
        return p ? { ...l, product: p } : null;
      }).filter((x): x is NonNullable<typeof x> => x !== null)
    : [];

  const subtotal = resolved.reduce((n, l) => n + l.product.price * l.qty, 0);

  // After the order is placed the cart is cleared, so the page keeps showing a snapshot behind the popup.
  const shownItems: PlacedItem[] = placed
    ? placed.items
    : resolved.map((l) => ({
        slug: l.slug, name: l.product.name, price: l.product.price, qty: l.qty, image: l.product.image,
      }));
  const shownTotal = placed ? placed.total : subtotal;

  const activeWallet = WALLETS.find((w) => w.id === wallet) ?? null;

  function validate(): string | null {
    if (tab === "mobile") {
      if (!wallet) return "Please select a mobile banking app.";
      if (!isBdMobile(walletNo)) return `Enter a valid 11-digit ${activeWallet?.label} number (01XXXXXXXXX).`;
    }
    if (tab === "bank") {
      if (cardNo.replace(/\D/g, "").length < 16) return "Enter your 16-digit card number.";
      if (cardName.trim().length < 2) return "Enter the name on your card.";
      if (!isValidExpiry(expiry)) return "Enter a valid expiry date (MM/YY).";
      if (cvv.length < 3) return "Enter your card CVV / CVC.";
    }
    return null;
  }

  function handlePay() {
    if (busy || placed || resolved.length === 0) return;
    const problem = validate();
    if (problem) {
      toast.error(problem);
      return;
    }
    setBusy(true);
    // short processing delay so the payment feels real, then confirm
    timer.current = setTimeout(() => {
      const items = resolved.map((l) => ({
        slug: l.slug, name: l.product.name, price: l.product.price, qty: l.qty, image: l.product.image,
      }));
      const order = placeOrder({
        name:    search.name    || "Customer",
        email:   search.email   || "",
        phone:   search.phone   || "",
        address: search.address || "",
        city:    search.city    || "",
        pin:     search.zip     || "",
        items:   items.map(({ slug, name, price, qty }) => ({ slug, name, price, qty })),
        total:   subtotal,
      });
      clear();
      setPlaced({ orderId: order.id, method: tab, items, total: subtotal });
      setBusy(false);
    }, 1600);
  }

  if (!placed && hydrated && resolved.length === 0) {
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
            <div className="overflow-hidden rounded-xl border border-line">

              {/* Tab header */}
              <div role="tablist" className="grid grid-cols-3 border-b border-line bg-[#f9f8f7]">
                {TABS.map(({ id, label, Icon }) => {
                  const active = tab === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => { setTab(id); setWallet(null); }}
                      className={`relative flex flex-col items-center gap-2 px-2 py-4 text-center transition-colors duration-150 sm:px-3 ${
                        active ? "bg-paper text-ink" : "text-ash hover:text-ink"
                      }`}
                    >
                      <span
                        className={`flex size-10 items-center justify-center rounded-xl transition-all duration-200 ${
                          active ? "bg-ink text-paper shadow-[0_6px_16px_rgba(0,0,0,0.18)]" : "bg-white text-ash ring-1 ring-line"
                        }`}
                      >
                        <Icon className="size-[19px]" strokeWidth={1.7} />
                      </span>
                      <span className="text-[11.5px] font-medium leading-tight sm:text-[12px]">{label}</span>
                      {active && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-ink" />}
                    </button>
                  );
                })}
              </div>

              {/* ── Tab: Mobile Banking ── */}
              {tab === "mobile" && (
                <div className="space-y-4 p-5">
                  <p className="text-[13px] text-ash">Select your mobile banking app</p>

                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                    {WALLETS.map((w) => {
                      const active = wallet === w.id;
                      return (
                        <button
                          key={w.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setWallet(w.id)}
                          className="relative flex flex-col items-center gap-3 rounded-2xl border-2 p-3 transition-all duration-150 hover:-translate-y-0.5 sm:p-4"
                          style={{
                            borderColor: active ? w.color : "var(--color-line)",
                            background:  active ? w.bg    : "white",
                            boxShadow:   active ? `0 6px 20px ${w.color}26` : "none",
                          }}
                        >
                          {active && (
                            <span
                              className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full text-white"
                              style={{ background: w.color }}
                            >
                              <Check className="size-3" strokeWidth={3} />
                            </span>
                          )}
                          <div
                            className="flex size-14 items-center justify-center overflow-hidden rounded-xl sm:size-16"
                            style={{ background: active ? "white" : "#f6f4f2" }}
                          >
                            <WalletLogo src={w.logo} label={w.label} color={w.color} />
                          </div>
                          <span
                            className="text-[13px] font-semibold"
                            style={{ color: active ? w.color : "var(--color-ink)" }}
                          >
                            {w.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {activeWallet && (
                    <div
                      className="space-y-2 rounded-xl border p-4"
                      style={{ borderColor: activeWallet.border, background: activeWallet.bg }}
                    >
                      <p className="text-[13px] font-medium text-ink">
                        Enter your {activeWallet.label} number
                      </p>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={11}
                        value={walletNo}
                        onChange={(e) => setWalletNo(e.target.value.replace(/\D/g, "").slice(0, 11))}
                        placeholder="01XXXXXXXXX"
                        className="w-full rounded-xl border border-white/80 bg-white px-4 py-3 text-[14px] tracking-wide text-ink outline-none transition-all placeholder:text-ash/50 focus:ring-2 focus:ring-[color:var(--wc)] sm:max-w-xs"
                        style={{ "--wc": activeWallet.color } as CSSProperties}
                      />
                      <p className="text-[11px] text-ash">
                        A confirmation request will be sent to your {activeWallet.label} app.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Tab: Bank & Card ── */}
              {tab === "bank" && (
                <div className="space-y-4 p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-soft text-ink">
                      <Landmark className="size-5" strokeWidth={1.6} />
                    </span>
                    <p className="text-[13px] font-medium text-ink">Enter your card details</p>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <CreditCard className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ash/60" strokeWidth={1.6} />
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        value={cardNo}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 16);
                          v = v.replace(/(.{4})/g, "$1 ").trim();
                          setCardNo(v);
                        }}
                        placeholder="Card number"
                        className={`${inputCls} pl-11`}
                      />
                    </div>
                    <input
                      type="text"
                      autoComplete="cc-name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name on card"
                      className={inputCls}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        value={expiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                          setExpiry(v);
                        }}
                        placeholder="MM / YY"
                        className={inputCls}
                      />
                      <input
                        type="password"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="CVV / CVC"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-mist">Accepted:</span>
                    {["VISA", "MC", "AMEX"].map((brand) => (
                      <span key={brand} className="rounded-md border border-line px-2 py-0.5 text-[10px] font-bold text-ash">
                        {brand}
                      </span>
                    ))}
                  </div>
                  <p className="flex items-center gap-1.5 text-[11px] text-mist">
                    <Lock className="size-3" /> Your card details are encrypted and secure.
                  </p>
                </div>
              )}

              {/* ── Tab: Cash On Delivery ── */}
              {tab === "cod" && (
                <div className="p-5">
                  <div className="flex flex-col items-center gap-4 py-4 text-center">
                    <span className="flex size-16 items-center justify-center rounded-2xl bg-soft text-ink">
                      <Banknote className="size-8" strokeWidth={1.4} />
                    </span>
                    <div>
                      <p className="text-[15px] font-medium text-ink">Cash On Delivery</p>
                      <p className="mx-auto mt-1 max-w-xs text-[13px] text-ash">
                        Pay <span className="font-semibold text-ink">৳ {money(shownTotal)}</span> in cash when your order arrives at your doorstep. Our delivery agent will collect the payment.
                      </p>
                    </div>
                    <ul className="w-full space-y-2 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-5 py-3.5 text-left text-[12px] text-[#166534]">
                      {[
                        "No advance payment required",
                        "Pay only after receiving your order",
                        "Available all over Bangladesh",
                      ].map((t) => (
                        <li key={t} className="flex items-center gap-2.5">
                          <BadgeCheck className="size-4 shrink-0 text-[#16a34a]" strokeWidth={1.8} />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ══ RIGHT: Order Summary ════════════════════════════════════ */}
          <aside className="w-full shrink-0 rounded-xl border border-line bg-[#fafaf9] p-6 lg:w-[300px] xl:w-[320px]">
            <p className="mb-5 text-[15px] font-medium text-ink">Order Summary</p>

            {shownItems.length > 0 && (
              <ul className="mb-4 space-y-2.5 border-b border-line pb-4">
                {shownItems.map((l) => (
                  <li key={l.slug} className="flex items-center gap-3">
                    <img src={l.image} alt={l.name} className="size-10 shrink-0 rounded-lg bg-soft object-contain p-1" />
                    <div className="flex min-w-0 flex-1 justify-between gap-2">
                      <span className="truncate text-[12px] text-ash">{l.name} × {l.qty}</span>
                      <span className="shrink-0 text-[12px] font-medium tabular-nums text-ink">
                        ৳{money(l.price * l.qty)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mb-2 flex justify-between text-[13px] text-ash">
              <span>Subtotal</span>
              <span className="tabular-nums text-ink">৳ {money(shownTotal)}</span>
            </div>
            <div className="mb-5 flex justify-between text-[13px] text-ash">
              <span>Shipping</span>
              <span className="text-ink">Free</span>
            </div>
            <div className="mb-6 flex justify-between border-t border-line pt-4 text-[14px] font-semibold text-ink">
              <span>Total</span>
              <span className="tabular-nums">৳ {money(shownTotal)}</span>
            </div>

            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2.5">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#16a34a]" strokeWidth={1.8} />
              <p className="text-[11px] leading-relaxed text-[#166534]">
                Secured by SSL encryption. Your payment info is never stored.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePay}
              disabled={busy || !!placed}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[13px] font-semibold tracking-[0.08em] text-paper transition-opacity hover:opacity-80 disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Processing…
                </>
              ) : tab === "cod" ? (
                "PLACE ORDER"
              ) : (
                `PAY NOW  ৳${money(shownTotal)}`
              )}
            </button>

            <p className="mt-3 text-center text-[11px] text-mist">
              By placing this order you agree to our{" "}
              <Link to="/terms" className="underline transition-colors hover:text-ink">Terms & Conditions</Link>
            </p>
          </aside>

        </div>
      </div>

      {/* ══ ORDER CONFIRMED POPUP ═══════════════════════════════════ */}
      <Dialog.Root open={!!placed}>
        <Dialog.Portal>
          <Dialog.Overlay className="ut-overlay fixed inset-0 z-50 bg-black/55 backdrop-blur-[3px]" />
          <Dialog.Content
            onEscapeKeyDown={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
            aria-describedby="order-success-desc"
            className="ut-pop fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border-[3px] border-black bg-white px-6 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)] outline-none sm:px-12 sm:py-14"
          >
            <Dialog.Title className="text-center text-[24px] font-light uppercase leading-tight tracking-[0.02em] text-black sm:text-[34px]">
              Thank you for your order!
            </Dialog.Title>

            <div className="mx-auto mt-8 w-fit max-w-full space-y-4 sm:mt-10">
              <div className="flex items-center gap-3.5">
                <span className="ut-check flex size-11 shrink-0 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-[0_8px_20px_rgba(22,163,74,0.35)]">
                  <Check className="size-6" strokeWidth={3} />
                </span>
                <p className="text-[16px] font-semibold tracking-wide text-black sm:text-[18px]">
                  {placed?.method === "cod" ? "Order confirmed" : "Payment done successful"}
                </p>
              </div>

              <div className="space-y-4 sm:pl-[58px]">
                <p id="order-success-desc" className="text-[15px] text-black sm:text-[17px]">
                  Your order has been successfully placed.
                </p>
                <p className="text-[17px] text-[#7f1010] sm:text-[20px]">
                  Order Number: <span className="tabular-nums">#{placed?.orderId}</span>
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:mt-14 sm:flex-row">
              <button
                type="button"
                onClick={() => void navigate({ to: "/account" })}
                className="rounded-full border border-black/30 bg-black px-8 py-3.5 text-[14px] font-medium text-white transition-all hover:opacity-85 active:scale-95 sm:min-w-[180px]"
              >
                My orders
              </button>
              <button
                type="button"
                onClick={() => void navigate({ to: "/shop" })}
                className="rounded-full border border-black/30 bg-black px-8 py-3.5 text-[14px] font-medium text-white transition-all hover:opacity-85 active:scale-95"
              >
                Continue shopping
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <style>{`
        @keyframes ut-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ut-pop {
          from { opacity: 0; transform: translate(-50%, -46%) scale(.94) }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1) }
        }
        @keyframes ut-check {
          0%   { transform: scale(.4); opacity: 0 }
          60%  { transform: scale(1.15); opacity: 1 }
          100% { transform: scale(1) }
        }
        .ut-overlay { animation: ut-fade .25s ease-out both }
        .ut-pop     { animation: ut-pop .35s cubic-bezier(.2,.9,.3,1.2) both }
        .ut-check   { animation: ut-check .5s .25s cubic-bezier(.2,.9,.3,1.3) both }
      `}</style>
    </main>
  );
}
