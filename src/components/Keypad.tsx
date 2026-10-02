import React from 'react';
import { Delete, Check } from 'lucide-react';
import { sound } from '../lib/sound';

interface KeypadProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void;
  maxLength?: number;
  disabled?: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  value,
  onChange,
  onSubmit,
  maxLength = 3,
  disabled = false,
}) => {
  const handleDigit = (digit: number) => {
    if (disabled) return;
    sound.playClick();
    if (value.length < maxLength) {
      // Prevent leading zero if multi-digit
      if (value === '0') {
        onChange(String(digit));
      } else {
        onChange(value + digit);
      }
    }
  };

  const handleBackspace = () => {
    if (disabled) return;
    sound.playClick();
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    if (disabled) return;
    sound.playClick();
    onChange('');
  };

  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="w-full max-w-xs mx-auto select-none p-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl shadow-sm">
      {/* Number Display Screen */}
      <div className="flex items-center justify-between mb-3 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-2xl">
        <span className="text-xs font-semibold text-[var(--text-secondary)]">Javob:</span>
        <span className="text-2xl sm:text-3xl font-black tracking-widest text-[var(--text-primary)]">
          {value || <span className="text-[var(--text-muted)] italic">_</span>}
        </span>
      </div>

      {/* 3x4 Keypad Grid */}
      <div className="grid grid-cols-3 gap-2">
        {keys.map((num) => (
          <button
            key={num}
            type="button"
            disabled={disabled}
            onClick={() => handleDigit(num)}
            className="flex items-center justify-center min-h-[48px] sm:min-h-[56px] text-xl sm:text-2xl font-black rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--accent-blue-bg)] active:scale-95 transition-all shadow-2xs"
          >
            {num}
          </button>
        ))}

        {/* Clear Key */}
        <button
          type="button"
          disabled={disabled || !value}
          onClick={handleClear}
          className="flex items-center justify-center min-h-[48px] sm:min-h-[56px] text-xs font-bold rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-rose-500 hover:bg-rose-50 active:scale-95 transition-all disabled:opacity-40"
        >
          Tozalash
        </button>

        {/* 0 Key */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleDigit(0)}
          className="flex items-center justify-center min-h-[48px] sm:min-h-[56px] text-xl sm:text-2xl font-black rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--accent-blue-bg)] active:scale-95 transition-all shadow-2xs"
        >
          0
        </button>

        {/* Backspace Key */}
        <button
          type="button"
          disabled={disabled || !value}
          onClick={handleBackspace}
          className="flex items-center justify-center min-h-[48px] sm:min-h-[56px] rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-amber-600 hover:bg-amber-50 active:scale-95 transition-all disabled:opacity-40"
          title="O'chirish"
        >
          <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Confirm Button */}
      {onSubmit && (
        <button
          type="button"
          disabled={disabled || !value}
          onClick={() => {
            sound.playClick();
            onSubmit();
          }}
          className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl font-black text-sm sm:text-base text-white bg-[var(--accent-green)] hover:brightness-105 active:scale-98 transition-all shadow-xs disabled:opacity-50 disabled:pointer-events-none"
        >
          <Check className="w-5 h-5" />
          <span>Javobni tasdiqlash</span>
        </button>
      )}
    </div>
  );
};
