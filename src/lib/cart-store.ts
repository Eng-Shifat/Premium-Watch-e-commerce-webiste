import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = { slug: string; qty: number };

type CartState = {
  lines: CartLine[];
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (slug, qty = 1) => {
        const lines = get().lines.map((l) => ({ ...l }));
        const found = lines.find((l) => l.slug === slug);
        if (found) found.qty += qty;
        else lines.push({ slug, qty });
        set({ lines });
      },
      remove: (slug) => set({ lines: get().lines.filter((l) => l.slug !== slug) }),
      setQty: (slug, qty) => {
        if (qty <= 0) {
          set({ lines: get().lines.filter((l) => l.slug !== slug) });
          return;
        }
        set({
          lines: get().lines.map((l) => (l.slug === slug ? { ...l, qty } : l)),
        });
      },
      clear: () => set({ lines: [] }),
    }),
    { name: "urbantick-cart" },
  ),
);

export function cartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty, 0);
}
