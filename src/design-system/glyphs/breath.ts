/**
 * Glyph nefes (ambient breath) çözümleyicisi — 09 "breathing" + 15 §9 kilidi.
 *
 * Ölçek 1.00→1.012 (09 breathing referansı; 15 §9 maxScale=1.02 SERT TAVAN —
 * test korur). Döngü süresi ambient bandında (8-16 sn). Ekran başına 1-2
 * animasyonlu öğe bütçesi TÜKETİCİNİN sorumluluğudur; reduced-motion'da
 * resolveAmbientMotion→ambientEnabled=false gelir ve nefes tamamen durur
 * (statik, bilgi kaybolmaz).
 */

import { primitive } from '../tokens/primitive.generated';

/** 09 breathing ölçeği — motionLimits.maxScale (1.02) tavanının altında. */
export const GLYPH_BREATH_SCALE = 1.012;

/** Döngü tek yönü (ms) — ambient bandı alt sınırından; yarım nefes 8 sn, tam döngü 16 sn. */
export const GLYPH_BREATH_DURATION_MS = primitive.motionLimits.ambientMinMs;

export function resolveGlyphBreath(ambientEnabled: boolean): {
  animate: boolean;
  toScale: number;
} {
  return ambientEnabled
    ? { animate: true, toScale: GLYPH_BREATH_SCALE }
    : { animate: false, toScale: 1 };
}
