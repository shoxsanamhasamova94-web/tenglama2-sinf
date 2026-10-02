import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle, XCircle, RotateCcw, Timer, Award, Lightbulb } from 'lucide-react';
import { CharacterGuide } from '../components/CharacterGuide';
import { Keypad } from '../components/Keypad';
import { QuizQuestion, staticQuizQuestions } from '../data/questions';
import { DifficultyLevel, generateEquation } from '../lib/equationGenerator';
import { sound } from '../lib/sound';
import { getCurrentLanguage } from '../i18n';
import { getStorageItem, setStorageItem } from '../lib/storage';

interface QuizStageProps {
  onNext: () => void;
  onPrev: () => void;
  onQuizComplete?: (score: number, total: number) => void;
  onUnlockBadge?: (badgeId: string) => void;
}

export const QuizStage: React.FC<QuizStageProps> = ({
  onNext,
  onPrev,
  onQuizComplete,
  onUnlockBadge,
}) => {
  const [level, setLevel] = useState<DifficultyLevel>(() =>
    getStorageItem('quiz_level', 'nihol')
  );
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: string | number | boolean }>({});
  const [keypadInput, setKeypadInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(420); // 7 minutes
  const [isReviewingMistakes, setIsReviewingMistakes] = useState(false);
  const [mistakeList, setMistakeList] = useState<QuizQuestion[]>([]);

  const lang = getCurrentLanguage();

  // Load 10 questions for chosen level
  const initQuestions = (selectedLvl: DifficultyLevel) => {
    const filtered = staticQuizQuestions.filter((q) => q.level === selectedLvl);
    // Shuffle and pick 10
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, 10);
    // If less than 10, fill with generated
    while (chosen.length < 10) {
      const eq = generateEquation(selectedLvl);
      chosen.push({
        id: eq.id,
        format: 'choice',
        level: selectedLvl,
        questionUz: `Tenglamani yeching: ${eq.expression}`,
        questionRu: `Решите уравнение: ${eq.expression}`,
        questionEn: `Solve equation: ${eq.expression}`,
        expression: eq.expression,
        correctAnswer: eq.x,
        options: eq.options,
        stepExplanationUz: eq.ruleExplanationUz,
        stepExplanationRu: eq.ruleExplanationRu,
        stepExplanationEn: eq.ruleExplanationEn,
        checkStep: eq.checkStep,
        hintUz: eq.hint1Uz,
        hintRu: eq.hint1Ru,
        hintEn: eq.hint1En,
      });
    }

    setQuestions(chosen);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setKeypadInput('');
    setIsCompleted(false);
    setShowHint(false);
    setTimeLeft(420);
  };

  useEffect(() => {
    initQuestions(level);
  }, [level]);

  // Optional Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerEnabled && !isCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerEnabled, isCompleted, timeLeft]);

  const currentQ = questions[currentIndex];

  const handleSelectAnswer = (ans: string | number | boolean) => {
    if (!currentQ) return;
    sound.playClick();
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: ans }));
  };

  const handleKeypadSubmit = () => {
    if (!currentQ || !keypadInput) return;
    handleSelectAnswer(parseInt(keypadInput, 10));
    setKeypadInput('');
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    sound.playClick();
    setShowHint(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setKeypadInput('');
    } else {
      handleFinishQuiz();
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      sound.playClick();
      setCurrentIndex((prev) => prev - 1);
      setShowHint(false);
      setKeypadInput('');
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      const userAns = selectedAnswers[q.id];
      if (userAns !== undefined && String(userAns) === String(q.correctAnswer)) {
        correct++;
      }
    });
    return correct;
  };

  const handleFinishQuiz = () => {
    setIsCompleted(true);
    sound.playVictory();
    const correctCount = calculateScore();
    const mistakes = questions.filter((q) => {
      const userAns = selectedAnswers[q.id];
      return String(userAns) !== String(q.correctAnswer);
    });
    setMistakeList(mistakes);

    if (onQuizComplete) onQuizComplete(correctCount, questions.length);

    // Save test result in storage
    setStorageItem('last_quiz_result', {
      score: correctCount,
      total: questions.length,
      level,
      date: new Date().toLocaleDateString(),
    });
  };

  // Retake mistakes mode
  const handleReviewMistakes = () => {
    sound.playClick();
    if (mistakeList.length === 0) return;
    setQuestions(mistakeList);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setKeypadInput('');
    setIsCompleted(false);
    setIsReviewingMistakes(true);
    if (onUnlockBadge) onUnlockBadge('learned_from_mistakes');
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const score = calculateScore();
  const percentage = Math.round((score / (questions.length || 1)) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-[var(--accent-blue)] uppercase tracking-wider">
            6-bosqich · ⏱ 7 daqiqa
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            Bilimlarni sinash (Test) 📝
          </h1>
        </div>

        {/* Level Switcher & Optional Timer Toggle */}
        <div className="flex items-center gap-2">
          {!isCompleted && (
            <>
              {/* Level switcher */}
              <div className="flex items-center bg-[var(--bg-surface)] p-1 rounded-2xl border border-[var(--border-color)]">
                {(['maysa', 'nihol', 'daraxt'] as DifficultyLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setLevel(lvl);
                    }}
                    className={`py-1 px-2.5 rounded-xl text-xs font-bold transition-all ${
                      level === lvl
                        ? 'bg-[var(--accent-blue)] text-white'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {lvl === 'maysa' ? '🌱' : lvl === 'nihol' ? '🌿' : '🌳'}
                  </button>
                ))}
              </div>

              {/* Timer Toggle */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setTimerEnabled(!timerEnabled);
                }}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-2xl border text-xs font-bold transition-all ${
                  timerEnabled
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-color)]'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>{timerEnabled ? formatTimer(timeLeft) : 'Taymer'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {!isCompleted ? (
        /* ACTIVE TEST VIEW */
        <div className="space-y-4">
          {/* Progress Bar & Counter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]">
              <span>Savol: {currentIndex + 1} / {questions.length}</span>
              <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
              <motion.div
                className="h-full bg-[var(--accent-blue)] rounded-full"
                animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          {currentQ && (
            <div className="p-5 sm:p-7 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-6">
              {/* Question Text */}
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-[var(--accent-blue)] uppercase tracking-wider">
                  {currentQ.format === 'choice'
                    ? 'Variant tanlang'
                    : currentQ.format === 'keypad'
                    ? 'Klaviatura bilan kiriting'
                    : 'To\'g\'ri / Noto\'g\'ri'}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)]">
                  {lang === 'ru' ? currentQ.questionRu : lang === 'en' ? currentQ.questionEn : currentQ.questionUz}
                </h3>
              </div>

              {/* Expression Banner */}
              <div className="py-4 px-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-strong)] text-center font-mono text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
                {currentQ.expression}
              </div>

              {/* Format 1: 4 Multiple Choice */}
              {currentQ.format === 'choice' && currentQ.options && (
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedAnswers[currentQ.id] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectAnswer(opt)}
                        className={`py-3.5 px-4 rounded-2xl font-black text-lg border transition-all ${
                          isSelected
                            ? 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)] shadow-xs scale-102'
                            : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-blue)]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Format 2: On-screen Numeric Keypad */}
              {currentQ.format === 'keypad' && (
                <div className="space-y-2">
                  <Keypad
                    value={keypadInput || (selectedAnswers[currentQ.id] ? String(selectedAnswers[currentQ.id]) : '')}
                    onChange={(val) => setKeypadInput(val)}
                    onSubmit={handleKeypadSubmit}
                  />
                </div>
              )}

              {/* Format 3: True / False */}
              {currentQ.format === 'true_false' && (
                <div className="space-y-4 max-w-md mx-auto text-center">
                  <p className="text-sm font-semibold text-[var(--text-secondary)]">
                    {lang === 'ru'
                      ? currentQ.trueFalseStatementRu
                      : lang === 'en'
                      ? currentQ.trueFalseStatementEn
                      : currentQ.trueFalseStatementUz}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectAnswer(true)}
                      className={`py-3 rounded-2xl font-black text-base border transition-all ${
                        selectedAnswers[currentQ.id] === true
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                          : 'bg-[var(--bg-card)] border-[var(--border-color)] text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      To'g'ri ✅
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectAnswer(false)}
                      className={`py-3 rounded-2xl font-black text-base border transition-all ${
                        selectedAnswers[currentQ.id] === false
                          ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                          : 'bg-[var(--bg-card)] border-[var(--border-color)] text-rose-600 hover:bg-rose-50'
                      }`}
                    >
                      Noto'g'ri ❌
                    </button>
                  </div>
                </div>
              )}

              {/* Hint button (Available on Sprout level) */}
              {level === 'maysa' && (
                <div className="text-center pt-2">
                  {!showHint ? (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setShowHint(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:underline"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Maslahat olish 💡</span>
                    </button>
                  ) : (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 rounded-xl text-xs font-semibold text-amber-900 dark:text-amber-300">
                      💡 {lang === 'ru' ? currentQ.hintRu : lang === 'en' ? currentQ.hintEn : currentQ.hintUz}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation between questions */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={handlePrevQuestion}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-[var(--border-color)] disabled:opacity-30"
                >
                  ← Oldingi
                </button>

                <button
                  type="button"
                  disabled={selectedAnswers[currentQ.id] === undefined && !keypadInput}
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-[var(--accent-blue)] text-white hover:brightness-105 disabled:opacity-40 shadow-xs"
                >
                  {currentIndex === questions.length - 1 ? 'Testni yakunlash 🏁' : 'Keyingi savol →'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* QUIZ SUMMARY & REVIEW */
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center space-y-4 shadow-sm">
            <span className="text-4xl">🏆</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              Test natijasi: {score} / {questions.length} ({percentage}%)
            </h2>

            <div className="flex items-center justify-center gap-1 text-2xl text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>
                  {i < Math.round((score / questions.length) * 5) ? '⭐' : '☆'}
                </span>
              ))}
            </div>

            <p className="text-sm font-semibold text-[var(--text-secondary)] max-w-md mx-auto">
              {percentage >= 80
                ? "Ajoyib natija! Siz haqiqiy 'Tenglama ustasi'siz! 🌟"
                : percentage >= 60
                ? "Yaxshi urinish! Kamchiliklar ustida ishlasangiz, natijangiz yanada yaxshilanadi! 💪"
                : "Hech xafa bo'lmang! Xatolar ustida ishlab, qaytadan urinib ko'ramiz! 💡"}
            </p>

            {mistakeList.length > 0 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReviewMistakes}
                  className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-amber-500 text-slate-900 font-bold text-xs sm:text-sm hover:brightness-105 shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Xatolar ustida ishlash ({mistakeList.length} ta savol)</span>
                </button>
              </div>
            )}
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-[var(--text-primary)]">
              Savollar tahlili:
            </h3>

            {questions.map((q, idx) => {
              const userAns = selectedAnswers[q.id];
              const isCorrect = String(userAns) === String(q.correctAnswer);

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border ${
                    isCorrect
                      ? 'border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'border-rose-200 bg-rose-50/40 dark:bg-rose-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-[var(--text-secondary)]">
                        {idx + 1}-savol: {q.expression}
                      </span>
                      <h4 className="font-bold text-sm text-[var(--text-primary)] mt-0.5">
                        {lang === 'ru' ? q.questionRu : lang === 'en' ? q.questionEn : q.questionUz}
                      </h4>
                    </div>
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </div>

                  <div className="mt-2 text-xs space-y-1">
                    <div>
                      Sizning javobingiz: <strong>{String(userAns ?? "Javob berilmagan")}</strong> | To'g'ri javob: <strong>{String(q.correctAnswer)}</strong>
                    </div>
                    <div className="text-[var(--text-secondary)]">
                      💡 {lang === 'ru' ? q.stepExplanationRu : lang === 'en' ? q.stepExplanationEn : q.stepExplanationUz}
                    </div>
                  </div>
                </div>
              );
            })}
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
          <span>Mashqlar</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onNext();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm sm:text-base text-white bg-[var(--accent-blue)] hover:brightness-105 active:scale-98 transition-all shadow-md"
        >
          <span>Keyingi: Baholash & Vazifa</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
