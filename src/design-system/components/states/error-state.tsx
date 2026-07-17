/**
 * ErrorState — hata durumu (Design §37): ne oldu + (mümkünse) neden + nasıl
 * düzelir. HAM TEKNİK HATA METNİ KULLANICIYA GÖSTERİLMEZ — `technicalDetail`
 * yalnız geliştirme derlemesinde (__DEV__) görünür. Android'de canlı bölgeyle
 * duyurulur. Metin prop'la gelir — microcopy üretilmez.
 */

import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';
import { Surface, Text } from '../../primitives';
import { StateScaffold, type StateScaffoldProps } from './state-scaffold';

export type ErrorStateProps = Omit<StateScaffoldProps, 'live' | 'badge' | 'children'> & {
  /** Ham hata metni — YALNIZ __DEV__ derlemesinde gösterilir (§37). */
  technicalDetail?: string;
};

export function ErrorState({ technicalDetail, ...props }: ErrorStateProps) {
  return (
    <StateScaffold live="polite" {...props}>
      {__DEV__ && technicalDetail ? (
        <Surface role="card" radius="sm" style={styles.detail}>
          <Text role="caption" tone="secondary">{technicalDetail}</Text>
        </Surface>
      ) : null}
    </StateScaffold>
  );
}

const styles = StyleSheet.create({
  detail: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    maxWidth: 320,
  },
});
