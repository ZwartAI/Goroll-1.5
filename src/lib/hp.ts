import { supabase } from "@/integrations/supabase/client";
import { totals, type Character, type Item } from "./game";

/**
 * Recomputes max HP for a character based on currently equipped items
 * and clamps current_hp so it never exceeds the new max.
 * Call this after any item change that may reduce a character's max HP
 * (unequip, transfer, discard, reclaim, etc.).
 */
export async function clampHpForOwner(ownerId: string | null | undefined) {
  if (!ownerId) return;
  const [chRes, itRes] = await Promise.all([
    supabase.from("characters").select("*").eq("id", ownerId).maybeSingle(),
    supabase.from("items").select("*").eq("owner_character_id", ownerId).eq("equipped", true),
  ]);
  const ch = chRes.data as Character | null;
  if (!ch) return;
  const max = totals(ch, (itRes.data || []) as Item[]).maxHp;
  if (ch.current_hp > max) {
    await supabase.from("characters").update({ current_hp: max }).eq("id", ownerId);
  }
}
