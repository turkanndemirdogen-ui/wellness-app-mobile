/**
 * dev-gallery — YALNIZ GELİŞTİRME: bileşen galerisi (izole görsel doğrulama).
 *
 * Erişim: dev client'ta /dev-gallery rotası —
 *   npx uri-scheme open "wellnessapp:///dev-gallery" --android
 * veya Ana Sayfa'nın altındaki __DEV__ "dev-gallery" ghost butonu.
 *
 * Üretimde ERİŞİLEMEZ: __DEV__ değilse köke yönlendirir. Beşinci sekme
 * DEĞİLDİR (Design §6 kilidi) — kök Stack'e itilen gizli rotadır.
 *
 * Buradaki etiketler TEKNİK tanımlayıcıdır (bileşen/durum adları), ürün
 * microcopy'si değildir; onay sürecine tabi değildir. Ürün kopyası gereken
 * örnekler shell-copy'deki MEVCUT metinleri yeniden kullanır.
 */

import { Component, useEffect, useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, TurboModuleRegistry, UIManager, View } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Radius, Spacing } from '@/constants/theme';
import { shellCopy } from '@/content/shell-copy';
import {
  fourPhaseToGlyph,
  GLYPH_BREATH_DURATION_MS,
  MOON_PHASE_GLYPH_NAMES,
  MoonPhaseDataGlyph,
  PLANET_GLYPH_NAMES,
  PlanetGlyph,
  resolveGlyphBreath,
  SunGlyph,
  ZODIAC_GLYPH_NAMES,
  ZodiacGlyph,
  type FourPhaseName,
  type ZodiacMode,
} from '@/design-system/glyphs';
import {
  AppHeader,
  AstrologyInterpretationNotice,
  Button,
  Card,
  EmptyState,
  ErrorState,
  FilterChip,
  HealthInformationNotice,
  IconButton,
  InlineNotice,
  ListItem,
  Loader,
  LoadingState,
  OfflineState,
  PlantCard,
  ProTeaser,
  Reveal,
  SearchField,
  SectionHeader,
  Skeleton,
  SymbolicReferenceNotice,
  TabItem,
  TextArea,
  TextField,
  VisualPanel,
  type ButtonVariant,
  type InlineNoticeTone,
  type PlantCardVariant,
} from '@/design-system/components';
import { useMotionScale, useWidthClass } from '@/design-system/hooks';
import {
  AppText,
  Divider,
  Icon,
  ICON_NAMES,
  ICON_SOURCE,
  Surface,
  Text,
} from '@/design-system/primitives';
import {
  appTextVariants,
  fontRoles,
  glowStyle,
  motionEasing,
  shadowStyle,
  textRoles,
  useAtmosphere,
  useTheme,
  type AppTextVariant,
  type PanelKind,
  type TextRoleName,
} from '@/design-system/theme';
import { primitive } from '@/design-system/tokens/primitive.generated';
import { allScreenSpecs, HOME_HERO_HEIGHT } from '@/design-system/tokens/screen-specs';
import { DailyHerbHero, HerbImage, HeroMoonChip, MoonPhaseGlyph } from '@/domain-ui';
import { fetchHerbs, type Herb } from '@/lib/content';
import { herbLatin } from '@/lib/home';
import { TR_TEST_STRING } from '@/lib/text-tr';

const TEXT_ROLES = Object.keys(textRoles) as TextRoleName[];
const APP_TEXT_VARIANTS = Object.keys(appTextVariants) as AppTextVariant[];
const PANEL_KINDS = Object.keys(primitive.color.visualPanels) as PanelKind[];
const CHROME_ENTRIES = Object.entries(primitive.color.chrome);
const BUTTON_VARIANTS: ButtonVariant[] = [
  'primary',
  'secondary',
  'tertiary',
  'ghost',
  'destructive',
];

/**
 * Galeri native yetenek kapısı — dev-gallery'nin gerektirdiği native view
 * modülleri ÇALIŞAN client'ta kayıtlı mı? (2026-07-22 çökme dersi: eski dev
 * client'a deep-link ile düşülünce VisualPanel'in scrim degradesi
 * "Can't find ViewManager 'ViewManagerAdapter_ExpoLinearGradient'" ile native
 * mount'ta çöktü — ErrorBoundary native mount çökmesini YAKALAYAMAZ, tek
 * güvenli yol hiç render etmemek.) Kontroller throw etmez (has/get → false).
 */
const MISSING_NATIVES = [
  {
    dep: 'expo-linear-gradient (VisualPanel/Ambient scrim)',
    ok: UIManager.hasViewManagerConfig?.('ViewManagerAdapter_ExpoLinearGradient') ?? false,
  },
  {
    dep: 'react-native-svg (P2 glyph sistemi)',
    ok: TurboModuleRegistry.get('RNSVGSvgViewModule') != null,
  },
].filter((check) => !check.ok);

export default function DevGalleryRoute() {
  // Üretim derlemesinde rota içeriği yok — köke dön.
  if (!__DEV__) return <Redirect href="/" />;
  if (MISSING_NATIVES.length > 0) return <StaleClientDiagnostic />;
  return <Gallery />;
}

/** Eski/eksik dev client teşhis ekranı — galeri gövdesi hiç mount edilmez. */
function StaleClientDiagnostic() {
  const { colors } = useTheme();
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'dev-gallery' }} />
      <ScrollView
        style={{ backgroundColor: colors.surface.canvas }}
        contentContainerStyle={styles.container}>
        <Text role="heading.m">ESKİ DEV CLIENT — native modül eksik</Text>
        {MISSING_NATIVES.map((check) => (
          <Text key={check.dep} role="body.s" tone="secondary">
            • {check.dep}: kayıtlı DEĞİL
          </Text>
        ))}
        <Text role="body.s" tone="secondary">
          Bu uygulama sürümü dev-gallery&apos;nin gerektirdiği native modülleri
          içermiyor; galeri çökmemek için render edilmedi. Çözüm: cihazdaki TÜM
          wellness-app dev client kurulumlarını kaldırın, yalnız d86c16fa
          (commit 3f4739c) build&apos;ini kurun ve galeriye uygulama İÇİNDEN (ana
          sayfadaki dev-gallery butonu) girin — dış deep link birden fazla
          kurulum varsa eski uygulamaya gidebilir.
        </Text>
      </ScrollView>
    </>
  );
}

function Gallery() {
  const { colors, timeOfDay } = useTheme();
  const { horizontalMargin, widthClass } = useWidthClass();
  const motionScale = useMotionScale();
  const atmosphere = useAtmosphere();
  const [revealKey, setRevealKey] = useState(0);

  // P3 vitrin durumu — kontrollü input/seçim örnekleri (teknik etiketler).
  const [fieldValue, setFieldValue] = useState('');
  const [areaValue, setAreaValue] = useState('');
  const [searchValue, setSearchValue] = useState('papatya');
  const [chipSelected, setChipSelected] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [plantSaved, setPlantSaved] = useState(false);

  const noop = () => {};

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'dev-gallery' }} />
      <ScrollView
        style={{ backgroundColor: colors.surface.canvas }}
        contentContainerStyle={[styles.container, { paddingHorizontal: horizontalMargin }]}>
        <Text role="caption" tone="secondary">
          __DEV__ galeri · timeOfDay={timeOfDay} · widthClass={widthClass} · motionScale=
          {motionScale}
        </Text>

        <Section title="Typography">
          {TEXT_ROLES.map((role) => (
            <Text key={role} role={role}>
              {role}
            </Text>
          ))}
        </Section>

        <Section title="Icon">
          <View style={styles.row}>
            {ICON_NAMES.map((name) => (
              <Icon key={name} name={name} decorative />
            ))}
          </View>
          <View style={styles.row}>
            <Icon name="moon" size="sm" decorative />
            <Icon name="moon" size="md" decorative />
            <Icon name="moon" size="lg" decorative />
            <Icon name="moon" size="xl" decorative />
          </View>
        </Section>

        <Section title="Button — variant × durum">
          {BUTTON_VARIANTS.map((variant) => (
            <View key={variant} style={styles.row}>
              <Button label={variant} variant={variant} onPress={noop} />
              <Button label="disabled" variant={variant} disabled onPress={noop} />
              <Button label="loading" variant={variant} loading onPress={noop} />
            </View>
          ))}
        </Section>

        <Section title="IconButton">
          <View style={styles.row}>
            <IconButton icon="sparkles" label="ghost" onPress={noop} />
            <IconButton icon="moon" label="primary" variant="primary" onPress={noop} />
            <IconButton icon="herb" label="disabled" disabled onPress={noop} />
            <IconButton icon="chat" label="loading" loading onPress={noop} />
          </View>
        </Section>

        <Section title="Card — slotlar × durum">
          <Card header={<Text role="heading.s">header</Text>} footer={<Text role="caption" tone="secondary">footer</Text>}>
            <Text role="body.s" tone="secondary">content (statik)</Text>
          </Card>
          <Card header={<Text role="heading.s">pressable</Text>} onPress={noop} accessibilityLabel="pressable card">
            <Text role="body.s" tone="secondary">tüm yüzey basılır — basılı tut</Text>
          </Card>
          <Card header={<Text role="heading.s">disabled</Text>} onPress={noop} disabled>
            <Text role="body.s" tone="secondary">devre dışı</Text>
          </Card>
        </Section>

        <Section title="ListItem">
          <ListItem
            title="pressable"
            description="leading + trailing + destek metni"
            leading={<Icon name="herb" decorative />}
            trailing={<Text role="caption" tone="secondary">42</Text>}
            onPress={noop}
          />
          <ListItem title="statik" description="onPress yok" leading={<Icon name="moon" decorative />} />
          <ListItem title="disabled" onPress={noop} disabled leading={<Icon name="chat" decorative />} />
        </Section>

        <Section title="Skeleton">
          <Skeleton />
          <Skeleton textRole="heading.m" width="60%" />
          <Skeleton textRole="body.s" width="85%" />
          <Skeleton width={Spacing.five} height={Spacing.five} radius="full" />
        </Section>

        <Section title="Loader">
          <View style={styles.row}>
            <Loader />
            <Loader size="large" />
            <Loader label={shellCopy.kesif.loading} />
          </View>
        </Section>

        <Section title="EmptyState">
          <View style={styles.stateBox}>
            <EmptyState
              icon="herb"
              title={shellCopy.bahce.title}
              description={shellCopy.bahce.subtitle}
              badge={shellCopy.common.soonBadge}
            />
          </View>
        </Section>

        <Section title="ErrorState">
          <View style={styles.stateBox}>
            <ErrorState
              icon="seedling"
              title={shellCopy.kesif.errorTitle}
              description={shellCopy.kesif.errorBody}
              technicalDetail="ornek-teknik-detay (yalniz __DEV__)"
              action={{ label: shellCopy.kesif.retry, onPress: noop }}
            />
          </View>
        </Section>

        <Section title="OfflineState">
          <View style={styles.stateBox}>
            {/* Teknik örnek etiketleri — onaylı çevrimdışı kopyası HENÜZ YOK. */}
            <OfflineState
              icon="moon"
              title="OfflineState"
              description="kopya onayı bekliyor · NetInfo onayı bekliyor"
              action={{ label: shellCopy.kesif.retry, onPress: noop }}
            />
          </View>
        </Section>

        <Section title="Reveal — reduced motion davranışı">
          <Button
            label="remount → cross-fade"
            variant="secondary"
            onPress={() => setRevealKey((k) => k + 1)}
          />
          <Reveal key={revealKey}>
            <Card header={<Text role="heading.s">Reveal #{revealKey}</Text>}>
              <Text role="body.s" tone="secondary">
                motionScale=1 → fade · motionScale=0 → animasyonsuz
              </Text>
            </Card>
          </Reveal>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Phase 1 foundations (15) — kabul yüzeyi                             */}
        {/* ------------------------------------------------------------------ */}

        <Section title="P1 · Font rolleri (15 §5) — TR karakter satırıyla">
          {APP_TEXT_VARIANTS.map((variant) => (
            <AppText key={variant} variant={variant}>
              {variant} · {TR_TEST_STRING}
            </AppText>
          ))}
          <Text role="caption" tone="secondary">
            roller: display={fontRoles.display} (≥20px) · body={fontRoles.body} ·
            ui={fontRoles.ui} · sci={fontRoles.sci} · quote={fontRoles.quote}
          </Text>
        </Section>

        <Section title="P1 · Open chrome paleti (15 §4 — ana UI daima açık)">
          {CHROME_ENTRIES.map(([name, hex]) => (
            <View key={name} style={styles.row}>
              <View style={[styles.swatch, { backgroundColor: hex }]} />
              <Text role="caption" tone="secondary">
                chrome.{name} · {hex}
              </Text>
            </View>
          ))}
        </Section>

        <Section title="P1 · Ekran spec'leri (15 §6-8) — 4 ana tab + 7 alt ekran">
          {Object.values(allScreenSpecs).map((spec) => (
            <View
              key={spec.screenId}
              style={[styles.specCard, { backgroundColor: spec.backgroundHex }]}>
              <View style={styles.row}>
                <View style={[styles.swatch, { backgroundColor: spec.accentHex }]} />
                <Text role="heading.s">{spec.screenId}</Text>
              </View>
              <Text role="caption" tone="secondary">
                bg {spec.backgroundHex} · pad {spec.horizontalPadding}/{spec.topPadding} · gap{' '}
                {spec.sectionGap}/{spec.cardGap} · {spec.motionLevel} · anim ≤
                {spec.maxAnimatedElements}
              </Text>
            </View>
          ))}
        </Section>

        <Section title="P1 · Visual-panel-only darkness (15 §3-4, scrim zorunlu)">
          <Text role="caption" tone="secondary">
            phase={atmosphere.phase} · fixedLight={String(atmosphere.fixedLight)} — krom açık
            kalır; koyuluk yalnız bu panellerde
          </Text>
          {PANEL_KINDS.map((kind) => (
            <VisualPanel key={kind} kind={kind} minHeight={72}>
              <View style={styles.panelContent}>
                <AppText variant="uiLabel" style={{ color: colors.surface.base }}>
                  VisualPanel · {kind}
                </AppText>
              </View>
            </VisualPanel>
          ))}
        </Section>

        <Section title="P1 · Motion limitleri (15 §9)">
          <Text role="body.s" tone="secondary">
            maxScale {primitive.motionLimits.maxScale} · pressScale{' '}
            {primitive.motionLimits.pressScale} · ekran başına ≤
            {primitive.motionLimits.maxAnimatedElementsPerScreen} animasyonlu öğe
          </Text>
          <Text role="body.s" tone="secondary">
            reduced motion: {String(atmosphere.reducedMotion)} → ambientEnabled=
            {String(atmosphere.ambient.ambientEnabled)} (açıkken TÜM ambient durur; içerik
            kaybolmaz)
          </Text>
        </Section>

        <Section title="P1 · Free/Pro teaser (15 §14 — contract)">
          <ProTeaser
            title="Günün derin okuması"
            preview="Bugünün temel yorumu ücretsiz: yumuşak bir yenilenme günü."
            lockedDetailCount={3}
            ctaLabel="Pro'yu keşfet"
            onPress={noop}
          />
        </Section>

        <Section title="P1 · Safety notice'ları (15 §11-13)">
          <SymbolicReferenceNotice detail="Örn. Datura — yalnız tarihsel/sembolik bağlamda." />
          <HealthInformationNotice />
          <AstrologyInterpretationNotice />
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Phase 2 glyph sistemi (05) — kabul yüzeyi                           */}
        {/* ------------------------------------------------------------------ */}

        <GlyphSectionGuard>
        <Section title="P2 · Planet glyphleri (05 §6 — planet.* tokenları)">
          <View style={styles.row}>
            {PLANET_GLYPH_NAMES.map((planet) => (
              <View key={planet} style={styles.glyphCell}>
                <PlanetGlyph planet={planet} size={32} decorative />
                <Text role="caption" tone="secondary">
                  {planet}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="P2 · Zodiac glyphleri × renk modu (05 §7, 02 §7)">
          {(['default', 'element', 'profile'] as ZodiacMode[]).map((mode) => (
            <View key={mode}>
              <Text role="caption" tone="secondary">
                mode={mode}
                {mode === 'profile' ? ' (role=sun)' : ''}
              </Text>
              <View style={styles.row}>
                {ZODIAC_GLYPH_NAMES.map((sign) => (
                  <View key={sign} style={styles.glyphCell}>
                    <ZodiacGlyph sign={sign} mode={mode} size={28} decorative />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </Section>

        <Section title="P2 · Ay fazı veri glyphleri — 8 SVG hazır (05 §8)">
          <View style={styles.row}>
            {MOON_PHASE_GLYPH_NAMES.map((phase) => (
              <View key={phase} style={styles.glyphCell}>
                <MoonPhaseDataGlyph phase={phase} size={28} decorative />
                <Text role="caption" tone="secondary">
                  {phase}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="P2 · 4→8 faz köprüsü (astro sözleşmesi 4 faz — Adım 6'ya dek)">
          <View style={styles.row}>
            {(['yeni', 'ilk_dordun', 'dolunay', 'son_dordun'] as FourPhaseName[]).map((four) => (
              <View key={four} style={styles.glyphCell}>
                <MoonPhaseDataGlyph phase={fourPhaseToGlyph[four]} size={28} decorative />
                <Text role="caption" tone="secondary">
                  {four} → {fourPhaseToGlyph[four]}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="P2 · Boyut merdiveni (05 §3: 14→48 UI · 96 hero)">
          <View style={styles.row}>
            {[14, 16, 20, 24, 32, 48, 96].map((size) => (
              <SunGlyph key={size} size={size} decorative />
            ))}
          </View>
        </Section>

        <Section title="P2 · Active / inactive (05 §11 — outline sabit, renk+vurgu değişir)">
          <View style={styles.row}>
            <View style={styles.glyphCell}>
              <ZodiacGlyph sign="leo" size={28} color={colors.text.secondary} decorative />
              <Text role="caption" tone="secondary">
                inactive
              </Text>
            </View>
            <View style={styles.glyphCell}>
              <ZodiacGlyph sign="leo" size={31} mode="element" decorative />
              <Text role="caption" tone="secondary">
                active (~1.1×)
              </Text>
            </View>
          </View>
        </Section>

        <Section title="P2 · Glyph nefesi (09 breathing · 15 §9 — reduced-motion'da statik)">
          <GlyphBreathDemo />
          <Text role="caption" tone="secondary">
            scale 1.00→1.012 · döngü {GLYPH_BREATH_DURATION_MS}ms×2 · ambientEnabled=
            {String(atmosphere.ambient.ambientEnabled)} → kapalıysa animasyon YOK (statik glyph;
            bilgi kaybolmaz) · bu ekranda animasyonlu öğe: 1 (≤2 bütçesi)
          </Text>
        </Section>
        </GlyphSectionGuard>

        {/* ------------------------------------------------------------------ */}
        {/* Phase 3 core components (07) — kabul yüzeyi                         */}
        {/* ------------------------------------------------------------------ */}

        <Section title="P3 · UI ikon seti — Lucide SVG geçişi (05 §2)">
          <Text role="caption" tone="secondary">
            ICON_SOURCE={ICON_SOURCE} · emoji temsili geride kaldı · API değişmedi
          </Text>
          <View style={styles.row}>
            {ICON_NAMES.map((name) => (
              <View key={name} style={styles.glyphCell}>
                <Icon name={name} decorative />
                <Text role="caption" tone="secondary">
                  {name}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="P3 · AppHeader (07 §3 — light chrome kilidi)">
          <AppHeader
            title="Büyük başlık"
            onBack={noop}
            backLabel="Geri"
            actions={[{ label: 'ara', icon: 'search', onPress: noop }]}
          />
          <AppHeader
            title="Küçük başlık · metin eylemi"
            large={false}
            actions={[{ label: 'tümü', text: 'Tümü', onPress: noop }]}
          />
          <AppHeader
            title="Disabled eylem"
            large={false}
            actions={[{ label: 'ara', icon: 'search', onPress: noop, disabled: true }]}
          />
        </Section>

        <Section title="P3 · SectionHeader">
          <SectionHeader title="Yalnız başlık" />
          <SectionHeader
            title="Başlık + alt metin + eylem"
            subtitle="uiCaption alt satır"
            action={{ label: 'tümü', text: 'Tümü', onPress: noop }}
          />
        </Section>

        <Section title="P3 · TabItem (15 §2 — 4 sekme, presentational; bas → focus)">
          <View style={styles.row}>
            {(['moon', 'crystalBall', 'herb', 'chat'] as const).map((icon, i) => (
              <TabItem
                key={icon}
                icon={icon}
                label={`tab-${i + 1}`}
                focused={activeTab === i}
                onPress={() => setActiveTab(i)}
              />
            ))}
          </View>
        </Section>

        <Section title="P3 · TextField / TextArea — durum matrisi (04 §18)">
          <TextField
            label="TextField (default → focus)"
            value={fieldValue}
            onChangeText={setFieldValue}
            placeholder="placeholder label'ı değiştirmez"
          />
          <TextField
            label="Error durumu"
            value="hatalı değer"
            onChangeText={noop}
            error="ikon + metin — renk tek kanal değil"
          />
          <TextField label="Disabled" value="salt okunur" onChangeText={noop} disabled />
          <TextArea
            label="TextArea (rows=3)"
            value={areaValue}
            onChangeText={setAreaValue}
            rows={3}
            placeholder="Dynamic Type ile büyür"
          />
        </Section>

        <Section title="P3 · SearchField (pill + temizle)">
          <SearchField
            label="Arama"
            value={searchValue}
            onChangeText={setSearchValue}
            onClear={() => setSearchValue('')}
            clearLabel="Aramayı temizle"
            placeholder="bitki ara"
          />
        </Section>

        <Section title="P3 · FilterChip (seçim çok-kanallı; bas → toggle)">
          <View style={styles.row}>
            <FilterChip
              label="interaktif"
              selected={chipSelected}
              onPress={() => setChipSelected((s) => !s)}
            />
            <FilterChip label="count" count={12} onPress={noop} />
            <FilterChip label="selected" selected onPress={noop} />
            <FilterChip label="disabled" disabled onPress={noop} />
          </View>
        </Section>

        <Section title="P3 · InlineNotice — 4 ton">
          {(['info', 'success', 'warning', 'error'] as InlineNoticeTone[]).map((tone) => (
            <InlineNotice
              key={tone}
              tone={tone}
              title={tone}
              message="ikon + renk + metin — renk tek kanal değil (15 §10)"
            />
          ))}
        </Section>

        <Section title="P3 · PlantCard — 4 varyant (07 §6: bilimsel ad kilidi)">
          <Text role="caption" tone="secondary">
            compact&apos;ta bilimsel ad görünmez ama accessibilityLabel&apos;da TAM okunur ·
            kaydet: bas → toggle
          </Text>
          {(['grid', 'feature', 'list', 'compact'] as PlantCardVariant[]).map((variant) => (
            <PlantCard
              key={variant}
              variant={variant}
              commonName={`Papatya · ${variant}`}
              scientificName="Matricaria chamomilla"
              family="Asteraceae"
              tags={variant === 'feature' ? ['sakinleştirici', 'çay'] : undefined}
              toxicityBadge={variant === 'list' ? 'örnek toksisite rozeti' : undefined}
              onSave={() => setPlantSaved((s) => !s)}
              saved={plantSaved}
              saveLabel={plantSaved ? 'Kaydedildi' : 'Kaydet'}
              onPress={noop}
            />
          ))}
        </Section>

        <Section title="P3 · LoadingState (tam sayfa yükleme; liste için Skeleton)">
          <View style={styles.stateBox}>
            <LoadingState label={shellCopy.kesif.loading} />
          </View>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Phase 4 — Home retrofit öncüsü: HerbImage (10 §10-§11)             */}
        {/* ------------------------------------------------------------------ */}

        <Section title="P4 · HerbImage — Storage görseli + 10 §11 yer tutucu">
          <Text role="caption" tone="secondary">
            path+version → botanicals public URL (cache anahtarı ?v=N) · path
            yok → nötr zemin + motif + bilimsel ad + bekliyor etiketi (metin
            taşır, 15 §10) · koyu zemin YOK (15 §3)
          </Text>
          <View style={styles.row}>
            <View style={styles.herbImageCell}>
              <HerbImage
                imagePath="karahindiba/card-01.webp"
                imageVersion={1}
                accessibilityLabel="Karahindiba kart görseli"
              />
            </View>
            <View style={styles.herbImageCell}>
              <HerbImage
                imagePath={null}
                imageVersion={null}
                scientificName="Taraxacum officinale"
              />
            </View>
          </View>
        </Section>

        <Section title="P4 · Gerçek bitki kartları — fetchHerbs + PlantCard media slotu">
          <LiveHerbCards />
        </Section>

        <Section title="P4 · Materyal — cam seviyeleri (04 §5, ön-tonlanmış)">
          <Text role="caption" tone="secondary">
            gerçek blur yerine tintAlpha (04 §6.3 Reduce-Transparency yolu) ·
            gövde metni taşıyan camda opaklık ≥ 0.78 · kenar = beyaz ışık
            çizgisi · nested glass YASAK
          </Text>
          {(['glassMist', 'glassFrost', 'glassDeep'] as const).map((role) => (
            <Surface key={role} role={role} radius="lg" bordered style={styles.materialBox}>
              <AppText variant="uiLabel">{role}</AppText>
              <AppText variant="uiCaption" tone="secondary">
                Bu metin cam üstünde okunur kalmalı.
              </AppText>
            </Surface>
          ))}
        </Section>

        <Section title="P4 · Materyal — gölge merdiveni ve glow (04 §9-§10)">
          <Text role="caption" tone="secondary">
            gölge: soft (standart kart) · card (feature/hero) · elevated (modal) ·
            glow yalnız selected/active/celestial/ceremonial, viewport başına
            en fazla 2 kaynak &mdash; iOS&apos;ta halo, Android&apos;de
            elevation-siz no-op
          </Text>
          <View style={styles.row}>
            {(['soft', 'card', 'elevated'] as const).map((level) => (
              <Surface
                key={level}
                role="card"
                radius="lg"
                bordered
                style={[styles.materialSwatch, shadowStyle(level)]}>
                <AppText variant="uiCaption">{level}</AppText>
              </Surface>
            ))}
          </View>
          <View style={styles.row}>
            {(['botanical', 'selection', 'celestial', 'ceremonial'] as const).map((name) => (
              <Surface
                key={name}
                role="card"
                radius="lg"
                style={[styles.materialSwatch, glowStyle(name)]}>
                <AppText variant="uiCaption">{name}</AppText>
              </Surface>
            ))}
          </View>
        </Section>

        <Section title="P4 · DailyHerbHero — Home hero'su (görselli / görselsiz)">
          <Text role="caption" tone="secondary">
            KATMANSIZ: görselin üstünde vinyet/sis/ışık/bulut YOK · adlar
            fotoğrafın ALTINDAKİ krem şeritte (koyu patlıcan Cinzel + açık mor
            Jost italik) · kontrast görselden tamamen bağımsız, token seviyesinde
            doğrulanmış · tek hareket paralaks
          </Text>
          <DailyHerbHero
            commonName="Lavanta"
            scientificName="Lavandula angustifolia"
            imagePath="lavanta/card-01.webp"
            imageVersion={1}
            imageHeight={HOME_HERO_HEIGHT}
            dateLabel="2 Eylül, Çarşamba"
            moonChip={
              <HeroMoonChip>
                <MoonPhaseGlyph phase="dolunay" />
                <AppText variant="uiLabel" style={{ color: primitive.material.onPanel.primary }}>
                  Ay Koç&apos;ta · Dolunay
                </AppText>
              </HeroMoonChip>
            }
            accessibilityLabel="Günün bitkisi: Lavanta, Lavandula angustifolia"
            onPress={noop}
          />
          <DailyHerbHero
            commonName="Papatya"
            scientificName="Matricaria chamomilla"
            imagePath={null}
            imageVersion={null}
            imageHeight={HOME_HERO_HEIGHT}
            accessibilityLabel="Günün bitkisi: Papatya, Matricaria chamomilla"
          />
        </Section>
      </ScrollView>
    </>
  );
}

/**
 * RNSVG native kayıt kontrolü + hata sınırı — SVG native'i kurulu build'de
 * yoksa (eski dev client) glyph render'ı ViewManagerRegistry /
 * IllegalViewOperationException ile native tarafta çöker ve jest bunu
 * YAKALAYAMAZ (mock native kaydı taklit etmez). Guard iki katman:
 * 1) TurboModule kaydı yoksa glyph bölümleri hiç render edilmez; cihazda
 *    teşhis metni görünür (hangi build'in kurulu olduğu anlaşılır).
 * 2) Beklenmedik render hatası ErrorBoundary'de kalır — galeri açık kalır.
 */
const svgNativeAvailable = TurboModuleRegistry.get('RNSVGSvgViewModule') != null;

class GlyphSectionGuard extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (!svgNativeAvailable) {
      return (
        <Section title="P2 · Glyphs — SVG NATIVE KAYDI YOK">
          <Text role="body.s" tone="secondary">
            RNSVGSvgViewModule TurboModule kaydı bulunamadı: kurulu dev client
            react-native-svg İÇERMİYOR (muhtemelen eski build). Build d86c16fa
            (commit 3f4739c) APK&apos;sını kurup uygulamayı tamamen kapatıp yeniden
            açın. Glyph bölümleri çökmeyi önlemek için gizlendi.
          </Text>
        </Section>
      );
    }
    if (this.state.error) {
      return (
        <Section title="P2 · Glyphs — RENDER HATASI (yakalandı)">
          <Text role="body.s" tone="secondary">
            {String(this.state.error.message || this.state.error)}
          </Text>
        </Section>
      );
    }
    return this.props.children;
  }
}

/**
 * Nefes demosu — resolveGlyphBreath sözleşmesinin görsel kabulü. Ambient
 * kapalıyken (reduced motion) animasyon hiç KURULMAZ; statik glyph kalır.
 */
function GlyphBreathDemo() {
  const atmosphere = useAtmosphere();
  const { animate, toScale } = resolveGlyphBreath(atmosphere.ambient.ambientEnabled);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (animate) {
      scale.value = withRepeat(
        withTiming(toScale, {
          duration: GLYPH_BREATH_DURATION_MS,
          easing: motionEasing.standard,
        }),
        -1,
        true,
      );
    } else {
      cancelAnimation(scale);
      scale.value = 1;
    }
    return () => cancelAnimation(scale);
  }, [animate, toScale, scale]);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.breathBox, breathStyle]}>
      <PlanetGlyph planet="moon" size={48} decorative />
    </Animated.View>
  );
}

/** Herb.data JSONB'sinden Latince ad (motor tablo `names.la`); yoksa em dash. */
/**
 * Canlı vitrin: fetchHerbs → görseli olan ilk 4 bitki, PlantCard media
 * slotunda HerbImage ile. Supabase yapılandırılmamışsa/DB boşsa teşhis metni
 * gösterir — galeri çökmez (dev-gallery native kapı deseniyle tutarlı).
 */
function LiveHerbCards() {
  const [herbs, setHerbs] = useState<Herb[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchHerbs()
      .then((h) => alive && setHerbs(h))
      .catch((e: unknown) => alive && setLoadError(e instanceof Error ? e.message : String(e)));
    return () => {
      alive = false;
    };
  }, []);

  if (loadError) {
    return (
      <Text role="body.s" tone="secondary">
        canlı veri alınamadı: {loadError}
      </Text>
    );
  }
  if (!herbs) {
    return (
      <Text role="body.s" tone="secondary">
        yükleniyor…
      </Text>
    );
  }

  const withImage = herbs.filter((h) => h.image_path);
  const shown = (withImage.length ? withImage : herbs).slice(0, 4);

  return (
    <>
      <Text role="caption" tone="secondary">
        {withImage.length}/{herbs.length} bitkide görsel var · ilk 4 gösteriliyor
        {withImage.length === 0 ? ' (görsel yok → yer tutucu sözleşmesi canlıda)' : ''}
      </Text>
      {shown.map((herb) => (
        <PlantCard
          key={herb.herb_id}
          variant="grid"
          commonName={herb.name_tr ?? herb.herb_id}
          scientificName={herbLatin(herb) ?? '—'}
          toxicityBadge={herb.data?.guvenlik?.uyari_chip ?? undefined}
          media={
            <HerbImage
              imagePath={herb.image_path}
              imageVersion={herb.image_version}
              scientificName={herbLatin(herb) ?? '—'}
            />
          }
        />
      ))}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Divider />
      <Text role="heading.m">{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  section: { gap: Spacing.two },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  stateBox: { height: 400 },
  swatch: {
    width: Spacing.four,
    height: Spacing.four,
    borderRadius: Radius.sm,
  },
  specCard: {
    gap: Spacing.one,
    padding: Spacing.two,
    borderRadius: Radius.md,
  },
  panelContent: {
    padding: Spacing.three,
  },
  glyphCell: {
    alignItems: 'center',
    gap: Spacing.half,
    minWidth: Spacing.six,
  },
  breathBox: {
    alignSelf: 'flex-start',
    padding: Spacing.two,
  },
  // Materyal vitrin kutuları — cam/gölge/glow token'ları izole görünsün.
  materialBox: {
    padding: Spacing.three,
    gap: Spacing.half,
  },
  materialSwatch: {
    minWidth: Spacing.six + Spacing.four,
    padding: Spacing.three,
    alignItems: 'center',
  },
  // HerbImage vitrin hücresi — kart medya oranı (07 §6 grid: 4:5).
  herbImageCell: {
    width: '46%',
    aspectRatio: 4 / 5,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
});
