import React from 'react';
import { Moon, Sun, BookOpen, Settings, Lock, Maximize, Minimize } from 'lucide-react';
import { Language, getCurrentLanguage, t } from '../i18n';
import { sound } from '../lib/sound';

export type ThemeType = 'light' | 'dark' | 'workly';

interface NavbarProps {
  currentStage: number;
  onSelectStage: (stage: number) => void;
  unlockedStages: number[];
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenA11y: () => void;
  onOpenTeacher: () => void;
  isBoardMode: boolean;
  onToggleBoardMode: () => void;
  isTeacherUnlocked: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStage,
  onSelectStage,
  unlockedStages,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  onOpenA11y,
  onOpenTeacher,
  isBoardMode,
  onToggleBoardMode,
  isTeacherUnlocked,
}) => {
  const stages = [
    { id: 1, name: t('stages.s1_name'), num: '1' },
    { id: 2, name: t('stages.s2_name'), num: '2' },
    { id: 3, name: t('stages.s3_name'), num: '3' },
    { id: 4, name: t('stages.s4_name'), num: '4' },
    { id: 5, name: t('stages.s5_name'), num: '5' },
    { id: 6, name: t('stages.s6_name'), num: '6' },
    { id: 7, name: t('stages.s7_name'), num: '7' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-color)] transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onSelectStage(1);
          }}
          className="flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg p-1"
        >
          <span className="text-xl sm:text-2xl font-black tracking-tight text-[var(--accent-blue)]">
            Tenglamalar
          </span>
          <span className="hidden sm:inline-block text-xs font-bold px-2 py-0.5 rounded-md bg-[var(--accent-yellow-bg)] text-amber-900 border border-amber-300/60">
            2-sinf
          </span>
        </button>

        {/* Zone 2: Stage Navigator Tabs (Desktop & Tablet) */}
        {!isBoardMode && (
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none" aria-label="Stages">
            {stages.map((st) => {
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
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isCurrent
                      ? 'bg-[var(--accent-blue)] text-white shadow-xs'
                      : isUnlocked
                      ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                      : 'text-[var(--text-muted)] opacity-40 cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isCurrent
                        ? 'bg-white text-[var(--accent-blue)]'
                        : 'bg-[var(--border-strong)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {st.num}
                  </span>
                  <span>{st.name}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Zone 3: Primary Controls (Language, Theme, A11y, Teacher, Board) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Switcher (UZ | RU | EN) */}
          <div className="flex items-center bg-[var(--bg-secondary)] p-0.5 rounded-xl border border-[var(--border-color)]">
            {(['uz', 'ru', 'en'] as Language[]).map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => {
                  sound.playClick();
                  onLanguageChange(lng);
                }}
                className={`px-1.5 sm:px-2 py-1 text-xs font-bold rounded-lg uppercase transition-all ${
                  language === lng
                    ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-2xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                title={lng.toUpperCase()}
              >
                {lng}
              </button>
            ))}
          </div>

          {/* Theme Switcher (☀️ Light, 🌙 Dark, 📒 Workly) */}
          <div className="flex items-center bg-[var(--bg-secondary)] p-0.5 rounded-xl border border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onThemeChange('light');
              }}
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'light' ? 'bg-[var(--bg-card)] text-amber-500 shadow-2xs' : 'text-[var(--text-secondary)]'
              }`}
              title="Light theme"
              aria-label="Light theme"
            >
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onThemeChange('dark');
              }}
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'dark' ? 'bg-[var(--bg-card)] text-sky-400 shadow-2xs' : 'text-[var(--text-secondary)]'
              }`}
              title="Dark theme"
              aria-label="Dark theme"
            >
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onThemeChange('workly');
              }}
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'workly' ? 'bg-[var(--bg-card)] text-emerald-600 shadow-2xs' : 'text-[var(--text-secondary)]'
              }`}
              title="Workly / Focus theme"
              aria-label="Workly theme"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Board Mode Toggle (Smartboard Fullscreen) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onToggleBoardMode();
            }}
            className={`p-2 rounded-xl border border-[var(--border-color)] transition-all ${
              isBoardMode
                ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-xs'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title={isBoardMode ? t('actions.exitBoardMode') : t('actions.boardMode')}
            aria-label={t('actions.boardMode')}
          >
            {isBoardMode ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Accessibility Settings (♿) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenA11y();
            }}
            className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            title={t('a11y.title')}
            aria-label={t('a11y.title')}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Teacher Mode Lock (🔒) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenTeacher();
            }}
            className={`p-2 rounded-xl border transition-all ${
              isTeacherUnlocked
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)]'
            }`}
            title={t('actions.teacherMode')}
            aria-label={t('actions.teacherMode')}
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
