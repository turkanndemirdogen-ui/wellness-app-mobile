/**
 * Stack — akış/boşluk primitive'i (Design §28).
 *
 * Dikey/yatay dizilim + space ölçeğinden gap (§13). Renk çizmez; zemin için
 * Surface ile birleştirilir. Keyfî boşluk yasak (§13.1) — gap yalnız token adı
 * alır.
 */

import { View, type FlexStyle, type ViewProps } from 'react-native';

import { primitive } from '../tokens/primitive.generated';

export type SpaceKey = keyof typeof primitive.space;

export type StackProps = ViewProps & {
  direction?: 'column' | 'row';
  /** Elemanlar arası boşluk — space token adı (s4…s96). */
  gap?: SpaceKey;
  align?: FlexStyle['alignItems'];
  justify?: FlexStyle['justifyContent'];
};

export function Stack({
  direction = 'column',
  gap,
  align,
  justify,
  style,
  ...rest
}: StackProps) {
  return (
    <View
      style={[
        {
          flexDirection: direction,
          gap: gap ? primitive.space[gap] : undefined,
          alignItems: align,
          justifyContent: justify,
        },
        style,
      ]}
      {...rest}
    />
  );
}
