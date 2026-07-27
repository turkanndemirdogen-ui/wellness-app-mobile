/**
 * TabItem — bottom navigation hücresi (07 §3 · 15 §2 4-tab kilidi · 03 §16).
 *
 * TabIcon (dekoratif) + TabLabel'ı basılabilir bir hücrede birleştirir; aktif
 * durum RENK-TEK-KANAL DEĞİL (ikon opaklığı + label ağırlığı + tint + a11y
 * selected). Label DAİMA görünür (03 §16 — glyph label'ı değiştirmez). Dokunma
 * hedefi ≥44. Presentational: gerçek tab wiring app/(tabs)/_layout'ta (Phase 4).
 */

import { Pressable, type ColorValue, type StyleProp, type ViewStyle } from 'react-native';

import { type IconName } from '../primitives';
import { primitive } from '../tokens/primitive.generated';
import { useTheme } from '../theme';
import { TabIcon, TabLabel } from './tab-icon';

export type TabItemProps = {
  icon: IconName;
  label: string;
  focused: boolean;
  onPress?: () => void;
  /** Aktif/pasif tint (navigasyondan). Verilmezse tema navigation renkleri. */
  color?: ColorValue;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

export function TabItem({ icon, label, focused, onPress, color, testID, style }: TabItemProps) {
  const { colors } = useTheme();
  const tint = color ?? (focused ? colors.navigation.active : colors.navigation.inactive);

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      testID={testID}
      style={[container, style]}>
      <TabIcon name={icon} focused={focused} />
      <TabLabel label={label} color={tint} focused={focused} />
    </Pressable>
  );
}

const container: ViewStyle = {
  minHeight: primitive.layout.touchTarget,
  minWidth: primitive.layout.touchTarget,
  paddingVertical: primitive.space.s4,
  alignItems: 'center',
  justifyContent: 'center',
  gap: primitive.space.s2,
};
