/**
 * Button + IconButton — çekirdek bileşen (Design §29).
 *
 * Hiyerarşiler §24 ile sınırlı: primary · secondary · tertiary · ghost ·
 * destructive. Yeni görsel buton kategorisi eklenmez.
 *
 * Durumlar (§33): default · pressed · focused · disabled · loading — durum
 * belirsizliği yasak; her durum görsel + erişilebilirlik kanalında bildirilir
 * (disabled yalnız renkle DEĞİL: opacity + accessibilityState).
 *
 * Hareket: basılı geri bildirim ölçek animasyonu (duration.instant/feedback
 * bandı, §18.2) — reduced motion / düşük güçte (useMotionScale=0) ölçek yerine
 * STATİK opacity değişimi (§19: bilgi kaybolmaz). Tüm sayılar token'dan.
 *
 * Dokunma hedefi: min 48pt (roadmap: min 44, tercih 48).
 *
 * GEÇİCİ: buton etiketi body.m + 600 ağırlık — button.label component token'ı
 * tipografi kilidiyle (Faz 6) gelecek.
 */

import { useState } from 'react';
import {
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Icon, Text, type IconName } from '../primitives';
import { primitive } from '../tokens/primitive.generated';
import { useTheme, type SemanticColors } from '../theme';
import { Loader } from './loader';
import { AnimatedPressable, usePressFeedback } from './use-press-feedback';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive';

type VariantSpec = {
  container: ViewStyle;
  labelColor: string;
};

function variantSpec(variant: ButtonVariant, colors: SemanticColors): VariantSpec {
  switch (variant) {
    case 'primary':
      return {
        container: { backgroundColor: colors.action.primary },
        labelColor: colors.action.onPrimary,
      };
    case 'secondary':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: primitive.borderWidth.thin,
          borderColor: colors.action.outline,
        },
        labelColor: colors.action.outline,
      };
    case 'tertiary':
      return {
        container: { backgroundColor: colors.action.tonal },
        labelColor: colors.action.onTonal,
      };
    case 'ghost':
      return {
        container: { backgroundColor: 'transparent' },
        labelColor: colors.action.ghost,
      };
    case 'destructive':
      return {
        container: { backgroundColor: colors.action.destructive },
        labelColor: colors.action.onDestructive,
      };
  }
}

type CommonProps = {
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
} & Pick<PressableProps, 'onPress' | 'testID'>;

export type ButtonProps = CommonProps & {
  label: string;
};

export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  onPress,
  testID,
}: ButtonProps) {
  const { colors } = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressFeedback();
  const [focused, setFocused] = useState(false);

  const spec = variantSpec(variant, colors);
  const inert = disabled || loading;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inert, busy: loading }}
      disabled={inert}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      testID={testID}
      style={[
        baseContainer,
        spec.container,
        focused && {
          borderWidth: primitive.borderWidth.focus,
          borderColor: colors.border.strong,
        },
        disabled && { opacity: primitive.opacity.disabled },
        animatedStyle,
        style,
      ]}>
      {loading ? (
        // busy durumunu Button'ın accessibilityState'i duyurur → Loader etiketsiz.
        <Loader color={spec.labelColor} />
      ) : (
        <Text role="body.m" style={{ color: spec.labelColor, fontWeight: '600' }}>
          {label}
        </Text>
      )}
    </AnimatedPressable>
  );
}

export type IconButtonProps = CommonProps & {
  icon: IconName;
  /** Zorunlu ekran okuyucu etiketi — ikon tek başına anlam taşıyamaz (§43). */
  label: string;
};

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  loading = false,
  disabled = false,
  style,
  onPress,
  testID,
}: IconButtonProps) {
  const { colors } = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressFeedback();
  const [focused, setFocused] = useState(false);

  const spec = variantSpec(variant, colors);
  const inert = disabled || loading;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inert, busy: loading }}
      disabled={inert}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      testID={testID}
      style={[
        baseContainer,
        iconContainer,
        spec.container,
        focused && {
          borderWidth: primitive.borderWidth.focus,
          borderColor: colors.border.strong,
        },
        disabled && { opacity: primitive.opacity.disabled },
        animatedStyle,
        style,
      ]}>
      {loading ? (
        <Loader color={spec.labelColor} />
      ) : (
        <Icon name={icon} decorative />
      )}
    </AnimatedPressable>
  );
}

// Dokunma hedefi ve iç boşluklar token'dan (§13, roadmap 44/48pt kuralı).
const baseContainer: ViewStyle = {
  minHeight: primitive.space.s48,
  minWidth: primitive.space.s48,
  paddingHorizontal: primitive.space.s24,
  borderRadius: primitive.radius.md,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: primitive.space.s8,
};

const iconContainer: ViewStyle = {
  paddingHorizontal: 0,
  width: primitive.space.s48,
};
