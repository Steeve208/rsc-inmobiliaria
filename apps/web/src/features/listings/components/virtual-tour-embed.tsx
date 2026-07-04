"use client";

import { toVirtualTourEmbedUrl } from "@/lib/listings/media-urls";

type Props = {
  url: string;
  title: string;
  className?: string;
};

export function VirtualTourEmbed({ url, title, className }: Props) {
  const embedUrl = toVirtualTourEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div
      className={`aspect-[16/9] overflow-hidden rounded-xl bg-black ${className ?? ""}`}
    >
      <iframe
        src={embedUrl}
        title={title}
        className="size-full border-0"
        allowFullScreen
        allow="accelerometer; gyroscope; xr-spatial-tracking; fullscreen"
      />
    </div>
  );
}
