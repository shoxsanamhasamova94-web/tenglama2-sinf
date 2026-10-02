import React, { useState } from 'react';
import { X, Lock, Unlock, Check, BookOpen, AlertCircle, RefreshCw, KeyRound } from 'lucide-react';
import { t, getCurrentLanguage } from '../i18n';
import { lessonPlanData, teacherPedagogyGuide } from '../data/lessonPlan';
import { sound } from '../lib/sound';
import { clearAppStorage, getStorageItem, setStorageItem } from '../lib/storage';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUnlocked: boolean;
  onUnlock: () => void;
  onJumpStage: (stage: number) => void;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  isUnlocked,
  onUnlock,
  onJumpStage,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'plan' | 'pedagogy' | 'settings'>('plan');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const lang = getCurrentLanguage();

  if (!isOpen) return null;

  const storedPin = getStorageItem<string>('teacher_pin', '1234');

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    if (pinInput === storedPin) {
      sound.playCorrect();
      onUnlock();
      setErrorMsg('');
      setPinInput('');
    } else {
      sound.playTryAgain();
      setErrorMsg(t('teacher.wrongPin'));
      setPinInput('');
    }
  };

  const handleSaveNewPin = () => {
    if (newPin.length === 4 && /^\d+$/.test(newPin)) {
      setStorageItem('teacher_pin', newPin);
      sound.playCorrect();
      setIsChangingPin(false);
      setNewPin('');
    }
  };

  const handleResetData = () => {
    if (window.confirm(t('teacher.resetConfirm'))) {
      clearAppStorage();
      sound.playClick();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] shrink-0">
          <div className="flex items-center gap-2">
            {isUnlocked ? <Unlock className="w-5 h-5 text-emerald-500" /> : <Lock className="w-5 h-5 text-amber-500" />}
            <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)]">
              {t('teacher.title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-card)] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isUnlocked ? (
          /* Lock screen - Enter PIN */
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--accent-yellow-bg)] flex items-center justify-center text-3xl mb-4">
              🔒
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
              O'qituvchi rejimi
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6 max-w-sm">
              {t('teacher.enterPin')}
            </p>

            <form onSubmit={handleVerifyPin} className="w-full max-w-xs space-y-4">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="1234"
                className="w-full text-center text-3xl tracking-[0.5em] font-black py-3 px-4 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-primary)] focus:border-[var(--accent-blue)] focus:outline-none"
              />

              {errorMsg && (
                <p className="text-xs font-semibold text-rose-500 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errorMsg}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={pinInput.length < 4}
                className="w-full py-3 rounded-2xl font-bold text-white bg-[var(--accent-blue)] hover:brightness-105 active:scale-98 transition-all shadow-xs disabled:opacity-40"
              >
                {t('actions.unlock')}
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Teacher Dashboard */
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50 shrink-0">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveTab('plan');
                }}
                className={`py-2 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'plan'
                    ? 'border-[var(--accent-blue)] text-[var(--accent-blue)]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t('teacher.lessonPlan')} (45 daq)
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveTab('pedagogy');
                }}
                className={`py-2 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'pedagogy'
                    ? 'border-[var(--accent-blue)] text-[var(--accent-blue)]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t('teacher.methodologyNotes')}
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveTab('settings');
                }}
                className={`py-2 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'settings'
                    ? 'border-[var(--accent-blue)] text-[var(--accent-blue)]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Sozlamalar & PIN
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeTab === 'plan' && (
                <div className="space-y-4">
                  <div className="p-3 bg-[var(--accent-blue-bg)] rounded-2xl text-xs sm:text-sm text-[var(--accent-blue)] font-bold flex items-center justify-between">
                    <span>45 daqiqalik dars bosqichlari (Ixtiyoriy bosqichga o'tish mumkin):</span>
                  </div>

                  <div className="space-y-3">
                    {lessonPlanData.map((stage) => {
                      const title = lang === 'ru' ? stage.titleRu : lang === 'en' ? stage.titleEn : stage.titleUz;
                      const script = lang === 'ru' ? stage.teacherScriptRu : lang === 'en' ? stage.teacherScriptEn : stage.teacherScriptUz;
                      const tips = lang === 'ru' ? stage.tipsRu : lang === 'en' ? stage.tipsEn : stage.tipsUz;

                      return (
                        <div
                          key={stage.stageId}
                          className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xs"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-[var(--accent-blue)] text-white text-xs font-bold flex items-center justify-center">
                                {stage.stageId}
                              </span>
                              <h4 className="font-bold text-sm sm:text-base text-[var(--text-primary)]">
                                {title}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                ⏱ {stage.timeMinutes} daq
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  sound.playClick();
                                  onJumpStage(stage.stageId);
                                  onClose();
                                }}
                                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[var(--accent-blue-bg)] text-[var(--accent-blue)] hover:brightness-95"
                              >
                                O'tish →
                              </button>
                            </div>
                          </div>

                          <div className="mb-2 p-2.5 bg-[var(--bg-secondary)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] font-medium italic">
                            🗣 <strong>O'qituvchi nutqi:</strong> "{script}"
                          </div>

                          <ul className="text-xs space-y-1 text-[var(--text-secondary)]">
                            {tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-amber-500">💡</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'pedagogy' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    Tipik xatolar va ularni to'g'rilash usullari:
                  </h3>
                  {teacherPedagogyGuide.misconceptions.map((item, idx) => {
                    const title = lang === 'ru' ? item.titleRu : lang === 'en' ? item.titleEn : item.titleUz;
                    const exp = lang === 'ru' ? item.explanationRu : lang === 'en' ? item.explanationEn : item.explanationUz;
                    return (
                      <div key={idx} className="p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20">
                        <div className="font-bold text-xs sm:text-sm text-rose-700 dark:text-rose-400 mb-1">
                          {title}
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                          {exp}
                        </p>
                      </div>
                    );
                  })}

                  <h3 className="font-bold text-sm text-[var(--text-primary)] pt-2">
                    Differensiatsiya tavsiyalari:
                  </h3>
                  <div className="space-y-2">
                    {teacherPedagogyGuide.differentiationTips.map((tip, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[var(--bg-secondary)] text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Change PIN */}
                  <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
                    <h4 className="font-bold text-sm text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-amber-500" />
                      <span>PIN kodni o'zgartirish</span>
                    </h4>
                    {!isChangingPin ? (
                      <button
                        type="button"
                        onClick={() => setIsChangingPin(true)}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                      >
                        Yangi PIN o'rnatish
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 max-w-xs">
                        <input
                          type="password"
                          maxLength={4}
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          placeholder="Yangi 4 xonali PIN"
                          className="flex-1 py-1.5 px-3 text-sm rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)]"
                        />
                        <button
                          type="button"
                          onClick={handleSaveNewPin}
                          disabled={newPin.length !== 4}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white disabled:opacity-40"
                        >
                          Saqlash
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reset all data */}
                  <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20">
                    <h4 className="font-bold text-sm text-rose-700 dark:text-rose-400 mb-1">
                      {t('teacher.resetData')}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mb-3">
                      Barcha saqlangan davomat, o'quvchi yulduzlari va test natijalari tozalanadi.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetData}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Tozalash</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
