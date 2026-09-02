/**
 * Tipografi rolleri (Design §12.2) — token → RN TextStyle eşlemesi.
 *
 * Sayısal rampa tokens.json'dan gelir (TEK KAYNAK, GEÇİCİ değerler orada
 * işaretli). Aileler platform'a bağlı olduğundan JSON'a inemez; iki aile
 * kuralı (§12.1) burada uygulanır: Display (serif — display.* + heading.*)
 * ve UI (sans — body.*, label, caption, overline). Özel display-serif fontu
 * (Faz 6, bağımlılık onayı) geldiğinde yalnız constants/theme.ts Fonts değişir.
 */

import type { TextStyle } from 'react-native';

import { primitive } from '../tokens/primitive.generated';

const t = primitive.typography;

// TİPOGRAFİ DEĞİŞİMİ (2026-09-02): eski `Text role` alias'ı da artık SİSTEM
// fontunda değil, yeni ailelerde render olur — çip/buton/liste gibi henüz
// AppText'e taşınmamış yüzeyler sistem sans'ına düşüp ekranı bölmesin diye.
// Cinzel 20px ALTINDA kullanılamaz: 16px'lik heading.s bilinçli olarak ui
// ailesine (Jost 500) düşürülür.
const families = {
  display: 'Cinzel_600SemiBold',
  ui: 'Jost_400Regular',
  uiMedium: 'Jost_500Medium',
} as const;

type RampEntry = {
  size: number;
  lineHeight: number;
  weight: string;
  letterSpacing?: number;
};

function toStyle(
  entry: RampEntry,
  family: keyof typeof families,
  uppercase = false,
): TextStyle {
  const isDisplay = family === 'display';
  if (__DEV__ && isDisplay && entry.size < t.displayMinSize) {
    console.warn(
      `[typography] display ailesi ${t.displayMinSize}px altında kullanılamaz (${entry.size}px)`,
    );
  }
  return {
    // Özel ailede fontWeight verilmez (Android fake-bold çakışması); kesim
    // aile adında gömülü.
    fontFamily: families[family],
    fontSize: entry.size,
    lineHeight: entry.lineHeight,
    letterSpacing: isDisplay
      ? entry.size * t.displayLetterSpacingEm
      : entry.letterSpacing,
    textTransform: uppercase ? 'uppercase' : undefined,
  };
}

export const textRoles = {
  'display.xl': toStyle(t.display.xl, 'display'),
  'display.l': toStyle(t.display.l, 'display'),
  'heading.xl': toStyle(t.heading.xl, 'display'),
  'heading.l': toStyle(t.heading.l, 'display'),
  'heading.m': toStyle(t.heading.m, 'display'),
  // 16px — Cinzel alt sınırının altında → ui ailesine düşer (bilinçli sapma).
  'heading.s': toStyle(t.heading.s, 'uiMedium'),
  'body.l': toStyle(t.body.l, 'ui'),
  'body.m': toStyle(t.body.m, 'ui'),
  'body.s': toStyle(t.body.s, 'ui'),
  label: toStyle(t.label, 'uiMedium'),
  caption: toStyle(t.caption, 'ui'),
  // overline nadir kullanılır (§12.2) — büyük harf + geniş letterSpacing.
  overline: toStyle(t.overline, 'uiMedium', true),
} as const;

export type TextRoleName = keyof typeof textRoles;

// ---------------------------------------------------------------------------
// 15 §5 ROL SİSTEMİ — AppText variant katmanı (Phase 1 foundations).
//
// Eski `Text role` API'si deprecated-alias olarak aynen yaşar (yukarıda, sistem
// fontuyla — kabul edilmiş ekran görünümleri Phase 4-5 retrofit'ine kadar
// DEĞİŞMEZ). Yeni ekran/bileşen işi AppText variant'larını kullanır.
// `Fraunces + Inter only` kararı geçersiz; Inter canonical body fontu değildir.
// ---------------------------------------------------------------------------

/**
 * 15 §5 font rolleri — TİPOGRAFİ DEĞİŞİMİ 2026-09-02 (ürün sahibi kararı):
 * Fraunces → Cinzel, Lora → Jost. Playfair Display kaldırıldı (hiçbir yüzeyde
 * kullanılmıyordu; splash bütçesi). Caveat korundu: günün sözü kullanımda.
 *
 * display: Cinzel 600 — YALNIZ ≥20px, en fazla 2 satır, letterSpacing 0.03em.
 *          Buton/form/kart altyazısı/uzun metin KESİNLİKLE bu ailede değil.
 * body:    Jost 400 — minimum 15px, lineHeight 1.7.
 * ui:      Jost 500 — tab bar, buton, çip, form etiketi.
 * sci:     Jost italic 400 — bilimsel ad; hiçbir kart varyantında gizlenmez.
 */
export const fontRoles = {
  display: 'Cinzel',
  body: 'Jost',
  ui: 'Jost',
  sci: 'Jost Italic',
  quote: 'Caveat',
} as const;

export type FontRole = keyof typeof fontRoles;

/**
 * Yüklü font asset adları (expo-google-fonts; app/_layout useFonts ile yüklenir,
 * yüklenmeden UI görünmez). Rol başına 1-2 kesim (splash bütçesi).
 */
export const fontFamilies = {
  display: 'Cinzel_600SemiBold',
  displayRegular: 'Cinzel_400Regular',
  body: 'Jost_400Regular',
  ui: 'Jost_500Medium',
  sci: 'Jost_400Regular_Italic',
  quote: 'Caveat_500Medium',
} as const;

const v = primitive.typeVariant;

type VariantDef = {
  ramp: { size: number; lineHeight: number; weight: string };
  role: FontRole;
  family?: string;
  /** Dynamic Type üst sınırı (03 §20.1 dengi — variant başına). */
  maxFontSizeMultiplier: number;
  /** Başlık variant'ları ekran okuyucuya header olarak bildirilir. */
  isHeading?: boolean;
  italic?: boolean;
};

/** display ailesi variant'ları — Cinzel kuralları (≥20px, ≤2 satır) bunlara uygulanır. */
export const DISPLAY_VARIANTS = [
  'displayHero',
  'screenTitle',
  'sectionTitle',
  'plantName',
  'ceremonial',
] as const;

/** display ailesinin en fazla satır sayısı (15 §5 / 03 §7.1). */
export const DISPLAY_MAX_LINES = 2;

const VARIANT_DEFS = {
  displayHero: { ramp: v.displayHero, role: 'display', family: fontFamilies.display, maxFontSizeMultiplier: 1.5, isHeading: true },
  screenTitle: { ramp: v.screenTitle, role: 'display', family: fontFamilies.display, maxFontSizeMultiplier: 1.5, isHeading: true },
  sectionTitle: { ramp: v.sectionTitle, role: 'display', family: fontFamilies.display, maxFontSizeMultiplier: 1.6, isHeading: true },
  plantName: { ramp: v.plantName, role: 'display', family: fontFamilies.display, maxFontSizeMultiplier: 1.5 },
  ceremonial: { ramp: v.ceremonial, role: 'display', family: fontFamilies.displayRegular, maxFontSizeMultiplier: 1.4 },
  readingLead: { ramp: v.readingLead, role: 'body', family: fontFamilies.body, maxFontSizeMultiplier: 2 },
  reading: { ramp: v.reading, role: 'body', family: fontFamilies.body, maxFontSizeMultiplier: 2 },
  scientificName: { ramp: v.scientificName, role: 'sci', family: fontFamilies.sci, maxFontSizeMultiplier: 1.6, italic: true },
  quote: { ramp: v.quote, role: 'quote', family: fontFamilies.quote, maxFontSizeMultiplier: 1.4 },
  uiBody: { ramp: v.uiBody, role: 'body', family: fontFamilies.body, maxFontSizeMultiplier: 2 },
  uiLabel: { ramp: v.uiLabel, role: 'ui', family: fontFamilies.ui, maxFontSizeMultiplier: 2 },
  uiCaption: { ramp: v.uiCaption, role: 'body', family: fontFamilies.body, maxFontSizeMultiplier: 2 },
  uiButton: { ramp: v.uiButton, role: 'ui', family: fontFamilies.ui, maxFontSizeMultiplier: 1.6 },
} as const satisfies Record<string, VariantDef>;

export type AppTextVariant = keyof typeof VARIANT_DEFS;

function variantStyle(def: VariantDef): TextStyle {
  // Özel ailede fontWeight VERİLMEZ (Android fake-bold çakışması): kesim aile
  // adında gömülü. Harf aralığı yalnız display ailesinde (Cinzel'in
  // inscriptional ritmi) ve em cinsinden token'dan gelir.
  const isDisplay = def.role === 'display';
  return {
    fontFamily: def.family,
    fontSize: def.ramp.size,
    lineHeight: def.ramp.lineHeight,
    letterSpacing: isDisplay ? def.ramp.size * t.displayLetterSpacingEm : undefined,
    fontStyle: def.italic ? 'italic' : undefined,
  };
}

export const appTextVariants = Object.fromEntries(
  (Object.keys(VARIANT_DEFS) as AppTextVariant[]).map((name) => [
    name,
    variantStyle(VARIANT_DEFS[name]),
  ]),
) as Record<AppTextVariant, TextStyle>;

export const appTextVariantMeta = VARIANT_DEFS as Record<
  AppTextVariant,
  Pick<VariantDef, 'role' | 'maxFontSizeMultiplier' | 'isHeading'>
>;

/** Cinzel alt sınırı (px) — token'dan; testler ve dev uyarısı bunu okur. */
export const DISPLAY_MIN_SIZE = t.displayMinSize;

/** Caveat sınırları (15 §5): yalnız kısa söz — kritik metinde asla. */
export const QUOTE_MAX_WORDS = 32;
export const QUOTE_MAX_LINES = 2;

/**
 * Eski role → yeni variant eşleme tablosu (deprecated-alias köprüsü).
 * Ekranlar Phase 4-5'te taşınırken bu tabloyla mekanik çevrilir.
 */
export const legacyRoleToVariant: Record<TextRoleName, AppTextVariant> = {
  'display.xl': 'displayHero',
  'display.l': 'displayHero',
  'heading.xl': 'screenTitle',
  'heading.l': 'screenTitle',
  'heading.m': 'sectionTitle',
  'heading.s': 'sectionTitle',
  'body.l': 'readingLead',
  'body.m': 'uiBody',
  'body.s': 'uiBody',
  label: 'uiLabel',
  caption: 'uiCaption',
  overline: 'uiLabel',
};

/**
 * `heading.s` (16px) display ailesine giremez (Cinzel ≥20px kilidi) — eski
 * alias'ta ui ailesine düşer, yeni variant eşlemesinde de sectionTitle DEĞİL
 * uiButton'a bakar. Ekran taşımalarında bu satır bilinçli sapmadır.
 */
export const LEGACY_HEADING_S_FALLBACK: AppTextVariant = 'uiButton';
