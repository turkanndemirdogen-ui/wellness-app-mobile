/**
 * MoonPhaseGlyph — faz-özel ay glifi (Design §30 "MoonPhase" domain kategorisi;
 * ana-sayfa-spec B1: "çip: ay fazı glifi").
 *
 * İkon-font/emoji YOK (§16.1: emoji-as-icon yasak; minimal outline, tek stroke
 * ailesi). Glif saf View'lerle çizilir: ince çerçeveli daire + fazın aydınlık
 * yarısı. Dört kanonik faz (astro sözleşmesi): yeni · ilk_dordun · dolunay ·
 * son_dordun. Aydınlık yarım: büyüyen ay sağdan (ilk dördün sağ yarı), küçülen
 * soldan dolar.
 *
 * Dekoratiftir: fazın adı bağlamdaki görünür metinde taşınır (§43.1) — glif
 * erişilebilirlik ağacından gizlenir.
 *
 * İzole render edilebilir: yalnız prop + token + tema bağlamı.
 */

import { View, type ViewStyle } from 'react-native';

import { primitive } from '@/design-system/tokens/primitive.generated';
import { useTheme } from '@/design-system/theme';

/** Kanonik faz anahtarları — lib/astro DailyTransit['moonPhase'] ile aynı. */
export type MoonPhaseName = 'yeni' | 'ilk_dordun' | 'dolunay' | 'son_dordun';

export type MoonPhaseGlyphProps = {
  phase: MoonPhaseName;
  /** İkon boyutu token anahtarı (size.icon). */
  size?: keyof typeof primitive.size.icon;
};

export function MoonPhaseGlyph({ phase, size = 'sm' }: MoonPhaseGlyphProps) {
  const { colors } = useTheme();
  const d = primitive.size.icon[size];

  const disc: ViewStyle = {
    width: d,
    height: d,
    borderRadius: primitive.radius.full,
    borderWidth: primitive.borderWidth.thin,
    borderColor: colors.text.secondary,
    overflow: 'hidden',
    backgroundColor: phase === 'dolunay' ? colors.text.secondary : 'transparent',
  };

  // Dördünler: aydınlık yarım daire (ilk dördün sağda, son dördün solda).
  const half: ViewStyle | null =
    phase === 'ilk_dordun' || phase === 'son_dordun'
      ? {
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '50%',
          [phase === 'ilk_dordun' ? 'right' : 'left']: 0,
          backgroundColor: colors.text.secondary,
        }
      : null;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={disc}>
      {half ? <View style={half} /> : null}
    </View>
  );
}
