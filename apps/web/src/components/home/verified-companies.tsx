"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/lib/i18n/routing";

export type VerifiedCompanyCard = {
  id: string;
  name: string;
  logo: string | null;
};

type Props = {
  items: VerifiedCompanyCard[];
};

function CompanyMark({ name, logo }: { name: string; logo: string | null }) {
  if (logo) {
    return (
      <Image
        src={logo}
        alt={name}
        fill
        className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
        sizes="56px"
      />
    );
  }

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span className="text-sm font-semibold tracking-wide text-[#D4A62A]">
      {initials || "R"}
    </span>
  );
}

export function VerifiedCompanies({ items }: Props) {
  const t = useTranslations("landing.verifiedCompanies");

  if (items.length === 0) return null;

  return (
    <section className="pt-[70px]">
      <div className="rk-container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-[#D4A62A]" />
            <h2 className="rk-section-title text-3xl lg:text-4xl">{t("title")}</h2>
          </div>
          <Link
            href="/para-empresas"
            className="text-sm font-semibold text-[#D4A62A] transition-colors duration-300 hover:text-[#E7BA4A]"
          >
            {t("viewAll")}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {items.slice(0, 6).map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                href="/para-empresas"
                className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-[20px] border border-white/[0.08] bg-[#111827] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4A62A]/40 hover:bg-[#161F31]"
              >
                <div className="relative flex size-14 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#0E1422]">
                  <CompanyMark name={company.name} logo={company.logo} />
                </div>
                <p className="line-clamp-2 text-center text-xs font-medium text-[#C8D0DD] transition-colors group-hover:text-white">
                  {company.name}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
