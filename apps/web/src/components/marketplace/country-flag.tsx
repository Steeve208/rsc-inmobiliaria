import { countryFlag } from "@/lib/listings/country-flag";
import { cn } from "@/lib/utils";

type Props = {
  country?: string | null;
  className?: string;
};

export function CountryFlag({ country, className }: Props) {
  const flag = countryFlag(country);
  if (!flag) return null;

  return (
    <span
      className={cn("inline-block leading-none", className)}
      title={country ?? undefined}
      aria-label={country ?? undefined}
    >
      {flag}
    </span>
  );
}
