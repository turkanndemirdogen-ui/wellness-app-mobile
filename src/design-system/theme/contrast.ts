/**
 * Kontrast yardımcıları (15 §10 · 12 §B · WCAG 2.1 SC 1.4.3).
 *
 * Eşikler: normal metin 4.5:1 · büyük metin 3:1 · temel ikon 3:1. Semantic
 * katman accent üstündeki metin rengini BURADAN seçer (elle "beyaz yazarız"
 * varsayımı yok); testler aynı fonksiyonlarla ölçer — tek hesap kaynağı.
 */

/** WCAG normal metin eşiği. */
export const AA_NORMAL = 4.5;
/** WCAG büyük metin / temel ikon eşiği. */
export const AA_LARGE = 3;

function channel(value: number): number {
  const v = value / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

/** '#RRGGBB' → WCAG bağıl parlaklık (0-1). Kısa (#RGB) yazım da kabul edilir. */
export function relativeLuminance(hex: string): number {
  const raw = hex.replace('#', '');
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : raw;
  const r = channel(parseInt(full.slice(0, 2), 16));
  const g = channel(parseInt(full.slice(2, 4), 16));
  const b = channel(parseInt(full.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** İki rengin kontrast oranı (1-21). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Verilen zemin için adaylardan en yüksek kontrastlı metin rengini seçer. */
export function bestTextOn(background: string, candidates: readonly string[]): string {
  let best = candidates[0];
  let bestRatio = -1;
  for (const candidate of candidates) {
    const ratio = contrastRatio(background, candidate);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = candidate;
    }
  }
  return best;
}
