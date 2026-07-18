import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { sendResendEmail } from "@/lib/email/send-resend";
import { isResendConfigured } from "@/lib/env/production-config";

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

/**
 * Email verification only blocks sign-in when outbound mail can actually deliver.
 * Without RESEND_API_KEY, requiring verification bricks email/password registration.
 * Opt out: AUTH_REQUIRE_EMAIL_VERIFICATION=false
 * Default when Resend is set: on in production.
 */
function isEmailVerificationRequired() {
  if (process.env.AUTH_REQUIRE_EMAIL_VERIFICATION === "false") return false;
  if (!isResendConfigured()) return false;
  if (process.env.AUTH_REQUIRE_EMAIL_VERIFICATION === "true") return true;
  return process.env.NODE_ENV === "production";
}

const emailVerificationRequired = isEmailVerificationRequired();

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
    sendOnSignUp: isResendConfigured(),
    sendOnSignIn: emailVerificationRequired,
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
    requireEmailVerification: emailVerificationRequired,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      void sendResendEmail({
        to: user.email,
        subject: "Restablecer contraseña — RSC Market",
        text: `Abre este enlace para restablecer tu contraseña: ${url}`,
        html: `<p>Hola${user.name ? ` ${user.name}` : ""},</p>
<p>Recibimos una solicitud para restablecer tu contraseña en RSC Market.</p>
<p><a href="${url}">Restablecer contraseña</a></p>
<p>Si no solicitaste este cambio, ignora este mensaje.</p>`,
        logContext: "auth-reset-password",
      });
    },
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
      requireLocalEmailVerified: emailVerificationRequired,
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
