"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const locales = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
] as const;

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Change language">
            <Globe className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {locales.map((item) => (
          <DropdownMenuItem
            key={item.code}
            onClick={() => router.replace(pathname, { locale: item.code })}
            className={locale === item.code ? "font-semibold" : undefined}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
