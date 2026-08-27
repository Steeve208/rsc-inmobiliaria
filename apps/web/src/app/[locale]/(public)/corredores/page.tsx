import { setRequestLocale } from "next-intl/server";
import { CorredoresPage } from "@/features/corredores";
import { listBrokers } from "@/lib/listings/broker-repository";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const brokers = await listBrokers();

  return <CorredoresPage brokers={brokers} />;
}
