"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "desktop" | "mobile";
};

function shortDisplayName(name: string | null | undefined, fallback: string) {
  const trimmed = name?.trim();
  if (!trimmed) return fallback;
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0]!;
  const first = parts[0]!;
  const last = parts[parts.length - 1]!;
  return `${first.charAt(0).toUpperCase()}. ${last}`;
}

export function HeaderAuthActions({ className, variant = "desktop" }: Props) {
  const t = useTranslations("nav");
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  if (isPending) {
    return (
      <div
        className={cn(
          "flex items-center gap-3",
          variant === "mobile" && "w-full flex-col",
          className,
        )}
      >
        <div className="hidden size-10 animate-pulse rounded-full bg-white/10 sm:block" />
      </div>
    );
  }

  if (session?.user) {
    const label = shortDisplayName(session.user.name, t("clientArea"));

    if (variant === "mobile") {
      return (
        <div className={cn("flex w-full flex-col gap-2", className)}>
          <Link
            href="/dashboard"
            className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 px-4 text-sm text-[#AEB7C5]"
          >
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt=""
                className="size-7 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-7 items-center justify-center rounded-full bg-[#D4A62A]/15 text-[#D4A62A]">
                <User className="size-3.5" />
              </span>
            )}
            <span className="truncate font-medium text-white">{label}</span>
          </Link>
          <button
            type="button"
            onClick={() => authClient.signOut()}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 px-3 text-sm text-[#AEB7C5]"
          >
            <LogOut className="size-4" />
            {t("signOut")}
          </button>
        </div>
      );
    }

    return (
      <div className={cn("relative hidden sm:block", className)} ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 py-1 pl-1 pr-2.5 text-sm text-[#AEB7C5] transition-colors hover:border-white/20 hover:text-white"
          aria-expanded={open}
          aria-haspopup="menu"
        >
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt=""
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-8 items-center justify-center rounded-full bg-[#D4A62A]/15 text-[#D4A62A]">
              <User className="size-4" />
            </span>
          )}
          <ChevronDown
            className={cn(
              "size-3.5 opacity-70 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>

        {open ? (
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-2xl border border-white/10 bg-[#0E1422]/98 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,.45)] backdrop-blur-xl"
          >
            <div className="border-b border-white/5 px-3 py-2.5">
              <p className="truncate text-sm font-medium text-white">{label}</p>
              {session.user.email ? (
                <p className="mt-0.5 truncate text-xs text-[#AEB7C5]">
                  {session.user.email}
                </p>
              ) : null}
            </div>
            <Link
              href="/dashboard"
              role="menuitem"
              className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-[#AEB7C5] transition-colors hover:bg-white/5 hover:text-white"
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard className="size-4" />
              {t("clientArea")}
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                void authClient.signOut();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-[#AEB7C5] transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut className="size-4" />
              {t("signOut")}
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        variant === "mobile" && "w-full flex-col gap-3",
        className,
      )}
    >
      <Link
        href="/entrar"
        className={cn(
          "hidden h-10 items-center justify-center gap-2 rounded-full border border-white/10 px-4 text-sm font-medium text-[#AEB7C5] transition-colors duration-300 hover:border-white/20 hover:text-white sm:inline-flex",
          variant === "mobile" && "flex h-12 w-full rounded-2xl",
        )}
      >
        <User className="size-4" strokeWidth={1.75} />
        {t("clientArea")}
      </Link>
    </div>
  );
}
