"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import type { ImoveisFilters } from "../types";

type Props = {
  draft: ImoveisFilters;
  onChange: (next: Partial<ImoveisFilters>) => void;
  onReset: () => void;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-3 last:pb-0">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {title}
      </p>
      {children}
    </div>
  );
}

export function FilterMenuPanel({ draft, onChange, onReset }: Props) {
  const t = useTranslations("imoveis.filters");

  return (
    <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
      <Section title={t("transaction")}>
        <div className="space-y-2">
          {(["buy", "rent"] as const).map((tx) => (
            <label key={tx} className="flex cursor-pointer items-center gap-2">
              <Checkbox
                checked={draft.transaction === tx}
                onCheckedChange={(checked) =>
                  onChange({ transaction: checked ? tx : "" })
                }
              />
              <span className="text-sm text-gray-700">{t(tx)}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title={t("condition")}>
        <div className="space-y-2">
          {(["new", "used"] as const).map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2">
              <Checkbox
                checked={draft.condition === c}
                onCheckedChange={(checked) =>
                  onChange({ condition: checked ? c : "" })
                }
              />
              <span className="text-sm text-gray-700">{t(c)}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title={t("type")}>
        <div className="space-y-2">
          {(
            [
              { value: "house", label: t("house") },
              { value: "apartment", label: t("apartment") },
              { value: "land", label: t("land") },
            ] as const
          ).map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2">
              <Checkbox
                checked={draft.type === value}
                onCheckedChange={(checked) =>
                  onChange({ type: checked ? value : "" })
                }
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title={t("price")}>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={draft.priceMin}
            onChange={(e) => onChange({ priceMin: e.target.value })}
            placeholder={t("priceMin")}
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-800 outline-none focus:bg-gray-50"
          />
          <input
            type="text"
            value={draft.priceMax}
            onChange={(e) => onChange({ priceMax: e.target.value })}
            placeholder={t("priceMax")}
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-800 outline-none focus:bg-gray-50"
          />
        </div>
      </Section>

      <Section title={t("area")}>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={draft.areaMin}
            onChange={(e) => onChange({ areaMin: e.target.value })}
            placeholder={t("areaMin")}
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-800 outline-none focus:bg-gray-50"
          />
          <input
            type="text"
            value={draft.areaMax}
            onChange={(e) => onChange({ areaMax: e.target.value })}
            placeholder={t("areaMax")}
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-800 outline-none focus:bg-gray-50"
          />
        </div>
      </Section>

      <Section title={t("bedrooms")}>
        <input
          type="text"
          value={draft.bedrooms}
          onChange={(e) => onChange({ bedrooms: e.target.value })}
          placeholder="3+"
          className="w-full rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-800 outline-none focus:bg-gray-50"
        />
      </Section>

      <Section title={t("features")}>
        <div className="space-y-2">
          {(
            [
              { key: "garage" as const, label: t("garage") },
              { key: "pool" as const, label: t("pool") },
              { key: "pets" as const, label: t("pets") },
              { key: "financing" as const, label: t("financing") },
              { key: "rscCredit" as const, label: t("rscCredit") },
            ] as const
          ).map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-center gap-2">
              <Checkbox
                checked={Boolean(draft[key])}
                onCheckedChange={(checked) => {
                  if (key === "garage") onChange({ garage: checked ? "1" : "" });
                  else onChange({ [key]: checked === true });
                }}
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </Section>

      <div className="flex items-end sm:col-span-2 lg:col-span-3">
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-[#1d4ed8] hover:underline"
        >
          {t("reset")}
        </button>
      </div>
    </div>
  );
}
