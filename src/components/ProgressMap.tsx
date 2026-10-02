import React from 'react';
import { motion } from 'motion/react';
import { sound } from '../lib/sound';

interface ProgressMapProps {
  currentStage: number;
  unlockedStages: number[];
  onSelectStage: (stage: number) => void;
  isTeacherUnlocked: boolean;
}

export const ProgressMap: React.FC<ProgressMapProps> = ({
  currentStage,
  unlockedStages,
  onSelectStage,
  isTeacherUnlocked,
}) => {
  const stations = [
    { id: 1, name: 'Kirish', emoji: '⛵', desc: 'Boshlang\'ich bandargoh' },
    { id: 2, name: 'Davomat', emoji: '📋', desc: 'Sinf maydoni' },
    { id: 3, name: 'Takrorlash', emoji: '🏔️', desc: 'Bilimlar tog\'i' },
    { id: 4, name: 'Yangi mavzu', emoji: '⚖️', desc: 'Tarozi sirlari' },
    { id: 5, name: 'O\'yinlar', emoji: '🎮', desc: 'Mashqlar vodiysi' },
    { id: 6, name: 'Test', emoji: '📝', desc: 'Sinov qal\'asi' },
    { id: 7, name: 'Baholash', emoji: '🏆', desc: 'G\'alaba cho\'qqisi' },
  ];

  return (
    <div className="w-full p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sky-500/10 via-emerald-500/10 to-amber-500/10 border border-[var(--border-color)] shadow-xs select-none">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🗺️</span>
          <h3 className="font-black text-xs sm:text-sm text-[var(--text-primary)]">
            "Tenglamalar oroli" xaritasi
          </h3>
        </div>
        <span className="text-[11px] font-bold text-[var(--text-secondary)]">
          {currentStage} / 7 manzil
        </span>
      </div>

      {/* Island Steps Path */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {stations.map((st) => {
          const isCurrent = currentStage === st.id;
          const isUnlocked = isTeacherUnlocked || unlockedStages.includes(st.id);

          return (
            <button
              key={st.id}
              type="button"
              disabled={!isUnlocked}
              onClick={() => {
                sound.playClick();
                onSelectStage(st.id);
              }}
              className={`flex flex-col items-center justify-center p-1.5 sm:p-2.5 rounded-2xl border transition-all text-center ${
                isCurrent
                  ? 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)] shadow-sm scale-105'
                  : isUnlocked
                  ? 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-blue)] hover:bg-[var(--bg-secondary)]'
                  : 'bg-[var(--bg-surface)]/40 border-dashed border-[var(--border-strong)] opacity-40 cursor-not-allowed'
              }`}
            >
              <span className="text-base sm:text-2xl">{st.emoji}</span>
              <span className="text-[10px] sm:text-xs font-bold truncate max-w-full mt-1">
                {st.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
