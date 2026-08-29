"use client";

import { useTranslations } from "next-intl";
import type { SearchRequirements } from "@/lib/match/types";
import { formatMarketplacePrice } from "@/lib/marketplace/format";
import { cn } from "@/lib/utils";

type Props = {
  requirements: SearchRequirements;
  onChange: (patch: Partial<SearchRequirements>) => void;
};

export function RequirementsBuilder({ requirements, onChange }: Props) {
  const t = useTranslations("match.builder");
  const tMatch = useTranslations("match");

  const chips = [
    requirements.purpose !== "unknown"
      ? { id: "purpose", label: tMatch(`purpose.${requirements.purpose}`) }
      : null,
    requirements.propertyType
      ? { id: "type", label: tMatch(`types.${requirements.propertyType}`) }
      : null,
    requirements.location?.city
      ? { id: "city", label: requirements.location.city }
      : null,
    requirements.bedrooms?.min != null
      ? { id: "beds", label: t("bedroomsMin", { count: requirements.bedrooms.min }) }
      : null,
    requirements.budget?.max != null
      ? {
          id: "budget",
          label: t("budgetMax", {
            price: formatMarketplacePrice(
              requirements.budget.max,
              requirements.budget.currency || "BRL",
            ),
          }),
        }
      : null,
  ].filter(Boolean) as Array<{ id: string; label: string }>;

  return (
    <section className="rounded-xl bg-white p-5 ring-1 ring-black/[0.04] sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7285]">
        {t("kicker")}
      </p>
      <h2 className="rk-display mt-1 text-xl font-bold text-[#0B1220]">
        {t("title")}
      </h2>

      {chips.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span
              key={chip.id}
              className="rounded-full bg-[#0B1220] px-3 py-1.5 text-xs font-semibold text-white"
            >
              {chip.label}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-[#6B7285]">{t("empty")}</p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0B1220]">
            {t("mustHave")}
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-[#374151]">
            {requirements.mustHave.length === 0 ? (
              <li className="text-[#9CA3AF]">{t("noneYet")}</li>
            ) : (
              requirements.mustHave.map((item) => (
                <li key={item.type}>✓ {labelFor(item.type, item.value, tMatch)}</li>
              ))
            )}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0B1220]">
            {t("preferences")}
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-[#374151]">
            {requirements.preferences.length === 0 ? (
              <li className="text-[#9CA3AF]">{t("noneYet")}</li>
            ) : (
              requirements.preferences.map((item) => (
                <li key={item.type}>○ {tMatch(`prefs.${item.type}`)}</li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <label className="text-xs font-medium text-[#6B7285]">
          {t("editBedrooms")}
          <input
            type="number"
            min={0}
            max={10}
            value={requirements.bedrooms?.min ?? ""}
            onChange={(event) =>
              onChange({
                bedrooms: {
                  ...requirements.bedrooms,
                  min: event.target.value ? Number(event.target.value) : undefined,
                },
              })
            }
            className="mt-1 h-10 w-full rounded-md border border-[#E5E7EB] px-3 text-sm text-[#0B1220] outline-none focus:border-[#EBAD5B]"
          />
        </label>
        <label className="text-xs font-medium text-[#6B7285]">
          {t("editBudget")}
          <input
            type="number"
            min={0}
            value={requirements.budget?.max ?? ""}
            onChange={(event) =>
              onChange({
                budget: {
                  ...requirements.budget,
                  max: event.target.value ? Number(event.target.value) : undefined,
                  currency: requirements.budget?.currency ?? "BRL",
                },
              })
            }
            className="mt-1 h-10 w-full rounded-md border border-[#E5E7EB] px-3 text-sm text-[#0B1220] outline-none focus:border-[#EBAD5B]"
          />
        </label>
        <label className="text-xs font-medium text-[#6B7285]">
          {t("editCity")}
          <input
            value={requirements.location?.city ?? ""}
            onChange={(event) =>
              onChange({
                location: { ...requirements.location, city: event.target.value },
              })
            }
            className="mt-1 h-10 w-full rounded-md border border-[#E5E7EB] px-3 text-sm text-[#0B1220] outline-none focus:border-[#EBAD5B]"
          />
        </label>
      </div>
    </section>
  );
}

function labelFor(
  type: string,
  value: string | number | boolean | undefined,
  t: ReturnType<typeof useTranslations>,
) {
  if (type === "purpose" && typeof value === "string") return t(`purpose.${value}`);
  if (type === "propertyType" && typeof value === "string") return t(`types.${value}`);
  if (value != null) return `${type}: ${String(value)}`;
  return type;
}

export function MatchConversation({
  messages,
  followUp,
  onAnswer,
  pending,
}: {
  messages: Array<{ id: string; role: "user" | "assistant"; content: string }>;
  followUp: { question: string; options?: Array<{ id: string; label: string }>; field: string } | null;
  onAnswer: (message: string, optionId?: string) => void;
  pending: boolean;
}) {
  const t = useTranslations("match.conversation");
  return (
    <section className="space-y-5">
      {messages.map((message) => (
        <div key={message.id} className={cn(message.role === "user" ? "text-right" : "text-left")}>
          <p
            className={cn(
              "inline-block max-w-[40rem] text-[15px] leading-relaxed",
              message.role === "user"
                ? "font-medium text-[#0B1220]"
                : "text-[#374151]",
            )}
          >
            {message.content}
          </p>
        </div>
      ))}
      {followUp?.options ? (
        <div className="flex flex-wrap gap-2">
          {followUp.options.map((option) => (
            <button
              key={option.id}
              type="button"
              disabled={pending}
              onClick={() => onAnswer(option.label, option.id)}
              className="rounded-full border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-semibold text-[#0B1220] transition hover:border-[#EBAD5B] disabled:opacity-60"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
      {followUp && !followUp.options ? (
        <p className="text-sm text-[#6B7285]">{t("typeAnswer")}</p>
      ) : null}
    </section>
  );
}
