"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/lib/i18n/routing";

const investments = [
  {
    id: "i1",
    title: "Edificio Residencial Porto",
    place: "Porto, Portugal",
    yield: "8.4%",
    min: "USD 25,000",
    status: "funding",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  },
  {
    id: "i2",
    title: "Condominio Green Valley",
    place: "Curitiba, Brasil",
    yield: "9.1%",
    min: "USD 15,000",
    status: "funding",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  },
  {
    id: "i3",
    title: "Torre Comercial Faria Lima",
    place: "São Paulo, Brasil",
    yield: "7.8%",
    min: "USD 50,000",
    status: "open",
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&q=80",
  },
  {
    id: "i4",
    title: "Hotel Beachfront",
    place: "Cancún, México",
    yield: "10.2%",
    min: "USD 35,000",
    status: "funding",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  },
] as const;

export function InvestmentMarketplace() {
  const t = useTranslations("landing.investment");

  return (
    <section id="inversion" className="scroll-mt-28 pt-[80px]">
      <div className="rk-container">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-[#D4A62A]" />
          <h2 className="rk-section-title text-3xl lg:text-4xl">{t("title")}</h2>
        </div>

        <div className="grid gap-5">
          {investments.map((item, index) => (
            <motion.article
              key={item.id}
              className="rk-card flex flex-col overflow-hidden p-0 md:flex-row md:items-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <div className="relative h-48 w-full shrink-0 md:h-36 md:w-52 lg:w-60">
                <Image src={item.image} alt={item.title} fill className="object-cover" sizes="240px" />
                <span className="absolute left-3 top-3 rounded-full bg-[#34D399] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#070B14]">
                  {t(`status.${item.status}`)}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:gap-8 md:px-6">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-[#8C97A8]">{item.place}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 md:flex md:items-center md:gap-10">
                  <div>
                    <p className="text-xs text-[#8C97A8]">{t("yield")}</p>
                    <p className="rk-display mt-1 text-3xl font-bold text-white lg:text-4xl">
                      {item.yield}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8C97A8]">{t("minInvest")}</p>
                    <p className="mt-1 text-base font-semibold text-[#C8D0DD]">{item.min}</p>
                  </div>
                </div>

                <Link
                  href="/financing"
                  className="rk-btn-gold inline-flex h-[48px] shrink-0 items-center justify-center px-6 text-sm md:min-w-[160px]"
                >
                  {t("cta")}
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
