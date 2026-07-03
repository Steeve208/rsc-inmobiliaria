"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { ImoveisFilters } from "../types";

type Props = {
  draft: ImoveisFilters;
  onChange: (next: Partial<ImoveisFilters>) => void;
  onReset: () => void;
  onApply: () => void;
};

function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
        {title}
      </p>
      {children}
    </div>
  );
}

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
        active
          ? "border-[#1d4ed8] bg-[#1d4ed8] text-white shadow-sm shadow-[#1d4ed8]/30"
          : "border-white/10 bg-white/[0.04] text-white/75 hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
      )}
    >
      {label}
    </button>
  );
}

function ChipGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T | "";
  onChange: (value: T | "") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          active={value === option.value}
          onClick={() => onChange(value === option.value ? "" : option.value)}
        />
      ))}
    </div>
  );
}

export function FilterMenuPanel({ draft, onChange, onReset, onApply }: Props) {
  const t = useTranslations("imoveis.filters");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">{t("title")}</h3>
          <p className="mt-0.5 text-xs text-white/45">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-[#60a5fa] transition-colors hover:text-white"
        >
          {t("reset")}
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <Section title={t("transaction")}>
          <ChipGroup
            value={draft.transaction}
            onChange={(transaction) => onChange({ transaction })}
            options={[
              { value: "buy", label: t("buy") },
              { value: "rent", label: t("rent") },
            ]}
          />
        </Section>

        <Section title={t("condition")}>
          <ChipGroup
            value={draft.condition}
            onChange={(condition) => onChange({ condition })}
            options={[
              { value: "new", label: t("new") },
              { value: "used", label: t("used") },
            ]}
          />
        </Section>

        <Section title={t("type")}>
          <ChipGroup
            value={draft.type}
            onChange={(type) => onChange({ type })}
            options={[
              { value: "house", label: t("house") },
              { value: "apartment", label: t("apartment") },
              { value: "land", label: t("land") },
            ]}
          />
        </Section>

        <Section title={t("price")}>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={draft.priceMin}
              onChange={(e) => onChange({ priceMin: e.target.value })}
              placeholder={t("priceMin")}
              className="rounded-xl border border-white/10 bg-[#0a111f] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#1d4ed8]/50"
            />
            <input
              type="text"
              inputMode="numeric"
              value={draft.priceMax}
              onChange={(e) => onChange({ priceMax: e.target.value })}
              placeholder={t("priceMax")}
              className="rounded-xl border border-white/10 bg-[#0a111f] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#1d4ed8]/50"
            />
          </div>
        </Section>

        <Section title={t("area")}>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={draft.areaMin}
              onChange={(e) => onChange({ areaMin: e.target.value })}
              placeholder={t("areaMin")}
              className="rounded-xl border border-white/10 bg-[#0a111f] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#1d4ed8]/50"
            />
            <input
              type="text"
              inputMode="numeric"
              value={draft.areaMax}
              onChange={(e) => onChange({ areaMax: e.target.value })}
              placeholder={t("areaMax")}
              className="rounded-xl border border-white/10 bg-[#0a111f] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#1d4ed8]/50"
            />
          </div>
        </Section>

        <Section title={t("bedrooms")}>
          <div className="flex flex-wrap gap-2">
            {["1", "2", "3", "4"].map((value) => (
              <Chip
                key={value}
                label={`${value}+`}
                active={draft.bedrooms === value}
                onClick={() =>
                  onChange({ bedrooms: draft.bedrooms === value ? "" : value })
                }
              />
            ))}
          </div>
        </Section>

        <Section title={t("features")} className="sm:col-span-2 xl:col-span-3">
          <div className="flex flex-wrap gap-2">
            <Chip
              label={t("garage")}
              active={Boolean(draft.garage)}
              onClick={() => onChange({ garage: draft.garage ? "" : "1" })}
            />
            <Chip
              label={t("pool")}
              active={draft.pool}
              onClick={() => onChange({ pool: !draft.pool })}
            />
            <Chip
              label={t("pets")}
              active={draft.pets}
              onClick={() => onChange({ pets: !draft.pets })}
            />
            <Chip
              label={t("financing")}
              active={draft.financing}
              onClick={() => onChange({ financing: !draft.financing })}
            />
            <Chip
              label={t("rscCredit")}
              active={draft.rscCredit}
              onClick={() => onChange({ rscCredit: !draft.rscCredit })}
            />
          </div>
        </Section>
      </div>

      <div className="flex justify-end border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={onApply}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-[#1d4ed8] px-5 text-sm font-semibold text-white shadow-lg shadow-[#1d4ed8]/20 transition-colors hover:bg-[#1e40af]"
        >
          {t("apply")}
        </button>
      </div>
    </div>
  );
}
