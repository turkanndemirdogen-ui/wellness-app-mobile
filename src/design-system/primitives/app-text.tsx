/**
 * AppText — 15 §5 rol-tabanlı metin primitive'i (Phase 1 foundations).
 *
 * Yeni ekran/bileşen işi BUNU kullanır; eski `Text role` API'si deprecated
 * alias olarak yaşar (primitives/text.tsx — Phase 4-5'e kadar ekran görünümü
 * değişmez). Eşleme: theme/typography.ts `legacyRoleToVariant`.
 *
 * Caveat kilidi (15 §5/§10): `quote` variant'ı YALNIZ kısa söz içindir —
 * maksimum 32 kelime ve 2 satır; kritik metinde (buton/form/uyarı) asla.
 * Sınır component içinde zorlanır: numberOfLines varsayılanı 2, kelime aşımı
 * __DEV__'de uyarı üretir.
 */

import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import {
  appTextVariants,
  appTextVariantMeta,
  QUOTE_MAX_LINES,
  QUOTE_MAX_WORDS,
  type AppTextVariant,
} from '../theme/typography';
import { useTheme } from '../theme';

export type AppTextTone = 'primary' | 'secondary';

export type AppTextProps = Omit<RNTextProps, 'role'> & {
  variant?: AppTextVariant;
  tone?: AppTextTone;
  align?: 'left' | 'center';
};

/** Quote metni sınır denetimi — dışarıdan da çağrılabilir (test/CTA denetimi). */
export function isValidQuoteText(text: string): boolean {
  return text.trim().split(/\s+/).filter(Boolean).length <= QUOTE_MAX_WORDS;
}

export function AppText({
  variant = 'uiBody',
  tone = 'primary',
  align = 'left',
  style,
  numberOfLines,
  children,
  ...rest
}: AppTextProps) {
  const { colors } = useTheme();
  const meta = appTextVariantMeta[variant];
  const color = tone === 'primary' ? colors.text.primary : colors.text.secondary;

  const isQuote = variant === 'quote';
  if (__DEV__ && isQuote && typeof children === 'string' && !isValidQuoteText(children)) {
    console.warn(
      `[AppText] quote variant'ı ${QUOTE_MAX_WORDS} kelimeyi aşamaz (15 §5) — reading/uiBody kullan`,
    );
  }

  return (
    <RNText
      accessibilityRole={meta.isHeading ? 'header' : undefined}
      maxFontSizeMultiplier={meta.maxFontSizeMultiplier}
      numberOfLines={isQuote ? (numberOfLines ?? QUOTE_MAX_LINES) : numberOfLines}
      style={[appTextVariants[variant], { color, textAlign: align }, style]}
      {...rest}>
      {children}
    </RNText>
  );
}
