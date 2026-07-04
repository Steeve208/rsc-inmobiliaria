-- =============================================================================
-- Supabase Storage — bucket listing-media (fotos, vídeos, plantas)
-- Ejecutar en SQL Editor después de schema.sql
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-media',
  'listing-media',
  true,
  104857600,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Lectura pública (URLs getPublicUrl)
DO $$ BEGIN
  CREATE POLICY "public_read_listing_media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'listing-media');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Escritura vía service_role (API de empresa). El rol service bypass RLS;
-- esta política documenta el intento para proyectos con RLS estricto en storage.
DO $$ BEGIN
  CREATE POLICY "service_write_listing_media"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'listing-media');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "service_update_listing_media"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'listing-media');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "service_delete_listing_media"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'listing-media');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
