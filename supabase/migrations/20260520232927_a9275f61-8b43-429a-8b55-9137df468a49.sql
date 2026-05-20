ALTER TABLE public.combat_participants
  ALTER COLUMN character_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS enemy_name text,
  ADD COLUMN IF NOT EXISTS enemy_icon text,
  ADD COLUMN IF NOT EXISTS enemy_color text,
  ADD COLUMN IF NOT EXISTS enemy_hp integer,
  ADD COLUMN IF NOT EXISTS enemy_max_hp integer,
  ADD COLUMN IF NOT EXISTS enemy_defense integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS enemy_speed text,
  ADD COLUMN IF NOT EXISTS enemy_notes text,
  ADD COLUMN IF NOT EXISTS enemy_instance_number integer,
  ADD COLUMN IF NOT EXISTS enemy_template_id uuid,
  ADD COLUMN IF NOT EXISTS is_enemy_visible boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_defeated boolean NOT NULL DEFAULT false;

ALTER TABLE public.combat_encounters
  ADD COLUMN IF NOT EXISTS round_number integer NOT NULL DEFAULT 1;