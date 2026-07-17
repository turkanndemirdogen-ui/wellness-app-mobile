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

import { Spacing } from '@/constants/theme';
import { shellCopy } from '@/content/shell-copy';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  IconButton,
  ListItem,
  Loader,
  OfflineState,
  Reveal,
  Skeleton,
  type ButtonVariant,
} from '@/design-system/components';
import { useMotionScale, useWidthClass } from '@/design-system/hooks';
import { Divider, Icon, Text, type IconName } from '@/design-system/primitives';
import { textRoles, useTheme, type TextRoleName } from '@/design-system/theme';

const ICON_NAMES: IconName[] = ['moon', 'crystalBall', 'herb', 'chat', 'seedling', 'sparkles'];
const TEXT_ROLES = Object.keys(textRoles) as TextRoleName[];
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
});
