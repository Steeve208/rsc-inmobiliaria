"use client";

import { useState } from "react";
import { Calendar, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createScheduledVisit,
  getBuyerName,
  setBuyerName,
} from "@/lib/leads/client";
import { useBuyerIdentity } from "@/hooks/use-buyer-identity";
import type { ListingContactContext } from "@/lib/leads/types";

type Props = {
  open: boolean;
  onClose: () => void;
  listing: ListingContactContext;
  onSuccess?: () => void;
};

export function ScheduleVisitModal({ open, onClose, listing, onSuccess }: Props) {
  const t = useTranslations("contact.schedule");
  const { buyerId, buyerEmail } = useBuyerIdentity();
  const [name, setName] = useState(getBuyerName());
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(buyerEmail ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      setBuyerName(name);
      await createScheduledVisit({
        listingId: listing.listingId,
        listingTitle: listing.listingTitle,
        listingCategory: listing.listingCategory,
        companyId: listing.companyId,
        companyName: listing.companyName,
        buyerId,
        buyerName: name.trim(),
        buyerPhone: phone.trim(),
        buyerEmail: email.trim() || undefined,
        preferredDate: date,
        preferredTime: time,
        notes: notes.trim() || undefined,
      });
      setDone(true);
      onSuccess?.();
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setDone(false);
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-xl bg-[#111d2f] p-5 shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">{t("title")}</h2>
            <p className="mt-1 text-sm text-white/50">{listing.listingTitle}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"
            aria-label={t("close")}
          >
            <X className="size-5" />
          </button>
        </div>

        {done ? (
          <div className="py-6 text-center">
            <Calendar className="mx-auto size-10 text-emerald-400" />
            <p className="mt-4 font-medium text-white">{t("successTitle")}</p>
            <p className="mt-2 text-sm text-white/55">{t("successBody")}</p>
            <Button className="mt-6 w-full" onClick={handleClose}>
              {t("close")}
            </Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="visit-name">{t("name")}</Label>
              <Input
                id="visit-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-white/10 bg-[#0a111f] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visit-phone">{t("phone")}</Label>
              <Input
                id="visit-phone"
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-white/10 bg-[#0a111f] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visit-email">{t("email")}</Label>
              <Input
                id="visit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/10 bg-[#0a111f] text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="visit-date">{t("date")}</Label>
                <Input
                  id="visit-date"
                  required
                  type="date"
                  value={date}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-white/10 bg-[#0a111f] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visit-time">{t("time")}</Label>
                <Input
                  id="visit-time"
                  required
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="border-white/10 bg-[#0a111f] text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="visit-notes">{t("notes")}</Label>
              <textarea
                id="visit-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-[#0a111f] px-3 py-2 text-sm text-white outline-none focus:border-white/25"
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
