import { Header } from "@/components/layout/header";
import { MobileBottomNav } from "@/components/marketplace/mobile-bottom-nav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F4F4F5] pb-16 md:pb-0">{children}</main>
      <MobileBottomNav />
    </>
  );
}
