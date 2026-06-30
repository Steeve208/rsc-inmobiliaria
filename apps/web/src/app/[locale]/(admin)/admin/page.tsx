import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
      <p className="text-muted-foreground">
        Platform management, moderation, and analytics.
      </p>
    </div>
  );
}
