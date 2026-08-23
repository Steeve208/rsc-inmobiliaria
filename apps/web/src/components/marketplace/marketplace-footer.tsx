"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/layout/logo";
import { Link, useRouter } from "@/lib/i18n/routing";

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

function AppPhoneMockup() {
  return (
    <div className="relative mx-auto h-[210px] w-[108px] rounded-[22px] border-[3px] border-white/20 bg-[#0B1220] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,.45)]">
      <div className="absolute left-1/2 top-1.5 h-1.5 w-8 -translate-x-1/2 rounded-full bg-white/20" />
      <div className="h-full overflow-hidden rounded-[16px] bg-[#F4F4F5]">
        <div className="bg-[#0B0F19] px-2 pb-1.5 pt-3">
          <p className="text-[7px] font-bold tracking-[0.16em] text-[#E8A84A]">
            REESKOVA
          </p>
          <div className="mt-1 h-3 rounded-full bg-white/90" />
        </div>
        <div className="space-y-1 p-1.5">
          <div className="overflow-hidden rounded bg-white">
            <div className="h-10 bg-[#1F2937]" />
            <div className="h-1.5 w-10 m-1 rounded bg-[#E8A84A]" />
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="h-8 rounded bg-white" />
            <div className="h-8 rounded bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MarketplaceFooter() {
  const t = useTranslations("marketplace.footer");
  const tBrand = useTranslations("brand");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0F19] text-white">
      <div className="rk-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="rk-display text-lg font-bold">{t("newsletter.title")}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#8C97A8]">
            {t("newsletter.text")}
          </p>
          <form
            className="mt-4 flex max-w-md gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              router.push("/cadastrar");
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t("newsletter.placeholder")}
              className="h-11 min-w-0 flex-1 rounded-md border border-white/10 bg-white px-3 text-sm text-[#0B1220] outline-none placeholder:text-[#8C97A8] focus:border-[#E8A84A]"
            />
            <button
              type="submit"
              className="h-11 rounded-md bg-[#E8A84A] px-4 text-sm font-bold text-[#070B14] hover:bg-[#F0B85A]"
            >
              {t("newsletter.submit")}
            </button>
          </form>
          <div className="mt-6">
            <Logo compact />
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="mb-3 text-xs font-semibold tracking-wider text-[#8C97A8] uppercase">
            {t("reeskova.title")}
          </p>
          <ul className="space-y-2 text-sm text-[#C8D0DD]">
            <li><Link href="/about" className="hover:text-[#E8A84A]">{t("reeskova.about")}</Link></li>
            <li><Link href="/#partners" className="hover:text-[#E8A84A]">{t("reeskova.blog")}</Link></li>
            <li><Link href="/help#contact" className="hover:text-[#E8A84A]">{t("reeskova.contact")}</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="mb-3 text-xs font-semibold tracking-wider text-[#8C97A8] uppercase">
            {t("support.title")}
          </p>
          <ul className="space-y-2 text-sm text-[#C8D0DD]">
            <li><Link href="/help" className="hover:text-[#E8A84A]">{t("support.help")}</Link></li>
            <li><Link href="/security" className="hover:text-[#E8A84A]">{t("support.safety")}</Link></li>
            <li><Link href="/privacy" className="hover:text-[#E8A84A]">{t("support.privacy")}</Link></li>
            <li><Link href="/cookies" className="hover:text-[#E8A84A]">{t("support.cookies")}</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="mb-3 text-xs font-semibold tracking-wider text-[#8C97A8] uppercase">
            {t("business.title")}
          </p>
          <ul className="space-y-2 text-sm text-[#C8D0DD]">
            <li><Link href="/empresa/cadastro" className="hover:text-[#E8A84A]">{t("business.property")}</Link></li>
            <li><Link href="/para-empresas" className="hover:text-[#E8A84A]">{t("business.advertise")}</Link></li>
          </ul>
        </div>

        <div className="flex flex-col items-start gap-3 lg:col-span-2 lg:items-end">
          <p className="text-xs font-semibold tracking-wider text-[#8C97A8] uppercase">
            {t("app.title")}
          </p>
          <AppPhoneMockup />
          <div className="flex flex-col gap-2">
            <span className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-center text-[11px] font-semibold text-[#C8D0DD]">
              App Store
            </span>
            <span className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-center text-[11px] font-semibold text-[#C8D0DD]">
              Google Play
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="rk-container flex flex-col items-start justify-between gap-3 py-5 text-xs text-[#8C97A8] sm:flex-row sm:items-center">
          <p>© {year} Reeskova. {t("rights")}</p>
          <div className="flex items-center gap-3 text-white/70">
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-[#E8A84A]">
              <FacebookIcon className="size-4" />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-[#E8A84A]">
              <InstagramIcon className="size-4" />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-[#E8A84A]">
              <LinkedInIcon className="size-4" />
            </a>
            <a href="https://youtube.com" aria-label="YouTube" className="hover:text-[#E8A84A]">
              <YouTubeIcon className="size-4" />
            </a>
          </div>
          <p>
            {tBrand("poweredBy")}{" "}
            <span className="text-[#E8A84A]">{tBrand("poweredByBrand")}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
