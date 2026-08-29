"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MatchExplainDto } from "@/lib/match/types";
import { cn } from "@/lib/utils";

const RATING_CLASS: Record<string, string> = {
  excellent: "text-[#059669]",
  good: "text-[#2563EB]",
  fair: "text-[#D97706]",
  weak: "text-[#DC2626]",
  unknown: "text-[#6B7285]",
};

type Props = {
  open: boolean;
  onClose: () => void;
  data: MatchExplainDto | null;
  loading?: boolean;
  onAsk?: (question: string) => void;
  answer?: string;
  asking?: boolean;
};

export function MatchExplainDrawer({
  open,
  onClose,
  data,
  loading,
  onAsk,
  answer,
  asking,
}: Props) {
  const t = useTranslations("match.explain");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <button type="button" className="flex-1" aria-label={t("close")} onClick={onClose} />
      <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7285]">
              {t("kicker")}
            </p>
            <h2 className="rk-display mt-1 text-2xl font-bold">
              {data ? `${data.totalScore}%` : t("loading")}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-1 hover:bg-[#F3F4F6]">
            <X className="size-5" />
          </button>
        </div>

        {loading || !data ? (
          <p className="mt-6 text-sm text-[#6B7285]">{t("loading")}</p>
        ) : (
          <>
            <ul className="mt-6 space-y-4">
              {data.breakdown.dimensions.map((item) => (
                <li key={item.key}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold">{item.label}</p>
                    <p className={cn("text-xs font-bold uppercase", RATING_CLASS[item.rating])}>
                      {t(`rating.${item.rating}`)}
                    </p>
                  </div>
                  <p className="mt-0.5 text-sm text-[#6B7285]">{item.detail}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t border-[#EEF2F7] pt-5">
              <p className="text-xs font-bold uppercase tracking-wider">{t("insight")}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#374151]">{data.insight}</p>
            </div>
            {onAsk ? (
              <form
                className="mt-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = event.currentTarget;
                  const value = String(new FormData(form).get("q") ?? "").trim();
                  if (value) onAsk(value);
                  form.reset();
                }}
              >
                <label className="text-xs font-semibold text-[#6B7285]">
                  {t("ask")}
                  <input
                    name="q"
                    placeholder={t("askPlaceholder")}
                    className="mt-1 h-10 w-full rounded-md border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#EBAD5B]"
                  />
                </label>
                <button
                  type="submit"
                  disabled={asking}
                  className="mt-2 text-sm font-semibold text-[#2563EB] disabled:opacity-50"
                >
                  {asking ? t("asking") : t("askSubmit")}
                </button>
                {answer ? (
                  <p className="mt-3 text-sm leading-relaxed text-[#374151]">{answer}</p>
                ) : null}
              </form>
            ) : null}
          </>
        )}
      </aside>
    </div>
  );
}
