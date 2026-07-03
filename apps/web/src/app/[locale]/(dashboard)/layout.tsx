import { Link } from "@/lib/i18n/routing";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border/60 bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold">
          RSC Market
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground">
            Overview
          </Link>
            <Button size="sm" variant="outline">
              Account
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
