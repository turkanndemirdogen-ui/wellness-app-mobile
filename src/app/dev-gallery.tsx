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

import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import { Radius, Spacing } from '@/constants/theme';
import { shellCopy } from '@/content/shell-copy';
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
      </ScrollView>
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
});
