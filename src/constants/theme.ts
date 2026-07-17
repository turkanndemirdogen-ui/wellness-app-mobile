/**
 * Tema sabitleri — artık İNCE KÖPRÜ (shim).
 *
 * Değerlerin TEK KAYNAĞI: src/design-system/tokens/tokens.json
 * (W3C formatı → `npm run tokens` → primitive.generated.ts). Bu dosya yalnız
 * mevcut ekran sözleşmesini (Colors/Spacing/Typography/Fonts adları) korur;
 * yeni kod semantic katman geldiğinde (T2) oradan okuyacak.
 *
 * Renk hex'leri ve tipografi GEÇİCİ (Faz 6'da kesinleşecek) — artık
 * tokens.json içinde işaretli. Değer değişikliği BURADA değil, tokens.json'da
 * yapılır; ekranlar otomatik uyum sağlar.
 */

import '@/global.css';

import { Platform } from 'react-native';

import { primitive } from '@/design-system/tokens/primitive.generated';

// Soft-witchery pudra paleti — anahtar adları mevcut ekranlarla birebir uyumlu.
export const Colors = primitive.color;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

// Tipografi token'ı — başlık serif (soft-witchery tını), gövde sans.
// GEÇİCİ: şimdilik SİSTEM serif'i (Fonts.serif). Özel display-serif (font seçimi
// kesinleşince, Faz 6) expo-font ile yüklenip yalnız burada değişecek.
// (Platform.select JSON'a taşınamadığı için Fonts/Typography bu köprüde kalır;
//  sayısal tipografi rampası T6'da token'a iner.)
export const Typography = {
  heading: { fontFamily: Fonts.serif },
  body: { fontFamily: Fonts.sans },
} as const;

// Mevcut ekran sözleşmesi (half…six) → kanonik ölçek köprüsü.
// half=2 legacy optik değerdir (kanonik ölçekte yok); taşınma sonraki görevlerde.
export const Spacing = {
  half: primitive.space.s2,
  one: primitive.space.s4,
  two: primitive.space.s8,
  three: primitive.space.s16,
  four: primitive.space.s24,
  five: primitive.space.s32,
  six: primitive.space.s64,
} as const;

// Köşe yuvarlaklığı — adlar kanonik (§14.1), sayılar tokens.json'da (GEÇİCİ).
export const Radius = primitive.radius;

// Sınır kalınlıkları (§45 borderWidth grubu) ve minimum dokunma hedefi
// (roadmap: min 44, tercih 48) — ekran katmanının token erişim köprüsü.
export const BorderWidth = primitive.borderWidth;
export const MinTouchTarget = primitive.space.s48;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
