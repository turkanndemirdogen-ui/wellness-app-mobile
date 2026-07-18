/**
 * HerbIllustration — B3 hero botanik illüstrasyon yuvası (ana-sayfa-spec B3:
 * "botanik illüstrasyon…"; Design §16.2 illustration language; §30 herbaryum
 * ailesi).
 *
 * Render mimarisi (Sprint 2.2A ①):
 * - `illus_ref` varlık haritasında eşleşirse paketlenmiş görsel (expo-image,
 *   sabit yükseklik → yerleşim varlıktan bağımsız).
 * - Eşleşme yoksa ÜRETİM-GÜVENLİ YER TUTUCU: pudra paletli, saf View'lerle
 *   çizilmiş tek dal motifi (organik asimetri; emoji/ikon-font YOK — §16.1).
 *   Nihai LoRA görselleri (illustrasyon-uretim-spec) geldiğinde yalnız varlık
 *   haritası dolar; bu bileşen ve ekran değişmez.
 *
 * Görsel metni engellemez (spec B3): yuva, kartın medya slotunda sabit
 * yükseklikte yaşar; metin alanına taşmaz. Dekoratiftir — bitki adı kartın
 * metninde taşınır, yuva erişilebilirlik ağacından gizlenir (§43.1).
 *
 * İzole render edilebilir: yalnız prop + token + tema bağlamı.
 */

import { View, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';

import { primitive } from '@/design-system/tokens/primitive.generated';
import { useTheme } from '@/design-system/theme';
import { motionDurations } from '@/design-system/theme/motion';
import { HERB_ILLUSTRATIONS } from './herb-illustration-assets';

export type HerbIllustrationProps = {
  /** Bitki verisindeki illüstrasyon referansı (`illus_ref`). */
  illusRef?: string | null;
};

/** Yuvanın sabit yüksekliği — iskelet/yerleşim eşleşmesi için dışa açık (§36). */
export const HERB_ILLUSTRATION_HEIGHT = primitive.space.s96;

const AREA_HEIGHT = HERB_ILLUSTRATION_HEIGHT;

export function HerbIllustration({ illusRef }: HerbIllustrationProps) {
  const { colors } = useTheme();
  const source = illusRef ? HERB_ILLUSTRATIONS[illusRef] : undefined;

  if (source != null) {
    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.area}>
        <Image
          source={source}
          contentFit="contain"
          transition={motionDurations.component}
          style={styles.image}
          accessible={false}
        />
      </View>
    );
  }

  // Yer tutucu motif: yumuşak daire zemin + tek dal (sap, iki yaprak, tomurcuk).
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.area}>
      <View style={[styles.backdrop, { backgroundColor: colors.surface.base }]}>
        <View style={styles.sprig}>
          <View style={[styles.bud, { backgroundColor: colors.surface.selected }]} />
          <View style={[styles.stem, { backgroundColor: colors.action.primary }]} />
          <View
            style={[
              styles.leaf,
              styles.leafRight,
              { backgroundColor: colors.action.primary },
            ]}
          />
          <View
            style={[
              styles.leaf,
              styles.leafLeft,
              { backgroundColor: colors.surface.selected },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = {
  area: {
    height: AREA_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,
  image: {
    width: '100%',
    height: AREA_HEIGHT,
  } satisfies ViewStyle,
  backdrop: {
    width: AREA_HEIGHT,
    height: AREA_HEIGHT,
    borderRadius: primitive.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,
  sprig: {
    width: primitive.space.s48,
    height: primitive.space.s64,
    alignItems: 'center',
  } satisfies ViewStyle,
  bud: {
    width: primitive.space.s12,
    height: primitive.space.s16,
    borderRadius: primitive.radius.full,
  } satisfies ViewStyle,
  stem: {
    flex: 1,
    width: primitive.space.s4,
    borderRadius: primitive.radius.full,
  } satisfies ViewStyle,
  leaf: {
    position: 'absolute',
    width: primitive.space.s24,
    height: primitive.space.s12,
    borderRadius: primitive.radius.full,
  } satisfies ViewStyle,
  // Organik asimetri (§16.2): yapraklar farklı yükseklik ve tonda.
  leafRight: {
    top: primitive.space.s16,
    left: '50%',
    transform: [{ rotate: '35deg' }],
  } satisfies ViewStyle,
  leafLeft: {
    top: primitive.space.s32,
    right: '50%',
    transform: [{ rotate: '-35deg' }],
  } satisfies ViewStyle,
};
