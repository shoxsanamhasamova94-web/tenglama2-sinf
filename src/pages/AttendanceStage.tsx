import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, UserPlus, Trash2, Copy, Check, Shuffle, Users } from 'lucide-react';
import { CharacterGuide } from '../components/CharacterGuide';
import { sound } from '../lib/sound';
import { getStorageItem, setStorageItem } from '../lib/storage';

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface Student {
  id: string;
  name: string;
  emoji: string;
  status: AttendanceStatus;
}

const DEFAULT_STUDENTS: Student[] = [
  { id: '1', name: 'Ali', emoji: '👦', status: 'present' },
  { id: '2', name: 'Fotima', emoji: '👧', status: 'present' },
  { id: '3', name: 'Zuhra', emoji: '👧', status: 'present' },
  { id: '4', name: 'Jasur', emoji: '👦', status: 'present' },
  { id: '5', name: 'Madina', emoji: '👧', status: 'present' },
  { id: '6', name: 'Sardor', emoji: '👦', status: 'absent' },
  { id: '7', name: 'Rayhon', emoji: '👧', status: 'present' },
  { id: '8', name: 'Bobur', emoji: '👦', status: 'late' },
  { id: '9', name: 'Diyor', emoji: '👦', status: 'present' },
  { id: '10', name: 'Kamola', emoji: '👧', status: 'present' },
  { id: '11', name: 'Shahzod', emoji: '👦', status: 'present' },
  { id: '12', name: 'Nodira', emoji: '👧', status: 'present' },
];

const EMOJI_AVATARS = ['👦', '👧', '🧑', '🧒', '🦊', '🐼', '🦁', '🐨', '🐯'];

interface AttendanceStageProps {
  onNext: () => void;
  onPrev: () => void;
}

export const AttendanceStage: React.FC<AttendanceStageProps> = ({ onNext, onPrev }) => {
  const [students, setStudents] = useState<Student[]>(() =>
    getStorageItem('class_students', DEFAULT_STUDENTS)
  );
  const [newName, setNewName] = useState('');
  const [batchText, setBatchText] = useState('');
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<Student | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [copied, setCopied] = useState(false);

  const saveStudents = (updated: Student[]) => {
    setStudents(updated);
    setStorageItem('class_students', updated);
  };

  // Cycle status: present -> absent -> late -> present
  const handleCycleStatus = (id: string) => {
    sound.playClick();
    const updated = students.map((st) => {
      if (st.id === id) {
        let nextStatus: AttendanceStatus = 'present';
        if (st.status === 'present') nextStatus = 'absent';
        else if (st.status === 'absent') nextStatus = 'late';
        else nextStatus = 'present';
        return { ...st, status: nextStatus };
      }
      return st;
    });
    saveStudents(updated);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    sound.playClick();
    const newStudent: Student = {
      id: Date.now().toString(),
      name: newName.trim(),
      emoji: EMOJI_AVATARS[Math.floor(Math.random() * EMOJI_AVATARS.length)],
      status: 'present',
    };
    const updated = [...students, newStudent];
    saveStudents(updated);
    setNewName('');
  };

  const handleDeleteStudent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const updated = students.filter((s) => s.id !== id);
    saveStudents(updated);
  };

  const handleBatchImport = () => {
    sound.playClick();
    const names = batchText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (names.length === 0) return;

    const newEntries: Student[] = names.map((nm, idx) => ({
      id: `${Date.now()}_${idx}`,
      name: nm,
      emoji: EMOJI_AVATARS[idx % EMOJI_AVATARS.length],
      status: 'present',
    }));

    saveStudents([...students, ...newEntries]);
    setBatchText('');
    setShowBatchModal(false);
  };

  // Random Duty Wheel Picker
  const handlePickDuty = () => {
    sound.playClick();
    const presentStudents = students.filter((s) => s.status !== 'absent');
    if (presentStudents.length === 0) return;

    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * presentStudents.length);
      setSelectedDuty(presentStudents[randomIdx]);
      sound.playClick();
      counter++;
      if (counter >= 15) {
        clearInterval(interval);
        setIsSpinning(false);
        sound.playVictory();
      }
    }, 100);
  };

  const handleCopyAttendance = () => {
    sound.playClick();
    const total = students.length;
    const present = students.filter((s) => s.status === 'present').length;
    const late = students.filter((s) => s.status === 'late').length;
    const absent = students.filter((s) => s.status === 'absent').length;

    let text = `📋 DAVOMAT (Jami: ${total})\n`;
    text += `✅ Kelganlar (${present + late}): ${students.filter((s) => s.status !== 'absent').map((s) => s.name).join(', ')}\n`;
    if (late > 0) {
      text += `🕒 Kechikkanlar (${late}): ${students.filter((s) => s.status === 'late').map((s) => s.name).join(', ')}\n`;
    }
    if (absent > 0) {
      text += `❌ Kelmaganlar (${absent}): ${students.filter((s) => s.status === 'absent').map((s) => s.name).join(', ')}\n`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalCount = students.length;
  const absentCount = students.filter((s) => s.status === 'absent').length;
  const presentCount = totalCount - absentCount;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-[var(--accent-blue)] uppercase tracking-wider">
            2-bosqich · ⏱ 2 daqiqa
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            Sinf Davomati 📋
          </h1>
        </div>

        {/* Live Attendance Counter */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs sm:text-sm font-bold shadow-2xs">
          <Users className="w-4 h-4 text-[var(--accent-blue)]" />
          <span>Bugun {totalCount} tadan {presentCount} ta o'quvchi keldi</span>
        </div>
      </div>

      {/* Guide explaining attendance as an EQUATION */}
      <CharacterGuide
        message={`Qarang, davomat ham ajoyib tenglamaga aylanadi! Sinfda jami ${totalCount} o'quvchi bor, ${absentCount} tasi kelmadi. Kelganlar sonini x deb olsak: ${totalCount} − ${absentCount} = x. Demak x = ${presentCount}!`}
        mood="thinking"
      />

      {/* Equation bridge banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300">
        <div className="flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span>Tenglama: <strong>{totalCount} − {absentCount} = x</strong></span>
        </div>
        <div className="px-3 py-1 bg-amber-500 text-slate-900 font-black rounded-xl">
          x = {presentCount} (Kelganlar)
        </div>
      </div>

      {/* Controls: Add student & Duty wheel & Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
        {/* Add Student Input */}
        <form onSubmit={handleAddStudent} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="O'quvchi ismi..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="py-2 px-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[var(--accent-blue)]"
          />
          <button
            type="submit"
            className="flex items-center gap-1 py-2 px-3 rounded-xl bg-[var(--accent-blue)] text-white text-xs font-bold hover:brightness-105"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Qo'shish</span>
          </button>
          <button
            type="button"
            onClick={() => setShowBatchModal(true)}
            className="py-2 px-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-xs font-bold hover:bg-[var(--bg-card)]"
            title="Ko'p o'quvchi qo'shish"
          >
            + Ro'yxat
          </button>
        </form>

        {/* Duty Wheel & Export */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePickDuty}
            disabled={isSpinning}
            className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl font-bold text-xs bg-[var(--accent-purple)] text-white hover:brightness-105 shadow-2xs ${
              isSpinning ? 'animate-spin' : ''
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Bugungi navbatchi</span>
          </button>

          <button
            type="button"
            onClick={handleCopyAttendance}
            className="flex items-center gap-1.5 py-2 px-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-xs font-bold hover:bg-[var(--bg-card)]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Nusxalandi!' : 'Nusxa olish'}</span>
          </button>
        </div>
      </div>

      {/* Selected Duty Announcement Banner */}
      {selectedDuty && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/50 flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedDuty.emoji}</span>
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                🌟 Bugungi sinf navbatchisi
              </span>
              <h3 className="text-lg font-black text-[var(--text-primary)]">
                {selectedDuty.name}
              </h3>
            </div>
          </div>
          <span className="text-2xl animate-bounce">🧹⭐</span>
        </div>
      )}

      {/* Student Avatar Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {students.map((st) => {
          let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
          let statusLabel = 'Keldi ✅';
          if (st.status === 'absent') {
            badgeColor = 'bg-rose-100 text-rose-800 border-rose-300 opacity-60';
            statusLabel = 'Kelmadi ❌';
          } else if (st.status === 'late') {
            badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
            statusLabel = 'Kechikdi 🕒';
          }

          return (
            <div
              key={st.id}
              onClick={() => handleCycleStatus(st.id)}
              className={`group relative p-3 rounded-2xl border transition-all cursor-pointer select-none bg-[var(--bg-surface)] hover:shadow-xs ${
                st.status === 'absent' ? 'border-rose-200' : 'border-[var(--border-color)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl sm:text-3xl">{st.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] truncate">
                    {st.name}
                  </h4>
                  <span className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${badgeColor}`}>
                    {statusLabel}
                  </span>
                </div>
              </div>

              {/* Delete button on hover */}
              <button
                type="button"
                onClick={(e) => handleDeleteStudent(st.id, e)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-rose-400 hover:text-rose-600 rounded-md transition-opacity"
                title="O'chirish"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs text-[var(--text-secondary)]">
        💡 O'quvchi kartasini bir marta bosish: <strong>Keldi → Kelmadi → Kechikdi</strong> ketma-ketligida o'zgartiradi.
      </div>

      {/* Batch Import Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md p-5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl shadow-xl space-y-4">
            <h3 className="font-black text-base text-[var(--text-primary)]">
              Bir yo'la bir nechta o'quvchi qo'shish
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Ismlarni yangi qatordan yoki vergul bilan ajratib yozing:
            </p>
            <textarea
              rows={5}
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              placeholder="Azizbek&#10;Kamron&#10;Zilola&#10;Sarvar"
              className="w-full p-3 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-card)] text-sm font-semibold focus:outline-none focus:border-[var(--accent-blue)]"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBatchModal(false)}
                className="py-2 px-4 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleBatchImport}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-[var(--accent-blue)] text-white hover:brightness-105"
              >
                Qo'shish
              </button>
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
          <span>Kirish</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onNext();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm sm:text-base text-white bg-[var(--accent-blue)] hover:brightness-105 active:scale-98 transition-all shadow-md"
        >
          <span>Keyingi: Takrorlash</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
