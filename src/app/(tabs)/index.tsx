/**
 * Ana Sayfa — "Günlük Pusula" (ana-sayfa-spec v1.2 · Phase 4 D1 retrofit).
 *
 * BLOK SIRASI (15 §7 / 08 §3 — D1'de kanona taşındı):
 *   B1 tarih + ay çipi → B3 günün bitkisi (HERO) → B4 check-in şeridi →
 *   B2 kozmik hava satırı → B6 dinamik slot (render yok) → B5 günün sözü +
 *   kaydet/paylaş. Önceki sıra hero'yu üçüncü sıraya koyuyordu; kanon hero'yu
 *   bağlam şeridinin hemen altına ister ("ilk viewportta tek ana odak", 08 §1).
 *
 * GÖRSEL SÖZLEŞME: ekran kabuğu ScreenShell + homeSpec (15 §6-7) — zemin,
 * yatay padding, sectionGap ve accent (adaçayı) tek noktadan spec'ten gelir;
 * ekran kendi renk/ölçü değeri üretmez.
 *
 * TİPOGRAFİ (15 §5 rol sistemi): tek büyük serif hero'nun bitki adıdır
 * (03 §7.1: hero başlıkla aynı viewportta ikinci büyük serif olmaz) — tarih
 * bağlam şeridine iner (uiLabel). Bilimsel ad Lora italik, gövde Lora, kontrol
 * ve metadata System sans.
 *
 * KORUNAN DAVRANIŞ (B1-B6 preservation map — retrofit'te DEĞİŞMEZ):
 * yüklenirken sabit yükseklikli iskeletler (zıplama yok); veri yoksa blok
 * sessizce gizlenir — TEK İSTİSNA B3: hero asla boş kalmaz (Sprint 2.2A ürün
 * sahibi kararı, ONAYLI) — canlı/önbellek yoksa gömülü açılış bitkisi. B6
 * hiçbir koşulda render edilmez. Önbellek düşüşü lib/query'de (§38).
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
import { Pressable, RefreshControl, Share, StyleSheet, View } from 'react-native';
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useRouter, type Href } from 'expo-router';

import { astro, type DailyTransit } from '@/lib/astro';
import { readCheckin, saveCheckin, type CheckinEntry } from '@/lib/checkin';
import { readFavoriteQuoteIds, toggleFavoriteQuote } from '@/lib/favorites';
import { hapticCompletion, hapticSelection } from '@/lib/haptics';
import {
  fetchHomeDaily,
  herbLatin,
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
  PlantCard,
  PLANT_CARD_FEATURE_MEDIA_ASPECT,
  Reveal,
  SectionHeader,
  Skeleton,
} from '@/design-system/components';
import { HerbImage, MoonPhaseGlyph } from '@/domain-ui';
import { AppText, ScreenShell, Surface } from '@/design-system/primitives';
import { homeSpec } from '@/design-system/tokens/screen-specs';
import { useTheme } from '@/design-system/theme';

function formatDayTitle(d: Date): string {
  return `${d.getDate()} ${MONTHS_TR[d.getMonth()]}, ${WEEKDAYS_TR[d.getDay()]}`;
}

export default function AnaSayfaScreen() {
  const { colors: c } = useTheme();
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
  const herbName = herb ? (herb.name_tr ?? herb.herb_id) : '';
  const herbSci = herb ? (herbLatin(herb) ?? homeCopy.herbCard.scientificPending) : '';

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
    <ScreenShell
      spec={homeSpec}
      onScroll={onScroll}
      contentContainerStyle={styles.content}
      /* Living World katman 1: ambient ışık + paralaks + çevresel tepki. */
      background={<AmbientBackground scrollY={scrollY} responseSignal={ambientPulse} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.text.primary} />
      }>
      {__DEV__ && daily.stale ? (
        <AppText variant="uiCaption" tone="secondary" align="center">
          [dev] önbellekten · canlı deneme başarısız ({daily.error?.kind ?? '?'})
        </AppText>
      ) : null}

      {/* ================= SEMBOLİK BÖLGE (spec §0: kanıttan görsel ayrık) */}

      {/* B1 · Bağlam şeridi: tarih + ay çipi (herkese aynı gök; kişiselleştirme
          yok). Bağlam katmanıdır, başlık değil (01 §11.1) — bu yüzden metadata
          ölçeğinde durur ve ekranın tek büyük serifini hero'ya bırakır. */}
      <View style={styles.contextStrip}>
        <AppText variant="uiLabel" tone="secondary">
          {formatDayTitle(new Date())}
        </AppText>
        {transit ? (
          // Çip: pudra zemin (15 §3 powder blush); faz-özel glif (Sprint 2.2A ⑥)
          // + tek satır metin — emoji yağmuru yok.
          <Surface role="powder" radius="full" style={styles.moonChip}>
            <MoonPhaseGlyph phase={transit.moonPhase} />
            <AppText variant="uiLabel">
              {MOON_IN_SIGN_TR[transit.moonSign]} · {MOON_PHASE_TR[transit.moonPhase]}
            </AppText>
          </Surface>
        ) : !transitSettled ? (
          // Çip yüksekliği sabit kalsın diye iskelet aynı kabukta (§3, §36).
          <Surface role="powder" radius="full" style={styles.moonChip}>
            <Skeleton textVariant="uiLabel" width={Spacing.six * 2} radius="full" />
          </Surface>
        ) : null}
      </View>

      {/* B3 · Günün bitki kartı — ekranın TEK hero'su (08 §1 "ilk viewportta
          tek ana odak"). Havuz daima app_safe; doz/tüketim dili içerik
          kontratında yasak. Yaygın ad + bilimsel ad birlikte (12 §F, 07 §6);
          görsel yuvası HerbImage — Storage görseli yoksa nötr yer tutucu
          (10 §11), görsel geldiğinde ekran değişmez. Canlı/önbellek yoksa
          açılış bitkisi (ONAYLI — hero asla boş değil). Tap: geçici köprü
          Keşif'e (ONAYLI ara karar; hedef Bahçe herb_detail, Faz 6). */}
      {herb ? (
        <Reveal>
          <PlantCard
            variant="feature"
            commonName={herbName}
            scientificName={herbSci}
            description={herb.data?.tek_satir ?? undefined}
            onPress={goKesif}
            accessibilityLabel={`${homeCopy.herbCard.a11yPrefix}: ${herbName}, ${herbSci}`}
            media={<HerbImage imagePath={herb.image_path} imageVersion={herb.image_version} />}
          />
        </Reveal>
      ) : (
        // İskelet: hero kartın geometrisiyle BİREBİR (§36) — aynı köşe (hero
        // radius), aynı medya oranı, aynı metin satır yükseklikleri. Hazır
        // olunca yerleşim zıplamaz.
        <Card
          hero
          style={styles.heroSkeletonCard}
          media={<Skeleton aspectRatio={PLANT_CARD_FEATURE_MEDIA_ASPECT} radius="md" />}>
          <Skeleton textVariant="displayHero" width="50%" />
          <Skeleton textVariant="scientificName" width="65%" />
          <Skeleton textVariant="reading" width="85%" />
        </Card>
      )}

      {/* ================= KANIT BÖLGESİ — başlık + boşlukla ayrık (B4) */}

      <View style={styles.section}>
        <SectionHeader title={homeCopy.checkin.sectionTitle} />
        <Card>
          <AppText variant="uiBody">{homeCopy.checkin.question}</AppText>
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
            <AppText variant="uiCaption" tone="secondary">
              {homeCopy.checkin.loggedHint}
            </AppText>
          ) : null}
        </Card>
      </View>

      {/* B2 · Kozmik hava satırı — tap → Keşif (spec §6 köprüsü). Kanon sırası
          bu satırı check-in'den SONRA ister (15 §7 "daily celestial insight"). */}
      {themeLine ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={themeLine}
          onPress={goKesif}
          style={({ pressed }) => [
            styles.skyLine,
            pressed ? { backgroundColor: c.surface.selected } : null,
          ]}>
          <AppText variant="readingLead">{themeLine}</AppText>
        </Pressable>
      ) : dailyPending ? (
        <View style={styles.skyLine}>
          <Skeleton textVariant="readingLead" width="70%" />
        </View>
      ) : null}

      {/* B6 · Dinamik slot — kural merdiveninin (spec §2-B6) hiçbir koşulu
          bugünkü modül setiyle sağlanamıyor (natal daveti→onboarding Faz 3,
          döngü/quiz ekranı/garden_state yok) → slot render edilmez; ekran
          5 blokla tamamdır. (Kanon 15 §7 sıra #6 Free/Pro teaser'ı da bu
          konumda ister; Pro modülü yokken ölü uç üretmemek için çizilmedi —
          ürün sahibine raporlandı.) */}

      {/* B5 · Günün sözü + kaydet/paylaş (15 §7 sıra #7) — atıfsız; mikro-
          eylemler kaydet ♡ · paylaş (spec B5, Sprint 2.2A ⑦). Havuz boşsa blok
          gizli (launch-blocker). Ana Sayfa kompaktlarında blok-altı disclaimer
          yok (spec §9). Caveat söz variant'ı D4 dilimi. */}
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
            <AppText variant="readingLead">{quote.text_tr}</AppText>
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
          <Skeleton textVariant="readingLead" width="90%" />
          <Skeleton textVariant="readingLead" width="60%" />
        </Card>
      ) : null}

      {symbolicEmpty ? (
        <AppText variant="uiBody" tone="secondary" align="center">
          {homeCopy.offlineSky}
        </AppText>
      ) : null}

      {__DEV__ ? (
        <View style={styles.section}>
          <AppText variant="uiCaption" tone="secondary" align="center">
            [dev] gök verisi mock (Swiss Ephemeris · Faz 5) — satır/kart seçimi
            gerçek DB kural ve bitki havuzundan
          </AppText>
          <Button
            label="dev-gallery"
            variant="ghost"
            onPress={() => router.push('/dev-gallery' as Href)}
          />
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  // Yatay padding + bloklar arası sectionGap ScreenShell'den (homeSpec, 15 §6).
  content: { paddingBottom: Spacing.six },
  heroSkeletonCard: { borderRadius: Radius.xl },
  // Bağlam şeridi: tarih solda, ay çipi sağda — tek satır, tek nefes.
  contextStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  moonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  // Bölüm içi ritim: başlık ↔ kart cardGap kadar sıkı (sectionGap bloklar arası).
  section: { gap: Spacing.three },
  // Basılı hâlin tint'i kart ailesiyle aynı köşeyi kullanır — ekranda dört
  // farklı radius seviyesi birikmesin (01 §11.2).
  skyLine: {
    minHeight: MinTouchTarget,
    justifyContent: 'center',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.one,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
});
