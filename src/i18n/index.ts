import uz from './uz.json';
import ru from './ru.json';
import en from './en.json';
import { getStorageItem, setStorageItem } from '../lib/storage';

export type Language = 'uz' | 'ru' | 'en';

const translations: Record<Language, typeof uz> = {
  uz,
  ru: ru as typeof uz,
  en: en as typeof uz,
};

let currentLang: Language = getStorageItem<Language>('lang', 'uz');

export function getCurrentLanguage(): Language {
  return currentLang;
}

export function setLanguage(lang: Language): void {
  currentLang = lang;
  setStorageItem('lang', lang);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

/**
 * Access nested keys using dot notation like "app.title" or "terms.equation"
 */
export function t(keyPath: string, params?: Record<string, string | number>): string {
  const dict = translations[currentLang] || translations.uz;
  const parts = keyPath.split('.');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = dict;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Fallback to Uzbek
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let fallback: any = translations.uz;
      for (const p of parts) {
        if (fallback && typeof fallback === 'object' && p in fallback) {
          fallback = fallback[p];
        } else {
          return keyPath;
        }
      }
      current = fallback;
      break;
    }
  }

  if (typeof current !== 'string') {
    return keyPath;
  }

  let text = current;
  if (params) {
    Object.entries(params).forEach(([k, val]) => {
      text = text.replace(new RegExp(`{${k}}`, 'g'), String(val));
    });
  }

  return text;
}
