/**
 * 4→8 faz eşlemesi — P2 iki-adımlı sıranın A adımı (checkpoint açık kalem 10).
 *
 * Mevcut astro sağlayıcı sözleşmesi 4 kanonik faz üretir (lib/astro
 * DailyTransit['moonPhase'] = domain-ui MoonPhaseName). 8 SVG hazır bekler;
 * bu eşleme 4 gerçek fazı 4 DOĞRU glyph'e bağlar — ara fazlar veri gelene
 * dek KULLANILMAZ (05 §8: faz yanlış/yaklaşık gösterilemez). 8-faz veri
 * genişlemesi Adım 6 astro-core'da, golden fixture'larla koordine edilir;
 * bu dosya o güne dek arayüzün 4 fazın altına düşmemesini garanti eder.
 */

import type { MoonPhaseGlyphName } from './types';

/** Astro sözleşmesinin 4 kanonik fazı — domain-ui MoonPhaseName ile AYNI (test korur). */
export type FourPhaseName = 'yeni' | 'ilk_dordun' | 'dolunay' | 'son_dordun';

export const fourPhaseToGlyph = {
  yeni: 'new',
  ilk_dordun: 'firstQuarter',
  dolunay: 'full',
  son_dordun: 'lastQuarter',
} as const satisfies Record<FourPhaseName, MoonPhaseGlyphName>;
