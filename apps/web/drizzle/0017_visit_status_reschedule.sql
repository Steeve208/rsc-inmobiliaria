-- Allow company-proposed reschedule status used by market + backoffice
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
