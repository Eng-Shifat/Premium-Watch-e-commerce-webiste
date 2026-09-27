import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishState = {
  slugs: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  remove: (slug: string) => void;
};

export const useWishlistStore = create<WishState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) => {
        const slugs = get().slugs;
        set({
          slugs: slugs.includes(slug) ? slugs.filter((s) => s !== slug) : [...slugs, slug],
        });
      },
      has: (slug) => get().slugs.includes(slug),
      remove: (slug) => set({ slugs: get().slugs.filter((s) => s !== slug) }),
    }),
    { name: "urbantick-wish" },
  ),
);
