"use client";

import { useTranslations } from "next-intl";
import { ReeskovaMark } from "@/components/layout/logo";
import { Link } from "@/lib/i18n/routing";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4V10c0-.6.4-1 1-1Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.5 9H4V20h2.5V9ZM5.3 4A1.6 1.6 0 1 0 5.3 7.2 1.6 1.6 0 0 0 5.3 4ZM20 20h-2.5v-5.4c0-1.5-.5-2.5-1.8-2.5-1 0-1.5.7-1.8 1.3-.1.2-.1.6-.1.9V20H11.3s.1-9.2 0-10.1H13.8v1.4c.4-.6 1.2-1.6 3-1.6 2.2 0 3.2 1.4 3.2 4.4V20Z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12.2s0-3.2-.4-4.6c-.2-.8-.9-1.5-1.7-1.7C18.4 5.5 12 5.5 12 5.5s-6.4 0-7.9.4c-.8.2-1.5.9-1.7 1.7C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.8.9 1.5 1.7 1.7 1.5.4 7.9.4 7.9.4s6.4 0 7.9-.4c.8-.2 1.5-.9 1.7-1.7.4-1.4.4-4.6.4-4.6ZM10 15.2V9.2l5.2 3-5.2 3Z" />
    </svg>
  );
}

const GOLD = "#C5A059";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <p
        className="text-[11px] font-semibold tracking-[0.16em] uppercase"
        style={{ color: GOLD }}
      >
        {title}
      </p>
      <span
        className="mt-2 block h-px w-8"
        style={{ backgroundColor: GOLD }}
        aria-hidden
      />
      <ul className="mt-4 space-y-2.5 text-[13px] text-white/90">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link href={link.href} className="transition-colors hover:text-[#C5A059]">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarketplaceFooter() {
  const t = useTranslations("marketplace.footer");
  const tBrand = useTranslations("brand");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] text-white">
      <div className="rk-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.15fr_repeat(4,minmax(0,1fr))]">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <ReeskovaMark className="size-10" />
            <span
              className="rk-display text-[22px] font-bold tracking-[0.14em] uppercase"
              style={{ color: GOLD }}
            >
              REESKOVA
            </span>
          </div>
          <p className="rk-display mt-5 text-[22px] font-medium leading-tight text-white">
            {t("slogan")}
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-white/70">
            {t("description")}
          </p>
        </div>

        <FooterColumn
          title={t("explore.title")}
          links={[
            { href: "/imoveis", label: t("explore.properties") },
            { href: "/veiculos", label: t("explore.vehicles") },
            { href: "/projetos", label: t("explore.projects") },
            { href: "/negocios", label: t("explore.businesses") },
            { href: "/services", label: t("explore.services") },
          ]}
        />
        <FooterColumn
          title={t("business.title")}
          links={[
            { href: "/empresa/cadastro", label: t("business.property") },
            { href: "/para-empresas", label: t("business.advertise") },
            { href: "/para-empresas", label: t("business.agencies") },
            { href: "/corredores", label: t("business.brokers") },
          ]}
        />
        <FooterColumn
          title={t("company.title")}
          links={[
            { href: "/about", label: t("company.about") },
            { href: "/guides", label: t("company.blog") },
            { href: "/help#contact", label: t("company.contact") },
            { href: "/careers", label: t("company.careers") },
          ]}
        />
        <FooterColumn
          title={t("support.title")}
          links={[
            { href: "/help", label: t("support.help") },
            { href: "/security", label: t("support.safety") },
            { href: "/privacy", label: t("support.privacy") },
            { href: "/terms", label: t("support.terms") },
            { href: "/cookies", label: t("support.cookies") },
          ]}
        />
      </div>

      <div className="border-t border-white/10">
        <div className="rk-container flex flex-col items-start justify-between gap-4 py-4 text-[12px] text-white/70 sm:flex-row sm:items-center">
          <p>
            <span className="rk-display font-semibold tracking-[0.12em] uppercase" style={{ color: GOLD }}>
              REESKOVA
            </span>{" "}
            <span className="ms-1">
              © {year} Reeskova. {t("rights")}
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 text-white/80">
              <a
                href="https://www.facebook.com"
                aria-label="Facebook"
                className="transition-colors hover:text-[#C5A059]"
              >
                <FacebookIcon className="size-4" />
              </a>
              <a
                href="https://www.instagram.com/reeskova/"
                aria-label="Instagram"
                className="transition-colors hover:text-[#C5A059]"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href="https://www.linkedin.com"
                aria-label="LinkedIn"
                className="transition-colors hover:text-[#C5A059]"
              >
                <LinkedInIcon className="size-4" />
              </a>
              <a
                href="https://www.youtube.com/@rscchain"
                aria-label="YouTube"
                className="transition-colors hover:text-[#C5A059]"
              >
                <YouTubeIcon className="size-4" />
              </a>
            </div>
            <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden />
            <p>
              {tBrand("poweredBy")}{" "}
              <span style={{ color: GOLD }}>{tBrand("poweredByBrand")}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
