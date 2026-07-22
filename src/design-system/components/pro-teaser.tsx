/**
 * ProTeaser — Free/Pro teaser CONTRACT'ı (15 §14; Phase 1 foundations).
 *
 * Kurallar (15 §14): İlk anlamlı sonuç ücretsizdir — sonucun tamamı
 * kilitlenemez (preview zorunlu ve boş olamaz); aynı viewportta maksimum 1
 * teaser; teaser ekranı domine etmez; CTA dürüst ve nettir; sahte blur ile
 * manipülasyon YOK (kilitli alan düz panel olarak gösterilir, sahte
 * bulanıklaştırılmış içerik render edilmez); Free/Pro farkı işlevsel açıklanır.
 *
 * Bu fazda PRODUCTION PAYWALL YOK: onPress üst katmandan gelir (Phase 6+);
 * tek tüketici dev-gallery'dir.
 */

import { Pressable, View } from 'react-native';

import { AppText } from '../primitives/app-text';
import { primitive } from '../tokens/primitive.generated';

export type ProTeaserProps = {
  title: string;
  /** Free önizleme — ZORUNLU ve boş olamaz ("tamamı kilitlenemez"). */
  preview: string;
  lockedDetailCount?: number;
  ctaLabel: string;
  /** true → kilitli alan koyu görsel panel zemininde (image-backed teaser). */
  visualPanel?: boolean;
  onPress?: () => void;
};

/** Contract denetimi — testler ve tüketiciler için (sahte-kilit koruması). */
export function validateProTeaserProps(props: Pick<ProTeaserProps, 'preview' | 'ctaLabel'>): boolean {
  return props.preview.trim().length > 0 && props.ctaLabel.trim().length > 0;
}

const t = primitive.proTeaser;

export function ProTeaser({
  title,
  preview,
  lockedDetailCount,
  ctaLabel,
  visualPanel = false,
  onPress,
}: ProTeaserProps) {
  if (__DEV__ && !validateProTeaserProps({ preview, ctaLabel })) {
    console.warn('[ProTeaser] preview/ctaLabel boş olamaz — sonucun tamamı kilitlenemez (15 §14)');
  }

  return (
    <View
      style={{
        backgroundColor: t.background,
        borderColor: t.border,
        borderWidth: primitive.borderWidth.thin,
        borderRadius: t.radius,
        padding: t.padding,
        gap: t.gap,
      }}>
      <AppText variant="sectionTitle">{title}</AppText>
      <AppText variant="uiBody" tone="secondary">
        {preview}
      </AppText>
      {lockedDetailCount != null && lockedDetailCount > 0 ? (
        <View
          style={{
            backgroundColor: visualPanel ? t.lockedPanel : t.background,
            borderColor: t.border,
            borderWidth: primitive.borderWidth.thin,
            borderRadius: t.radius,
            padding: t.padding,
          }}>
          <AppText
            variant="uiLabel"
            style={visualPanel ? { color: primitive.color.chrome.surface } : undefined}>
            +{lockedDetailCount} derin içgörü Pro ile açılır
          </AppText>
        </View>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={ctaLabel}
        onPress={onPress}
        style={{
          minHeight: primitive.layout.buttonHeight,
          borderRadius: t.radius,
          borderWidth: primitive.borderWidth.thin,
          borderColor: t.accent,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AppText variant="uiButton" style={{ color: t.accent }}>
          {ctaLabel}
        </AppText>
      </Pressable>
    </View>
  );
}
