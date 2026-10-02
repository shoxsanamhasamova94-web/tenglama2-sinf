import React from 'react';
import { BookOpen, Users, Brain, Scale, Gamepad2, Award, ClipboardCheck } from 'lucide-react';
import { sound } from '../lib/sound';

interface BottomNavProps {
  currentStage: number;
  unlockedStages: number[];
  onSelectStage: (stage: number) => void;
  isTeacherUnlocked: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentStage,
  unlockedStages,
  onSelectStage,
  isTeacherUnlocked,
}) => {
  const tabs = [
    { id: 1, name: 'Kirish', icon: BookOpen },
    { id: 2, name: 'Davomat', icon: Users },
    { id: 3, name: 'Takror', icon: Brain },
    { id: 4, name: 'Mavzu', icon: Scale },
    { id: 5, name: 'O\'yin', icon: Gamepad2 },
    { id: 6, name: 'Test', icon: ClipboardCheck },
    { id: 7, name: 'Baho', icon: Award },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-md border-t border-[var(--border-color)] px-2 py-1 shadow-lg flex items-center justify-around"
      style={{ maxHeight: '60px' }}
      aria-label="Mobile stage navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isCurrent = currentStage === tab.id;
        const isUnlocked = isTeacherUnlocked || unlockedStages.includes(tab.id);

        return (
          <button
            key={tab.id}
            type="button"
            disabled={!isUnlocked}
            onClick={() => {
              sound.playClick();
              onSelectStage(tab.id);
            }}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-w-[42px] ${
              isCurrent
                ? 'text-[var(--accent-blue)] font-black scale-105'
                : isUnlocked
                ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                : 'text-[var(--text-muted)] opacity-30 cursor-not-allowed'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-bold truncate max-w-[44px]">
              {tab.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
