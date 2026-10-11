"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

/** Official REESKOVA mark: gold isometric house. */
export function ReeskovaMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/reeskova-mark.png"
      alt=""
      aria-hidden
      className={cn("shrink-0 object-contain", className)}
    />
  );
}

type LogoProps = {
  className?: string;
  /** Footer only */
  showPoweredBy?: boolean;
  compact?: boolean;
  wordmarkClassName?: string;
  /** Light page surface. Keeps the wordmark dark enough to read. */
  onLight?: boolean;
};

export function Logo({
  className,
  showPoweredBy = false,
  compact = false,
  wordmarkClassName,
  onLight = false,
}: LogoProps) {
  const t = useTranslations("brand");

  return (
    <Link
      href="/"
      aria-label="Reeskova home"
      className={cn("flex items-center gap-3", className)}
    >
      <ReeskovaMark className={compact ? "size-10" : "size-12"} />
      <div className={cn("flex min-w-0 flex-col leading-none", wordmarkClassName)}>
        <span
          className={cn(
            "font-bold tracking-[0.12em] uppercase",
            compact
              ? "text-[17px] text-[#EBAD5B]"
              : onLight
                ? "text-[18px] text-[#9A6B24]"
                : "text-[18px] text-white",
          )}
        >
          REESKOVA
        </span>
        {compact ? null : (
          <span
            className={cn(
              "mt-1.5 max-w-[11rem] text-[9px] font-medium leading-snug tracking-[0.04em]",
              onLight ? "text-[#6B5428]" : "text-[#D49A3F]",
            )}
          >
            {t("tagline")}
          </span>
        )}
        {showPoweredBy ? (
          <span className="mt-2 flex items-center gap-2 text-[9px] text-[#AEB7C5]">
            <span className="h-px w-4 bg-[#D49A3F]/50" aria-hidden />
            {t("poweredBy")}{" "}
            <span className="text-[#D49A3F]">{t("poweredByBrand")}</span>
            <span className="h-px w-4 bg-[#D49A3F]/50" aria-hidden />
          </span>
        ) : null}
      </div>
    </Link>
  );
}
