/**
 * ScreenShell — ScreenVisualSpec tüketen ekran kabuğu (15 §6).
 *
 * Ekranın zemin/padding/sectionGap değerlerini spec'ten TEK noktadan uygular ve
 * panel-only dark (visual panel) renklerini background olarak REDDEDER
 * (assertScreenSpec). Ayrıca spec'in `accentHex`'ini alt ağaca yayar (15 §6) —
 * ekranlar vurgu rengini kendileri seçmez, sözleşmelerinden alır.
 *
 * Yatay padding (08 §1 + 15 §6): compact cihazda `compactScreenPadding` (16),
 * diğerlerinde spec'in `horizontalPadding` değeri (20). NOT: hooks/
 * use-width-class'ın 20/24/32 marjları bu kanon değerleriyle çelişir; ekranlar
 * retrofit sırasında spec'e taşınır (VISUAL_TECH_DEBT).
 *
 * `background` slotu içeriğin ARKASINA serilir (AmbientBackground gibi
 * etkileşimsiz atmosfer katmanları için). Scroll yüzeyi Animated.ScrollView'dur
 * → paralaks/scroll bağlı ambient (Living World) ek sarmalayıcı istemez.
 */

import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { type AnimatedScrollViewProps } from 'react-native-reanimated';

import { useWidthClass } from '../hooks';
import { ScreenAccent } from '../theme';
import { primitive } from '../tokens/primitive.generated';
import { assertScreenSpec, type ScreenVisualSpec } from '../tokens/screen-specs';

export type ScreenShellProps = {
  spec: ScreenVisualSpec;
  /** true (varsayılan) → içerik scroll eder; false → düz View (ör. chat). */
  scroll?: boolean;
  /** İçeriğin arkasına serilen atmosfer katmanı (etkileşimsiz). */
  background?: ReactNode;
  /** Scroll konumu dinleyicisi (Reanimated worklet handler) — paralaks için. */
  onScroll?: AnimatedScrollViewProps['onScroll'];
  /** Aşağı çekip yenileme denetimi. */
  refreshControl?: AnimatedScrollViewProps['refreshControl'];
  /** İçerik kabının ek stili (dikey padding vb.). */
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  children?: ReactNode;
};

/**
 * Ekranın çözülmüş yatay padding'i. Tam genişlik (full-bleed) bir blok, bu
 * değer kadar NEGATİF yatay marj alarak kabuğun dışına taşar — iki yerde ayrı
 * sayı tutulmasın diye kaynak tek: burası.
 */
export function useScreenHorizontalPadding(spec: ScreenVisualSpec): number {
  const { widthClass } = useWidthClass();
  return widthClass === 'compact'
    ? primitive.layout.compactScreenPadding
    : spec.horizontalPadding;
}

export function ScreenShell({
  spec,
  scroll = true,
  background,
  onScroll,
  refreshControl,
  contentContainerStyle,
  style,
  testID,
  children,
}: ScreenShellProps) {
  assertScreenSpec(spec); // panel-dark background yasağı + motion sınırı
  const horizontalPadding = useScreenHorizontalPadding(spec);

  const containerStyle: ViewStyle = { flex: 1, backgroundColor: spec.backgroundHex };
  const contentStyle: ViewStyle = {
    paddingHorizontal: horizontalPadding,
    paddingTop: spec.topPadding,
    gap: spec.sectionGap,
  };

  const body = scroll ? (
    <Animated.ScrollView
      onScroll={onScroll}
      scrollEventThrottle={16}
      refreshControl={refreshControl}
      contentContainerStyle={[contentStyle, contentContainerStyle]}>
      {children}
    </Animated.ScrollView>
  ) : (
    <View style={[contentStyle, styles.flex, contentContainerStyle]}>{children}</View>
  );

  return (
    <ScreenAccent accentHex={spec.accentHex}>
      <View testID={testID} style={[containerStyle, style]}>
        {background}
        {body}
      </View>
    </ScreenAccent>
  );
}

const styles = { flex: { flex: 1 } satisfies ViewStyle };
