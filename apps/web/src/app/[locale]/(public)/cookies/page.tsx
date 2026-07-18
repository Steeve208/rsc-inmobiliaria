import { setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/footer";
import { LegalDocumentPage } from "@/features/legal";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <LegalDocumentPage slug="cookies" />
      <Footer />
    </>
  );
}
