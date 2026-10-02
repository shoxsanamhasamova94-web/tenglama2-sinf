/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, ThemeType } from './components/Navbar';
import { ProgressMap } from './components/ProgressMap';
import { BottomNav } from './components/BottomNav';
import { A11yModal, A11ySettings } from './components/A11yModal';
import { TeacherModal } from './components/TeacherModal';
import { IntroStage } from './pages/IntroStage';
import { AttendanceStage } from './pages/AttendanceStage';
import { ReviewStage } from './pages/ReviewStage';
import { NewTopicStage } from './pages/NewTopicStage';
import { PracticeStage } from './pages/PracticeStage';
import { QuizStage } from './pages/QuizStage';
import { AssessmentStage } from './pages/AssessmentStage';
import { Language, getCurrentLanguage, setLanguage, t } from './i18n';
import { getStorageItem, setStorageItem } from './lib/storage';
import { sound } from './lib/sound';
import { speech } from './lib/speech';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<ThemeType>(() =>
    getStorageItem('app_theme', 'light')
  );

  // Language state
  const [lang, setLang] = useState<Language>(() => getCurrentLanguage());

  // Current stage: 1 to 7
  const [currentStage, setCurrentStage] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const match = window.location.hash.match(/stage-(\d)/);
      if (match && match[1]) {
        const parsed = parseInt(match[1], 10);
        if (parsed >= 1 && parsed <= 7) return parsed;
      }
    }
    return getStorageItem('current_stage', 1);
  });

  // Unlocked stages
  const [unlockedStages, setUnlockedStages] = useState<number[]>(() =>
    getStorageItem('unlocked_stages', [1, 2, 3, 4, 5, 6, 7])
  );

  // Teacher mode
  const [isTeacherUnlocked, setIsTeacherUnlocked] = useState(() =>
    getStorageItem('teacher_unlocked', false)
  );
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  // Board mode (Smartboard)
  const [isBoardMode, setIsBoardMode] = useState(false);

  // Accessibility modal & settings
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const [a11ySettings, setA11ySettings] = useState<A11ySettings>(() =>
    getStorageItem('a11y_settings', {
      fontSize: 'normal',
      dyslexiaFont: false,
      autoSpeech: false,
      soundFx: true,
      reducedMotion: false,
      highContrast: false,
      colorCodedNumbers: false,
      stepByStep: false,
      peerTutoring: false,
    })
  );

  // Sync theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setStorageItem('app_theme', theme);
  }, [theme]);

  // Sync accessibility classes to body
  useEffect(() => {
    const body = document.body;
    body.classList.remove('font-size-large', 'font-size-xlarge');
    if (a11ySettings.fontSize === 'large') body.classList.add('font-size-large');
    if (a11ySettings.fontSize === 'xlarge') body.classList.add('font-size-xlarge');

    if (a11ySettings.dyslexiaFont) body.classList.add('dyslexia-font');
    else body.classList.remove('dyslexia-font');

    if (a11ySettings.highContrast) body.classList.add('high-contrast');
    else body.classList.remove('high-contrast');

    if (a11ySettings.reducedMotion) body.classList.add('reduced-motion');
    else body.classList.remove('reduced-motion');

    if (a11ySettings.colorCodedNumbers) body.classList.add('color-coded-num');
    else body.classList.remove('color-coded-num');

    sound.setSoundEnabled(a11ySettings.soundFx);
    speech.setEnabled(a11ySettings.autoSpeech);
  }, [a11ySettings]);

  // Sync hash with stage
  useEffect(() => {
    window.location.hash = `stage-${currentStage}`;
    setStorageItem('current_stage', currentStage);
    window.scrollTo({ top: 0, behavior: a11ySettings.reducedMotion ? 'auto' : 'smooth' });
  }, [currentStage, a11ySettings.reducedMotion]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setLang(newLang);
  };

  const handleUpdateA11y = (newSettings: Partial<A11ySettings>) => {
    const updated = { ...a11ySettings, ...newSettings };
    setA11ySettings(updated);
    setStorageItem('a11y_settings', updated);
  };

  const handleSelectStage = (stage: number) => {
    if (isTeacherUnlocked || unlockedStages.includes(stage)) {
      setCurrentStage(stage);
    }
  };

  const handleNextStage = () => {
    if (currentStage < 7) {
      const next = currentStage + 1;
      if (!unlockedStages.includes(next)) {
        const updated = [...unlockedStages, next];
        setUnlockedStages(updated);
        setStorageItem('unlocked_stages', updated);
      }
      setCurrentStage(next);
    }
  };

  const handlePrevStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const handleToggleBoardMode = () => {
    setIsBoardMode(!isBoardMode);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${isBoardMode ? 'p-2 sm:p-4' : ''}`}>
      {/* 3-Zone Top Navigation */}
      <Navbar
        currentStage={currentStage}
        onSelectStage={handleSelectStage}
        unlockedStages={unlockedStages}
        theme={theme}
        onThemeChange={setTheme}
        language={lang}
        onLanguageChange={handleLanguageChange}
        onOpenA11y={() => setIsA11yOpen(true)}
        onOpenTeacher={() => setIsTeacherModalOpen(true)}
        isBoardMode={isBoardMode}
        onToggleBoardMode={handleToggleBoardMode}
        isTeacherUnlocked={isTeacherUnlocked}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* Progress Map "Tenglamalar oroli" banner (Desktop & Tablet) */}
        {!isBoardMode && (
          <div className="no-print">
            <ProgressMap
              currentStage={currentStage}
              unlockedStages={unlockedStages}
              onSelectStage={handleSelectStage}
              isTeacherUnlocked={isTeacherUnlocked}
            />
          </div>
        )}

        {/* Dynamic Stage Render */}
        <section className="transition-all duration-300">
          {currentStage === 1 && (
            <IntroStage onNext={handleNextStage} />
          )}
          {currentStage === 2 && (
            <AttendanceStage onNext={handleNextStage} onPrev={handlePrevStage} />
          )}
          {currentStage === 3 && (
            <ReviewStage onNext={handleNextStage} onPrev={handlePrevStage} />
          )}
          {currentStage === 4 && (
            <NewTopicStage onNext={handleNextStage} onPrev={handlePrevStage} />
          )}
          {currentStage === 5 && (
            <PracticeStage onNext={handleNextStage} onPrev={handlePrevStage} />
          )}
          {currentStage === 6 && (
            <QuizStage onNext={handleNextStage} onPrev={handlePrevStage} />
          )}
          {currentStage === 7 && (
            <AssessmentStage onPrev={handlePrevStage} isTeacherUnlocked={isTeacherUnlocked} />
          )}
        </section>
      </main>

      {/* Bottom Tab Bar for Mobile Viewport (max 15% height) */}
      {!isBoardMode && (
        <BottomNav
          currentStage={currentStage}
          unlockedStages={unlockedStages}
          onSelectStage={handleSelectStage}
          isTeacherUnlocked={isTeacherUnlocked}
        />
      )}

      {/* Accessibility Modal */}
      <A11yModal
        isOpen={isA11yOpen}
        onClose={() => setIsA11yOpen(false)}
        settings={a11ySettings}
        onUpdateSettings={handleUpdateA11y}
      />

      {/* Teacher Mode Modal */}
      <TeacherModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        isUnlocked={isTeacherUnlocked}
        onUnlock={() => {
          setIsTeacherUnlocked(true);
          setStorageItem('teacher_unlocked', true);
        }}
        onJumpStage={handleSelectStage}
      />

      {/* Footer with Privacy Notice */}
      <footer className="mt-auto border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-4 px-6 text-center text-xs text-[var(--text-secondary)] no-print pb-20 lg:pb-4">
        <p className="max-w-2xl mx-auto">
          {t('privacy')} · 2-sinf matematika: "Tenglamalar" dars platformasi.
        </p>
      </footer>
    </div>
  );
}
