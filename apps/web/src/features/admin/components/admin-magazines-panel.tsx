"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MAGAZINE_CATEGORIES,
  type MagazineIssue,
  type MagazineStatus,
} from "@/features/revistas/types";

const emptyForm = {
  title: "",
  issueLabel: "",
  excerpt: "",
  body: "",
  coverImage: "",
  category: "market",
  author: "Reeskova Editorial",
  pdfUrl: "",
  status: "published" as MagazineStatus,
  publishedAt: new Date().toISOString().slice(0, 10),
};

export function AdminMagazinesPanel() {
  const t = useTranslations("adminMagazines");
  const tCat = useTranslations("revistas.category");
  const [items, setItems] = useState<MagazineIssue[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/magazines");
      if (!response.ok) throw new Error("load");
      const data = (await response.json()) as MagazineIssue[];
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
      setError(t("loadError"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function fillForm(item: MagazineIssue) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      issueLabel: item.issueLabel,
      excerpt: item.excerpt,
      body: item.body,
      coverImage: item.coverImage,
      category: item.category,
      author: item.author,
      pdfUrl: item.pdfUrl,
      status: item.status,
      publishedAt: item.publishedAt,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admin/magazines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          id: editingId ?? undefined,
        }),
      });
      if (!response.ok) throw new Error("save");
      resetForm();
      await load();
    } catch {
      setError(t("saveError"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setError("");
    try {
      const response = await fetch(`/api/admin/magazines?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("delete");
      if (editingId === id) resetForm();
      await load();
    } catch {
      setError(t("saveError"));
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <div>
          <h2 className="text-lg font-semibold">
            {editingId ? t("editTitle") : t("createTitle")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("formHint")}</p>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="mag-title">{t("title")}</Label>
            <Input
              id="mag-title"
              required
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mag-issue">{t("issue")}</Label>
            <Input
              id="mag-issue"
              required
              placeholder={t("issuePlaceholder")}
              value={form.issueLabel}
              onChange={(event) =>
                setForm((current) => ({ ...current, issueLabel: event.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mag-date">{t("date")}</Label>
            <Input
              id="mag-date"
              type="date"
              required
              value={form.publishedAt}
              onChange={(event) =>
                setForm((current) => ({ ...current, publishedAt: event.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mag-category">{t("category")}</Label>
            <select
              id="mag-category"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value }))
              }
            >
              {MAGAZINE_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {tCat(item)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mag-status">{t("status")}</Label>
            <select
              id="mag-status"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as MagazineStatus,
                }))
              }
            >
              <option value="published">{t("statusPublished")}</option>
              <option value="draft">{t("statusDraft")}</option>
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="mag-cover">{t("cover")}</Label>
            <Input
              id="mag-cover"
              required
              type="url"
              placeholder="https://"
              value={form.coverImage}
              onChange={(event) =>
                setForm((current) => ({ ...current, coverImage: event.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="mag-excerpt">{t("excerpt")}</Label>
            <textarea
              id="mag-excerpt"
              required
              rows={2}
              value={form.excerpt}
              onChange={(event) =>
                setForm((current) => ({ ...current, excerpt: event.target.value }))
              }
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="mag-body">{t("body")}</Label>
            <textarea
              id="mag-body"
              required
              rows={10}
              value={form.body}
              onChange={(event) =>
                setForm((current) => ({ ...current, body: event.target.value }))
              }
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <p className="text-xs text-muted-foreground">{t("bodyHint")}</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mag-author">{t("author")}</Label>
            <Input
              id="mag-author"
              value={form.author}
              onChange={(event) =>
                setForm((current) => ({ ...current, author: event.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mag-pdf">{t("pdf")}</Label>
            <Input
              id="mag-pdf"
              type="url"
              placeholder="https://"
              value={form.pdfUrl}
              onChange={(event) =>
                setForm((current) => ({ ...current, pdfUrl: event.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? t("saving") : t("save")}
          </Button>
          {editingId ? (
            <Button type="button" variant="outline" onClick={resetForm}>
              {t("cancel")}
            </Button>
          ) : null}
        </div>
      </form>

      <aside className="space-y-3">
        <h2 className="text-lg font-semibold">{t("listTitle")}</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">{t("loading")}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-border/60 bg-card p-3"
            >
              <p className="text-xs text-muted-foreground">{item.issueLabel}</p>
              <p className="font-medium">{item.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.status === "published" ? t("statusPublished") : t("statusDraft")}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => fillForm(item)}>
                  {t("edit")}
                </Button>
                <Link
                  href={`/revistas/${item.slug}`}
                  className="inline-flex h-7 items-center rounded-lg border border-border bg-background px-2.5 text-[0.8rem] hover:bg-muted"
                >
                  {t("view")}
                </Link>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => void handleDelete(item.id)}
                >
                  {t("delete")}
                </Button>
              </div>
            </div>
          ))
        )}
      </aside>
    </div>
  );
}
