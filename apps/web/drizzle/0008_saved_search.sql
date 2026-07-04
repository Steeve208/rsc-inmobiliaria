CREATE TABLE IF NOT EXISTS "saved_search" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "label" text NOT NULL,
  "filters" jsonb NOT NULL,
  "alerts_enabled" boolean DEFAULT false NOT NULL,
  "alert_frequency" text DEFAULT 'daily' NOT NULL,
  "last_alert_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

DO $$ BEGIN
  ALTER TABLE "saved_search"
    ADD CONSTRAINT "saved_search_user_id_user_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."user"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "saved_search_user_idx"
  ON "saved_search" ("user_id");
CREATE INDEX IF NOT EXISTS "saved_search_alerts_idx"
  ON "saved_search" ("alerts_enabled", "alert_frequency");
