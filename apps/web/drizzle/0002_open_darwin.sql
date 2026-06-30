CREATE TABLE "chat_message" (
	"id" text PRIMARY KEY NOT NULL,
	"thread_id" text NOT NULL,
	"sender" text NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_thread" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"listing_title" text NOT NULL,
	"listing_category" text NOT NULL,
	"company_id" text NOT NULL,
	"company_name" text NOT NULL,
	"buyer_id" text NOT NULL,
	"buyer_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat_thread_listing_buyer_unique" UNIQUE("listing_id","buyer_id")
);
--> statement-breakpoint
CREATE TABLE "company_lead_config" (
	"company_id" text PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"whatsapp_number" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduled_visit" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"listing_title" text NOT NULL,
	"listing_category" text NOT NULL,
	"company_id" text NOT NULL,
	"company_name" text NOT NULL,
	"buyer_id" text NOT NULL,
	"buyer_name" text NOT NULL,
	"buyer_phone" text NOT NULL,
	"buyer_email" text,
	"preferred_date" text NOT NULL,
	"preferred_time" text NOT NULL,
	"notes" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_thread_id_chat_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."chat_thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_message_thread_idx" ON "chat_message" USING btree ("thread_id","created_at");--> statement-breakpoint
CREATE INDEX "chat_thread_buyer_idx" ON "chat_thread" USING btree ("buyer_id");--> statement-breakpoint
CREATE INDEX "chat_thread_company_idx" ON "chat_thread" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "visit_buyer_idx" ON "scheduled_visit" USING btree ("buyer_id");--> statement-breakpoint
CREATE INDEX "visit_company_idx" ON "scheduled_visit" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "visit_listing_idx" ON "scheduled_visit" USING btree ("listing_id");