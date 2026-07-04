import { setRequestLocale } from "next-intl/server";
import { BuyerHub } from "@/features/dashboard/components/buyer-hub";

type Props = {
  params: Promise<{ locale: string; threadId: string }>;
};

export default async function Page({ params }: Props) {
  const { locale, threadId } = await params;
  setRequestLocale(locale);
  return <BuyerHub activeTab="chats" activeThreadId={threadId} />;
}
