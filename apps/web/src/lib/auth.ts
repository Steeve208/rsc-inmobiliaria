import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

function getAppUrl() {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function getTrustedOrigins(appUrl: string) {
  const origins = new Set<string>([appUrl]);

  if (process.env.NEXT_PUBLIC_APP_URL) {
    origins.add(process.env.NEXT_PUBLIC_APP_URL);
  }
  if (process.env.BETTER_AUTH_URL) {
    origins.add(process.env.BETTER_AUTH_URL);
  }
  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }
  if (process.env.VERCEL_BRANCH_URL) {
    origins.add(`https://${process.env.VERCEL_BRANCH_URL}`);
  }

  return [...origins];
}

const appUrl = getAppUrl();
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL: appUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: getTrustedOrigins(appUrl),
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
});

export type Session = typeof auth.$Infer.Session;
