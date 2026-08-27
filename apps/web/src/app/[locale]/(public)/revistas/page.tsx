import { setRequestLocale } from "next-intl/server";
import { RevistasPage } from "@/features/revistas";
import { getAdminSession } from "@/lib/auth/admin";
import { listMagazines } from "@/lib/listings/magazine-store";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [magazines, session] = await Promise.all([
    listMagazines(),
    getAdminSession(),
  ]);

  return <RevistasPage magazines={magazines} canPublish={Boolean(session)} />;
}
