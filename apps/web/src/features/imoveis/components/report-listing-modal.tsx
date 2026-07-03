"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
};

export function ReportListingModal({ open, onClose, listingId, listingTitle }: Props) {
  const t = useTranslations("imoveis.report");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/listings/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          listingTitle,
          listingKind: "property",
          email: email.trim() || undefined,
          reason: reason.trim(),
        }),
      });
      if (!res.ok) throw new Error("failed");
      setDone(true);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setDone(false);
    setError("");
    setReason("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-xl bg-[#111d2f] p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">{t("title")}</h2>
            <p className="mt-1 text-sm text-white/50">{listingTitle}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-white/50 hover:bg-white/10"
            aria-label={t("close")}
          >
            <X className="size-5" />
          </button>
        </div>

        {done ? (
          <div className="py-6 text-center text-sm text-white/70">{t("success")}</div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="report-reason">{t("reason")}</Label>
              <textarea
                id="report-reason"
                required
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-[#0a111f] px-3 py-2 text-sm text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-email">{t("email")}</Label>
              <Input
                id="report-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/10 bg-[#0a111f] text-white"
              />
            </div>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("submitting") : t("submit")}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
