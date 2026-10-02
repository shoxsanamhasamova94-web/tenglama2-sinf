export interface StagePlan {
  stageId: number;
  timeMinutes: number;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  goalUz: string;
  goalRu: string;
  goalEn: string;
  teacherScriptUz: string;
  teacherScriptRu: string;
  teacherScriptEn: string;
  tipsUz: string[];
  tipsRu: string[];
  tipsEn: string[];
}

export const lessonPlanData: StagePlan[] = [
  {
    stageId: 1,
    timeMinutes: 3,
    titleUz: "Kirish va motivatsiya",
    titleRu: "Введение и мотивация",
    titleEn: "Introduction & Warm Welcome",
    goalUz: "O'quvchilar diqqatini jamlash, dars maqsadini tushuntirish va do'stona muhit yaratish.",
    goalRu: "Сфокусировать внимание учащихся, объяснить цель урока и создать доброжелательную атмосферу.",
    goalEn: "Focus students' attention, state the lesson goal, and build an encouraging mood.",
    teacherScriptUz: "Assalomu alaykum, aziz bolajonlar! Bugun biz sirli x harfi bilan tanishamiz va noma'lum sonlarni topish sirini o'rganamiz!",
    teacherScriptRu: "Здравствуйте, юные математики! Сегодня мы познакомимся с таинственной буквой x и раскроем секрет нахождения неизвестных чисел!",
    teacherScriptEn: "Hello, little mathematicians! Today we will meet the mysterious letter x and discover how to find unknown numbers!",
    tipsUz: [
      "Har bir bolaning kayfiyat belgisini bosishiga imkon bering.",
      "Mavzuga ko'prik: olma solingan quti topishmog'ini barchaga ovoz chiqarib ayttiring."
    ],
    tipsRu: [
      "Дайте каждому ребёнку отметить своё настроение.",
      "Мостик к теме: загадку с яблоками в коробке проговорите вслух вместе с классом."
    ],
    tipsEn: [
      "Let every child tap their mood icon.",
      "Bridge to the topic: read the apple box riddle aloud together."
    ],
  },
  {
    stageId: 2,
    timeMinutes: 2,
    titleUz: "Davomat va navbatchi",
    titleRu: "Посещаемость и дежурный",
    titleEn: "Attendance & Daily Duty",
    goalUz: "Davomatni dars mazmuniga bog'lash: sinfdagi bolalar sonini tenglama sifatida ifodalash.",
    goalRu: "Связать перекличку с темой урока: выразить количество присутствующих через уравнение.",
    goalEn: "Connect attendance to equations: model present students as an equation.",
    teacherScriptUz: "Keling, davomatni tekshiramiz. Agar sinfimizda 25 o'quvchi bo'lsa va 2 kishi kelmagan bo'lsa, kelganlarni x deb olamiz: 25 − 2 = x!",
    teacherScriptRu: "Давайте проверим присутствие. Если в классе 25 учеников и двое отсутствуют, обозначим присутствующих через x: 25 − 2 = x!",
    teacherScriptEn: "Let's check attendance. If our class has 25 students and 2 are absent, let present students be x: 25 − 2 = x!",
    tipsUz: [
      "O'quvchi avatarini bir marta bosish holatini o'zgartiradi.",
      "G'ildirakni aylantirib 'Bugungi navbatchi'ni tasodifiy tanlang."
    ],
    tipsRu: [
      "Одно нажатие на карточку ученика меняет статус: пришёл, отсутствует, опоздал.",
      "Используйте колесо фортуны для выбора дежурного дня."
    ],
    tipsEn: [
      "One tap on an avatar cycles status: present, absent, tardy.",
      "Use the wheel to pick the daily helper."
    ],
  },
  {
    stageId: 3,
    timeMinutes: 6,
    titleUz: "O'tgan darsni takrorlash",
    titleRu: "Повторение пройденного",
    titleEn: "Review of Prior Knowledge",
    goalUz: "Qo'shish va ayirish atamalari (qo'shiluvchi, yig'indi, kamayuvchi, ayriluvchi, ayirma) hamda 'bo'sh katak' misollarini mustahkamlash.",
    goalRu: "Закрепление терминов сложения и вычитания и примеров с «пустым окошком».",
    goalEn: "Reinforce addition/subtraction terms and 'empty box' visual calculations.",
    teacherScriptUz: "Eslang: 6 + □ = 10 misolida bo'sh katak ichidagi sonni qanday topardik? Mana shu katak bugun x harfiga aylanadi!",
    teacherScriptRu: "Вспомните: как мы находили число в окошке 6 + □ = 10? Сегодня это окошко превратится в букву x!",
    teacherScriptEn: "Remember: how did we find the missing number in 6 + □ = 10? Today, that box becomes letter x!",
    tipsUz: [
      "Bo'sh katakdan x ga o'tish animatsiyasiga bolalar e'tiborini qarating.",
      "Atamalarni juftlash mashqida bolalarni doskaga chaqiring."
    ],
    tipsRu: [
      "Обратите внимание детей на анимацию превращения квадрата в x.",
      "При соединении терминов пригласите учеников к доске."
    ],
    tipsEn: [
      "Highlight the animation morphing the empty box into x.",
      "Invite students to drag terms to matching parts on the board."
    ],
  },
  {
    stageId: 4,
    timeMinutes: 10,
    titleUz: "Yangi mavzu — Tenglamalar (CPA metodi)",
    titleRu: "Новая тема — Уравнения (Метод CPA)",
    titleEn: "New Topic — Equations (CPA Method)",
    goalUz: "Tenglamaning 3 ta asosiy turini tarozi va qoidalar yordamida chuqur, amaliy va ko'rgazmali tushunish.",
    goalRu: "Глубокое понимание 3 типов уравнений через весы, правила и обязательную проверку.",
    goalEn: "Master 3 equation types through scales, rules, and mandatory check steps.",
    teacherScriptUz: "Tarozi muvozanatda bo'lishi uchun har ikki tomonda bir xil vazn bo'lishi shart! Agar bir tomondan 3 ta olsak, ikkinchi tomondan ham 3 ta olishimiz kerak.",
    teacherScriptRu: "Чтобы весы были в равновесии, на обеих чашах должен быть одинаковый вес! Если снимаем 3 яблока с одной чаши, столько же снимаем и с другой.",
    teacherScriptEn: "For the balance to stay even, both sides must weigh the same! If we take 3 apples from one side, we must take 3 from the other too.",
    tipsUz: [
      "Har doim tekshirish qadamini birgalikda bajaring: x ning o'rniga chiqqan sonni qo'yamiz.",
      "Tipik xato: x − 5 = 3 da bolalar 3 dan 5 ni ayirishga urinadi. Eslating: kamayuvchi doim eng katta son!"
    ],
    tipsRu: [
      "Всегда выполняйте шаг проверки: подставляем найденное число вместо x.",
      "Типичная ошибка: в x − 5 = 3 дети вычитают 3 − 5. Напомните: уменьшаемое всегда самое большое число!"
    ],
    tipsEn: [
      "Always do the check step together: substitute the found number for x.",
      "Common error: in x − 5 = 3 students try 3 − 5. Remind them: minuend is the largest number!"
    ],
  },
  {
    stageId: 5,
    timeMinutes: 12,
    titleUz: "Interaktiv mashqlar va o'yinlar",
    titleRu: "Интерактивные упражнения и игры",
    titleEn: "Interactive Games & Guided Practice",
    goalUz: "8 xil o'yin orqali turli o'rganish uslubidagi bolalarni qamrab olish.",
    goalRu: "Вовлечение детей с разными стилями восприятия через 8 развивающих игр.",
    goalEn: "Engage diverse learners through 8 differentiated educational games.",
    teacherScriptUz: "Endi esa o'yinlar maydoniga o'tamiz! O'zingizga yoqqan o'yinni tanlang yoki doskada poyga o'ynaymiz!",
    teacherScriptRu: "А теперь переходим на игровую поляну! Выберите любимую игру или устроим математическую эстафету у доски!",
    teacherScriptEn: "Now let's visit the game arena! Pick a favorite game or run an equation team race on the smartboard!",
    tipsUz: [
      "Qiyinlik darajasini bola o'zi tanlasin (Maysa / Nihol / Daraxt).",
      "Detektiv o'yinida bolalar xatoni topib, nima uchun xato ekanini tushuntirib bersin."
    ],
    tipsRu: [
      "Позвольте ученику самому выбрать уровень (Росток / Саженец / Дерево).",
      "В игре «Детектив» просите объяснить, в чём именно заключалась ошибка."
    ],
    tipsEn: [
      "Let students choose their comfort level (Sprout / Sapling / Tree).",
      "In the Detective game, have students explain why the mistake occurred."
    ],
  },
  {
    stageId: 6,
    timeMinutes: 7,
    titleUz: "Bilimlarni tekshirish (Test)",
    titleRu: "Проверка знаний (Тест)",
    titleEn: "Knowledge Check (Quiz)",
    goalUz: "O'quvchilarning mavzuni qanchalik o'zlashtirganini 4 xil savol formati orqali aniqlash.",
    goalRu: "Определить уровень усвоения темы через 4 разнообразных формата вопросов.",
    goalEn: "Assess equation mastery through 4 rich question formats without pressure.",
    teacherScriptUz: "Hech qanday qo'rquvsiz, o'z bilimimizni sinab ko'ramiz. Xato qilsangiz ham xafa bo'lmang, xatolar bizni kuchli qiladi!",
    teacherScriptRu: "Без спешки и страха проверим наши силы. Если ошибётесь — не переживайте, ошибки помогают учиться!",
    teacherScriptEn: "Without fear, let's test our knowledge. Don't worry if you make a slip, mistakes help us grow!",
    tipsUz: [
      "Taymer ixtiyoriy, sekin ishlaydigan bolalar uchun taymerni o'chirib qo'ying.",
      "Test yakunida 'Xatolar ustida ishlash' tugmasidan foydalaning."
    ],
    tipsRu: [
      "Таймер опционален, для неторопливых детей выключите его.",
      "В конце обязательно нажмите «Работа над ошибками» для разбора."
    ],
    tipsEn: [
      "Timer is optional; turn it off for students who need more time.",
      "Use the 'Review Mistakes' feature after finishing the quiz."
    ],
  },
  {
    stageId: 7,
    timeMinutes: 5,
    titleUz: "Baholash, sertifikat va uyga vazifa",
    titleRu: "Оценивание, сертификат и д/з",
    titleEn: "Evaluation, Certificate & Homework",
    goalUz: "Ijobiy rag'batlantirish, sertifikat berish va tabaqalashtirilgan uyga vazifa belgilash.",
    goalRu: "Позитивная обратная связь, именной сертификат и дифференцированное домашнее задание.",
    goalEn: "Positive reinforcement, certificate generation, and leveled home assignments.",
    teacherScriptUz: "Bugun barchangiz ajoyib qatnashdingiz! Har biringiz haqiqiy 'Tenglama ustasi' bo'ldingiz!",
    teacherScriptRu: "Сегодня все прекрасно потрудились! Каждый из вас стал настоящим мастером уравнений!",
    teacherScriptEn: "You all did fantastically today! Each of you is now a true Equation Champion!",
    tipsUz: [
      "O'quvchilar o'z-o'zini baholash svetoforini (😀🙂😐) belgilasin.",
      "Sertifikatni chop etib yoki rasm qilib saqlash imkonini ko'rsating.",
      "Ota-onalar uchun eslatmani daftarga yopishtirishni tavsiya qiling."
    ],
    tipsRu: [
      "Пусть дети выберут смайлик самооценки.",
      "Распечатайте сертификат или сохраните его как изображение.",
      "Рекомендуйте вклеить памятку для родителей в дневник."
    ],
    tipsEn: [
      "Have students choose their self-assessment icon.",
      "Print or export the certificate for the child.",
      "Share the parent guide for gentle home support."
    ],
  },
];

export const teacherPedagogyGuide = {
  misconceptions: [
    {
      titleUz: "Xato 1: x − a = b da ayirib yuborish (masalan, x − 4 = 6 da 6 − 4 = 2)",
      titleRu: "Ошибка 1: Вычитание в x − a = b (например, x − 4 = 6 -> 6 − 4 = 2)",
      titleEn: "Error 1: Subtracting in x − a = b (e.g., x − 4 = 6 -> 6 − 4 = 2)",
      explanationUz: "Bola ikkala sonni ko'rib avtomatik ravishda kattasidan kichigini ayiradi. Yechim: 'x bu eng katta son, ayrilayotgan sonlar uning bo'laklari, butunni topish uchun bo'laklarni qo'shamiz' deb tushuntiring.",
      explanationRu: "Ребёнок автоматически вычитает из большего меньшее. Решение: покажите, что x — это целое (самое большое), а части нужно сложить.",
      explanationEn: "Child reflexively subtracts numbers. Remedy: Minuend x is the whole, parts must be added together.",
    },
    {
      titleUz: "Xato 2: x + a = b da qo'shib yuborish (masalan, x + 5 = 12 da 12 + 5 = 17)",
      titleRu: "Ошибка 2: Сложение в x + a = b (например, x + 5 = 12 -> 12 + 5 = 17)",
      titleEn: "Error 2: Adding in x + a = b (e.g., x + 5 = 12 -> 12 + 5 = 17)",
      explanationUz: "Misoldagi '+' belgisiga qarab hisoblashda ham qo'shib yuboradi. Yechim: 'Tarozi muvozanati' modelini eslating: 17 qo'ysak tarozi qulab ketadi!",
      explanationRu: "Видит знак «+» и складывает. Решение: модель весов — если положить 17, весы рухнут!",
      explanationEn: "Triggered by '+' sign. Remedy: Balance scale visualizer demonstrates that 17 causes severe imbalance.",
    },
    {
      titleUz: "Xato 3: a − x = b da a + b qilish (masalan, 15 − x = 9 da 15 + 9 = 24)",
      titleRu: "Ошибка 3: Сложение в a − x = b (например, 15 − x = 9 -> 15 + 9 = 24)",
      titleEn: "Error 3: Adding in a − x = b (e.g., 15 − x = 9 -> 15 + 9 = 24)",
      explanationUz: "Kamayuvchi va ayriluvchini adashtirish. Yechim: 15 ta olmaning ichidan 24 ta yeb bo'lmaydi-ku deb savol bering.",
      explanationRu: "Путаница между уменьшаемым и вычитаемым. Решение: спросите, можно ли из 15 яблок съесть 24?",
      explanationEn: "Confusing minuend and subtrahend. Remedy: Ask if you can eat 24 apples when you only had 15.",
    },
  ],
  differentiationTips: [
    "🌱 Maysa darajasidagi o'quvchilarga: Tarozili visual modelni doimo ochiq qoldiring, sanoq cho'plari yoki sonli chiziqdan foydalanishiga ruxsat bering.",
    "🌿 Nihol darajasidagi o'quvchilarga: Formulalarni yoddan emas, ma'nosini tushunib 'Noma'lum qaysi o'rinda?' savoliga javob berishga o'rgating.",
    "🌳 Daraxt darajasidagi o'quvchilarga: Hayotiy voqealar asosida o'zlari tenglama tuzish topshirig'ini bering ('Menda 14 ta daftar bor edi...').",
  ],
};
