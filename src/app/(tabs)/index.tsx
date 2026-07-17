import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';

import { astro, type DailyTransit } from '@/lib/astro';
import { Spacing } from '@/constants/theme';
import { shellCopy } from '@/content/shell-copy';
import { Button, Card, Reveal, Skeleton } from '@/design-system/components';
import { useWidthClass } from '@/design-system/hooks';
import { Icon, Text } from '@/design-system/primitives';
import { useTheme } from '@/design-system/theme';

// Görüntüleme etiketleri (iç TR anahtar → başlık). UI Faz 6; burada minimal.
const SIGN_TR: Record<string, string> = {
  koc: 'Koç', boga: 'Boğa', ikizler: 'İkizler', yengec: 'Yengeç',
  aslan: 'Aslan', basak: 'Başak', terazi: 'Terazi', akrep: 'Akrep',
  yay: 'Yay', oglak: 'Oğlak', kova: 'Kova', balik: 'Balık',
};
const PHASE_TR: Record<DailyTransit['moonPhase'], string> = {
  yeni: 'Yeni Ay', ilk_dordun: 'İlk Dördün', dolunay: 'Dolunay', son_dordun: 'Son Dördün',
};

export default function AnaSayfaScreen() {
  const { colors } = useTheme();
  const { horizontalMargin } = useWidthClass();
  const router = useRouter();
  const [transit, setTransit] = useState<DailyTransit | null>(null);

  useEffect(() => {
    let alive = true;
    // Astro katmanını uçtan uca çağır: natal → günün transiti (şimdilik MOCK).
    (async () => {
      const natal = await astro.getNatalChart({ date: '2000-01-01', timeKnown: false });
      const today = new Date().toISOString().slice(0, 10);
      const t = await astro.getDailyTransit(natal, today);
      if (alive) setTransit(t);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface.canvas, paddingHorizontal: horizontalMargin },
      ]}>
      <Icon name="moon" size="xl" decorative />
      <Text role="heading.l" align="center">Ana Sayfa</Text>
      <Text role="body.m" tone="secondary" align="center" style={styles.subtitle}>
        {shellCopy.anaSayfa.subtitle}
      </Text>

      {/* Astro wiring kanıtı — mock veri, gerçek arayüzden akıyor. */}
      <Card
        header={<Text role="overline" tone="secondary">{shellCopy.anaSayfa.skyCardLabel}</Text>}
        style={styles.card}>
        {transit ? (
          // Reveal: iskelet→veri cross-fade (§17 "ne değişti"; reduced'da düz).
          <Reveal style={styles.cardContent}>
            <Text role="heading.s" align="center">
              🌙 Ay {SIGN_TR[transit.moonSign] ?? transit.moonSign} · {PHASE_TR[transit.moonPhase]}
            </Text>
            <Text role="label" tone="secondary" align="center">
              {transit.events.length} transit olayı → motora ({'match_engine_rules'}) hazır
            </Text>
          </Reveal>
        ) : (
          // Yüklenecek iki metin satırının rol yükseklikleriyle bire bir iskelet
          // (§36; düzen sıçraması yok).
          <>
            <Skeleton textRole="heading.s" width={200} />
            <Skeleton textRole="label" width={240} />
          </>
        )}
      </Card>

      <Text role="caption" tone="secondary" align="center" style={styles.note}>
        {shellCopy.anaSayfa.mockNote}
      </Text>

      {/* YALNIZ GELİŞTİRME: bileşen galerisi girişi (teknik etiket, ürün
          kopyası değil). Üretim derlemesinde render edilmez. */}
      {__DEV__ ? (
        <Button
          label="dev-gallery"
          variant="ghost"
          // Href cast: typed-routes önbelleği (.expo/types) yalnız `expo start`
          // ile tazelenir; dev-only rota için önbellek tazeliğine bağlanma.
          onPress={() => router.push('/dev-gallery' as Href)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal genişlik sınıfından gelir (useWidthClass, Design §13.3).
    gap: Spacing.three,
  },
  subtitle: { maxWidth: 320 },
  // Görsel kabuk (radius/padding/zemin) Card bileşeninden gelir.
  card: {
    marginTop: Spacing.two,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  cardContent: { gap: Spacing.one, alignItems: 'center' },
  note: { maxWidth: 320 },
});
