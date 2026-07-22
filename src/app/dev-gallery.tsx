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
import { ScrollView, StyleSheet, TurboModuleRegistry, View } from 'react-native';
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
  AstrologyInterpretationNotice,
  Button,
  Card,
  EmptyState,
  ErrorState,
  HealthInformationNotice,
  IconButton,
  ListItem,
  Loader,
  OfflineState,
  ProTeaser,
  Reveal,
  Skeleton,
  SymbolicReferenceNotice,
  VisualPanel,
  type ButtonVariant,
} from '@/design-system/components';
import { useMotionScale, useWidthClass } from '@/design-system/hooks';
import { AppText, Divider, Icon, Text, type IconName } from '@/design-system/primitives';
import {
  appTextVariants,
  fontRoles,
  motionEasing,
  textRoles,
  useAtmosphere,
  useTheme,
  type AppTextVariant,
  type PanelKind,
  type TextRoleName,
} from '@/design-system/theme';
import { primitive } from '@/design-system/tokens/primitive.generated';
import { allScreenSpecs } from '@/design-system/tokens/screen-specs';
import { TR_TEST_STRING } from '@/lib/text-tr';

const ICON_NAMES: IconName[] = ['moon', 'crystalBall', 'herb', 'chat', 'seedling', 'sparkles'];
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

export default function DevGalleryRoute() {
  // Üretim derlemesinde rota içeriği yok — köke dön.
  if (!__DEV__) return <Redirect href="/" />;
  return <Gallery />;
}

function Gallery() {
  const { colors, timeOfDay } = useTheme();
  const { horizontalMargin, widthClass } = useWidthClass();
  const motionScale = useMotionScale();
  const atmosphere = useAtmosphere();
  const [revealKey, setRevealKey] = useState(0);

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
            roller: display={fontRoles.display} · reading={fontRoles.reading} · quote=
            {fontRoles.quote} · ceremonial={fontRoles.ceremonial} · ui={fontRoles.ui}
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
});
