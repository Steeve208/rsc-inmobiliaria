import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { enforceRateLimit } from "@/lib/security/rate-limit";

const handler = toNextJsHandler(auth);

async function withAuthRateLimit(
  request: Request,
  method: "GET" | "POST",
) {
  const limited = enforceRateLimit(request, "auth", 40, 60_000);
  if (limited) return limited;
  return handler[method](request);
}

export const GET = (request: Request) => withAuthRateLimit(request, "GET");
export const POST = (request: Request) => withAuthRateLimit(request, "POST");
