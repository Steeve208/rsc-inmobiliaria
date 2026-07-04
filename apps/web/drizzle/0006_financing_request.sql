CREATE TABLE IF NOT EXISTS "financing_request" (
  "id" text PRIMARY KEY NOT NULL,
  "buyer_id" text NOT NULL,
  "buyer_name" text,
  "buyer_email" text,
  "listing_id" text,
  "listing_title" text,
  "listing_category" text,
  "property_value" numeric(14, 2) NOT NULL,
  "down_payment_pct" numeric(5, 2) NOT NULL,
  "down_payment_amount" numeric(14, 2) NOT NULL,
  "term_months" integer NOT NULL,
  "interest_rate" numeric(6, 3) NOT NULL,
  "estimated_installment" numeric(14, 2) NOT NULL,
  "currency" text DEFAULT 'BRL' NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "financing_request_buyer_idx"
  ON "financing_request" ("buyer_id");
CREATE INDEX IF NOT EXISTS "financing_request_status_idx"
  ON "financing_request" ("status");
CREATE INDEX IF NOT EXISTS "financing_request_created_idx"
  ON "financing_request" ("created_at");
