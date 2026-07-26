/**
 * LoadingState — ekran düzeyi yükleme durumu (07 §13 · 08 §12). Ortalanmış
 * Loader + opsiyonel görünür metin. Yükleme duyurusu Loader'ın progressbar
 * rolüyle taşınır (label verilirse). Microcopy PROP'la gelir.
 *
 * Not: yerinde/liste yüklemesi için Skeleton tercih edilir (§36 önceliği);
 * LoadingState ilk ekran/tam sayfa yükleme içindir.
 */

import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { AppText, Surface } from '../../primitives';
import { Loader } from '../loader';

export type LoadingStateProps = {
  /** Görünür + ekran okuyucuya duyurulan yükleme metni (TR, çağırandan). */
  label?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

export function LoadingState({ label, testID, style }: LoadingStateProps) {
  return (
    <Surface role="canvas" testID={testID} style={[styles.container, style]}>
      <Loader size="large" label={label} />
      {label ? (
        <AppText variant="uiBody" tone="secondary" align="center">
          {label}
        </AppText>
      ) : null}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
});
