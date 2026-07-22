/**
 * Glyph sistemi (05; Phase 2 — 30 özel SVG + dispatcher katmanı).
 *
 * P1 iskeleti P2'de dolduruldu: react-native-svg tabanlı monoline set
 * (viewBox 24, stroke 1.5, currentColor — base.tsx sözleşmesi). Emoji/Unicode
 * bu fazda topluca DEĞİŞTİRİLMEDİ: Icon primitive'i emoji tablosunda kalır
 * (Lucide geçişi Phase 3), PLANET_GLYPH (lib/content.ts) Unicode'u artık
 * yalnız text-fallback statüsündedir; ekran adaptasyonu Phase 4 retrofit'i.
 *
 * Ay fazı: 8 SVG hazır; veri sözleşmesi 4 faz — köprü four-phase-map.ts
 * (8-faz genişlemesi Adım 6 astro-core ile koordine, checkpoint kalem 10).
 */

export {
  GlyphSvg,
  GLYPH_VIEWBOX,
  GLYPH_STROKE_DEFAULT,
  GLYPH_STROKE_MIN,
  GLYPH_STROKE_MAX,
  type GlyphSvgProps,
} from './base';

export {
  PLANET_GLYPH_NAMES,
  ZODIAC_GLYPH_NAMES,
  MOON_PHASE_GLYPH_NAMES,
  type PlanetGlyphName,
  type ZodiacGlyphName,
  type MoonPhaseGlyphName,
  type GlyphName,
  type GlyphProps,
} from './types';

export { PlanetGlyph, type PlanetGlyphProps } from './planet-glyph';
export {
  ZodiacGlyph,
  ZODIAC_ELEMENT,
  type ZodiacGlyphProps,
  type ZodiacMode,
  type ZodiacProfileRole,
  type ZodiacElement,
} from './zodiac-glyph';
export { MoonPhaseDataGlyph, type MoonPhaseDataGlyphProps } from './moon-phase-data-glyph';

export { fourPhaseToGlyph, type FourPhaseName } from './four-phase-map';
export {
  resolveGlyphBreath,
  GLYPH_BREATH_SCALE,
  GLYPH_BREATH_DURATION_MS,
} from './breath';

export { SunGlyph } from './planets/SunGlyph';
export { MoonGlyph } from './planets/MoonGlyph';
export { MercuryGlyph } from './planets/MercuryGlyph';
export { VenusGlyph } from './planets/VenusGlyph';
export { MarsGlyph } from './planets/MarsGlyph';
export { JupiterGlyph } from './planets/JupiterGlyph';
export { SaturnGlyph } from './planets/SaturnGlyph';
export { UranusGlyph } from './planets/UranusGlyph';
export { NeptuneGlyph } from './planets/NeptuneGlyph';
export { PlutoGlyph } from './planets/PlutoGlyph';

export { AriesGlyph } from './zodiac/AriesGlyph';
export { TaurusGlyph } from './zodiac/TaurusGlyph';
export { GeminiGlyph } from './zodiac/GeminiGlyph';
export { CancerGlyph } from './zodiac/CancerGlyph';
export { LeoGlyph } from './zodiac/LeoGlyph';
export { VirgoGlyph } from './zodiac/VirgoGlyph';
export { LibraGlyph } from './zodiac/LibraGlyph';
export { ScorpioGlyph } from './zodiac/ScorpioGlyph';
export { SagittariusGlyph } from './zodiac/SagittariusGlyph';
export { CapricornGlyph } from './zodiac/CapricornGlyph';
export { AquariusGlyph } from './zodiac/AquariusGlyph';
export { PiscesGlyph } from './zodiac/PiscesGlyph';

export { NewMoon } from './moon-phases/NewMoon';
export { WaxingCrescent } from './moon-phases/WaxingCrescent';
export { FirstQuarter } from './moon-phases/FirstQuarter';
export { WaxingGibbous } from './moon-phases/WaxingGibbous';
export { FullMoon } from './moon-phases/FullMoon';
export { WaningGibbous } from './moon-phases/WaningGibbous';
export { LastQuarter } from './moon-phases/LastQuarter';
export { WaningCrescent } from './moon-phases/WaningCrescent';
