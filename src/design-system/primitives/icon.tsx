/**
 * Icon — ikon primitive'i (Design §28).
 *
 * Faz 1'de iç temsil emoji glyph'tir; API kararlıdır (`<Icon name="moon" />`).
 * Gerçek ikon seti (Faz 6 görsel kilidi + bağımlılık onayı) geldiğinde YALNIZ
 * bu dosyanın içi değişir — çağıran kod değişmez.
 *
 * Erişilebilirlik (§43.1): dekoratif ikon a11y ağacından gizlenir; işlevsel
 * ikon `label` ile adlandırılır.
 */

import { Text as RNText } from 'react-native';

import { primitive } from '../tokens/primitive.generated';

// UI ikon adları → glyph. İçerik-alanı eşlemeleri (ör. gezegen glyph'leri,
// lib/content.ts PLANET_GLYPH) burada DEĞİL — bu set yalnız arayüz ikonları.
const GLYPHS = {
  moon: '🌙',
  crystalBall: '🔮',
  herb: '🌿',
  chat: '💬',
  seedling: '🌱',
  sparkles: '✨',
} as const;

export type IconName = keyof typeof GLYPHS;

// Boyutlar token kaynağından (size.icon — GEÇİCİ sayılar orada işaretli).
const SIZES = primitive.size.icon;

export type IconSize = keyof typeof SIZES;

export type IconProps = {
  name: IconName;
  size?: IconSize;
  /** true → salt süsleme; ekran okuyucudan gizlenir (§43.1). */
  decorative?: boolean;
  /** İşlevsel ikonun ekran okuyucu etiketi. */
  label?: string;
};

export function Icon({ name, size = 'md', decorative = false, label }: IconProps) {
  return (
    <RNText
      accessible={!decorative}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'auto'}
      accessibilityLabel={decorative ? undefined : label}
      allowFontScaling={false}
      style={{ fontSize: SIZES[size] }}>
      {GLYPHS[name]}
    </RNText>
  );
}
