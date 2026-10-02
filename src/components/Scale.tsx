import React from 'react';
import { motion } from 'motion/react';

interface ScaleProps {
  leftWeight: number; // total left weight
  rightWeight: number; // total right weight
  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  hasMysteryBoxOnLeft?: boolean;
  mysteryBoxValue?: number;
  interactive?: boolean;
  onAddAppleLeft?: () => void;
  onRemoveAppleLeft?: () => void;
  onAddAppleRight?: () => void;
  onRemoveAppleRight?: () => void;
  leftApplesCount?: number;
  rightApplesCount?: number;
}

export const Scale: React.FC<ScaleProps> = ({
  leftWeight,
  rightWeight,
  leftLabel,
  rightLabel,
  hasMysteryBoxOnLeft = false,
  interactive = false,
  onAddAppleLeft,
  onRemoveAppleLeft,
  onAddAppleRight,
  onRemoveAppleRight,
  leftApplesCount = 0,
  rightApplesCount = 0,
}) => {
  // Calculate tilt angle: max ±14 degrees for realistic balance
  const diff = rightWeight - leftWeight;
  let angle = 0;
  if (diff > 0) {
    angle = Math.min(14, Math.max(3, diff * 2));
  } else if (diff < 0) {
    angle = Math.max(-14, Math.min(-3, diff * 2));
  }

  const isBalanced = leftWeight === rightWeight;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none py-2">
      {/* Status indicator banner */}
      <div className="mb-2 text-center">
        {isBalanced ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-sm sm:text-base rounded-full shadow-xs">
            <span>⚖️</span>
            <span>Muvozanatda! Chap = O'ng</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold text-xs sm:text-sm rounded-full">
            <span>{diff > 0 ? "O'ng palla og'irroq ↘️" : "Chap palla og'irroq ↙️"}</span>
          </div>
        )}
      </div>

      {/* SVG Scale Structure */}
      <div className="relative w-full aspect-[2/1] max-h-56">
        <svg
          viewBox="0 0 400 200"
          className="w-full h-full overflow-visible drop-shadow-md"
        >
          {/* Base Stand & Pillar */}
          <path
            d="M 170 190 L 230 190 L 220 180 L 205 180 L 205 70 L 210 70 L 200 50 L 190 70 L 195 70 L 195 180 L 180 180 Z"
            fill="var(--border-strong)"
            stroke="var(--text-secondary)"
            strokeWidth="2"
          />
          {/* Fulcrum pivot circle */}
          <circle
            cx="200"
            cy="52"
            r="8"
            fill="var(--accent-yellow)"
            stroke="var(--text-primary)"
            strokeWidth="2.5"
          />

          {/* Tilting Beam Group */}
          <g
            style={{
              transformOrigin: '200px 52px',
              transform: `rotate(${angle}deg)`,
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Main horizontal beam */}
            <rect
              x="50"
              y="48"
              width="300"
              height="8"
              rx="4"
              fill="var(--accent-blue)"
              stroke="var(--text-primary)"
              strokeWidth="2"
            />
            {/* Center pointer needle */}
            <line
              x1="200"
              y1="52"
              x2="200"
              y2="20"
              stroke={isBalanced ? '#10b981' : '#f59e0b'}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Left suspension strings */}
            <line x1="75" y1="52" x2="60" y2="125" stroke="var(--text-secondary)" strokeWidth="2" strokeDasharray="3,2" />
            <line x1="75" y1="52" x2="90" y2="125" stroke="var(--text-secondary)" strokeWidth="2" strokeDasharray="3,2" />

            {/* Left pan */}
            <path
              d="M 45 125 Q 75 145 105 125 Z"
              fill="var(--bg-surface)"
              stroke="var(--border-strong)"
              strokeWidth="3"
            />

            {/* Right suspension strings */}
            <line x1="325" y1="52" x2="310" y2="125" stroke="var(--text-secondary)" strokeWidth="2" strokeDasharray="3,2" />
            <line x1="325" y1="52" x2="340" y2="125" stroke="var(--text-secondary)" strokeWidth="2" strokeDasharray="3,2" />

            {/* Right pan */}
            <path
              d="M 295 125 Q 325 145 355 125 Z"
              fill="var(--bg-surface)"
              stroke="var(--border-strong)"
              strokeWidth="3"
            />
          </g>
        </svg>

        {/* Content Overlays on Left and Right Pan */}
        <div className="absolute inset-0 pointer-events-none flex justify-between items-center px-4 sm:px-8">
          {/* Left Pan Overlay */}
          <div
            className="flex flex-col items-center pointer-events-auto transition-transform duration-300"
            style={{
              transform: `translateY(${angle * -2.2}px)`,
              width: '120px',
            }}
          >
            <div className="flex flex-wrap justify-center items-center gap-1 min-h-[50px] p-1.5 bg-[var(--bg-card)]/90 backdrop-blur-xs rounded-xl border border-[var(--border-color)] shadow-xs">
              {hasMysteryBoxOnLeft && (
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="w-10 h-10 bg-amber-400 border-2 border-amber-600 rounded-lg flex items-center justify-center font-bold text-slate-900 text-lg shadow-sm"
                  title="Noma'lum quti x"
                >
                  x
                </motion.div>
              )}
              {Array.from({ length: Math.min(leftApplesCount, 15) }).map((_, i) => (
                <span key={i} className="text-base select-none animate-in fade-in" title="Olma">
                  🍎
                </span>
              ))}
              {leftApplesCount > 15 && (
                <span className="text-xs font-bold text-[var(--text-secondary)]">+{leftApplesCount - 15}</span>
              )}
            </div>

            {leftLabel && <div className="mt-1 text-xs sm:text-sm font-bold">{leftLabel}</div>}

            {interactive && (
              <div className="flex items-center gap-1 mt-1.5 pointer-events-auto">
                {onRemoveAppleLeft && leftApplesCount > 0 && (
                  <button
                    type="button"
                    onClick={onRemoveAppleLeft}
                    className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 text-xs font-bold hover:bg-rose-200"
                    title="Olma olish"
                  >
                    -
                  </button>
                )}
                {onAddAppleLeft && (
                  <button
                    type="button"
                    onClick={onAddAppleLeft}
                    className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold hover:bg-emerald-200"
                    title="Olma qo'shish"
                  >
                    +
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Pan Overlay */}
          <div
            className="flex flex-col items-center pointer-events-auto transition-transform duration-300"
            style={{
              transform: `translateY(${angle * 2.2}px)`,
              width: '120px',
            }}
          >
            <div className="flex flex-wrap justify-center items-center gap-1 min-h-[50px] p-1.5 bg-[var(--bg-card)]/90 backdrop-blur-xs rounded-xl border border-[var(--border-color)] shadow-xs">
              {Array.from({ length: Math.min(rightApplesCount, 15) }).map((_, i) => (
                <span key={i} className="text-base select-none animate-in fade-in" title="Olma">
                  🍎
                </span>
              ))}
              {rightApplesCount > 15 && (
                <span className="text-xs font-bold text-[var(--text-secondary)]">+{rightApplesCount - 15}</span>
              )}
              {rightApplesCount === 0 && (
                <span className="text-xs text-[var(--text-muted)] italic">Bo'sh</span>
              )}
            </div>

            {rightLabel && <div className="mt-1 text-xs sm:text-sm font-bold">{rightLabel}</div>}

            {interactive && (
              <div className="flex items-center gap-1 mt-1.5 pointer-events-auto">
                {onRemoveAppleRight && rightApplesCount > 0 && (
                  <button
                    type="button"
                    onClick={onRemoveAppleRight}
                    className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 text-xs font-bold hover:bg-rose-200"
                    title="Olma olish"
                  >
                    -
                  </button>
                )}
                {onAddAppleRight && (
                  <button
                    type="button"
                    onClick={onAddAppleRight}
                    className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold hover:bg-emerald-200"
                    title="Olma qo'shish"
                  >
                    +
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
