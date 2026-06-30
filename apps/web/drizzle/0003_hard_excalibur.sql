CREATE TABLE "company" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_user_id" text,
	"name" text NOT NULL,
	"type" text DEFAULT 'real_estate' NOT NULL,
	"cnpj" text,
	"email" text,
	"phone" text,
	"whatsapp_number" text,
	"logo_url" text,
	"market_id" text DEFAULT 'br' NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"rating" numeric(2, 1) DEFAULT '0' NOT NULL,
	"years_active" integer DEFAULT 0 NOT NULL,
	"active_listings" integer DEFAULT 0 NOT NULL,
	"sold_count" integer DEFAULT 0 NOT NULL,
	"reviews_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "company" ADD CONSTRAINT "company_owner_user_id_user_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "company_owner_idx" ON "company" USING btree ("owner_user_id");