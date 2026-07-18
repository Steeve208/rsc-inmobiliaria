import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

/** Brand monogram: geometric R with skyline bars. */
function ReeskovaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <g fill="#D4A62A">
        <rect x="12" y="32" width="3.6" height="20" rx="0.8" />
        <rect x="17" y="23" width="3.6" height="29" rx="0.8" />
        <rect x="22" y="28" width="3.6" height="24" rx="0.8" />
        <rect x="27" y="18" width="3.6" height="34" rx="0.8" />
      </g>
      <path
        stroke="#D4A62A"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M30.8 18H40c7 0 11.6 4 11.6 10.2S47 38.4 40 38.4H30.8"
      />
      <path
        stroke="#D4A62A"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M39 38.4L51.5 54"
      />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  /** Footer only — never in the header */
  showPoweredBy?: boolean;
};

export function Logo({ className, showPoweredBy = false }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3.5", className)}>
      <ReeskovaMark className="size-12" />
      <div className="flex flex-col leading-none">
        <span className="text-[20px] font-bold tracking-[0.08em] text-white uppercase">
          REESKOVA
        </span>
        <span className="mt-1.5 text-[10px] font-medium tracking-[0.14em] text-[#D4A62A] uppercase">
          Real Estate Marketplace
        </span>
        {showPoweredBy ? (
          <span className="mt-2.5 flex items-center gap-2 text-[9px] text-[#AEB7C5]">
            <span className="h-px w-4 bg-[#D4A62A]/50" aria-hidden />
            Powered by <span className="text-[#D4A62A]">RSC Group</span>
            <span className="h-px w-4 bg-[#D4A62A]/50" aria-hidden />
          </span>
        ) : null}
      </div>
    </Link>
  );
}
