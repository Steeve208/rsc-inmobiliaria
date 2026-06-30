import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

const appUrl = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL: appUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: appUrl ? [appUrl] : undefined,
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
