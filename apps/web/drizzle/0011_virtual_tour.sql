ALTER TABLE "property_listing" ADD COLUMN IF NOT EXISTS "virtual_tour_url" text;
ALTER TABLE "vehicle_listing" ADD COLUMN IF NOT EXISTS "tour360_url" text;
