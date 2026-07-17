/**
 * StateScaffold — Empty/Error/Offline durum bileşenlerinin ortak iskeleti
 * (Design §35-38 ortak düzeni). Dışa AÇIK DEĞİL; üç sarmalayıcıdan kullanılır.
 *
 * Yapı: dekoratif ikon → başlık (a11y header) → destek metni → ek slot →
 * birincil/ikincil eylem → rozet. Metin PROP'la gelir (bileşen microcopy
 * üretmez); yatay boşluk genişlik sınıfından (§13.3). İzole render edilebilir.
 */

import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useWidthClass } from '../../hooks';
import { Icon, Surface, Text, type IconName } from '../../primitives';
import { Button } from '../button';

export type StateAction = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export type StateScaffoldProps = {
  icon: IconName;
  title: string;
  description?: string;
  /** Birincil eylem (primary Button). */
  action?: StateAction;
  /** İkincil eylem (ghost Button). */
  secondaryAction?: StateAction;
  /** Rozet pili (ör. mevcut "yakında ✨"). */
  badge?: string;
  /** Ek detay slotu (ör. ErrorState'in dev-only teknik detayı). */
  children?: ReactNode;
  /** Android ekran okuyucu canlı bölge bildirimi (hata/çevrimdışı için). */
  live?: 'polite' | 'assertive';
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function StateScaffold({
  icon,
  title,
  description,
  action,
  secondaryAction,
  badge,
  children,
  live,
  style,
  testID,
}: StateScaffoldProps) {
  const { horizontalMargin } = useWidthClass();

  return (
    <Surface
      role="canvas"
      accessibilityLiveRegion={live}
      testID={testID}
      style={[styles.container, { paddingHorizontal: horizontalMargin }, style]}>
      <Icon name={icon} size="xl" decorative />
      <Text role="heading.l" align="center">
        {title}
      </Text>
      {description ? (
        <Text role="body.m" tone="secondary" align="center" style={styles.description}>
          {description}
        </Text>
      ) : null}
      {children}
      {action ? (
        <Button
          label={action.label}
          variant="primary"
          onPress={action.onPress}
          loading={action.loading}
          disabled={action.disabled}
          style={styles.action}
        />
      ) : null}
      {secondaryAction ? (
        <Button
          label={secondaryAction.label}
          variant="ghost"
          onPress={secondaryAction.onPress}
          loading={secondaryAction.loading}
          disabled={secondaryAction.disabled}
        />
      ) : null}
      {badge ? (
        <Surface role="card" radius="full" style={styles.badge}>
          <Text role="label" tone="secondary">{badge}</Text>
        </Surface>
      ) : null}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  description: {
    maxWidth: 320,
  },
  action: {
    marginTop: Spacing.two,
  },
  badge: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
});
