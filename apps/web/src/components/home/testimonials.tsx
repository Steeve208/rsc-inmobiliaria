"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Star, User } from "lucide-react";
import type { PublicPlatformReview } from "@/lib/reviews/types";

type Props = {
  reviews: PublicPlatformReview[];
};

export function Testimonials({ reviews }: Props) {
  const t = useTranslations("landing.testimonials");

  if (reviews.length === 0) return null;

  return (
    <section className="pt-[80px]">
      <div className="rk-container">
        <div className="mb-10 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-[#D4A62A]" />
          <h2 className="rk-section-title text-3xl lg:text-4xl">{t("title")}</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {reviews.map((review, index) => (
            <motion.article
              key={review.id}
              className="rk-card p-6 text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
            >
              <div className="relative mx-auto flex size-20 items-center justify-center overflow-hidden rounded-full bg-[#0E1422] ring-2 ring-[#D4A62A]/40">
                {review.avatarUrl ? (
                  <Image
                    src={review.avatarUrl}
                    alt={review.displayName}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <User className="size-8 text-[#8C97A8]" strokeWidth={1.5} />
                )}
              </div>
              <h3 className="mt-4 font-semibold text-white">{review.displayName}</h3>
              {review.locationLabel ? (
                <p className="text-xs text-[#8C97A8]">{review.locationLabel}</p>
              ) : null}
              <p className="mt-4 text-base leading-relaxed text-[#C8D0DD]">
                “{review.comment}”
              </p>
              <div className="mt-4 flex justify-center gap-1 text-[#D4A62A]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < review.rating ? "fill-current" : "text-white/20"
                    }`}
                  />
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
