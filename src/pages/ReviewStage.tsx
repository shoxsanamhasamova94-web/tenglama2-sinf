import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, Star, CheckCircle, RefreshCw } from 'lucide-react';
import { CharacterGuide } from '../components/CharacterGuide';
import { NumberLine } from '../components/NumberLine';
import { sound } from '../lib/sound';
import { getStorageItem, setStorageItem } from '../lib/storage';

interface ReviewStageProps {
  onNext: () => void;
  onPrev: () => void;
  onEarnStars?: (count: number) => void;
}

export const ReviewStage: React.FC<ReviewStageProps> = ({ onNext, onPrev, onEarnStars }) => {
  const [activeTab, setActiveTab] = useState<'warmup' | 'blank_box' | 'matching' | 'number_line'>('warmup');

  // a) Warmup state
  const warmupProblems = [
    { q: '34 + 20', ans: 54, options: [54, 52, 64, 44] },
    { q: '70 − 5', ans: 65, options: [65, 75, 60, 55] },
    { q: '25 + 15', ans: 40, options: [40, 35, 45, 50] },
    { q: '80 − 30', ans: 50, options: [50, 40, 60, 70] },
    { q: '42 + 8', ans: 50, options: [50, 48, 52, 40] },
  ];
  const [warmupIdx, setWarmupIdx] = useState(0);
  const [warmupScore, setWarmupScore] = useState(0);
  const [warmupAnswered, setWarmupAnswered] = useState<number | null>(null);

  // b) Blank Box Morph state
  const [boxValue, setBoxValue] = useState<number | null>(null);
  const [isMorphedToX, setIsMorphedToX] = useState(false);

  // c) Term matching state
  // Expression: 8 + 5 = 13  (8: qo'shiluvchi, 5: qo'shiluvchi, 13: yig'indi)
  // Expression 2: 15 − 6 = 9 (15: kamayuvchi, 6: ayriluvchi, 9: ayirma)
  const [matchedSlots, setMatchedSlots] = useState<{ [key: string]: string }>({});
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  // Completion stars
  const [reviewStarsEarned, setReviewStarsEarned] = useState(() =>
    getStorageItem('review_stars_earned', false)
  );

  const handleWarmupSelect = (opt: number) => {
    sound.playClick();
    setWarmupAnswered(opt);
    const curr = warmupProblems[warmupIdx];
    if (opt === curr.ans) {
      sound.playCorrect();
      setWarmupScore((prev) => prev + 1);
    } else {
      sound.playTryAgain();
    }
  };

  const handleWarmupNext = () => {
    sound.playClick();
    if (warmupIdx < warmupProblems.length - 1) {
      setWarmupIdx((prev) => prev + 1);
      setWarmupAnswered(null);
    } else {
      // Completed warmup
      sound.playStar();
    }
  };

  const handleCheckBlankBox = (num: number) => {
    sound.playClick();
    setBoxValue(num);
    if (num === 4) {
      sound.playCorrect();
      setTimeout(() => {
        setIsMorphedToX(true);
        sound.playStar();
      }, 600);
    } else {
      sound.playTryAgain();
    }
  };

  // Term matching slots
  const termsList = [
    { id: 't1', text: "Qo'shiluvchi" },
    { id: 't2', text: "Qo'shiluvchi" },
    { id: 't3', text: "Yig'indi" },
    { id: 't4', text: "Kamayuvchi" },
    { id: 't5', text: "Ayriluvchi" },
    { id: 't6', text: "Ayirma" },
  ];

  const handleSlotClick = (slotKey: string, correctTerm: string) => {
    if (!selectedTerm) return;
    sound.playClick();
    if (selectedTerm === correctTerm) {
      sound.playCorrect();
      setMatchedSlots((prev) => ({ ...prev, [slotKey]: selectedTerm }));
      setSelectedTerm(null);
    } else {
      sound.playTryAgain();
    }
  };

  // Check if all review completed
  const handleAwardStars = () => {
    if (!reviewStarsEarned) {
      setReviewStarsEarned(true);
      setStorageItem('review_stars_earned', true);
      sound.playVictory();
      if (onEarnStars) onEarnStars(3);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-[var(--accent-blue)] uppercase tracking-wider">
            3-bosqich · ⏱ 6 daqiqa
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            O'tgan darsni takrorlash 🧠
          </h1>
        </div>

        {/* 3 Review Stars Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold">
          <span className="text-amber-500">⭐⭐⭐</span>
          <span>Takrorlash yulduzlari</span>
        </div>
      </div>

      <CharacterGuide
        message="Yangi mavzuga o'tishdan oldin, qo'shish va ayirish amallari hamda atamalarni tezda eslab olaylik! Quyidagi 4 ta mini-mashqni birgalikda bajaramiz."
        mood="happy"
      />

      {/* 4 Mini Activities Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveTab('warmup');
          }}
          className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap border transition-all ${
            activeTab === 'warmup'
              ? 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)] shadow-xs'
              : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          1. Tezkor razminka (5 ta)
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveTab('blank_box');
          }}
          className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap border transition-all ${
            activeTab === 'blank_box'
              ? 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)] shadow-xs'
              : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          2. Bo'sh katak → x
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveTab('matching');
          }}
          className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap border transition-all ${
            activeTab === 'matching'
              ? 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)] shadow-xs'
              : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          3. Atamalarni juftla
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveTab('number_line');
          }}
          className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap border transition-all ${
            activeTab === 'number_line'
              ? 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)] shadow-xs'
              : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          4. Sonli to'g'ri chiziq
        </button>
      </div>

      {/* Activity Content */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm min-h-[300px] flex flex-col justify-center">
        {/* A. WARMUP */}
        {activeTab === 'warmup' && (
          <div className="space-y-6 text-center max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]">
              <span>Savol: {warmupIdx + 1} / {warmupProblems.length}</span>
              <span>To'g'ri javoblar: {warmupScore}</span>
            </div>

            <div className="py-4 px-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-strong)] inline-block">
              <span className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">
                {warmupProblems[warmupIdx].q} = ?
              </span>
            </div>

            {/* Multiple choice buttons */}
            <div className="grid grid-cols-2 gap-3">
              {warmupProblems[warmupIdx].options.map((opt) => {
                const isSelected = warmupAnswered === opt;
                const isCorrect = opt === warmupProblems[warmupIdx].ans;

                let btnStyle = 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-blue)]';
                if (warmupAnswered !== null) {
                  if (isCorrect) btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-xs';
                  else if (isSelected) btnStyle = 'bg-rose-100 text-rose-800 border-rose-300';
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={warmupAnswered !== null}
                    onClick={() => handleWarmupSelect(opt)}
                    className={`py-3 px-4 rounded-2xl font-black text-xl border transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {warmupAnswered !== null && (
              <div className="flex items-center justify-center gap-3 pt-2">
                {warmupIdx < warmupProblems.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleWarmupNext}
                    className="py-2.5 px-6 rounded-xl font-bold text-sm bg-[var(--accent-blue)] text-white hover:brightness-105 shadow-xs"
                  >
                    Keyingi misol →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleAwardStars();
                      setActiveTab('blank_box');
                    }}
                    className="py-2.5 px-6 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:brightness-105 shadow-xs"
                  >
                    Razminka yakunlandi! 2-mashqqa o'tish →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* B. BLANK BOX MORPH */}
        {activeTab === 'blank_box' && (
          <div className="space-y-6 text-center max-w-lg mx-auto">
            <h3 className="font-black text-lg text-[var(--text-primary)]">
              "Bo'sh katak" misolidan tenglamaga ko'prik!
            </h3>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              1-sinfda biz mana bu misollarni yechardik. Bo'sh katak ichidagi sonni toping:
            </p>

            {/* Expression with Morphing Box */}
            <div className="flex items-center justify-center gap-3 py-6 px-4 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-strong)]">
              <span className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">6 +</span>

              {/* The Box itself */}
              <motion.div
                animate={isMorphedToX ? { scale: [1, 1.2, 1], rotate: [0, 360] } : {}}
                transition={{ duration: 0.7 }}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl font-black border-2 transition-all shadow-sm ${
                  isMorphedToX
                    ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 border-amber-600'
                    : boxValue === 4
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : 'bg-[var(--bg-card)] border-dashed border-[var(--accent-blue)] text-[var(--accent-blue)]'
                }`}
              >
                {isMorphedToX ? 'x' : boxValue ?? '□'}
              </motion.div>

              <span className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">= 10</span>
            </div>

            {/* Number Choices */}
            {!isMorphedToX ? (
              <div className="space-y-3">
                <span className="text-xs font-bold text-[var(--text-secondary)]">
                  Katak ichiga qaysi son tushadi?
                </span>
                <div className="flex items-center justify-center gap-2">
                  {[2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleCheckBlankBox(num)}
                      className="w-12 h-12 rounded-2xl font-black text-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--accent-blue)] active:scale-95"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 text-amber-900 dark:text-amber-300 text-xs sm:text-sm space-y-2 font-medium"
              >
                <p>
                  🎉 <strong>Ko'rdingizmi?</strong> Bo'sh katak <strong>□</strong> o'rniga <strong>x</strong> harfi qo'yilsa, u haqiqiy <strong>TENGLAMA</strong>ga aylanadi!
                </p>
                <div className="font-mono text-base font-black text-slate-900 dark:text-white">
                  6 + x = 10 &nbsp;→&nbsp; x = 10 − 6 = 4
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('matching')}
                  className="mt-2 py-2 px-4 rounded-xl bg-[var(--accent-blue)] text-white text-xs font-bold hover:brightness-105"
                >
                  Keyingi mashq: Atamalarni juftlash →
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* C. TERM MATCHING */}
        {activeTab === 'matching' && (
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="text-center">
              <h3 className="font-black text-base sm:text-lg text-[var(--text-primary)]">
                Atamalarni misol qismlariga joylashtiring
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Avval quyidagi atamani tanlang, so'ng misoldagi bo'sh doirachaga bosing!
              </p>
            </div>

            {/* Term bank */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-[var(--bg-secondary)] rounded-2xl">
              {['Qo\'shiluvchi', 'Yig\'indi', 'Kamayuvchi', 'Ayriluvchi', 'Ayirma'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedTerm(term);
                  }}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    selectedTerm === term
                      ? 'bg-[var(--accent-purple)] text-white border-purple-600 shadow-xs scale-105'
                      : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-purple-400'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Equation 1: 8 + 5 = 13 */}
            <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2">
              <span className="text-xs font-bold text-[var(--text-secondary)]">1-misol: Qo'shish</span>
              <div className="flex items-center justify-around gap-2 text-center">
                <div
                  onClick={() => handleSlotClick('slot_8', "Qo'shiluvchi")}
                  className="p-2 rounded-xl border border-dashed border-[var(--border-strong)] hover:border-[var(--accent-blue)] cursor-pointer flex flex-col items-center min-w-[70px]"
                >
                  <span className="text-2xl font-black">8</span>
                  <span className="text-[10px] font-bold text-[var(--accent-blue)]">
                    {matchedSlots['slot_8'] || '...'}
                  </span>
                </div>

                <span className="text-xl font-bold">+</span>

                <div
                  onClick={() => handleSlotClick('slot_5', "Qo'shiluvchi")}
                  className="p-2 rounded-xl border border-dashed border-[var(--border-strong)] hover:border-[var(--accent-blue)] cursor-pointer flex flex-col items-center min-w-[70px]"
                >
                  <span className="text-2xl font-black">5</span>
                  <span className="text-[10px] font-bold text-[var(--accent-blue)]">
                    {matchedSlots['slot_5'] || '...'}
                  </span>
                </div>

                <span className="text-xl font-bold">=</span>

                <div
                  onClick={() => handleSlotClick('slot_13', "Yig'indi")}
                  className="p-2 rounded-xl border border-dashed border-[var(--border-strong)] hover:border-[var(--accent-blue)] cursor-pointer flex flex-col items-center min-w-[70px]"
                >
                  <span className="text-2xl font-black">13</span>
                  <span className="text-[10px] font-bold text-emerald-600">
                    {matchedSlots['slot_13'] || '...'}
                  </span>
                </div>
              </div>
            </div>

            {/* Equation 2: 15 − 6 = 9 */}
            <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2">
              <span className="text-xs font-bold text-[var(--text-secondary)]">2-misol: Ayirish</span>
              <div className="flex items-center justify-around gap-2 text-center">
                <div
                  onClick={() => handleSlotClick('slot_15', 'Kamayuvchi')}
                  className="p-2 rounded-xl border border-dashed border-[var(--border-strong)] hover:border-[var(--accent-blue)] cursor-pointer flex flex-col items-center min-w-[70px]"
                >
                  <span className="text-2xl font-black">15</span>
                  <span className="text-[10px] font-bold text-amber-600">
                    {matchedSlots['slot_15'] || '...'}
                  </span>
                </div>

                <span className="text-xl font-bold">−</span>

                <div
                  onClick={() => handleSlotClick('slot_6', 'Ayriluvchi')}
                  className="p-2 rounded-xl border border-dashed border-[var(--border-strong)] hover:border-[var(--accent-blue)] cursor-pointer flex flex-col items-center min-w-[70px]"
                >
                  <span className="text-2xl font-black">6</span>
                  <span className="text-[10px] font-bold text-rose-600">
                    {matchedSlots['slot_6'] || '...'}
                  </span>
                </div>

                <span className="text-xl font-bold">=</span>

                <div
                  onClick={() => handleSlotClick('slot_9', 'Ayirma')}
                  className="p-2 rounded-xl border border-dashed border-[var(--border-strong)] hover:border-[var(--accent-blue)] cursor-pointer flex flex-col items-center min-w-[70px]"
                >
                  <span className="text-2xl font-black">9</span>
                  <span className="text-[10px] font-bold text-purple-600">
                    {matchedSlots['slot_9'] || '...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* D. NUMBER LINE */}
        {activeTab === 'number_line' && (
          <div className="space-y-4">
            <div className="text-center max-w-md mx-auto">
              <h3 className="font-black text-base text-[var(--text-primary)]">
                Sonli to'g'ri chiziqda sakrash
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Qurbaqa 6 dan boshlab 4 qadam sakrasa, 10 ga yetib boradi (6 + 4 = 10).
              </p>
            </div>

            <NumberLine min={0} max={15} start={6} jump={4} target={10} />
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onPrev();
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Davomat</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            handleAwardStars();
            onNext();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm sm:text-base text-white bg-[var(--accent-blue)] hover:brightness-105 active:scale-98 transition-all shadow-md"
        >
          <span>Keyingi: Yangi mavzu</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
