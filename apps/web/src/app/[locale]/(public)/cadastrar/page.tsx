import { setRequestLocale } from "next-intl/server";
import { AuthForm } from "@/features/auth";
import { Logo } from "@/components/layout/logo";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SignUpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-6 py-8">
      <div className="mb-8">
        <Logo onLight />
      </div>
      <AuthForm mode="signUp" />
    </div>
  );
}
