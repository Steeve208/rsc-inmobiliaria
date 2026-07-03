"use client";

import { useEffect, useState } from "react";
import { Calendar, MessageCircle, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fetchCompanyChats,
  fetchCompanyConfig,
  fetchCompanyVisits,
  saveCompanyConfig,
  sendChatMessage,
} from "@/lib/leads/client";
import type { ChatThread, CompanyLeadConfig, ScheduledVisit } from "@/lib/leads/types";
import { mergeChatThread, useChatThreadPolling } from "@/hooks/use-chat-thread-polling";
import { cn } from "@/lib/utils";

type Props = {
  companyId: string;
  companyName: string;
};

const statusStyles: Record<ScheduledVisit["status"], string> = {
  pending: "bg-amber-500/15 text-amber-300",
  confirmed: "bg-emerald-500/15 text-emerald-300",
  cancelled: "bg-red-500/15 text-red-300",
};

export function CompanyLeadsPanel({ companyId, companyName }: Props) {
  const t = useTranslations("contact.company");
  const [tab, setTab] = useState<"visits" | "chats" | "config">("visits");
  const [visits, setVisits] = useState<ScheduledVisit[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [config, setConfig] = useState<CompanyLeadConfig>({
    companyId,
    companyName,
    whatsappNumber: "",
  });
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const [visitData, chatData, configData] = await Promise.all([
        fetchCompanyVisits(companyId),
        fetchCompanyChats(companyId),
        fetchCompanyConfig(companyId),
      ]);
      setVisits(visitData);
      setThreads(chatData);
      setConfig(configData);
    } catch {
      setVisits([]);
      setThreads([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [companyId]);

  useChatThreadPolling(
    activeThreadId,
    tab === "chats" && !loading && !!activeThreadId,
    (updated) => {
      setThreads((current) =>
        current.map((thread) =>
          thread.id === updated.id ? mergeChatThread(thread, updated) : thread,
        ),
      );
    },
  );

  async function handleSaveConfig(event: React.FormEvent) {
    event.preventDefault();
    await saveCompanyConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleReply(threadId: string) {
    const text = replyDrafts[threadId]?.trim();
    if (!text) return;

    const updated = await sendChatMessage({ threadId, sender: "company", text });
    setReplyDrafts((current) => ({ ...current, [threadId]: "" }));
    setThreads((current) =>
      current.map((thread) => (thread.id === updated.id ? updated : thread)),
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mt-1 text-sm text-white/55">{companyName}</p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {(["visits", "chats", "config"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              tab === item
                ? "bg-[#d4a017] text-[#000a1a]"
                : "bg-white/10 text-white/70 hover:bg-white/15",
            )}
          >
            {t(`tabs.${item}`)}
          </button>
        ))}
      </nav>

      {loading ? <p className="text-white/50">{t("loading")}</p> : null}

      {!loading && tab === "visits" ? (
        visits.length === 0 ? (
          <section className="rounded-xl bg-white/5 p-10 text-center">
            <Calendar className="mx-auto size-10 text-white/35" />
            <p className="mt-4 font-medium text-white">{t("visits.emptyTitle")}</p>
            <p className="mt-1 text-sm text-white/45">{t("visits.emptyBody")}</p>
          </section>
        ) : (
          <section className="space-y-3">
            {visits.map((visit) => (
              <article key={visit.id} className="rounded-xl bg-white/5 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{visit.listingTitle}</p>
                    <p className="mt-1 text-sm text-white/50">
                      {visit.buyerName} · {visit.buyerPhone}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      statusStyles[visit.status],
                    )}
                  >
                    {t(`visits.status.${visit.status}`)}
                  </span>
                </div>
                <p className="mt-3 text-sm text-white/75">
                  {t("visits.scheduledFor", {
                    date: visit.preferredDate,
                    time: visit.preferredTime,
                  })}
                </p>
                {visit.notes ? (
                  <p className="mt-2 text-sm text-white/45">{visit.notes}</p>
                ) : null}
              </article>
            ))}
          </section>
        )
      ) : null}

      {!loading && tab === "chats" ? (
        threads.length === 0 ? (
          <section className="rounded-xl bg-white/5 p-10 text-center">
            <MessageCircle className="mx-auto size-10 text-white/35" />
            <p className="mt-4 font-medium text-white">{t("chats.emptyTitle")}</p>
            <p className="mt-1 text-sm text-white/45">{t("chats.emptyBody")}</p>
          </section>
        ) : (
          <section className="space-y-4">
            {threads.map((thread) => (
              <article
                key={thread.id}
                className={cn(
                  "rounded-xl bg-white/5 p-4",
                  activeThreadId === thread.id && "ring-1 ring-[#d4a017]/40",
                )}
                onClick={() => setActiveThreadId(thread.id)}
              >
                <div className="mb-3">
                  <p className="font-medium text-white">{thread.listingTitle}</p>
                  <p className="text-sm text-white/50">
                    {thread.buyerName} · {t("chats.messages", { count: thread.messages.length })}
                  </p>
                </div>
                <div className="mb-3 max-h-48 space-y-2 overflow-y-auto">
                  {thread.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                        message.sender === "company"
                          ? "ml-auto bg-[#1d4ed8] text-white"
                          : "bg-[#0a111f] text-white/80",
                      )}
                    >
                      {message.text}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={replyDrafts[thread.id] ?? ""}
                    onFocus={() => setActiveThreadId(thread.id)}
                    onChange={(e) =>
                      setReplyDrafts((current) => ({
                        ...current,
                        [thread.id]: e.target.value,
                      }))
                    }
                    placeholder={t("chats.replyPlaceholder")}
                    className="border-white/10 bg-[#0a111f] text-white"
                  />
                  <Button type="button" onClick={() => handleReply(thread.id)}>
                    {t("chats.reply")}
                  </Button>
                </div>
              </article>
            ))}
          </section>
        )
      ) : null}

      {!loading && tab === "config" ? (
        <form
          onSubmit={handleSaveConfig}
          className="max-w-md space-y-4 rounded-xl bg-white/5 p-5"
        >
          <div>
            <h2 className="font-semibold text-white">{t("config.title")}</h2>
            <p className="mt-1 text-sm text-white/50">{t("config.subtitle")}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-whatsapp">{t("config.whatsapp")}</Label>
            <Input
              id="company-whatsapp"
              required
              value={config.whatsappNumber}
              onChange={(e) =>
                setConfig((current) => ({ ...current, whatsappNumber: e.target.value }))
              }
              placeholder="5554999887766"
              className="border-white/10 bg-[#0a111f] text-white"
            />
            <p className="text-xs text-white/40">{t("config.hint")}</p>
          </div>
          <Button type="submit" className="gap-2 bg-[#d4a017] text-[#000a1a] hover:bg-[#c39216]">
            <Save className="size-4" />
            {saved ? t("config.saved") : t("config.save")}
          </Button>
        </form>
      ) : null}
    </div>
  );
}
