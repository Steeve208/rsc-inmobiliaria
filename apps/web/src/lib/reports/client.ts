import type { ListingReport, ListingReportStatus } from "./types";

export async function fetchAdminReports(
  status?: ListingReportStatus,
): Promise<ListingReport[]> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);

  const query = params.toString();
  const res = await fetch(`/api/admin/reports${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("fetch_reports_failed");
  return (await res.json()) as ListingReport[];
}

export async function fetchAdminReport(id: string): Promise<ListingReport> {
  const res = await fetch(`/api/admin/reports/${id}`);
  if (!res.ok) throw new Error("fetch_report_failed");
  return (await res.json()) as ListingReport;
}

export async function updateAdminReport(input: {
  id: string;
  status: ListingReportStatus;
  adminNotes?: string;
}): Promise<ListingReport> {
  const res = await fetch("/api/admin/reports", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("update_report_failed");
  return (await res.json()) as ListingReport;
}
