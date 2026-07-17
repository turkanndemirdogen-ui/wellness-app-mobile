/**
 * Loader — spinner (Design §36: SON ÇARE; önce iskelet/ilerleme düşünülür).
 *
 * Erişilebilirlik: `label` verilirse progressbar rolü + busy durumuyla
 * duyurulur. Label için bağlamdaki MEVCUT (onaylı) metni geçir — burada yeni
 * microcopy üretilmez. Label'sız kullanımda (ör. Button içinde — busy'yi
 * Button duyurur) a11y ağacından gizlenir; çifte duyuru olmaz.
 *
 * İzole render edilebilir: yalnız prop + token + (default'lu) tema bağlamı.
 */

import { ActivityIndicator } from 'react-native';

import { useTheme } from '../theme';

export type LoaderProps = {
  size?: 'small' | 'large';
  /** Ekran okuyucu etiketi — bağlamdaki mevcut metin; yenisi üretilmez. */
  label?: string;
  /** Varsayılan: action.primary. */
  color?: string;
};

export function Loader({ size = 'small', label, color }: LoaderProps) {
  const { colors } = useTheme();

  return (
    <ActivityIndicator
      size={size}
      color={color ?? colors.action.primary}
      accessible={Boolean(label)}
      accessibilityRole={label ? 'progressbar' : undefined}
      accessibilityLabel={label}
      accessibilityState={label ? { busy: true } : undefined}
      accessibilityElementsHidden={!label}
      importantForAccessibility={label ? 'auto' : 'no-hide-descendants'}
    />
  );
}
