"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ error, reset }: Props) {
  const t = useTranslations("errors.error");

  useEffect(() => {
    console.error("[locale-error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a017]">
        {t("badge")}
      </p>
      <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
        {t("description")}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-[#d4a017] px-5 text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#c39216]"
        >
          {t("retry")}
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-white/10 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/15"
        >
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
