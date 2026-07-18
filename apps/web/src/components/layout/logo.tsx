import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

/** Brand monogram: geometric R with skyline bars (outline on dark UI). */
function ReeskovaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <path
        stroke="#D4A62A"
        strokeWidth="3.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        d="M16 13h20.5c7.4 0 12.4 4.4 12.4 11.2 0 5-2.9 8.8-7.6 10.4L50.5 51H39.2L31.6 36.2H26.2V51H16V13Z"
      />
      <path
        stroke="#D4A62A"
        strokeWidth="3.8"
        strokeLinejoin="round"
        d="M26.2 13V36.2h7.6c3.2 0 5.2-1.8 5.2-5s-2-5-5.2-5H26.2"
      />
      <g stroke="#D4A62A" strokeWidth="2.4" strokeLinecap="round">
        <path d="M20.2 39.5V31.5" />
        <path d="M23.8 39.5V27.5" />
        <path d="M27.4 39.5V29.5" />
        <path d="M31 39.5V25.5" />
      </g>
    </svg>
  );
}

type LogoProps = {
  className?: string;
  showPoweredBy?: boolean;
};

export function Logo({ className, showPoweredBy = false }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <ReeskovaMark className="size-10" />
      <span className="hidden h-9 w-px bg-white/25 sm:block" aria-hidden />
      <div className="flex flex-col leading-none">
        <span className="text-[17px] font-bold tracking-[0.06em] text-white uppercase">
          REESKOVA
        </span>
        <span className="mt-1 text-[9px] font-medium tracking-[0.16em] text-[#D4A62A] uppercase">
          Real Estate Marketplace
        </span>
        {showPoweredBy ? (
          <span className="mt-1.5 flex items-center gap-2 text-[9px] text-[#AEB7C5]">
            <span className="h-px w-4 bg-[#D4A62A]/60" aria-hidden />
            Powered by <span className="text-[#D4A62A]">RSC Group</span>
            <span className="h-px w-4 bg-[#D4A62A]/60" aria-hidden />
          </span>
        ) : null}
      </div>
    </Link>
  );
}
