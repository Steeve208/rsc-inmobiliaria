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
    <section className="border-y border-[#E8E2D4] bg-[#F7F5F0]">
      <div className="rk-container grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4 lg:py-7">
        {TRUST_ITEMS.map((id) => {
          const Icon = icons[id];
          return (
            <div key={id} className="flex items-start gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[#E8A84A] shadow-sm">
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-bold text-[#0B1220]">{t(`${id}.title`)}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[#6B7285]">
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
