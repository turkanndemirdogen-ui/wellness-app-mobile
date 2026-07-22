/**
 * Export bütünlüğü — 05 §5 kilitli dosya yapısındaki 30 bileşen + dispatcher
 * katmanı barrel'dan eksiksiz çıkar; ad listeleri tip sözleşmesiyle eş.
 */

import * as glyphs from '@/design-system/glyphs';

const PLANET_COMPONENT_NAMES = [
  'SunGlyph', 'MoonGlyph', 'MercuryGlyph', 'VenusGlyph', 'MarsGlyph',
  'JupiterGlyph', 'SaturnGlyph', 'UranusGlyph', 'NeptuneGlyph', 'PlutoGlyph',
] as const;

const ZODIAC_COMPONENT_NAMES = [
  'AriesGlyph', 'TaurusGlyph', 'GeminiGlyph', 'CancerGlyph', 'LeoGlyph', 'VirgoGlyph',
  'LibraGlyph', 'ScorpioGlyph', 'SagittariusGlyph', 'CapricornGlyph', 'AquariusGlyph',
  'PiscesGlyph',
] as const;

const MOON_COMPONENT_NAMES = [
  'NewMoon', 'WaxingCrescent', 'FirstQuarter', 'WaxingGibbous',
  'FullMoon', 'WaningGibbous', 'LastQuarter', 'WaningCrescent',
] as const;

describe('glyph export bütünlüğü', () => {
  it('30 bileşenin tamamı export edilir (10 planet + 12 zodiac + 8 ay fazı)', () => {
    const all = [...PLANET_COMPONENT_NAMES, ...ZODIAC_COMPONENT_NAMES, ...MOON_COMPONENT_NAMES];
    expect(all).toHaveLength(30);
    for (const name of all) {
      expect(typeof (glyphs as Record<string, unknown>)[name]).toBe('function');
    }
  });

  it('ad listeleri set boyutlarıyla eş (05 §6-8 zorunlu setler)', () => {
    expect(glyphs.PLANET_GLYPH_NAMES).toHaveLength(10);
    expect(glyphs.ZODIAC_GLYPH_NAMES).toHaveLength(12);
    expect(glyphs.MOON_PHASE_GLYPH_NAMES).toHaveLength(8);
    expect(new Set([...glyphs.PLANET_GLYPH_NAMES, ...glyphs.ZODIAC_GLYPH_NAMES, ...glyphs.MOON_PHASE_GLYPH_NAMES]).size).toBe(30);
  });

  it('dispatcher katmanı ve yardımcılar export edilir', () => {
    expect(typeof glyphs.PlanetGlyph).toBe('function');
    expect(typeof glyphs.ZodiacGlyph).toBe('function');
    expect(typeof glyphs.MoonPhaseDataGlyph).toBe('function');
    expect(typeof glyphs.GlyphSvg).toBe('function');
    expect(typeof glyphs.fourPhaseToGlyph).toBe('object');
    expect(typeof glyphs.resolveGlyphBreath).toBe('function');
  });

  it('ZODIAC_ELEMENT eşlemesi 02 §7 ile eş (element başına 3 burç)', () => {
    const counts = { fire: 0, earth: 0, air: 0, water: 0 };
    for (const sign of glyphs.ZODIAC_GLYPH_NAMES) counts[glyphs.ZODIAC_ELEMENT[sign]] += 1;
    expect(counts).toEqual({ fire: 3, earth: 3, air: 3, water: 3 });
    expect(glyphs.ZODIAC_ELEMENT.aries).toBe('fire');
    expect(glyphs.ZODIAC_ELEMENT.taurus).toBe('earth');
    expect(glyphs.ZODIAC_ELEMENT.gemini).toBe('air');
    expect(glyphs.ZODIAC_ELEMENT.cancer).toBe('water');
  });
});
