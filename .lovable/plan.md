# Fase 2 — Enemigos temporales en combate

Extiende la Fase 1 sin tocar su flujo. Los enemigos viven solo dentro del encounter activo y se integran a la lista de turnos existente.

## 1. Base de datos (migración)

Extender `combat_participants` (mantiene compatibilidad con la lista de turnos actual):

- `enemy_name` text null
- `enemy_icon` text null  (clave de icono, ej `wolf`, `skull`)
- `enemy_color` text null
- `enemy_hp` int null
- `enemy_max_hp` int null
- `enemy_defense` int null default 0
- `enemy_speed` text null
- `enemy_notes` text null
- `enemy_instance_number` int null
- `enemy_template_id` uuid null  (reservado, no se usa todavía)
- `is_enemy_visible` boolean default true
- `is_defeated` boolean default false

`character_id` pasa a ser nullable (los enemigos no tienen character). RLS ya es pública.

Añadir `round_number int default 1` a `combat_encounters`.

## 2. Tipos y lógica (`src/lib/combat.ts`)

- Actualizar `CombatParticipant` con los nuevos campos opcionales.
- `buildOrderedTurns` ya ordena por `initiative`+`order_index`; añadir bloque `kind: "enemy"` (solo participantes con `participant_type === 'enemy'` van como bloque enemigo individual; no se agrupan en enlaces).
- Nuevas acciones:
  - `addEnemies(encounter, payload, count, position)` — inserta `count` filas con `enemy_instance_number` autoincremental, `order_index` calculado según `position` ('byInitiative' | 'afterCurrent' | 'end').
  - `updateEnemy(participantId, patch)`
  - `duplicateEnemy(participant)`
  - `removeEnemy(participantId)`
  - `applyEnemyDamage(participant, raw, { useDefense })` — `final = useDefense ? max(0, raw - def) : raw`; clamp 0..max_hp; si llega a 0 marca `is_defeated=true` y loguea derrota.
  - `healEnemy(participant, amount)` — clamp 0..max_hp.
  - `moveParticipant(encounter, participantId, direction|index)` — reasigna `order_index` y ajusta `current_turn_index` si afecta al turno activo.
- Avance de turno: incrementar `round_number` cuando el índice vuelve a 0.

## 3. UI DM (`CombatDMPanel`)

Añadir botón "Añadir enemigo" siempre que el encounter exista y no esté `ended`.

Nuevo modal `EnemyEditorModal` con:
- nombre, icono (grid de lucide: Skull, Sword, Shield, Eye, Flame, Bug, Crown, Ghost, PawPrint, Drama, Swords, Cloud), color preset (7 swatches), iniciativa (1–20), HP max, HP actual, defensa, velocidad, notas, cantidad (1–20), posición de inserción.

Lista DM: extender `CombatList` con prop `dmView` que renderiza bloque ampliado para enemigos:
- barra de HP (verde / amarillo / rojo según %), texto HP/MAX, DEF, VEL.
- Botones: −1, −5, +1, +5, Daño/Curar (abre `EnemyDamageModal` con toggle "Aplicar con defensa"), Editar, Duplicar, Eliminar.
- Si activo y es enemigo: botón "Pasar turno del enemigo".
- Si derrotado: opacidad 50% + badge "Derrotado".

Nuevo `EnemyDamageModal`: campos daño y curación, toggle "Usar defensa", muestra cálculo y "Daño aplicado: X después de DEF Y".

## 4. UI pública (`CombatList` para jugadores/espectadores)

Bloque enemigo público:
- Icono circular (lucide) con `enemy_color` como borde/glow.
- Nombre + nº instancia.
- Iniciativa.
- Badge "Enemigo".
- Si turno activo: badge "En turno".
- No mostrar HP/DEF/VEL/notas.

Botón "Pasar turno" del jugador se desactiva si el turno activo es enemigo.

## 5. CampaignProvider

Ya carga `participants`; al incluir enemigos en la misma tabla, no requiere consultas extra. Solo asegurar que el filtro no excluya `character_id IS NULL`.

## 6. Logs

Usar `pushLog` con segmentos. Solo loguear:
- Añadir enemigo(s).
- Derrota.
- Enemigo terminó turno.
- Eliminar / duplicar.
No loguear ajustes pequeños de HP.

## 7. i18n

Añadir claves en `combat.*` de `es.ts` y `en.ts`: `addEnemy`, `enemy`, `icon`, `maxHp`, `currentHp`, `defense`, `speed`, `damage`, `heal`, `applyDamage`, `applyWithDefense`, `duplicate`, `edit`, `remove`, `defeated`, `endEnemyTurn`, `round`, `damageApplied`, `count`, `insertPosition`, posiciones (`byInitiative`, `afterCurrent`, `atEnd`), `enemyAdded`, `enemyDefeated`, `enemyEndedTurn`.

## 8. Archivos

- Migración nueva.
- Editar: `src/lib/combat.ts`, `src/components/app/CombatList.tsx`, `src/components/app/CombatDMPanel.tsx`, `src/components/app/InitiativeButton.tsx` (desactivar pasar turno si activo es enemigo), `src/lib/CampaignProvider.tsx` (si hace falta), `src/lib/locales/{es,en}.ts`, `src/integrations/supabase/types.ts` (autogenerado tras migración).
- Crear: `src/components/app/EnemyEditorModal.tsx`, `src/components/app/EnemyDamageModal.tsx`, `src/components/app/EnemyIconPicker.tsx`.

## 9. Validaciones

Nombre no vacío, HPmax > 0, HPactual ≥ 0, DEF ≥ 0, iniciativa 1–20, cantidad 1–20, bloquear acciones si encounter `ended`.

## Fuera de alcance

Sin biblioteca permanente de monstruos, sin importación, sin skills enemigas, sin auto-daño desde skills de jugadores, sin drag&drop (botones subir/bajar/inicio/fin), sin drops.
