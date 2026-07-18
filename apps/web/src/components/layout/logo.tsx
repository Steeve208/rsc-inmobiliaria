import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        <rect width="40" height="40" rx="10" fill="#D6A62E" />
        <path
          d="M10 28V12h8.2c3.6 0 5.9 2.1 5.9 5.2 0 2.2-1.2 3.9-3.2 4.7L26 28h-4.6l-4.4-5.4H14.4V28H10Zm4.4-9.2h3.5c1.6 0 2.5-.9 2.5-2.2s-.9-2.2-2.5-2.2h-3.5v4.4Z"
          fill="#070B14"
        />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="rk-display text-[17px] font-bold tracking-[0.04em] text-white">
          REESKOVA
        </span>
        <span className="mt-1 text-[9px] font-medium tracking-[0.18em] text-[#C8D0DD] uppercase">
          Real Estate Marketplace
        </span>
        <span className="mt-1.5 text-[9px] text-[#8C97A8]">Powered by RSC Group</span>
      </div>
    </Link>
  );
}
