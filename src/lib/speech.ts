/**
 * Web Speech API wrapper for reading aloud in UZ, RU, or EN.
 */

class SpeechController {
  private enabled: boolean = true;

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public speak(text: string, lang: 'uz' | 'ru' | 'en' = 'uz') {
    if (!this.enabled || !text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower, clear for 2nd grade kids
      utterance.pitch = 1.05; // Slightly cheerful

      const voices = window.speechSynthesis.getVoices();
      let targetLang = 'uz-UZ';
      if (lang === 'ru') targetLang = 'ru-RU';
      if (lang === 'en') targetLang = 'en-US';

      // Find matching voice or language prefix
      let matchedVoice = voices.find((v) => v.lang.toLowerCase() === targetLang.toLowerCase());
      if (!matchedVoice) {
        matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(lang));
      }

      // If Uzbek voice not installed in OS/browser, fallback
      if (!matchedVoice && lang === 'uz') {
        // Try Russian voice for phonetic approximation or default
        matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ru')) || voices[0];
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      } else {
        utterance.lang = targetLang;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('[speech] Speech synthesis failed:', e);
    }
  }
}

export const speech = new SpeechController();
