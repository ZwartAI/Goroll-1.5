import React from 'react';
import { Menu, ArrowLeft } from 'lucide-react';
import { useT } from '@/lib/i18n';

interface Props {
  title: string;
  onBack: () => void;
  onMenuToggle: () => void;
}

export const BattleMapHeader: React.FC<Props> = ({ title, onBack, onMenuToggle }) => {
  const { t } = useT();

  return (
    <header className="h-14 bg-[#0a0a0c] border-b border-border/50 flex items-center justify-between px-4 z-30 relative shadow-lg">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuToggle}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-[var(--gold)]"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display text-sm uppercase tracking-widest text-[var(--gold)] truncate max-w-[200px] sm:max-w-none">
          {title}
        </h1>
      </div>

      <button
        onClick={onBack}
        className="btn-fantasy !py-1.5 !px-4 !text-[10px] flex items-center gap-2"
        style={{ background: 'var(--gradient-gold)', color: 'black' }}
      >
        <ArrowLeft size={14} />
        {t('battleMap.backToScene')}
      </button>
    </header>
  );
};
