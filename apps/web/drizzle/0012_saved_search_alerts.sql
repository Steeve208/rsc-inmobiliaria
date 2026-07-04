ALTER TABLE "saved_search"
  ADD COLUMN IF NOT EXISTS "notified_listing_ids" jsonb DEFAULT '[]'::jsonb NOT NULL;

ALTER TABLE "saved_search"
  ADD COLUMN IF NOT EXISTS "alert_locale" text DEFAULT 'pt' NOT NULL;

CREATE TABLE IF NOT EXISTS "cron_job_run" (
  "job_name" text PRIMARY KEY NOT NULL,
  "last_run_at" timestamp NOT NULL,
  "last_status" text NOT NULL,
  "last_summary" jsonb,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
