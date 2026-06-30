import { setRequestLocale } from "next-intl/server";
import { AuthForm } from "@/features/auth";
import { Link } from "@/lib/i18n/routing";
import { Logo } from "@/components/layout/logo";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignUpPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { callbackUrl } = await searchParams;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 py-12">
      <div className="mb-8">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <AuthForm mode="signUp" callbackUrl={callbackUrl ?? "/dashboard"} />
    </div>
  );
}
