"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { isPdfFloorPlanUrl } from "@/lib/storage/listing-media-utils";

type Props = {
  url: string;
  title: string;
};

export function FloorPlanViewer({ url, title }: Props) {
  const t = useTranslations("imoveis.detail.media");
  const isPdf = isPdfFloorPlanUrl(url);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl bg-[#111d2f]/60">
        {isPdf ? (
          <iframe
            src={url}
            title={title}
            className="aspect-[4/3] w-full min-h-[480px] bg-white"
          />
        ) : (
          <div className="relative aspect-[4/3]">
            <Image
              src={url}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width:1280px) 100vw, 900px"
            />
          </div>
        )}
      </div>
      <a
        href={url}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-[#111d2f] px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/5"
      >
        <Download className="size-4" />
        {t("downloadFloorPlan")}
      </a>
    </div>
  );
}
