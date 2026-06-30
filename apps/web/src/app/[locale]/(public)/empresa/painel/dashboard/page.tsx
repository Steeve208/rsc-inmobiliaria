import { setRequestLocale } from "next-intl/server";
import { CompanyLeadsPanel } from "@/features/contact";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ company?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params;
  const { company } = await searchParams;
  setRequestLocale(locale);

  const companyId = company ?? "rsc-imoveis";
  const companyName =
    companyId === "rsc-imoveis"
      ? "RSC Imóveis"
      : companyId === "premium-estate"
        ? "Premium Estate"
        : companyId === "construtora-sul"
          ? "Construtora Sul"
          : companyId;

  return <CompanyLeadsPanel companyId={companyId} companyName={companyName} />;
}
