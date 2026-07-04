"use client";

import { useTranslations } from "next-intl";
import {
  Bookmark,
  Calendar,
  GitCompare,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import {
  BuyerChatsPanel,
  BuyerChatThreadPanel,
  BuyerVisitsPanel,
} from "@/features/contact";
import { FavoritesPageSection } from "@/features/favorites";
import { CompareHub } from "@/features/dashboard/components/compare-hub";
import { SavedSearchesHub } from "@/features/imoveis/components/saved-searches-panel";
import { BuyerFinancingRequestsPanel } from "@/features/financing/components/buyer-financing-requests-panel";

const tabs = [
  { id: "favorites", icon: Heart, href: "/dashboard", labelKey: "favorites" },
  { id: "searches", icon: Bookmark, href: "/dashboard/searches", labelKey: "searches" },
  { id: "visits", icon: Calendar, href: "/dashboard/visits", labelKey: "visits" },
  { id: "chats", icon: MessageCircle, href: "/dashboard/chats", labelKey: "chats" },
  { id: "compare", icon: GitCompare, href: "/dashboard/compare", labelKey: "compareTab" },
  { id: "requests", icon: Send, href: "/dashboard/requests", labelKey: "requests" },
] as const;

type Props = {
  activeTab?: (typeof tabs)[number]["id"];
  activeThreadId?: string;
};

export function BuyerHub({ activeTab = "favorites", activeThreadId }: Props) {
  const t = useTranslations("dashboard");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{t("title")}</h1>
        <p className="mt-1 text-white/60">{t("subtitle")}</p>
      </div>

      <nav className="flex flex-wrap gap-2 pb-4">
        {tabs.map(({ id, icon: Icon, href, labelKey }) => (
          <Link
            key={id}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab === id
                ? "bg-[#1d4ed8] text-white"
                : "bg-white/10 text-white/70 hover:bg-white/15",
            )}
          >
            <Icon className="size-4" />
            {t(labelKey)}
          </Link>
        ))}
      </nav>

      {activeTab === "favorites" && (
        <FavoritesPageSection title={t("favoritesTitle")} titleAs="h2" />
      )}

      {activeTab === "searches" && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">{t("searchesTitle")}</h2>
          <SavedSearchesHub />
        </section>
      )}

      {activeTab === "requests" && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">{t("requestsTitle")}</h2>
          <BuyerFinancingRequestsPanel />
        </section>
      )}

      {activeTab === "chats" && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">{t("chatsTitle")}</h2>
          <div
            className={
              activeThreadId
                ? "grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]"
                : undefined
            }
          >
            <div className={activeThreadId ? "hidden lg:block" : undefined}>
              <BuyerChatsPanel activeThreadId={activeThreadId} />
            </div>
            {activeThreadId ? (
              <BuyerChatThreadPanel threadId={activeThreadId} />
            ) : null}
          </div>
        </section>
      )}

      {activeTab === "visits" && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">{t("visitsTitle")}</h2>
          <BuyerVisitsPanel />
        </section>
      )}

      {activeTab === "compare" && <CompareHub />}
    </div>
  );
}
