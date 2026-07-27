/**
 * Field — Input çekirdek iskeleti (Design 07 §10 · 04 §18). Dışa AÇIK DEĞİL;
 * TextField / TextArea / SearchField sarmalayıcılarından kullanılır.
 *
 * Sözleşme (07 §10): min yükseklik 48; label HER ZAMAN görünür (placeholder
 * label'ı değiştirmez); error = ikon + metin (renk-tek-kanal DEĞİL, 15 §10);
 * Dynamic Type ile büyür (metin kırpılmaz). Durum matrisi (04 §18): default
 * (soft kenar) · focus (2px strong kenar) · error (danger kenar+ikon+mesaj) ·
 * disabled (nötr + opacity, editable=false). Renkler semantic'ten, ölçüler
 * token'dan; microcopy PROP'la gelir (component Türkçe metin üretmez).
 */

import { useState } from 'react';
import {
  TextInput,
  View,
  type KeyboardTypeOptions,
  type ReturnKeyTypeOptions,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { AppText, Icon, type IconName } from '../primitives';
import { primitive } from '../tokens/primitive.generated';
import { useTheme } from '../theme';
import { IconButton } from './button';

export type FieldProps = {
  /** Görünür label (07 §10 — placeholder label yerine geçmez). */
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /** Dolu ise error durumu: danger kenar + ikon + bu mesaj (04 §18.6). */
  error?: string;
  disabled?: boolean;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onSubmitEditing?: () => void;
  /** Ekran okuyucu adı; verilmezse label. */
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

type InternalProps = FieldProps & {
  /** Çok satır (TextArea). */
  multiline?: boolean;
  /** Baş ikon (SearchField 'search'). */
  leading?: IconName;
  /** Temizle eylemi (SearchField); value doluyken 'close' düğmesi gösterir. */
  onClear?: () => void;
  /** Temizle düğmesi ekran okuyucu etiketi (Türkçe, çağırandan). */
  clearLabel?: string;
  /** Pill kenar (SearchField). Varsayılan input radius = md (12, 04 §8). */
  pill?: boolean;
  /** TextArea taban satır yüksekliği için minimum yükseklik override. */
  minHeight?: number;
};

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  disabled = false,
  keyboardType,
  returnKeyType,
  secureTextEntry,
  autoCapitalize,
  onSubmitEditing,
  accessibilityLabel,
  testID,
  style,
  multiline = false,
  leading,
  onClear,
  clearLabel,
  pill = false,
  minHeight,
}: InternalProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const hasError = Boolean(error);
  const borderColor = hasError
    ? colors.action.destructive
    : focused
      ? colors.border.strong
      : colors.border.subtle;

  const boxStyle: ViewStyle = {
    minHeight: minHeight ?? primitive.space.s48,
    borderWidth: focused ? primitive.borderWidth.focus : primitive.borderWidth.thin,
    borderColor,
    borderRadius: pill ? primitive.radius.full : primitive.radius.md,
    backgroundColor: colors.surface.base,
    paddingHorizontal: primitive.space.s16,
    paddingVertical: multiline ? primitive.space.s12 : 0,
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    gap: primitive.space.s8,
  };

  const inputStyle: TextStyle = {
    flex: 1,
    color: colors.text.primary,
    fontSize: primitive.typeVariant.uiBody.size,
    lineHeight: primitive.typeVariant.uiBody.lineHeight,
    paddingVertical: multiline ? 0 : primitive.space.s12,
    textAlignVertical: multiline ? 'top' : 'center',
  };

  const showClear = Boolean(onClear) && value.length > 0 && !disabled;

  return (
    <View style={[{ gap: primitive.space.s4 }, style]}>
      <AppText variant="uiLabel">{label}</AppText>

      <View style={[boxStyle, disabled ? { opacity: primitive.opacity.disabled } : null]}>
        {leading ? <Icon name={leading} size="sm" decorative color={colors.text.secondary} /> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.secondary}
          editable={!disabled}
          multiline={multiline}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityState={{ disabled }}
          testID={testID}
          style={inputStyle}
        />
        {showClear ? (
          <IconButton
            icon="close"
            label={clearLabel ?? label}
            variant="ghost"
            onPress={onClear}
            style={clearButton}
          />
        ) : null}
      </View>

      {hasError ? (
        <View style={errorRow} accessibilityLiveRegion="polite">
          <Icon name="alert" size="sm" decorative color={colors.action.destructive} />
          <AppText variant="uiCaption" style={{ color: colors.action.destructive }}>
            {error}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const errorRow: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: primitive.space.s4,
};

// Temizle düğmesi input kutusu içinde küçük hedef değil — 44 hedefi IconButton'da.
const clearButton: ViewStyle = {
  minHeight: primitive.space.s40,
  minWidth: primitive.space.s40,
  width: primitive.space.s40,
};
