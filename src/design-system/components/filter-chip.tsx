/**
 * FilterChip — seçilebilir filtre çipi (07 §14 · 03 §17 · 04 §8/§18).
 *
 * Seçili durum TEK KANALA bağlı değil (15 §10): renk + kenar (1.5px strong) +
 * ağırlık + 'check' ikonu + accessibilityState.selected birlikte. radius=pill
 * (04 §8). Basılı zemin değişimi hareketsiz → reduced-motion kayıpsız. Dokunma
 * hedefi görünür s40 + hitSlop s4 ≈ 48.
 */

import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { AppText, Icon } from '../primitives';
import { primitive } from '../tokens/primitive.generated';
import { appTextVariants } from '../theme/typography';
import { useTheme } from '../theme';

export type FilterChipProps = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  /** Opsiyonel sayı (ör. eşleşen sonuç adedi) — label sonuna eklenir. */
  count?: number;
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

export function FilterChip({
  label,
  selected = false,
  disabled = false,
  onPress,
  count,
  accessibilityLabel,
  testID,
  style,
}: FilterChipProps) {
  const { colors } = useTheme();
  const shownLabel = typeof count === 'number' ? `${label} (${count})` : label;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? shownLabel}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={primitive.space.s4}
      testID={testID}
      style={({ pressed }) => [
        container,
        {
          backgroundColor: selected || pressed ? colors.surface.selected : colors.surface.base,
          borderColor: selected ? colors.border.strong : colors.border.subtle,
          borderWidth: selected ? primitive.borderWidth.focus : primitive.borderWidth.thin,
        },
        disabled ? { opacity: primitive.opacity.disabled } : null,
        style,
      ]}>
      {selected ? <Icon name="check" size="sm" decorative color={colors.text.primary} /> : null}
      <AppText variant="uiLabel" style={selected ? selectedLabel : undefined}>
        {shownLabel}
      </AppText>
    </Pressable>
  );
}

const container: ViewStyle = {
  minHeight: primitive.space.s40,
  paddingHorizontal: primitive.space.s16,
  borderRadius: primitive.radius.full,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: primitive.space.s4,
};

// İkinci görsel kanal — ağırlık (renk-tek-kanal yasağı, 15 §10). Ağırlık
// literal değil, tipografi token'ından (uiButton kesimi) gelir.
const selectedLabel = { fontWeight: appTextVariants.uiButton.fontWeight } as const;
