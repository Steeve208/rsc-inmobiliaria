import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import { LEGAL_SLUGS } from "../types";

const serif = { fontFamily: "var(--font-playfair), Georgia, serif" };

const facts = ["0", "1", "2", "3"] as const;
const pillars = ["0", "1", "2"] as const;
const brands = ["group", "reeskova", "bank", "capital", "ora", "chain"] as const;

export async function AboutPage() {
  const t = await getTranslations("legalPages.about");
  const tCommon = await getTranslations("legalPages.common");
  const related = LEGAL_SLUGS.filter((item) => item !== "about");

  return (
    <div className="bg-[#070B14] text-[#AEB7C5]">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto w-full max-w-[1080px] px-6 py-16 lg:px-8 lg:py-24">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C5A059] uppercase">
            {t("eyebrow")}
          </p>
          <h1
            className="mt-5 max-w-3xl text-[2.45rem] leading-[1.12] font-medium text-white sm:text-5xl lg:text-[3.35rem]"
            style={serif}
          >
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#C5CDD8] sm:text-lg sm:leading-8">
            {t("lead")}
          </p>
          <p className="mt-8 text-xs tracking-wide text-white/45">{t("updated")}</p>
        </div>
      </header>

      <section aria-label={t("factsLabel")} className="border-b border-white/[0.06]">
        <dl className="mx-auto grid w-full max-w-[1080px] gap-px bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((key, index) => (
            <div key={key} className="bg-[#070B14] px-6 py-8 lg:px-8 lg:py-10">
              <dt className="text-[11px] font-semibold tracking-[0.18em] text-[#C5A059]">
                {String(index + 1).padStart(2, "0")}
              </dt>
              <dd className="mt-3 text-sm leading-snug font-medium text-white">
                {t(`facts.${key}`)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto grid w-full max-w-[1080px] gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <article>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#C5A059] uppercase">
            {t("group.kicker")}
          </p>
          <h2 className="mt-3 text-3xl text-white" style={serif}>
            {t("group.title")}
          </h2>
          <p className="mt-4 text-[15px] leading-7">{t("group.body")}</p>
        </article>
        <article className="lg:border-s lg:border-white/[0.08] lg:ps-16">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#C5A059] uppercase">
            {t("platform.kicker")}
          </p>
          <h2 className="mt-3 text-3xl text-white" style={serif}>
            {t("platform.title")}
          </h2>
          <p className="mt-4 text-[15px] leading-7">{t("platform.body")}</p>
        </article>
      </section>

      <section className="border-y border-white/[0.06] bg-[#0B1018]">
        <div className="mx-auto w-full max-w-[1080px] px-6 py-16 lg:px-8 lg:py-20">
          <h2 className="max-w-xl text-3xl text-white" style={serif}>
            {t("mandate.title")}
          </h2>
          <div className="mt-12 grid gap-12 lg:grid-cols-3 lg:gap-10">
            {pillars.map((key) => (
              <article key={key}>
                <p className="text-[11px] font-semibold tracking-[0.18em] text-[#C5A059]">
                  {t(`pillars.${key}.index`)}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  {t(`pillars.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-7">{t(`pillars.${key}.body`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1080px] px-6 py-16 lg:px-8 lg:py-20">
        <div className="border-s-2 border-[#C5A059] ps-6 lg:ps-8">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#C5A059] uppercase">
            {t("boundary.kicker")}
          </p>
          <h2 className="mt-3 text-3xl text-white" style={serif}>
            {t("boundary.title")}
          </h2>
          <p className="mt-5 max-w-3xl text-[15px] leading-7 text-[#C5CDD8]">
            {t("boundary.body")}
          </p>
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-[#0B1018]">
        <div className="mx-auto w-full max-w-[1080px] px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#C5A059] uppercase">
            {t("ecosystem.kicker")}
          </p>
          <h2 className="mt-3 max-w-xl text-3xl text-white" style={serif}>
            {t("ecosystem.title")}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7">{t("ecosystem.subtitle")}</p>
          <ul className="mt-10 grid gap-px bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((key) => {
              const primary = key === "group" || key === "reeskova";
              return (
                <li key={key} className="bg-[#0B1018] px-5 py-6">
                  <p
                    className={
                      primary
                        ? "text-base font-semibold tracking-[0.04em] text-white"
                        : "text-sm font-medium tracking-[0.04em] text-[#C5CDD8]"
                    }
                  >
                    {t(`ecosystem.brands.${key}.name`)}
                  </p>
                  <p className="mt-1.5 text-xs tracking-wide text-[#AEB7C5]">
                    {t(`ecosystem.brands.${key}.role`)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-8 px-6 py-14 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-16">
          <div className="max-w-xl">
            <h2 className="text-3xl text-white" style={serif}>
              {t("contactHeading")}
            </h2>
            <p className="mt-4 text-[15px] leading-7">{t("contactBody")}</p>
            <a
              href="mailto:support@rscmarket.com"
              className="mt-4 inline-block text-sm text-white underline decoration-[#C5A059] underline-offset-4 hover:text-[#C5A059]"
            >
              support@rscmarket.com
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/para-empresas"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#C5A059] px-5 text-sm font-semibold text-[#1A1205] transition-colors hover:bg-[#D4B483]"
            >
              {t("businessCta")}
            </Link>
            <Link
              href="/help"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              {t("helpCta")}
            </Link>
          </div>
        </div>
      </section>

      <nav
        aria-label={tCommon("relatedLabel")}
        className="border-t border-white/[0.06]"
      >
        <div className="mx-auto w-full max-w-[1080px] px-6 py-10 lg:px-8">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-white/40 uppercase">
            {tCommon("relatedLabel")}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {related.map((item) => (
              <li key={item}>
                <Link
                  href={`/${item}`}
                  className="inline-flex rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#C5CDD8] transition-colors hover:border-[#C5A059]/50 hover:text-white"
                >
                  {tCommon(`links.${item}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
