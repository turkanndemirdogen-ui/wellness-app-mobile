/**
 * Ana Sayfa — "Günlük Pusula" (ana-sayfa-spec v1.2 · Phase 4 D1 retrofit).
 *
 * BLOK SIRASI (15 §7 / 08 §3):
 *   B1 tarih + ay çipi → B3 günün bitkisi (HERO) → B4 check-in şeridi →
 *   B2 kozmik hava satırı → B6 dinamik slot (render yok) → B5 günün sözü +
 *   kaydet/paylaş.
 *
 * "BÜYÜLÜ" YÖN KARARI (ürün sahibi C seçeneği, 2026-09-02): B1 artık ayrı bir
 * blok değil — tarih + ay çipi hero panelinin İÇİNDE, üst köşelerde yaşıyor.
 * Kanon sırası korunuyor (bağlam hâlâ addan önce okunur), yalnız iki blok tek
 * sinematik panelde birleşti. Hero tam genişlik, ekranın üst ~%40'ı, köşe
 * yuvarlaması yalnız altta; koyu atmosferik scrim 15 §3'ün "hero görsel paneli"
 * istisnasında yaşıyor — krom (tab bar, form, uzun okuma) açık kalır.
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
import {
  Pressable,
  RefreshControl,
  Share,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { MinTouchTarget, Spacing } from '@/constants/theme';
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
  SectionHeader,
  Skeleton,
} from '@/design-system/components';
import { DailyHerbHero, HeroMoonChip, MoonPhaseGlyph } from '@/domain-ui';
import {
  AppText,
  isValidQuoteText,
  ScreenShell,
  Surface,
  useScreenHorizontalPadding,
} from '@/design-system/primitives';
import { HOME_HERO_HEIGHT, homeSpec } from '@/design-system/tokens/screen-specs';
import { useTheme } from '@/design-system/theme';

function formatDayTitle(d: Date): string {
  return `${d.getDate()} ${MONTHS_TR[d.getMonth()]}, ${WEEKDAYS_TR[d.getDay()]}`;
}

export default function AnaSayfaScreen() {
  const { colors: c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const screenPadding = useScreenHorizontalPadding(homeSpec);

  // Hero ekranın üst ~%40'ı; 15 §7'nin heroHeight'i (280) TABAN olarak korunur.
  const heroHeight = Math.max(HOME_HERO_HEIGHT, Math.round(windowHeight * 0.4));
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

      {/* B1 + B3 · Bağlam şeridi (tarih + ay çipi) ve günün bitkisi TEK
          sinematik panelde. Ekranın TEK hero'su (08 §1 "ilk viewportta tek ana
          odak"); tam genişlik → kabuğun yatay padding'inden negatif marjla
          taşar. Havuz daima app_safe; doz/tüketim dili içerik kontratında
          yasak. Yaygın ad + bilimsel ad birlikte (12 §F, 07 §6). Görsel yoksa
          nötr yer tutucu (10 §11). Canlı/önbellek yoksa açılış bitkisi
          (ONAYLI — hero asla boş değil). Tap: geçici köprü Keşif'e. */}
      {herb ? (
        <Reveal>
          <View style={styles.heroBlock}>
            <DailyHerbHero
              commonName={herbName}
              scientificName={herbSci}
              imagePath={herb.image_path}
              imageVersion={herb.image_version}
              height={heroHeight}
              topInset={insets.top}
              dateLabel={formatDayTitle(new Date())}
              moonChip={
                transit ? (
                  <HeroMoonChip>
                    <MoonPhaseGlyph phase={transit.moonPhase} />
                    <AppText variant="uiLabel" style={{ color: c.text.onPanel }}>
                      {MOON_IN_SIGN_TR[transit.moonSign]} · {MOON_PHASE_TR[transit.moonPhase]}
                    </AppText>
                  </HeroMoonChip>
                ) : !transitSettled ? (
                  // Çip yüksekliği sabit kalsın diye iskelet aynı kabukta (§36).
                  <HeroMoonChip>
                    <Skeleton textVariant="uiLabel" width={Spacing.six * 2} radius="full" />
                  </HeroMoonChip>
                ) : null
              }
              scrollY={scrollY}
              onPress={goKesif}
              accessibilityLabel={`${homeCopy.herbCard.a11yPrefix}: ${herbName}, ${herbSci}`}
              style={{ marginHorizontal: -screenPadding }}
            />
            {herb.data?.tek_satir ? (
              // Editoryal cümle panelin ALTINDA: hero görsel kalır, okuma
              // yüzeyi sakin ve opak olur (04 §5 "long-form'da cam yok").
              <AppText variant="reading" tone="secondary">
                {herb.data.tek_satir}
              </AppText>
            ) : null}
          </View>
        </Reveal>
      ) : (
        // İskelet: hero panelin geometrisiyle birebir (§36, yerleşim sıçramaz).
        <View style={styles.heroBlock}>
          <Skeleton
            height={heroHeight}
            radius="xl"
            style={{ marginHorizontal: -screenPadding }}
          />
          <Skeleton textVariant="reading" width="85%" />
        </View>
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
        <Pressable accessibilityRole="button" accessibilityLabel={themeLine} onPress={goKesif}>
          {({ pressed }) => (
            <Surface
              role="glassMist"
              radius="lg"
              bordered
              style={[styles.skyLine, pressed ? { backgroundColor: c.surface.selected } : null]}>
              <AppText variant="readingLead">{themeLine}</AppText>
            </Surface>
          )}
        </Pressable>
      ) : dailyPending ? (
        <Surface role="glassMist" radius="lg" bordered style={styles.skyLine}>
          <Skeleton textVariant="readingLead" width="70%" />
        </Surface>
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
            tone="parchment"
            footer={
              <>
                <Chip
                  icon={favoriteIds.includes(quote.soz_id) ? 'savedBookmark' : 'bookmark'}
                  label={homeCopy.quote.save}
                  selected={favoriteIds.includes(quote.soz_id)}
                  onPress={() => void onToggleFavorite(quote.soz_id)}
                />
                <Chip
                  icon="share"
                  label={homeCopy.quote.share}
                  onPress={() => void onShareQuote(quote.text_tr as string)}
                />
              </>
            }>
            {/* Caveat YALNIZ kısa söz için (15 §5): 32 kelimeyi aşarsa okuma
                variant'ına düşer — el yazısı uzun metinde okunurluğu bozar. */}
            <AppText variant={isValidQuoteText(quote.text_tr) ? 'quote' : 'readingLead'}>
              {quote.text_tr}
            </AppText>
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
  // Üst padding sıfır: hero ekranın en üstünden başlar (güvenli alan payını
  // panelin kendisi uygular).
  content: { paddingTop: 0, paddingBottom: Spacing.six },
  // Hero bloğu: panel tam genişlik, altındaki cümle normal kolonda kalır.
  heroBlock: { gap: Spacing.three },
  // Bölüm içi ritim: başlık ↔ kart cardGap kadar sıkı (sectionGap bloklar arası).
  section: { gap: Spacing.three },
  // Günün göksel içgörüsü cam 1 yüzeyinde (04 §13.1) — kart ailesiyle aynı
  // köşe, böylece ekranda radius seviyeleri birikmez (01 §11.2).
  skyLine: {
    minHeight: MinTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
});
