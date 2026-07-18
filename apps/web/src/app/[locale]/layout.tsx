import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Providers } from "@/lib/providers";
import { routing } from "@/lib/i18n/routing";
import { readMarketFromCookies } from "@/lib/markets/server";
import "@/styles/globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
    "http://localhost:3001";

  return {
    metadataBase: new URL(appUrl),
    title: {
      default: t("title"),
      template: "%s | REESKOVA",
    },
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: "REESKOVA",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    icons: {
      icon: [
        { url: "/brand/reeskova-icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: [{ url: "/brand/reeskova-icon.png" }],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const cookieStore = await cookies();
  const headerStore = await headers();
  const { marketId, isConfirmed } = readMarketFromCookies(
    cookieStore,
    headerStore,
  );

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="rk-body flex min-h-full flex-col">
        <NextIntlClientProvider messages={messages}>
          <Providers
            initialMarketId={marketId}
            initialMarketConfirmed={isConfirmed}
          >
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
