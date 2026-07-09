"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/lib/i18n/routing";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  mode: "signIn" | "signUp";
};

export function AuthForm({ mode }: Props) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const postAuthUrl = `/${locale}`;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isSignUp = mode === "signUp";

  async function handleEmailSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
          phone: phone.trim(),
          callbackURL: postAuthUrl,
        } as Parameters<typeof authClient.signUp.email>[0]);

        if (result.error) {
          setError(result.error.message ?? t("errors.generic"));
          return;
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
          callbackURL: postAuthUrl,
        });

        if (result.error) {
          setError(result.error.message ?? t("errors.generic"));
          return;
        }
      }
    } catch {
      setError(t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setIsGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: postAuthUrl,
      });
    } catch {
      setError(t("errors.google"));
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-white">
          {isSignUp ? t("signUp.title") : t("signIn.title")}
        </h1>
        <p className="mt-2 text-sm text-white/60">
          {isSignUp ? t("signUp.subtitle") : t("signIn.subtitle")}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full border-white/15 bg-white/5 text-white hover:bg-white/10"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
      >
        <GoogleIcon className="size-4" />
        {isGoogleLoading ? t("loading") : t("continueWithGoogle")}
      </Button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/40">{t("orContinueWithEmail")}</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/80">
              {t("fields.name")}
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-11 border-white/15 bg-white/5 text-white placeholder:text-white/40"
              placeholder={t("fields.namePlaceholder")}
            />
          </div>
        )}

        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white/80">
              {t("fields.phone")}
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="h-11 border-white/15 bg-white/5 text-white placeholder:text-white/40"
              placeholder={t("fields.phonePlaceholder")}
            />
          </div>
        )}

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

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white/80">
            {t("fields.password")}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 border-white/15 bg-white/5 text-white placeholder:text-white/40"
            placeholder={t("fields.passwordPlaceholder")}
          />
        </div>

        {error && (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="h-11 w-full bg-[#d4a017] font-semibold text-[#000a1a] hover:bg-[#c39216]"
          disabled={isLoading || isGoogleLoading}
        >
          {isLoading
            ? t("loading")
            : isSignUp
              ? t("signUp.submit")
              : t("signIn.submit")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/60">
        {isSignUp ? t("signUp.hasAccount") : t("signIn.noAccount")}{" "}
        <Link
          href={isSignUp ? "/entrar" : "/cadastrar"}
          className="font-medium text-[#fbbf24] hover:text-[#fcd34d]"
        >
          {isSignUp ? t("signIn.link") : t("signUp.link")}
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={cn(className)} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
