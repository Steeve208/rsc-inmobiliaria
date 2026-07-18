import { NextResponse } from "next/server";
import { getBackofficeLoginUrl } from "@/lib/backoffice/config";

/** Local company listing CRUD is retired — manage inventory in the backoffice. */
export function localCompanyCrudDisabledResponse(locale = "pt") {
  const backofficeLoginUrl = getBackofficeLoginUrl(locale);

  return NextResponse.json(
    {
      error: "local_company_crud_disabled",
      message:
        "Company listings are managed in the RSC backoffice. Use registration-requests and the backoffice dashboard.",
      backofficeLoginUrl,
    },
    { status: 410 },
  );
}
