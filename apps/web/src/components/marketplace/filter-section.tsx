"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-[#EFECE4] py-3.5 last:border-b-0">
      <h3 className="mb-2 text-[13px] font-bold text-[#0B1220]">{title}</h3>
      {children}
    </section>
  );
}

export function FilterFold({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="border-b border-[#EFECE4] py-3.5 last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <h3 className="text-[13px] font-bold text-[#0B1220]">{title}</h3>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[#6B7285] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? <div className="mt-3 space-y-3.5">{children}</div> : null}
    </section>
  );
}
