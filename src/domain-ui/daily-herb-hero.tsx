/**
 * DailyHerbHero — Ana Sayfa'nın sinematik hero paneli ("Büyülü" yön kararı,
 * ürün sahibi C seçeneği, 2026-09-02).
 *
 * KATMANLAR (alttan üste):
 *   1. Görsel — tam genişlik, kenar boşluğu sıfır; köşe yuvarlaması YALNIZ
 *      altta (üst kenar ekranla birleşir). Storage görseli yoksa HerbImage'in
 *      nötr yer tutucusu (10 §11).
 *   2. Paralaks — görsel scroll'dan yavaş kayar (§17); kap kayma payıyla kurulu.
 *   3. Atmosferik scrim — üstte patlıcan-menekşe, ortada indigo, altta gece
 *      (material.heroAtmosphere). Alt durak 0.90 opaklıkta: adın oturduğu
 *      bantta kontrast ALTTAKİ GÖRSELDEN BAĞIMSIZ olur (15 §10 + AA).
 *   4. Altın ışık huzmesi — üst köşeden yayılan yumuşak RADYAL altın
 *      (glow.ceremonial → ambientWarm → şeffaf). Nefes alan ambient katmanla
 *      BİRLİKTE solup derinleşir; iki ayrı animasyon değil, tek ışık nefesi.
 *      Radyal degrade react-native-svg ile kurulur (expo-linear-gradient
 *      yalnız doğrusal geçiş verir; huzme köşeden YAYILMALI).
 *   5. Bağlam şeridi — tarih + ay çipi panelin İÇİNDE, üst köşelerde; metin
 *      açık (onPanel), ay çipi altın vurgulu.
 *   6. Adlar — doğrudan scrim üzerinde: yaygın ad büyük açık Fraunces,
 *      bilimsel ad açık lila italik. Cam plaka YOK.
 *
 * KOYULUK SINIRI (15 §3): bu panel, kanonun koyuluğa izin verdiği "hero görsel
 * paneli" katmanıdır. Koyu değerler yalnız buradaki scrim'de yaşar; krom (üst
 * bar, tab bar, form, uzun okuma) açık kalır ve bu bileşen kroma renk vermez.
 *
 * KİLİTLER: bilimsel ad hiçbir hâlde gizlenmez (07 §6 · 12 §F). Panel bir bütün
 * olarak basılır (§25). Reduced-motion / düşük güç → paralaks ve ışık nefesi
 * tamamen durur, katmanlar statik kalır (§19).
 *
 * İzole render edilebilir: yalnız prop + token + tema bağlamı.
 */

import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useEffect } from 'react';
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

import { AnimatedPressable, usePressFeedback } from '@/design-system/components/use-press-feedback';
import { useMotionScale } from '@/design-system/hooks';
import { AppText, Surface } from '@/design-system/primitives';
import { shadowStyle, useTheme } from '@/design-system/theme';
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
  /** Panel yüksekliği — ekranın üst ~%40'ı (çağıran hesaplar). */
  height: number;
  /** Panelin üstünde bırakılacak güvenli alan payı (durum çubuğu). */
  topInset?: number;
  /** Bağlam şeridinin sol yanı: tarih (açık renkte, panelin içinde). */
  dateLabel?: string;
  /** Bağlam şeridinin sağ yanı: ay çipi içeriği (glif + metin). */
  moonChip?: React.ReactNode;
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
/** Işık nefesinin tek yönü — ambient bandının alt sınırı (15 §9: 8-16 sn). */
const BREATH_MS = primitive.motionLimits.ambientMinMs;
/** Nefesin dibi: ışık hiç sönmez, yalnız derinleşir. */
const BREATH_MIN = primitive.opacity.pulse;

const TRANSPARENT = primitive.color.scrim.transparent;

export function DailyHerbHero({
  commonName,
  scientificName,
  imagePath,
  imageVersion,
  height,
  topInset = 0,
  dateLabel,
  moonChip,
  scrollY,
  onPress,
  accessibilityLabel,
  testID,
  style,
}: DailyHerbHeroProps) {
  const { colors } = useTheme();
  const motionScale = useMotionScale();
  const { animatedStyle, onPressIn, onPressOut } = usePressFeedback();
  const atmosphere = colors.heroAtmosphere;

  // --- Tek ışık nefesi: altın huzme ambient bandında derinleşip geri çekilir.
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
        { height, paddingTop: topInset, backgroundColor: colors.surface.selected },
        shadowStyle('card'),
        animatedStyle,
        style,
      ]}>
      {/* 1-2 · Görsel + paralaks. */}
      <Animated.View style={[styles.imageLayer, parallaxStyle]}>
        <HerbImage imagePath={imagePath} imageVersion={imageVersion} placeholderAlign="top" />
      </Animated.View>

      {/* 3 · Atmosferik scrim: patlıcan → indigo → gece. */}
      <LinearGradient
        colors={[atmosphere.top, atmosphere.upper, atmosphere.mid, atmosphere.bottom]}
        locations={[0, 0.28, 0.62, 1]}
        pointerEvents="none"
        style={styles.fillAbsolute}
      />

      {/* 4 · Altın ışık huzmesi: üst köşeden RADYAL yayılır, nefes alır. */}
      <Animated.View pointerEvents="none" style={[styles.fillAbsolute, breathStyle]}>
        <Svg width="100%" height="100%">
          <Defs>
            {/* Merkez üst-sağ köşe; yarıçap panelin köşegeni kadar → huzme
                köşeden başlayıp panelin ortasında eriyor. */}
            <RadialGradient id="heroGoldShaft" cx="82%" cy="-4%" r="98%">
              <Stop offset="0" stopColor={colors.glow.ceremonial.color} />
              <Stop offset="0.38" stopColor={colors.glow.ambientWarm.color} />
              <Stop offset="1" stopColor={TRANSPARENT} />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#heroGoldShaft)" />
        </Svg>
      </Animated.View>

      {/* 5 · Bağlam şeridi: tarih + ay çipi panelin içinde, üst köşelerde. */}
      {dateLabel || moonChip ? (
        <View style={styles.contextStrip} pointerEvents="none">
          {dateLabel ? (
            <AppText variant="uiLabel" style={{ color: colors.text.onPanelSecondary }}>
              {dateLabel}
            </AppText>
          ) : (
            <View />
          )}
          {moonChip}
        </View>
      ) : null}

      {/* 6 · Adlar doğrudan scrim üzerinde — cam plaka yok. */}
      <View style={styles.names} pointerEvents="none">
        <AppText
          variant="displayHero"
          numberOfLines={2}
          style={{ color: colors.text.onPanel }}>
          {commonName}
        </AppText>
        <AppText
          variant="scientificName"
          numberOfLines={1}
          style={{ color: colors.text.onPanelAccent }}>
          {scientificName}
        </AppText>
      </View>
    </AnimatedPressable>
  );
}

const styles = {
  // Kenar boşluğu sıfır; köşe yuvarlaması YALNIZ altta (üst kenar ekranla birleşir).
  panel: {
    borderBottomLeftRadius: primitive.layout.heroRadius,
    borderBottomRightRadius: primitive.layout.heroRadius,
    overflow: 'hidden',
    justifyContent: 'space-between',
  } satisfies ViewStyle,
  // Kayma payı: üstte ve altta PARALLAX_SHIFT kadar taşar → kenar açılmaz.
  imageLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -PARALLAX_SHIFT,
    bottom: -PARALLAX_SHIFT,
  } satisfies ViewStyle,
  fillAbsolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  } satisfies ViewStyle,
  contextStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: primitive.layout.screenPadding,
    paddingTop: primitive.space.s12,
    gap: primitive.space.s8,
  } satisfies ViewStyle,
  names: {
    paddingHorizontal: primitive.layout.screenPadding,
    paddingBottom: primitive.space.s24,
    gap: primitive.space.s2,
  } satisfies ViewStyle,
  fill: { flex: 1 } satisfies ViewStyle,
};

/**
 * Hero'nun ay çipi kabuğu — panel içinde altın vurgulu, açık metinli.
 * Krom çipinden (pudra zemin) ayrıdır: koyu scrim üstünde yaşar.
 */
export function HeroMoonChip({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <Surface
      role="glassDeep"
      radius="full"
      style={[chipStyles.chip, { borderColor: colors.border.gold }]}>
      {children}
    </Surface>
  );
}

const chipStyles = {
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: primitive.space.s4,
    paddingHorizontal: primitive.space.s12,
    paddingVertical: primitive.space.s4,
    borderWidth: primitive.borderWidth.thin,
  } satisfies ViewStyle,
};
