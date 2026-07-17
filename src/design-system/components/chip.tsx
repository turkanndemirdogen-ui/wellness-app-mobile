/**
 * Chip — çekirdek bileşen (Design §29; A2 Sprint 1 listesindeki Chip'in ilk
 * dilimi: seçilebilir filtre/hızlı-seçim çipi).
 *
 * Durumlar (§33): default · pressed · selected · disabled. Seçili durum tek
 * kanala bağlı değildir (§43: renk + ağırlık + accessibilityState.selected).
 * Basılı geri bildirim hareketsiz zemin değişimidir (ListItem ile aynı desen)
 * → reduced-motion'da kayıpsız (§19).
 *
 * Dokunma hedefi: görünür yükseklik s40 + hitSlop s4 → etkin hedef 48pt
 * (roadmap: min 44, tercih 48).
 */

import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../primitives';
import { primitive } from '../tokens/primitive.generated';
import { useTheme } from '../theme';

export type ChipProps = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Chip({
  label,
  selected = false,
  disabled = false,
  onPress,
  accessibilityLabel,
  style,
  testID,
}: ChipProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={primitive.space.s4}
      testID={testID}
      style={({ pressed }) => [
        baseContainer,
        {
          backgroundColor:
            selected || pressed ? colors.surface.selected : colors.surface.base,
          borderColor: selected ? colors.border.strong : colors.border.subtle,
        },
        disabled ? { opacity: primitive.opacity.disabled } : null,
        style,
      ]}>
      <Text role="label" style={selected ? selectedLabel : undefined}>
        {label}
      </Text>
    </Pressable>
  );
}

const baseContainer: ViewStyle = {
  minHeight: primitive.space.s40,
  paddingHorizontal: primitive.space.s16,
  borderRadius: primitive.radius.full,
  borderWidth: primitive.borderWidth.thin,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
};

// Seçili durum ikinci görsel kanalı — ağırlık (renk-tek-kanal yasağı, §43).
const selectedLabel = { fontWeight: '600' } as const;
