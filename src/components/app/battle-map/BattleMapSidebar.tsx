import React from 'react';
import { useT } from '@/lib/i18n';
import type { CombatParticipant } from '@/lib/combat';
import { EnemyIcon, getEnemyCustomImage, getEnemyAssetUrl } from '@/components/app/EnemyIconPicker';

interface Props {
  participants: CombatParticipant[];
  isOpen: boolean;
  onOpenChar?: (id: string) => void;
}

export const BattleMapSidebar: React.FC<Props> = ({ participants, isOpen, onOpenChar }) => {
  const { t } = useT();

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-[#0a0a0c]/95 border-r border-border/50 h-full flex flex-col z-20 absolute left-0 top-0 pt-14 backdrop-blur-md shadow-2xl transition-all">
      <div className="p-4 border-b border-border/30">
        <h2 className="font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {t('battleMap.participants')}
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {participants.map((p) => {
          const color = p.enemy_color || p.color || "var(--gold)";
          const customImg = getEnemyCustomImage(p);
          const isTierAsset = !!customImg || !!getEnemyAssetUrl(p.enemy_icon);

          return (
            <div 
              key={p.id}
              className="ornate-card !p-2 flex items-center gap-3 bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer group"
              onClick={() => p.character_id && onOpenChar?.(p.character_id)}
            >
              <div 
                className="w-10 h-10 rounded-full border-2 flex-shrink-0 flex items-center justify-center bg-card overflow-hidden"
                style={{ borderColor: color, color }}
              >
                <EnemyIcon 
                  name={p.enemy_icon} 
                  size={20} 
                  fill={isTierAsset} 
                  customImage={customImg} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-display text-xs truncate" style={{ color }}>
                  {p.display_name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] font-display uppercase tracking-widest text-muted-foreground">
                    INI:
                  </span>
                  <span className="text-[10px] font-display text-[var(--gold)]">
                    {p.initiative}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
