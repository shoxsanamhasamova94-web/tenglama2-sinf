import React from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { sound } from '../lib/sound';

interface MagicBoxProps {
  isOpen: boolean;
  revealedValue?: number | string;
  onClick?: () => void;
  allowReducedMotion?: boolean;
}

export const MagicBox: React.FC<MagicBoxProps> = ({
  isOpen,
  revealedValue = '?',
  onClick,
  allowReducedMotion = false,
}) => {
  const triggerConfetti = () => {
    if (!allowReducedMotion) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#38bdf8', '#8b5cf6', '#f43f5e'],
      });
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      sound.playStar();
      triggerConfetti();
    }
  }, [isOpen]);

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 cursor-pointer select-none"
    >
      <motion.div
        animate={
          isOpen
            ? { scale: [1, 1.15, 1], rotate: [0, -3, 3, 0] }
            : { y: [0, -4, 0] }
        }
        transition={
          isOpen
            ? { duration: 0.5 }
            : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
        }
        className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl flex flex-col items-center justify-center border-4 shadow-lg transition-all ${
          isOpen
            ? 'bg-gradient-to-br from-amber-200 to-yellow-400 border-amber-500 shadow-amber-300/50'
            : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400/80 shadow-indigo-500/30'
        }`}
      >
        {/* Box Lid Effect */}
        <div
          className={`absolute top-0 inset-x-0 h-6 rounded-t-2xl border-b-2 transition-all ${
            isOpen
              ? '-translate-y-4 rotate-[-12deg] bg-amber-400 border-amber-600'
              : 'bg-indigo-600 border-indigo-800'
          }`}
        />

        {/* Revealed Content or Mystery Symbol */}
        <div className="z-10 flex flex-col items-center">
          {isOpen ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center"
            >
              <span className="text-3xl sm:text-4xl font-black text-slate-900 drop-shadow-xs">
                {revealedValue}
              </span>
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                x topildi! ⭐
              </span>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center text-white">
              <span className="text-4xl sm:text-5xl font-black italic tracking-wider drop-shadow-md">
                x
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">
                Sirli quti
              </span>
            </div>
          )}
        </div>

        {/* Shimmer Stars */}
        {isOpen && (
          <>
            <span className="absolute -top-2 -left-2 text-xl animate-bounce">✨</span>
            <span className="absolute -bottom-2 -right-2 text-xl animate-bounce delay-150">🌟</span>
          </>
        )}
      </motion.div>
      <span className="mt-2 text-xs font-semibold text-[var(--text-secondary)]">
        {isOpen ? "Quti ochildi! 🎉" : "Ichida x yashiringan 🎁"}
      </span>
    </div>
  );
};
