import { setRequestLocale } from "next-intl/server";
import { ProjectDetailPage } from "@/features/projetos/components/project-detail-page";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function Page({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <ProjectDetailPage id={id} />;
}
