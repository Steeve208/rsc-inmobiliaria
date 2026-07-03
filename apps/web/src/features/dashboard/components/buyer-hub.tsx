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
  BuyerVisitsPanel,
  FavoritesPanel,
} from "@/features/contact";
import { PropertyComparePanel } from "@/features/imoveis/components/property-compare-panel";
import { SavedSearchesPanel } from "@/features/imoveis/components/saved-searches-panel";

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
};

export function BuyerHub({ activeTab = "favorites" }: Props) {
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
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">{t("favoritesTitle")}</h2>
          <FavoritesPanel />
        </section>
      )}

      {activeTab === "searches" && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">{t("searchesTitle")}</h2>
          <SavedSearchesPanel />
        </section>
      )}

      {activeTab === "requests" && (
        <section className="rounded-xl bg-white/5 p-12 text-center">
          <Send className="mx-auto size-10 text-white/35" />
          <p className="mt-4 font-medium text-white">{t("requestsTitle")}</p>
          <p className="mt-1 text-sm text-white/50">{t("requestsEmpty")}</p>
          <Link
            href="/financing"
            className="mt-4 inline-block text-sm font-medium text-[#60a5fa] hover:underline"
          >
            {t("financingCta")}
          </Link>
        </section>
      )}

      {activeTab === "chats" && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">{t("chatsTitle")}</h2>
          <BuyerChatsPanel />
        </section>
      )}

      {activeTab === "visits" && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">{t("visitsTitle")}</h2>
          <BuyerVisitsPanel />
        </section>
      )}

      {activeTab === "compare" && <PropertyComparePanel />}
    </div>
  );
}
