import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/lib/i18n/routing";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect({ href: "/", locale });
}
