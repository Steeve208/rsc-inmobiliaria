import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">
          Platform management, moderation, and analytics.
        </p>
      </div>
      <Link
        href="/admin/reports"
        className="block max-w-md rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-primary/40"
      >
        <p className="font-medium">Listing reports</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Review user-submitted reports and update moderation status.
        </p>
      </Link>
      <Link
        href="/admin/financing"
        className="block max-w-md rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-primary/40"
      >
        <p className="font-medium">RSC Credit</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Review financing requests and update status via the admin panel or API.
        </p>
      </Link>
    </div>
  );
}
