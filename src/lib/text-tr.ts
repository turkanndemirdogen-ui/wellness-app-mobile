/**
 * text-tr — Türkçe locale metin yardımcıları (15 §5).
 *
 * Case dönüşümlerinde DAİMA 'tr-TR' kullanılır: İ/ı ayrımı (i→İ, I→ı) yalnız
 * bu locale ile doğru çalışır. Zorunlu karakter seti: Ç ç Ğ ğ İ ı Ö ö Ş ş Ü ü.
 */

export const TR_LOCALE = 'tr-TR';

/** TR karakter kapsam testi için referans dizgi (dev-gallery + testler). */
export const TR_TEST_STRING = 'Ç ç Ğ ğ İ ı Ö ö Ş ş Ü ü';

export function upperTR(text: string): string {
  return text.toLocaleUpperCase(TR_LOCALE);
}

export function lowerTR(text: string): string {
  return text.toLocaleLowerCase(TR_LOCALE);
}

/** İlk harfi TR kuralıyla büyütür (istanbul → İstanbul). */
export function capitalizeTR(text: string): string {
  if (text.length === 0) return text;
  return upperTR(text.charAt(0)) + text.slice(1);
}
