import { setRequestLocale } from "next-intl/server";
import { ServicesPage } from "@/features/services";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ServicesPage />;
}
