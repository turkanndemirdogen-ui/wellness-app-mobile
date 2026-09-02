/**
 * Card — çekirdek bileşen (Design §25, §29).
 *
 * §25 kuralları API ile ZORLANIR (konvansiyonla değil):
 * - İçerik sırası sabit: header → content (children) → media → footer. Slotlar
 *   ayrı prop'lardır; sıralamayı çağıran değiştiremez.
 * - İç içe kart YASAK — context ile geliştirme sırasında yakalanır.
 * - Basılabilirse TÜM yüzey basılır (küçük hassas iç hedef yok); basılı geri
 *   bildirim usePressFeedback'ten (reduced-motion'da opacity'ye düşer).
 * - Zemin ("Büyülü" yönü, 2026-09-02): standart kart artık HAFİF ŞEFFAF beyaz
 *   (glass mist tint'i) ve kenarı İNCE ALTIN saç çizgisi — zemin tonlaması
 *   kartın altından hafifçe okunur, kart düz beyaz dikdörtgen olmaz. Derinlik
 *   04 §9'un token gölgesinden gelir (standart `soft`, hero `card`).
 *   `parchment` tonunda ayrıca kâğıt taneciği görünür (04 §17.2 parchment).
 *   Renkli/sert gölge yok.
 */

import { createContext, useContext, type ReactNode } from 'react';
import { Image, View, type ImageStyle, type StyleProp, type ViewStyle } from 'react-native';

import { primitive } from '../tokens/primitive.generated';
import { shadowStyle, useTheme } from '../theme';
import { AnimatedPressable, usePressFeedback } from './use-press-feedback';

const InsideCard = createContext(false);

/** Kâğıt taneciği — parşömen tonundaki editoryal kartlarda (04 §17.2). */
const GRAIN = require('../../assets/textures/grain.png');

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
  /** true → hero/vurgu kartı: daha derin gölge (04 §9.3 `card`). */
  hero?: boolean;
  /**
   * Yüzey tonu (01 §11.3 kart çeşitliliği): `card` beyaz standart yüzey ·
   * `quiet` sessiz yardımcı yüzey · `parchment` editoryal kâğıt (söz, günlük,
   * uzun okuma). Kartlar yalnız RENKLE değil malzemeyle ayrışır; parşömen ve
   * sessiz yüzeylerde gölge yok, tanım kenardan gelir (04 §12.2).
   */
  tone?: 'card' | 'quiet' | 'parchment';
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
  tone = 'card',
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
      {tone === 'parchment' ? (
        <Image
          source={GRAIN}
          resizeMode="repeat"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[grainOverlay, { opacity: colors.texture.parchment }]}
        />
      ) : null}
      {header ? <View style={slotStyles.row}>{header}</View> : null}
      {children ? <View style={slotStyles.content}>{children}</View> : null}
      {media ? <View>{media}</View> : null}
      {footer ? <View style={slotStyles.row}>{footer}</View> : null}
    </InsideCard.Provider>
  );

  const flat = tone !== 'card';
  const containerStyle = [
    baseContainer,
    {
      backgroundColor:
        tone === 'parchment'
          ? colors.surface.parchment
          : tone === 'quiet'
            ? colors.surface.selected
            : // Standart kart: hafif şeffaf beyaz — zemin altından okunur.
              colors.surface.glassMist,
      // Altın saç çizgisi standart ve parşömen kartlarda; sessiz yüzey
      // mürekkep kenarında kalır (yardımcı yüzey öne çıkmaz).
      borderColor: tone === 'quiet' ? colors.border.soft : colors.border.gold,
    },
    // 04 §9.3/§12.2: standart kart `soft`, hero en fazla `card`; sessiz ve
    // parşömen yüzeyler gölgesizdir (tanım kenardan gelir).
    flat ? null : shadowStyle(hero ? 'card' : 'soft'),
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
  borderWidth: primitive.borderWidth.thin,
  overflow: 'hidden',
};

/** Doku katmanı içeriğin ARKASINDA kalır — metnin altında görünmez (04 §17.3). */
const grainOverlay: ImageStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
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
