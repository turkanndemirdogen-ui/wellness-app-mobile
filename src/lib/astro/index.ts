/**
 * Astro katmanı giriş noktası — sağlayıcıyı config'ten seçer.
 *
 * Kullanım:
 *   import { astro } from '@/lib/astro';
 *   const natal = await astro.getNatalChart({ date, timeKnown });
 *   const transit = await astro.getDailyTransit(natal, '2026-07-10');
 *   // transit.events → base'deki match_engine_rules'a doğrudan beslenebilir.
 *
 * Sağlayıcı seçimi EXPO_PUBLIC_ASTRO_PROVIDER ile (varsayılan 'mock'). Sır DEĞİL —
 * yalnız seçici. İleride 'swiss' (Swiss Ephemeris, LOKAL hesap) eklenir.
 */

import type { AstroProvider } from './provider';
import { mockProvider } from './mock-provider';

const PROVIDER = process.env.EXPO_PUBLIC_ASTRO_PROVIDER ?? 'mock';

function selectProvider(): AstroProvider {
  switch (PROVIDER) {
    case 'mock':
      return mockProvider;
    // case 'swiss': return swissProvider;   // Faz 5 — Swiss Ephemeris (lokal, KVKK)
    default:
      if (__DEV__) {
        console.warn(`[astro] bilinmeyen sağlayıcı "${PROVIDER}" — mock'a düşülüyor.`);
      }
      return mockProvider;
  }
}

/** Uygulamanın kullandığı tekil astro sağlayıcısı. */
export const astro: AstroProvider = selectProvider();

export type { AstroProvider } from './provider';
export type {
  BirthInput, NatalChart, DailyTransit, EngineEvent,
  ZodiacSign, Planet, AspectQuality, Element,
} from './types';
