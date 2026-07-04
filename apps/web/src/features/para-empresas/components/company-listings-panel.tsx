"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Building2,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  Video,
  ExternalLink,
  FileImage,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type CompanyProperty = {
  id: string;
  title: string;
  type: string;
  transaction: string;
  price: number;
  currency: string;
  city: string;
  state: string;
  status: string;
  coverImage: string;
  videoUrl: string | null;
  virtualTourUrl: string | null;
  floorPlanUrl: string | null;
  imageCount: number;
};

type PropertyDetail = CompanyProperty & {
  description?: string | null;
  images: { id: string; url: string; position: number }[];
};

type Props = {
  companyId: string;
};

const emptyForm = {
  title: "",
  type: "house",
  transaction: "buy",
  price: "",
  city: "",
  state: "",
  description: "",
};

export function CompanyListingsPanel({ companyId }: Props) {
  const t = useTranslations("contact.company.listings");
  const [properties, setProperties] = useState<CompanyProperty[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<PropertyDetail | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [virtualTourUrlInput, setVirtualTourUrlInput] = useState("");
  const [mode, setMode] = useState<"list" | "create">("list");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const baseUrl = `/api/companies/${companyId}/properties`;

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(baseUrl);
      const data = (await res.json()) as CompanyProperty[];
      setProperties(Array.isArray(data) ? data : []);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const loadDetail = useCallback(
    async (propertyId: string) => {
      try {
        const res = await fetch(`${baseUrl}/${propertyId}`);
        if (!res.ok) throw new Error("fetch");
        const data = (await res.json()) as PropertyDetail;
        setDetail(data);
        setVideoUrlInput(data.videoUrl ?? "");
        setVirtualTourUrlInput(data.virtualTourUrl ?? "");
      } catch {
        setDetail(null);
      }
    },
    [baseUrl],
  );

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    if (selectedId) loadDetail(selectedId);
    else setDetail(null);
  }, [selectedId, loadDetail]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          type: form.type,
          transaction: form.transaction,
          price: Number(form.price),
          city: form.city,
          state: form.state || undefined,
          description: form.description || undefined,
        }),
      });
      if (!res.ok) throw new Error("create");
      const created = (await res.json()) as { id: string };
      setForm(emptyForm);
      setMode("list");
      await loadList();
      setSelectedId(created.id);
    } catch {
      setError(t("createError"));
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(
    propertyId: string,
    file: File,
    kind: "image" | "video" | "floorPlan",
  ) {
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.set("kind", kind);
      body.set("file", file);
      const res = await fetch(`${baseUrl}/${propertyId}/media`, {
        method: "POST",
        body,
      });
      if (!res.ok) throw new Error("upload");
      await loadDetail(propertyId);
      await loadList();
    } catch {
      setError(t("uploadError"));
    } finally {
      setUploading(false);
    }
  }

  async function saveVideoUrl(propertyId: string) {
    if (!videoUrlInput.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${baseUrl}/${propertyId}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: videoUrlInput.trim() }),
      });
      if (!res.ok) throw new Error("video");
      await loadDetail(propertyId);
      await loadList();
    } catch {
      setError(t("videoError"));
    } finally {
      setSaving(false);
    }
  }

  async function saveVirtualTourUrl(propertyId: string) {
    if (!virtualTourUrlInput.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${baseUrl}/${propertyId}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ virtualTourUrl: virtualTourUrlInput.trim() }),
      });
      if (!res.ok) throw new Error("tour");
      await loadDetail(propertyId);
      await loadList();
    } catch {
      setError(t("tourError"));
    } finally {
      setSaving(false);
    }
  }

  async function removeFloorPlan(propertyId: string) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${baseUrl}/${propertyId}/media?floorPlan=1`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("floorPlan");
      await loadDetail(propertyId);
      await loadList();
    } catch {
      setError(t("floorPlanError"));
    } finally {
      setSaving(false);
    }
  }

  async function removeImage(propertyId: string, imageId: string) {
    setUploading(true);
    try {
      await fetch(`${baseUrl}/${propertyId}/media?imageId=${imageId}`, {
        method: "DELETE",
      });
      await loadDetail(propertyId);
      await loadList();
    } catch {
      setError(t("uploadError"));
    } finally {
      setUploading(false);
    }
  }

  function formatPrice(price: number, currency: string) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  }

  if (loading) {
    return <p className="text-white/50">{t("loading")}</p>;
  }

  if (mode === "create") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">{t("createTitle")}</h2>
          <Button
            type="button"
            variant="outline"
            className="border-white/15 bg-white/5 text-white"
            onClick={() => setMode("list")}
          >
            {t("back")}
          </Button>
        </div>

        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleCreate}>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="prop-title">{t("fields.title")}</Label>
            <Input
              id="prop-title"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="border-white/10 bg-[#0a111f] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prop-type">{t("fields.type")}</Label>
            <select
              id="prop-type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="w-full rounded-md border border-white/10 bg-[#0a111f] px-3 py-2 text-sm text-white"
            >
              <option value="house">{t("types.house")}</option>
              <option value="apartment">{t("types.apartment")}</option>
              <option value="land">{t("types.land")}</option>
              <option value="commercial">{t("types.commercial")}</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="prop-transaction">{t("fields.transaction")}</Label>
            <select
              id="prop-transaction"
              value={form.transaction}
              onChange={(e) => setForm((f) => ({ ...f, transaction: e.target.value }))}
              className="w-full rounded-md border border-white/10 bg-[#0a111f] px-3 py-2 text-sm text-white"
            >
              <option value="buy">{t("transactions.buy")}</option>
              <option value="rent">{t("transactions.rent")}</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="prop-price">{t("fields.price")}</Label>
            <Input
              id="prop-price"
              required
              type="number"
              min={1}
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="border-white/10 bg-[#0a111f] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prop-city">{t("fields.city")}</Label>
            <Input
              id="prop-city"
              required
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="border-white/10 bg-[#0a111f] text-white"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="prop-desc">{t("fields.description")}</Label>
            <textarea
              id="prop-desc"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-md border border-white/10 bg-[#0a111f] px-3 py-2 text-sm text-white"
            />
          </div>
          {error ? <p className="text-sm text-red-400 sm:col-span-2">{error}</p> : null}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              {saving ? t("saving") : t("createSubmit")}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-white">{t("title")}</h2>
          <Button
            type="button"
            size="sm"
            className="bg-[#1d4ed8] hover:bg-[#1e40af]"
            onClick={() => setMode("create")}
          >
            <Plus className="mr-1 size-4" />
            {t("new")}
          </Button>
        </div>

        {properties.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 p-6 text-center">
            <Building2 className="mx-auto size-8 text-white/30" />
            <p className="mt-3 text-sm text-white/60">{t("emptyTitle")}</p>
            <p className="mt-1 text-xs text-white/40">{t("emptyBody")}</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {properties.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                    selectedId === item.id
                      ? "border-[#1d4ed8] bg-[#1d4ed8]/10"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                  )}
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.coverImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-white/45">
                      {item.city} · {formatPrice(item.price, item.currency)}
                    </p>
                    <p className="text-[10px] text-white/35">
                      {t("photoCount", { count: item.imageCount })}
                      {item.videoUrl ? ` · ${t("hasVideo")}` : ""}
                      {item.virtualTourUrl ? ` · ${t("hasTour")}` : ""}
                      {item.floorPlanUrl ? ` · ${t("hasFloorPlan")}` : ""}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0a1428]/60 p-5">
        {!selectedId || !detail ? (
          <p className="text-sm text-white/50">{t("selectPrompt")}</p>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{detail.title}</h3>
                <p className="text-sm text-white/50">
                  {detail.city}
                  {detail.state ? `, ${detail.state}` : ""}
                </p>
              </div>
              <Link
                href={`/imoveis/${detail.id}`}
                className="inline-flex items-center gap-1 text-sm text-[#60a5fa] hover:underline"
              >
                {t("viewPublic")}
                <ExternalLink className="size-3.5" />
              </Link>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">{t("photosTitle")}</h4>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15">
                  {uploading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <ImagePlus className="size-3.5" />
                  )}
                  {t("addPhotos")}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      void (async () => {
                        for (const file of files) {
                          await uploadFile(detail.id, file, "image");
                        }
                        e.target.value = "";
                      })();
                    }}
                  />
                </label>
              </div>

              {detail.images.length === 0 ? (
                <p className="text-xs text-white/40">{t("noPhotos")}</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {detail.images.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-[4/3] overflow-hidden rounded-lg"
                    >
                      <Image src={img.url} alt="" fill className="object-cover" sizes="160px" />
                      <button
                        type="button"
                        onClick={() => removeImage(detail.id, img.id)}
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label={t("removePhoto")}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold text-white">{t("videoTitle")}</h4>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 px-4 py-3 text-sm text-white/70 hover:bg-white/5">
                  {uploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Video className="size-4" />
                  )}
                  {t("uploadVideo")}
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadFile(detail.id, file, "video");
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
              <div className="mt-3 flex gap-2">
                <Input
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  placeholder={t("videoUrlPlaceholder")}
                  className="border-white/10 bg-[#0a111f] text-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 border-white/15 bg-white/5 text-white"
                  disabled={saving || !videoUrlInput.trim()}
                  onClick={() => saveVideoUrl(detail.id)}
                >
                  {t("saveVideoUrl")}
                </Button>
              </div>
              {detail.videoUrl ? (
                <p className="mt-2 truncate text-xs text-emerald-400/80">{t("videoSaved")}</p>
              ) : null}
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold text-white">{t("tourTitle")}</h4>
              <div className="flex gap-2">
                <Input
                  value={virtualTourUrlInput}
                  onChange={(e) => setVirtualTourUrlInput(e.target.value)}
                  placeholder={t("tourUrlPlaceholder")}
                  className="border-white/10 bg-[#0a111f] text-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 border-white/15 bg-white/5 text-white"
                  disabled={saving || !virtualTourUrlInput.trim()}
                  onClick={() => saveVirtualTourUrl(detail.id)}
                >
                  {t("saveTourUrl")}
                </Button>
              </div>
              {detail.virtualTourUrl ? (
                <p className="mt-2 truncate text-xs text-emerald-400/80">{t("tourSaved")}</p>
              ) : null}
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold text-white">{t("floorPlanTitle")}</h4>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 px-4 py-3 text-sm text-white/70 hover:bg-white/5">
                  {uploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <FileImage className="size-4" />
                  )}
                  {t("uploadFloorPlan")}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadFile(detail.id, file, "floorPlan");
                      e.target.value = "";
                    }}
                  />
                </label>
                {detail.floorPlanUrl ? (
                  <button
                    type="button"
                    onClick={() => void removeFloorPlan(detail.id)}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/5"
                  >
                    <Trash2 className="size-4" />
                    {t("removeFloorPlan")}
                  </button>
                ) : null}
              </div>
              {detail.floorPlanUrl ? (
                <p className="mt-2 truncate text-xs text-emerald-400/80">{t("floorPlanSaved")}</p>
              ) : null}
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}
          </div>
        )}
      </div>
    </div>
  );
}
