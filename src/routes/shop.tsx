import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageIntro } from "@/components/layout/page-intro";
import { ProductCard } from "@/components/product/product-card";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";
import { parseShopSearch, type ShopSearch } from "@/lib/shop-search";

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>) => parseShopSearch(s),
  component: ShopPage,
  head: () => ({
    meta: [{ title: "Shop — UrbanTick" }],
  }),
});

const genderFilters = [
  { label: "All", value: undefined },
  { label: "Men", value: "men" as const },
  { label: "Women", value: "women" as const },
];

const strapFilters = [
  { label: "All straps", value: undefined },
  { label: "Leather", value: "leather" as const },
  { label: "Steel", value: "steel" as const },
  { label: "Bracelet", value: "bracelet" as const },
];

function ShopPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const list = products
    .filter((p) => !search.gender || p.gender === search.gender)
    .filter((p) => !search.strap || p.strap === search.strap)
    .filter((p) => !search.collection || p.collection === search.collection)
    .slice()
    .sort((a, b) => {
      if (search.sort === "price-asc") return a.price - b.price;
      if (search.sort === "price-desc") return b.price - a.price;
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });

  return (
    <main className="bg-void">
      <PageIntro
        kicker="The Collection"
        title="Shop"
        lede="Eight atelier and studio pieces. Filter by wearer or strap — every watch is finished to Swiss Eagle spec."
      />
      <div className="site-wrap py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {genderFilters.map((f) => (
              <FilterChip
                key={f.label}
                active={search.gender === f.value}
                search={{ ...search, gender: f.value }}
                label={f.label}
              />
            ))}
            <span className="mx-1 hidden h-8 w-px bg-line-dark sm:inline-block" />
            {strapFilters.map((f) => (
              <FilterChip
                key={f.label}
                active={search.strap === f.value}
                search={{ ...search, strap: f.value }}
                label={f.label}
              />
            ))}
          </div>
          <label className="flex items-center gap-2 text-[12px] text-mist">
            Sort
            <select
              className="h-10 rounded-md border border-line-dark bg-void px-3 text-[12px] text-paper outline-none"
              value={search.sort ?? "featured"}
              onChange={(e) => {
                const sort = e.target.value as ShopSearch["sort"];
                void navigate({ search: { ...search, sort } });
              }}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>
        <p className="mb-6 text-[12px] text-mist tabular-nums">{list.length} pieces</p>
        {list.length === 0 ? (
          <p className="py-20 text-center text-mist">No watches match those filters.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-16 md:grid-cols-4 md:gap-6">
            {list.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function FilterChip({
  label,
  active,
  search,
}: {
  label: string;
  active: boolean;
  search: ShopSearch;
}) {
  return (
    <Link
      to="/shop"
      search={search}
      className={cn(
        "inline-flex h-9 items-center rounded-full px-4 text-[12px] transition-[background-color,color] duration-150",
        active ? "bg-paper text-ink" : "border border-line-dark text-mist hover:text-paper",
      )}
    >
      {label}
    </Link>
  );
}
