/**
 * DailyHerbHero — Ana Sayfa'nın tek hero'su: full-bleed bitki görseli
 * (08 §13 "Home hero → V2 immersive" · 04 §13.1 "hero → image + scrim").
 *
 * KATMANLAR (alttan üste):
 *   1. Görsel — HerbImage, panelin tamamını kaplar (cover). Storage görseli
 *      yoksa HerbImage'in nötr yer tutucusu görünür (10 §11) — ekran değişmez.
 *   2. Paralaks — görsel, scroll'dan YAVAŞ kayar (§17 uzamsal ilişki). Kayma
 *      payı kadar taşan bir kap kullanılır ki kenar açılmasın.
 *   3. Nefes — günün saatine göre sıcak/soğuk ambient glow'un (04 §10.1
 *      "ambient" sınıfı) yumuşak yıkaması; 8 sn'lik tek yönle ambient bandında
 *      (15 §9) gider gelir. Renk değil ışık hareket eder.
 *   4. Mürekkep scrim — alt kenardan yükselen karartma (02 §14 dark scrim;
 *      saf siyah botanik fotoğrafı griye çeviriyordu). Cam plakanın altını
 *      oturtur, görselin kendi kontrastını korur.
 *   5. Cam plaka — ad + bilimsel ad ön-tonlanmış cam üstünde (04 §5 frost,
 *      §12.5 hero glass). Metin görselin üstünde SERBEST durmaz: kendi açık
 *      yüzeyinde durur → kontrast görselden bağımsız ve deterministik (AA).
 *
 * KİLİTLER: bilimsel ad hiçbir hâlde gizlenmez (07 §6 · 12 §F). Panel bir
 * bütün olarak basılır (§25: küçük hassas iç hedef yok). Reduced-motion /
 * düşük güç → paralaks ve nefes tamamen durur, katmanlar statik kalır (§19).
 *
 * İzole render edilebilir: yalnız prop + token + tema bağlamı (scrollY
 * opsiyoneldir; verilmezse paralaks yok).
 */

import { LinearGradient } from 'expo-linear-gradient';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { AnimatedPressable, usePressFeedback } from '@/design-system/components/use-press-feedback';
import { useMotionScale } from '@/design-system/hooks';
import { AppText, Surface } from '@/design-system/primitives';
import { useAtmosphere, useTheme, shadowStyle } from '@/design-system/theme';
import { motionEasing } from '@/design-system/theme/motion';
import { primitive } from '@/design-system/tokens/primitive.generated';
import { HerbImage } from './herb-image';

export type DailyHerbHeroProps = {
  /** Yaygın ad — panelin tek büyük serifi (03 §7.1 hero title). */
  commonName: string;
  /** Bilimsel ad — italik, asla gizlenmez (07 §6). */
  scientificName: string;
  /** Storage bucket-içi görsel yolu (10 §10). */
  imagePath: string | null;
  imageVersion: number | null;
  /** Panel yüksekliği — ekran sözleşmesinden (15 §7 heroHeight). */
  height: number;
  /** Scroll konumu — verilirse görsel paralaksı çalışır. */
  scrollY?: SharedValue<number>;
  onPress?: () => void;
  accessibilityLabel: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

/** Görselin scroll boyunca kayabileceği en büyük mesafe (sakin, küçük). */
const PARALLAX_SHIFT = primitive.space.s24;
/** Paralaksın tamamlandığı scroll mesafesi. */
const PARALLAX_INPUT = primitive.space.s96 * 2;
/** Nefesin tek yönü — ambient bandının alt sınırı (15 §9: 8-16 sn). */
const BREATH_MS = primitive.motionLimits.ambientMinMs;
/** Nefesin dip ve tepe opaklığı: ışık hiç sönmez, yalnız derinleşir. */
const BREATH_MIN = primitive.opacity.pulse;

export function DailyHerbHero({
  commonName,
  scientificName,
  imagePath,
  imageVersion,
  height,
  scrollY,
  onPress,
  accessibilityLabel,
  testID,
  style,
}: DailyHerbHeroProps) {
  const { colors } = useTheme();
  const { phase } = useAtmosphere();
  const motionScale = useMotionScale();
  const { animatedStyle, onPressIn, onPressOut } = usePressFeedback();

  // --- Nefes: ışık yıkamasının opaklığı ambient bandında gider gelir.
  const breath = useSharedValue(1);
  useEffect(() => {
    if (motionScale === 0) {
      breath.value = 1;
      return;
    }
    breath.value = withRepeat(
      withTiming(BREATH_MIN, { duration: BREATH_MS, easing: motionEasing.standard }),
      -1,
      true,
    );
  }, [motionScale, breath]);

  const breathStyle = useAnimatedStyle(() => ({ opacity: breath.value }));

  // --- Paralaks: görsel içerikten yavaş kayar; kap taşma payıyla kurulu.
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

  // Gündüz sıcak, akşam/gece soğuk ışık (01 §5 gün döngüsü).
  const ambientGlow =
    phase === 'day' ? colors.glow.ambientWarm.color : colors.glow.ambientCool.color;

  return (
    <AnimatedPressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}
      disabled={!onPress}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      testID={testID}
      style={[
        styles.panel,
        { height, backgroundColor: colors.surface.selected, borderColor: colors.border.hairline },
        shadowStyle('card'),
        animatedStyle,
        style,
      ]}>
      {/* 1-2 · Görsel + paralaks (kap, kayma payı kadar taşar). */}
      <Animated.View style={[styles.imageLayer, parallaxStyle]}>
        <HerbImage
          imagePath={imagePath}
          imageVersion={imageVersion}
          placeholderAlign="top"
        />
      </Animated.View>

      {/* 3 · Nefes: üstten inen ambient ışık yıkaması. */}
      <Animated.View pointerEvents="none" style={[styles.bloom, breathStyle]}>
        <LinearGradient
          colors={[ambientGlow, primitive.color.scrim.transparent]}
          style={styles.fill}
        />
      </Animated.View>

      {/* 4 · Mürekkep scrim: cam plakanın oturduğu zemin. */}
      <LinearGradient
        colors={[primitive.color.scrim.transparent, primitive.color.scrim.inkMedium]}
        locations={[0.35, 1]}
        pointerEvents="none"
        style={styles.scrim}
      />

      {/* 5 · Cam plaka: adlar kendi açık yüzeyinde — kontrast görselden bağımsız. */}
      <View style={styles.plateSlot} pointerEvents="none">
        <Surface role="glassFrost" radius="lg" bordered style={styles.plate}>
          <AppText variant="displayHero" numberOfLines={2}>
            {commonName}
          </AppText>
          <AppText variant="scientificName" tone="secondary" numberOfLines={1}>
            {scientificName}
          </AppText>
        </Surface>
      </View>
    </AnimatedPressable>
  );
}

const styles = {
  panel: {
    borderRadius: primitive.layout.heroRadius,
    borderWidth: primitive.borderWidth.thin,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  } satisfies ViewStyle,
  // Kayma payı: üstte ve altta PARALLAX_SHIFT kadar taşar → kenar açılmaz.
  imageLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -PARALLAX_SHIFT,
    bottom: -PARALLAX_SHIFT,
  } satisfies ViewStyle,
  bloom: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '60%',
  } satisfies ViewStyle,
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  } satisfies ViewStyle,
  plateSlot: {
    padding: primitive.space.s12,
  } satisfies ViewStyle,
  plate: {
    paddingHorizontal: primitive.space.s16,
    paddingVertical: primitive.space.s12,
    gap: primitive.space.s2,
  } satisfies ViewStyle,
  fill: { flex: 1 } satisfies ViewStyle,
};
