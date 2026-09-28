export type SortKey = "featured" | "price-asc" | "price-desc";

/**
 * Everything the Shop page filters on lives in the URL, so a filtered view can be
 * shared / bookmarked and footer links like /shop?gender=men keep working.
 * gender and brand are comma-separated lists ("men,women").
 */
export type ShopSearch = {
  gender?: string;
  brand?: string;
  q?: string;
  min?: number;
  max?: number;
  sort?: SortKey;
};

const genders = new Set(["men", "women", "unisex"]);
const sorts = new Set<string>(["featured", "price-asc", "price-desc"]);

export function splitList(value?: string): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

export function joinList(values: string[]): string | undefined {
  return values.length ? values.join(",") : undefined;
}

function asText(v: unknown): string | undefined {
  // the router turns "123" into the number 123 when it parses the URL
  if (typeof v === "string") return v.trim() || undefined;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return undefined;
}

function asAmount(v: unknown): number | undefined {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : undefined;
}

export function parseShopSearch(s: Record<string, unknown>): ShopSearch {
  const gender = joinList(splitList(asText(s.gender)).filter((g) => genders.has(g)));
  const brand = asText(s.brand)?.slice(0, 200);
  const q = asText(s.q)?.slice(0, 80);
  return {
    gender,
    brand,
    q,
    min: asAmount(s.min),
    max: asAmount(s.max),
    sort: typeof s.sort === "string" && sorts.has(s.sort) ? (s.sort as SortKey) : undefined,
  };
}
