"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { askMatchProperty, fetchMatchExplain, recordMatchEvent } from "@/lib/match/client";
import type { MatchExplainDto } from "@/lib/match/types";
import { MatchScoreBadge } from "./match-score-badge";
import { MatchExplainDrawer } from "./match-explain-drawer";
import { formatMarketplacePrice } from "@/lib/marketplace/format";
import type { PropertyDetail } from "@/features/imoveis/types";

type Props = {
  property: PropertyDetail;
};

export function PropertyMatchPanel({ property }: Props) {
  return (
    <Suspense fallback={null}>
      <PropertyMatchPanelInner property={property} />
    </Suspense>
  );
}

function PropertyMatchPanelInner({ property }: Props) {
  const t = useTranslations("match.property");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("match");
  const [data, setData] = useState<MatchExplainDto | null>(null);
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const [question, setQuestion] = useState("");

  useEffect(() => {
    if (!sessionId) return;
    fetchMatchExplain(sessionId, property.id)
      .then(setData)
      .catch(() => setData(null));
  }, [sessionId, property.id]);

  if (!sessionId || !data) return null;

  const down = Math.round(property.price * 0.2);
  const monthlyRate = 0.89 / 100;
  const months = 360;
  const principal = property.price - down;
  const factor = Math.pow(1 + monthlyRate, months);
  const financing = (principal * monthlyRate * factor) / (factor - 1);
  const monthly = Math.round(financing + (property.condoFee || 0) + (property.iptu || 0) / 12);

  return (
    <>
      <section className="rounded-xl bg-white p-5 ring-1 ring-black/[0.04] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <MatchScoreBadge score={data.totalScore} />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-sm font-semibold text-[#2563EB]"
          >
            {t("whyPercent", { score: data.totalScore })}
          </button>
        </div>
        <h2 className="rk-display mt-3 text-lg font-bold">{t("whyTitle")}</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-[#374151]">
          {data.reasons.map((reason) => (
            <li key={reason}>✓ {reason}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-[#4B5563]">{data.insight}</p>
      </section>

      <section className="rounded-xl bg-white p-5 ring-1 ring-black/[0.04] sm:p-6">
        <h2 className="rk-display text-lg font-bold">{t("affordTitle")}</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-[#6B7285]">{t("price")}</dt>
            <dd className="font-semibold">
              {formatMarketplacePrice(property.price, property.currency)}
            </dd>
          </div>
          <div>
            <dt className="text-[#6B7285]">{t("down")}</dt>
            <dd className="font-semibold">
              {formatMarketplacePrice(down, property.currency)}
            </dd>
          </div>
          <div>
            <dt className="text-[#6B7285]">{t("financing")}</dt>
            <dd className="font-semibold">
              {formatMarketplacePrice(Math.round(financing), property.currency)}
            </dd>
          </div>
          <div>
            <dt className="text-[#6B7285]">{t("monthly")}</dt>
            <dd className="font-semibold">
              {formatMarketplacePrice(monthly, property.currency)}
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-[#6B7285]">{t("estimateDisclaimer")}</p>
      </section>

      <section className="rounded-xl bg-white p-5 ring-1 ring-black/[0.04] sm:p-6">
        <h2 className="rk-display text-lg font-bold">{t("askTitle")}</h2>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const q = question.trim();
            if (!q) return;
            setAsking(true);
            askMatchProperty(sessionId, property.id, q)
              .then((res) => setAnswer(res.answer))
              .catch(() => setAnswer(t("askError")))
              .finally(() => setAsking(false));
          }}
        >
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={t("askPlaceholder")}
            className="h-11 min-w-0 flex-1 rounded-md border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#EBAD5B]"
          />
          <button
            type="submit"
            disabled={asking}
            className="h-11 rounded-md bg-[#0B1220] px-4 text-sm font-semibold text-white"
          >
            {t("askSubmit")}
          </button>
        </form>
        {answer ? <p className="mt-3 text-sm leading-relaxed text-[#374151]">{answer}</p> : null}
      </section>

      <MatchExplainDrawer open={open} onClose={() => setOpen(false)} data={data} />
    </>
  );
}

export function useMatchSessionId() {
  const searchParams = useSearchParams();
  return searchParams.get("match");
}

export function MatchContactTracker({
  sessionId,
  propertyId,
}: {
  sessionId: string | null;
  propertyId: string;
}) {
  useEffect(() => {
    if (!sessionId) return;
    void recordMatchEvent(sessionId, propertyId, "property_view");
  }, [sessionId, propertyId]);
  return null;
}
