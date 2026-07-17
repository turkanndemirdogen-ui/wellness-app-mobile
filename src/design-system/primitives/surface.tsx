/**
 * Surface — zemin primitive'i (Design §28).
 *
 * Rengi YALNIZ semantic surface token'larından alır (§11.4: primitive renge
 * doğrudan bağlanmak yasak). Radius, adları kanonik (§14.1) primitive radius
 * token'ından gelir (radius için semantic katman tanımlı değil — tek eşleme
 * noktası burası).
 */

import { View, type ViewProps } from 'react-native';

import { primitive } from '../tokens/primitive.generated';
import { useTheme } from '../theme';

export type SurfaceRole = 'canvas' | 'base' | 'card' | 'selected';
export type RadiusKey = keyof typeof primitive.radius;

// RN'in ARIA `role` prop'u bilinçli dışarıda bırakılır (Omit): buradaki `role`
// semantic zemin rolüdür; a11y rolü gerekirse accessibilityRole ile verilir.
export type SurfaceProps = Omit<ViewProps, 'role'> & {
  /** Semantic zemin rolü (surface.*). Varsayılan: canvas. */
  role?: SurfaceRole;
  /** Köşe yuvarlaklığı token adı (§14.1). Verilmezse köşe uygulanmaz. */
  radius?: RadiusKey;
};

export function Surface({ role = 'canvas', radius, style, ...rest }: SurfaceProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        { backgroundColor: colors.surface[role] },
        radius ? { borderRadius: primitive.radius[radius], overflow: 'hidden' } : null,
        style,
      ]}
      {...rest}
    />
  );
}
