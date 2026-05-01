"use client";

import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ServiceListingCard, type ServiceListingCardService } from "@/components/service-listing-card";
import { cn } from "@/lib/utils";

type PriceFilter = "all" | "under150" | "mid" | "over250";

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";

function matchesPrice(price: number, filter: PriceFilter) {
  if (filter === "all") return true;
  if (filter === "under150") return price < 150;
  if (filter === "mid") return price >= 150 && price <= 250;
  return price > 250;
}

export function ServicesDirectory({ services }: { services: ServiceListingCardService[] }) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [sort, setSort] = useState<SortOption>("default");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [openServiceType, setOpenServiceType] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openSort, setOpenSort] = useState(true);

  const defaultOrder = useMemo(() => services.map((s) => s.id), [services]);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...services];

    if (selectedIds.length > 0) {
      list = list.filter((s) => selectedIds.includes(s.id));
    }

    if (q.length > 0) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    }

    list = list.filter((s) => matchesPrice(s.price, priceFilter));

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
    else {
      const order = defaultOrder;
      list.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    }

    return list;
  }, [services, selectedIds, query, priceFilter, sort, defaultOrder]);

  const toggleId = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const resetFilters = () => {
    setQuery("");
    setSelectedIds([]);
    setPriceFilter("all");
    setSort("default");
  };

  const hasActiveFilters =
    query.trim() !== "" || selectedIds.length > 0 || priceFilter !== "all" || sort !== "default";

  const Sidebar = (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
          Filters
        </h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-8 shrink-0 text-xs text-purple-800" type="button" onClick={resetFilters}>
            <X className="mr-1 h-3.5 w-3.5" aria-hidden />
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="svc-search" className="text-xs font-medium uppercase tracking-wide text-neutral-600">
          Search
        </Label>
        <Input
          id="svc-search"
          placeholder="Search by service name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-xl border-neutral-200 bg-white"
        />
      </div>

      <Separator className="bg-neutral-100" />

      <Collapsible open={openServiceType} onOpenChange={setOpenServiceType}>
        <CollapsibleTrigger
          type="button"
          className="flex w-full items-center justify-between gap-2 rounded-lg py-2 text-left text-base font-bold text-purple-900 outline-none transition-colors hover:bg-purple-50/80 hover:text-purple-950 focus-visible:ring-2 focus-visible:ring-purple-600/35 focus-visible:ring-offset-2"
        >
          <span>Service type</span>
          <ChevronDown
            className={cn(
              "size-5 shrink-0 text-purple-900 transition-transform duration-200",
              openServiceType && "rotate-180"
            )}
            aria-hidden
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-1">
          <ul className="space-y-2.5">
            <li>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-purple-100/90 bg-purple-50/60 px-2 py-2 text-sm transition-colors hover:bg-purple-50">
                <Checkbox
                  checked={selectedIds.length === 0}
                  onCheckedChange={(v) => {
                    if (v === true) setSelectedIds([]);
                  }}
                  aria-label="Include all services"
                />
                <span className="font-semibold text-purple-950">All services</span>
              </label>
            </li>
            {services.map((s) => (
              <li key={s.id}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-purple-50/80">
                  <Checkbox
                    checked={selectedIds.includes(s.id)}
                    onCheckedChange={(v) => toggleId(s.id, v === true)}
                    aria-label={`Filter ${s.name}`}
                  />
                  <span className="leading-snug text-neutral-800">{s.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="bg-neutral-100" />

      <Collapsible open={openPrice} onOpenChange={setOpenPrice}>
        <CollapsibleTrigger
          type="button"
          className="flex w-full items-center justify-between gap-2 rounded-lg py-2 text-left text-base font-bold text-purple-900 outline-none transition-colors hover:bg-purple-50/80 hover:text-purple-950 focus-visible:ring-2 focus-visible:ring-purple-600/35 focus-visible:ring-offset-2"
        >
          <span>Starting price</span>
          <ChevronDown
            className={cn(
              "size-5 shrink-0 text-purple-900 transition-transform duration-200",
              openPrice && "rotate-180"
            )}
            aria-hidden
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <RadioGroup
            value={priceFilter}
            onValueChange={(v) => setPriceFilter(v as PriceFilter)}
            className="gap-2.5"
          >
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value="all" id="pf-all" />
              <span>All prices</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value="under150" id="pf-u150" />
              <span>Under $150</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value="mid" id="pf-mid" />
              <span>$150 – $250</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value="over250" id="pf-o250" />
              <span>Over $250</span>
            </label>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="bg-neutral-100" />

      <Collapsible open={openSort} onOpenChange={setOpenSort}>
        <CollapsibleTrigger
          type="button"
          className="flex w-full items-center justify-between gap-2 rounded-lg py-2 text-left text-base font-bold text-purple-900 outline-none transition-colors hover:bg-purple-50/80 hover:text-purple-950 focus-visible:ring-2 focus-visible:ring-purple-600/35 focus-visible:ring-offset-2"
        >
          <span>Sort</span>
          <ChevronDown
            className={cn(
              "size-5 shrink-0 text-purple-900 transition-transform duration-200",
              openSort && "rotate-180"
            )}
            aria-hidden
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <RadioGroup value={sort} onValueChange={(v) => setSort(v as SortOption)} className="gap-2.5">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value="default" id="s-def" />
              <span>Featured order</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value="price-asc" id="s-pa" />
              <span>Price — low to high</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value="price-desc" id="s-pd" />
              <span>Price — high to low</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value="name-asc" id="s-na" />
              <span>Name — A to Z</span>
            </label>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-neutral-50/90 via-white to-purple-50/30 pb-16 pt-8 md:pb-24 md:pt-10">
        <div className="container mx-auto px-4">
          <h1 className="sr-only">Cleaning services</h1>
          <div className="mb-4 flex items-center justify-between gap-4 lg:hidden">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-purple-200/80 bg-white shadow-sm"
              onClick={() => setMobileFiltersOpen((o) => !o)}
              aria-expanded={mobileFiltersOpen}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 rounded-full bg-purple-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                  On
                </span>
              )}
            </Button>
            <p className="text-sm text-neutral-600">
              <span className="font-semibold text-neutral-900">{filteredSorted.length}</span>
              {' '}shown
            </p>
          </div>

          <div
            className={cn(
              "overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm lg:hidden",
              !mobileFiltersOpen && "hidden"
            )}
          >
            {Sidebar}
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
            <aside className="hidden w-72 shrink-0 lg:block">
              <div className="sticky top-24 rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm ring-1 ring-neutral-950/[0.03]">
                {Sidebar}
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              <div className="mb-6 hidden items-baseline justify-between gap-4 border-b border-neutral-100 pb-4 lg:flex">
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {filteredSorted.length}{" "}
                    <span className="font-normal text-neutral-600">service{filteredSorted.length === 1 ? "" : "s"}</span>
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">Use the sidebar to refine this list anytime.</p>
                </div>
              </div>

              {filteredSorted.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-neutral-200 bg-white/70 px-6 py-16 text-center">
                  <p className="font-medium text-neutral-900">No services match those filters.</p>
                  <p className="mt-2 text-sm text-neutral-600">Try widening the price band or clearing service types.</p>
                  <Button className="mt-6 rounded-xl bg-purple-900 hover:bg-purple-950" type="button" onClick={resetFilters}>
                    Reset filters
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                  {filteredSorted.map((service) => (
                    <ServiceListingCard key={service.id} service={service} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
