import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Minimal geometric R isotipo — works alone as favicon/app icon.
 * Clean letterform, no skyline / agency-cliché details.
 */
export function ReeskovaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <path
        fill="#D4A62A"
        d="M10 6h12.4c5.7 0 9.6 3.4 9.6 8.5 0 3.7-2 6.5-5.3 7.7L33.2 34h-6.8l-5.8-10.2H16.4V34H10V6Zm6.4 5.2v7.8h5.6c2.5 0 4-1.3 4-3.9s-1.5-3.9-4-3.9h-5.6Z"
      />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  /** Footer only */
  showPoweredBy?: boolean;
  /** Header: compact mark + wordmark. Footer can show tagline. */
  showTagline?: boolean;
};

export function Logo({
  className,
  showPoweredBy = false,
  showTagline = false,
}: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <span className="flex size-10 items-center justify-center rounded-[12px] bg-[#D4A62A]/10 ring-1 ring-[#D4A62A]/25">
        <ReeskovaMark className="size-6" />
      </span>
      <div className="flex flex-col leading-none">
        <span className="text-[18px] font-bold tracking-[0.1em] text-white uppercase">
          REESKOVA
        </span>
        {showTagline || showPoweredBy ? (
          <span className="mt-1.5 text-[9px] font-medium tracking-[0.16em] text-[#D4A62A] uppercase">
            Marketplace
          </span>
        ) : null}
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
