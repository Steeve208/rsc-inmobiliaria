"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import { ReeskovaMark } from "@/components/layout/logo";
import { Link } from "@/lib/i18n/routing";

const VISION_IMAGE = "/brand/footer-vision.jpg?v=3";

const serif = { fontFamily: "var(--font-playfair), Georgia, serif" };
const GOLD = "#C5A059";

type Copy = {
  eyebrow: string;
  title: string;
  text: string;
  about: string;
  kicker: string;
  line1: string;
  line2: string;
  explore: string;
  properties: string;
  collections: string;
  destinations: string;
  company: string;
  aboutUs: string;
  vision: string;
  careers: string;
  contact: string;
  support: string;
  help: string;
  privacy: string;
  terms: string;
  security: string;
  newsletter: string;
  email: string;
  send: string;
  rights: string;
};

const COPY: Record<string, Copy> = {
  en: {
    eyebrow: "Our vision",
    title: "A global collection\nof exceptional homes.",
    text: "Reeskova connects discerning individuals with remarkable residences in the world's most desirable destinations. We curate properties for their architecture, character and location, offering a refined and seamless real estate experience.",
    about: "About Reeskova",
    kicker: "International real estate",
    line1: "Exceptional homes. Extraordinary living.",
    line2: "A global real estate platform for discerning individuals.",
    explore: "Explore",
    properties: "Properties",
    collections: "Collections",
    destinations: "Destinations",
    company: "Company",
    aboutUs: "About us",
    vision: "Our vision",
    careers: "Careers",
    contact: "Contact",
    support: "Support",
    help: "Help Center",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    security: "Security",
    newsletter: "Get exclusive properties and market insights.",
    email: "Your email address",
    send: "Subscribe",
    rights: "All rights reserved.",
  },
  pt: {
    eyebrow: "Nossa visão",
    title: "Uma coleção global\nde casas excepcionais.",
    text: "A Reeskova conecta pessoas exigentes a residências notáveis nos destinos mais desejados do mundo. Selecionamos imóveis pela arquitetura, pelo caráter e pela localização, com uma experiência refinada e sem atrito.",
    about: "Sobre a Reeskova",
    kicker: "Imobiliário internacional",
    line1: "Casas excepcionais. Uma vida extraordinária.",
    line2: "Uma plataforma global para quem busca o extraordinário.",
    explore: "Explorar",
    properties: "Imóveis",
    collections: "Coleções",
    destinations: "Destinos",
    company: "Empresa",
    aboutUs: "Sobre nós",
    vision: "Nossa visão",
    careers: "Carreiras",
    contact: "Contato",
    support: "Suporte",
    help: "Central de ajuda",
    privacy: "Política de privacidade",
    terms: "Termos de serviço",
    security: "Segurança",
    newsletter: "Receba imóveis exclusivos e leituras de mercado.",
    email: "Seu e-mail",
    send: "Assinar",
    rights: "Todos os direitos reservados.",
  },
  es: {
    eyebrow: "Nuestra visión",
    title: "Una colección global\nde casas excepcionales.",
    text: "Reeskova conecta a personas exigentes con residencias notables en los destinos más deseados del mundo. Seleccionamos propiedades por su arquitectura, carácter y ubicación, con una experiencia refinada.",
    about: "Sobre Reeskova",
    kicker: "Inmobiliaria internacional",
    line1: "Casas excepcionales. Una vida extraordinaria.",
    line2: "Una plataforma global para quienes buscan lo extraordinario.",
    explore: "Explorar",
    properties: "Propiedades",
    collections: "Colecciones",
    destinations: "Destinos",
    company: "Compañía",
    aboutUs: "Sobre nosotros",
    vision: "Nuestra visión",
    careers: "Carreras",
    contact: "Contacto",
    support: "Soporte",
    help: "Centro de ayuda",
    privacy: "Política de privacidad",
    terms: "Términos de servicio",
    security: "Seguridad",
    newsletter: "Recibe propiedades exclusivas y lecturas de mercado.",
    email: "Tu correo",
    send: "Suscribirse",
    rights: "Todos los derechos reservados.",
  },
  fr: {
    eyebrow: "Notre vision",
    title: "Une collection mondiale\nde demeures d'exception.",
    text: "Reeskova relie des personnes exigeantes à des résidences remarquables dans les destinations les plus recherchées. Nous choisissons chaque bien pour son architecture, son caractère et son emplacement.",
    about: "À propos de Reeskova",
    kicker: "Immobilier international",
    line1: "Demeures d'exception. Art de vivre.",
    line2: "Une plateforme mondiale pour les esprits exigeants.",
    explore: "Explorer",
    properties: "Propriétés",
    collections: "Collections",
    destinations: "Destinations",
    company: "Société",
    aboutUs: "À propos",
    vision: "Notre vision",
    careers: "Carrières",
    contact: "Contact",
    support: "Assistance",
    help: "Centre d'aide",
    privacy: "Politique de confidentialité",
    terms: "Conditions d'utilisation",
    security: "Sécurité",
    newsletter: "Recevez des biens exclusifs et les tendances du marché.",
    email: "Votre e-mail",
    send: "S'inscrire",
    rights: "Tous droits réservés.",
  },
  de: {
    eyebrow: "Unsere Vision",
    title: "Eine weltweite Sammlung\naußergewöhnlicher Häuser.",
    text: "Reeskova verbindet anspruchsvolle Menschen mit bemerkenswerten Residenzen an den begehrtesten Orten der Welt. Wir wählen Immobilien nach Architektur, Charakter und Lage.",
    about: "Über Reeskova",
    kicker: "Internationales Immobilienwesen",
    line1: "Außergewöhnliche Häuser. Außergewöhnliches Leben.",
    line2: "Eine globale Plattform für anspruchsvolle Menschen.",
    explore: "Entdecken",
    properties: "Immobilien",
    collections: "Kollektionen",
    destinations: "Reiseziele",
    company: "Unternehmen",
    aboutUs: "Über uns",
    vision: "Unsere Vision",
    careers: "Karriere",
    contact: "Kontakt",
    support: "Support",
    help: "Hilfe-Center",
    privacy: "Datenschutz",
    terms: "Nutzungsbedingungen",
    security: "Sicherheit",
    newsletter: "Exklusive Immobilien und Markteinblicke erhalten.",
    email: "Ihre E-Mail",
    send: "Abonnieren",
    rights: "Alle Rechte vorbehalten.",
  },
  it: {
    eyebrow: "La nostra visione",
    title: "Una collezione globale\ndi case eccezionali.",
    text: "Reeskova unisce persone esigenti a residenze notevoli nelle destinazioni più desiderate. Selezioniamo gli immobili per architettura, carattere e posizione.",
    about: "Su Reeskova",
    kicker: "Immobiliare internazionale",
    line1: "Case eccezionali. Una vita straordinaria.",
    line2: "Una piattaforma globale per chi cerca l'eccezionale.",
    explore: "Esplora",
    properties: "Proprietà",
    collections: "Collezioni",
    destinations: "Destinazioni",
    company: "Azienda",
    aboutUs: "Chi siamo",
    vision: "La nostra visione",
    careers: "Carriere",
    contact: "Contatto",
    support: "Supporto",
    help: "Centro assistenza",
    privacy: "Informativa privacy",
    terms: "Termini di servizio",
    security: "Sicurezza",
    newsletter: "Ricevi proprietà esclusive e letture di mercato.",
    email: "La tua email",
    send: "Iscriviti",
    rights: "Tutti i diritti riservati.",
  },
  ar: {
    eyebrow: "رؤيتنا",
    title: "مجموعة عالمية من المنازل الاستثنائية.",
    text: "تربط ريسكوفا أصحاب الذوق الرفيع بمساكن مميزة في أكثر الوجهات المرغوبة. نختار العقارات لمعمارها وطابعها وموقعها.",
    about: "عن ريسكوفا",
    kicker: "عقارات دولية",
    line1: "منازل استثنائية. حياة غير عادية.",
    line2: "منصة عالمية لمن يبحث عن التميز.",
    explore: "استكشف",
    properties: "عقارات",
    collections: "مجموعات",
    destinations: "وجهات",
    company: "الشركة",
    aboutUs: "من نحن",
    vision: "رؤيتنا",
    careers: "وظائف",
    contact: "تواصل",
    support: "الدعم",
    help: "مركز المساعدة",
    privacy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
    security: "الأمان",
    newsletter: "احصل على عقارات حصرية وقراءات السوق.",
    email: "بريدك الإلكتروني",
    send: "اشترك",
    rights: "جميع الحقوق محفوظة.",
  },
  zh: {
    eyebrow: "我们的愿景",
    title: "全球非凡住宅精选。",
    text: "REESKOVA 将眼光独到的人们与世界最理想目的地的杰出住宅相连。我们依建筑、气质与位置甄选房产，提供从容而精致的体验。",
    about: "关于 REESKOVA",
    kicker: "国际地产",
    line1: "非凡住宅。非凡生活。",
    line2: "为眼光独到的人而设的全球平台。",
    explore: "探索",
    properties: "房产",
    collections: "精选系列",
    destinations: "目的地",
    company: "公司",
    aboutUs: "关于我们",
    vision: "我们的愿景",
    careers: "招聘",
    contact: "联系",
    support: "支持",
    help: "帮助中心",
    privacy: "隐私政策",
    terms: "服务条款",
    security: "安全",
    newsletter: "获取独家房产与市场洞察。",
    email: "您的邮箱",
    send: "订阅",
    rights: "版权所有。",
  },
  hi: {
    eyebrow: "हमारी दृष्टि",
    title: "असाधारण घरों का वैश्विक संग्रह।",
    text: "Reeskova समझदार लोगों को दुनिया के सबसे वांछित स्थानों की उल्लेखनीय रिहाइशों से जोड़ता है। हम वास्तुकला, चरित्र और स्थान के आधार पर संपत्तियाँ चुनते हैं।",
    about: "Reeskova के बारे में",
    kicker: "अंतर्राष्ट्रीय रियल एस्टेट",
    line1: "असाधारण घर। असाधारण जीवन।",
    line2: "समझदार लोगों के लिए एक वैश्विक मंच।",
    explore: "खोजें",
    properties: "संपत्तियाँ",
    collections: "संग्रह",
    destinations: "गंतव्य",
    company: "कंपनी",
    aboutUs: "हमारे बारे में",
    vision: "हमारी दृष्टि",
    careers: "करियर",
    contact: "संपर्क",
    support: "सहायता",
    help: "सहायता केंद्र",
    privacy: "गोपनीयता नीति",
    terms: "सेवा की शर्तें",
    security: "सुरक्षा",
    newsletter: "विशेष संपत्तियाँ और बाज़ार की जानकारी पाएँ।",
    email: "आपका ईमेल",
    send: "सदस्यता लें",
    rights: "सर्वाधिकार सुरक्षित।",
  },
  bn: {
    eyebrow: "আমাদের দৃষ্টি",
    title: "অসাধারণ বাড়ির একটি বৈশ্বিক সংগ্রহ।",
    text: "Reeskova বিচক্ষণ মানুষকে বিশ্বের সবচেয়ে কাঙ্ক্ষিত গন্তব্যের উল্লেখযোগ্য বাসভবনের সঙ্গে যুক্ত করে। আমরা স্থাপত্য, চরিত্র ও অবস্থান দেখে সম্পত্তি বাছাই করি।",
    about: "Reeskova সম্পর্কে",
    kicker: "আন্তর্জাতিক রিয়েল এস্টেট",
    line1: "অসাধারণ বাড়ি। অসাধারণ জীবন।",
    line2: "বিচক্ষণ মানুষের জন্য একটি বৈশ্বিক মঞ্চ।",
    explore: "অন্বেষণ",
    properties: "সম্পত্তি",
    collections: "সংগ্রহ",
    destinations: "গন্তব্য",
    company: "কোম্পানি",
    aboutUs: "আমাদের সম্পর্কে",
    vision: "আমাদের দৃষ্টি",
    careers: "ক্যারিয়ার",
    contact: "যোগাযোগ",
    support: "সহায়তা",
    help: "সহায়তা কেন্দ্র",
    privacy: "গোপনীয়তা নীতি",
    terms: "সেবার শর্ত",
    security: "নিরাপত্তা",
    newsletter: "বিশেষ সম্পত্তি ও বাজারের খবর পান।",
    email: "আপনার ইমেল",
    send: "সাবস্ক্রাইব",
    rights: "সর্বস্বত্ব সংরক্ষিত।",
  },
};

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

function Column({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
        {title}
      </p>
      <ul className="mt-4 space-y-2.5 text-[13px] text-white/85">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Newsletter({ copy }: { copy: Copy }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("idle");
    const response = await fetch("/api/journal/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(response.ok ? "done" : "error");
    if (response.ok) setEmail("");
  }

  return (
    <form onSubmit={submit} className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
        Newsletter
      </p>
      <p className="mt-4 max-w-[16rem] text-[13px] leading-relaxed text-white/75">{copy.newsletter}</p>
      <label className="mt-4 flex h-11 max-w-xs items-center rounded-full border border-white/20 bg-white/5 pe-1 ps-4">
        <input
          type="email"
          required
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={copy.email}
          aria-label={copy.email}
          className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/40"
        />
        <button
          type="submit"
          aria-label={copy.send}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10"
        >
          <ArrowRight className="size-4" />
        </button>
      </label>
      {status === "done" ? <p className="mt-2 text-[12px]" style={{ color: GOLD }}>✓</p> : null}
      {status === "error" ? <p className="mt-2 text-[12px] text-red-300">—</p> : null}
    </form>
  );
}

export function MarketplaceFooter() {
  const locale = useLocale();
  const copy = COPY[locale] ?? COPY.en;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0c1219] text-white">
      <section className="relative isolate overflow-hidden sm:h-[148px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={VISION_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-left"
        />
        <div className="pointer-events-none absolute inset-0 bg-[#0c1219]/55 sm:bg-transparent" />
        <div className="relative mx-auto grid max-w-[1240px] items-center gap-3 px-5 py-4 sm:h-full sm:grid-cols-[1.15fr_0.95fr_0.95fr] sm:gap-0 sm:px-6 sm:py-0 lg:px-8">
          <div className="hidden sm:block" aria-hidden />
          <div className="text-center sm:px-2">
            <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/80 sm:text-[10px]">
              {copy.eyebrow}
            </p>
            <span className="mx-auto mt-1 block h-px w-10 bg-white/50" />
            <h2
              className="mt-1.5 whitespace-pre-line text-[20px] font-normal leading-[1.08] text-white sm:text-[20px] lg:text-[26px]"
              style={serif}
            >
              {copy.title}
            </h2>
          </div>
          <div className="sm:px-3">
            <p className="text-[11px] leading-[1.45] text-white/75 sm:text-[11px]">{copy.text}</p>
            <Link
              href="/about"
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-md border border-white/45 px-3 py-1 text-[11px] text-white hover:bg-white/10"
            >
              {copy.about}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-6 py-8 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.35fr)_repeat(4,minmax(0,1fr))] lg:px-8 lg:py-10">
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <ReeskovaMark className="size-10" />
              <div className="leading-none">
                <p className="text-[18px] font-bold tracking-[0.14em]" style={{ color: GOLD }}>
                  REESKOVA
                </p>
                <p className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-white/55">
                  {copy.kicker}
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-white/75">
              {copy.line1}
              <span className="mt-1 block text-white/55">{copy.line2}</span>
            </p>
            <div className="mt-5 flex items-center gap-3 text-white/80">
              <a href="https://www.facebook.com" aria-label="Facebook" className="inline-flex size-9 items-center justify-center hover:text-[#C5A059]">
                <FacebookIcon className="size-4" />
              </a>
              <a href="https://www.instagram.com/reeskova/" aria-label="Instagram" className="inline-flex size-9 items-center justify-center hover:text-[#C5A059]">
                <InstagramIcon className="size-4" />
              </a>
              <a href="https://www.linkedin.com" aria-label="LinkedIn" className="inline-flex size-9 items-center justify-center hover:text-[#C5A059]">
                <LinkedInIcon className="size-4" />
              </a>
              <a href="https://www.youtube.com/@rscchain" aria-label="YouTube" className="inline-flex size-9 items-center justify-center hover:text-[#C5A059]">
                <YouTubeIcon className="size-4" />
              </a>
            </div>
          </div>

          <Column
            title={copy.explore}
            links={[
              { href: "/imoveis", label: copy.properties },
              { href: "/imoveis?featured=1", label: copy.collections },
              { href: "/destinos", label: copy.destinations },
            ]}
          />
          <Column
            title={copy.company}
            links={[
              { href: "/about", label: copy.aboutUs },
              { href: "/about", label: copy.vision },
              { href: "/careers", label: copy.careers },
              { href: "/help#contact", label: copy.contact },
            ]}
          />
          <Column
            title={copy.support}
            links={[
              { href: "/help", label: copy.help },
              { href: "/privacy", label: copy.privacy },
              { href: "/terms", label: copy.terms },
              { href: "/security", label: copy.security },
            ]}
          />
          <Newsletter copy={copy} />
        </div>

        <div className="border-t border-white/[0.06]">
          <p className="mx-auto max-w-[1240px] px-6 py-3 text-right text-[11px] text-white/40 lg:px-8">
            © {year} Reeskova. {copy.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
