ALTER TABLE "chat_thread" ADD COLUMN IF NOT EXISTS "match_context" jsonb;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "match_scoring_config" (
  "id" text PRIMARY KEY NOT NULL,
  "weights" jsonb NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "match_scoring_config" ("id", "weights")
VALUES (
  'default',
  '{"budget":25,"location":25,"propertyType":15,"bedrooms":15,"size":10,"preferences":10}'::jsonb
)
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_conversation" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text REFERENCES "user"("id") ON DELETE SET NULL,
  "guest_id" text,
  "locale" text DEFAULT 'en' NOT NULL,
  "status" text DEFAULT 'gathering' NOT NULL,
  "source" text DEFAULT 'hero' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_conversation_user_idx" ON "ai_conversation" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_conversation_guest_idx" ON "ai_conversation" ("guest_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_conversation_status_idx" ON "ai_conversation" ("status");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "search_profile" (
  "id" text PRIMARY KEY NOT NULL,
  "conversation_id" text NOT NULL UNIQUE REFERENCES "ai_conversation"("id") ON DELETE CASCADE,
  "user_id" text REFERENCES "user"("id") ON DELETE SET NULL,
  "guest_id" text,
  "status" text DEFAULT 'draft' NOT NULL,
  "requirements" jsonb NOT NULL,
  "raw_intent" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_profile_user_idx" ON "search_profile" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_profile_guest_idx" ON "search_profile" ("guest_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_profile_status_idx" ON "search_profile" ("status");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "search_preference" (
  "id" text PRIMARY KEY NOT NULL,
  "profile_id" text NOT NULL REFERENCES "search_profile"("id") ON DELETE CASCADE,
  "kind" text NOT NULL,
  "type" text NOT NULL,
  "importance" text DEFAULT 'medium' NOT NULL,
  "value" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_preference_profile_idx" ON "search_preference" ("profile_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_preference_type_idx" ON "search_preference" ("type", "kind");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_message" (
  "id" text PRIMARY KEY NOT NULL,
  "conversation_id" text NOT NULL REFERENCES "ai_conversation"("id") ON DELETE CASCADE,
  "role" text NOT NULL,
  "content" text NOT NULL,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_message_conversation_idx" ON "ai_message" ("conversation_id", "created_at");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "property_match_score" (
  "id" text PRIMARY KEY NOT NULL,
  "conversation_id" text NOT NULL REFERENCES "ai_conversation"("id") ON DELETE CASCADE,
  "profile_id" text NOT NULL REFERENCES "search_profile"("id") ON DELETE CASCADE,
  "property_id" text NOT NULL,
  "total_score" integer NOT NULL,
  "opportunity_score" integer,
  "breakdown" jsonb NOT NULL,
  "reasons" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "property_match_score_unique" ON "property_match_score" ("conversation_id", "property_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "property_match_score_property_idx" ON "property_match_score" ("property_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "property_match_score_total_idx" ON "property_match_score" ("conversation_id", "total_score");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_property_event" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text REFERENCES "user"("id") ON DELETE SET NULL,
  "guest_id" text,
  "conversation_id" text REFERENCES "ai_conversation"("id") ON DELETE SET NULL,
  "property_id" text NOT NULL,
  "event_type" text NOT NULL,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_property_event_user_idx" ON "user_property_event" ("user_id", "property_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_property_event_guest_idx" ON "user_property_event" ("guest_id", "property_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_property_event_type_idx" ON "user_property_event" ("event_type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_property_event_conversation_idx" ON "user_property_event" ("conversation_id");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_usage" (
  "id" text PRIMARY KEY NOT NULL,
  "conversation_id" text REFERENCES "ai_conversation"("id") ON DELETE SET NULL,
  "provider" text NOT NULL,
  "model" text,
  "operation" text NOT NULL,
  "input_tokens" integer,
  "output_tokens" integer,
  "latency_ms" integer,
  "success" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_usage_conversation_idx" ON "ai_usage" ("conversation_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_usage_created_idx" ON "ai_usage" ("created_at");
