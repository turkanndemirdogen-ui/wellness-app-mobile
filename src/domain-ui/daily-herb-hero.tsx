/**
 * DailyHerbHero — Ana Sayfa'nın sinematik hero paneli.
 *
 * SCRIM YÖNÜ DEĞİŞİMİ (ürün sahibi, 2026-09-02): tam boy dikey koyulaşma
 * KALDIRILDI. Bitki görseli merkezde tam netlikte durur; atmosfer kenarlardan
 * gelir.
 *
 * KATMANLAR (alttan üste):
 *   1. Görsel — tam genişlik, kenar boşluğu sıfır; köşe yuvarlaması yalnız
 *      altta. Storage görseli yoksa HerbImage'in nötr yer tutucusu (10 §11).
 *   2. Paralaks — görsel scroll'dan yavaş kayar (§17); kap kayma payıyla kurulu.
 *   3. VİNYET — elips radyal (merkez %50/%38): ortası şeffaf, kenarlara doğru
 *      patlıcan → gece. Görselin ortası DOKUNULMADAN kalır.
 *   4. LİLA SİS — tüm hero üstünde ince düz katman; atmosferi birleştirir.
 *   5. ADAPTİF BULUT — YALNIZ metin bandı açık olan görsellerde: sol-alt
 *      merkezli, kenarları tamamen yumuşak koyu bulut. Gücü görsel başına
 *      ÖLÇÜLEREK çözülür (scripts/measure-hero-contrast.py) ve varlık kaydında
 *      saklanır; cihazda hesaplanmaz.
 *   6. ALTIN IŞIK HUZMESİ — üst köşeden yayılan radyal altın; en üstteki
 *      katman. Nefes alan ambient katmanla birlikte solup derinleşir.
 *
 * METİN EMNİYETİ (kabul kriteri): ad ve bilimsel ad yumuşak metin gölgesi
 * taşır; katman bileşimi 11 canlı görselin HEPSİNDE beyaz yazıyla ≥4.5:1
 * kontrast verir (ölçüm + `hero-text-contrast` testi). Bağlam şeridi görsele
 * göre DEĞİŞMEZ: sabit koyu-altın metin, aynı tonda hairline, açık-altın
 * yüzey (beyaz çip yok).
 *
 * KOYULUK SINIRI (15 §3): bu panel, kanonun koyuluğa izin verdiği "hero görsel
 * paneli" katmanıdır. Koyu değerler yalnız buradaki katmanlarda yaşar; krom
 * (üst bar, tab bar, form, uzun okuma) açık kalır.
 *
 * Reduced-motion / düşük güç → paralaks ve ışık nefesi tamamen durur (§19).
 * İzole render edilebilir: yalnız prop + token + tema bağlamı.
 */

import { useEffect } from 'react';
import { View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AnimatedPressable, usePressFeedback } from '@/design-system/components/use-press-feedback';
import { useMotionScale } from '@/design-system/hooks';
import { AppText, Surface } from '@/design-system/primitives';
import { shadowStyle, useTheme } from '@/design-system/theme';
import { motionEasing } from '@/design-system/theme/motion';
import { primitive } from '@/design-system/tokens/primitive.generated';
import { HerbImage } from './herb-image';
import {
  HERB_HERO_LUMA,
  HERO_PLACEHOLDER_CLOUD_ALPHA,
} from './herb-hero-luma.generated';

export type DailyHerbHeroProps = {
  /** Bitki kimliği — ölçülmüş metin emniyeti kaydını bulmak için. */
  herbId: string;
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
  /** Bağlam şeridinin sol yanı: tarih. */
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

const PARALLAX_SHIFT = primitive.space.s24;
const PARALLAX_INPUT = primitive.space.s96 * 2;
const BREATH_MS = primitive.motionLimits.ambientMinMs;
const BREATH_MIN = primitive.opacity.pulse;
const TRANSPARENT = primitive.color.scrim.transparent;

const ATM = primitive.material.heroAtmosphere;
const SAFETY = primitive.material.heroTextSafety;

/** Yüzde dizgesi — SVG objectBoundingBox koordinatları. */
function pct(value: number): string {
  return `${value * 100}%`;
}

/**
 * Bitkinin ölçülmüş bulut gücü. Kayıt yoksa (yeni görsel, ya da görselsiz
 * bitki) EN GÜVENLİ tarafa düşer: yer tutucu için çözülen alfa. Sessizce
 * emniyetsiz kalmaz.
 */
export function resolveCloudAlpha(herbId: string, hasImage: boolean): number {
  if (!hasImage) return HERO_PLACEHOLDER_CLOUD_ALPHA;
  const record = HERB_HERO_LUMA[herbId];
  if (!record) return HERO_PLACEHOLDER_CLOUD_ALPHA;
  return record.needsCloud ? record.cloudAlpha : 0;
}

export function DailyHerbHero({
  herbId,
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

  const cloudAlpha = resolveCloudAlpha(herbId, Boolean(imagePath && imageVersion));

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

      {/* 3 + 5 · Vinyet ve (gerekiyorsa) adaptif bulut — tek SVG katmanında. */}
      <View pointerEvents="none" style={styles.fillAbsolute}>
        <Svg width="100%" height="100%">
          <Defs>
            {/* Vinyet: ortası şeffaf, kenarlara doğru koyulaşan elips. */}
            <RadialGradient
              id="heroVignette"
              cx={pct(ATM.vignetteCenterX)}
              cy={pct(ATM.vignetteCenterY)}
              r={pct(ATM.vignetteRadius)}>
              <Stop offset={String(ATM.vignetteStop0)} stopColor={ATM.vignetteInner} />
              <Stop offset={String(ATM.vignetteStop1)} stopColor={ATM.vignetteMid} />
              <Stop offset="1" stopColor={ATM.vignetteOuter} />
            </RadialGradient>
            {/* Adaptif bulut: sol-alt merkezli, kenarları tamamen yumuşak. */}
            <RadialGradient
              id="heroCloud"
              cx={pct(SAFETY.cloudCenterX)}
              cy={pct(SAFETY.cloudCenterY)}
              r={pct(SAFETY.cloudRadius)}>
              <Stop offset="0" stopColor={SAFETY.cloudColor} stopOpacity={cloudAlpha} />
              <Stop
                offset={String(SAFETY.cloudStopMid)}
                stopColor={SAFETY.cloudColor}
                stopOpacity={cloudAlpha * SAFETY.cloudMidRatio}
              />
              <Stop offset="1" stopColor={SAFETY.cloudColor} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#heroVignette)" />
          {cloudAlpha > 0 ? (
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#heroCloud)" />
          ) : null}
        </Svg>
      </View>

      {/* 4 · Lila sis: tüm hero üstünde ince düz katman. */}
      <View
        pointerEvents="none"
        style={[styles.fillAbsolute, { backgroundColor: ATM.lilacMist }]}
      />

      {/* 6 · Altın ışık huzmesi: üst köşeden radyal yayılır, nefes alır. */}
      <Animated.View pointerEvents="none" style={[styles.fillAbsolute, breathStyle]}>
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="heroGoldShaft" cx="82%" cy="-4%" r="98%">
              <Stop offset="0" stopColor={colors.glow.ceremonial.color} />
              <Stop offset="0.38" stopColor={colors.glow.ambientWarm.color} />
              <Stop offset="1" stopColor={TRANSPARENT} />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#heroGoldShaft)" />
        </Svg>
      </Animated.View>

      {/* Bağlam şeridi: tarih + ay çipi — görselden BAĞIMSIZ, sabit koyu-altın. */}
      {dateLabel || moonChip ? (
        <View style={styles.contextStrip} pointerEvents="none">
          {dateLabel ? <HeroChip>{dateLabel}</HeroChip> : <View />}
          {moonChip}
        </View>
      ) : null}

      {/* Adlar doğrudan atmosferin üstünde — gölge ile emniyetli. */}
      <View style={styles.names} pointerEvents="none">
        <AppText
          variant="displayHero"
          numberOfLines={2}
          style={[{ color: colors.text.onPanel }, heroTextShadow]}>
          {commonName}
        </AppText>
        <AppText
          variant="scientificName"
          numberOfLines={1}
          style={[{ color: colors.text.onPanelAccent }, heroTextShadow]}>
          {scientificName}
        </AppText>
      </View>
    </AnimatedPressable>
  );
}

/**
 * Hero bağlam şeridi kabuğu — koyu-altın metin, aynı tonda hairline, açık-altın
 * yüzey. Yüzey BEYAZ DEĞİLDİR (ürün sahibi kuralı): altın ailesinin açık ucu.
 * Yüzey olmadan koyu-altın metin fotoğraf üstünde 2.6:1'de kalıyordu (ölçüldü);
 * yüzeyle 4.7:1 — görselden bağımsız ve sabit.
 */
export function HeroChip({ children }: { children: React.ReactNode }) {
  return (
    <Surface role="canvas" radius="full" style={chipStyles.chip}>
      {typeof children === 'string' ? (
        <AppText variant="uiLabel" style={chipStyles.label}>
          {children}
        </AppText>
      ) : (
        children
      )}
    </Surface>
  );
}

/** Ay çipi — HeroChip kabuğu, içinde glif + metin. */
export function HeroMoonChip({ children }: { children: React.ReactNode }) {
  return (
    <Surface role="canvas" radius="full" style={[chipStyles.chip, chipStyles.row]}>
      {children}
    </Surface>
  );
}

/** Hero metin gölgesi (kabul kriteri emniyet katmanı 1). */
const heroTextShadow: TextStyle = {
  textShadowColor: SAFETY.shadowColor,
  textShadowOffset: { width: 0, height: SAFETY.shadowOffsetY },
  textShadowRadius: SAFETY.shadowRadius,
};

/** Çip metni — sabit koyu-altın (görsele göre değişmez). */
export const heroChipTextColor = primitive.material.heroChip.text;

const chipStyles = {
  chip: {
    backgroundColor: primitive.material.heroChip.backing,
    borderWidth: primitive.borderWidth.thin,
    borderColor: primitive.material.heroChip.hairline,
    paddingHorizontal: primitive.space.s12,
    paddingVertical: primitive.space.s4,
  } satisfies ViewStyle,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: primitive.space.s4,
  } satisfies ViewStyle,
  label: { color: primitive.material.heroChip.text } satisfies TextStyle,
};

const styles = {
  panel: {
    borderBottomLeftRadius: primitive.layout.heroRadius,
    borderBottomRightRadius: primitive.layout.heroRadius,
    overflow: 'hidden',
    justifyContent: 'space-between',
  } satisfies ViewStyle,
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
};
