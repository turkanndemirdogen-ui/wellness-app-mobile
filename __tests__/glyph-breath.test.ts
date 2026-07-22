/**
 * Glyph nefesi (09 breathing + 15 §9 motion kilidi) — ölçek tavanı, ambient
 * süre bandı ve reduced-motion'da tam durma sözleşmesi.
 */

import {
  GLYPH_BREATH_DURATION_MS,
  GLYPH_BREATH_SCALE,
  resolveGlyphBreath,
} from '@/design-system/glyphs';
import { resolveAmbientMotion } from '@/design-system/theme';
import { primitive } from '@/design-system/tokens/primitive.generated';

describe('glyph nefesi (09 + 15 §9)', () => {
  it('nefes ölçeği motionLimits.maxScale SERT TAVANININ altında kalır', () => {
    expect(GLYPH_BREATH_SCALE).toBeGreaterThan(1);
    expect(GLYPH_BREATH_SCALE).toBeLessThanOrEqual(primitive.motionLimits.maxScale);
  });

  it('döngü süresi ambient bandındadır (8-16 sn)', () => {
    expect(GLYPH_BREATH_DURATION_MS).toBeGreaterThanOrEqual(primitive.motionLimits.ambientMinMs);
    expect(GLYPH_BREATH_DURATION_MS).toBeLessThanOrEqual(primitive.motionLimits.ambientMaxMs);
  });

  it('ambient açıkken nefes alır, kapalıyken tamamen statiktir', () => {
    expect(resolveGlyphBreath(true)).toEqual({ animate: true, toScale: GLYPH_BREATH_SCALE });
    expect(resolveGlyphBreath(false)).toEqual({ animate: false, toScale: 1 });
  });

  it('reduced-motion zinciri: resolveAmbientMotion(true) → ambient kapalı → nefes durur', () => {
    const ambient = resolveAmbientMotion(true);
    expect(ambient.ambientEnabled).toBe(false);
    expect(resolveGlyphBreath(ambient.ambientEnabled)).toEqual({ animate: false, toScale: 1 });
  });

  it('reduced-motion kapalıyken zincir nefesi açar', () => {
    const ambient = resolveAmbientMotion(false);
    expect(ambient.ambientEnabled).toBe(true);
    expect(resolveGlyphBreath(ambient.ambientEnabled).animate).toBe(true);
  });
});
