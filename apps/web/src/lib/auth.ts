import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { sendResendEmail } from "@/lib/email/send-resend";

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

/** Opt out with AUTH_REQUIRE_EMAIL_VERIFICATION=false. Default: on in production. */
function isEmailVerificationRequired() {
  if (process.env.AUTH_REQUIRE_EMAIL_VERIFICATION === "false") return false;
  if (process.env.AUTH_REQUIRE_EMAIL_VERIFICATION === "true") return true;
  return process.env.NODE_ENV === "production";
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
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendResendEmail({
        to: user.email,
        subject: "Verifica tu email — RSC Market",
        text: `Abre este enlace para verificar tu email: ${url}`,
        html: `<p>Hola${user.name ? ` ${user.name}` : ""},</p>
<p>Confirma tu email en RSC Market:</p>
<p><a href="${url}">Verificar email</a></p>
<p>Si no creaste esta cuenta, ignora este mensaje.</p>`,
        logContext: "auth-verification",
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: isEmailVerificationRequired(),
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (createdUser) => {
          const { syncAllLeadsForBuyer } = await import("@/lib/leads/lead-sync");
          await syncAllLeadsForBuyer(createdUser.id, {
            name: createdUser.name,
            email: createdUser.email,
            phone: (createdUser as { phone?: string | null }).phone ?? null,
          });
        },
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      requireLocalEmailVerified: true,
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
