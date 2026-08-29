import { setRequestLocale } from "next-intl/server";
import { MatchSessionPage } from "@/features/match";

type Props = {
  params: Promise<{ locale: string; sessionId: string }>;
};

export default async function Page({ params }: Props) {
  const { locale, sessionId } = await params;
  setRequestLocale(locale);
  return <MatchSessionPage sessionId={sessionId} />;
}
