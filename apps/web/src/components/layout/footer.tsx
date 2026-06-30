import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <ShoppingBag className="size-5 text-primary" />
            <span>RSC Market</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">{t("tagline")}</p>
        </div>
        <Separator />
        <p className="text-center text-xs text-muted-foreground sm:text-left">
          © {year} RSC Market. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
