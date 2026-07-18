/**
 * AmbientBackground — çevre katmanı (Design §11.5 adaptive ambient · §15
 * Atmospheric material · §21 Living World katman 1 · A5 dikey dilimi).
 *
 * Ekranın arkasına serilen yumuşak ışık yıkaması: üstte günün saat diliminin
 * ambient tonu (semantic `ambient.wash`), aşağıda nötr tabana (`ambient.base`)
 * erir. Gün diliminde iki renk aynıdır → degrade görünmez (nötr gün ışığı).
 * Atmospheric kuralı: etkileşim İÇERMEZ (pointerEvents none); dramatik hareket
 * ve sinematik geçiş yok.
 *
 * A5 dilimi davranışları:
 * - **Minimal paralaks:** `scrollY` verilirse katman, içerikten yavaş kayar
 *   (uzamsal ilişki — §17). Mesafeler space token'larından; kayma üst sınırı
 *   küçüktür (s24).
 * - **Çevresel tepki (§21.2 "light shift"):** `responseSignal` her arttığında
 *   yıkama bir kez yumuşakça derinleşip söner (hero süre bandı). Ödül/copy
 *   değildir; kesintisiz olmayan ortam tepkisidir.
 * - **Reduced motion / düşük güç (§21.4, §19):** motionScale=0 → statik dünya;
 *   paralaks ve tepki tamamen kapalı, degrade sabit karede kalır. Sürekli
 *   döngü hiç yok → düşük güçte azaltılacak parçacık/döngü bu katmanda zaten
 *   bulunmaz.
 *
 * İzole render edilebilir: yalnız prop + token + tema bağlamı.
 */

import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { primitive } from '../tokens/primitive.generated';
import { useMotionScale } from '../hooks';
import { useTheme } from '../theme';
import { motionDurations, motionEasing } from '../theme/motion';

export type AmbientBackgroundProps = {
  /** Ekranın scroll konumu (paylaşımlı değer) — verilirse minimal paralaks. */
  scrollY?: SharedValue<number>;
  /**
   * Çevresel tepki tetiği: değer her ARTTIĞINDA tek yumuşak ışık kayması
   * oynar (§21.2). 0/undefined → tepki yok.
   */
  responseSignal?: number;
};

// Paralaks aralığı: s96'lık kaydırmada en çok s24 yukarı kayma (küçük, sakin).
const PARALLAX_INPUT = primitive.space.s96;
const PARALLAX_SHIFT = -primitive.space.s24;

export function AmbientBackground({ scrollY, responseSignal }: AmbientBackgroundProps) {
  const { colors } = useTheme();
  const motionScale = useMotionScale();

  // Işık kayması: yıkamayı derinleştiren üst katmanın opaklığı (0 → 1 → 0).
  const shift = useSharedValue(0);
  useEffect(() => {
    if (!responseSignal || motionScale === 0) return;
    shift.value = withSequence(
      withTiming(1, { duration: motionDurations.hero, easing: motionEasing.decelerate }),
      withTiming(0, { duration: motionDurations.hero, easing: motionEasing.standard }),
    );
  }, [responseSignal, motionScale, shift]);

  const parallaxStyle = useAnimatedStyle(() => {
    if (motionScale === 0 || !scrollY) return { transform: [{ translateY: 0 }] };
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, PARALLAX_INPUT],
            [0, PARALLAX_SHIFT],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const shiftStyle = useAnimatedStyle(() => ({ opacity: shift.value }));

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, parallaxStyle]}>
      {/* Taban degrade: yıkama → nötr zemin (üst ~%60'ta erir). */}
      <LinearGradient
        colors={[colors.ambient.wash, colors.ambient.base]}
        locations={[0, 0.6]}
        style={styles.fill}
      />
      {/* Işık kayması katmanı: aynı yıkama daha derine iner; yalnız tepki
          anında görünür (opacity 0 tabanlı). */}
      {motionScale === 1 ? (
        <Animated.View style={[StyleSheet.absoluteFill, shiftStyle]}>
          <LinearGradient
            colors={[colors.ambient.wash, colors.ambient.base]}
            locations={[0, 0.95]}
            style={styles.fill}
          />
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
