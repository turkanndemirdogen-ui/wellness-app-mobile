/**
 * Safety notice CONTRACT'ları (15 §11-13; Phase 1 foundations).
 *
 * Üç bilgilendirme bileşeni: sembolik bitki referansı, sağlık bilgisi
 * çerçevesi, astroloji yorumu çerçevesi. Metinler 15'in ZORUNLU kıldığı
 * kalıplardır (Safety otoritesi üstü kural); ek gövde metni Editorial onaylı
 * kaynaktan gelir. Bu fazda tek tüketici dev-gallery'dir.
 */

import { View, type ViewProps } from 'react-native';

import { AppText } from '../primitives/app-text';
import { primitive } from '../tokens/primitive.generated';

const chrome = primitive.color.chrome;

type NoticeProps = ViewProps & {
  /** Editorial onaylı ek açıklama (isteğe bağlı — zorunlu etiket her zaman çizilir). */
  detail?: string;
};

function NoticeFrame({ style, children, ...rest }: ViewProps) {
  return (
    <View
      accessibilityRole="text"
      style={[
        {
          backgroundColor: chrome.surfaceTint,
          borderColor: chrome.border,
          borderWidth: primitive.borderWidth.thin,
          borderRadius: primitive.layout.compactRadius,
          padding: primitive.layout.compactScreenPadding,
          gap: primitive.space.s4,
        },
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}

/**
 * 15 §11 zorunlu etiket — toksik/yüksek riskli türün SEMBOLİK gösterimi bu
 * bileşen olmadan render edilemez. Metin birebir kilitli.
 */
export function SymbolicReferenceNotice({ detail, ...rest }: NoticeProps) {
  return (
    <NoticeFrame {...rest}>
      <AppText variant="uiLabel">Tarihsel / sembolik referans</AppText>
      <AppText variant="uiCaption" tone="secondary">
        Kullanım önerisi değildir
      </AppText>
      {detail ? (
        <AppText variant="uiCaption" tone="secondary">
          {detail}
        </AppText>
      ) : null}
    </NoticeFrame>
  );
}

/** 15 §12 çerçevesi — bitki/cilt/döngü içeriği tıbbi kesinlik taşıyamaz. */
export function HealthInformationNotice({ detail, ...rest }: NoticeProps) {
  return (
    <NoticeFrame {...rest}>
      <AppText variant="uiLabel">Bilgilendirme</AppText>
      <AppText variant="uiCaption" tone="secondary">
        Bu içerik geleneksel ilişkilendirmeleri aktarır; tıbbi tavsiye değildir.
        Sağlık kararları için profesyonel değerlendirme gerekebilir.
      </AppText>
      {detail ? (
        <AppText variant="uiCaption" tone="secondary">
          {detail}
        </AppText>
      ) : null}
    </NoticeFrame>
  );
}

/** 15 §13 çerçevesi — astrolojik içerik yorumlayıcıdır, kesin öngörü değildir. */
export function AstrologyInterpretationNotice({ detail, ...rest }: NoticeProps) {
  return (
    <NoticeFrame {...rest}>
      <AppText variant="uiLabel">Yorum çerçevesi</AppText>
      <AppText variant="uiCaption" tone="secondary">
        Astrolojik içerik farkındalık amaçlı bir yorumdur; kesin öngörü değildir.
      </AppText>
      {detail ? (
        <AppText variant="uiCaption" tone="secondary">
          {detail}
        </AppText>
      ) : null}
    </NoticeFrame>
  );
}
