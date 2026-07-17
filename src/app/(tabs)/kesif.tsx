import { useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  fetchHerbs,
  fetchQuizzes,
  PLANET_GLYPH,
  type Herb,
  type Quiz,
} from '@/lib/content';
import { useAsyncResource } from '@/lib/query';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Radius, Spacing } from '@/constants/theme';
import { shellCopy } from '@/content/shell-copy';
import { Card, EmptyState, ErrorState, Reveal, Skeleton } from '@/design-system/components';
import { useWidthClass } from '@/design-system/hooks';
import { Text } from '@/design-system/primitives';
import { useTheme } from '@/design-system/theme';

type KesifContent = { herbs: Herb[]; quizzes: Quiz[] };

export default function KesifScreen() {
  const { colors: c } = useTheme();
  const { horizontalMargin } = useWidthClass();
  const [refreshing, setRefreshing] = useState(false);

  // Fetcher referans-sabit (useAsyncResource sözleşmesi).
  const fetchContent = useCallback(async (): Promise<KesifContent> => {
    const [herbs, quizzes] = await Promise.all([fetchHerbs(), fetchQuizzes()]);
    return { herbs, quizzes };
  }, []);

  // Yaşam döngüsü + sınıflandırma + önbellek düşüşü (§33/§38) artık lib/query'de.
  const content = useAsyncResource<KesifContent>({
    fetcher: fetchContent,
    cacheKey: 'kesif.content',
    enabled: isSupabaseConfigured,
  });

  const { refresh } = content;
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  if (!isSupabaseConfigured) {
    // Anahtar yoksa deneme/retry anlamsız — eylemsiz hata durumu.
    // Ham detay yalnız __DEV__'de görünür (§37).
    return (
      <ErrorState
        icon="seedling"
        title={shellCopy.kesif.errorTitle}
        description={shellCopy.kesif.errorBody}
        technicalDetail=".env dosyasında Supabase anahtarları yok."
      />
    );
  }

  if (content.data == null && content.phase === 'fetching') {
    // İskelet, yüklenecek liste düzenini taklit eder (§36: spinner değil
    // iskelet; düzen sıçraması yok). Metin mevcut microcopy — değişmedi.
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: c.surface.canvas, paddingHorizontal: horizontalMargin, flex: 1 },
        ]}>
        <Skeleton textRole="heading.m" width={140} style={styles.skeletonHeader} />
        {[0, 1, 2, 3].map((i) => (
          <Card
            key={i}
            header={
              <>
                <Skeleton width={Spacing.four} height={Spacing.four} radius="full" />
                <Skeleton textRole="heading.s" width="40%" />
              </>
            }>
            <Skeleton textRole="body.s" width="85%" />
          </Card>
        ))}
        <Text role="body.s" tone="secondary" align="center">{shellCopy.kesif.loading}</Text>
      </View>
    );
  }

  if (content.data == null) {
    // Canlı deneme başarısız VE önbellekte veri yok (ilk açılış çevrimdışı
    // dahil). NOT: 'network' sınıfı için ayrı OfflineState sunumu, onaylı
    // çevrimdışı microcopy'si + güvenilir tespit (NetInfo onayı) gelene dek
    // BİLİNÇLİ bağlanmadı — mevcut onaysız tek kopya bu hata metni (§38 retry
    // burada da kolay erişilir).
    return (
      <ErrorState
        icon="seedling"
        title={shellCopy.kesif.errorTitle}
        description={shellCopy.kesif.errorBody}
        technicalDetail={
          content.error ? `${content.error.kind}: ${content.error.message}` : undefined
        }
        action={{ label: shellCopy.kesif.retry, onPress: onRefresh, loading: refreshing }}
      />
    );
  }

  const { herbs, quizzes } = content.data;
  const empty = herbs.length === 0 && quizzes.length === 0;

  // Reveal: yükleme→hazır cross-fade (§17 "ne değişti"; reduced-motion'da düz).
  return (
    <Reveal style={styles.flex}>
    <ScrollView
      style={{ backgroundColor: c.surface.canvas }}
      contentContainerStyle={[styles.container, { paddingHorizontal: horizontalMargin }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.text.primary} />
      }>
      {/* BAYAT/ÇEVRİMDIŞI BİLDİRİMİ: veri önbellekten sunulurken sakin bir
          kullanıcı bildirimi gerekir (§38) — ONAYLI MICROCOPY YOK; metin
          onaylanana dek görünür bildirim eklenmedi (T11 raporunda blocker).
          Aşağıdaki satır yalnız geliştirme derlemesinde görünür. */}
      {__DEV__ && content.stale ? (
        <Text role="caption" tone="secondary" align="center">
          [dev] önbellekten · canlı deneme başarısız ({content.error?.kind ?? '?'})
        </Text>
      ) : null}
      {empty ? (
        <EmptyState
          icon="seedling"
          title={shellCopy.kesif.emptyTitle}
          description={shellCopy.kesif.emptyBody}
          style={styles.emptyInScroll}
        />
      ) : (
        <>
          {/* Bitki kartları */}
          <SectionHeader title="Bitki Kartları" count={herbs.length} />
          <View style={styles.list}>
            {herbs.map((h) => (
              <Card
                key={h.herb_id}
                header={
                  <>
                    {/* Gezegen rafı glyph'i içerik verisinden gelir (Icon setinde
                        değil); boyut heading.m rolüyle token'a bağlı. Dekoratif. */}
                    <Text
                      role="heading.m"
                      accessibilityElementsHidden
                      importantForAccessibility="no-hide-descendants">
                      {PLANET_GLYPH[h.gezegen_birincil ?? ''] ?? '🌿'}
                    </Text>
                    <Text role="heading.s" style={styles.cardTitle}>{h.name_tr}</Text>
                    {h.guven_tier ? (
                      // Güvenlik çipi: ekran okuyucuda ayrı odaklanan etiketli
                      // öğe (KS-1 uyari_chip yuvası; görünen metin değişmedi).
                      <Text
                        role="caption"
                        accessible
                        style={[styles.warnChip, { borderColor: c.border.strong }]}>
                        ⚠ dikkat
                      </Text>
                    ) : null}
                  </>
                }>
                {h.data?.tek_satir ? (
                  <Text role="body.s" tone="secondary">
                    {h.data.tek_satir}
                  </Text>
                ) : null}
              </Card>
            ))}
          </View>

          {/* Ay quizleri */}
          <SectionHeader title="Ay Quizleri" count={quizzes.length} />
          <View style={styles.list}>
            {quizzes.map((q) => {
              const arketipSayisi = q.data?.arketipler
                ? Object.keys(q.data.arketipler).length
                : null;
              const soruSayisi = Array.isArray(q.data?.sorular) ? q.data.sorular!.length : null;
              return (
                <Card
                  key={q.quiz_id}
                  header={
                    <>
                      <Text
                        role="caption"
                        tone="secondary"
                        style={[styles.ayBadge, { backgroundColor: c.surface.base }]}>
                        Ay {q.ay}
                      </Text>
                      <Text role="heading.s" style={styles.cardTitle}>{q.title}</Text>
                    </>
                  }>
                  <Text role="body.s" tone="secondary">
                    {[
                      arketipSayisi ? `${arketipSayisi} arketip` : null,
                      soruSayisi ? `${soruSayisi} soru` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </Text>
                </Card>
              );
            })}
          </View>

          <Text role="caption" tone="secondary" align="center" style={styles.footer}>
            İçerik Supabase&apos;den anon anahtarla çekildi · yalnız herkese açık içerik
          </Text>
        </>
      )}
    </ScrollView>
    </Reveal>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  const { colors: c } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text role="heading.m">{title}</Text>
      <Text
        role="label"
        tone="secondary"
        style={[styles.countPill, { backgroundColor: c.surface.card }]}>
        {count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  // Yatay padding genişlik sınıfından gelir (useWidthClass, Design §13.3).
  container: { paddingTop: Spacing.three, gap: Spacing.two, paddingBottom: Spacing.six },
  emptyInScroll: { minHeight: 400 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
  },
  skeletonHeader: { marginTop: Spacing.three, marginBottom: Spacing.one },
  countPill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  list: { gap: Spacing.two },
  // Kart kabuğu (zemin/radius/padding/slot düzeni) Card bileşeninden gelir.
  cardTitle: { flexShrink: 1 },
  warnChip: {
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    marginLeft: 'auto',
    overflow: 'hidden',
  },
  ayBadge: {
    fontWeight: '600',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  footer: { marginTop: Spacing.three },
});
