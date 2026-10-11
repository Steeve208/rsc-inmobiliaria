"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { categoryIcon } from "@/components/marketplace/marketplace-icons";
import { CATEGORY_SHORTCUTS } from "@/lib/marketplace/catalog";
import { Link, usePathname } from "@/lib/i18n/routing";
import type { MarketplaceCategoryShortcut } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

const PRIMARY_IDS = [
  "apartments",
  "houses",
  "land",
  "commercial",
  "rentals",
  "projects",
  "businesses",
] as const;

type Props = {
  items: MarketplaceCategoryShortcut[];
};

function matchesHref(
  pathname: string,
  search: URLSearchParams,
  href: string,
) {
  const url = new URL(href, "http://local");
  if (url.pathname !== pathname) return false;
  for (const [key, value] of url.searchParams) {
    if (search.get(key) !== value) return false;
  }
  return url.searchParams.toString().length > 0 || search.toString().length === 0;
}

export function CategoryShortcuts({ items }: Props) {
  const t = useTranslations("marketplace.categories");
  const tMarket = useTranslations("marketplace");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  const byId = new Map<string, MarketplaceCategoryShortcut>();
  for (const item of CATEGORY_SHORTCUTS) byId.set(item.id, item);
  for (const item of items) byId.set(item.id, item);

  const visible = PRIMARY_IDS.map((id) => byId.get(id)).filter(
    (item): item is MarketplaceCategoryShortcut => Boolean(item),
  );
  const overflow = [...byId.values()].filter(
    (item) =>
      !PRIMARY_IDS.includes(item.id as (typeof PRIMARY_IDS)[number]) &&
      item.id !== "more",
  );
  const seeAllHref = byId.get("more")?.href ?? "/imoveis";

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname, searchParams]);

  if (visible.length === 0) return null;

  function labelFor(item: MarketplaceCategoryShortcut) {
    return t.has(item.id) ? t(item.id) : item.label?.trim() || item.id;
  }

  function cellClass(active: boolean) {
    return cn(
      "relative flex min-w-[68px] flex-1 flex-col items-center justify-center gap-0.5 px-1.5 text-center transition",
      active ? "bg-[#EEF4FF]" : "hover:bg-[#F7FAFC]",
    );
  }

  return (
    <nav
      ref={rootRef}
      className="relative mt-2 rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] ring-1 ring-black/[0.04]"
    >
      <div className="flex h-[64px] items-stretch overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {visible.map((item, index) => {
          const Icon = categoryIcon(item.id);
          const active = matchesHref(pathname, searchParams, item.href);
          return (
            <div key={item.id} className="flex min-w-[68px] flex-1">
              {index > 0 ? (
                <span className="my-3 w-px shrink-0 bg-[#E8EEF4]" aria-hidden />
              ) : null}
              <Link href={item.href} className={cellClass(active)}>
                <Icon className="size-8 object-contain" priority={index < 4} />
                <span className="whitespace-nowrap text-[10px] font-semibold leading-tight text-[#4B5563]">
                  {labelFor(item)}
                </span>
                {active ? (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-t-full bg-[#2563EB]" />
                ) : null}
              </Link>
            </div>
          );
        })}

        <div className="relative flex min-w-[68px] flex-1">
          <span className="my-3 w-px shrink-0 bg-[#E8EEF4]" aria-hidden />
          <button
            type="button"
            className={cn(cellClass(open), "w-full")}
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => setOpen((value) => !value)}
          >
            {(() => {
              const Icon = categoryIcon("more");
              return <Icon className="size-8 object-contain" />;
            })()}
            <span className="inline-flex items-center gap-0.5 whitespace-nowrap text-[10px] font-semibold leading-tight text-[#4B5563]">
              {t("more")}
              <ChevronDown
                className={cn("size-3 transition", open && "rotate-180")}
              />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          role="menu"
          className="absolute right-3 top-[calc(100%+8px)] z-30 w-56 overflow-hidden rounded-xl bg-white py-1 shadow-[0_12px_40px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.06]"
        >
          {overflow.map((item) => {
            const Icon = categoryIcon(item.id);
            return (
              <Link
                key={item.id}
                href={item.href}
                role="menuitem"
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#374151] hover:bg-[#F4F7FA]"
              >
                <Icon className="size-6 object-contain" />
                {labelFor(item)}
              </Link>
            );
          })}
          <Link
            href={seeAllHref}
            role="menuitem"
            className="block border-t border-[#E8EEF4] px-3 py-2 text-xs font-semibold text-[#2563EB] hover:bg-[#F4F7FA]"
          >
            {tMarket("seeAll")}
          </Link>
        </div>
      ) : null}
    </nav>
  );
}
