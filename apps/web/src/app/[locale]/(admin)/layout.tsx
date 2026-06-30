import { Link } from "@/lib/i18n/routing";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full">
      <aside className="hidden w-56 shrink-0 border-r border-border/60 bg-muted/30 p-4 md:block">
        <Link href="/" className="mb-6 block text-sm font-semibold">
          RSC Market Admin
        </Link>
        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Moderation</span>
          <span>Users</span>
          <span>Listings</span>
          <span>Reports</span>
        </nav>
      </aside>
      <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
