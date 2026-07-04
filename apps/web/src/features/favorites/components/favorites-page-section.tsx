import { FavoritesPanel } from "@/features/contact";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  titleAs?: "h1" | "h2";
  className?: string;
};

export function FavoritesPageSection({
  title,
  subtitle,
  titleAs = "h1",
  className,
}: Props) {
  const TitleTag = titleAs;
  const isPageTitle = titleAs === "h1";

  return (
    <section className={cn("space-y-4", className)}>
      <div className={isPageTitle ? undefined : "mb-4"}>
        <TitleTag
          className={
            isPageTitle
              ? "text-2xl font-bold tracking-tight text-white"
              : "text-lg font-semibold text-white"
          }
        >
          {title}
        </TitleTag>
        {subtitle ? (
          <p className={cn("text-white/60", isPageTitle ? "mt-1" : "mt-1 text-sm")}>
            {subtitle}
          </p>
        ) : null}
      </div>
      <FavoritesPanel />
    </section>
  );
}
