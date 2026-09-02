/**
 * Domain bileşenleri (Design §30, §47 domain-ui katmanı) — yalnız core/
 * foundation + token üzerine kurulur (§49); ekran/ürün adı içermez.
 */

export {
  HerbIllustration,
  HERB_ILLUSTRATION_HEIGHT,
  type HerbIllustrationProps,
} from './herb-illustration';
export { HERB_ILLUSTRATIONS } from './herb-illustration-assets';
export {
  DailyHerbHero,
  HeroChip,
  HeroMoonChip,
  heroChipTextColor,
  resolveCloudAlpha,
  type DailyHerbHeroProps,
} from './daily-herb-hero';
export {
  HERB_HERO_LUMA,
  HERO_TEXT_AA,
  HERO_PLACEHOLDER_CLOUD_ALPHA,
  HERO_PLACEHOLDER_CONTRAST,
  type HerbHeroLuma,
} from './herb-hero-luma.generated';
export {
  HerbImage,
  HERB_IMAGE_BUCKET,
  herbImagePublicUrl,
  type HerbImageProps,
} from './herb-image';
export { MoonPhaseGlyph, type MoonPhaseGlyphProps, type MoonPhaseName } from './moon-phase-glyph';
