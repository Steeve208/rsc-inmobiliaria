import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

function getFallbackAppUrl() {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function getBaseURLConfig():
  | string
  | {
      allowedHosts: string[];
      fallback?: string;
      protocol: "https";
    } {
  const fallback = getFallbackAppUrl();

  if (process.env.NODE_ENV !== "production") {
    return fallback;
  }

  const allowedHosts = ["*.vercel.app"];

  try {
    const hostname = new URL(fallback).hostname;
    if (!allowedHosts.includes(hostname)) {
      allowedHosts.push(hostname);
    }
  } catch {
    // ignore invalid fallback URL
  }

  return {
    allowedHosts,
    fallback,
    protocol: "https",
  };
}

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL: getBaseURLConfig(),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification:
      process.env.AUTH_REQUIRE_EMAIL_VERIFICATION === "true",
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      requireLocalEmailVerified: false,
      trustedProviders: ["google"],
    },
  },
  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : undefined,
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
