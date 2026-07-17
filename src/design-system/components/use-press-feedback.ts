/**
 * Basılı durum geri bildirimi (Design §33 pressed · §18.2 süre bandı).
 *
 * motionScale=1 → ölçek animasyonu (duration.instant basış / duration.feedback
 * bırakış, easing.standard). motionScale=0 (reduced motion / düşük güç) →
 * ölçek yerine STATİK opacity değişimi (§19: bilgi kaybolmaz). Tüm sayılar
 * token'dan. Button, IconButton ve Card (basılabilirken) paylaşır.
 */

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';

import { useMotionScale } from '../hooks';
import { motionDistances, motionDurations, motionEasing } from '../theme/motion';
import { primitive } from '../tokens/primitive.generated';

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function usePressFeedback() {
  const motionScale = useMotionScale();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    if (motionScale === 0) {
      return {
        transform: [{ scale: 1 }],
        opacity: 1 - pressed.value * (1 - primitive.opacity.pressed),
      };
    }
    return {
      transform: [{ scale: 1 - pressed.value * (1 - motionDistances.pressScale) }],
      opacity: 1,
    };
  });

  const onPressIn = () => {
    pressed.value = withTiming(1, {
      duration: motionDurations.instant,
      easing: motionEasing.standard,
    });
  };
  const onPressOut = () => {
    pressed.value = withTiming(0, {
      duration: motionDurations.feedback,
      easing: motionEasing.standard,
    });
  };

  return { animatedStyle, onPressIn, onPressOut };
}
