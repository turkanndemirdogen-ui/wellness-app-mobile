/**
 * InlineNotice — satır içi bildirim (07 feedback · 08 §12). Tam ekran DEĞİL;
 * form/kart yanında kısa uyarı. Ton = ikon + renk + metin (renk-tek-kanal
 * DEĞİL, 15 §10). Microcopy PROP'la gelir (component üretmez).
 *
 * Ton→renk mevcut semantic'e eşlenir (yeni token üretilmez, governance §7):
 * info→secondary, success→accent (action.primary), warning/error→danger. Uyarı
 * ve hata aynı danger tonunu paylaşır; ayrım ikon+metinledir (token boşluğu —
 * ayrı warning/success token'ı doc 02 güncellemesi + onay gerektirir).
 */

import { View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText, Icon, type IconName } from '../primitives';
import { primitive } from '../tokens/primitive.generated';
import { useTheme } from '../theme';

export type InlineNoticeTone = 'info' | 'success' | 'warning' | 'error';

export type InlineNoticeProps = {
  tone?: InlineNoticeTone;
  message: string;
  /** Opsiyonel başlık (message üstünde, ağırlıklı). */
  title?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

export function InlineNotice({ tone = 'info', message, title, testID, style }: InlineNoticeProps) {
  const { colors } = useTheme();

  const toneMap: Record<InlineNoticeTone, { icon: IconName; color: string; live: 'polite' | 'assertive' }> = {
    info: { icon: 'info', color: colors.text.secondary, live: 'polite' },
    success: { icon: 'check', color: colors.action.primary, live: 'polite' },
    warning: { icon: 'alert', color: colors.action.destructive, live: 'polite' },
    error: { icon: 'alert', color: colors.action.destructive, live: 'assertive' },
  };
  const t = toneMap[tone];

  return (
    <View
      testID={testID}
      accessibilityLiveRegion={t.live}
      style={[
        container,
        { backgroundColor: colors.surface.base, borderColor: t.color },
        style,
      ]}>
      <Icon name={t.icon} size="sm" decorative color={t.color} />
      <View style={textColumn}>
        {title ? (
          <AppText variant="uiLabel" style={{ color: t.color }}>
            {title}
          </AppText>
        ) : null}
        <AppText variant="uiCaption" tone="secondary">
          {message}
        </AppText>
      </View>
    </View>
  );
}

const container: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: primitive.space.s8,
  padding: primitive.space.s12,
  borderRadius: primitive.radius.md,
  borderWidth: primitive.borderWidth.thin,
};

const textColumn: ViewStyle = { flex: 1, gap: primitive.space.s2 };
