import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, Star, Sparkles, Check, HelpCircle, Trophy, RotateCcw, Volume2, Timer } from 'lucide-react';
import { CharacterGuide } from '../components/CharacterGuide';
import { Scale } from '../components/Scale';
import { MagicBox } from '../components/MagicBox';
import { NumberLine } from '../components/NumberLine';
import { DifficultyLevel, EquationItem, generateEquation } from '../lib/equationGenerator';
import { sound } from '../lib/sound';
import { getStorageItem, setStorageItem } from '../lib/storage';

interface PracticeStageProps {
  onNext: () => void;
  onPrev: () => void;
  onUnlockBadge?: (badgeId: string) => void;
  onEarnStars?: (count: number) => void;
}

export const PracticeStage: React.FC<PracticeStageProps> = ({
  onNext,
  onPrev,
  onUnlockBadge,
  onEarnStars,
}) => {
  const [level, setLevel] = useState<DifficultyLevel>(() =>
    getStorageItem('practice_level', 'maysa')
  );
  const [selectedGameId, setSelectedGameId] = useState<number>(1);
  const [consecutiveRights, setConsecutiveRights] = useState(0);
  const [consecutiveWrongs, setConsecutiveWrongs] = useState(0);
  const [adaptiveSuggestion, setAdaptiveSuggestion] = useState<string | null>(null);

  // 1) Tarozini muvozanatla state
  const [scaleLeft, setScaleLeft] = useState(12); // e.g. x + 4 = 12 -> x is 8
  const [scaleTargetX, setScaleTargetX] = useState(8);
  const [scaleAddedWeights, setScaleAddedWeights] = useState<number[]>([]);
  const [scaleSuccess, setScaleSuccess] = useState(false);

  // 2) Sirli quti state
  const [boxEq, setBoxEq] = useState<EquationItem>(() => generateEquation('maysa'));
  const [boxIsOpen, setBoxIsOpen] = useState(false);
  const [boxSelectedAns, setBoxSelectedAns] = useState<number | null>(null);

  // 3) Memory Game (Tenglama ustasi)
  interface MemoryCard {
    id: number;
    text: string;
    pairId: number;
    isFlipped: boolean;
    isMatched: boolean;
  }
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>(() => [
    { id: 1, text: 'x + 3 = 10', pairId: 1, isFlipped: false, isMatched: false },
    { id: 2, text: 'x = 7', pairId: 1, isFlipped: false, isMatched: false },
    { id: 3, text: 'x − 4 = 8', pairId: 2, isFlipped: false, isMatched: false },
    { id: 4, text: 'x = 12', pairId: 2, isFlipped: false, isMatched: false },
    { id: 5, text: '15 − x = 9', pairId: 3, isFlipped: false, isMatched: false },
    { id: 6, text: 'x = 6', pairId: 3, isFlipped: false, isMatched: false },
  ]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // 4) Detective state
  const detectiveProblems = [
    {
      eq: 'x + 6 = 14',
      wrongStep: 'x = 14 + 6 = 20',
      mistake: "Qo'shish o'rniga ayirish kerak edi (x = 14 − 6 = 8)",
      correctX: 8,
      choices: ['Qo\'shish o\'rniga ayirish kerak edi', 'To\'g\'ri yechilgan', '14 emas 15 bo\'lishi kerak'],
      correctChoice: 'Qo\'shish o\'rniga ayirish kerak edi',
    },
    {
      eq: 'x − 5 = 11',
      wrongStep: 'x = 11 − 5 = 6',
      mistake: "Kamayuvchini topishda qo'shish kerak (x = 11 + 5 = 16)",
      correctX: 16,
      choices: ['Kamayuvchini topishda qo\'shish kerak edi', 'To\'g\'ri yechilgan', '5 o\'rniga 6 qo\'yilgan'],
      correctChoice: 'Kamayuvchini topishda qo\'shish kerak edi',
    },
  ];
  const [detectiveIdx, setDetectiveIdx] = useState(0);
  const [detectiveAnswered, setDetectiveAnswered] = useState<string | null>(null);

  // 5) Team Race state (Smartboard 2 teams)
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [raceEq, setRaceEq] = useState<EquationItem>(() => generateEquation('nihol'));

  // 6) Build your own equation state
  // Story: "Savatda x ta olma bor edi, 4 tasini yedik, 6 ta qoldi" -> [x, −, 4, =, 6]
  const [builderTokens, setBuilderTokens] = useState<string[]>([]);
  const [builderSuccess, setBuilderSuccess] = useState(false);

  // 7) Quiet Practice (Jim-jit)
  const [quietEq, setQuietEq] = useState<EquationItem>(() => generateEquation(level));
  const [quietCount, setQuietCount] = useState(0);
  const [quietAns, setQuietAns] = useState<number | null>(null);

  const handleLevelChange = (lvl: DifficultyLevel) => {
    sound.playClick();
    setLevel(lvl);
    setStorageItem('practice_level', lvl);
    setBoxEq(generateEquation(lvl));
    setQuietEq(generateEquation(lvl));
  };

  const checkAdaptive = (success: boolean) => {
    if (success) {
      const nextR = consecutiveRights + 1;
      setConsecutiveRights(nextR);
      setConsecutiveWrongs(0);
      if (nextR >= 3 && level !== 'daraxt') {
        setAdaptiveSuggestion("Ajoyib natija! Daraxt 🌳 darajasiga o'tamizmi?");
      }
    } else {
      const nextW = consecutiveWrongs + 1;
      setConsecutiveWrongs(nextW);
      setConsecutiveRights(0);
      if (nextW >= 3 && level !== 'maysa') {
        setAdaptiveSuggestion("Biroz yordam kerakmi? Maysa 🌱 darajasiga o'tishni tavsiya qilamiz.");
      }
    }
  };

  // --- GAME 1: SCALE BALANCE ---
  const handleAddWeight = (wt: number) => {
    sound.playClick();
    const updated = [...scaleAddedWeights, wt];
    setScaleAddedWeights(updated);
    const sum = updated.reduce((a, b) => a + b, 0);
    if (sum === scaleTargetX) {
      sound.playVictory();
      setScaleSuccess(true);
      if (onUnlockBadge) onUnlockBadge('scale_master');
      if (onEarnStars) onEarnStars(1);
      checkAdaptive(true);
    } else if (sum > scaleTargetX) {
      sound.playTryAgain();
    }
  };

  const handleResetScale = () => {
    sound.playClick();
    setScaleAddedWeights([]);
    setScaleSuccess(false);
  };

  // --- GAME 2: MAGIC BOX ---
  const handleBoxAnswer = (ans: number) => {
    sound.playClick();
    setBoxSelectedAns(ans);
    if (ans === boxEq.x) {
      setBoxIsOpen(true);
      sound.playVictory();
      if (onUnlockBadge) onUnlockBadge('first_equation');
      if (onEarnStars) onEarnStars(1);
      checkAdaptive(true);
    } else {
      sound.playTryAgain();
      checkAdaptive(false);
    }
  };

  const handleBoxNext = () => {
    sound.playClick();
    setBoxEq(generateEquation(level));
    setBoxIsOpen(false);
    setBoxSelectedAns(null);
  };

  // --- GAME 3: MEMORY MATCH ---
  const handleCardClick = (id: number) => {
    sound.playClick();
    const card = memoryCards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    setMemoryCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      const first = memoryCards.find((c) => c.id === newFlipped[0]);
      const second = memoryCards.find((c) => c.id === newFlipped[1]);

      if (first && second && first.pairId === second.pairId) {
        sound.playCorrect();
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) =>
              c.pairId === first.pairId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCards([]);
          if (onEarnStars) onEarnStars(1);
        }, 500);
      } else {
        sound.playTryAgain();
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) =>
              newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  // --- GAME 4: DETECTIVE ---
  const handleDetectiveChoice = (choice: string) => {
    sound.playClick();
    setDetectiveAnswered(choice);
    const curr = detectiveProblems[detectiveIdx];
    if (choice === curr.correctChoice) {
      sound.playVictory();
      if (onUnlockBadge) onUnlockBadge('detective');
      if (onEarnStars) onEarnStars(1);
      checkAdaptive(true);
    } else {
      sound.playTryAgain();
      checkAdaptive(false);
    }
  };

  // --- GAME 5: RACE ---
  const handleTeamPoint = (team: 'A' | 'B') => {
    sound.playVictory();
    if (team === 'A') setTeamAScore((p) => p + 1);
    else setTeamBScore((p) => p + 1);
    setRaceEq(generateEquation(level));
  };

  // --- GAME 6: BUILD EQUATION ---
  const handleAddToken = (token: string) => {
    sound.playClick();
    const updated = [...builderTokens, token];
    setBuilderTokens(updated);
    if (updated.join(' ') === 'x − 4 = 6' || updated.join(' ') === 'x - 4 = 6') {
      sound.playVictory();
      setBuilderSuccess(true);
      if (onEarnStars) onEarnStars(1);
    }
  };

  // --- GAME 7: QUIET PRACTICE ---
  const handleQuietAnswer = (ans: number) => {
    sound.playClick();
    setQuietAns(ans);
    if (ans === quietEq.x) {
      sound.playCorrect();
      setQuietCount((p) => p + 1);
      setTimeout(() => {
        setQuietEq(generateEquation(level));
        setQuietAns(null);
      }, 700);
    } else {
      sound.playTryAgain();
    }
  };

  const games = [
    { id: 1, name: "Tarozini muvozanatla", emoji: "⚖️" },
    { id: 2, name: "Sirli quti", emoji: "🎁" },
    { id: 3, name: "Qurbaqa sakrashi", emoji: "🐸" },
    { id: 4, name: "Tenglama ustasi (Juftlash)", emoji: "🃏" },
    { id: 5, name: "Xatoni top, detektiv", emoji: "🕵️" },
    { id: 6, name: "Tenglama-poyga (2 jamoa)", emoji: "🏁" },
    { id: 7, name: "O'zing tenglama tuz", emoji: "🧩" },
    { id: 8, name: "Jim-jit mashq (Workly)", emoji: "📒" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header & Level Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-[var(--accent-blue)] uppercase tracking-wider">
            5-bosqich · ⏱ 12 daqiqa
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            Mashqlar & O'yinlar maydoni 🎮
          </h1>
        </div>

        {/* 3 Difficulty Tiers Pill Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl">
          {(['maysa', 'nihol', 'daraxt'] as DifficultyLevel[]).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => handleLevelChange(lvl)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                level === lvl
                  ? 'bg-[var(--accent-blue)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              {lvl === 'maysa' ? '🌱 Maysa' : lvl === 'nihol' ? '🌿 Nihol' : '🌳 Daraxt'}
            </button>
          ))}
        </div>
      </div>

      {/* Adaptive Recommendation Alert */}
      {adaptiveSuggestion && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 flex items-center justify-between gap-2 text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300 animate-in fade-in">
          <span>💡 {adaptiveSuggestion}</span>
          <button
            type="button"
            onClick={() => setAdaptiveSuggestion(null)}
            className="text-xs px-2 py-1 rounded-md bg-amber-200/80 text-amber-900"
          >
            Yopish
          </button>
        </div>
      )}

      {/* 8 Games Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {games.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => {
              sound.playClick();
              setSelectedGameId(g.id);
            }}
            className={`py-2 px-3.5 rounded-2xl text-xs font-bold whitespace-nowrap border flex items-center gap-1.5 transition-all ${
              selectedGameId === g.id
                ? 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)] shadow-xs'
                : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <span>{g.emoji}</span>
            <span>{g.name}</span>
          </button>
        ))}
      </div>

      {/* Game Stage Arena Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm min-h-[350px]">
        {/* GAME 1: SCALE BALANCE */}
        {selectedGameId === 1 && (
          <div className="space-y-4 max-w-xl mx-auto text-center">
            <h3 className="font-black text-base sm:text-lg text-[var(--text-primary)]">
              ⚖️ Tarozini muvozanatlang!
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Tenglama: <strong>x + 4 = 12</strong>. Chap pallaga og'irliklar qo'shib x qiymatini toping!
            </p>

            <Scale
              leftWeight={4 + scaleAddedWeights.reduce((a, b) => a + b, 0)}
              rightWeight={scaleLeft}
              leftLabel={`x + 4 (${4 + scaleAddedWeights.reduce((a, b) => a + b, 0)})`}
              rightLabel={`12`}
              leftApplesCount={4 + scaleAddedWeights.reduce((a, b) => a + b, 0)}
              rightApplesCount={scaleLeft}
            />

            {/* Weights to drag/click */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--text-secondary)]">
                Og'irliklar qo'shing:
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 5].map((wt) => (
                  <button
                    key={wt}
                    type="button"
                    onClick={() => handleAddWeight(wt)}
                    disabled={scaleSuccess}
                    className="w-12 h-12 rounded-2xl font-black text-base border border-amber-300 bg-amber-100 text-amber-900 hover:brightness-95 active:scale-95 shadow-xs"
                  >
                    +{wt}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleResetScale}
                  className="py-2 px-3 rounded-xl text-xs font-bold border border-[var(--border-color)] bg-[var(--bg-secondary)]"
                >
                  <RotateCcw className="w-4 h-4 inline" />
                </button>
              </div>
            </div>

            {scaleSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-300 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm"
              >
                🎉 Qoyil! Tarozi tenglashdi! x = 8 ekan!
              </motion.div>
            )}
          </div>
        )}

        {/* GAME 2: MAGIC BOX */}
        {selectedGameId === 2 && (
          <div className="space-y-4 max-w-lg mx-auto text-center">
            <h3 className="font-black text-base sm:text-lg text-[var(--text-primary)]">
              🎁 Sirli quti o'yini
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Tenglamani yeching va javobni qutiga yuboring:
            </p>

            <div className="py-3 px-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-strong)] inline-block font-mono text-2xl sm:text-3xl font-black text-[var(--accent-blue)]">
              {boxEq.expression}
            </div>

            <MagicBox isOpen={boxIsOpen} revealedValue={boxEq.x} />

            {/* Answer Options */}
            {!boxIsOpen ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {boxEq.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleBoxAnswer(opt)}
                    className="py-3 rounded-2xl font-black text-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--accent-blue)] active:scale-95"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2 animate-in fade-in">
                <div className="text-xs sm:text-sm font-bold text-emerald-600">
                  {boxEq.checkStep}
                </div>
                <button
                  type="button"
                  onClick={handleBoxNext}
                  className="py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm bg-[var(--accent-blue)] text-white hover:brightness-105 shadow-xs"
                >
                  Keyingi tenglama →
                </button>
              </div>
            )}
          </div>
        )}

        {/* GAME 3: NUMBER LINE FROG */}
        {selectedGameId === 3 && (
          <div className="space-y-4 max-w-xl mx-auto text-center">
            <h3 className="font-black text-base sm:text-lg text-[var(--text-primary)]">
              🐸 Qurbaqa sakrashi
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Tenglama: <strong>x + 5 = 12</strong>. Qurbaqa x dan 5 qadam sakrab 12 ga yetdi. x nechchi?
            </p>
            <NumberLine min={0} max={15} start={7} jump={5} target={12} />
          </div>
        )}

        {/* GAME 4: MEMORY MATCH */}
        {selectedGameId === 4 && (
          <div className="space-y-4 max-w-lg mx-auto text-center">
            <h3 className="font-black text-base sm:text-lg text-[var(--text-primary)]">
              🃏 Tenglama ustasi (Kartalar juftligi)
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Tenglamani uning yechimi bilan juftlang!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {memoryCards.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleCardClick(c.id)}
                  className={`h-24 rounded-2xl border-2 flex items-center justify-center font-black text-base cursor-pointer select-none transition-all shadow-xs ${
                    c.isMatched
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-60'
                      : c.isFlipped
                      ? 'bg-[var(--accent-blue-bg)] border-[var(--accent-blue)] text-[var(--accent-blue)]'
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 text-white'
                  }`}
                >
                  {c.isFlipped || c.isMatched ? c.text : '❓'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GAME 5: DETECTIVE */}
        {selectedGameId === 5 && (
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="text-center">
              <h3 className="font-black text-base sm:text-lg text-[var(--text-primary)]">
                🕵️ Xatoni top, detektiv!
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Noto'g'ri yechilgan tenglamadagi xatoni toping:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-300 font-mono text-center space-y-1">
              <div className="text-lg font-bold text-[var(--text-primary)]">
                {detectiveProblems[detectiveIdx].eq}
              </div>
              <div className="text-rose-600 font-black text-base line-through">
                {detectiveProblems[detectiveIdx].wrongStep} ❌
              </div>
            </div>

            <div className="space-y-2">
              {detectiveProblems[detectiveIdx].choices.map((c) => {
                const isSelected = detectiveAnswered === c;
                const isCorrect = c === detectiveProblems[detectiveIdx].correctChoice;

                let btnClass = 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-amber-400';
                if (detectiveAnswered) {
                  if (isCorrect) btnClass = 'bg-emerald-500 text-white border-emerald-600';
                  else if (isSelected) btnClass = 'bg-rose-100 text-rose-800 border-rose-300';
                }

                return (
                  <button
                    key={c}
                    type="button"
                    disabled={detectiveAnswered !== null}
                    onClick={() => handleDetectiveChoice(c)}
                    className={`w-full p-3 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all ${btnClass}`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            {detectiveAnswered && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDetectiveIdx((p) => (p + 1) % detectiveProblems.length);
                    setDetectiveAnswered(null);
                  }}
                  className="py-2 px-5 rounded-xl bg-[var(--accent-blue)] text-white text-xs font-bold"
                >
                  Keyingi detektiv topshirig'i →
                </button>
              </div>
            )}
          </div>
        )}

        {/* GAME 6: TEAM RACE (SMARTBOARD) */}
        {selectedGameId === 6 && (
          <div className="space-y-6 max-w-xl mx-auto text-center">
            <h3 className="font-black text-base sm:text-lg text-[var(--text-primary)]">
              🏁 Tenglama-poyga (Doskada 2 jamoa)
            </h3>

            {/* Scoreboard */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-400">
                <span className="text-xs font-black uppercase text-blue-600">A-Jamoa</span>
                <div className="text-3xl sm:text-4xl font-black text-blue-700 mt-1">
                  {teamAScore} ball
                </div>
                <button
                  type="button"
                  onClick={() => handleTeamPoint('A')}
                  className="mt-3 w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:brightness-105"
                >
                  +1 Ball berish
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-400">
                <span className="text-xs font-black uppercase text-amber-600">B-Jamoa</span>
                <div className="text-3xl sm:text-4xl font-black text-amber-700 mt-1">
                  {teamBScore} ball
                </div>
                <button
                  type="button"
                  onClick={() => handleTeamPoint('B')}
                  className="mt-3 w-full py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:brightness-105"
                >
                  +1 Ball berish
                </button>
              </div>
            </div>

            {/* Active Race Equation */}
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-strong)]">
              <span className="text-xs font-bold text-[var(--text-secondary)]">Jamoalar uchun misol:</span>
              <div className="font-mono text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-1">
                {raceEq.expression}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                (To'g'ri javob: x = {raceEq.x})
              </div>
            </div>
          </div>
        )}

        {/* GAME 7: BUILD YOUR OWN EQUATION */}
        {selectedGameId === 7 && (
          <div className="space-y-4 max-w-lg mx-auto text-center">
            <h3 className="font-black text-base sm:text-lg text-[var(--text-primary)]">
              🧩 O'zing tenglama tuz!
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Hikoya: <em>"Savatda bir nechta (x) olma bor edi, 4 tasini yedik, 6 ta qoldi."</em>
            </p>

            {/* Drop / Builder Zone */}
            <div className="min-h-[56px] p-3 rounded-2xl border-2 border-dashed border-[var(--accent-blue)] bg-[var(--bg-secondary)] flex items-center justify-center gap-2 font-mono text-xl font-black">
              {builderTokens.length > 0 ? (
                builderTokens.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-strong)]">
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-xs font-semibold text-[var(--text-muted)]">
                  Quyidagi bo'laklarni bosib tenglama tuzing...
                </span>
              )}
            </div>

            {/* Token Bank */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['x', '−', '+', '4', '=', '6', '10'].map((tk) => (
                <button
                  key={tk}
                  type="button"
                  onClick={() => handleAddToken(tk)}
                  className="w-12 h-12 rounded-2xl font-black text-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent-blue)]"
                >
                  {tk}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setBuilderTokens([])}
                className="px-3 py-2 rounded-xl text-xs font-bold border border-rose-200 text-rose-600 bg-rose-50"
              >
                Tozalash
              </button>
            </div>

            {builderSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-300 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm">
                🎉 To'g'ri! x − 4 = 6 bo'ladi. Dastlab x = 10 ta olma bo'lgan!
              </div>
            )}
          </div>
        )}

        {/* GAME 8: QUIET PRACTICE (JIM-JIT) */}
        {selectedGameId === 8 && (
          <div className="space-y-4 max-w-md mx-auto text-center">
            <h3 className="font-black text-base sm:text-lg text-[var(--text-primary)]">
              📒 Jim-jit mashq (Workly tinch rejim)
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Taymersiz, ovozsiz, xotirjam ketma-ketlik:
            </p>

            <div className="py-2 text-xs font-bold text-[var(--text-muted)]">
              Yechilgan: {quietCount} / 10
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-strong)] font-mono text-3xl font-black text-[var(--text-primary)]">
              {quietEq.expression}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {quietEq.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleQuietAnswer(opt)}
                  className="py-3 rounded-2xl font-black text-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--accent-blue)]"
                >
                  {opt}
                </button>
              ))}
            </div>
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
          <span>Yangi mavzu</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onNext();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm sm:text-base text-white bg-[var(--accent-blue)] hover:brightness-105 active:scale-98 transition-all shadow-md"
        >
          <span>Keyingi: Test sinovi</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
