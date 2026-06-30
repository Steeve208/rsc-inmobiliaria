"use client";

import { useTranslations } from "next-intl";
import {
  Calendar,
  GitCompare,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import { BuyerChatsPanel, BuyerVisitsPanel, FavoritesPanel } from "@/features/contact";

const tabs = [
  { id: "favorites", icon: Heart, href: "/dashboard" },
  { id: "requests", icon: Send, href: "/dashboard/requests" },
  { id: "chats", icon: MessageCircle, href: "/dashboard/chats" },
  { id: "visits", icon: Calendar, href: "/dashboard/visits" },
  { id: "compare", icon: GitCompare, href: "/dashboard/compare" },
] as const;

type Props = {
  activeTab?: (typeof tabs)[number]["id"];
};

export function BuyerDashboard({ activeTab = "favorites" }: Props) {
  const t = useTranslations("veiculos.dashboard");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <nav className="flex flex-wrap gap-2 pb-4">
        {tabs.map(({ id, icon: Icon, href }) => (
          <Link
            key={id}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab === id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {t(id)}
          </Link>
        ))}
      </nav>

      {activeTab === "favorites" && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">{t("favoritesTitle")}</h2>
          <FavoritesPanel />
        </section>
      )}

      {activeTab === "requests" && (
        <section className="rounded-lg bg-muted/30 p-12 text-center">
          <Send className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 font-medium">{t("requestsTitle")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("requestsEmpty")}</p>
        </section>
      )}

      {activeTab === "chats" && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">{t("chatsTitle")}</h2>
          <BuyerChatsPanel />
        </section>
      )}

      {activeTab === "visits" && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">{t("visitsTitle")}</h2>
          <BuyerVisitsPanel />
        </section>
      )}

      {activeTab === "compare" && (
        <section className="rounded-lg bg-muted/30 p-12 text-center">
          <GitCompare className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 font-medium">{t("compareTitle")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("compareEmpty")}</p>
          <Link
            href="/veiculos"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            {t("browseVehicles")}
          </Link>
        </section>
      )}
    </div>
  );
}
