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

  const filterContent = (
    <>
      <SidebarSection title="Shop For">
        {GENDER_OPTIONS.map((g) => (
          <CheckRow
            key={g.value}
            label={g.label}
            checked={genders.includes(g.value)}
            onChange={() => setSearch({ gender: joinList(toggle(genders, g.value)) })}
          />
        ))}
      </SidebarSection>
      <SidebarSection title="Brand">
        {BRANDS.map((b) => (
          <CheckRow
            key={b}
            label={b}
            checked={brands.includes(b)}
            onChange={() => setSearch({ brand: joinList(toggle(brands, b)) })}
          />
        ))}
      </SidebarSection>
      <SidebarSection title="Price Range" last>
        <div className="flex items-end gap-2">
          <AmountField label="Min" value={minText} onChange={(v) => setMinText(digitsOnly(v))} placeholder="0" />
          <span aria-hidden="true" className="mb-[14px] h-px w-4 shrink-0 bg-ink/40" />
          <AmountField label="Max" value={maxText} onChange={(v) => setMaxText(digitsOnly(v))} placeholder="Any" />
        </div>
      </SidebarSection>
    </>
  );

  return (
    <main className="bg-paper text-ink">

      {/* ── Mobile dropdown overlay ── */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setFiltersOpen(false)}>
          <div className="absolute inset-0 bg-ink/20" />
        </div>
      )}
      {/* Dropdown panel — sits below the trigger row */}
      <div
        className={cn(
          "fixed left-0 right-0 z-50 lg:hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          filtersOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none",
        )}
        style={{ top: "64px" }}
      >
        <div className="mx-4 rounded-2xl bg-paper shadow-[0_8px_32px_rgba(0,0,0,0.14)] border border-line overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
            <h2 className="text-[14px] font-semibold text-ink">Filters</h2>
            <div className="flex items-center gap-3">
              {anyFilter && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-[12px] font-medium text-ash underline underline-offset-4"
                >
                  Clear all
                </button>
              )}
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="flex size-7 items-center justify-center rounded-full bg-soft text-ink/50 text-[13px] hover:bg-line"
              >
                ✕
              </button>
            </div>
          </div>
          {/* Content */}
          <div className="px-5 pt-2 pb-4 max-h-[60vh] overflow-y-auto">
            {filterContent}
          </div>
          {/* Apply */}
          <div className="px-5 pb-4 pt-1">
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="w-full h-11 rounded-full bg-ink text-paper text-[13px] font-semibold tracking-wide transition-all active:scale-95"
            >
              {list.length > 0 ? `Show ${list.length} Results` : "No Results"}
            </button>
          </div>
        </div>
      </div>

      <div className="site-wrap pt-6 pb-16 md:pt-8 md:pb-20">
        <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-0">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block">
            <div className="sidebar-card rounded-2xl border border-line bg-soft/60 px-6 py-7 lg:sticky lg:top-[88px]">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[15px] font-semibold uppercase tracking-[0.12em] text-ink/60">
                  Filters
                </h2>
                {anyFilter && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-[11px] font-medium uppercase tracking-wider text-ash underline underline-offset-4 transition-colors hover:text-ink"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {filterContent}
            </div>
          </aside>

          {/* ── Results ── */}
          <section className="min-w-0 lg:border-l lg:border-line lg:pl-10">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-[26px] font-medium tracking-tight text-ink/90 md:text-[30px]">
                Our Collection
              </h1>
              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-ink/20 bg-soft px-4 text-[12px] font-medium tracking-wide transition-all hover:border-ink/50 lg:hidden"
                >
                  <SlidersHorizontal className="size-3.5" />
                  Filters
                  {activeCount > 0 && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-ink text-[10px] text-paper">
                      {activeCount}
                    </span>
                  )}
                </button>
                <SortMenu
                  value={sort}
                  onChange={(v) => setSearch({ sort: v === "featured" ? undefined : v })}
                />
              </div>
            </div>

            <form role="search" onSubmit={onSearchSubmit} className="relative mt-4 mb-2">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search An Item"
                aria-label="Search watches"
                className="h-[48px] w-full appearance-none rounded-full border border-cloud bg-soft/50 pr-16 pl-6 text-[13px] text-ink outline-none transition-all duration-200 placeholder:text-ash/60 focus:border-ink/50 focus:bg-paper focus:shadow-[0_0_0_3px_rgba(22,22,22,0.06)] [&::-webkit-search-cancel-button]:appearance-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-paper transition-all duration-200 hover:bg-ink/80 active:scale-95"
              >
                <Search className="size-[16px]" />
              </button>
            </form>

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
                <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:mt-8 lg:gap-x-6 lg:gap-y-10">
                  {visible.map((p, i) => (
                    <ProductCard key={p.slug} product={p} index={i} variant="inline" />
                  ))}
                </div>

                <div className="mt-14 flex flex-col items-center pb-4 lg:mt-16">
                  <p className="text-[12px] uppercase tracking-widest text-ash/70 tabular-nums">
                    Showing {visible.length} of {list.length} items
                  </p>
                  <div className="mt-3 h-px w-full max-w-[320px] bg-gradient-to-r from-transparent via-line to-transparent" />
                  {hasMore ? (
                    <button
                      type="button"
                      onClick={() => setLimit((n) => n + PAGE_SIZE)}
                      className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-8 text-[13px] font-medium tracking-wide text-paper transition-all duration-200 hover:bg-ink/85 hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] active:scale-95"
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

/* ── Sidebar Section ── */
function SidebarSection({
  title,
  last = false,
  children,
}: {
  title: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("border-t border-line/80 pt-5", last ? "pb-0" : "pb-5")}>
      <h3 className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ash">
        {title}
      </h3>
      <div className="space-y-0.5">{children}</div>
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
    <label
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-[13px] select-none transition-colors duration-150",
        checked ? "bg-ink/[0.06] text-ink" : "text-ink/70 hover:bg-ink/[0.04] hover:text-ink",
      )}
    >
      <span
        className={cn(
          "flex size-[15px] shrink-0 items-center justify-center rounded border transition-all duration-200",
          checked
            ? "border-ink bg-ink"
            : "border-cloud bg-paper group-hover:border-ink/40",
        )}
      >
        {checked && (
          <svg
            className="size-2.5 text-paper"
            fill="none"
            viewBox="0 0 10 8"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
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
    <label className="block flex-1">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-ash/70">
        {label}
      </span>
      <span className="flex h-9 w-full items-center rounded-xl border border-line bg-paper px-3 text-[12px] text-ink transition-colors focus-within:border-ink/40 focus-within:shadow-[0_0_0_2px_rgba(22,22,22,0.06)]">
        <span className="mr-0.5 text-ash">₹</span>
        <input
          inputMode="numeric"
          value={formatAmount(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={`${label} price`}
          className="w-full min-w-0 bg-transparent tabular-nums outline-none placeholder:text-ash/50"
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
          className="group inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-ink pr-4 pl-5 text-[12px] font-medium tracking-wide text-paper transition-all duration-150 hover:bg-ink/85 hover:shadow-[0_4px_14px_rgba(0,0,0,0.2)] active:scale-95"
        >
          Sort
          <ChevronDown className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="menu-panel z-50 min-w-[200px] rounded-2xl border border-line bg-paper p-1.5 text-ink shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
        >
          <DropdownMenu.RadioGroup value={value} onValueChange={(v) => onChange(v as SortKey)}>
            {SORT_OPTIONS.map((o) => (
              <DropdownMenu.RadioItem
                key={o.value}
                value={o.value}
                className="relative flex cursor-pointer items-center rounded-xl py-2.5 pr-3 pl-9 text-[13px] outline-none select-none transition-colors data-[highlighted]:bg-soft"
              >
                <DropdownMenu.ItemIndicator className="absolute left-3 inline-flex">
                  <Check className="size-3.5" />
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
