import React, { useState } from 'react';
import { motion } from 'motion/react';
import { sound } from '../lib/sound';

interface NumberLineProps {
  min?: number;
  max?: number;
  start?: number;
  jump?: number; // positive or negative
  target?: number;
  interactive?: boolean;
  onPositionSelect?: (pos: number) => void;
  selectedPos?: number | null;
}

export const NumberLine: React.FC<NumberLineProps> = ({
  min = 0,
  max = 20,
  start = 6,
  jump = 4,
  target = 10,
  interactive = false,
  onPositionSelect,
  selectedPos = null,
}) => {
  const [currentFrogPos, setCurrentFrogPos] = useState<number>(start);

  const stepCount = max - min;
  const numbers = Array.from({ length: stepCount + 1 }, (_, i) => min + i);

  const handleFrogJump = () => {
    sound.playClick();
    setCurrentFrogPos(target);
    sound.playCorrect();
  };

  const resetFrog = () => {
    sound.playClick();
    setCurrentFrogPos(start);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-3 text-xs sm:text-sm font-semibold text-[var(--text-secondary)]">
        <span>🐸 Qurbaqaning sakrash yo'li</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetFrog}
            className="px-2.5 py-1 text-xs rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-secondary)]"
          >
            Boshiga qaytish
          </button>
          <button
            type="button"
            onClick={handleFrogJump}
            className="px-3 py-1 text-xs font-bold rounded-lg bg-[var(--accent-green)] text-white hover:brightness-105"
          >
            Sakrash! 🚀
          </button>
        </div>
      </div>

      {/* SVG Canvas for Jump Arcs */}
      <div className="relative w-full h-24 overflow-x-auto overflow-y-visible py-2 select-none">
        <svg
          viewBox={`0 0 ${numbers.length * 36} 90`}
          className="w-full min-w-[500px] h-full overflow-visible"
        >
          {/* Main Axis Line */}
          <line
            x1="18"
            y1="60"
            x2={numbers.length * 36 - 18}
            y2="60"
            stroke="var(--text-secondary)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Jump Arc */}
          {currentFrogPos === target && (
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              d={`M ${(start - min) * 36 + 18} 55 Q ${((start + target) / 2 - min) * 36 + 18} 10 ${(target - min) * 36 + 18} 55`}
              fill="none"
              stroke="var(--accent-coral)"
              strokeWidth="3.5"
              strokeDasharray="6,4"
            />
          )}

          {/* Ticks and Numbers */}
          {numbers.map((num, i) => {
            const x = i * 36 + 18;
            const isStart = num === start;
            const isTarget = num === target;
            const isSelected = selectedPos === num;

            return (
              <g
                key={num}
                className="cursor-pointer"
                onClick={() => {
                  if (interactive && onPositionSelect) {
                    sound.playClick();
                    onPositionSelect(num);
                  }
                }}
              >
                {/* Tick mark */}
                <line
                  x1={x}
                  y1={isStart || isTarget ? 50 : 54}
                  x2={x}
                  y2={isStart || isTarget ? 70 : 66}
                  stroke={isStart || isTarget ? 'var(--accent-blue)' : 'var(--text-muted)'}
                  strokeWidth={isStart || isTarget ? '3' : '2'}
                />

                {/* Target highlight dot */}
                {isSelected && (
                  <circle cx={x} cy="60" r="10" fill="var(--accent-yellow-bg)" stroke="var(--accent-yellow)" strokeWidth="2" />
                )}

                {/* Number text */}
                <text
                  x={x}
                  y="82"
                  textAnchor="middle"
                  className={`text-[13px] font-bold ${
                    isStart || isTarget ? 'fill-[var(--accent-blue)]' : 'fill-[var(--text-secondary)]'
                  }`}
                >
                  {num}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Animated Frog Avatar */}
        <motion.div
          animate={{
            x: `${((currentFrogPos - min) / (stepCount || 1)) * 92}%`,
            y: currentFrogPos === target ? [0, -30, 0] : 0,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute top-2 left-2 text-2xl pointer-events-none drop-shadow-md select-none"
        >
          🐸
        </motion.div>
      </div>

      <div className="mt-2 text-center text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
        {start} {jump >= 0 ? `+ ${jump}` : `− ${Math.abs(jump)}`} = {target}
      </div>
    </div>
  );
};
