export type ShopSearch = {
  gender?: "men" | "women" | "unisex";
  strap?: "leather" | "steel" | "mesh" | "bracelet";
  collection?: "studio" | "atelier";
  sort?: "featured" | "price-asc" | "price-desc";
};

const genders = new Set(["men", "women", "unisex"]);
const straps = new Set(["leather", "steel", "mesh", "bracelet"]);
const collections = new Set(["studio", "atelier"]);
const sorts = new Set(["featured", "price-asc", "price-desc"]);

export function parseShopSearch(s: Record<string, unknown>): ShopSearch {
  return {
    gender: typeof s.gender === "string" && genders.has(s.gender) ? (s.gender as ShopSearch["gender"]) : undefined,
    strap: typeof s.strap === "string" && straps.has(s.strap) ? (s.strap as ShopSearch["strap"]) : undefined,
    collection:
      typeof s.collection === "string" && collections.has(s.collection)
        ? (s.collection as ShopSearch["collection"])
        : undefined,
    sort:
      typeof s.sort === "string" && sorts.has(s.sort) ? (s.sort as ShopSearch["sort"]) : undefined,
  };
}
