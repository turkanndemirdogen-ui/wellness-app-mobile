/**
 * ScreenShell — ScreenVisualSpec tüketen ekran kabuğu (15 §6; Phase 1 contract).
 *
 * Ekranın background/padding/sectionGap değerlerini spec'ten TEK noktadan
 * uygular; panel-only dark (visual panel) renklerini background olarak
 * REDDEDER (assertScreenSpec). Ekranlar Phase 4-5 retrofit'inde buna taşınır;
 * Phase 1'de tüketici yalnız dev-gallery'dir.
 */

import { ScrollView, View, type ViewProps } from 'react-native';

import { assertScreenSpec, type ScreenVisualSpec } from '../tokens/screen-specs';

export type ScreenShellProps = ViewProps & {
  spec: ScreenVisualSpec;
  /** true (varsayılan) → içerik ScrollView'da; false → düz View (ör. chat). */
  scroll?: boolean;
};

export function ScreenShell({ spec, scroll = true, style, children, ...rest }: ScreenShellProps) {
  assertScreenSpec(spec); // panel-dark background yasağı + motion sınırı

  const containerStyle = {
    flex: 1,
    backgroundColor: spec.backgroundHex,
  } as const;
  const contentStyle = {
    paddingHorizontal: spec.horizontalPadding,
    paddingTop: spec.topPadding,
    gap: spec.sectionGap,
  } as const;

  if (!scroll) {
    return (
      <View style={[containerStyle, contentStyle, style]} {...rest}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView style={[containerStyle, style]} contentContainerStyle={contentStyle} {...rest}>
      {children}
    </ScrollView>
  );
}
