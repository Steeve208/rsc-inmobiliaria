"use client";

import {
  isDirectVideoUrl,
  toHighQualityVideoEmbedUrl,
} from "@/lib/storage/listing-media-utils";
import { cn } from "@/lib/utils";

type Props = {
  url: string;
  title: string;
  className?: string;
};

/**
 * Plays listing product/property videos at source quality:
 * direct files use native video (no re-encode); embeds request HD where supported.
 */
export function ListingVideo({ url, title, className }: Props) {
  const src = toHighQualityVideoEmbedUrl(url);
  if (!src) return null;

  return (
    <div
      className={cn(
        "aspect-video overflow-hidden rounded-xl bg-black",
        className,
      )}
    >
      {isDirectVideoUrl(src) ? (
        <video
          src={src}
          controls
          playsInline
          preload="metadata"
          className="size-full object-contain"
        />
      ) : (
        <iframe
          src={src}
          title={title}
          className="size-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
    </div>
  );
}
