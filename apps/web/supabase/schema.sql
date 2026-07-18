-- =============================================================================
-- RSC Market — Esquema completo de PostgreSQL para Supabase
-- =============================================================================
-- Ejecuta este archivo en: Supabase Dashboard -> SQL Editor -> New query
-- (o con `psql "$DATABASE_URL" -f schema.sql`)
--
-- Cubre:
--   1. Extensiones
--   2. Tipos ENUM del dominio
--   3. Tablas de autenticación (Better Auth: user/session/account/verification)
--   4. Empresas y agentes (imobiliárias / concesionarias / construtoras)
--   5. Listados de imóveis (property_listings)
--   6. Listados de veículos (vehicle_listings)
--   7. Imágenes de listados (listing_images)
--   8. Leads: configuración WhatsApp, visitas agendadas, chats y mensajes
--   9. Favoritos
--  10. Triggers de updated_at
--  11. Row Level Security (RLS)
--
-- Notas Supabase:
--   * Esta web de USUARIO conecta por DATABASE_URL (Drizzle + Better Auth).
--   * Tu WEB ADMIN (otro proyecto) conecta por la API de Supabase (supabase-js):
--       - URL: https://TU_PROJECT.supabase.co
--       - service_role key (solo servidor del admin) → CRUD total, bypassa RLS
--       - publishable key (sb_publishable_...) → solo lectura pública con RLS
--   * Ver supabase/admin-client.example.ts para ejemplos en el admin.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Extensiones
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()

-- -----------------------------------------------------------------------------
-- 2. Tipos ENUM
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE company_type AS ENUM ('real_estate', 'dealership', 'builder');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE listing_kind AS ENUM ('property', 'vehicle');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE listing_status AS ENUM ('draft', 'active', 'sold', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE property_type AS ENUM (
    'house', 'apartment', 'land', 'commercial', 'condo', 'beach', 'countryside'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE transaction_type AS ENUM ('buy', 'rent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE condition_type AS ENUM ('new', 'used');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE vehicle_type AS ENUM (
    'car', 'suv', 'sports', 'van', 'truck',
    'motorcycle', 'machinery', 'electric', 'hybrid'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE fuel_type AS ENUM ('gasoline', 'diesel', 'electric', 'hybrid', 'flex');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE transmission_type AS ENUM ('manual', 'automatic', 'cvt');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE drive_type AS ENUM ('fwd', 'rwd', 'awd', '4x4');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE visit_status AS ENUM (
    'pending', 'confirmed', 'cancelled', 'reschedule_proposed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Bases ya creadas sin el valor nuevo: ampliar el enum de forma idempotente
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typname = 'visit_status'
      AND e.enumlabel = 'reschedule_proposed'
  ) THEN
    ALTER TYPE visit_status ADD VALUE 'reschedule_proposed';
  END IF;
END $$;

DO $$ BEGIN
  CREATE TYPE chat_sender AS ENUM ('buyer', 'company');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE market_id AS ENUM ('br', 'pt', 'us', 'es', 'fr', 'ar');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- -----------------------------------------------------------------------------
-- 3. Better Auth — tablas de autenticación
--    (idénticas a la migración Drizzle drizzle/0000_natural_thundra.sql)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "user" (
  "id"             text PRIMARY KEY NOT NULL,
  "name"           text NOT NULL,
  "email"          text NOT NULL,
  "email_verified" boolean DEFAULT false NOT NULL,
  "image"          text,
  -- Rol de la cuenta: 'user' | 'company' | 'admin'. Declarado como additionalField
  -- en Better Auth (lib/auth.ts). Coincide con la columna text del esquema Drizzle.
  "role"           text DEFAULT 'user' NOT NULL,
  "phone"          text,
  "created_at"     timestamp DEFAULT now() NOT NULL,
  "updated_at"     timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "user_email_unique" UNIQUE ("email")
);

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "phone" text;

CREATE TABLE IF NOT EXISTS "session" (
  "id"         text PRIMARY KEY NOT NULL,
  "expires_at" timestamp NOT NULL,
  "token"      text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "ip_address" text,
  "user_agent" text,
  "user_id"    text NOT NULL,
  CONSTRAINT "session_token_unique" UNIQUE ("token"),
  CONSTRAINT "session_user_id_user_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
  "id"                       text PRIMARY KEY NOT NULL,
  "account_id"               text NOT NULL,
  "provider_id"              text NOT NULL,
  "user_id"                  text NOT NULL,
  "access_token"             text,
  "refresh_token"            text,
  "id_token"                 text,
  "access_token_expires_at"  timestamp,
  "refresh_token_expires_at" timestamp,
  "scope"                    text,
  "password"                 text,
  "created_at"               timestamp DEFAULT now() NOT NULL,
  "updated_at"               timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "account_user_id_user_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id"         text PRIMARY KEY NOT NULL,
  "identifier" text NOT NULL,
  "value"      text NOT NULL,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "account_userId_idx"          ON "account" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "session_userId_idx"          ON "session" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" USING btree ("identifier");

-- -----------------------------------------------------------------------------
-- 4. Empresas y agentes
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "company" (
  "id"              text PRIMARY KEY NOT NULL,          -- slug, ej. "rsc-imoveis-premium"
  "owner_user_id"   text REFERENCES "user"("id") ON DELETE SET NULL,
  "name"            text NOT NULL,
  "type"            company_type NOT NULL DEFAULT 'real_estate',
  "cnpj"            text,
  "email"           text,
  "phone"           text,
  "whatsapp_number" text,
  "logo_url"        text,
  "market_id"       market_id NOT NULL DEFAULT 'br',
  "verified"        boolean NOT NULL DEFAULT false,
  -- métricas mostradas en la ficha de la empresa
  "rating"          numeric(2,1) NOT NULL DEFAULT 0,
  "years_active"    integer NOT NULL DEFAULT 0,
  "active_listings" integer NOT NULL DEFAULT 0,
  "sold_count"      integer NOT NULL DEFAULT 0,
  "reviews_count"   integer NOT NULL DEFAULT 0,
  "created_at"      timestamp NOT NULL DEFAULT now(),
  "updated_at"      timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "company_owner_idx" ON "company" ("owner_user_id");

CREATE TABLE IF NOT EXISTS "agent" (
  "id"         text PRIMARY KEY NOT NULL,
  "company_id" text NOT NULL REFERENCES "company"("id") ON DELETE CASCADE,
  "name"       text NOT NULL,
  "role"       text,
  "creci"      text,          -- registro do corretor (imóveis)
  "phone"      text,
  "photo_url"  text,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "agent_company_idx" ON "agent" ("company_id");

-- -----------------------------------------------------------------------------
-- 5. Listados de imóveis
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "property_listing" (
  "id"             text PRIMARY KEY NOT NULL,
  "company_id"     text REFERENCES "company"("id") ON DELETE SET NULL,
  "agent_id"       text REFERENCES "agent"("id") ON DELETE SET NULL,
  "title"          text NOT NULL,
  "type"           property_type NOT NULL DEFAULT 'house',
  "status"         listing_status NOT NULL DEFAULT 'active',
  "transaction"    transaction_type NOT NULL DEFAULT 'buy',
  "condition"      condition_type,
  "price"          numeric(14,2) NOT NULL,
  "currency"       text NOT NULL DEFAULT 'BRL',
  -- ubicación
  "country"        text NOT NULL,
  "state"          text,
  "city"           text NOT NULL,
  "neighborhood"   text,
  "address"        text,
  "lat"            double precision,
  "lng"            double precision,
  -- atributos
  "bedrooms"       integer NOT NULL DEFAULT 0,
  "bathrooms"      integer NOT NULL DEFAULT 0,
  "suites"         integer NOT NULL DEFAULT 0,
  "garage"         integer NOT NULL DEFAULT 0,
  "living_rooms"   integer NOT NULL DEFAULT 0,
  "kitchen"        integer NOT NULL DEFAULT 0,
  "laundry"        integer NOT NULL DEFAULT 0,
  "pool"           boolean NOT NULL DEFAULT false,
  "area"           numeric(12,2) NOT NULL DEFAULT 0,   -- área útil m²
  "land_area"      numeric(12,2),                      -- área do terreno m²
  "heating"        text,
  "year_built"     integer,
  "condo_fee"      numeric(12,2),
  "iptu"           numeric(12,2),
  -- flags / comercial
  "financing"      boolean NOT NULL DEFAULT false,
  "verified"       boolean NOT NULL DEFAULT false,
  "premium"        boolean NOT NULL DEFAULT false,
  "featured"       boolean NOT NULL DEFAULT false,
  "launch"         boolean NOT NULL DEFAULT false,
  "whatsapp_number" text,
  "cover_image"    text,
  "video_url"      text,
  "virtual_tour_url" text,
  "floor_plan_url" text,
  "description"    text,
  "published_at"   timestamp,
  "created_at"     timestamp NOT NULL DEFAULT now(),
  "updated_at"     timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "property_company_idx"  ON "property_listing" ("company_id");
CREATE INDEX IF NOT EXISTS "property_status_idx"   ON "property_listing" ("status");
CREATE INDEX IF NOT EXISTS "property_location_idx" ON "property_listing" ("country", "state", "city");
CREATE INDEX IF NOT EXISTS "property_price_idx"    ON "property_listing" ("price");
CREATE INDEX IF NOT EXISTS "property_type_idx"     ON "property_listing" ("type");

-- -----------------------------------------------------------------------------
-- 6. Listados de veículos
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "vehicle_listing" (
  "id"           text PRIMARY KEY NOT NULL,
  "company_id"   text REFERENCES "company"("id") ON DELETE SET NULL,
  "agent_id"     text REFERENCES "agent"("id") ON DELETE SET NULL,
  "title"        text NOT NULL,
  "type"         vehicle_type NOT NULL DEFAULT 'car',
  "status"       listing_status NOT NULL DEFAULT 'active',
  "condition"    condition_type,
  "make"         text NOT NULL,
  "model"        text NOT NULL,
  "year"         integer NOT NULL,
  "mileage"      integer NOT NULL DEFAULT 0,
  "fuel"         fuel_type,
  "transmission" transmission_type,
  "color"        text,
  "engine"       text,
  "drive"        drive_type,
  "doors"        integer,
  "consumption"  text,
  "warranty"     text,
  "price"        numeric(14,2) NOT NULL,
  "currency"     text NOT NULL DEFAULT 'BRL',
  -- ubicación
  "country"      text NOT NULL,
  "state"        text,
  "city"         text NOT NULL,
  "address"      text,
  "lat"          double precision,
  "lng"          double precision,
  -- multimedia / extras
  "cover_image"  text,
  "video_url"    text,
  "has_360"      boolean NOT NULL DEFAULT false,
  "tour360_url"  text,
  "history"      text[] NOT NULL DEFAULT '{}',
  "equipment"    text[] NOT NULL DEFAULT '{}',
  "specs"        jsonb NOT NULL DEFAULT '{}'::jsonb,
  "description"  text,
  -- flags / comercial
  "financing"    boolean NOT NULL DEFAULT false,
  "verified"     boolean NOT NULL DEFAULT false,
  "premium"      boolean NOT NULL DEFAULT false,
  "featured"     boolean NOT NULL DEFAULT false,
  "whatsapp_number" text,
  "published_at" timestamp,
  "created_at"   timestamp NOT NULL DEFAULT now(),
  "updated_at"   timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "vehicle_company_idx"  ON "vehicle_listing" ("company_id");
CREATE INDEX IF NOT EXISTS "vehicle_status_idx"   ON "vehicle_listing" ("status");
CREATE INDEX IF NOT EXISTS "vehicle_make_idx"     ON "vehicle_listing" ("make", "model");
CREATE INDEX IF NOT EXISTS "vehicle_price_idx"    ON "vehicle_listing" ("price");
CREATE INDEX IF NOT EXISTS "vehicle_year_idx"     ON "vehicle_listing" ("year");
CREATE INDEX IF NOT EXISTS "vehicle_type_idx"     ON "vehicle_listing" ("type");

-- -----------------------------------------------------------------------------
-- 7. Imágenes de listados (galería)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "listing_image" (
  "id"           text PRIMARY KEY NOT NULL,
  "listing_kind" listing_kind NOT NULL,
  "listing_id"   text NOT NULL,         -- referencia lógica a property_listing/vehicle_listing
  "url"          text NOT NULL,
  "position"     integer NOT NULL DEFAULT 0,
  "created_at"   timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "listing_image_ref_idx"
  ON "listing_image" ("listing_kind", "listing_id");

-- -----------------------------------------------------------------------------
-- 8. Leads — config WhatsApp, visitas, chats y mensajes
--    (reemplaza el almacenamiento en .data/leads-store.json)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "company_lead_config" (
  "company_id"      text PRIMARY KEY NOT NULL,
  "company_name"    text NOT NULL,
  "whatsapp_number" text NOT NULL,
  "updated_at"      timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "scheduled_visit" (
  "id"               text PRIMARY KEY NOT NULL,   -- ej. "visit_<ts>_<rand>"
  "listing_id"       text NOT NULL,
  "listing_title"    text NOT NULL,
  "listing_category" text NOT NULL,               -- 'properties' | 'vehicles' (valor de la API)
  "company_id"       text NOT NULL,
  "company_name"     text NOT NULL,
  "buyer_id"         text NOT NULL,               -- user.id o id anónimo del cliente
  "buyer_name"       text NOT NULL,
  "buyer_phone"      text NOT NULL,
  "buyer_email"      text,
  "preferred_date"   text NOT NULL,
  "preferred_time"   text NOT NULL,
  "notes"            text,
  "status"           visit_status NOT NULL DEFAULT 'pending',
  "company_message"  text,                       -- respuesta de la empresa
  "proposed_date"    text,                       -- nueva fecha propuesta
  "proposed_time"    text,                       -- nueva hora propuesta
  "created_at"       timestamp NOT NULL DEFAULT now()
);

ALTER TABLE "scheduled_visit" ADD COLUMN IF NOT EXISTS "company_message" text;
ALTER TABLE "scheduled_visit" ADD COLUMN IF NOT EXISTS "proposed_date" text;
ALTER TABLE "scheduled_visit" ADD COLUMN IF NOT EXISTS "proposed_time" text;

CREATE INDEX IF NOT EXISTS "visit_buyer_idx"   ON "scheduled_visit" ("buyer_id");
CREATE INDEX IF NOT EXISTS "visit_company_idx" ON "scheduled_visit" ("company_id");
CREATE INDEX IF NOT EXISTS "visit_listing_idx" ON "scheduled_visit" ("listing_id");

CREATE TABLE IF NOT EXISTS "chat_thread" (
  "id"               text PRIMARY KEY NOT NULL,   -- ej. "chat_<ts>_<rand>"
  "listing_id"       text NOT NULL,
  "listing_title"    text NOT NULL,
  "listing_category" text NOT NULL,               -- 'properties' | 'vehicles' (valor de la API)
  "company_id"       text NOT NULL,
  "company_name"     text NOT NULL,
  "buyer_id"         text NOT NULL,
  "buyer_name"       text NOT NULL,
  "created_at"       timestamp NOT NULL DEFAULT now(),
  "updated_at"       timestamp NOT NULL DEFAULT now(),
  -- un hilo por par (listing_id, buyer_id), como hace store.ts
  CONSTRAINT "chat_thread_listing_buyer_unique" UNIQUE ("listing_id", "buyer_id")
);

CREATE INDEX IF NOT EXISTS "chat_thread_buyer_idx"   ON "chat_thread" ("buyer_id");
CREATE INDEX IF NOT EXISTS "chat_thread_company_idx" ON "chat_thread" ("company_id");

CREATE TABLE IF NOT EXISTS "chat_message" (
  "id"         text PRIMARY KEY NOT NULL,   -- ej. "msg_<ts>_<rand>"
  "thread_id"  text NOT NULL REFERENCES "chat_thread"("id") ON DELETE CASCADE,
  "sender"     chat_sender NOT NULL,
  "text"       text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "chat_message_thread_idx" ON "chat_message" ("thread_id", "created_at");

-- -----------------------------------------------------------------------------
-- 9. Favoritos (wishlist) — listado guardado por usuario
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "favorite" (
  "id"           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"      text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "listing_kind" listing_kind NOT NULL,
  "listing_id"   text NOT NULL,
  "created_at"   timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "favorite_unique" UNIQUE ("user_id", "listing_kind", "listing_id")
);

CREATE INDEX IF NOT EXISTS "favorite_user_idx" ON "favorite" ("user_id");

-- -----------------------------------------------------------------------------
-- 9b. Solicitudes de financiación (RSC Credit)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "financing_request" (
  "id" text PRIMARY KEY NOT NULL,
  "buyer_id" text NOT NULL,
  "buyer_name" text,
  "buyer_email" text,
  "buyer_phone" text,
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
  "notes" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "financing_request_buyer_idx"
  ON "financing_request" ("buyer_id");
CREATE INDEX IF NOT EXISTS "financing_request_status_idx"
  ON "financing_request" ("status");
CREATE INDEX IF NOT EXISTS "financing_request_created_idx"
  ON "financing_request" ("created_at");

-- -----------------------------------------------------------------------------
-- 9c. Comparador de imóveis por usuario
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "property_compare" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "listing_id" text NOT NULL,
  "position" integer NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "property_compare_unique" UNIQUE ("user_id", "listing_id")
);

CREATE INDEX IF NOT EXISTS "property_compare_user_idx"
  ON "property_compare" ("user_id");

-- -----------------------------------------------------------------------------
-- 9c2. Comparador de veículos por usuario
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "vehicle_compare" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "listing_id" text NOT NULL,
  "position" integer NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "vehicle_compare_unique" UNIQUE ("user_id", "listing_id")
);

CREATE INDEX IF NOT EXISTS "vehicle_compare_user_idx"
  ON "vehicle_compare" ("user_id");

-- -----------------------------------------------------------------------------
-- 9d. Búsquedas guardadas por usuario (alertas email futuras)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "saved_search" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "vertical" text DEFAULT 'property' NOT NULL,
  "label" text NOT NULL,
  "filters" jsonb NOT NULL,
  "alerts_enabled" boolean DEFAULT false NOT NULL,
  "alert_frequency" text DEFAULT 'daily' NOT NULL,
  "alert_locale" text DEFAULT 'pt' NOT NULL,
  "last_alert_at" timestamp,
  "notified_listing_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "cron_job_run" (
  "job_name" text PRIMARY KEY NOT NULL,
  "last_run_at" timestamp NOT NULL,
  "last_status" text NOT NULL,
  "last_summary" jsonb,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "saved_search_user_idx"
  ON "saved_search" ("user_id");
CREATE INDEX IF NOT EXISTS "saved_search_vertical_idx"
  ON "saved_search" ("vertical", "user_id");
CREATE INDEX IF NOT EXISTS "saved_search_alerts_idx"
  ON "saved_search" ("alerts_enabled", "alert_frequency");

-- -----------------------------------------------------------------------------
-- 9e. Denuncias de anuncios (moderación)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "listing_report" (
  "id" text PRIMARY KEY NOT NULL,
  "listing_id" text NOT NULL,
  "listing_title" text NOT NULL,
  "listing_kind" text NOT NULL,
  "reason" text NOT NULL,
  "reporter_email" text,
  "reporter_user_id" text REFERENCES "user"("id") ON DELETE SET NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "admin_notes" text,
  "reviewed_by" text REFERENCES "user"("id") ON DELETE SET NULL,
  "reviewed_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "listing_report_status_idx"
  ON "listing_report" ("status");
CREATE INDEX IF NOT EXISTS "listing_report_listing_idx"
  ON "listing_report" ("listing_kind", "listing_id");
CREATE INDEX IF NOT EXISTS "listing_report_created_idx"
  ON "listing_report" ("created_at");

-- -----------------------------------------------------------------------------
-- 10. Trigger de updated_at para tablas del dominio
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'company', 'property_listing', 'vehicle_listing',
    'company_lead_config', 'chat_thread', 'financing_request', 'saved_search',
    'listing_report'
  ] LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON %I;
       CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t, t);
  END LOOP;
END $$;

-- -----------------------------------------------------------------------------
-- 10.b (removed) Fake WhatsApp company configs — companies set WhatsApp in backoffice
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- 11. Row Level Security (RLS)
-- -----------------------------------------------------------------------------
-- El backend escribe con la conexión de servicio (DATABASE_URL), que bypassa
-- RLS. Estas políticas solo afectan el acceso público vía PostgREST/anon key.
-- Lectura pública de catálogo; el resto queda cerrado al rol anónimo.

-- Catálogo público (solo lectura)
ALTER TABLE "company"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "agent"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "property_listing" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vehicle_listing"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "listing_image"    ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "public_read_company"  ON "company"          FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "public_read_agent"    ON "agent"            FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "public_read_property" ON "property_listing" FOR SELECT USING (status = 'active');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "public_read_vehicle"  ON "vehicle_listing"  FOR SELECT USING (status = 'active');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "public_read_image"    ON "listing_image"    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Datos sensibles: RLS activado SIN políticas públicas (solo backend de servicio).
ALTER TABLE "user"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verification"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "company_lead_config" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "scheduled_visit"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "chat_thread"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "chat_message"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "favorite"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "listing_report"      ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- FIN DEL ESQUEMA
-- =============================================================================


-- API rate limits (shared across serverless; one UPSERT per check)
CREATE TABLE IF NOT EXISTS "api_rate_limit" (
  "key" text PRIMARY KEY NOT NULL,
  "count" integer DEFAULT 1 NOT NULL,
  "reset_at" timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS "api_rate_limit_reset_idx" ON "api_rate_limit" ("reset_at");
ALTER TABLE "api_rate_limit" ENABLE ROW LEVEL SECURITY;

-- Platform reviews shown on landing testimonials
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
CREATE UNIQUE INDEX IF NOT EXISTS "platform_review_user_uidx" ON "platform_review" ("user_id");
CREATE INDEX IF NOT EXISTS "platform_review_status_idx" ON "platform_review" ("status");
CREATE INDEX IF NOT EXISTS "platform_review_created_idx" ON "platform_review" ("created_at");
