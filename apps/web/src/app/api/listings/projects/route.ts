import { NextResponse } from "next/server";
import { listProjects } from "@/lib/listings/project-repository";

export async function GET() {
  return NextResponse.json(await listProjects());
}
