import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/routing";
import { getAdminSession } from "@/lib/auth/admin";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getAdminSession();
  if (!session) {
    redirect({ href: "/entrar", locale });
  }

  return (
    <div className="flex min-h-full">
      <aside className="hidden w-56 shrink-0 border-r border-border/60 bg-muted/30 p-4 md:block">
        <Link href="/" className="mb-6 block text-sm font-semibold">
          RSC Market Admin
        </Link>
        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Moderation</span>
          <Link href="/admin" className="hover:text-foreground">
            Overview
          </Link>
          <Link href="/admin/reports" className="hover:text-foreground">
            Reports
          </Link>
          <Link href="/admin/financing" className="hover:text-foreground">
            RSC Credit
          </Link>
        </nav>
      </aside>
      <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
