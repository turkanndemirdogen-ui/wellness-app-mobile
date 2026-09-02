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
  type DailyHerbHeroProps,
} from './daily-herb-hero';
// NOT: herb-hero-luma.generated.ts UYKUDA — hero katmansız olduğu için metin
// artık görselin üstünde değil. Dosya silinmedi (yerleşim geri dönerse ölçüm
// hattıyla birlikte açılır); buradan dışa verilmiyor ki ölü bağımlılık doğmasın.
export {
  HerbImage,
  HERB_IMAGE_BUCKET,
  herbImagePublicUrl,
  type HerbImageProps,
} from './herb-image';
export { MoonPhaseGlyph, type MoonPhaseGlyphProps, type MoonPhaseName } from './moon-phase-glyph';
