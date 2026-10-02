import React from 'react';
import { X, Check } from 'lucide-react';
import { t } from '../i18n';
import { sound } from '../lib/sound';

export interface A11ySettings {
  fontSize: 'normal' | 'large' | 'xlarge';
  dyslexiaFont: boolean;
  autoSpeech: boolean;
  soundFx: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  colorCodedNumbers: boolean;
  stepByStep: boolean;
  peerTutoring: boolean;
}

interface A11yModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: A11ySettings;
  onUpdateSettings: (settings: Partial<A11ySettings>) => void;
}

export const A11yModal: React.FC<A11yModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-3xl shadow-xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2">
            <span className="text-xl">♿</span>
            <h2 id="a11y-title" className="text-lg font-black text-[var(--text-primary)]">
              {t('a11y.title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-card)] transition-all"
            aria-label={t('actions.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Font Size Selector */}
          <div>
            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
              {t('a11y.fontSize')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'large', 'xlarge'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onUpdateSettings({ fontSize: sz });
                  }}
                  className={`py-2 px-3 rounded-xl border text-sm font-bold transition-all ${
                    settings.fontSize === sz
                      ? 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)] shadow-xs'
                      : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  {sz === 'normal' ? 'Oddiy' : sz === 'large' ? 'Katta (+)' : 'Juda katta (++)'}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle items */}
          <div className="space-y-3 pt-2">
            {/* Dyslexia Font */}
            <label className="flex items-center justify-between p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] cursor-pointer">
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {t('a11y.dyslexia')}
              </span>
              <input
                type="checkbox"
                checked={settings.dyslexiaFont}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateSettings({ dyslexiaFont: e.target.checked });
                }}
                className="w-5 h-5 accent-[var(--accent-blue)] rounded-md"
              />
            </label>

            {/* Sound FX */}
            <label className="flex items-center justify-between p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] cursor-pointer">
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {t('a11y.soundFx')}
              </span>
              <input
                type="checkbox"
                checked={settings.soundFx}
                onChange={(e) => {
                  sound.setSoundEnabled(e.target.checked);
                  if (e.target.checked) sound.playClick();
                  onUpdateSettings({ soundFx: e.target.checked });
                }}
                className="w-5 h-5 accent-[var(--accent-blue)] rounded-md"
              />
            </label>

            {/* Auto speech */}
            <label className="flex items-center justify-between p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] cursor-pointer">
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {t('a11y.autoSpeech')}
              </span>
              <input
                type="checkbox"
                checked={settings.autoSpeech}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateSettings({ autoSpeech: e.target.checked });
                }}
                className="w-5 h-5 accent-[var(--accent-blue)] rounded-md"
              />
            </label>

            {/* Reduced motion */}
            <label className="flex items-center justify-between p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] cursor-pointer">
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {t('a11y.reducedMotion')}
              </span>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateSettings({ reducedMotion: e.target.checked });
                }}
                className="w-5 h-5 accent-[var(--accent-blue)] rounded-md"
              />
            </label>

            {/* High contrast */}
            <label className="flex items-center justify-between p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] cursor-pointer">
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {t('a11y.highContrast')}
              </span>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateSettings({ highContrast: e.target.checked });
                }}
                className="w-5 h-5 accent-[var(--accent-blue)] rounded-md"
              />
            </label>

            {/* Color-coded numbers */}
            <label className="flex items-center justify-between p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] cursor-pointer">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {t('a11y.colorCodedNumbers')}
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  <span className="text-blue-600 font-bold">O'nliklar</span> va <span className="text-amber-600 font-bold">birliklar</span>
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.colorCodedNumbers}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateSettings({ colorCodedNumbers: e.target.checked });
                }}
                className="w-5 h-5 accent-[var(--accent-blue)] rounded-md"
              />
            </label>

            {/* Step-by-step mode */}
            <label className="flex items-center justify-between p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] cursor-pointer">
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {t('a11y.stepByStep')}
              </span>
              <input
                type="checkbox"
                checked={settings.stepByStep}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateSettings({ stepByStep: e.target.checked });
                }}
                className="w-5 h-5 accent-[var(--accent-blue)] rounded-md"
              />
            </label>

            {/* Peer tutoring (Ustoz-do'st) */}
            <label className="flex items-center justify-between p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] cursor-pointer">
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {t('a11y.peerTutoring')}
              </span>
              <input
                type="checkbox"
                checked={settings.peerTutoring}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateSettings({ peerTutoring: e.target.checked });
                }}
                className="w-5 h-5 accent-[var(--accent-blue)] rounded-md"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] flex justify-end">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm bg-[var(--accent-blue)] text-white hover:brightness-105 shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Tayyor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
