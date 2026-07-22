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

import { Fonts } from '@/constants/theme';
import { primitive } from '../tokens/primitive.generated';

const t = primitive.typography;

const families = {
  display: Fonts.serif,
  ui: Fonts.sans,
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
  return {
    fontFamily: families[family],
    fontSize: entry.size,
    lineHeight: entry.lineHeight,
    fontWeight: entry.weight as TextStyle['fontWeight'],
    letterSpacing: entry.letterSpacing,
    textTransform: uppercase ? 'uppercase' : undefined,
  };
}

export const textRoles = {
  'display.xl': toStyle(t.display.xl, 'display'),
  'display.l': toStyle(t.display.l, 'display'),
  'heading.xl': toStyle(t.heading.xl, 'display'),
  'heading.l': toStyle(t.heading.l, 'display'),
  'heading.m': toStyle(t.heading.m, 'display'),
  'heading.s': toStyle(t.heading.s, 'display'),
  'body.l': toStyle(t.body.l, 'ui'),
  'body.m': toStyle(t.body.m, 'ui'),
  'body.s': toStyle(t.body.s, 'ui'),
  label: toStyle(t.label, 'ui'),
  caption: toStyle(t.caption, 'ui'),
  // overline nadir kullanılır (§12.2) — büyük harf + geniş letterSpacing.
  overline: toStyle(t.overline, 'ui', true),
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

/** 15 §5 font rolleri (soyut ad → aile). ui = System sans (paket gerekmez). */
export const fontRoles = {
  display: 'Fraunces',
  reading: 'Lora',
  quote: 'Caveat',
  ceremonial: 'Playfair Display',
  ui: 'System',
} as const;

export type FontRole = keyof typeof fontRoles;

/**
 * Yüklü font asset adları (expo-google-fonts; app/_layout useFonts ile yüklenir,
 * yüklenmeden UI görünmez). Rol başına 1-2 kesim (splash bütçesi).
 */
export const fontFamilies = {
  display: 'Fraunces_600SemiBold',
  reading: 'Lora_400Regular',
  readingItalic: 'Lora_400Regular_Italic',
  quote: 'Caveat_500Medium',
  ceremonial: 'PlayfairDisplay_500Medium',
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

const VARIANT_DEFS = {
  displayHero: { ramp: v.displayHero, role: 'display', family: fontFamilies.display, maxFontSizeMultiplier: 1.5, isHeading: true },
  screenTitle: { ramp: v.screenTitle, role: 'display', family: fontFamilies.display, maxFontSizeMultiplier: 1.5, isHeading: true },
  sectionTitle: { ramp: v.sectionTitle, role: 'display', family: fontFamilies.display, maxFontSizeMultiplier: 1.6, isHeading: true },
  plantName: { ramp: v.plantName, role: 'display', family: fontFamilies.display, maxFontSizeMultiplier: 1.5 },
  ceremonial: { ramp: v.ceremonial, role: 'ceremonial', family: fontFamilies.ceremonial, maxFontSizeMultiplier: 1.4 },
  readingLead: { ramp: v.readingLead, role: 'reading', family: fontFamilies.reading, maxFontSizeMultiplier: 2 },
  reading: { ramp: v.reading, role: 'reading', family: fontFamilies.reading, maxFontSizeMultiplier: 2 },
  scientificName: { ramp: v.scientificName, role: 'reading', family: fontFamilies.readingItalic, maxFontSizeMultiplier: 1.6, italic: true },
  quote: { ramp: v.quote, role: 'quote', family: fontFamilies.quote, maxFontSizeMultiplier: 1.4 },
  uiBody: { ramp: v.uiBody, role: 'ui', maxFontSizeMultiplier: 2 },
  uiLabel: { ramp: v.uiLabel, role: 'ui', maxFontSizeMultiplier: 2 },
  uiCaption: { ramp: v.uiCaption, role: 'ui', maxFontSizeMultiplier: 2 },
  uiButton: { ramp: v.uiButton, role: 'ui', maxFontSizeMultiplier: 1.6 },
} as const satisfies Record<string, VariantDef>;

export type AppTextVariant = keyof typeof VARIANT_DEFS;

function variantStyle(def: VariantDef): TextStyle {
  // Özel ailede fontWeight verilmez (Android fake-bold çakışması); kesim aile
  // adında gömülü. ui (System) variant'ları weight'i token'dan alır.
  return {
    fontFamily: def.family ?? families.ui,
    fontSize: def.ramp.size,
    lineHeight: def.ramp.lineHeight,
    fontWeight: def.family ? undefined : (def.ramp.weight as TextStyle['fontWeight']),
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
