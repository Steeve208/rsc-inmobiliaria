import { Suspense } from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ServicesPage } from "@/features/services";
import { PUBLIC_MODULES } from "@/lib/marketplace/features";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  if (!PUBLIC_MODULES.services) notFound();

  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-[#6B7285]">
          Loading...
        </div>
      }
    >
      <ServicesPage />
    </Suspense>
  );
}
