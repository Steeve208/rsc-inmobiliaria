import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { AdvancedSearch } from "@/features/search";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SearchPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-white/50">
          Loading...
        </div>
      }
    >
      <AdvancedSearch />
    </Suspense>
  );
}
