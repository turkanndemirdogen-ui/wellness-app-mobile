/**
 * Gölge köprüsü (04 §9) — token → RN stili. Bileşenler `shadowColor` gibi ham
 * alanları YAZMAZ; tek kurulum noktası burasıdır (motion.ts easing köprüsüyle
 * aynı desen; token-gate'te bu dosya için denetimli istisna var).
 *
 * Kurallar (04 §9.3): liste satırında gölge yok · standart kart yalnız `soft` ·
 * feature/hero kart en fazla `card` · modal `elevated` · aynı ekranda her kart
 * elevated olmaz · gölge kenarın YERİNE kullanılmaz (ikisi birlikte kurgulanır,
 * ama aynı kartta güçlü kenar + güçlü gölge olmaz, 04 §7.3).
 */

import type { ViewStyle } from 'react-native';

import { primitive } from '../tokens/primitive.generated';

export type ShadowLevel = keyof typeof primitive.material.shadow;

/** Token'dan RN gölge stili (iOS gölge alanları + Android elevation birlikte). */
export function shadowStyle(level: ShadowLevel): ViewStyle {
  const s = primitive.material.shadow[level];
  return {
    shadowColor: s.color,
    shadowOffset: { width: 0, height: s.offsetY },
    shadowOpacity: s.opacity,
    shadowRadius: s.radius,
    elevation: s.elevation,
  };
}

/** Glow → RN gölge stili (04 §10): renkli, yayılmış, ofsetsiz "ışıma". */
export function glowStyle(name: keyof typeof primitive.material.glow): ViewStyle {
  const g = primitive.material.glow[name];
  return {
    shadowColor: g.color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, // opaklık rengin alfasında taşınır (token'da kilitli)
    shadowRadius: g.radius,
    elevation: 0,
  };
}
