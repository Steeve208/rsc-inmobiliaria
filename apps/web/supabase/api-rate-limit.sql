-- Run once in Supabase SQL Editor if the table is missing.
CREATE TABLE IF NOT EXISTS "api_rate_limit" (
  "key" text PRIMARY KEY NOT NULL,
  "count" integer DEFAULT 1 NOT NULL,
  "reset_at" timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS "api_rate_limit_reset_idx" ON "api_rate_limit" ("reset_at");
ALTER TABLE "api_rate_limit" ENABLE ROW LEVEL SECURITY;
