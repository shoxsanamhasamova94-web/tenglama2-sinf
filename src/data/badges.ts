export interface Badge {
  id: string;
  emoji: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  descUz: string;
  descRu: string;
  descEn: string;
  unlocked: boolean;
}

export const initialBadges: Badge[] = [
  {
    id: 'first_equation',
    emoji: '🎯',
    nameUz: 'Birinchi tenglama',
    nameRu: 'Первое уравнение',
    nameEn: 'First Equation',
    descUz: 'Ilk tenglamangizni muvaffaqiyatli yechdingiz!',
    descRu: 'Вы успешно решили своё первое уравнение!',
    descEn: 'Successfully solved your first equation!',
    unlocked: false,
  },
  {
    id: 'scale_master',
    emoji: '⚖️',
    nameUz: 'Tarozi ustasi',
    nameRu: 'Мастер весов',
    nameEn: 'Scale Master',
    descUz: 'Tarozini muvozanatlash sirini ochdingiz!',
    descRu: 'Раскрыли секрет равновесия на весах!',
    descEn: 'Discovered the secret of scale balance!',
    unlocked: false,
  },
  {
    id: 'checker',
    emoji: '🔍',
    nameUz: 'Qat\'iy tekshiruvchi',
    nameRu: 'Мастер проверки',
    nameEn: 'Careful Checker',
    descUz: 'Tenglamani tekshirish bosqichini to\'g\'ri bajardingiz!',
    descRu: 'Правильно выполнили шаг проверки уравнения!',
    descEn: 'Correctly performed the equation check step!',
    unlocked: false,
  },
  {
    id: 'detective',
    emoji: '🕵️',
    nameUz: 'Tenglama detektivi',
    nameRu: 'Детектив ошибок',
    nameEn: 'Equation Detective',
    descUz: 'Yechimdagi yashirin xatoni topdingiz va to\'g\'riladingiz!',
    descRu: 'Нашли и исправили скрытую ошибку в решении!',
    descEn: 'Found and corrected a hidden mistake in the solution!',
    unlocked: false,
  },
  {
    id: 'learned_from_mistakes',
    emoji: '💡',
    nameUz: 'Xatolardan o\'rgangan',
    nameRu: 'Мудрый ученик',
    nameEn: 'Learned from Mistakes',
    descUz: 'Xato qilishdan qo\'rqmasdan, qayta urinib muvaffaqiyat qozondingiz!',
    descRu: 'Не побоялись ошибки, повторили и достигли успеха!',
    descEn: 'Overcame a tricky problem through perseverance!',
    unlocked: false,
  },
];
