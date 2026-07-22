/**
 * Glyph sistemi İSKELETİ (05; Phase 1 — yalnız tip sözleşmesi).
 *
 * P2 MIGRATION BOUNDARY: SVG içerikleri Phase 2'de gelir (react-native-svg +
 * lucide-react-native bağımlılık onayı + YENİ EAS dev build ile). Bu fazda
 * emoji/Unicode topluca DEĞİŞTİRİLMEZ: Icon primitive'i emoji tablosunda,
 * PLANET_GLYPH (lib/content.ts) Unicode'da kalır; P2'de Unicode fallback'e iner.
 *
 * Klasör hedef yapısı (P2):
 *   glyphs/planets/*.tsx · glyphs/zodiac/*.tsx · glyphs/moon-phases/*.tsx
 */

export type PlanetGlyphName =
  | 'sun' | 'moon' | 'mercury' | 'venus' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto';

export type ZodiacGlyphName =
  | 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo'
  | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

/** 8 faz (05) — mevcut veri sözleşmesi 4 faz üretir; dönüşüm katmanı P2'de. */
export type MoonPhaseGlyphName =
  | 'new' | 'waxingCrescent' | 'firstQuarter' | 'waxingGibbous'
  | 'full' | 'waningGibbous' | 'lastQuarter' | 'waningCrescent';

export type GlyphName = PlanetGlyphName | ZodiacGlyphName | MoonPhaseGlyphName;

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
