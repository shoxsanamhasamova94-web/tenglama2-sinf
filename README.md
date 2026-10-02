# Tenglamalar - 2-sinf Matematika Interaktiv Darsi

2-sinf o'quvchilari uchun matematika fanidan **"TENGLAMALAR"** mavzusida to'liq, interaktiv, bitta sahifali (SPA) dars platformasi.

## 🚀 Texnik xususiyatlar
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **Dizayn va animatsiya**: Framer Motion, Lucide ikonlar, Canvas Confetti
- **i18n**: O'zbekcha (lotin), Ruscha, Inglizcha to'liq tarjima
- **Ovoz**: Web Audio API (hech qanday tashqi audio fayllarsiz), Web Speech API ovozli o'qish
- **Mavzular**: Yorug' (Light ☀️), Qorong'i (Dark 🌙), Diqqat rejimi (Workly 📒)
- **Maxsus qulayliklar (A11y)**: Shrift o'lchami, Disleksiya shrifti, Yuqori kontrast, Rangli raqamlar, Doska rejimi (Smartboard)
- **Pedagogik metodika**: CPA (Concrete, Pictorial, Abstract) tizimi, 7 bosqichli 45 daqiqalik dars ssenariysi

---

## 📦 O'rnatish va Ishga tushirish

1. **Repozitoriyani klonlash yoki yuklab olish:**
```bash
git clone https://github.com/your-username/tenglamalar.git
cd tenglamalar
```

2. **Bog'liqliklarni o'rnatish:**
```bash
npm install
```

3. **Lokal serverda ishga tushirish (dev):**
```bash
npm run dev
```
Brauzerda `http://localhost:3000` manzilini oching.

4. **Production uchun yig'ish (build):**
```bash
npm run build
```

---

## 📝 Kontentni tahrirlash (O'qituvchilar uchun)

Saytdagi barcha dars matnlari, savollar va rejalar alohida ma'lumot fayllarida saqlangan:
- **Savollar bazasi va testlar**: `src/data/questions.ts` faylida. Yangi savollar qo'shishingiz yoki javoblarni o'zgartirishingiz mumkin.
- **Dars rejasi va metodik tavsiyalar**: `src/data/lessonPlan.ts` faylida 45 daqiqalik dars bosqichlari va o'qituvchi nutqlari.
- **Lug'at va tarjimalar**: `src/i18n/uz.json`, `src/i18n/ru.json`, `src/i18n/en.json` fayllarida.
- **Nishonlar (Gamifikatsiya)**: `src/data/badges.ts` faylida.

---

## ☁️ Vercel'ga Deploy qilish qadamlari

Loyihada `vercel.json` fayli allaqachon sozlangan:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Deploy qilish uchun:
1. GitHub repozitoriyangizga push qiling:
```bash
git add .
git commit -m "Initial release of Tenglamalar lesson app"
git push origin main
```
2. [Vercel](https://vercel.com) saytiga kiring va "Add New Project" tugmasini bosing.
3. GitHub repozitoriyangizni tanlang.
4. "Build Command" sifatida `vite build` va "Output Directory" sifatida `dist` ko'rsatiladi.
5. "Deploy" tugmasini bosing. 1 daqiqa ichida sayt jonli ishga tushadi!
