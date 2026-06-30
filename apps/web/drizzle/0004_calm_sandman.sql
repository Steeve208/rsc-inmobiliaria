CREATE TABLE "agent" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"name" text NOT NULL,
	"role" text,
	"creci" text,
	"phone" text,
	"photo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorite" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"listing_kind" text NOT NULL,
	"listing_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "favorite_unique" UNIQUE("user_id","listing_kind","listing_id")
);
--> statement-breakpoint
CREATE TABLE "listing_image" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_kind" text NOT NULL,
	"listing_id" text NOT NULL,
	"url" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_listing" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text,
	"agent_id" text,
	"title" text NOT NULL,
	"type" text DEFAULT 'house' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"transaction" text DEFAULT 'buy' NOT NULL,
	"condition" text,
	"price" numeric(14, 2) NOT NULL,
	"currency" text DEFAULT 'BRL' NOT NULL,
	"country" text NOT NULL,
	"state" text,
	"city" text NOT NULL,
	"neighborhood" text,
	"address" text,
	"lat" numeric(10, 7),
	"lng" numeric(10, 7),
	"bedrooms" integer DEFAULT 0 NOT NULL,
	"bathrooms" integer DEFAULT 0 NOT NULL,
	"suites" integer DEFAULT 0 NOT NULL,
	"garage" integer DEFAULT 0 NOT NULL,
	"living_rooms" integer DEFAULT 0 NOT NULL,
	"kitchen" integer DEFAULT 0 NOT NULL,
	"laundry" integer DEFAULT 0 NOT NULL,
	"pool" boolean DEFAULT false NOT NULL,
	"area" numeric(12, 2) DEFAULT '0' NOT NULL,
	"land_area" numeric(12, 2),
	"heating" text,
	"year_built" integer,
	"condo_fee" numeric(12, 2),
	"iptu" numeric(12, 2),
	"financing" boolean DEFAULT false NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"premium" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"launch" boolean DEFAULT false NOT NULL,
	"whatsapp_number" text,
	"cover_image" text,
	"description" text,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_listing" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text,
	"agent_id" text,
	"title" text NOT NULL,
	"type" text DEFAULT 'car' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"condition" text,
	"make" text NOT NULL,
	"model" text NOT NULL,
	"year" integer NOT NULL,
	"mileage" integer DEFAULT 0 NOT NULL,
	"fuel" text,
	"transmission" text,
	"color" text,
	"engine" text,
	"drive" text,
	"doors" integer,
	"consumption" text,
	"warranty" text,
	"price" numeric(14, 2) NOT NULL,
	"currency" text DEFAULT 'BRL' NOT NULL,
	"country" text NOT NULL,
	"state" text,
	"city" text NOT NULL,
	"address" text,
	"lat" numeric(10, 7),
	"lng" numeric(10, 7),
	"cover_image" text,
	"video_url" text,
	"has_360" boolean DEFAULT false NOT NULL,
	"history" text[] DEFAULT '{}' NOT NULL,
	"equipment" text[] DEFAULT '{}' NOT NULL,
	"specs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"description" text,
	"financing" boolean DEFAULT false NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"premium" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"whatsapp_number" text,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agent" ADD CONSTRAINT "agent_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_listing" ADD CONSTRAINT "property_listing_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_listing" ADD CONSTRAINT "property_listing_agent_id_agent_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agent"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_listing" ADD CONSTRAINT "vehicle_listing_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_listing" ADD CONSTRAINT "vehicle_listing_agent_id_agent_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agent"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "agent_company_idx" ON "agent" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "favorite_user_idx" ON "favorite" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "listing_image_ref_idx" ON "listing_image" USING btree ("listing_kind","listing_id");--> statement-breakpoint
CREATE INDEX "property_company_idx" ON "property_listing" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "property_status_idx" ON "property_listing" USING btree ("status");--> statement-breakpoint
CREATE INDEX "property_location_idx" ON "property_listing" USING btree ("country","state","city");--> statement-breakpoint
CREATE INDEX "vehicle_company_idx" ON "vehicle_listing" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "vehicle_status_idx" ON "vehicle_listing" USING btree ("status");--> statement-breakpoint
CREATE INDEX "vehicle_make_idx" ON "vehicle_listing" USING btree ("make","model");