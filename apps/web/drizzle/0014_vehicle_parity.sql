ALTER TABLE "saved_search"
  ADD COLUMN IF NOT EXISTS "vertical" text DEFAULT 'property' NOT NULL;

CREATE INDEX IF NOT EXISTS "saved_search_vertical_idx"
  ON "saved_search" ("vertical", "user_id");

CREATE TABLE IF NOT EXISTS "vehicle_compare" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL,
  "listing_id" text NOT NULL,
  "position" integer NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "vehicle_compare_unique" UNIQUE("user_id","listing_id")
);

DO $$ BEGIN
  ALTER TABLE "vehicle_compare"
    ADD CONSTRAINT "vehicle_compare_user_id_user_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "vehicle_compare_user_idx"
  ON "vehicle_compare" ("user_id");
