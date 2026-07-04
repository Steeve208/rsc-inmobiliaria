"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  title: string;
  items: FaqItem[];
};

function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-white sm:text-base">{item.question}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-white/40 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>
      {isOpen ? (
        <div className="border-t border-white/8 px-5 pb-4 pt-1">
          <p className="text-sm leading-relaxed text-white/55">{item.answer}</p>
        </div>
      ) : null}
    </div>
  );
}

export function CityLandingFaq({ title, items }: Props) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="scroll-mt-24">
      <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
      <div className="mt-6 space-y-3">
        {items.map((item, index) => (
          <FaqAccordionItem
            key={item.question}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex((current) => (current === index ? -1 : index))}
          />
        ))}
      </div>
    </section>
  );
}
