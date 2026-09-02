/**
 * HerbImage — bitki kartı Storage görseli (10 §10-§11; 07 §6 media slotu).
 *
 * URL kuralı (10 §10): TAM URL saklanmaz/yazılmaz; `image_path` botanicals
 * bucket-içi yoldur, public URL çalışma anında Storage SDK ile üretilir ve
 * cache anahtarı sürümü içerir (`?v=<image_version>`) — yeni sürüm yüklenince
 * istemci cache'i doğal geçer.
 *
 * Yer tutucu (10 §11 + 06 §5): görsel yoksa / Supabase yapılandırılmamışsa /
 * yükleme hata verirse yanlış görsel YERİNE nötr zemin + dal motifi
 * (HerbIllustration) + bilimsel ad + "bekliyor" etiketi. Etiket metin taşır —
 * durum yalnız renkle bildirilmez (15 §10). Koyu zemin/degrade YOK (15 §3:
 * koyuluk yalnız VisualPanel yüzeylerinde).
 *
 * İzole render edilebilir: yalnız prop + token + tema bağlamı. Supabase'e
 * dokunduğu için design-system'e değil domain-ui katmanına aittir (§49).
 */

import { useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';

import { supabase } from '@/lib/supabase';
import { AppText, Text } from '@/design-system/primitives';
import { primitive } from '@/design-system/tokens/primitive.generated';
import { useTheme } from '@/design-system/theme';
import { motionDurations } from '@/design-system/theme/motion';
import { HerbIllustration } from './herb-illustration';

/** Kart görsellerinin yaşadığı Storage bucket'ı (migration 0007 yorumu). */
export const HERB_IMAGE_BUCKET = 'botanicals';

export type HerbImageProps = {
  /** Bucket-içi yol (ör. "papatya/card-01.webp"); TAM URL DEĞİL (10 §10). */
  imagePath: string | null;
  /** Görsel sürümü; cache anahtarına girer. path ile birlikte dolar (0007). */
  imageVersion: number | null;
  /** Yer tutucuda gösterilecek bilimsel ad (Herb tipinde alan yok — prop'la gelir, 06 §4). */
  scientificName?: string;
  /**
   * Görselin erişilebilirlik etiketi. Verilmezse bileşen DEKORATİF sayılır ve
   * a11y ağacından gizlenir — adlar kartın kendi label'ında taşınır (07 §6).
   */
  accessibilityLabel?: string;
  /** Yer tutucu durum etiketi (TR). */
  pendingLabel?: string;
  /**
   * Yer tutucu içeriğinin hizası. Hero panelinde alt bölge cam plakayla
   * kaplandığı için 'top' verilir — durum metni plakanın altında kalmaz.
   */
  placeholderAlign?: 'center' | 'top';
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * path + version → public URL (+ `?v=` cache anahtarı). Path/version eksikse
 * ya da Supabase yapılandırılmamışsa null (çağıran yer tutucuya düşer).
 */
export function herbImagePublicUrl(
  imagePath: string | null,
  imageVersion: number | null,
): string | null {
  if (!imagePath || !imageVersion || imageVersion < 1 || !supabase) return null;
  const { data } = supabase.storage.from(HERB_IMAGE_BUCKET).getPublicUrl(imagePath);
  if (!data?.publicUrl) return null;
  return `${data.publicUrl}?v=${imageVersion}`;
}

export function HerbImage({
  imagePath,
  imageVersion,
  scientificName,
  accessibilityLabel,
  pendingLabel = 'Görsel doğrulama bekliyor',
  placeholderAlign = 'center',
  testID,
  style,
}: HerbImageProps) {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);

  const url = herbImagePublicUrl(imagePath, imageVersion);
  const decorative = !accessibilityLabel;

  if (url && !failed) {
    return (
      <View
        testID={testID}
        accessibilityElementsHidden={decorative}
        importantForAccessibility={decorative ? 'no-hide-descendants' : 'auto'}
        style={[styles.fill, style]}>
        <Image
          source={{ uri: url }}
          contentFit="cover"
          transition={motionDurations.component}
          onError={() => setFailed(true)}
          style={styles.fill}
          accessible={!decorative}
          accessibilityLabel={accessibilityLabel}
        />
      </View>
    );
  }

  // Yer tutucu (10 §11): nötr zemin + motif + bilimsel ad + bekliyor etiketi.
  return (
    <View
      testID={testID}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'auto'}
      accessible={!decorative}
      accessibilityLabel={
        decorative ? undefined : [accessibilityLabel, pendingLabel].filter(Boolean).join(', ')
      }
      style={[
        styles.fill,
        styles.placeholder,
        placeholderAlign === 'top' ? styles.placeholderTop : null,
        { backgroundColor: colors.surface.base },
        style,
      ]}>
      <HerbIllustration />
      {scientificName ? (
        <AppText variant="scientificName" tone="secondary" align="center" style={styles.scientific}>
          {scientificName}
        </AppText>
      ) : null}
      <Text role="caption" tone="secondary" align="center">
        {pendingLabel}
      </Text>
    </View>
  );
}

const styles = {
  fill: {
    width: '100%',
    height: '100%',
  } satisfies ViewStyle,
  placeholderTop: {
    justifyContent: 'flex-start',
  } satisfies ViewStyle,
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: primitive.space.s12,
    paddingVertical: primitive.space.s12,
  } satisfies ViewStyle,
  scientific: {
    marginTop: primitive.space.s4,
  } as const,
};
