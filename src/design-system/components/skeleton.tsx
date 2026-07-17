/**
 * Skeleton — yükleme yer tutucusu (Design §36: öncelik sırası — iskelet,
 * spinner'dan ÖNCE gelir; ortam hareketi tek yükleme göstergesi olamaz).
 *
 * Nabız: opacity 1 ↔ opacity.pulse döngüsü (duration.pulse, easing.standard).
 * Reduced motion / düşük güçte (useMotionScale=0) animasyon YOK — blok statik
 * ve tam görünür kalır (§19: bilgi kaybolmaz).
 *
 * Yükseklik `textRole` ile verildiğinde ilgili tipografi rolünün satır
 * yüksekliğinden gelir → yüklenen metinle bire bir hiza (düzen sıçraması yok).
 * A11y: iskelet dekoratiftir, ağaçtan gizlenir; yükleme duyurusunu bağlamdaki
 * görünür metin/Loader taşır.
 *
 * İzole render edilebilir: yalnız prop + token + (default'lu) tema bağlamı.
 */

import { useEffect } from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { primitive } from '../tokens/primitive.generated';
import { useMotionScale } from '../hooks';
import { useTheme } from '../theme';
import { motionDurations, motionEasing } from '../theme/motion';
import { textRoles, type TextRoleName } from '../theme/typography';
import type { RadiusKey } from '../primitives';

export type SkeletonProps = {
  width?: DimensionValue;
  /** Sabit yükseklik (pt). `textRole` verilirse yok sayılır. */
  height?: number;
  /** Yer tutulan metnin rolü — yükseklik rolün satır yüksekliği olur. */
  textRole?: TextRoleName;
  radius?: RadiusKey;
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({
  width = '100%',
  height,
  textRole,
  radius = 'sm',
  style,
}: SkeletonProps) {
  const { colors } = useTheme();
  const motionScale = useMotionScale();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (motionScale === 1) {
      pulse.value = withRepeat(
        withTiming(primitive.opacity.pulse, {
          duration: motionDurations.pulse,
          easing: motionEasing.standard,
        }),
        -1,
        true,
      );
    } else {
      cancelAnimation(pulse);
      pulse.value = 1;
    }
    return () => cancelAnimation(pulse);
  }, [motionScale, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  const resolvedHeight = textRole
    ? (textRoles[textRole].lineHeight ?? primitive.space.s16)
    : (height ?? primitive.space.s16);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width,
          height: resolvedHeight,
          borderRadius: primitive.radius[radius],
          backgroundColor: colors.surface.selected,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}
