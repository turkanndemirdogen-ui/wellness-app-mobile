/**
 * mockProvider — GERÇEK HESAP YOK. Sabit, makul yer-tutucu veri döndürür.
 *
 * Amaç: app iskeleti + motor akışını, Swiss Ephemeris (K4-3=b, ertelendi)
 * gelmeden uçtan uca test edebilmek. Döndürdüğü EngineEvent'ler base'deki
 * GERÇEK engine_rules'a denk gelir (k1a_ay_koc, k2_saturn_sert_gunes) — yani
 * match_engine_rules'a beslenince gerçek kural döner.
 */

import type { AstroProvider } from './provider';
import type { BirthInput, DailyTransit, NatalChart } from './types';

export const mockProvider: AstroProvider = {
  name: 'mock',

  async getNatalChart(input: BirthInput): Promise<NatalChart> {
    // Saat-esnek: saat bilinmiyorsa moon/asc null (güneş-bazlı fallback, KZ-1=b).
    return {
      sunSign: 'aslan',
      moonSign: input.timeKnown ? 'yengec' : null,
      ascSign: input.timeKnown ? 'terazi' : null,
      dominantElement: 'ates',
      timeKnown: input.timeKnown,
      raw: {
        _mock: true,
        note: 'placeholder natal — Swiss Ephemeris ile gerçek hesap gelince değişecek',
      },
    };
  },

  async getDailyTransit(_natal: NatalChart, date: string): Promise<DailyTransit> {
    return {
      date,
      moonSign: 'koc',
      moonPhase: 'ilk_dordun',
      // Bu olaylar base'deki gerçek kurallara denk gelir (mock ama tutarlı):
      events: [
        // → k1a_ay_koc  (Ay Koç'ta)
        { transit_planet: 'ay', aspect_quality: null, natal_target: null, sign_modifier: 'koc', house_modifier: null },
        // → k2_saturn_sert_gunes  (Satürn sert açı, Güneş'e)
        { transit_planet: 'saturn', aspect_quality: 'sert', natal_target: 'gunes', sign_modifier: null, house_modifier: null },
      ],
      themes: ['baslangic_enerji', 'saturn_sert_gunes'],
    };
  },
};
