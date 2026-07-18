"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@/components/layout/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Link } from "@/lib/i18n/routing";

const columns = [
  {
    key: "buy",
    links: [
      { href: "/imoveis?type=house", labelKey: "houses" },
      { href: "/imoveis?type=apartment", labelKey: "apartments" },
      { href: "/imoveis?type=land", labelKey: "land" },
      { href: "/imoveis?type=commercial", labelKey: "commercial" },
      { href: "/imoveis?launch=1", labelKey: "launches" },
    ],
  },
  {
    key: "sell",
    links: [
      { href: "/empresa/cadastro", labelKey: "publish" },
      { href: "/para-empresas", labelKey: "plans" },
      { href: "/help", labelKey: "guide" },
      { href: "/services", labelKey: "valuation" },
    ],
  },
  {
    key: "rent",
    links: [
      { href: "/imoveis?transaction=rent", labelKey: "residential" },
      { href: "/imoveis?transaction=rent&type=commercial", labelKey: "commercial" },
      { href: "/imoveis?transaction=rent", labelKey: "seasonal" },
      { href: "/imoveis?transaction=rent", labelKey: "students" },
    ],
  },
  {
    key: "companies",
    links: [
      { href: "/empresa/painel", labelKey: "portal" },
      { href: "/para-empresas", labelKey: "agencies" },
      { href: "/para-empresas", labelKey: "builders" },
      { href: "/para-empresas", labelKey: "api" },
      { href: "/empresa/cadastro", labelKey: "advertise" },
    ],
  },
  {
    key: "brand",
    links: [
      { href: "/help", labelKey: "about" },
      { href: "/help", labelKey: "careers" },
      { href: "/help", labelKey: "press" },
      { href: "/help", labelKey: "blog" },
    ],
  },
  {
    key: "help",
    links: [
      { href: "/help", labelKey: "center" },
      { href: "/help", labelKey: "contact" },
      { href: "/help", labelKey: "terms" },
      { href: "/help", labelKey: "privacy" },
    ],
  },
] as const;

const socials = [
  {
    label: "Facebook",
    href: "#",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z",
  },
  {
    label: "LinkedIn",
    href: "#",
    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@rscchain",
    path: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43zM9.75 15.02V8.98l5.75 3.02-5.75 3.02z",
  },
] as const;

export function Footer() {
  const t = useTranslations("landing.footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-[70px] border-t border-[rgba(255,255,255,.05)] bg-[#060B14]">
      <div className="rk-container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2.4fr]">
          <div>
            <Logo showPoweredBy />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#8C97A8]">
              {t("tagline")}
            </p>
            <Link
              href="/empresa/painel"
              className="rk-btn-gold mt-6 inline-flex h-12 items-center justify-center px-6 text-sm"
            >
              {tNav("companyPortal")}
            </Link>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={social.label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-[rgba(255,255,255,.08)] text-[#C8D0DD] transition-all duration-300 hover:border-[#D4A62A]/50 hover:text-[#D4A62A]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:grid-cols-6">
            {columns.map((column) => (
              <div key={column.key}>
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#8C97A8]">
                  {t(`columns.${column.key}.title`)}
                </p>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.key}-${link.labelKey}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#C8D0DD] transition-colors duration-300 hover:text-[#D4A62A]"
                      >
                        {t(`columns.${column.key}.links.${link.labelKey}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[rgba(255,255,255,.05)] pt-6 sm:flex-row">
          <p className="text-xs text-[#8C97A8]">© {year} Reeskova. {t("rights")}</p>
          <LocaleSwitcher />
        </div>
      </div>
    </footer>
  );
}
