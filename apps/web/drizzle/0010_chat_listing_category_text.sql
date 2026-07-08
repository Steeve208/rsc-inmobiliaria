-- Fix chat tables: listing_category must store API values ('properties' | 'vehicles')

alter table if exists public.chat_thread
  alter column listing_category type text using listing_category::text;

alter table if exists public.scheduled_visit
  alter column listing_category type text using listing_category::text;
