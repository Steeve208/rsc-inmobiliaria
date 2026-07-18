import { setRequestLocale } from "next-intl/server";
import { ComoFuncionaPage } from "@/features/como-funciona";
import { Footer } from "@/components/layout/footer";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ComoFuncionaPage />
      <Footer />
    </>
  );
}
