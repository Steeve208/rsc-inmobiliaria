import { setRequestLocale } from "next-intl/server";
import { AuthForm } from "@/features/auth";
import { Logo } from "@/components/layout/logo";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SignInPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 py-12">
      <div className="mb-8">
        <Logo />
      </div>
      <AuthForm mode="signIn" />
    </div>
  );
}
