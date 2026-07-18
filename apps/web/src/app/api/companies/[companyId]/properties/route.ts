import { localCompanyCrudDisabledResponse } from "@/lib/companies/local-crud-disabled";

type RouteParams = { params: Promise<{ companyId: string }> };

export async function GET(_request: Request, _ctx: RouteParams) {
  return localCompanyCrudDisabledResponse();
}

export async function POST(_request: Request, _ctx: RouteParams) {
  return localCompanyCrudDisabledResponse();
}
