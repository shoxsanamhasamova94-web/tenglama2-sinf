/**
 * Mathematically verified 2nd grade equation generator and solver.
 * Guarantees natural numbers, non-negative results, realistic distractors.
 */

export type EquationType = 'add_x_first' | 'sub_x_first' | 'sub_x_second' | 'mult_x' | 'div_x';
export type DifficultyLevel = 'maysa' | 'nihol' | 'daraxt';

export interface EquationItem {
  id: string;
  type: EquationType;
  level: DifficultyLevel;
  expression: string; // e.g., "x + 6 = 15"
  x: number; // true unknown value
  a: number; // constant a
  b: number; // constant b
  ruleFormula: string; // e.g. "x = 15 − 6"
  ruleExplanationUz: string;
  ruleExplanationRu: string;
  ruleExplanationEn: string;
  checkStep: string; // e.g. "9 + 6 = 15 ✅"
  options: number[]; // 4 multiple choice options with smart distractors
  hint1Uz: string;
  hint1Ru: string;
  hint1En: string;
  hint2Uz: string;
  hint2Ru: string;
  hint2En: string;
  hint3Uz: string;
  hint3Ru: string;
  hint3En: string;
  storyUz?: string;
  storyRu?: string;
  storyEn?: string;
}

// Random helper
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate smart distractors based on typical 2nd-grade misconceptions
function generateSmartDistractors(type: EquationType, x: number, a: number, b: number, maxLimit: number): number[] {
  const distractors = new Set<number>();

  // Misconception 1: Inversion error (adds when should subtract, or subtracts when should add)
  if (type === 'add_x_first') {
    // Should be b - a. Common error: b + a
    distractors.add(b + a);
    distractors.add(Math.abs(b - a + 1));
    distractors.add(Math.abs(b - a - 1));
  } else if (type === 'sub_x_first') {
    // Should be b + a. Common error: b - a
    if (b > a) distractors.add(b - a);
    else distractors.add(a - b);
    distractors.add(b + a + 1);
    distractors.add(Math.max(1, b + a - 1));
  } else if (type === 'sub_x_second') {
    // Should be a - b. Common error: a + b
    distractors.add(a + b);
    distractors.add(Math.abs(a - b + 1));
    distractors.add(Math.abs(a - b - 1));
  } else if (type === 'mult_x') {
    // Should be b / a. Common error: b - a or b * a
    distractors.add(b - a);
    distractors.add(x + 1);
    distractors.add(Math.max(1, x - 1));
  } else {
    // div_x: Should be b * a. Common error: b + a or b / a
    distractors.add(b + a);
    distractors.add(x + 2);
    distractors.add(Math.max(1, x - 2));
  }

  // Fallbacks if not enough unique or contains x or negative/0
  const candidatePool = [x + 2, Math.max(1, x - 2), x + 3, Math.max(1, x - 3), x + 5, Math.max(1, x - 4)];
  for (const c of candidatePool) {
    if (distractors.size >= 3) break;
    if (c !== x && c > 0 && c <= maxLimit + 20) {
      distractors.add(c);
    }
  }

  // Ensure exactly 3 distractors, all different from x
  const cleanDistractors = Array.from(distractors).filter((d) => d !== x && d > 0).slice(0, 3);
  while (cleanDistractors.length < 3) {
    const extra = getRandomInt(1, maxLimit);
    if (extra !== x && !cleanDistractors.includes(extra)) {
      cleanDistractors.push(extra);
    }
  }

  const all = [x, ...cleanDistractors];
  // Shuffle options
  return all.sort(() => Math.random() - 0.5);
}

/**
 * Generate a random verified equation
 */
export function generateEquation(level: DifficultyLevel, forceType?: EquationType): EquationItem {
  let type: EquationType;
  if (forceType) {
    type = forceType;
  } else if (level === 'maysa') {
    // Maysa focuses on addition or basic subtraction within 20
    type = Math.random() > 0.4 ? 'add_x_first' : 'sub_x_first';
  } else if (level === 'nihol') {
    const types: EquationType[] = ['add_x_first', 'sub_x_first', 'sub_x_second'];
    type = types[Math.floor(Math.random() * types.length)];
  } else {
    // Daraxt can also have multiplication/division
    const types: EquationType[] = ['add_x_first', 'sub_x_first', 'sub_x_second', 'mult_x', 'div_x'];
    type = types[Math.floor(Math.random() * types.length)];
  }

  let x = 1;
  let a = 1;
  let b = 1;
  let expression = '';
  let ruleFormula = '';
  let checkStep = '';
  let ruleUz = '';
  let ruleRu = '';
  let ruleEn = '';
  let maxLimit = 20;

  if (level === 'maysa') {
    maxLimit = 20;
    if (type === 'add_x_first') {
      x = getRandomInt(2, 10);
      a = getRandomInt(1, 10);
      b = x + a;
      expression = `x + ${a} = ${b}`;
      ruleFormula = `x = ${b} − ${a}`;
      checkStep = `${x} + ${a} = ${b} ✅`;
      ruleUz = `Yig'indidan (${b}) ma'lum qo'shiluvchini (${a}) ayiramiz: x = ${b} − ${a} = ${x}`;
      ruleRu = `Из суммы (${b}) вычитаем известное слагаемое (${a}): x = ${b} − ${a} = ${x}`;
      ruleEn = `Subtract the known addend (${a}) from the sum (${b}): x = ${b} − ${a} = ${x}`;
    } else {
      type = 'sub_x_first';
      a = getRandomInt(2, 8);
      b = getRandomInt(2, 10);
      x = b + a;
      expression = `x − ${a} = ${b}`;
      ruleFormula = `x = ${b} + ${a}`;
      checkStep = `${x} − ${a} = ${b} ✅`;
      ruleUz = `Kamayuvchini topish uchun ayirmaga (${b}) ayriluvchini (${a}) qo'shamiz: x = ${b} + ${a} = ${x}`;
      ruleRu = `Чтобы найти уменьшаемое, к разности (${b}) прибавляем вычитаемое (${a}): x = ${b} + ${a} = ${x}`;
      ruleEn = `To find the minuend, add the subtrahend (${a}) to the difference (${b}): x = ${b} + ${a} = ${x}`;
    }
  } else if (level === 'nihol') {
    maxLimit = 100;
    if (type === 'add_x_first') {
      x = getRandomInt(5, 55);
      a = getRandomInt(5, 40);
      b = x + a;
      expression = `x + ${a} = ${b}`;
      ruleFormula = `x = ${b} − ${a}`;
      checkStep = `${x} + ${a} = ${b} ✅`;
      ruleUz = `Noma'lum qo'shiluvchini topish: x = ${b} − ${a}`;
      ruleRu = `Нахождение неизвестного слагаемого: x = ${b} − ${a}`;
      ruleEn = `Finding the unknown addend: x = ${b} − ${a}`;
    } else if (type === 'sub_x_first') {
      a = getRandomInt(5, 40);
      b = getRandomInt(5, 45);
      x = a + b;
      expression = `x − ${a} = ${b}`;
      ruleFormula = `x = ${b} + ${a}`;
      checkStep = `${x} − ${a} = ${b} ✅`;
      ruleUz = `Kamayuvchini topish: x = ${b} + ${a}`;
      ruleRu = `Нахождение уменьшаемого: x = ${b} + ${a}`;
      ruleEn = `Finding the minuend: x = ${b} + ${a}`;
    } else {
      type = 'sub_x_second';
      x = getRandomInt(5, 40);
      b = getRandomInt(5, 40);
      a = x + b;
      expression = `${a} − x = ${b}`;
      ruleFormula = `x = ${a} − ${b}`;
      checkStep = `${a} − ${x} = ${b} ✅`;
      ruleUz = `Ayriluvchini topish uchun kamayuvchidan (${a}) ayirmani (${b}) ayiramiz: x = ${a} − ${b}`;
      ruleRu = `Чтобы найти вычитаемое, из уменьшаемого (${a}) вычитаем разность (${b}): x = ${a} − ${b}`;
      ruleEn = `To find subtrahend, subtract difference (${b}) from minuend (${a}): x = ${a} − ${b}`;
    }
  } else {
    // Daraxt
    maxLimit = 100;
    if (type === 'mult_x') {
      x = getRandomInt(2, 9);
      a = getRandomInt(2, 5);
      b = x * a;
      expression = `x · ${a} = ${b}`;
      ruleFormula = `x = ${b} : ${a}`;
      checkStep = `${x} · ${a} = ${b} ✅`;
      ruleUz = `Ko'paytuvchini topish uchun ko'paytmani bo'lamiz: x = ${b} : ${a}`;
      ruleRu = `Чтобы найти множитель, делим произведение: x = ${b} : ${a}`;
      ruleEn = `To find factor, divide product by known factor: x = ${b} : ${a}`;
    } else if (type === 'div_x') {
      a = getRandomInt(2, 5);
      b = getRandomInt(2, 8);
      x = a * b;
      expression = `x : ${a} = ${b}`;
      ruleFormula = `x = ${b} · ${a}`;
      checkStep = `${x} : ${a} = ${b} ✅`;
      ruleUz = `Bo'linuvchini topish uchun bo'linmaga bo'luvchini ko'paytiramiz: x = ${b} · ${a}`;
      ruleRu = `Чтобы найти делимое, умножаем частное на делитель: x = ${b} · ${a}`;
      ruleEn = `To find dividend, multiply quotient by divisor: x = ${b} · ${a}`;
    } else if (type === 'sub_x_second') {
      x = getRandomInt(12, 45);
      b = getRandomInt(10, 40);
      a = x + b;
      expression = `${a} − x = ${b}`;
      ruleFormula = `x = ${a} − ${b}`;
      checkStep = `${a} − ${x} = ${b} ✅`;
      ruleUz = `Ayriluvchini topish: x = ${a} − ${b}`;
      ruleRu = `Нахождение вычитаемого: x = ${a} − ${b}`;
      ruleEn = `Finding the subtrahend: x = ${a} − ${b}`;
    } else if (type === 'sub_x_first') {
      a = getRandomInt(15, 45);
      b = getRandomInt(15, 45);
      x = a + b;
      expression = `x − ${a} = ${b}`;
      ruleFormula = `x = ${b} + ${a}`;
      checkStep = `${x} − ${a} = ${b} ✅`;
      ruleUz = `Kamayuvchini topish: x = ${b} + ${a}`;
      ruleRu = `Нахождение уменьшаемого: x = ${b} + ${a}`;
      ruleEn = `Finding the minuend: x = ${b} + ${a}`;
    } else {
      type = 'add_x_first';
      x = getRandomInt(15, 50);
      a = getRandomInt(15, 45);
      b = x + a;
      expression = `x + ${a} = ${b}`;
      ruleFormula = `x = ${b} − ${a}`;
      checkStep = `${x} + ${a} = ${b} ✅`;
      ruleUz = `Noma'lum qo'shiluvchini topish: x = ${b} − ${a}`;
      ruleRu = `Нахождение неизвестного слагаемого: x = ${b} − ${a}`;
      ruleEn = `Finding unknown addend: x = ${b} − ${a}`;
    }
  }

  const options = generateSmartDistractors(type, x, a, b, maxLimit);

  // 3-step scaffold hints
  const hint1Uz = type === 'add_x_first'
    ? "Eslatma: Qo'shish amali. Noma'lum qo'shiluvchini topish uchun yig'indidan ayirish kerak!"
    : type === 'sub_x_first'
    ? "Eslatma: Ayirish amali. Kamayuvchi eng katta son, uni topish uchun qo'shamiz!"
    : type === 'sub_x_second'
    ? "Eslatma: Ayriluvchini topish uchun kamayuvchidan ayirmani ayiramiz!"
    : "Eslatma: Ko'paytirish va bo'lish bir-biriga teskari amal.";

  const hint1Ru = type === 'add_x_first'
    ? "Напоминание: Сложение. Чтобы найти слагаемое, нужно вычесть из суммы!"
    : type === 'sub_x_first'
    ? "Напоминание: Вычитание. Уменьшаемое самое большое число, складываем!"
    : type === 'sub_x_second'
    ? "Напоминание: Чтобы найти вычитаемое, вычитаем разность из уменьшаемого!"
    : "Напоминание: Умножение и деление — взаимно обратные действия.";

  const hint1En = type === 'add_x_first'
    ? "Reminder: Addition. To find the unknown addend, subtract from the sum!"
    : type === 'sub_x_first'
    ? "Reminder: Subtraction. Minuend is the largest number, so we add!"
    : type === 'sub_x_second'
    ? "Reminder: To find subtrahend, subtract the difference from the minuend!"
    : "Reminder: Multiplication and division are inverse operations.";

  const hint2Uz = `Qoida formulasi: ${ruleFormula}`;
  const hint2Ru = `Формула правила: ${ruleFormula}`;
  const hint2En = `Rule formula: ${ruleFormula}`;

  const hint3Uz = `Deyarli yechim: Hisoblaganda x = ${x} chiqadi. Tekshir: ${checkStep}`;
  const hint3Ru = `Почти решение: При вычислении x = ${x}. Проверь: ${checkStep}`;
  const hint3En = `Almost solved: Calculating gives x = ${x}. Check: ${checkStep}`;

  return {
    id: `eq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    level,
    expression,
    x,
    a,
    b,
    ruleFormula,
    ruleExplanationUz: ruleUz,
    ruleExplanationRu: ruleRu,
    ruleExplanationEn: ruleEn,
    checkStep,
    options,
    hint1Uz,
    hint1Ru,
    hint1En,
    hint2Uz,
    hint2Ru,
    hint2En,
    hint3Uz,
    hint3Ru,
    hint3En,
  };
}
