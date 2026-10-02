import React from 'react';
import { Volume2, VolumeX, Lightbulb } from 'lucide-react';
import { speech } from '../lib/speech';
import { getCurrentLanguage, t } from '../i18n';
import { sound } from '../lib/sound';

interface CharacterGuideProps {
  message: string;
  mood?: 'happy' | 'thinking' | 'celebrating' | 'supportive';
  hintText?: string;
  onHintClick?: () => void;
  showHintButton?: boolean;
}

export const CharacterGuide: React.FC<CharacterGuideProps> = ({
  message,
  mood = 'happy',
  hintText,
  onHintClick,
  showHintButton = false,
}) => {
  const [speaking, setSpeaking] = React.useState(false);
  const lang = getCurrentLanguage();

  const handleSpeak = () => {
    sound.playClick();
    if (speaking) {
      speech.stop();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      speech.speak(message, lang);
      // reset after a realistic reading time
      const estimatedSec = Math.max(2, Math.ceil(message.length / 15));
      setTimeout(() => setSpeaking(false), estimatedSec * 1000);
    }
  };

  const getEmoji = () => {
    switch (mood) {
      case 'celebrating': return '🎉';
      case 'thinking': return '🤔';
      case 'supportive': return '💪';
      default: return '🤖';
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 sm:p-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-sm transition-all">
      {/* Robot Mascot Avatar */}
      <div className="relative shrink-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--accent-blue-bg)] border border-[var(--border-strong)] text-2xl sm:text-3xl shadow-xs select-none">
        <span>{getEmoji()}</span>
        <span className="absolute -bottom-1 -right-1 text-xs px-1 bg-[var(--accent-yellow)] text-slate-900 font-bold rounded-md shadow-xs">
          Tolik
        </span>
      </div>

      {/* Speech content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-bold text-[var(--accent-blue)] uppercase tracking-wider">
            {t('character.name')}
          </span>
          <div className="flex items-center gap-1">
            {showHintButton && onHintClick && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onHintClick();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[var(--accent-yellow-bg)] text-amber-800 hover:brightness-95 transition-all"
                title={t('actions.hint')}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{t('actions.hint')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSpeak}
              className={`p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-all ${
                speaking ? 'bg-[var(--accent-blue-bg)] text-[var(--accent-blue)] animate-pulse' : 'text-[var(--text-secondary)]'
              }`}
              title={t('actions.speak')}
              aria-label={t('actions.speak')}
            >
              {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <p className="text-sm sm:text-base font-medium text-[var(--text-primary)] leading-snug">
          {message}
        </p>

        {hintText && (
          <div className="mt-2 p-2 bg-[var(--accent-yellow-bg)] border border-amber-200/60 rounded-xl text-xs sm:text-sm text-amber-900 font-medium">
            💡 {hintText}
          </div>
        )}
      </div>
    </div>
  );
};
