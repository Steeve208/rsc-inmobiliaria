CREATE TABLE IF NOT EXISTS "magazine" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "title" text NOT NULL,
  "issue_label" text NOT NULL,
  "excerpt" text NOT NULL,
  "body" text NOT NULL,
  "cover_image" text NOT NULL,
  "category" text DEFAULT 'market' NOT NULL,
  "author" text DEFAULT 'Reeskova' NOT NULL,
  "pdf_url" text,
  "status" text DEFAULT 'published' NOT NULL,
  "published_at" timestamp DEFAULT now() NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "magazine_status_idx" ON "magazine" ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "magazine_published_idx" ON "magazine" ("published_at");
