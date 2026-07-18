/**
 * Card — çekirdek bileşen (Design §25, §29).
 *
 * §25 kuralları API ile ZORLANIR (konvansiyonla değil):
 * - İçerik sırası sabit: header → content (children) → media → footer. Slotlar
 *   ayrı prop'lardır; sıralamayı çağıran değiştiremez.
 * - İç içe kart YASAK — context ile geliştirme sırasında yakalanır.
 * - Basılabilirse TÜM yüzey basılır (küçük hassas iç hedef yok); basılı geri
 *   bildirim usePressFeedback'ten (reduced-motion'da opacity'ye düşer).
 * - Zemin semantic surface.card; yükseklik elevation.level1 (standart kart,
 *   §14.3); köşe radius.lg. Renkli/sert gölge yok.
 */

import { createContext, useContext, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { primitive } from '../tokens/primitive.generated';
import { useTheme } from '../theme';
import { AnimatedPressable, usePressFeedback } from './use-press-feedback';

const InsideCard = createContext(false);

export type CardProps = {
  /** Üst slot: başlık satırı / rozetler. */
  header?: ReactNode;
  /** İçerik slotu. */
  children?: ReactNode;
  /** Opsiyonel medya slotu (illüstrasyon alanı — Faz 6). */
  media?: ReactNode;
  /** Alt slot: eylem/altbilgi. */
  footer?: ReactNode;
  /** Verilirse kartın TÜM yüzeyi basılır olur. */
  onPress?: () => void;
  /** true → hero/vurgu kartı: elevation level 2 (§14.3). Varsayılan level 1. */
  hero?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Card({
  header,
  children,
  media,
  footer,
  onPress,
  hero = false,
  disabled = false,
  accessibilityLabel,
  style,
  testID,
}: CardProps) {
  const insideCard = useContext(InsideCard);
  if (__DEV__ && insideCard) {
    console.warn('[Card] İç içe kart yasak (Design §25) — dış kartı bölmeyi düşün.');
  }

  const { colors } = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressFeedback();

  const slots = (
    <InsideCard.Provider value>
      {header ? <View style={slotStyles.row}>{header}</View> : null}
      {children ? <View style={slotStyles.content}>{children}</View> : null}
      {media ? <View>{media}</View> : null}
      {footer ? <View style={slotStyles.row}>{footer}</View> : null}
    </InsideCard.Provider>
  );

  const containerStyle = [
    baseContainer,
    { backgroundColor: colors.surface.card },
    hero ? { elevation: primitive.elevation.level2 } : null,
    disabled ? { opacity: primitive.opacity.disabled } : null,
    style,
  ];

  if (onPress) {
    return (
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        testID={testID}
        style={[containerStyle, animatedStyle]}>
        {slots}
      </AnimatedPressable>
    );
  }

  return (
    <View style={containerStyle} testID={testID}>
      {slots}
    </View>
  );
}

const baseContainer: ViewStyle = {
  borderRadius: primitive.radius.lg,
  padding: primitive.space.s16,
  gap: primitive.space.s4,
  // Android standart kart yüksekliği (level 1); iOS'ta ayrım tonal kontrastla
  // (§14.2 öncelik sırası) — sert/renkli gölge eklenmez.
  elevation: primitive.elevation.level1,
};

const slotStyles = {
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: primitive.space.s8,
  } satisfies ViewStyle,
  content: {
    gap: primitive.space.s4,
  } satisfies ViewStyle,
};
