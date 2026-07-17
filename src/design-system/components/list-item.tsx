/**
 * ListItem — çekirdek bileşen (Design §29).
 *
 * leading · başlık+destek metni · trailing düzeni. Basılabilirse dokunma
 * hedefi min 48pt (roadmap kuralı) ve basılı durum zemin değişimiyle bildirilir
 * (surface.selected) — hareketsiz geri bildirim olduğundan reduced-motion'da
 * kayıpsızdır (§19). Devre dışı: opacity + accessibilityState (renk-tek-kanal
 * değil, §33).
 *
 * GEÇİCİ: başlık body.l + 600 ağırlık — listItem.title component token'ı
 * tipografi kilidiyle (Faz 6) gelir.
 */

import { type ReactNode } from 'react';
import {
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Text } from '../primitives';
import { primitive } from '../tokens/primitive.generated';
import { useTheme } from '../theme';

export type ListItemProps = {
  title: string;
  /** Destek metni (varsayılan 3 satırla sınırlı — §12.3). */
  description?: string;
  /** Sol slot (ör. dekoratif Icon). */
  leading?: ReactNode;
  /** Sağ slot (ör. sayaç, chevron). */
  trailing?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function ListItem({
  title,
  description,
  leading,
  trailing,
  onPress,
  disabled = false,
  accessibilityLabel,
  style,
  testID,
}: ListItemProps) {
  const { colors } = useTheme();

  const content = (
    <>
      {leading ? <View>{leading}</View> : null}
      <View style={rowStyles.body}>
        <Text role="body.l" style={{ fontWeight: '600' }}>
          {title}
        </Text>
        {description ? (
          <Text role="body.s" tone="secondary" numberOfLines={3}>
            {description}
          </Text>
        ) : null}
      </View>
      {trailing ? <View>{trailing}</View> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        testID={testID}
        style={({ pressed }) => [
          rowStyles.row,
          pressed ? { backgroundColor: colors.surface.selected } : null,
          disabled ? { opacity: primitive.opacity.disabled } : null,
          style,
        ]}>
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[rowStyles.row, style]} testID={testID}>
      {content}
    </View>
  );
}

const rowStyles = {
  row: {
    minHeight: primitive.space.s48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: primitive.space.s12,
    paddingHorizontal: primitive.space.s16,
    paddingVertical: primitive.space.s8,
    borderRadius: primitive.radius.md,
  } satisfies ViewStyle,
  body: {
    flex: 1,
    gap: primitive.space.s2,
  } satisfies ViewStyle,
};
