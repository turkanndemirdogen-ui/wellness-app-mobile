/**
 * VisualPanel — koyuluğun İZİNLİ TEK taşıyıcısı (15 §3-4, §10).
 *
 * Koyu renkler (visualPanels token'ları) yalnız bu bileşenin içinde yaşar:
 * hero görsel paneli, ritual cover, astrology chart, garden dusk vignette,
 * night illustration, modal görsel alanı, image-backed teaser. Ana screen
 * background ASLA olamaz (ScreenShell + token-gate reddeder).
 *
 * Scrim ZORUNLU (15 §10): koyu panel üstündeki içerik okunabilirliği için
 * alt kenardan yükselen karartma degradesi her zaman çizilir.
 * Atmosfer: zemin rengi AtmosphereProvider'dan gelir — gündüz/fixedLight'ta
 * panel açık kalır, akşam kendi koyu dünyasına geçer.
 */

import { LinearGradient } from 'expo-linear-gradient';
import { View, type ViewProps } from 'react-native';

import { useAtmosphere, type PanelKind } from '../theme/atmosphere-provider';
import { primitive } from '../tokens/primitive.generated';

export type VisualPanelProps = ViewProps & {
  /** Panel türü — zemin visualPanels token'ından (atmosfer evresine göre). */
  kind: PanelKind;
  /** Köşe yuvarlaklığı; varsayılan hero radius (15 §6). */
  radius?: number;
  minHeight?: number;
};

// Scrim durakları: şeffaf → yarı saydam koyu (üstte içerik/metin okunur kalır).
const SCRIM_COLORS = [primitive.color.scrim.transparent, primitive.color.scrim.soft] as const;

export function VisualPanel({
  kind,
  radius = primitive.layout.heroRadius,
  minHeight,
  style,
  children,
  ...rest
}: VisualPanelProps) {
  const { panelBackground } = useAtmosphere();

  return (
    <View
      style={[
        {
          backgroundColor: panelBackground(kind),
          borderRadius: radius,
          overflow: 'hidden',
          minHeight,
        },
        style,
      ]}
      {...rest}>
      {children}
      {/* Scrim zorunlu (15 §10) — dekoratif, dokunuşları geçirir. */}
      <LinearGradient
        colors={SCRIM_COLORS}
        pointerEvents="none"
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '45%' }}
      />
    </View>
  );
}
