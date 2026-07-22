/**
 * GlyphSvg — astro glyph taban sarmalayıcısı (05 §2-4 teknik sözleşme).
 *
 * Sözleşme: viewBox "0 0 24 24" · fill="none" · stroke="currentColor" ·
 * round cap/join · monoline stroke 1.5 (küçükte min 1.4, hero'da maks 1.8 —
 * aralık dışı clamp'lenir, sözleşme testi korur). Renk kök Svg'nin `color`
 * prop'undan currentColor ile akar; dolgu yalnız semantic/veri parçalarında
 * (ör. ay fazının aydınlık yüzü, Güneş'in merkez noktası).
 *
 * A11y (05 §12): decorative → erişilebilirlik ağacından tamamen gizli;
 * değilse accessibilityRole="image" + label ZORUNLU (dev-warn ile korunur).
 * Glyph tek başına anlam taşımaz — görünür label bağlamda kalır.
 */

import type { ReactNode } from 'react';
import Svg, { G } from 'react-native-svg';

import { useTheme } from '../theme';

export const GLYPH_VIEWBOX = '0 0 24 24';
export const GLYPH_STROKE_DEFAULT = 1.5;
export const GLYPH_STROKE_MIN = 1.4;
export const GLYPH_STROKE_MAX = 1.8;

export type GlyphSvgProps = {
  /** Kenar uzunluğu (kare). 05 §3 ölçüleri: 14-48 UI, 72-112 hero. */
  size?: number;
  /** Verilmezse tema text.primary. Planet/zodiac dispatcher'ları token'dan doldurur. */
  color?: string;
  /** 05 §2 aralığı [1.4, 1.8]; dışına çıkan değer clamp'lenir. */
  strokeWidth?: number;
  /** true → salt süsleme; ekran okuyucudan gizlenir. */
  decorative?: boolean;
  /** Dekoratif değilse zorunlu ekran okuyucu etiketi. */
  label?: string;
};

export function GlyphSvg({
  size = 24,
  color,
  strokeWidth = GLYPH_STROKE_DEFAULT,
  decorative = false,
  label,
  children,
}: GlyphSvgProps & { children: ReactNode }) {
  const { colors } = useTheme();
  const stroke = Math.min(GLYPH_STROKE_MAX, Math.max(GLYPH_STROKE_MIN, strokeWidth));

  if (__DEV__ && !decorative && !label) {
    console.warn('[GlyphSvg] dekoratif olmayan glyph için label zorunlu (05 §12).');
  }

  const a11yProps = decorative
    ? {
        accessible: false,
        accessibilityElementsHidden: true,
        importantForAccessibility: 'no-hide-descendants' as const,
      }
    : { accessible: true, accessibilityRole: 'image' as const, accessibilityLabel: label };

  return (
    <Svg
      width={size}
      height={size}
      viewBox={GLYPH_VIEWBOX}
      color={color ?? colors.text.primary}
      fill="none"
      {...a11yProps}>
      <G
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none">
        {children}
      </G>
    </Svg>
  );
}
