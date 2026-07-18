CREATE TABLE IF NOT EXISTS "platform_review" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "rating" integer NOT NULL,
  "comment" text NOT NULL,
  "display_name" text NOT NULL,
  "location_label" text,
  "avatar_url" text,
  "status" text DEFAULT 'published' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "platform_review_user_uidx" ON "platform_review" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "platform_review_status_idx" ON "platform_review" ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "platform_review_created_idx" ON "platform_review" ("created_at");
