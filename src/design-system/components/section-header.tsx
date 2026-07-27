/**
 * SectionHeader — ekran içi bölüm başlığı (07 §3). Başlık (sectionTitle, header
 * rolü) + opsiyonel yardımcı metin + opsiyonel sağ eylem (ör. "Tümü").
 * Presentational; microcopy PROP'la gelir.
 */

import { View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '../primitives';
import { primitive } from '../tokens/primitive.generated';
import { HeaderAction, type HeaderActionProps } from './app-header';

export type SectionHeaderProps = {
  title: string;
  /** Opsiyonel açıklama satırı (title altı, secondary tone). */
  subtitle?: string;
  /** Opsiyonel sağ eylem (metin ya da ikon). */
  action?: HeaderActionProps;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

export function SectionHeader({ title, subtitle, action, testID, style }: SectionHeaderProps) {
  return (
    <View testID={testID} style={[container, style]}>
      <View style={titleColumn}>
        <AppText variant="sectionTitle">{title}</AppText>
        {subtitle ? (
          <AppText variant="uiCaption" tone="secondary">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {action ? <HeaderAction {...action} /> : null}
    </View>
  );
}

const container: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: primitive.space.s12,
};

const titleColumn: ViewStyle = { flex: 1, gap: primitive.space.s2 };
