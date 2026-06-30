"use client";

import { useTranslations } from "next-intl";
import { Heart, LogOut, User } from "lucide-react";
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
      <div
        className={cn(
          "flex items-center gap-2 sm:gap-3",
          variant === "mobile" && "w-full flex-col",
          className,
        )}
      >
        <div className="hidden h-9 w-24 animate-pulse rounded-md bg-white/10 sm:block" />
        <div className="hidden h-9 w-28 animate-pulse rounded-md bg-white/10 sm:block" />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 sm:gap-3",
          variant === "mobile" && "w-full flex-col",
          className,
        )}
      >
        <Link
          href="/dashboard"
          className={cn(
            "inline-flex rounded-md p-2 text-white/90 transition-colors hover:bg-white/5 hover:text-white",
            variant === "mobile" && "w-full justify-center border border-white/10 py-2.5",
          )}
          aria-label={t("wishlist")}
        >
          <Heart className="size-5" strokeWidth={1.5} />
          {variant === "mobile" && (
            <span className="ml-2 text-sm font-medium">{t("wishlist")}</span>
          )}
        </Link>

        <Link
          href="/dashboard"
          className={cn(
            "hidden h-9 max-w-[160px] items-center gap-2 truncate rounded-md border border-white/15 px-3 text-sm text-white/90 transition-colors hover:bg-white/5 sm:inline-flex",
            variant === "mobile" && "flex h-10 w-full max-w-none justify-center",
          )}
        >
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt=""
              className="size-6 rounded-full object-cover"
            />
          ) : (
            <User className="size-4 shrink-0" />
          )}
          <span className="truncate">
            {session.user.name || session.user.email}
          </span>
        </Link>

        <button
          type="button"
          onClick={() => authClient.signOut()}
          className={cn(
            "hidden h-9 items-center justify-center gap-2 rounded-md border border-white/15 px-3 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white sm:inline-flex",
            variant === "mobile" && "flex h-10 w-full",
          )}
        >
          <LogOut className="size-4" />
          {variant === "mobile" && t("signOut")}
        </button>
      </div>
    );
  }

  const signInHref =
    variant === "desktop" ? "/entrar" : "/entrar";
  const signUpHref = "/cadastrar";
  const wishlistHref = "/entrar?callbackUrl=/dashboard";

  return (
    <div
      className={cn(
        "flex items-center gap-2 sm:gap-3",
        variant === "mobile" && "w-full flex-col gap-3",
        className,
      )}
    >
      <Link
        href={wishlistHref}
        className={cn(
          "inline-flex rounded-md p-2 text-white/90 transition-colors hover:bg-white/5 hover:text-white",
          variant === "mobile" && "hidden",
        )}
        aria-label={t("wishlist")}
      >
        <Heart className="size-5" strokeWidth={1.5} />
      </Link>

      <Link
        href={signInHref}
        className={cn(
          "hidden h-9 items-center justify-center rounded-md border border-[#3b82f6] px-4 text-sm font-medium text-white transition-colors hover:bg-white/5 sm:inline-flex",
          variant === "mobile" && "flex h-10 w-full",
        )}
      >
        {t("signIn")}
      </Link>

      <Link
        href={signUpHref}
        className={cn(
          "hidden h-9 items-center justify-center rounded-md bg-[#d4a017] px-4 text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#c39216] sm:inline-flex",
          variant === "mobile" && "flex h-10 w-full",
        )}
      >
        {t("signUp")}
      </Link>
    </div>
  );
}
