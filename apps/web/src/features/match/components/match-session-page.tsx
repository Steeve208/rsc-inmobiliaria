"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import {
  askMatchProperty,
  compareMatchProperties,
  fetchMatchExplain,
  fetchMatchResults,
  fetchMatchSession,
  patchMatchRequirements,
  runMatchSession,
  sendMatchMessage,
} from "@/lib/match/client";
import type {
  MatchExplainDto,
  MatchResultCard,
  MatchSessionDto,
  SearchRequirements,
} from "@/lib/match/types";
import { MatchConversation, RequirementsBuilder } from "./requirements-builder";
import { MatchPropertyCard } from "./match-property-card";
import { MatchExplainDrawer } from "./match-explain-drawer";
import { formatMarketplacePrice } from "@/lib/marketplace/format";

type Props = { sessionId: string };

export function MatchSessionPage({ sessionId }: Props) {
  const t = useTranslations("match");
  const [session, setSession] = useState<MatchSessionDto | null>(null);
  const [results, setResults] = useState<MatchResultCard[]>([]);
  const [pending, setPending] = useState(false);
  const [reply, setReply] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [compareText, setCompareText] = useState("");
  const [explain, setExplain] = useState<MatchExplainDto | null>(null);
  const [explainOpen, setExplainOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchMatchSession(sessionId);
        if (cancelled) return;
        setSession(data);
        if (data.resultCount && data.resultCount > 0) {
          const packed = await fetchMatchResults(sessionId);
          if (!cancelled) setResults(packed.results);
        }
      } catch {
        if (!cancelled) setError(t("errors.generic"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, t]);

  async function refreshResults(next: MatchSessionDto) {
    setSession(next);
    if (next.readyToMatch || (next.resultCount ?? 0) > 0) {
      const packed = await fetchMatchResults(sessionId);
      setResults(packed.results);
    }
  }

  async function handlePatch(patch: Partial<SearchRequirements>) {
    setPending(true);
    try {
      await refreshResults(await patchMatchRequirements(sessionId, patch));
    } catch {
      setError(t("errors.generic"));
    } finally {
      setPending(false);
    }
  }

  async function handleAnswer(message: string, optionId?: string) {
    setPending(true);
    try {
      await refreshResults(await sendMatchMessage(sessionId, { message, optionId }));
      setReply("");
    } catch {
      setError(t("errors.generic"));
    } finally {
      setPending(false);
    }
  }

  async function handleRun() {
    setPending(true);
    try {
      await refreshResults(await runMatchSession(sessionId));
    } catch {
      setError(t("errors.generic"));
    } finally {
      setPending(false);
    }
  }

  async function openExplain(propertyId: string) {
    setExplainOpen(true);
    setExplain(null);
    setAnswer("");
    try {
      setExplain(await fetchMatchExplain(sessionId, propertyId));
    } catch {
      setError(t("errors.generic"));
    }
  }

  async function handleCompare() {
    if (selected.length < 2) return;
    setPending(true);
    try {
      const data = await compareMatchProperties(sessionId, selected);
      setCompareText(data.narrative);
    } catch {
      setError(t("errors.generic"));
    } finally {
      setPending(false);
    }
  }

  if (error && !session) {
    return (
      <div className="rk-container py-16">
        <p className="text-sm text-[#6B7285]">{error}</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="rk-container flex items-center gap-2 py-16 text-sm text-[#6B7285]">
        <Loader2 className="size-4 animate-spin" />
        {t("loading")}
      </div>
    );
  }

  const followUp = session.followUp
    ? {
        field: session.followUp.field,
        question: session.followUp.question,
        options: session.followUp.options,
      }
    : null;

  return (
    <div className="bg-[#F4F7FA] text-[#0B1220]">
      <div className="rk-container space-y-8 py-8 pb-24">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7285]">
            REESKOVA MATCH
          </p>
          <h1 className="rk-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("page.title")}
          </h1>
          <p className="mt-2 text-sm text-[#6B7285]">{t("page.subtitle")}</p>
        </header>

        <RequirementsBuilder requirements={session.requirements} onChange={handlePatch} />

        <MatchConversation
          messages={session.messages}
          followUp={session.readyToMatch ? null : followUp}
          onAnswer={handleAnswer}
          pending={pending}
        />

        {!session.readyToMatch ? (
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (reply.trim()) void handleAnswer(reply.trim());
            }}
          >
            <input
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder={t("conversation.placeholder")}
              className="h-11 min-w-0 flex-1 rounded-md border border-[#E5E7EB] bg-white px-4 text-sm outline-none focus:border-[#EBAD5B]"
            />
            <button
              type="submit"
              disabled={pending || !reply.trim()}
              className="h-11 rounded-md bg-[#0B1220] px-4 text-sm font-semibold text-white disabled:opacity-50"
            >
              {t("conversation.send")}
            </button>
          </form>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleRun}
            disabled={pending}
            className="h-11 rounded-md bg-[#EBAD5B] px-5 text-sm font-bold text-[#1A1205] disabled:opacity-60"
          >
            {pending ? t("working") : t("page.findMatches")}
          </button>
        </div>

        {results.length > 0 ? (
          <section>
            <h2 className="rk-display text-2xl font-bold">{t("results.headline")}</h2>
            <p className="mt-1 text-sm text-[#6B7285]">
              {t("results.found", { count: results.length })}
            </p>
            {selected.length >= 2 ? (
              <button
                type="button"
                onClick={handleCompare}
                className="mt-3 text-sm font-semibold text-[#2563EB]"
              >
                {t("results.compareSelected", { count: selected.length })}
              </button>
            ) : null}
            {compareText ? (
              <div className="mt-4 overflow-x-auto rounded-xl bg-white p-4 ring-1 ring-black/[0.04]">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider text-[#6B7285]">
                      <th className="py-2 pr-4">{t("compare.metric")}</th>
                      {results
                        .filter((item) => selected.includes(item.propertyId))
                        .map((item) => (
                          <th key={item.propertyId} className="py-2 pr-4">
                            {item.property.title}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Match</td>
                      {results
                        .filter((item) => selected.includes(item.propertyId))
                        .map((item) => (
                          <td key={item.propertyId} className="py-2 pr-4">
                            {item.totalScore}%
                          </td>
                        ))}
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">{t("compare.price")}</td>
                      {results
                        .filter((item) => selected.includes(item.propertyId))
                        .map((item) => (
                          <td key={item.propertyId} className="py-2 pr-4">
                            {formatMarketplacePrice(item.property.price, item.property.currency)}
                          </td>
                        ))}
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">{t("compare.size")}</td>
                      {results
                        .filter((item) => selected.includes(item.propertyId))
                        .map((item) => (
                          <td key={item.propertyId} className="py-2 pr-4">
                            {item.property.area} m²
                          </td>
                        ))}
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">{t("compare.bedrooms")}</td>
                      {results
                        .filter((item) => selected.includes(item.propertyId))
                        .map((item) => (
                          <td key={item.propertyId} className="py-2 pr-4">
                            {item.property.bedrooms}
                          </td>
                        ))}
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">{t("compare.priceM2")}</td>
                      {results
                        .filter((item) => selected.includes(item.propertyId))
                        .map((item) => (
                          <td key={item.propertyId} className="py-2 pr-4">
                            {item.property.area
                              ? formatMarketplacePrice(
                                  Math.round(item.property.price / item.property.area),
                                  item.property.currency,
                                )
                              : "—"}
                          </td>
                        ))}
                    </tr>
                  </tbody>
                </table>
                <p className="mt-4 text-sm leading-relaxed text-[#374151]">{compareText}</p>
              </div>
            ) : null}
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((item) => (
                <MatchPropertyCard
                  key={item.propertyId}
                  item={item}
                  sessionId={sessionId}
                  selected={selected.includes(item.propertyId)}
                  onToggleSelect={() =>
                    setSelected((current) =>
                      current.includes(item.propertyId)
                        ? current.filter((id) => id !== item.propertyId)
                        : current.length >= 4
                          ? current
                          : [...current, item.propertyId],
                    )
                  }
                  onExplain={() => void openExplain(item.propertyId)}
                />
              ))}
            </div>
          </section>
        ) : session.readyToMatch ? (
          <p className="text-sm text-[#6B7285]">{t("results.empty")}</p>
        ) : null}

        {error ? <p className="text-sm text-[#DC2626]">{error}</p> : null}
      </div>

      <MatchExplainDrawer
        open={explainOpen}
        onClose={() => setExplainOpen(false)}
        data={explain}
        loading={!explain}
        answer={answer}
        asking={pending}
        onAsk={async (question) => {
          if (!explain) return;
          setPending(true);
          try {
            const data = await askMatchProperty(sessionId, explain.propertyId, question);
            setAnswer(data.answer);
          } catch {
            setAnswer(t("errors.generic"));
          } finally {
            setPending(false);
          }
        }}
      />
    </div>
  );
}
