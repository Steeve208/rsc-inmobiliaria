import { setRequestLocale } from "next-intl/server";
import { EmpresaCadastroPage } from "@/features/para-empresas";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <EmpresaCadastroPage />;
}
