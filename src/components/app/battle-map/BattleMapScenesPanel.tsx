import React, { useState } from 'react';
import { Layers, Plus, Play, Trash2, Edit2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { MapConfig } from './BattleMap';
import type { ChalkLine, ChalkNote } from './BattleMapChalkLayer';

// FASE 5: Battle Map Scene Management
export interface BattleMapScene {
  id: string;
  campaign_id: string;
  name: string;
  background_url: string;
  background_type: 'image' | 'video';
  background_scale: number;
  background_opacity: number;
  background_brightness: number;
  grid_size: number;
  grid_color: string;
  grid_opacity: number;
  show_grid: boolean;
  tokens_state: Record<string, { x: number; y: number }>;
  chalk_lines: ChalkLine[];
  chalk_notes: ChalkNote[];
  is_active: boolean;
}

interface Props {
  scenes: BattleMapScene[];
  activeSceneId?: string;
  onSelectScene: (sceneId: string) => void;
  onActivateScene: (sceneId: string) => void;
  onSaveCurrentAsNew: (name: string) => void;
  onDeleteScene: (sceneId: string) => void;
  onClose: () => void;
}

export const BattleMapScenesPanel: React.FC<Props> = ({
  scenes,
  activeSceneId,
  onSelectScene,
  onActivateScene,
  onSaveCurrentAsNew,
  onDeleteScene,
  onClose
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newSceneName, setNewSceneName] = useState('');

  const handleCreate = () => {
    if (newSceneName.trim()) {
      onSaveCurrentAsNew(newSceneName.trim());
      setNewSceneName('');
      setIsCreating(false);
    }
  };

  return (
    <aside className="w-80 bg-[#0a0a0c]/95 border-r border-border/50 h-full flex flex-col z-50 backdrop-blur-md shadow-2xl transition-all animate-in slide-in-from-left">
      <div className="p-4 border-b border-border/30 flex items-center justify-between">
        <h2 className="font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <Layers size={14} />
          Escenas del Mapa
        </h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Botón Nueva Escena */}
        {!isCreating ? (
          <Button 
            variant="outline" 
            className="w-full border-dashed border-white/20 hover:border-[var(--gold)] hover:text-[var(--gold)]"
            onClick={() => setIsCreating(true)}
          >
            <Plus size={16} className="mr-2" />
            Guardar Vista Actual
          </Button>
        ) : (
          <div className="space-y-2 p-3 bg-white/5 rounded-xl border border-white/10 animate-in zoom-in-95">
            <Input 
              placeholder="Nombre de la escena..." 
              value={newSceneName}
              onChange={(e) => setNewSceneName(e.target.value)}
              className="bg-black/40 border-white/10 text-xs"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="flex-1 text-xs" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
              <Button size="sm" className="flex-1 text-xs bg-[var(--gold)] text-black hover:bg-[var(--gold)]/80" onClick={handleCreate}>
                Guardar
              </Button>
            </div>
          </div>
        )}

        {/* Lista de Escenas */}
        <div className="space-y-3">
          {scenes.length === 0 && !isCreating && (
            <p className="text-center text-xs text-muted-foreground py-8">
              No hay escenas guardadas.
            </p>
          )}
          
          {scenes.map((scene) => (
            <div 
              key={scene.id}
              className={`
                group relative ornate-card !p-3 cursor-pointer transition-all duration-300
                ${activeSceneId === scene.id ? 'border-[var(--gold)] bg-secondary/30' : 'bg-secondary/10 hover:bg-secondary/20'}
              `}
              onClick={() => onSelectScene(scene.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-display text-xs ${activeSceneId === scene.id ? 'text-[var(--gold)]' : 'text-foreground'}`}>
                  {scene.name}
                </span>
                {scene.is_active && (
                  <span className="text-[8px] bg-[var(--gold)] text-black px-1.5 py-0.5 rounded-full font-bold uppercase">
                    LIVE
                  </span>
                )}
              </div>

              {/* Miniatura (Placeholder visual por ahora) */}
              <div 
                className="w-full h-20 rounded-lg bg-black/40 border border-white/5 mb-3 overflow-hidden flex items-center justify-center relative"
              >
                {scene.background_url ? (
                  <img src={scene.background_url} className="w-full h-full object-cover opacity-40" alt="" />
                ) : (
                  <Layers className="text-white/10" size={24} />
                )}
                {activeSceneId === scene.id && (
                  <div className="absolute inset-0 border-2 border-[var(--gold)]/40 rounded-lg pointer-events-none" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className={`flex-1 h-8 text-[10px] uppercase font-bold tracking-widest ${scene.is_active ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 hover:bg-[var(--gold)] hover:text-black border border-white/10'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onActivateScene(scene.id);
                  }}
                >
                  <Play size={12} className="mr-1.5" />
                  {scene.is_active ? 'En Juego' : 'Poner Play'}
                </Button>
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="w-8 h-8 p-0 text-red-400/60 hover:text-red-400 hover:bg-red-400/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteScene(scene.id);
                  }}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
