import { getTranslations } from "next-intl/server";
import {
  BadgeCheck,
  Globe,
  MessageCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { TRUST_ITEMS } from "@/lib/marketplace/catalog";

const icons = {
  verified: BadgeCheck,
  secure: ShieldCheck,
  global: Globe,
  connect: MessageCircle,
  search: Search,
} as const;

export async function TrustBar() {
  const t = await getTranslations("marketplace.trust");

  return (
    <section className="border-y border-[#E2E8F0] bg-[#F4F7FA]">
      <div className="rk-container grid h-[60px] grid-cols-2 items-center gap-3 lg:grid-cols-5 lg:gap-4">
        {TRUST_ITEMS.map((id) => {
          const Icon = icons[id];
          return (
            <div key={id} className="flex items-center gap-2.5">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-[#EBAD5B] shadow-sm">
                <Icon className="size-4" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-bold leading-tight text-[#0B1220]">{t(`${id}.title`)}</p>
                <p className="mt-0.5 line-clamp-1 text-[11px] leading-tight text-[#6B7285]">
                  {t(`${id}.text`)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
