import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Smile, Meh, Frown } from 'lucide-react';
import { CharacterGuide } from '../components/CharacterGuide';
import { MagicBox } from '../components/MagicBox';
import { sound } from '../lib/sound';
import { getStorageItem, setStorageItem } from '../lib/storage';

interface IntroStageProps {
  onNext: () => void;
  onPrev?: () => void;
}

export const IntroStage: React.FC<IntroStageProps> = ({ onNext }) => {
  const [mood, setMood] = useState<string | null>(() => getStorageItem('student_mood', null));
  const [guessAnswer, setGuessAnswer] = useState<number | null>(null);
  const [isRiddleSolved, setIsRiddleSolved] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  const moods = [
    { emoji: '😀', label: "A'lo kayfiyat!", id: 'great' },
    { emoji: '🙂', label: 'Yaxshi', id: 'good' },
    { emoji: '😐', label: 'O\'rtacha', id: 'ok' },
    { emoji: '🤔', label: 'O\'ychan', id: 'thoughtful' },
  ];

  const handleSelectMood = (id: string) => {
    sound.playClick();
    setMood(id);
    setStorageItem('student_mood', id);
    sound.playStar();
  };

  const handleGuess = (val: number) => {
    sound.playClick();
    setGuessAnswer(val);
    if (val === 3) {
      sound.playCorrect();
      setIsRiddleSolved(true);
    } else {
      sound.playTryAgain();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Stage Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[var(--accent-blue)] uppercase tracking-wider">
            1-bosqich · ⏱ 3 daqiqa
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            Salom, kichik matematiklar! 👋
          </h1>
        </div>
      </div>

      {/* Mascot Guide */}
      <CharacterGuide
        message="Salom! Mening ismim Tarozi-Tolik. Bugun sizlar bilan birgalikda matematikadagi eng qiziqarli sir — noma'lum 'x' sonini topishni o'rganamiz!"
        mood="celebrating"
      />

      {/* 3 Goals in Simple sentences with pictorial cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-start gap-3 shadow-2xs">
          <div className="text-3xl select-none">🎁</div>
          <div>
            <h3 className="font-bold text-sm text-[var(--text-primary)]">1. Sirli x ni taniymiz</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Quti ichida yashiringan noma'lum son nima ekanini bilib olamiz.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-start gap-3 shadow-2xs">
          <div className="text-3xl select-none">⚖️</div>
          <div>
            <h3 className="font-bold text-sm text-[var(--text-primary)]">2. Tarozini muvozanatlaymiz</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Tenglikning ikki tomoni doimo bir xil bo'lishi qoidasini o'rganamiz.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-start gap-3 shadow-2xs">
          <div className="text-3xl select-none">🏆</div>
          <div>
            <h3 className="font-bold text-sm text-[var(--text-primary)]">3. Tenglama ustasi bo'lamiz</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              O'yinlar o'ynab, yulduzlar yig'amiz va maxsus sertifikat olamiz!
            </p>
          </div>
        </div>
      </div>

      {/* Mood Check Grid */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm">
        <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <span>Bugungi kayfiyatingiz qanday?</span>
          {mood && <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Belgilandi ✅</span>}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {moods.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleSelectMood(m.id)}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                mood === m.id
                  ? 'bg-[var(--accent-blue-bg)] border-[var(--accent-blue)] shadow-xs scale-[1.02]'
                  : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              <span className="text-2xl sm:text-3xl select-none">{m.emoji}</span>
              <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Motivational Mini-Riddle: Apples in Mystery Box */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 space-y-3 text-center md:text-left">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Boshqotirma · Topishmoq</span>
            </span>

            <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)]">
              "Qutida nechta olma yashiringan?"
            </h3>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Menda <strong>7 ta olma</strong> bor edi 🍎🍎🍎🍎🍎🍎🍎. Qutichaga yana bir nechta olma qo'shgach, jami <strong>10 ta olma</strong> bo'ldi! Quti ichida nechta olma bor?
            </p>

            <div className="p-2.5 bg-[var(--bg-secondary)] rounded-xl font-mono text-xs sm:text-sm font-bold text-[var(--text-primary)]">
              7 + 🎁 = 10 &nbsp; (7 + x = 10)
            </div>

            {/* Answer Guess Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              {[2, 3, 4, 5].map((num) => {
                const isCorrect = num === 3;
                const isSelected = guessAnswer === num;

                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleGuess(num)}
                    className={`min-w-[56px] py-2.5 px-4 rounded-xl font-black text-base border transition-all ${
                      isSelected && isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                        : isSelected && !isCorrect
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-blue)]'
                    }`}
                  >
                    {num} ta
                  </button>
                );
              })}
            </div>

            {guessAnswer !== null && (
              <div className="pt-2 text-xs sm:text-sm font-bold animate-in fade-in">
                {isRiddleSolved ? (
                  <p className="text-emerald-600">
                    🎉 To'g'ri topdingiz! Qutida roppa-rosa 3 ta olma bor edi (10 − 7 = 3)!
                  </p>
                ) : (
                  <p className="text-amber-700">
                    💪 Yana bir bor o'ylab ko'ring: 7 ga nechani qo'shsak 10 bo'ladi?
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Interactive Magic Box Widget */}
          <div className="shrink-0 flex flex-col items-center">
            <MagicBox isOpen={isRiddleSolved} revealedValue="3" />
          </div>
        </div>
      </div>

      {/* Stage Bottom Navigation */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onNext();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm sm:text-base text-white bg-[var(--accent-blue)] hover:brightness-105 active:scale-98 transition-all shadow-md"
        >
          <span>Keyingi: Davomat</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
