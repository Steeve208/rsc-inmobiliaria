alter table public.scheduled_visit
  add column if not exists company_message text,
  add column if not exists proposed_date text,
  add column if not exists proposed_time text;
