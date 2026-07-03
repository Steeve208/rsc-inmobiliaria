import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { FinancingPage } from "@/features/financing/components/financing-page";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<div className="p-10 text-white/50">Loading...</div>}>
      <FinancingPage />
    </Suspense>
  );
}
