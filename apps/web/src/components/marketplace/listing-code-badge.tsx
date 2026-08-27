import {
  formatListingCode,
  type ListingCodeKind,
} from "@/lib/listings/listing-code";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  code?: string | null;
  kind?: ListingCodeKind;
  className?: string;
};

export function ListingCodeBadge({ id, code, kind, className }: Props) {
  return (
    <span
      className={cn(
        "rounded bg-[#0B1220]/90 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide text-[#2BB8A8]",
        className,
      )}
    >
      {formatListingCode(id, code, kind)}
    </span>
  );
}
