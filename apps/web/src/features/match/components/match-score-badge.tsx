"use client";

import { cn } from "@/lib/utils";

export function MatchScoreBadge({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-[#0B1220] px-2.5 py-1 text-[11px] font-bold tracking-wide text-white",
        className,
      )}
    >
      REESKOVA MATCH {score}%
    </span>
  );
}
