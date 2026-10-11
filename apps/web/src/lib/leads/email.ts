const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function buildMailtoUrl(email: string, subject: string, body: string) {
  const to = email.trim();
  if (!EMAIL_PATTERN.test(to)) return null;

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
