import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";
import {
  joinList,
  parseShopSearch,
  splitList,
  type ShopSearch,
  type SortKey,
} from "@/lib/shop-search";

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>) => parseShopSearch(s),
  component: ShopPage,
  head: () => ({
    meta: [{ title: "Shop — UrbanTick" }],
  }),
});

const PAGE_SIZE = 12;

const GENDER_OPTIONS = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

// brands come straight from the product data (src/data/products.ts)
const BRANDS = Array.from(new Set(products.map((p) => p.brand)));

const digitsOnly = (v: string) => v.replace(/\D/g, "");
const formatAmount = (digits: string) =>
  digits ? Number(digits).toLocaleString("en-IN") : "";
const toAmount = (digits: string) => (digits ? Number(digits) : undefined);

function ShopPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });

  const setSearch = (patch: Partial<ShopSearch>) => {
    void navigate({
      search: (prev) => ({ ...prev, ...patch }),
      replace: true,
      resetScroll: false,
    });
  };

  const genders = splitList(search.gender);
  const brands = splitList(search.brand);
  const sort: SortKey = search.sort ?? "featured";

  // ---- text inputs keep local state and commit to the URL after a short pause
  const [query, setQuery] = useState(search.q ?? "");
  const [minText, setMinText] = useState(search.min != null ? String(search.min) : "");
  const [maxText, setMaxText] = useState(search.max != null ? String(search.max) : "");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const q = query.trim() || undefined;
    if (q === search.q) return;
    const t = setTimeout(() => setSearch({ q }), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const min = toAmount(minText);
    const max = toAmount(maxText);
    if (min === search.min && max === search.max) return;
    const t = setTimeout(() => setSearch({ min, max }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minText, maxText]);

  // ---- filtering + sorting
  const list = useMemo(() => {
    const q = (search.q ?? "").toLowerCase();
    return products
      .filter((p) => {
        if (genders.length && !(genders.includes(p.gender) || p.gender === "unisex")) return false;
        if (brands.length && !brands.includes(p.brand)) return false;
        if (search.min != null && p.price < search.min) return false;
        if (search.max != null && p.price > search.max) return false;
        if (q && !`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.gender, search.brand, search.q, search.min, search.max, sort]);

  // ---- "Load more"
  const [limit, setLimit] = useState(PAGE_SIZE);
  const filterKey = `${search.gender}|${search.brand}|${search.q}|${search.min}|${search.max}|${sort}`;
  useEffect(() => setLimit(PAGE_SIZE), [filterKey]);
  const visible = list.slice(0, limit);
  const hasMore = list.length > visible.length;

  const activeCount =
    genders.length + brands.length + (search.min != null || search.max != null ? 1 : 0);
  const anyFilter = activeCount > 0 || Boolean(search.q);

  function clearAll() {
    setQuery("");
    setMinText("");
    setMaxText("");
    void navigate({ search: {}, replace: true, resetScroll: false });
  }

  function toggle(list: string[], value: string) {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  function onSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setSearch({ q: query.trim() || undefined });
  }

  return (
    <main className="bg-paper text-ink">
      <div className="site-wrap py-8 md:py-12 lg:py-14">
        {/* mobile / tablet: filters live behind a button */}
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          className="mb-6 inline-flex h-10 items-center gap-2 rounded-full border border-ink px-4 text-[13px] lg:hidden"
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {activeCount > 0 ? (
            <span className="flex size-5 items-center justify-center rounded-full bg-ink text-[11px] text-paper tabular-nums">
              {activeCount}
            </span>
          ) : null}
        </button>

        <div className="lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* ------------------------------ sidebar ------------------------------ */}
          <aside className={cn("mb-8 lg:mb-0 lg:block lg:pr-9", filtersOpen ? "block" : "hidden")}>
            <div className="flex items-end justify-between border-b border-ink/60 pb-3">
              <h2 className="text-xl text-ink/90">Categories</h2>
              {anyFilter ? (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-[12px] text-ash underline underline-offset-4 hover:text-ink"
                >
                  Clear all
                </button>
              ) : null}
            </div>

            <FilterGroup title="Shop For">
              {GENDER_OPTIONS.map((g) => (
                <CheckRow
                  key={g.value}
                  label={g.label}
                  checked={genders.includes(g.value)}
                  onChange={() => setSearch({ gender: joinList(toggle(genders, g.value)) })}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="BRAND">
              {BRANDS.map((b) => (
                <CheckRow
                  key={b}
                  label={b}
                  checked={brands.includes(b)}
                  onChange={() => setSearch({ brand: joinList(toggle(brands, b)) })}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Price" last>
              <div className="flex items-end">
                <AmountField
                  label="Min"
                  value={minText}
                  onChange={(v) => setMinText(digitsOnly(v))}
                  placeholder="0"
                />
                <span aria-hidden="true" className="mx-0.5 mb-[15px] h-px w-5 bg-ink/70" />
                <AmountField
                  label="Max"
                  value={maxText}
                  onChange={(v) => setMaxText(digitsOnly(v))}
                  placeholder="Any"
                />
              </div>
            </FilterGroup>
          </aside>

          {/* ------------------------------- results ------------------------------ */}
          <section className="min-w-0 lg:border-l lg:border-ink/70 lg:pl-10">
            <div className="lg:w-[92%]">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-[26px] font-medium tracking-tight text-ink/90 md:text-[30px]">
                  Our Collection
                </h1>
                <SortMenu value={sort} onChange={(v) => setSearch({ sort: v === "featured" ? undefined : v })} />
              </div>

              <form role="search" onSubmit={onSearchSubmit} className="relative mt-5">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search An Item"
                  aria-label="Search watches"
                  className="h-[46px] w-full appearance-none rounded-full border border-cloud bg-paper pr-16 pl-5 text-[13px] text-ink outline-none transition-colors duration-200 placeholder:text-ash focus:border-ink [&::-webkit-search-cancel-button]:appearance-none"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-mist text-paper transition-colors duration-200 hover:bg-ash active:scale-95"
                >
                  <Search className="size-[18px]" />
                </button>
              </form>
            </div>

            {list.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-ash">No watches match those filters.</p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-5 inline-flex h-10 items-center rounded-full border border-ink px-5 text-[13px] transition-colors duration-150 hover:bg-ink hover:text-paper"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:mt-10 lg:gap-x-8 lg:gap-y-14">
                  {visible.map((p, i) => (
                    <ProductCard key={p.slug} product={p} index={i} variant="inline" />
                  ))}
                </div>

                <div className="mt-14 flex flex-col items-center pb-4 lg:mt-16">
                  <p className="text-[13px] text-ash tabular-nums">
                    Showing 1–{visible.length} of {list.length} item(s)
                  </p>
                  <div className="mt-3 h-[2px] w-full max-w-[410px] bg-mist/70" />
                  {hasMore ? (
                    <button
                      type="button"
                      onClick={() => setLimit((n) => n + PAGE_SIZE)}
                      className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-[14px] font-medium text-paper transition-[transform,background-color] duration-150 hover:bg-ink/85 active:scale-95"
                    >
                      Load More
                      <ChevronRight className="size-4" />
                    </button>
                  ) : null}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

/* ----------------------------------------------------------------------------
 * small building blocks
 * -------------------------------------------------------------------------- */

function FilterGroup({
  title,
  last = false,
  children,
}: {
  title: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("border-b border-ink/60 py-7 pl-2 lg:pl-9", last && "pb-9")}>
      <h3 className="mb-4 text-[16px] font-semibold text-ink">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 text-[14px] text-ink/90 select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-[15px] cursor-pointer accent-ink"
      />
      {label}
    </label>
  );
}

function AmountField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block pl-2 text-[12px] text-ash">{label}</span>
      <span className="flex h-8 w-[84px] items-center rounded-2xl border border-ink px-2.5 text-[12px] text-ink focus-within:border-2">
        <span className="mr-0.5">₹</span>
        <input
          inputMode="numeric"
          value={formatAmount(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={`${label} price`}
          className="w-full min-w-0 bg-transparent tabular-nums outline-none placeholder:text-ash"
        />
      </span>
    </label>
  );
}

function SortMenu({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="group inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-ink pr-3.5 pl-5 text-[13px] font-medium text-paper transition-transform duration-150 hover:bg-ink/85 active:scale-95"
        >
          Sort
          <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="menu-panel z-50 min-w-[200px] rounded-xl border border-line bg-paper p-1.5 text-ink shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
        >
          <DropdownMenu.RadioGroup value={value} onValueChange={(v) => onChange(v as SortKey)}>
            {SORT_OPTIONS.map((o) => (
              <DropdownMenu.RadioItem
                key={o.value}
                value={o.value}
                className="relative flex cursor-pointer items-center rounded-lg py-2 pr-3 pl-8 text-[13px] outline-none select-none data-[highlighted]:bg-soft"
              >
                <DropdownMenu.ItemIndicator className="absolute left-2.5 inline-flex">
                  <Check className="size-4" />
                </DropdownMenu.ItemIndicator>
                {o.label}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
