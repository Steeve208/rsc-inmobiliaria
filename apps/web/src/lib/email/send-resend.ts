import { isResendConfigured, logMissingEnvOnce } from "@/lib/env/production-config";

export async function sendResendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  logContext: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const from =
    process.env.RESEND_FROM_EMAIL ?? "RSC Market <onboarding@resend.dev>";

  if (!isResendConfigured()) {
    logMissingEnvOnce(
      "RESEND_API_KEY",
      input.logContext,
      "Email skipped. Set RESEND_API_KEY to enable outbound mail.",
    );
    console.info(`[${input.logContext}]`, {
      to: input.to,
      subject: input.subject,
    });
    return { sent: false, reason: "resend_not_configured" };
  }

  const resendKey = process.env.RESEND_API_KEY!;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[${input.logContext}] Resend failed:`, res.status, body);
      return { sent: false, reason: "resend_failed" };
    }

    return { sent: true };
  } catch (error) {
    console.error(`[${input.logContext}] Resend error:`, error);
    return { sent: false, reason: "resend_error" };
  }
}
