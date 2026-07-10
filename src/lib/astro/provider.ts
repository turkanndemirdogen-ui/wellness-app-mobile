/**
 * AstroProvider — gökyüzü hesabı SOYUTLAMA arayüzü.
 *
 * base'deki embed() abstraction'ının (embed.mjs) aynı felsefesi: hesap tek bir
 * arayüzün arkasında; sağlayıcı config'ten gelir, ileride değişirse yalnız burası
 * + yeni sağlayıcı dosyası eklenir. Şimdiki tek sağlayıcı 'mock'; asıl sağlayıcı
 * ileride Swiss Ephemeris (K4-3=b, LOKAL hesap — uzak AstroAPI YOK, doğum verisi
 * dışarı çıkmaz / KVKK).
 */

import type { BirthInput, DailyTransit, NatalChart } from './types';

export interface AstroProvider {
  /** Tanı/gözlemlenebilirlik için sağlayıcı adı ('mock' | 'swiss' | …). */
  readonly name: string;

  /** Doğum girdisinden natal harita. Saat yoksa moon/asc null (güneş-bazlı). */
  getNatalChart(input: BirthInput): Promise<NatalChart>;

  /** Verilen gün için natal'a göre transit olayları + ay fazı/burcu + temalar. */
  getDailyTransit(natal: NatalChart, date: string): Promise<DailyTransit>;
}
