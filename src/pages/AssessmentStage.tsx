import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Printer, Copy, Check, Award, Star, Download, Sparkles, BookOpen, Heart } from 'lucide-react';
import { CharacterGuide } from '../components/CharacterGuide';
import { sound } from '../lib/sound';
import { getCurrentLanguage } from '../i18n';
import { getStorageItem, setStorageItem } from '../lib/storage';

interface AssessmentStageProps {
  onPrev: () => void;
  isTeacherUnlocked: boolean;
}

export const AssessmentStage: React.FC<AssessmentStageProps> = ({ onPrev, isTeacherUnlocked }) => {
  const [studentName, setStudentName] = useState(() => getStorageItem('student_name', 'Azizbek'));
  const [selfMood, setSelfMood] = useState<'high' | 'med' | 'low' | null>(() =>
    getStorageItem('self_eval', null)
  );
  const [hwLevel, setHwLevel] = useState<'maysa' | 'nihol' | 'daraxt'>('nihol');
  const [hwCopied, setHwCopied] = useState(false);
  const [hwAnswers, setHwAnswers] = useState<{ [key: string]: string }>({});

  const lang = getCurrentLanguage();
  const lastQuiz = getStorageItem<{ score: number; total: number; level: string }>('last_quiz_result', {
    score: 9,
    total: 10,
    level: 'nihol',
  });

  const percentage = Math.round((lastQuiz.score / lastQuiz.total) * 100);

  // Uzbek school grading (2–5)
  const uzbekGrade = percentage >= 85 ? '5 (A\'lo)' : percentage >= 70 ? '4 (Yaxshi)' : percentage >= 55 ? '3 (Qoniqarli)' : '2';

  const handlePrintCertificate = () => {
    sound.playClick();
    window.print();
  };

  const handleSelfEval = (val: 'high' | 'med' | 'low') => {
    sound.playClick();
    setSelfMood(val);
    setStorageItem('self_eval', val);
    sound.playStar();
  };

  const handleCopyHomework = () => {
    sound.playClick();
    let text = `📚 MATEMATIKA UYGA VAZIFA (2-sinf · Tenglamalar)\n`;
    text += `Daraja: ${hwLevel.toUpperCase()}\n\n`;

    if (hwLevel === 'maysa') {
      text += `1) x + 3 = 10\n2) x + 5 = 12\n3) x − 4 = 8\n4) 15 − x = 9\n5) x + 7 = 15\n`;
      text += `🖼️ Rasmli topshiriq: 4 ta olmaga nechta olma qo'shsak 11 ta bo'ladi? Tenglama tuzing.\n`;
    } else if (hwLevel === 'nihol') {
      text += `1) x + 24 = 60\n2) x − 35 = 45\n3) 70 − x = 38\n4) 18 + x = 62\n5) x − 19 = 51\n6) 85 − x = 40\n7) x + 47 = 93\n8) 50 − x = 25\n`;
      text += `Tekshirish qadamini daftaringizga to'liq yozing!\n`;
      text += `📖 Masala: Savatda x ta qalam bor edi. 12 tasini ishlatdik, 28 ta qoldi. Dastlab nechta qalam bo'lgan?\n`;
    } else {
      text += `1) x · 4 = 28\n2) x : 3 = 6\n3) 100 − x = 37\n4) x + 18 = 50\n5) 24 : x = 4\n6) x − 32 = 48\n7) 64 − x = 19\n8) x + 36 = 90\n9) x · 5 = 35\n10) x : 2 = 14\n`;
      text += `✨ Ijodiy vazifa: Do'stingizga topishmoq qilib berish uchun 2 ta o'z tenglamangizni tuzing!\n`;
    }

    text += `\n👨‍👩‍👧 Ota-onalar uchun: Bolaga tayyor javobni aytmang, 'Keling, tekshirib ko'ramiz' deb yo'naltiring!`;

    navigator.clipboard.writeText(text);
    setHwCopied(true);
    setTimeout(() => setHwCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <span className="text-xs font-bold text-[var(--accent-blue)] uppercase tracking-wider">
            7-bosqich · ⏱ 5 daqiqa
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            Baholash, Sertifikat & Uyga vazifa 🎓
          </h1>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Dars yakunlandi!</span>
        </div>
      </div>

      {/* Guide Mascot */}
      <div className="no-print">
        <CharacterGuide
          message="Bugun darsda faol qatnashganingiz uchun tashakkur! O'z sertifikatingizni oling va uyga vazifani daftaringizga ko'chirib oling!"
          mood="celebrating"
        />
      </div>

      {/* SECTION 1: STUDENT EVALUATION CARD */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 no-print">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Natija & Baho
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
              {percentage >= 80 ? 'Matematika qahramoni 🦸' : percentage >= 60 ? 'Tenglama ustasi 🏆' : 'O\'sib borayotgan nihol 🌱'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Test natijasi: {lastQuiz.score} / {lastQuiz.total} ({percentage}%)
            </p>
          </div>

          {/* Teacher Grade Indicator */}
          {isTeacherUnlocked && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-center">
              <span className="text-[11px] font-bold text-amber-800 uppercase">
                O'qituvchi bahosi (2–5)
              </span>
              <div className="text-2xl font-black text-amber-900 dark:text-amber-200">
                {uzbekGrade}
              </div>
            </div>
          )}
        </div>

        {/* Self-Assessment Traffic Light 😀 🙂 😐 */}
        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-strong)] space-y-2">
          <span className="text-xs font-bold text-[var(--text-secondary)]">
            O'z-o'zini baholash: "Men bugun darsni qanday tushundim?"
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'high', label: 'Juda yaxshi tushundim! 🟢', emoji: '😀' },
              { id: 'med', label: 'Biroz tushundim 🟡', emoji: '🙂' },
              { id: 'low', label: 'Yana mashq qilishim kerak 🔴', emoji: '😐' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelfEval(item.id as 'high' | 'med' | 'low')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  selfMood === item.id
                    ? 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)] shadow-xs scale-102'
                    : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <span className="text-xl block mb-0.5">{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Teacher Rubric (Visible in Teacher mode) */}
        {isTeacherUnlocked && (
          <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-3">
            <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              O'qituvchi Baholash Rubrikasi (4 mezon · 1-4 ball)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)]">
                <strong>1. Tenglamani tanish</strong>
                <div className="text-emerald-600 font-bold mt-1">4 / 4 ball (A'lo)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)]">
                <strong>2. To'g'ri yechish</strong>
                <div className="text-emerald-600 font-bold mt-1">4 / 4 ball (A'lo)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)]">
                <strong>3. Tekshirish qadami</strong>
                <div className="text-emerald-600 font-bold mt-1">4 / 4 ball (A'lo)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)]">
                <strong>4. Atamalarni ishlatish</strong>
                <div className="text-emerald-600 font-bold mt-1">3 / 4 ball (Yaxshi)</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: PRINTABLE DIPLOMA / CERTIFICATE */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div>
            <h3 className="font-black text-base sm:text-lg text-[var(--text-primary)]">
              🎓 Faxriy Sertifikat: "Tenglama ustasi"
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Ismingizni kiriting va sertifikatni chop eting!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                setStorageItem('student_name', e.target.value);
              }}
              placeholder="O'quvchi ismi..."
              className="py-1.5 px-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] text-xs font-bold"
            />
            <button
              type="button"
              onClick={handlePrintCertificate}
              className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[var(--accent-blue)] text-white text-xs font-bold hover:brightness-105 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Chop etish</span>
            </button>
          </div>
        </div>

        {/* Certificate Canvas Box (Printable) */}
        <div className="relative w-full max-w-2xl mx-auto aspect-[1.414/1] p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-50 border-8 border-double border-amber-600 shadow-md flex flex-col items-center justify-between text-center select-none overflow-hidden print:border-4 print:shadow-none print:aspect-auto print:p-8">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 text-2xl text-amber-600">⚜️</div>
          <div className="absolute top-2 right-2 text-2xl text-amber-600">⚜️</div>
          <div className="absolute bottom-2 left-2 text-2xl text-amber-600">⚜️</div>
          <div className="absolute bottom-2 right-2 text-2xl text-amber-600">⚜️</div>

          {/* Certificate Header */}
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-amber-700">
              O'quvchi muvaffaqiyati sertifikati
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight">
              TENGLAMA USTASI
            </h2>
            <div className="w-24 h-0.5 bg-amber-500 mx-auto mt-1" />
          </div>

          {/* Certificate Body */}
          <div className="space-y-2 max-w-md">
            <p className="text-xs sm:text-sm italic text-slate-700">
              Ushbu maxsus sertifikat 2-sinf matematika fanidan "Tenglamalar" mavzusini muvaffaqiyatli tamomlagani uchun
            </p>
            <div className="text-2xl sm:text-3xl font-black font-serif text-amber-900 underline decoration-amber-400 underline-offset-4 py-1">
              {studentName || 'O\'quvchi'}
            </div>
            <p className="text-xs sm:text-sm text-slate-700">
              ga taqdim etiladi. Siz barcha turlarni to'g'ri yechish va tekshirish sirini mukammal o'zlashtirdingiz!
            </p>
          </div>

          {/* Certificate Footer Seals */}
          <div className="w-full flex items-center justify-between px-4 sm:px-8 pt-4">
            <div className="text-left text-[10px] text-slate-600">
              <div>Sana: {new Date().toLocaleDateString()}</div>
              <div>Holati: Tasdiqlangan ✅</div>
            </div>

            {/* Golden Seal */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-amber-600 flex flex-col items-center justify-center text-slate-900 shadow-sm font-black text-[10px]">
              <span>⭐</span>
              <span>A'LO</span>
            </div>

            <div className="text-right text-[10px] text-slate-600">
              <div>Tarozi-Tolik 🤖</div>
              <div>Bosh ustoz imzosi: ✍️</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: HOMEWORK IN 3 TIERS + KITCHEN CREATIVE TASK */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-base sm:text-lg text-[var(--text-primary)]">
              📚 Tabaqalashtirilgan Uyga Vazifa
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              O'z darajangizga mos topshiriqni tanlang:
            </p>
          </div>

          {/* Level Switcher */}
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-secondary)] rounded-2xl">
            {(['maysa', 'nihol', 'daraxt'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setHwLevel(lvl)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  hwLevel === lvl
                    ? 'bg-[var(--accent-blue)] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                {lvl === 'maysa' ? '🌱 Maysa' : lvl === 'nihol' ? '🌿 Nihol' : '🌳 Daraxt'}
              </button>
            ))}
          </div>
        </div>

        {/* Homework Content Box */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-3">
          {hwLevel === 'maysa' && (
            <div className="space-y-2 text-xs sm:text-sm text-[var(--text-primary)] font-medium">
              <span className="font-bold text-emerald-600 block">🌱 Maysa topshiriqlari (20 ichida):</span>
              <ul className="list-decimal list-inside space-y-1 font-mono font-bold">
                <li>x + 3 = 10</li>
                <li>x + 5 = 12</li>
                <li>x − 4 = 8</li>
                <li>15 − x = 9</li>
                <li>x + 7 = 15</li>
              </ul>
              <div className="mt-2 p-2.5 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] text-xs">
                🖼️ <strong>Rasmli topshiriq:</strong> 4 ta olmaga nechta olma qo'shsak 11 ta bo'ladi? Daftarga tenglamasini chizing va yozing.
              </div>
            </div>
          )}

          {hwLevel === 'nihol' && (
            <div className="space-y-2 text-xs sm:text-sm text-[var(--text-primary)] font-medium">
              <span className="font-bold text-blue-600 block">🌿 Nihol topshiriqlari (100 ichida, 3 tur aralash):</span>
              <div className="grid grid-cols-2 gap-2 font-mono font-bold text-xs sm:text-sm">
                <div>1) x + 24 = 60</div>
                <div>2) x − 35 = 45</div>
                <div>3) 70 − x = 38</div>
                <div>4) 18 + x = 62</div>
                <div>5) x − 19 = 51</div>
                <div>6) 85 − x = 40</div>
                <div>7) x + 47 = 93</div>
                <div>8) 50 − x = 25</div>
              </div>
              <div className="mt-2 p-2.5 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] text-xs">
                📖 <strong>Hikoyali masala:</strong> Savatda x ta qalam bor edi. 12 tasini ishlatdik, 28 ta qoldi. Dastlab nechta qalam bo'lgan?
              </div>
            </div>
          )}

          {hwLevel === 'daraxt' && (
            <div className="space-y-2 text-xs sm:text-sm text-[var(--text-primary)] font-medium">
              <span className="font-bold text-purple-600 block">🌳 Daraxt topshiriqlari (Chuqurlashtirilgan):</span>
              <div className="grid grid-cols-2 gap-2 font-mono font-bold text-xs sm:text-sm">
                <div>1) x · 4 = 28</div>
                <div>2) x : 3 = 6</div>
                <div>3) 100 − x = 37</div>
                <div>4) x + 18 = 50</div>
                <div>5) 24 : x = 4</div>
                <div>6) x − 32 = 48</div>
              </div>
              <div className="mt-2 p-2.5 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] text-xs">
                ✨ <strong>Ijodiy topshiriq:</strong> Do'stingizga topishmoq qilib berish uchun 2 ta o'z tenglamangizni tuzib, rasmi bilan bezating!
              </div>
            </div>
          )}

          {/* Kitchen Creative Challenge */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded-xl text-xs text-amber-900 dark:text-amber-300">
            🍳 <strong>Qiziqarli tajriba: "Uyda tenglama qidir"</strong> Oshxonada ona bilan birga 2 ta kosa yoki tarozi yordamida tenglama yasab ko'ring (masalan, kosadagi yong'oqlar soni).
          </div>

          {/* Parent Tip */}
          <div className="p-3 bg-sky-50 dark:bg-sky-950/30 border border-sky-300 rounded-xl text-xs text-sky-900 dark:text-sky-300 flex items-start gap-2">
            <Heart className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong>Ota-onalar uchun eslatma:</strong> Bolaga javobni o'zingiz aytmang. Agar adashsa: <em>"Keling, x o'rniga shu sonni qo'yib tekshirib ko'ramiz"</em> deb yo'naltiring!
            </div>
          </div>

          {/* Action buttons: Copy & Print */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCopyHomework}
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-xs font-bold hover:bg-[var(--bg-surface)]"
            >
              {hwCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hwCopied ? 'Nusxalandi!' : 'Vazifani nusxalash'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stage Bottom Navigation */}
      <div className="flex items-center justify-between pt-2 no-print">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onPrev();
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Test sinovi</span>
        </button>

        <div className="text-xs text-[var(--text-secondary)] font-medium">
          Dars muvaffaqiyatli yakunlandi! 🌟
        </div>
      </div>
    </div>
  );
};
