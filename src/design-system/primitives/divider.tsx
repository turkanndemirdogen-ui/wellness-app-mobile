/**
 * Divider — ayırıcı primitive'i (Design §28).
 *
 * Sınır son çaredir (§14.2: boşluk → tonal kontrast → sınır); Divider bilinçli
 * kullanılır. Renk semantic border.subtle; kalınlık platform ince çizgisi
 * (hairline), dekoratif olduğundan a11y ağacından gizlidir.
 */

import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '../theme';

export type DividerProps = ViewProps & {
  vertical?: boolean;
};

export function Divider({ vertical = false, style, ...rest }: DividerProps) {
  const { colors } = useTheme();

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        { backgroundColor: colors.border.subtle, alignSelf: 'stretch' },
        vertical
          ? { width: StyleSheet.hairlineWidth }
          : { height: StyleSheet.hairlineWidth },
        style,
      ]}
      {...rest}
    />
  );
}
