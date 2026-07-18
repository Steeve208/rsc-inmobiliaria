import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Brand isotipo: geometric R with skyline bars in the stem (REESKOVA brand kit).
 * Refined proportions for web — same concept, cleaner craft.
 */
export function ReeskovaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      {/* Outer R */}
      <path
        stroke="#D4A62A"
        strokeWidth="3.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        d="M17 13.5h19.2c6.9 0 11.4 4.1 11.4 10.5 0 4.7-2.7 8.2-7.3 9.7L48 50.5H38.6L31.2 36H26.4V50.5H17V13.5Z"
      />
      {/* Inner bowl */}
      <path
        stroke="#D4A62A"
        strokeWidth="3.4"
        strokeLinejoin="round"
        d="M26.4 13.5V36h7.6c3.2 0 5.2-1.85 5.2-5s-2-5-5.2-5h-7.6"
      />
      {/* Skyline bars */}
      <g stroke="#D4A62A" strokeWidth="2.3" strokeLinecap="round">
        <path d="M21.2 39.2V31.4" />
        <path d="M24.8 39.2V27.2" />
        <path d="M28.4 39.2V29.6" />
        <path d="M32 39.2V25.4" />
      </g>
    </svg>
  );
}

type LogoProps = {
  className?: string;
  /** Footer only */
  showPoweredBy?: boolean;
};

export function Logo({ className, showPoweredBy = false }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <ReeskovaMark className="size-11" />
      <div className="flex flex-col leading-none">
        <span className="text-[18px] font-bold tracking-[0.08em] text-white uppercase">
          REESKOVA
        </span>
        <span className="mt-1.5 text-[9px] font-medium tracking-[0.16em] text-[#D4A62A] uppercase">
          Real Estate Marketplace
        </span>
        {showPoweredBy ? (
          <span className="mt-2 flex items-center gap-2 text-[9px] text-[#AEB7C5]">
            <span className="h-px w-4 bg-[#D4A62A]/50" aria-hidden />
            Powered by <span className="text-[#D4A62A]">RSC Group</span>
            <span className="h-px w-4 bg-[#D4A62A]/50" aria-hidden />
          </span>
        ) : null}
      </div>
    </Link>
  );
}
