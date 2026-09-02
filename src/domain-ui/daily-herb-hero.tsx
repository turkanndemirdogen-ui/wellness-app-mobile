/**
 * DailyHerbHero — Ana Sayfa hero'su: bitki görseli + altında krem künye şeridi.
 *
 * KATMANSIZ YÖN (ürün sahibi kararı, 2026-09-02): görselin ÜSTÜNDE hiçbir
 * katman yok. Kaldırılanlar: vinyet radyali, lila sis, radyal altın ışık
 * huzmesi, adaptif metin-arkası bulut ve metin gölgeleri. Hero artık bitki
 * fotoğrafının kendisidir.
 *
 * YERLEŞİM:
 *   1. Görsel — tam genişlik, ekranın üst ~%30'u, KÖŞE YUVARLAMASI YOK.
 *      Durum çubuğunun altından başlar: üstünde scrim olmadığı için ikonların
 *      fotoğrafa binmesi okunurluğu bozardı.
 *   2. Krem şerit — görselin hemen altında opak açık krem bant:
 *      tarih + ay çipi (koyu-altın, hairline) · bitki adı Cinzel koyu patlıcan ·
 *      bilimsel ad Jost italik açık mor. Metin fotoğrafın üstünde olmadığı için
 *      kontrast görselden TAMAMEN bağımsız ve token seviyesinde doğrulanmış
 *      (hero-strip-contrast testi).
 *
 * HAREKET: yalnız paralaks — görsel scroll'dan yavaş kayar (§17). Bu bir ışık
 * ya da karartma katmanı değil, uzamsal ilişki. Reduced-motion / düşük güçte
 * tamamen durur (§19). Ekran bütçesi: ambient katman + hero = 2 (15 §9).
 *
 * KOYULUK: bu bileşen artık HİÇ koyu değer kullanmaz. 15 §3'ün "koyuluk yalnız
 * VisualPanel'de" kuralı hero için de aynen geçerlidir (bkz. 15 EK-D).
 *
 * KİLİTLER: bilimsel ad hiçbir hâlde gizlenmez (07 §6 · 12 §F). Panel bir bütün
 * olarak basılır (§25). İzole render edilebilir: yalnız prop + token + tema.
 */

import { View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { AnimatedPressable, usePressFeedback } from '@/design-system/components/use-press-feedback';
import { useMotionScale } from '@/design-system/hooks';
import { AppText, Surface } from '@/design-system/primitives';
import { primitive } from '@/design-system/tokens/primitive.generated';
import { HerbImage } from './herb-image';

export type DailyHerbHeroProps = {
  /** Yaygın ad — şeridin tek büyük serifi (03 §7.1 hero title). */
  commonName: string;
  /** Bilimsel ad — italik, asla gizlenmez (07 §6). */
  scientificName: string;
  /** Storage bucket-içi görsel yolu (10 §10). */
  imagePath: string | null;
  imageVersion: number | null;
  /** Görsel yüksekliği — ekranın üst ~%30'u (çağıran hesaplar). */
  imageHeight: number;
  /** Görselin üstünde bırakılacak güvenli alan payı (durum çubuğu). */
  topInset?: number;
  /** Krem şeridin sol yanı: tarih. */
  dateLabel?: string;
  /** Krem şeridin sağ yanı: ay çipi içeriği (glif + metin). */
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

const STRIP = primitive.material.heroStrip;
const CHIP = primitive.material.heroChip;

export function DailyHerbHero({
  commonName,
  scientificName,
  imagePath,
  imageVersion,
  imageHeight,
  topInset = 0,
  dateLabel,
  moonChip,
  scrollY,
  onPress,
  accessibilityLabel,
  testID,
  style,
}: DailyHerbHeroProps) {
  const motionScale = useMotionScale();
  const { animatedStyle, onPressIn, onPressOut } = usePressFeedback();

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
      style={[{ paddingTop: topInset }, animatedStyle, style]}>
      {/* 1 · Görsel — köşesiz, tam genişlik, üstünde hiçbir katman yok.
          Kayma payı kadar taşan bir kap içinde: paralaksta kenar açılmaz. */}
      <View style={[styles.imageWindow, { height: imageHeight }]}>
        <Animated.View style={[styles.imageLayer, parallaxStyle]}>
          <HerbImage imagePath={imagePath} imageVersion={imageVersion} />
        </Animated.View>
      </View>

      {/* 2 · Krem künye şeridi — opak yüzey; kontrast görselden bağımsız. */}
      <View style={[styles.strip, { backgroundColor: STRIP.background }]}>
        {dateLabel || moonChip ? (
          <View style={styles.contextStrip}>
            {dateLabel ? <HeroChip>{dateLabel}</HeroChip> : <View />}
            {moonChip}
          </View>
        ) : null}
        <AppText variant="displayHero" numberOfLines={2} style={{ color: STRIP.plantName }}>
          {commonName}
        </AppText>
        <AppText
          variant="scientificName"
          numberOfLines={1}
          style={{ color: STRIP.scientific }}>
          {scientificName}
        </AppText>
      </View>
    </AnimatedPressable>
  );
}

/**
 * Hero künye şeridi çipi — koyu-altın metin, aynı tonun %45'inde hairline.
 * Beyaz çip kullanılmaz (ürün sahibi kuralı); zemin krem şeridin kendisidir.
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

/** Çip metni — sabit koyu-altın (görsele göre değişmez). */
export const heroChipTextColor = CHIP.text;

const chipStyles = {
  chip: {
    backgroundColor: CHIP.backing,
    borderWidth: primitive.borderWidth.thin,
    borderColor: CHIP.hairline,
    paddingHorizontal: primitive.space.s12,
    paddingVertical: primitive.space.s4,
  } satisfies ViewStyle,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: primitive.space.s4,
  } satisfies ViewStyle,
  label: { color: CHIP.text } satisfies TextStyle,
};

const styles = {
  // Görsel penceresi: köşe yuvarlaması YOK; paralaks taşmasını kırpar.
  imageWindow: {
    overflow: 'hidden',
  } satisfies ViewStyle,
  imageLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -PARALLAX_SHIFT,
    bottom: -PARALLAX_SHIFT,
  } satisfies ViewStyle,
  strip: {
    paddingHorizontal: primitive.layout.screenPadding,
    paddingTop: primitive.space.s16,
    paddingBottom: primitive.space.s20,
    gap: primitive.space.s4,
  } satisfies ViewStyle,
  contextStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: primitive.space.s8,
    marginBottom: primitive.space.s8,
  } satisfies ViewStyle,
};
