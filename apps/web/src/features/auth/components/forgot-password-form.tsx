"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/lib/i18n/routing";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/${locale}/redefinir-senha`
          : `/${locale}/redefinir-senha`;

      const result = await authClient.requestPasswordReset({
        email,
        redirectTo,
      });

      if (result.error) {
        setError(result.error.message ?? t("errors.generic"));
        return;
      }

      setSent(true);
    } catch {
      setError(t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-white">
          {t("forgotPassword.title")}
        </h1>
        <p className="mt-2 text-sm text-white/60">
          {t("forgotPassword.subtitle")}
        </p>
      </div>

      {sent ? (
        <div className="space-y-6">
          <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-200">
            {t("forgotPassword.success")}
          </p>
          <p className="text-center text-sm text-white/60">
            <Link
              href="/entrar"
              className="font-medium text-[#fbbf24] hover:text-[#fcd34d]"
            >
              {t("forgotPassword.backToSignIn")}
            </Link>
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">
                {t("fields.email")}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 border-white/15 bg-white/5 text-white placeholder:text-white/40"
                placeholder={t("fields.emailPlaceholder")}
              />
            </div>

            {error ? (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              className="h-11 w-full bg-[#d4a017] font-semibold text-[#000a1a] hover:bg-[#c39216]"
              disabled={isLoading}
            >
              {isLoading ? t("loading") : t("forgotPassword.submit")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-white/60">
            <Link
              href="/entrar"
              className="font-medium text-[#fbbf24] hover:text-[#fcd34d]"
            >
              {t("forgotPassword.backToSignIn")}
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
