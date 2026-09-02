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

export type SurfaceRole =
  | 'canvas'
  | 'base'
  | 'card'
  | 'selected'
  | 'powder'
  | 'parchment'
  /** Cam yüzeyler (04 §5) — ön-tonlanmış; `bordered` ile ışık kenarı gelir. */
  | 'glassMist'
  | 'glassFrost'
  | 'glassDeep';
export type RadiusKey = keyof typeof primitive.radius;

// RN'in ARIA `role` prop'u bilinçli dışarıda bırakılır (Omit): buradaki `role`
// semantic zemin rolüdür; a11y rolü gerekirse accessibilityRole ile verilir.
export type SurfaceProps = Omit<ViewProps, 'role'> & {
  /** Semantic zemin rolü (surface.*). Varsayılan: canvas. */
  role?: SurfaceRole;
  /** Köşe yuvarlaklığı token adı (§14.1). Verilmezse köşe uygulanmaz. */
  radius?: RadiusKey;
  /**
   * 1px kenar çizgisi: cam rollerinde ışık kenarı (04 §5), diğerlerinde
   * mürekkep saç çizgisi (04 §7.1). Kart düzlüğünü kıran tanım katmanı.
   */
  bordered?: boolean;
};

const GLASS_ROLES: readonly SurfaceRole[] = ['glassMist', 'glassFrost', 'glassDeep'];

export function Surface({
  role = 'canvas',
  radius,
  bordered = false,
  style,
  ...rest
}: SurfaceProps) {
  const { colors } = useTheme();
  const isGlass = GLASS_ROLES.includes(role);

  return (
    <View
      style={[
        { backgroundColor: colors.surface[role] },
        radius ? { borderRadius: primitive.radius[radius], overflow: 'hidden' } : null,
        bordered
          ? {
              borderWidth: primitive.borderWidth.thin,
              borderColor: isGlass ? colors.border.glass : colors.border.hairline,
            }
          : null,
        style,
      ]}
      {...rest}
    />
  );
}
