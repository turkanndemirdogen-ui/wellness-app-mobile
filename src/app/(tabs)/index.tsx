/**
 * Ana Sayfa — "Günlük Pusula" (ana-sayfa-spec v1.2, Kompozisyon B, onaylı).
 *
 * Blok dizilimi (spec §1): B1 gün başlığı+ay çipi → B2 kozmik hava satırı →
 * B3 günün bitki kartı → B4 check-in şeridi (kanıt bölgesi) → B5 günün sözü →
 * B6 dinamik slot. Sembolik ve kanıt bölgeleri görsel ayrık (başlıkçık+boşluk);
 * tek cümlede karışmaz. Chat baloncuğu YOK (onaylı).
 *
 * Haller (spec §3): yüklenirken blok yükseklikleri sabit iskeletler (zıplama
 * yok); veri yoksa blok sessizce gizlenir — TEK İSTİSNA B3: hero asla boş
 * kalmaz (Sprint 2.2A ürün sahibi kararı, ONAYLI) — canlı/önbellek yoksa
 * gömülü açılış bitkisi kartı gösterilir. Önbellek düşüşü lib/query'de (§38).
 *
 * Living World A5 dilimi (Design A5, §21): AmbientBackground (günün saatine
 * göre ışık yıkaması) + minimal paralaks (scroll) + tek çevresel tepki
 * (başarılı check-in → yumuşak ışık kayması). Reduced-motion/düşük güç →
 * statik dünya; sürekli döngü bu ekranda hiç yok.
 *
 * Haptics (§20, Sprint 2.2A onaylı kapsam): duygu çipi seçimi → light,
 * başarılı günlük kayıt → medium. Başka haptic yok.
 *
 * S0 (natal yok): ekran tam çalışır — free/global içerik. B6 kuralları
 * bağımlı modüller (onboarding/döngü/quiz ekranı/garden_state) gelene dek
 * sağlanamaz → slot render edilmez, ekran 5 blokla tamamdır (spec §2-B6).
 */

import { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useRouter, type Href } from 'expo-router';

import { astro, type DailyTransit } from '@/lib/astro';
import { readCheckin, saveCheckin, type CheckinEntry } from '@/lib/checkin';
import { PLANET_GLYPH } from '@/lib/content';
import { readFavoriteQuoteIds, toggleFavoriteQuote } from '@/lib/favorites';
import { hapticCompletion, hapticSelection } from '@/lib/haptics';
import {
  fetchHomeDaily,
  pickDailyHerb,
  pickDailyQuote,
  pickThemeLine,
  todayKey,
  type HomeDaily,
} from '@/lib/home';
import { useAsyncResource } from '@/lib/query';
import { isSupabaseConfigured } from '@/lib/supabase';
import { MinTouchTarget, Radius, Spacing } from '@/constants/theme';
import {
  homeCopy,
  MONTHS_TR,
  MOON_IN_SIGN_TR,
  MOON_PHASE_TR,
  OPENING_HERB,
  QUICK_MOODS,
  WEEKDAYS_TR,
} from '@/content/home-copy';
import {
  AmbientBackground,
  Button,
  Card,
  Chip,
  Reveal,
  Skeleton,
} from '@/design-system/components';
import { HERB_ILLUSTRATION_HEIGHT, HerbIllustration, MoonPhaseGlyph } from '@/domain-ui';
import { useWidthClass } from '@/design-system/hooks';
import { Surface, Text } from '@/design-system/primitives';
import { useTheme } from '@/design-system/theme';

function formatDayTitle(d: Date): string {
  return `${d.getDate()} ${MONTHS_TR[d.getMonth()]}, ${WEEKDAYS_TR[d.getDay()]}`;
}

export default function AnaSayfaScreen() {
  const { colors: c } = useTheme();
  const { horizontalMargin } = useWidthClass();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const dateKey = todayKey();

  // --- Living World A5: paralaks scroll konumu + çevresel tepki tetiği.
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });
  const [ambientPulse, setAmbientPulse] = useState(0);

  // --- Gökyüzü bağlamı (şimdilik MOCK sağlayıcı — Swiss Ephemeris Faz 5).
  // S0: natal veri yok; sağlayıcıya saat-bilinmez yer tutucu geçilir, free
  // yüzeye yalnız transit-only içerik iner (lib/home free/pro sınırı).
  const [transit, setTransit] = useState<DailyTransit | null>(null);
  const [transitSettled, setTransitSettled] = useState(false);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const natal = await astro.getNatalChart({ date: '2000-01-01', timeKnown: false });
        const t = await astro.getDailyTransit(natal, todayKey());
        if (alive) setTransit(t);
      } catch {
        // Sağlayıcı düşerse çip/satır sessizce gizli kalır (spec B1-B2 halleri).
      } finally {
        if (alive) setTransitSettled(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // --- Günlük içerik montajı (bitki havuzu + kural satırı + söz havuzu).
  const events = transit?.events ?? null;
  const fetchDaily = useCallback((): Promise<HomeDaily> => {
    return fetchHomeDaily(events ?? []);
  }, [events]);
  const daily = useAsyncResource<HomeDaily>({
    fetcher: fetchDaily,
    cacheKey: 'home.daily.v1',
    enabled: isSupabaseConfigured && events != null,
  });

  // --- B4 check-in durumu (yerel; aynı gün ikinci seçim = güncelleme).
  const [checkin, setCheckin] = useState<CheckinEntry | null>(null);
  useEffect(() => {
    let alive = true;
    void readCheckin(dateKey).then((entry) => {
      if (alive) setCheckin(entry);
    });
    return () => {
      alive = false;
    };
  }, [dateKey]);

  const onSelectMood = useCallback(
    (emotionId: string) => {
      // Seçim geri bildirimi hemen (§20 light); görsel durum da anında değişir
      // (haptic tek kanal değil). Kalıcı yazım arka planda.
      void hapticSelection();
      setCheckin({ emotionId, savedAt: new Date().toISOString() });
      void saveCheckin(dateKey, emotionId).then((saved) => {
        if (saved) {
          // Gerçek kalıcılıkta tamamlanma (§20 medium) + çevresel tepki
          // (§21.2 light shift — ödül/copy değil, ortam geri bildirimi).
          void hapticCompletion();
          setAmbientPulse((p) => p + 1);
        }
      });
    },
    [dateKey],
  );

  // --- B5 favori koleksiyonu (gunun-sozu-spec §3; cihazda, auth Faz 2'de).
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  useEffect(() => {
    let alive = true;
    void readFavoriteQuoteIds().then((ids) => {
      if (alive) setFavoriteIds(ids);
    });
    return () => {
      alive = false;
    };
  }, []);

  const onToggleFavorite = useCallback(async (sozId: string) => {
    setFavoriteIds(await toggleFavoriteQuote(sozId));
  }, []);

  // Paylaşım: yalnız söz metni — atıf/kaynak asla (gunun-sozu-spec K2, GS-3).
  // R1.5 görsel paylaşım şablonu ayrı iş kalemi; metin paylaşımı ara adımdır.
  const onShareQuote = useCallback(async (text: string) => {
    try {
      await Share.share({ message: text });
    } catch {
      // Kullanıcı iptali / sistem hatası sessiz (§37: jargon yok, kırık his yok).
    }
  }, []);

  const { refresh } = daily;
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  // --- Blok verileri (spec "Haller": veri yoksa blok sessizce gizlenir).
  const liveHerb = pickDailyHerb(daily.data?.herbs ?? null, dateKey);
  const themeLine = pickThemeLine(daily.data?.rules ?? null, dateKey);
  const quote = pickDailyQuote(daily.data?.quotes ?? null, dateKey);
  // Bekleme: fetch transit'e kapılı başlar (idle) — idle+fetching birlikte
  // "henüz sonuç yok" sayılır; hata sonucudur, iskelet sürdürmez (§36).
  const dailyPending =
    isSupabaseConfigured && daily.data == null && daily.phase !== 'error';

  // B3 hero asla boş kalmaz (ONAYLI karar): canlı → önbellek → açılış bitkisi.
  const herb = liveHerb ?? (dailyPending ? null : OPENING_HERB);
  const herbGlyph = PLANET_GLYPH[herb?.gezegen_birincil ?? ''];

  // Spec §3: tüm sembolik CANLI içerik boşsa tek yumuşak satır (hero açılış
  // bitkisiyle dolu kalır; satır göğe ulaşılamadığını nazikçe söyler).
  const symbolicEmpty =
    transitSettled &&
    transit == null &&
    themeLine == null &&
    liveHerb == null &&
    quote == null &&
    !dailyPending;

  const goKesif = useCallback(() => router.navigate('/kesif' as Href), [router]);

  return (
    <View style={[styles.root, { backgroundColor: c.ambient.base }]}>
      {/* Living World katman 1: ambient ışık + paralaks + çevresel tepki. */}
      <AmbientBackground scrollY={scrollY} responseSignal={ambientPulse} />

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[styles.container, { paddingHorizontal: horizontalMargin }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.text.primary} />
        }>
        {__DEV__ && daily.stale ? (
          <Text role="caption" tone="secondary" align="center">
            [dev] önbellekten · canlı deneme başarısız ({daily.error?.kind ?? '?'})
          </Text>
        ) : null}

        {/* ================= SEMBOLİK BÖLGE (spec §0: kanıttan görsel ayrık) */}

        {/* B1 · Gün başlığı + ay çipi (herkese aynı gök; kişiselleştirme yok) */}
        <View style={styles.header}>
          <Text role="display.l">{formatDayTitle(new Date())}</Text>
          {transit ? (
            // Çip: pudra zemin + erik metin (spec B1); faz-özel glif (Sprint
            // 2.2A ⑥) + tek satır metin — emoji yağmuru yok.
            <Surface role="base" radius="full" style={styles.moonChip}>
              <MoonPhaseGlyph phase={transit.moonPhase} />
              <Text role="label">
                {MOON_IN_SIGN_TR[transit.moonSign]} · {MOON_PHASE_TR[transit.moonPhase]}
              </Text>
            </Surface>
          ) : !transitSettled ? (
            // Çip yüksekliği sabit kalsın diye iskelet aynı kabukta (§3, §36).
            <Surface role="base" radius="full" style={styles.moonChip}>
              <Skeleton textRole="label" width={Spacing.six * 2} radius="full" />
            </Surface>
          ) : null}
        </View>

        {/* B2 · Kozmik hava satırı — tap → Keşif (spec §6 köprüsü) */}
        {themeLine ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={themeLine}
            onPress={goKesif}
            style={({ pressed }) => [
              styles.skyLine,
              pressed ? { backgroundColor: c.surface.selected } : null,
            ]}>
            <Text role="body.l">{themeLine}</Text>
          </Pressable>
        ) : dailyPending ? (
          <View style={styles.skyLine}>
            <Skeleton textRole="body.l" width="70%" />
          </View>
        ) : null}

        {/* B3 · Günün bitki kartı (hero, elevation 2) — havuz daima app_safe;
            doz/tüketim dili içerik kontratında yasak. İllüstrasyon yuvası
            medya slotunda (görsel metni engellemez). Canlı/önbellek yoksa
            açılış bitkisi (ONAYLI — hero asla boş değil). Tap: geçici köprü
            Keşif'e (ONAYLI ara karar; hedef Bahçe herb_detail, Faz 6). */}
        {herb ? (
          <Reveal>
            <Card
              hero
              onPress={goKesif}
              accessibilityLabel={`${homeCopy.herbCard.a11yPrefix}: ${herb.name_tr ?? herb.herb_id}`}
              header={
                <>
                  {herbGlyph ? (
                    <Text
                      role="heading.m"
                      accessibilityElementsHidden
                      importantForAccessibility="no-hide-descendants">
                      {herbGlyph}
                    </Text>
                  ) : null}
                  <Text role="heading.l" style={styles.flexShrink}>
                    {herb.name_tr}
                  </Text>
                </>
              }
              media={<HerbIllustration illusRef={herb.data?.illus_ref} />}>
              {herb.data?.tek_satir ? (
                <Text role="body.m" tone="secondary">
                  {herb.data.tek_satir}
                </Text>
              ) : null}
            </Card>
          </Reveal>
        ) : (
          // İskelet: hero kartın rol + medya yükseklikleriyle bire bir (§36).
          <Card
            hero
            header={
              <>
                <Skeleton width={Spacing.four} height={Spacing.four} radius="full" />
                <Skeleton textRole="heading.l" width="50%" />
              </>
            }
            media={<Skeleton height={HERB_ILLUSTRATION_HEIGHT} radius="lg" />}>
            <Skeleton textRole="body.m" width="85%" />
          </Card>
        )}

        {/* ================= KANIT BÖLGESİ — başlıkçık + boşlukla ayrık (B4) */}

        <Text
          role="overline"
          tone="secondary"
          accessibilityRole="header"
          style={styles.sectionTitle}>
          {homeCopy.checkin.sectionTitle}
        </Text>
        <Card>
          <Text role="body.m">{homeCopy.checkin.question}</Text>
          <View style={styles.chipRow}>
            {QUICK_MOODS.map((m) => (
              <Chip
                key={m.id}
                label={m.label}
                selected={checkin?.emotionId === m.id}
                onPress={() => onSelectMood(m.id)}
              />
            ))}
          </View>
          {checkin ? (
            <Text role="caption" tone="secondary">
              {homeCopy.checkin.loggedHint}
            </Text>
          ) : null}
        </Card>

        {/* B5 · Günün sözü — atıfsız; mikro-eylemler kaydet ♡ · paylaş (spec
            B5, Sprint 2.2A ⑦). Havuz boşsa blok gizli (launch-blocker).
            Ana Sayfa kompaktlarında blok-altı disclaimer yok (spec §9). */}
        {quote?.text_tr ? (
          <Reveal>
            <Card
              footer={
                <>
                  <Chip
                    label={`${homeCopy.quote.save} ${favoriteIds.includes(quote.soz_id) ? '♥' : '♡'}`}
                    accessibilityLabel={homeCopy.quote.save}
                    selected={favoriteIds.includes(quote.soz_id)}
                    onPress={() => void onToggleFavorite(quote.soz_id)}
                  />
                  <Chip
                    label={homeCopy.quote.share}
                    accessibilityLabel={homeCopy.quote.share}
                    onPress={() => void onShareQuote(quote.text_tr as string)}
                  />
                </>
              }>
              <Text role="body.l">{quote.text_tr}</Text>
            </Card>
          </Reveal>
        ) : dailyPending ? (
          <Card
            footer={
              <>
                <Skeleton width={Spacing.six} height={Spacing.five + Spacing.two} radius="full" />
                <Skeleton width={Spacing.six} height={Spacing.five + Spacing.two} radius="full" />
              </>
            }>
            <Skeleton textRole="body.l" width="90%" />
            <Skeleton textRole="body.l" width="60%" />
          </Card>
        ) : null}

        {/* B6 · Dinamik slot — kural merdiveninin (spec §2-B6) hiçbir koşulu
            bugünkü modül setiyle sağlanamıyor (natal daveti→onboarding Faz 3,
            döngü/quiz ekranı/garden_state yok) → slot render edilmez; ekran
            5 blokla tamamdır. */}

        {symbolicEmpty ? (
          <Text role="body.m" tone="secondary" align="center" style={styles.offline}>
            {homeCopy.offlineSky}
          </Text>
        ) : null}

        {__DEV__ ? (
          <>
            <Text role="caption" tone="secondary" align="center">
              [dev] gök verisi mock (Swiss Ephemeris · Faz 5) — satır/kart seçimi
              gerçek DB kural ve bitki havuzundan
            </Text>
            <Button
              label="dev-gallery"
              variant="ghost"
              onPress={() => router.push('/dev-gallery' as Href)}
            />
          </>
        ) : null}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  // Yatay padding genişlik sınıfından (§13.3); dikey ritim §13.4 token'ları.
  container: {
    paddingTop: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  header: { gap: Spacing.two, alignItems: 'flex-start' },
  moonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  skyLine: {
    minHeight: MinTouchTarget,
    justifyContent: 'center',
    borderRadius: Radius.md,
    paddingVertical: Spacing.one,
  },
  sectionTitle: { marginTop: Spacing.four },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  offline: { marginTop: Spacing.four },
  flexShrink: { flexShrink: 1 },
});
