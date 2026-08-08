import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getBackofficeLoginUrl } from "@/lib/backoffice/config";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  redirect(getBackofficeLoginUrl(locale));
}
