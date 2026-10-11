"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/layout/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Link, usePathname } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "properties", href: "/imoveis" },
  { id: "destinations", href: "/destinos" },
  { id: "journal", href: "/revistas" },
] as const;

type Props = {
  className?: string;
  onSearch?: () => void;
  showJournal?: boolean;
};

export function ResidenceNav({ className, onSearch, showJournal = false }: Props) {
  const t = useTranslations("marketplace.residence");
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const items = NAV.filter((item) => item.id !== "journal" || showJournal);

  const active =
    pathname === "/imoveis" || pathname.startsWith("/imoveis/")
      ? "properties"
      : pathname === "/destinos" || pathname.startsWith("/destinos/")
        ? "destinations"
        : pathname === "/revistas" || pathname.startsWith("/revistas/")
          ? "journal"
          : null;

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "z-40 flex h-14 items-center gap-2 px-[max(1rem,env(safe-area-inset-left))] pe-[max(1rem,env(safe-area-inset-right))] sm:gap-3 sm:px-6 lg:h-16 lg:gap-6 lg:px-8",
        open && "z-[80]",
        className,
      )}
    >
      <Logo
        compact
        wordmarkClassName="max-[379px]:hidden"
        className="min-w-0 shrink gap-2"
      />

      <nav className="hidden items-center gap-3 lg:flex" aria-label={tNav("toggleMenu")}>
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            aria-current={active === item.id ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full px-4 text-[17px] font-medium text-white/90 transition hover:bg-white/10 hover:text-white",
              active === item.id && "bg-white/10 text-white",
            )}
          >
            {t(`nav.${item.id}`)}
          </Link>
        ))}
      </nav>

      <div className="ms-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
        {onSearch ? (
          <button
            type="button"
            className="inline-flex size-14 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
            aria-label={t("search.destination")}
            onClick={onSearch}
          >
            <Search className="size-7" />
          </button>
        ) : (
          <Link
            href="/imoveis"
            className="inline-flex size-14 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
            aria-label={t("search.destination")}
          >
            <Search className="size-7" />
          </Link>
        )}
        <LocaleSwitcher size="lg" className="hidden sm:block" />
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full text-white lg:hidden"
          aria-label={tNav("toggleMenu")}
          aria-expanded={open}
          aria-controls="residence-menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/55"
            aria-label={tNav("toggleMenu")}
            onClick={() => setOpen(false)}
          />
          <div
            id="residence-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-y-0 end-0 flex w-full flex-col bg-[#0c1016] text-white shadow-2xl sm:w-[min(100%,20rem)]"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <p id={titleId} className="text-sm font-semibold tracking-[0.14em]">
                REESKOVA
              </p>
              <button
                ref={closeRef}
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-full text-white hover:bg-white/10"
                aria-label={tNav("toggleMenu")}
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex flex-col px-2 py-2">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={active === item.id ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center rounded-xl px-3 text-[15px] text-white/85 hover:bg-white/5 hover:text-white",
                    active === item.id && "text-[#E7C48A]",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {t(`nav.${item.id}`)}
                </Link>
              ))}
            </nav>
            <div className="mt-auto border-t border-white/10 px-4 py-4 sm:hidden">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
