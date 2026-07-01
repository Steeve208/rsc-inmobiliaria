/** Supabase URL from env (Vercel integration uses the same name). */
export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

/**
 * Publishable or legacy anon key. Vercel ↔ Supabase integration may inject
 * NEXT_PUBLIC_SUPABASE_ANON_KEY; local .env uses NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
 */
export function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
