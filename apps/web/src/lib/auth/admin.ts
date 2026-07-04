import { headers } from "next/headers";
import { auth } from "@/lib/auth";

type SessionUser = {
  id: string;
  role?: string;
};

export async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const role = (session.user as SessionUser).role;
  if (role !== "admin") return null;

  return session;
}

export async function requireAdminUserId() {
  const session = await getAdminSession();
  return session?.user?.id ?? null;
}
