/**
 * AppHeader + BackButton + HeaderAction — navigasyon başlığı parçaları (07 §3).
 *
 * Light-chrome kilidi (15 §3): başlık zemini daima navigation.background (sabit,
 * koyulaşmaz). Başlık tipografisi 03 (screenTitle/sectionTitle, header rolü
 * AppText'ten). Dokunma hedefi ≥44 (15 §10). Component Türkçe microcopy üretmez:
 * geri/eylem etiketleri PROP'la gelir (07 §15 — hard-coded TR copy yasak).
 * Presentational: route/navigasyon bağlamına bağlanmaz (Phase 4 wiring).
 */

import { Pressable, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { AppText, Icon, type IconName } from '../primitives';
import { primitive } from '../tokens/primitive.generated';
import { useTheme } from '../theme';

export type HeaderActionProps = {
  /** Zorunlu ekran okuyucu etiketi (Türkçe, çağırandan). */
  label: string;
  /** İkon eylemi (ör. 'search'). `text` ile birlikte kullanılmaz. */
  icon?: IconName;
  /** Metin eylemi (ör. "Tümü"). */
  text?: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
};

export function HeaderAction({ label, icon, text, onPress, disabled = false, testID }: HeaderActionProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={primitive.space.s4}
      testID={testID}
      style={[actionTarget, disabled ? { opacity: primitive.opacity.disabled } : null]}>
      {icon ? <Icon name={icon} decorative /> : null}
      {text ? (
        <AppText variant="uiButton" style={{ color: colors.action.ghost }}>
          {text}
        </AppText>
      ) : null}
    </Pressable>
  );
}

export type BackButtonProps = {
  onPress: () => void;
  /** Zorunlu Türkçe ekran okuyucu etiketi (ör. "Geri"). */
  label: string;
  disabled?: boolean;
  testID?: string;
};

export function BackButton({ onPress, label, disabled = false, testID }: BackButtonProps) {
  return <HeaderAction icon="back" label={label} onPress={onPress} disabled={disabled} testID={testID} />;
}

export type AppHeaderProps = {
  title: string;
  /** Verilirse solda geri düğmesi; `backLabel` zorunlu (TR). */
  onBack?: () => void;
  backLabel?: string;
  /** Sağ eylemler (0-2 önerilir). */
  actions?: HeaderActionProps[];
  /** true → büyük ekran başlığı (screenTitle); false → bölüm başlığı. */
  large?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

export function AppHeader({ title, onBack, backLabel, actions, large = true, testID, style }: AppHeaderProps) {
  const { colors } = useTheme();

  if (__DEV__ && onBack && !backLabel) {
    console.warn('[AppHeader] onBack verildiğinde backLabel (TR) zorunlu (07 §15/§43).');
  }

  return (
    <View
      testID={testID}
      style={[
        header,
        { backgroundColor: colors.navigation.background, borderBottomColor: colors.navigation.border },
        style,
      ]}>
      <View style={side}>
        {onBack ? <BackButton onPress={onBack} label={backLabel ?? ''} /> : null}
      </View>
      <AppText variant={large ? 'screenTitle' : 'sectionTitle'} numberOfLines={1} align="center" style={titleStyle}>
        {title}
      </AppText>
      <View style={[side, sideRight]}>
        {actions?.map((a, i) => <HeaderAction key={a.testID ?? `${a.label}-${i}`} {...a} />)}
      </View>
    </View>
  );
}

const actionTarget: ViewStyle = {
  minHeight: primitive.layout.touchTarget,
  minWidth: primitive.layout.touchTarget,
  paddingHorizontal: primitive.space.s8,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: primitive.space.s4,
};

const header: ViewStyle = {
  minHeight: primitive.space.s48,
  paddingHorizontal: primitive.layout.screenPadding,
  paddingVertical: primitive.space.s8,
  flexDirection: 'row',
  alignItems: 'center',
  gap: primitive.space.s8,
  borderBottomWidth: primitive.borderWidth.thin,
};

const side: ViewStyle = { minWidth: primitive.layout.touchTarget, flexDirection: 'row', alignItems: 'center' };
const sideRight: ViewStyle = { justifyContent: 'flex-end' };
const titleStyle: TextStyle = { flex: 1 };
