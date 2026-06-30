"use client";

import { useTranslations } from "next-intl";
import type { VeiculosFilters } from "../types";
import { brazilStates, vehicleMakes } from "../mock-data";

type Props = {
  draft: VeiculosFilters;
  onChange: (next: Partial<VeiculosFilters>) => void;
  onReset: () => void;
};

const inputClass =
  "w-full rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-900 outline-none focus:bg-gray-50";

export function FilterMenuPanel({ draft, onChange, onReset }: Props) {
  const t = useTranslations("veiculos.filters");

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">{t("make")}</label>
        <select
          value={draft.make}
          onChange={(e) => onChange({ make: e.target.value })}
          className={inputClass}
        >
          <option value="">{t("all")}</option>
          {vehicleMakes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">{t("model")}</label>
        <input
          type="text"
          value={draft.model}
          onChange={(e) => onChange({ model: e.target.value })}
          placeholder={t("modelPlaceholder")}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">{t("year")}</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={draft.yearMin}
            onChange={(e) => onChange({ yearMin: e.target.value })}
            placeholder={t("yearMin")}
            className={inputClass}
          />
          <input
            type="number"
            value={draft.yearMax}
            onChange={(e) => onChange({ yearMax: e.target.value })}
            placeholder={t("yearMax")}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">{t("price")}</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={draft.priceMin}
            onChange={(e) => onChange({ priceMin: e.target.value })}
            placeholder={t("priceMin")}
            className={inputClass}
          />
          <input
            type="number"
            value={draft.priceMax}
            onChange={(e) => onChange({ priceMax: e.target.value })}
            placeholder={t("priceMax")}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">{t("mileage")}</label>
        <input
          type="number"
          value={draft.mileageMax}
          onChange={(e) => onChange({ mileageMax: e.target.value })}
          placeholder={t("mileageMax")}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">{t("fuel")}</label>
        <select
          value={draft.fuel}
          onChange={(e) => onChange({ fuel: e.target.value as VeiculosFilters["fuel"] })}
          className={inputClass}
        >
          <option value="">{t("all")}</option>
          <option value="gasoline">{t("gasoline")}</option>
          <option value="diesel">{t("diesel")}</option>
          <option value="flex">{t("flex")}</option>
          <option value="electric">{t("electric")}</option>
          <option value="hybrid">{t("hybrid")}</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">{t("transmission")}</label>
        <select
          value={draft.transmission}
          onChange={(e) =>
            onChange({ transmission: e.target.value as VeiculosFilters["transmission"] })
          }
          className={inputClass}
        >
          <option value="">{t("all")}</option>
          <option value="manual">{t("manual")}</option>
          <option value="automatic">{t("automatic")}</option>
          <option value="cvt">{t("cvt")}</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">{t("color")}</label>
        <input
          type="text"
          value={draft.color}
          onChange={(e) => onChange({ color: e.target.value })}
          placeholder={t("colorPlaceholder")}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">{t("engine")}</label>
        <input
          type="text"
          value={draft.engine}
          onChange={(e) => onChange({ engine: e.target.value })}
          placeholder={t("enginePlaceholder")}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">{t("drive")}</label>
        <select
          value={draft.drive}
          onChange={(e) => onChange({ drive: e.target.value as VeiculosFilters["drive"] })}
          className={inputClass}
        >
          <option value="">{t("all")}</option>
          <option value="fwd">{t("fwd")}</option>
          <option value="rwd">{t("rwd")}</option>
          <option value="awd">{t("awd")}</option>
          <option value="4x4">{t("4x4")}</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">{t("state")}</label>
        <select
          value={draft.state}
          onChange={(e) => onChange({ state: e.target.value })}
          className={inputClass}
        >
          <option value="">{t("all")}</option>
          {brazilStates.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">{t("city")}</label>
        <input
          type="text"
          value={draft.city}
          onChange={(e) => onChange({ city: e.target.value })}
          placeholder={t("cityPlaceholder")}
          className={inputClass}
        />
      </div>

      <div className="flex items-end">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={draft.financing}
            onChange={(e) => onChange({ financing: e.target.checked })}
            className="size-4 rounded border-gray-300 accent-[#22c55e]"
          />
          {t("financing")}
        </label>
      </div>

      <div className="flex items-end sm:col-span-2 lg:col-span-3 xl:col-span-4">
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-gray-500 transition-colors hover:text-gray-800"
        >
          {t("reset")}
        </button>
      </div>
    </div>
  );
}
