/**
 * Reveal — durum geçişi cross-fade'i (Design §19: zoom/ölçek yerine opacity;
 * §17 cevabı: "ne değişti" — beklenen içerik geldi).
 *
 * Yükleme→hazır geçişinde içerik yumuşak belirir (duration.component bandı).
 * motionScale=0 (reduced motion / düşük güç) → animasyonsuz düz View; bilgi
 * kaybolmaz, hiçbir şey hareket etmez.
 *
 * İzole render edilebilir: yalnız prop + token + hook.
 */

import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useMotionScale } from '../hooks';
import { motionDurations } from '../theme/motion';

export type RevealProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Reveal({ children, style }: RevealProps) {
  const motionScale = useMotionScale();

  if (motionScale === 0) {
    return <View style={style}>{children}</View>;
  }
  return (
    <Animated.View entering={FadeIn.duration(motionDurations.component)} style={style}>
      {children}
    </Animated.View>
  );
}
