import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, Check, Sparkles, HelpCircle, Layers, BookOpen, Scale as ScaleIcon } from 'lucide-react';
import { CharacterGuide } from '../components/CharacterGuide';
import { Scale } from '../components/Scale';
import { sound } from '../lib/sound';

interface NewTopicStageProps {
  onNext: () => void;
  onPrev: () => void;
}

export const NewTopicStage: React.FC<NewTopicStageProps> = ({ onNext, onPrev }) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Scale secret state
  const [step1LeftApples, setStep1LeftApples] = useState(3);
  const [step1RightApples, setStep1RightApples] = useState(8);
  const [step1BalancedSecret, setStep1BalancedSecret] = useState(false);

  // Step 2: Sorting game state
  const sortingCards = [
    { id: 'c1', text: '5 + x = 9', isEquation: true },
    { id: 'c2', text: '5 + 4 = 9', isEquation: false, reason: "Noma'lum harf yo'q" },
    { id: 'c3', text: '7 > 3', isEquation: false, reason: "Tenglik emas, tengsizlik" },
    { id: 'c4', text: 'x − 2 = 6', isEquation: true },
    { id: 'c5', text: '12 − 4', isEquation: false, reason: "Tenglik belgisi yo'q" },
    { id: 'c6', text: '15 − x = 8', isEquation: true },
  ];
  const [sortedCards, setSortedCards] = useState<{ [id: string]: 'equation' | 'not' }>({});

  // Step 3: Type selection
  const [selectedType, setSelectedType] = useState<1 | 2 | 3 | 4>(1);
  const [typeUnfoldedSteps, setTypeUnfoldedSteps] = useState<{ [key: number]: number }>({
    1: 3,
    2: 1,
    3: 1,
    4: 1,
  });

  // Step 4: Guided practice
  const [guidedStepIndex, setGuidedStepIndex] = useState(0);
  const [guidedSelectedRule, setGuidedSelectedRule] = useState<string | null>(null);
  const [guidedAnswer, setGuidedAnswer] = useState<number | null>(null);

  // Step 1 logic
  const handleRemoveOneEach = () => {
    sound.playClick();
    if (step1LeftApples > 0 && step1RightApples > 5) {
      setStep1LeftApples((prev) => prev - 1);
      setStep1RightApples((prev) => prev - 1);
    }
  };

  const handleRevealMystery = () => {
    sound.playStar();
    setStep1BalancedSecret(true);
  };

  // Step 2 logic
  const handleSort = (cardId: string, basket: 'equation' | 'not') => {
    sound.playClick();
    const card = sortingCards.find((c) => c.id === cardId);
    if (!card) return;
    const isCorrect = (basket === 'equation' && card.isEquation) || (basket === 'not' && !card.isEquation);
    if (isCorrect) {
      sound.playCorrect();
      setSortedCards((prev) => ({ ...prev, [cardId]: basket }));
    } else {
      sound.playTryAgain();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-[var(--accent-blue)] uppercase tracking-wider">
            4-bosqich · ⏱ 10 daqiqa
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            Yangi mavzu: Tenglamalar ⚖️
          </h1>
        </div>

        {/* CPA Steps Pills */}
        <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-1 rounded-2xl border border-[var(--border-color)]">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveStep(s as 1 | 2 | 3 | 4 | 5);
              }}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-xs font-bold transition-all ${
                activeStep === s
                  ? 'bg-[var(--accent-blue)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: CONCRETE (TAROZI SIRLARI) */}
      {activeStep === 1 && (
        <div className="space-y-4">
          <CharacterGuide
            message="1-qadam: Tarozi sirlari! Chap pallada sirli quti (x) va 3 ta olma bor. O'ng pallada esa 8 ta olma. Tarozi teng turishi uchun ikkala tomondan ham 3 tadan olma olamiz!"
            mood="thinking"
          />

          <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
            <Scale
              leftWeight={5 + step1LeftApples}
              rightWeight={step1RightApples}
              leftApplesCount={step1LeftApples}
              rightApplesCount={step1RightApples}
              hasMysteryBoxOnLeft={true}
              leftLabel={`x + ${step1LeftApples} olma`}
              rightLabel={`${step1RightApples} olma`}
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRemoveOneEach}
                disabled={step1LeftApples === 0}
                className="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[var(--accent-yellow-bg)] text-amber-900 border border-amber-300 hover:brightness-95 disabled:opacity-40"
              >
                🍎 Ikkala tomondan 1 tadan olma olish
              </button>

              {step1LeftApples === 0 && !step1BalancedSecret && (
                <button
                  type="button"
                  onClick={handleRevealMystery}
                  className="py-2.5 px-5 rounded-xl font-black text-xs sm:text-sm bg-emerald-600 text-white hover:brightness-105 shadow-xs"
                >
                  Sirni ochish! ✨
                </button>
              )}
            </div>

            {step1BalancedSecret && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 text-center space-y-2"
              >
                <span className="text-2xl">🎉</span>
                <h4 className="font-black text-base text-emerald-800 dark:text-emerald-300">
                  Qoyil! x = 5 ekan!
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  Chunki 8 ta olmadan 3 tasini olib tashlaganimizda roppa-rosa 5 ta qoldi (8 − 3 = 5)!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="mt-2 py-2 px-5 rounded-xl bg-[var(--accent-blue)] text-white text-xs font-bold hover:brightness-105"
                >
                  2-qadam: Tenglama ta'rifiga o'tish →
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: PICTORIAL DEFINITION & SORTING */}
      {activeStep === 2 && (
        <div className="space-y-4">
          <CharacterGuide
            message="2-qadam: Ta'rif! Tenglama — bu ichida noma'lum son (x) bo'lgan tenglikdir. Keling, quyidagi kartochkalarni savatlarga ajratamiz!"
            mood="happy"
          />

          <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-6">
            {/* Definition Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-400/40 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-blue)]">
                Oltin qoida
              </span>
              <p className="text-base sm:text-lg font-black text-[var(--text-primary)] mt-1">
                "Tenglama — noma'lum son qatnashgan TENGLIKDIR!"
              </p>
              <div className="flex items-center justify-center gap-4 mt-2 text-xs font-bold text-[var(--text-secondary)]">
                <span className="text-emerald-600">x + 4 = 10 ✅ Tenglama</span>
                <span>·</span>
                <span className="text-rose-500">6 + 4 = 10 ❌ (x yo'q)</span>
                <span>·</span>
                <span className="text-rose-500">8 &gt; 3 ❌ (tenglik emas)</span>
              </div>
            </div>

            {/* Sorting Baskets & Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basket 1: Tenglama */}
              <div className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col items-center">
                <span className="text-3xl mb-1">🧺 ✅</span>
                <h4 className="font-black text-sm text-emerald-800 dark:text-emerald-300">
                  TENGLAMA
                </h4>
                <div className="w-full mt-3 space-y-2">
                  {sortingCards
                    .filter((c) => sortedCards[c.id] === 'equation')
                    .map((c) => (
                      <div
                        key={c.id}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-400 text-center font-black text-emerald-700 shadow-2xs"
                      >
                        {c.text}
                      </div>
                    ))}
                </div>
              </div>

              {/* Basket 2: Tenglama emas */}
              <div className="p-4 rounded-2xl border-2 border-rose-300 bg-rose-50/40 dark:bg-rose-950/20 flex flex-col items-center">
                <span className="text-3xl mb-1">🧺 ❌</span>
                <h4 className="font-black text-sm text-rose-800 dark:text-rose-300">
                  TENGLAMA EMAS
                </h4>
                <div className="w-full mt-3 space-y-2">
                  {sortingCards
                    .filter((c) => sortedCards[c.id] === 'not')
                    .map((c) => (
                      <div
                        key={c.id}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-300 text-center font-bold text-xs text-rose-600 shadow-2xs"
                      >
                        {c.text} {c.reason && `(${c.reason})`}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Available cards to sort */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--text-secondary)]">
                Kartochkani tegishli savatga bosing:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sortingCards
                  .filter((c) => !sortedCards[c.id])
                  .map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-xs flex flex-col items-center justify-between gap-2"
                    >
                      <span className="font-mono font-black text-base text-[var(--text-primary)]">
                        {c.text}
                      </span>
                      <div className="flex items-center gap-1.5 w-full">
                        <button
                          type="button"
                          onClick={() => handleSort(c.id, 'equation')}
                          className="flex-1 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        >
                          Tenglama
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSort(c.id, 'not')}
                          className="flex-1 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 hover:bg-rose-200"
                        >
                          Emas
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {Object.keys(sortedCards).length === sortingCards.length && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="py-2.5 px-6 rounded-xl bg-[var(--accent-blue)] text-white text-xs sm:text-sm font-black hover:brightness-105"
                >
                  Barcha kartalar to'g'ri joylandi! 3-qadam: Qoidalarga o'tish →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: 3 CORE TYPES & RULES WITH CHECK STEP */}
      {activeStep === 3 && (
        <div className="space-y-4">
          <CharacterGuide
            message="3-qadam: 3 ta oltin qoida! Har bir turda x ni qanday topish va eng muhimi TEKSHIRISH qadamini ko'rib chiqamiz."
            mood="celebrating"
          />

          <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-6">
            {/* Rule Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 1, label: '1-tur: x + a = b', color: 'border-blue-400' },
                { id: 2, label: '2-tur: x − a = b', color: 'border-amber-400' },
                { id: 3, label: '3-tur: a − x = b', color: 'border-purple-400' },
                { id: 4, label: '⭐ Ko\'paytirish', color: 'border-emerald-400' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedType(r.id as 1 | 2 | 3 | 4);
                  }}
                  className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-black border transition-all ${
                    selectedType === r.id
                      ? 'bg-[var(--accent-blue)] text-white shadow-xs'
                      : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Display Current Rule */}
            <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-4">
              {selectedType === 1 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      1-tur: Noma'lum qo'shiluvchini topish
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-900">
                      x + a = b
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-black text-[var(--text-primary)]">
                    Qoida: "Noma'lum qo'shiluvchini topish uchun yig'indidan ma'lum qo'shiluvchini ayiramiz."
                  </p>

                  <div className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-strong)] space-y-2 font-mono">
                    <div className="text-lg sm:text-xl font-black text-blue-600">x + 5 = 12</div>
                    <div className="text-sm font-bold text-[var(--text-secondary)]">x = 12 − 5</div>
                    <div className="text-base font-black text-emerald-600">x = 7</div>
                    {/* Mandatory Check Step */}
                    <div className="mt-2 pt-2 border-t border-[var(--border-color)] text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      🔍 <strong>Tekshirish:</strong> 7 + 5 = 12 ✅ (Tenglik to'g'ri!)
                    </div>
                  </div>
                </div>
              )}

              {selectedType === 2 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                      2-tur: Kamayuvchini topish
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                      x − a = b
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-black text-[var(--text-primary)]">
                    Qoida: "Noma'lum kamayuvchini topish uchun ayirmaga ayriluvchini qo'shamiz (kamayuvchi eng katta son!)."
                  </p>

                  <div className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-strong)] space-y-2 font-mono">
                    <div className="text-lg sm:text-xl font-black text-amber-600">x − 6 = 8</div>
                    <div className="text-sm font-bold text-[var(--text-secondary)]">x = 8 + 6</div>
                    <div className="text-base font-black text-emerald-600">x = 14</div>
                    {/* Mandatory Check Step */}
                    <div className="mt-2 pt-2 border-t border-[var(--border-color)] text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      🔍 <strong>Tekshirish:</strong> 14 − 6 = 8 ✅ (Tenglik to'g'ri!)
                    </div>
                  </div>
                </div>
              )}

              {selectedType === 3 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                      3-tur: Ayriluvchini topish
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900">
                      a − x = b
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-black text-[var(--text-primary)]">
                    Qoida: "Noma'lum ayriluvchini topish uchun kamayuvchidan ayirmani ayiramiz."
                  </p>

                  <div className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-strong)] space-y-2 font-mono">
                    <div className="text-lg sm:text-xl font-black text-purple-600">15 − x = 9</div>
                    <div className="text-sm font-bold text-[var(--text-secondary)]">x = 15 − 9</div>
                    <div className="text-base font-black text-emerald-600">x = 6</div>
                    {/* Mandatory Check Step */}
                    <div className="mt-2 pt-2 border-t border-[var(--border-color)] text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      🔍 <strong>Tekshirish:</strong> 15 − 6 = 9 ✅ (Tenglik to'g'ri!)
                    </div>
                  </div>
                </div>
              )}

              {selectedType === 4 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      ⭐ Yulduzcha daraja: Ko'paytirish & Bo'lish
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                      x · a = b
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-black text-[var(--text-primary)]">
                    Qoida: "Noma'lum ko'paytuvchini topish uchun ko'paytmani ma'lum ko'paytuvchiga bo'lamiz."
                  </p>

                  <div className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-strong)] space-y-2 font-mono">
                    <div className="text-lg sm:text-xl font-black text-emerald-600">x · 3 = 12</div>
                    <div className="text-sm font-bold text-[var(--text-secondary)]">x = 12 : 3</div>
                    <div className="text-base font-black text-emerald-600">x = 4</div>
                    <div className="mt-2 pt-2 border-t border-[var(--border-color)] text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      🔍 <strong>Tekshirish:</strong> 4 · 3 = 12 ✅ (Tenglik to'g'ri!)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="py-2.5 px-6 rounded-xl bg-[var(--accent-blue)] text-white text-xs sm:text-sm font-black hover:brightness-105"
              >
                4-qadam: Birga yechamiz (Amaliy mashq) →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: GUIDED PRACTICE */}
      {activeStep === 4 && (
        <div className="space-y-4">
          <CharacterGuide
            message="4-qadam: Birga yechamiz! Qadam-baqadam yo'naltiruvchi savollarga javob berib, tenglamani to'liq yeching."
            mood="thinking"
          />

          <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-5 max-w-xl mx-auto">
            <div className="text-center py-3 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-strong)]">
              <span className="text-2xl sm:text-3xl font-black font-mono text-[var(--text-primary)]">
                x + 9 = 25
              </span>
            </div>

            {/* Sub-step 1: Identify type & rule */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--text-secondary)]">
                1. Bu qaysi turdagi tenglama va qanday qoida ishlatiladi?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'sub', text: "Yig'indidan ayiramiz: x = 25 − 9" },
                  { id: 'add', text: "Qo'shamiz: x = 25 + 9" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setGuidedSelectedRule(item.id);
                      if (item.id === 'sub') sound.playCorrect();
                      else sound.playTryAgain();
                    }}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                      guidedSelectedRule === item.id
                        ? item.id === 'sub'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                          : 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-step 2: Calculate result */}
            {guidedSelectedRule === 'sub' && (
              <div className="space-y-2 animate-in fade-in">
                <span className="text-xs font-bold text-[var(--text-secondary)]">
                  2. 25 − 9 necha bo'ladi?
                </span>
                <div className="flex items-center gap-2">
                  {[14, 16, 17, 34].map((ans) => (
                    <button
                      key={ans}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setGuidedAnswer(ans);
                        if (ans === 16) sound.playCorrect();
                        else sound.playTryAgain();
                      }}
                      className={`flex-1 py-2.5 rounded-xl font-black text-base border transition-all ${
                        guidedAnswer === ans
                          ? ans === 16
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-blue)]'
                      }`}
                    >
                      {ans}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-step 3: Check confirmation */}
            {guidedAnswer === 16 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 space-y-2 text-center"
              >
                <div className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  🎉 Barakalla! Tekshiramiz: 16 + 9 = 25 ✅
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStep(5)}
                  className="py-2 px-5 rounded-xl bg-[var(--accent-blue)] text-white text-xs font-bold hover:brightness-105"
                >
                  5-qadam: Xulosa plakatini ko'rish →
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* STEP 5: SUMMARY POSTER */}
      {activeStep === 5 && (
        <div className="space-y-4">
          <CharacterGuide
            message="5-qadam: Xulosa plakati! Mana shu uchta qoidani eslab qolsangiz, har qanday tenglamani oson yecha olasiz!"
            mood="celebrating"
          />

          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Eslab qolish plakati
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                TENGLAMALAR SIRLARI
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-2">
                <span className="text-xs font-bold text-sky-300">1. Qo'shish</span>
                <div className="font-mono text-lg font-black text-amber-300">x + a = b</div>
                <div className="font-mono text-sm font-bold text-emerald-300">x = b − a</div>
                <p className="text-[11px] text-slate-300">
                  Noma'lum qo'shiluvchini topish uchun <strong>ayiramiz</strong>!
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-2">
                <span className="text-xs font-bold text-amber-300">2. Kamayuvchi</span>
                <div className="font-mono text-lg font-black text-amber-300">x − a = b</div>
                <div className="font-mono text-sm font-bold text-emerald-300">x = b + a</div>
                <p className="text-[11px] text-slate-300">
                  Kamayuvchi eng katta son, uni topish uchun <strong>qo'shamiz</strong>!
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-2">
                <span className="text-xs font-bold text-pink-300">3. Ayriluvchi</span>
                <div className="font-mono text-lg font-black text-amber-300">a − x = b</div>
                <div className="font-mono text-sm font-bold text-emerald-300">x = a − b</div>
                <p className="text-[11px] text-slate-300">
                  Ayriluvchini topish uchun kamayuvchidan <strong>ayiramiz</strong>!
                </p>
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl text-center text-xs sm:text-sm font-bold text-amber-200">
              💡 Har doim topilgan sonni x o'rniga qo'yib <strong>TEKSHIRING</strong>!
            </div>
          </div>
        </div>
      )}

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
          <span>Takrorlash</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onNext();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm sm:text-base text-white bg-[var(--accent-blue)] hover:brightness-105 active:scale-98 transition-all shadow-md"
        >
          <span>Keyingi: Mashq & O'yinlar</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
