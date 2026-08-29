"use client";

import { useLocale, useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "@/lib/i18n/routing";
import { createMatchSession } from "@/lib/match/client";
import type { SearchPurpose } from "@/lib/match/types";
import { cn } from "@/lib/utils";

const PURPOSES: SearchPurpose[] = ["buy", "rent", "invest", "unknown"];

type Props = {
  source: "hero" | "header";
  className?: string;
  compact?: boolean;
};

export function MatchIntentInput({ source, className, compact }: Props) {
  const t = useTranslations("match");
  const locale = useLocale();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [purpose, setPurpose] = useState<SearchPurpose>("unknown");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    const text = message.trim();
    if (text.length < 2) return;
    setError("");
    startTransition(async () => {
      try {
        const session = await createMatchSession({
          message: text,
          purposeHint: purpose === "unknown" ? undefined : purpose,
          locale,
          source,
        });
        router.push(`/match/${session.sessionId}`);
      } catch {
        setError(t("errors.generic"));
      }
    });
  }

  return (
    <div className={cn("w-full", className)}>
      <label className="sr-only" htmlFor={`match-intent-${source}`}>
        {t("intent.placeholder")}
      </label>
      <div
        className={cn(
          "bg-white",
          compact
            ? "flex overflow-hidden rounded-full shadow-[0_8px_24px_rgba(0,0,0,.18)]"
            : "rounded-xl shadow-[0_10px_28px_rgba(0,0,0,.16)]",
        )}
      >
        <textarea
          id={`match-intent-${source}`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          placeholder={t("intent.placeholder")}
          rows={compact ? 1 : 3}
          className={cn(
            "min-w-0 flex-1 resize-none bg-transparent text-[#0B1220] outline-none placeholder:text-[#9CA3AF]",
            compact
              ? "h-11 px-4 py-3 text-sm"
              : "px-5 py-4 text-[15px] leading-relaxed",
          )}
        />
        <div className={cn("flex items-end p-2", compact && "items-stretch p-0")}>
          <button
            type="button"
            onClick={submit}
            disabled={pending || message.trim().length < 2}
            className={cn(
              "inline-flex items-center justify-center font-bold text-[#1A1205] transition hover:bg-[#F2C06E] disabled:opacity-60",
              compact
                ? "h-11 w-12 rounded-r-full bg-[#EBAD5B] sm:w-14"
                : "h-11 rounded-lg bg-[#EBAD5B] px-5 text-sm",
            )}
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : t("intent.submit")}
          </button>
        </div>
      </div>

      {!compact ? (
        <>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {PURPOSES.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setPurpose(id)}
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase transition",
                  purpose === id
                    ? "bg-[#0B1220] text-white"
                    : "bg-black/35 text-white/85 hover:bg-black/50",
                )}
              >
                {t(`purpose.${id}`)}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-white/75">
            <span>{t("intent.examplesLabel")}</span>
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                type="button"
                className="text-left text-white/90 underline-offset-2 hover:underline"
                onClick={() => setMessage(t(`intent.examples.${index}`))}
              >
                {t(`intent.examples.${index}`)}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {error ? <p className="mt-2 text-xs text-red-200">{error}</p> : null}
    </div>
  );
}
