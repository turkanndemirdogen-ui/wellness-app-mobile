import { StyleSheet, Text, View, useColorScheme } from 'react-native';

import { Colors, Spacing, Typography } from '@/constants/theme';

type Props = {
  emoji: string;
  title: string;
  subtitle: string;
};

/**
 * Base faz yer tutucu ekranı. Gerçek modül içeriği (Faz 6) buraya gelecek;
 * şimdilik sekmenin ayakta durduğunu gösteren nazik bir boş durum.
 */
export function EmptyScreen({ emoji, title, subtitle }: Props) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.title, Typography.heading, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      <View style={[styles.badge, { backgroundColor: colors.backgroundElement }]}>
        <Text style={[styles.badgeText, { color: colors.textSecondary }]}>yakında ✨</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 320,
  },
  badge: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
