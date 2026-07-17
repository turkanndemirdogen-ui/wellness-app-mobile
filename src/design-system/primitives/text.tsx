/**
 * Text — metin primitive'i (Design §28).
 *
 * Rol seti kanonik §12.2 rampasıdır; stiller theme/typography.ts üzerinden
 * token kaynağından gelir (tek değişim noktası). Renk yalnız semantic text
 * token'larından. Dynamic Type ile ölçeklenir (allowFontScaling varsayılanı
 * açık; sabit yükseklik kabı YOK — §43.2).
 *
 * RN Text ile ad çakışması §34 gereği tüketicide çözülür: bu modülden import
 * eden dosya RN Text'i kullanmaz (gerekirse `Text as RNText` takma adı).
 */

import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { textRoles, type TextRoleName } from '../theme/typography';
import { useTheme } from '../theme';

export type TextRole = TextRoleName;
export type TextTone = 'primary' | 'secondary';

// RN'in ARIA `role` prop'u bilinçli dışarıda bırakılır (Omit): buradaki `role`
// tipografik roldür; ekran okuyucu rolünü bileşen kendisi ayarlar (heading/
// display → accessibilityRole="header").
export type TextProps = Omit<RNTextProps, 'role'> & {
  role?: TextRole;
  tone?: TextTone;
  align?: 'left' | 'center';
};

export function Text({
  role = 'body.m',
  tone = 'primary',
  align = 'left',
  style,
  ...rest
}: TextProps) {
  const { colors } = useTheme();
  const color = tone === 'primary' ? colors.text.primary : colors.text.secondary;
  const isHeading = role.startsWith('heading') || role.startsWith('display');

  return (
    <RNText
      accessibilityRole={isHeading ? 'header' : undefined}
      style={[textRoles[role], { color, textAlign: align }, style]}
      {...rest}
    />
  );
}
