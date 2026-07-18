"use client";

import { useTranslations } from "next-intl";
import { LogOut, User } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "desktop" | "mobile";
};

export function HeaderAuthActions({ className, variant = "desktop" }: Props) {
  const t = useTranslations("nav");
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className={cn("flex items-center gap-3", variant === "mobile" && "w-full flex-col", className)}>
        <div className="hidden h-[42px] w-24 animate-pulse rounded-[14px] bg-white/10 sm:block" />
        <div className="hidden h-[42px] w-40 animate-pulse rounded-[14px] bg-white/10 sm:block" />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className={cn("flex items-center gap-3", variant === "mobile" && "w-full flex-col", className)}>
        <Link
          href="/dashboard"
          className={cn(
            "hidden h-[42px] max-w-[160px] items-center gap-2 truncate rounded-[14px] border border-white/10 px-3 text-sm text-[#C8D0DD] transition-all duration-300 hover:bg-white/5 sm:inline-flex",
            variant === "mobile" && "flex h-11 w-full max-w-none justify-center",
          )}
        >
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={session.user.image} alt="" className="size-6 rounded-full object-cover" />
          ) : (
            <User className="size-4 shrink-0" />
          )}
          <span className="truncate">{session.user.name || session.user.email}</span>
        </Link>
        <Link
          href="/cadastrar"
          className={cn(
            "rk-btn-gold hidden h-[42px] items-center justify-center px-5 text-sm sm:inline-flex",
            variant === "mobile" && "flex h-11 w-full",
          )}
        >
          {t("publishListing")}
        </Link>
        <button
          type="button"
          onClick={() => authClient.signOut()}
          className={cn(
            "hidden h-[42px] items-center justify-center gap-2 rounded-[14px] border border-white/10 px-3 text-sm text-[#C8D0DD] transition-all duration-300 hover:bg-white/5 sm:inline-flex",
            variant === "mobile" && "flex h-11 w-full",
          )}
        >
          <LogOut className="size-4" />
          {variant === "mobile" && t("signOut")}
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", variant === "mobile" && "w-full flex-col gap-3", className)}>
      <Link
        href="/entrar"
        className={cn(
          "hidden h-[42px] items-center justify-center px-2 text-sm font-medium text-[#C8D0DD] transition-colors duration-300 hover:text-white sm:inline-flex",
          variant === "mobile" && "flex h-11 w-full rounded-[14px] border border-white/10",
        )}
      >
        {t("signIn")}
      </Link>
      <Link
        href="/cadastrar"
        className={cn(
          "rk-btn-gold hidden h-[42px] items-center justify-center px-5 text-sm sm:inline-flex",
          variant === "mobile" && "flex h-11 w-full",
        )}
      >
        {t("publishListing")}
      </Link>
    </div>
  );
}
