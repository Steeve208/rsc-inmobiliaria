"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Link } from "@/lib/i18n/routing";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const tokenError = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(
    tokenError === "INVALID_TOKEN" ? t("resetPassword.invalidToken") : null,
  );
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError(t("resetPassword.invalidToken"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("resetPassword.mismatch"));
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (result.error) {
        setError(result.error.message ?? t("errors.generic"));
        return;
      }

      setDone(true);
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
          {t("resetPassword.title")}
        </h1>
        <p className="mt-2 text-sm text-white/60">
          {t("resetPassword.subtitle")}
        </p>
      </div>

      {done ? (
        <div className="space-y-6">
          <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-200">
            {t("resetPassword.success")}
          </p>
          <p className="text-center text-sm text-white/60">
            <Link
              href="/entrar"
              className="font-medium text-[#fbbf24] hover:text-[#fcd34d]"
            >
              {t("resetPassword.goToSignIn")}
            </Link>
          </p>
        </div>
      ) : !token || tokenError === "INVALID_TOKEN" ? (
        <div className="space-y-6">
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {t("resetPassword.invalidToken")}
          </p>
          <p className="text-center text-sm text-white/60">
            <Link
              href="/recuperar-senha"
              className="font-medium text-[#fbbf24] hover:text-[#fcd34d]"
            >
              {t("resetPassword.requestNew")}
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80">
              {t("fields.newPassword")}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 border-white/15 bg-white/5 text-white placeholder:text-white/40"
              placeholder={t("fields.passwordPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white/80">
              {t("fields.confirmPassword")}
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-11 border-white/15 bg-white/5 text-white placeholder:text-white/40"
              placeholder={t("fields.passwordPlaceholder")}
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
            {isLoading ? t("loading") : t("resetPassword.submit")}
          </Button>
        </form>
      )}
    </div>
  );
}
