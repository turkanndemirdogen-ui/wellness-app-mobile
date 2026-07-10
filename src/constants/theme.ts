/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

// Soft-witchery pudra paleti — GEÇİCİ (hex'ler Faz 6'da kesinleşecek; checklist:
// "Renk paleti hex'leri + font seçimi sabit kabul etme"). Anahtar isimleri mevcut
// ekranlarla uyumlu (text/background/backgroundElement/backgroundSelected/
// textSecondary) + soft-witchery için `accent` eklendi. Değer değişince ekranlar
// otomatik uyum sağlar (hepsi Colors üstünden okur).
export const Colors = {
  light: {
    text: '#3A2E37',              // derin erik-kahve (saf siyah değil)
    background: '#FBF6F3',        // pudra krem
    backgroundElement: '#F1E4E1', // pudra gül kart
    backgroundSelected: '#E7D3D0',
    textSecondary: '#857078',     // mat gül-gri
    accent: '#A86B77',            // tozlu gül vurgu
  },
  dark: {
    text: '#F1E4E1',              // yumuşak pudra
    background: '#171016',        // derin patlıcan (gece)
    backgroundElement: '#271E26',
    backgroundSelected: '#342936',
    textSecondary: '#B29AA4',     // mat mor
    accent: '#C98B99',
  },
} as const;

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
export const Typography = {
  heading: { fontFamily: Fonts.serif },
  body: { fontFamily: Fonts.sans },
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
