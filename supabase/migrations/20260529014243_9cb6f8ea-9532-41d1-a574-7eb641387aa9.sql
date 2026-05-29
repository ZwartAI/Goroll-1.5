-- Add combat_log_detail_mode to combat_encounters
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'combat_encounters' AND column_name = 'combat_log_detail_mode'
  ) THEN
    ALTER TABLE public.combat_encounters ADD COLUMN combat_log_detail_mode TEXT NOT NULL DEFAULT 'normal';
    -- Add constraint to ensure valid values
    ALTER TABLE public.combat_encounters ADD CONSTRAINT combat_log_detail_mode_check 
      CHECK (combat_log_detail_mode IN ('minimal', 'normal', 'detailed', 'dm_private'));
  END IF;
END $$;

-- Ensure grants are correct (tables already exist, but good practice to refresh for new column)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.combat_encounters TO authenticated;
GRANT ALL ON public.combat_encounters TO service_role;
GRANT SELECT ON public.combat_encounters TO anon;
