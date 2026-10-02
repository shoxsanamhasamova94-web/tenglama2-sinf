/**
 * Safe localStorage wrapper with 'tenglamalar:' prefix and fallback
 */

const PREFIX = 'tenglamalar:';

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(PREFIX + key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`[storage] Error reading key ${key}:`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[storage] Error writing key ${key}:`, error);
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (error) {
    console.warn(`[storage] Error removing key ${key}:`, error);
  }
}

export function clearAppStorage(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (error) {
    console.warn('[storage] Error clearing storage:', error);
  }
}
