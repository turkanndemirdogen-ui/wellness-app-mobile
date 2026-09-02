/**
 * PlantCard — bitki kartı (07 §6). Zorunlu alanlar: yaygın ad, bilimsel ad,
 * görsel/placeholder, kaydet eylemi; opsiyonel: familya, etiketler, toksisite
 * rozeti. Varyantlar: grid · list · feature · compact.
 *
 * KİLİT (07 §6): bilimsel ad HİÇBİR varyantta tamamen gizlenmez — compact'ta
 * görünmez ama kartın accessibilityLabel'ında TAM görünür. Yaygın ad Fraunces
 * (plantName), bilimsel ad italik (scientificName variant, 03 §9). Toksisite
 * metni Safety-owned → PROP'la gelir (component üretmez). List/compact tekrar
 * eden satırlardır → gölge yok (04 §9). Feature vurgu kartı (elevation level2).
 *
 * `description`: bitkinin tek satırlık editoryal cümlesi (Lora `reading`).
 * Yalnız tam kartlarda (grid/feature) görünür; list/compact tekrar eden
 * satırlar olduğu için metin taşımaz. İçerik PROP'la gelir (03 §8.2).
 */

import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText, Icon, Surface } from '../primitives';
import { primitive } from '../tokens/primitive.generated';
import { useTheme } from '../theme';
import { IconButton } from './button';
import { AnimatedPressable, usePressFeedback } from './use-press-feedback';

export type PlantCardVariant = 'grid' | 'list' | 'feature' | 'compact';

/** feature varyantının medya en-boy oranı — iskelet yuvaları buna hizalanır (§36). */
export const PLANT_CARD_FEATURE_MEDIA_ASPECT = 16 / 9;

export type PlantCardProps = {
  commonName: string;
  scientificName: string;
  /** Medya slotu (illüstrasyon). Verilmezse placeholder (herb ikonu). */
  media?: ReactNode;
  family?: string;
  /** Tek satırlık editoryal cümle (grid/feature'da görünür). */
  description?: string;
  tags?: string[];
  /** Toksisite rozeti metni (Safety-owned; PROP'la gelir). */
  toxicityBadge?: string;
  /** Kaydet eylemi; verilirse `saveLabel` (TR) zorunlu. */
  onSave?: () => void;
  saved?: boolean;
  saveLabel?: string;
  variant?: PlantCardVariant;
  onPress?: () => void;
  disabled?: boolean;
  /** Verilmezse yaygın+bilimsel(+familya) adlardan kurulur (bilimsel ad daima dahil). */
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

type VariantCfg = {
  direction: 'row' | 'column';
  showScientific: boolean;
  /** Tek satırlık açıklama bu varyantta gösterilir mi (tekrar eden satırlarda hayır). */
  showDescription: boolean;
  nameVariant: 'displayHero' | 'plantName' | 'uiBody';
  /** Sabit thumb kenarı (row varyantları); undefined → tam genişlik medya. */
  mediaSize?: number;
};

const VARIANT: Record<PlantCardVariant, VariantCfg> = {
  grid: { direction: 'column', showScientific: true, showDescription: true, nameVariant: 'plantName' },
  // feature = ekranın hero kartı → yaygın ad hero title ölçeğinde (03 §7.1).
  feature: { direction: 'column', showScientific: true, showDescription: true, nameVariant: 'displayHero' },
  list: { direction: 'row', showScientific: true, showDescription: false, nameVariant: 'plantName', mediaSize: primitive.space.s64 },
  compact: { direction: 'row', showScientific: false, showDescription: false, nameVariant: 'uiBody', mediaSize: primitive.space.s40 },
};

export function PlantCard({
  commonName,
  scientificName,
  media,
  family,
  description,
  tags,
  toxicityBadge,
  onSave,
  saved = false,
  saveLabel,
  variant = 'grid',
  onPress,
  disabled = false,
  accessibilityLabel,
  testID,
  style,
}: PlantCardProps) {
  const { colors } = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressFeedback();
  const cfg = VARIANT[variant];

  if (__DEV__ && onSave && !saveLabel) {
    console.warn('[PlantCard] onSave verildiğinde saveLabel (TR) zorunlu (07 §15/§43).');
  }

  // Bilimsel ad daima a11y label'ında (compact'ta görünmese de — 07 §6).
  const label =
    accessibilityLabel ??
    [commonName, scientificName, family, toxicityBadge].filter(Boolean).join(', ');

  const mediaDims: ViewStyle = cfg.mediaSize
    ? { width: cfg.mediaSize, height: cfg.mediaSize }
    : {
        width: '100%',
        aspectRatio: variant === 'feature' ? PLANT_CARD_FEATURE_MEDIA_ASPECT : 4 / 5,
      };

  const mediaNode = (
    <Surface role="card" radius="md" style={[mediaDims, mediaBox]}>
      {media ?? (
        <Icon
          name="herb"
          size={cfg.mediaSize && cfg.mediaSize <= primitive.space.s40 ? 'md' : 'lg'}
          decorative
          color={colors.text.secondary}
        />
      )}
    </Surface>
  );

  const saveNode = onSave ? (
    <IconButton
      icon={saved ? 'savedBookmark' : 'bookmark'}
      label={saveLabel ?? commonName}
      variant="ghost"
      onPress={onSave}
      disabled={disabled}
    />
  ) : null;

  const content = (
    <View style={contentColumn}>
      <View style={headRow}>
        <View style={nameColumn}>
          <AppText variant={cfg.nameVariant} numberOfLines={2}>
            {commonName}
          </AppText>
          {cfg.showScientific ? (
            <AppText variant="scientificName" numberOfLines={1}>
              {scientificName}
            </AppText>
          ) : null}
          {family ? (
            <AppText variant="uiCaption" tone="secondary" numberOfLines={1}>
              {family}
            </AppText>
          ) : null}
        </View>
        {saveNode}
      </View>

      {description && cfg.showDescription ? (
        <AppText variant="reading" tone="secondary">
          {description}
        </AppText>
      ) : null}

      {tags?.length ? (
        <View style={tagRow}>
          {tags.map((tag, i) => (
            <Surface key={`${tag}-${i}`} role="base" radius="full" style={tagPill}>
              <AppText variant="uiCaption" tone="secondary">
                {tag}
              </AppText>
            </Surface>
          ))}
        </View>
      ) : null}

      {toxicityBadge ? (
        <Surface role="base" radius="full" style={toxBadge}>
          <Icon name="alert" size="sm" decorative color={colors.action.destructive} />
          <AppText variant="uiCaption" style={{ color: colors.action.destructive }}>
            {toxicityBadge}
          </AppText>
        </Surface>
      ) : null}
    </View>
  );

  const cardRadius = variant === 'feature' ? primitive.radius.xl : primitive.radius.lg;
  const elevation =
    variant === 'feature'
      ? primitive.elevation.level2
      : variant === 'list' || variant === 'compact'
        ? primitive.elevation.level0
        : primitive.elevation.level1;

  const containerStyle: StyleProp<ViewStyle> = [
    baseContainer,
    {
      flexDirection: cfg.direction,
      backgroundColor: colors.surface.card,
      borderRadius: cardRadius,
      padding: variant === 'compact' ? primitive.space.s12 : primitive.space.s16,
      elevation,
    },
    disabled ? { opacity: primitive.opacity.disabled } : null,
    style,
  ];

  if (onPress) {
    return (
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        testID={testID}
        style={[containerStyle, animatedStyle]}>
        {mediaNode}
        {content}
      </AnimatedPressable>
    );
  }

  return (
    <View accessible accessibilityLabel={label} testID={testID} style={containerStyle}>
      {mediaNode}
      {content}
    </View>
  );
}

const baseContainer: ViewStyle = {
  gap: primitive.space.s12,
  alignItems: 'stretch',
};

const mediaBox: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
};

const contentColumn: ViewStyle = { flex: 1, gap: primitive.space.s8, justifyContent: 'center' };
const headRow: ViewStyle = { flexDirection: 'row', alignItems: 'flex-start', gap: primitive.space.s8 };
const nameColumn: ViewStyle = { flex: 1, gap: primitive.space.s2 };
const tagRow: ViewStyle = { flexDirection: 'row', flexWrap: 'wrap', gap: primitive.space.s4 };
const tagPill: ViewStyle = {
  paddingHorizontal: primitive.space.s8,
  paddingVertical: primitive.space.s2,
};
const toxBadge: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  gap: primitive.space.s4,
  paddingHorizontal: primitive.space.s8,
  paddingVertical: primitive.space.s2,
};
