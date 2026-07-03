import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { VisitConfirmedPanel } from "@/features/contact/components/visit-confirmed-panel";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function VisitConfirmedPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact.visitConfirmed" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-white/50">
            {t("loading")}
          </div>
        }
      >
        <VisitConfirmedPanel />
      </Suspense>
    </div>
  );
}
