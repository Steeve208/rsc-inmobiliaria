CREATE TABLE IF NOT EXISTS "property_compare" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL,
  "listing_id" text NOT NULL,
  "position" integer NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "property_compare_unique" UNIQUE("user_id","listing_id")
);

DO $$ BEGIN
  ALTER TABLE "property_compare"
    ADD CONSTRAINT "property_compare_user_id_user_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."user"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "property_compare_user_idx"
  ON "property_compare" ("user_id");
