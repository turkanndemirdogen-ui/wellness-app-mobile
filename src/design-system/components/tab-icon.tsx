/**
 * TabIcon + TabLabel — BottomNavigation kabuk parçaları (Design §29).
 *
 * Aktif durum RENK-TEK-KANAL DEĞİL (§33/§43): ikon opaklığı (opacity.inactive
 * token'ı) + etiket ağırlığı (aktifte heading ağırlığı) birlikte değişir; renk
 * tint'i navigasyon kütüphanesinden gelir.
 *
 * İzole render edilebilir: yalnız prop + token + (default'lu) tema bağlamı —
 * navigasyon bağlamı GEREKMEZ (color/focused düz prop'tur).
 */

import { Text as RNText, View, type ColorValue } from 'react-native';

import { Icon, type IconName } from '../primitives';
import { primitive } from '../tokens/primitive.generated';
import { textRoles } from '../theme/typography';
import { useTheme } from '../theme';

export type TabIconProps = {
  name: IconName;
  focused: boolean;
};

// İkon dekoratiftir — erişilebilir adı sekme etiketi taşır (§43.1).
export function TabIcon({ name, focused }: TabIconProps) {
  const { opacity } = useTheme();
  return (
    <View style={{ opacity: focused ? 1 : opacity.inactive }}>
      <Icon name={name} decorative />
    </View>
  );
}

export type TabLabelProps = {
  label: string;
  /** Tint — navigasyon kütüphanesinin aktif/pasif rengi. */
  color: ColorValue;
  focused: boolean;
};

export function TabLabel({ label, color, focused }: TabLabelProps) {
  return (
    <RNText
      numberOfLines={1}
      style={[
        textRoles.label,
        { color },
        // Aktif ağırlık token'dan (heading ağırlığı) — ikinci görsel kanal.
        focused
          ? { fontWeight: primitive.typography.heading.s.weight as '600' }
          : null,
      ]}>
      {label}
    </RNText>
  );
}
