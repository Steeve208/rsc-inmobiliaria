CREATE TABLE IF NOT EXISTS "listing_report" (
  "id" text PRIMARY KEY NOT NULL,
  "listing_id" text NOT NULL,
  "listing_title" text NOT NULL,
  "listing_kind" text NOT NULL,
  "reason" text NOT NULL,
  "reporter_email" text,
  "reporter_user_id" text REFERENCES "user"("id") ON DELETE SET NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "admin_notes" text,
  "reviewed_by" text REFERENCES "user"("id") ON DELETE SET NULL,
  "reviewed_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "listing_report_status_idx"
  ON "listing_report" ("status");
CREATE INDEX IF NOT EXISTS "listing_report_listing_idx"
  ON "listing_report" ("listing_kind", "listing_id");
CREATE INDEX IF NOT EXISTS "listing_report_created_idx"
  ON "listing_report" ("created_at");
