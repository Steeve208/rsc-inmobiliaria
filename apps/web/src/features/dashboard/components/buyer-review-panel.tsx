"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function BuyerReviewPanel() {
  const t = useTranslations("dashboard.review");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews?mine=1")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.review) return;
        setRating(data.review.rating);
        setComment(data.review.comment ?? "");
        setLocationLabel(data.review.locationLabel ?? "");
        setSaved(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment,
          locationLabel: locationLabel.trim() || null,
        }),
      });
      if (!res.ok) {
        setError(t("error"));
        return;
      }
      setSaved(true);
    } catch {
      setError(t("error"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-white/60">
        <Loader2 className="size-4 animate-spin" />
        {t("loading")}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-xl space-y-5 rounded-2xl border border-white/10 bg-[#0E1422] p-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-white">{t("title")}</h2>
        <p className="mt-1 text-sm text-white/55">{t("subtitle")}</p>
      </div>

      <div>
        <p className="mb-2 text-sm text-white/70">{t("rating")}</p>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="rounded p-1 transition-colors hover:bg-white/5"
                aria-label={`${value}`}
              >
                <Star
                  className={cn(
                    "size-7",
                    value <= rating
                      ? "fill-[#D6A62E] text-[#D6A62E]"
                      : "text-white/25",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-white/70">{t("comment")}</span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          minLength={10}
          maxLength={600}
          rows={4}
          placeholder={t("commentPlaceholder")}
          className="w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#D6A62E]/50"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-white/70">{t("location")}</span>
        <input
          type="text"
          value={locationLabel}
          onChange={(e) => setLocationLabel(e.target.value)}
          maxLength={120}
          placeholder={t("locationPlaceholder")}
          className="w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#D6A62E]/50"
        />
      </label>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {saved ? <p className="text-sm text-emerald-400">{t("saved")}</p> : null}

      <button
        type="submit"
        disabled={saving || comment.trim().length < 10}
        className="rk-btn-gold inline-flex h-11 items-center justify-center px-6 text-sm disabled:opacity-60"
      >
        {saving ? t("saving") : t("submit")}
      </button>
    </form>
  );
}
