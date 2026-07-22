/**
 * Glyph ad sözleşmeleri (05 §6-8) — P1'de kilitlenen tipler + kanonik ad
 * listeleri (export bütünlüğü testi bu listelerle dosyaları karşılaştırır).
 */

export type PlanetGlyphName =
  | 'sun' | 'moon' | 'mercury' | 'venus' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto';

export type ZodiacGlyphName =
  | 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo'
  | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

/** 8 faz (05 §5/§8) — mevcut veri sözleşmesi 4 faz üretir; eşleme four-phase-map'te. */
export type MoonPhaseGlyphName =
  | 'new' | 'waxingCrescent' | 'firstQuarter' | 'waxingGibbous'
  | 'full' | 'waningGibbous' | 'lastQuarter' | 'waningCrescent';

export type GlyphName = PlanetGlyphName | ZodiacGlyphName | MoonPhaseGlyphName;

export const PLANET_GLYPH_NAMES = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
] as const satisfies readonly PlanetGlyphName[];

export const ZODIAC_GLYPH_NAMES = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
] as const satisfies readonly ZodiacGlyphName[];

export const MOON_PHASE_GLYPH_NAMES = [
  'new', 'waxingCrescent', 'firstQuarter', 'waxingGibbous',
  'full', 'waningGibbous', 'lastQuarter', 'waningCrescent',
] as const satisfies readonly MoonPhaseGlyphName[];

/** Ortak glyph contract'ı — a11y etiketi dekoratif olmayan her kullanımda ZORUNLU. */
export type GlyphProps = {
  name: GlyphName;
  size?: number;
  color?: string;
  /** true → salt süsleme; ekran okuyucudan gizlenir. */
  decorative?: boolean;
  /** Dekoratif değilse zorunlu ekran okuyucu etiketi. */
  label?: string;
};
