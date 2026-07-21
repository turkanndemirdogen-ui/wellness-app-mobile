/**
 * ScreenVisualSpec — ekran seviyesi görsel sözleşme (15 §6-8).
 *
 * Her ekran açık HEX + spacing sözleşmesi taşır; ScreenShell bu spec'i tüketir.
 * HEX'ler token kaynağından okunur (gate: ekrana ham hex yazılmaz) ve 15'in
 * kesin değerleriyle birebirdir — birebirlik __tests__/screen-spec-integrity
 * ile doğrulanır.
 *
 * KURAL (15 §4): visualPanels (panel-only dark) renkleri backgroundHex /
 * surfaceHex OLAMAZ — assertScreenSpec + token-gate 'panelDark' kuralı korur.
 * Koyuluk yalnız visualPanelHex üzerinden VisualPanel'e gider.
 */

import { primitive } from './primitive.generated';

const chrome = primitive.color.chrome;
const botanical = primitive.color.botanical;
const celestial = primitive.color.celestial;
const panels = primitive.color.visualPanels;
const layout = primitive.layout;

export type MotionLevel = 'M0' | 'M1' | 'M2' | 'M3';

export type ScreenVisualSpec = {
  screenId: string;
  backgroundHex: string;
  surfaceHex: string;
  accentHex: string;
  visualPanelHex?: string;
  horizontalPadding: number;
  topPadding: number;
  sectionGap: number;
  cardGap: number;
  heroHeight?: number;
  cardRadius: number;
  panelRadius: number;
  motionLevel: MotionLevel;
  maxAnimatedElements: 0 | 1 | 2;
};

/** Panel-only dark HEX havuzu — screen background olarak YASAK (15 §4). */
export const PANEL_DARK_HEXES: readonly string[] = Object.values(panels);

/**
 * Spec doğrulayıcı: koyu panel rengini zemin/yüzey olarak reddeder,
 * maxAnimatedElements'i 15 §9 sınırına bağlar. ScreenShell her spec'i
 * bundan geçirir; testler tüm spec'lere uygular.
 */
export function assertScreenSpec(spec: ScreenVisualSpec): ScreenVisualSpec {
  if (PANEL_DARK_HEXES.includes(spec.backgroundHex)) {
    throw new Error(
      `[screen-spec] ${spec.screenId}: visualPanels rengi screen background olamaz (15 §4)`,
    );
  }
  if (PANEL_DARK_HEXES.includes(spec.surfaceHex)) {
    throw new Error(
      `[screen-spec] ${spec.screenId}: visualPanels rengi surface olamaz (15 §4)`,
    );
  }
  if (spec.maxAnimatedElements > primitive.motionLimits.maxAnimatedElementsPerScreen) {
    throw new Error(
      `[screen-spec] ${spec.screenId}: maxAnimatedElements > ${primitive.motionLimits.maxAnimatedElementsPerScreen} (15 §9)`,
    );
  }
  if (spec.motionLevel === 'M0' && spec.maxAnimatedElements !== 0) {
    throw new Error(`[screen-spec] ${spec.screenId}: M0 ekranında animasyonlu öğe olamaz`);
  }
  return spec;
}

// ---------------------------------------------------------------------------
// Ana tablar (15 §7 — değerler birebir kilitli)
// ---------------------------------------------------------------------------

export const homeSpec: ScreenVisualSpec = assertScreenSpec({
  screenId: 'home',
  backgroundHex: chrome.background,
  surfaceHex: chrome.surface,
  accentHex: botanical.sage,
  visualPanelHex: panels.dusk,
  horizontalPadding: layout.screenPadding,
  topPadding: layout.topPadding,
  sectionGap: layout.sectionGap,
  cardGap: layout.cardGap,
  heroHeight: 280,
  cardRadius: layout.cardRadius,
  panelRadius: layout.heroRadius,
  motionLevel: 'M1',
  maxAnimatedElements: 2,
});

export const exploreSpec: ScreenVisualSpec = assertScreenSpec({
  screenId: 'explore',
  backgroundHex: chrome.backgroundAlt,
  surfaceHex: chrome.surface,
  accentHex: celestial.sky,
  visualPanelHex: panels.astrology,
  horizontalPadding: layout.screenPadding,
  topPadding: layout.topPadding,
  sectionGap: 32,
  cardGap: layout.largeCardGap,
  heroHeight: 220,
  cardRadius: layout.cardRadius,
  panelRadius: layout.heroRadius,
  motionLevel: 'M1',
  maxAnimatedElements: 1,
});

export const gardenSpec: ScreenVisualSpec = assertScreenSpec({
  screenId: 'garden',
  backgroundHex: chrome.parchment,
  surfaceHex: chrome.surface,
  accentHex: botanical.moss,
  visualPanelHex: panels.gardenNight,
  horizontalPadding: layout.compactScreenPadding,
  topPadding: 12,
  sectionGap: 24,
  cardGap: layout.cardGap,
  heroHeight: 360,
  cardRadius: layout.cardRadius,
  panelRadius: layout.heroRadius,
  motionLevel: 'M1',
  maxAnimatedElements: 2,
});

export const chatSpec: ScreenVisualSpec = assertScreenSpec({
  screenId: 'chat',
  backgroundHex: chrome.background,
  surfaceHex: chrome.surface,
  accentHex: celestial.violet,
  visualPanelHex: panels.ritual,
  horizontalPadding: layout.compactScreenPadding,
  topPadding: 12,
  sectionGap: layout.denseSectionGap,
  cardGap: 10,
  cardRadius: layout.cardRadius,
  panelRadius: 20,
  motionLevel: 'M0',
  maxAnimatedElements: 0,
});

// ---------------------------------------------------------------------------
// Alt ekranlar (15 §8 — tab DEĞİL; ilgili tabın içinden stack route olarak açılır)
// ---------------------------------------------------------------------------

export const moodSpec: ScreenVisualSpec = assertScreenSpec({
  screenId: 'mood',
  backgroundHex: chrome.backgroundAlt,
  surfaceHex: chrome.surface,
  accentHex: botanical.eucalyptus,
  horizontalPadding: layout.screenPadding,
  topPadding: layout.topPadding,
  sectionGap: 24,
  cardGap: layout.cardGap,
  heroHeight: 180,
  cardRadius: layout.cardRadius,
  panelRadius: layout.heroRadius,
  motionLevel: 'M2',
  maxAnimatedElements: 1,
});

export const cycleSpec: ScreenVisualSpec = assertScreenSpec({
  screenId: 'cycle',
  backgroundHex: chrome.background,
  surfaceHex: chrome.surface,
  accentHex: botanical.terracotta,
  visualPanelHex: celestial.indigo,
  horizontalPadding: layout.screenPadding,
  topPadding: layout.topPadding,
  sectionGap: 24,
  cardGap: layout.cardGap,
  heroHeight: 220,
  cardRadius: layout.cardRadius,
  panelRadius: layout.heroRadius,
  motionLevel: 'M1',
  maxAnimatedElements: 1,
});

export const skinCareSpec: ScreenVisualSpec = assertScreenSpec({
  screenId: 'skinCare',
  backgroundHex: chrome.backgroundAlt,
  surfaceHex: chrome.surface,
  accentHex: botanical.eucalyptus,
  horizontalPadding: layout.screenPadding,
  topPadding: layout.topPadding,
  sectionGap: 24,
  cardGap: layout.cardGap,
  heroHeight: 180,
  cardRadius: layout.cardRadius,
  panelRadius: layout.heroRadius,
  motionLevel: 'M0',
  maxAnimatedElements: 0,
});

export const journalSpec: ScreenVisualSpec = assertScreenSpec({
  screenId: 'journal',
  backgroundHex: chrome.parchment,
  surfaceHex: chrome.surface,
  accentHex: botanical.bark,
  horizontalPadding: layout.screenPadding,
  topPadding: layout.topPadding,
  sectionGap: 24,
  cardGap: layout.cardGap,
  cardRadius: layout.cardRadius,
  panelRadius: layout.heroRadius,
  motionLevel: 'M0',
  maxAnimatedElements: 0,
});

export const plantsSpec: ScreenVisualSpec = assertScreenSpec({
  screenId: 'plants',
  backgroundHex: chrome.background,
  surfaceHex: chrome.surface,
  accentHex: botanical.sage,
  horizontalPadding: layout.screenPadding,
  topPadding: layout.topPadding,
  sectionGap: 24,
  cardGap: layout.cardGap,
  heroHeight: 260,
  cardRadius: layout.cardRadius,
  panelRadius: layout.heroRadius,
  motionLevel: 'M1',
  maxAnimatedElements: 1,
});

export const astrologySpec: ScreenVisualSpec = assertScreenSpec({
  screenId: 'astrology',
  backgroundHex: chrome.backgroundAlt,
  surfaceHex: chrome.surface,
  accentHex: celestial.dusk,
  visualPanelHex: panels.astrology,
  horizontalPadding: layout.screenPadding,
  topPadding: layout.topPadding,
  sectionGap: 24,
  cardGap: layout.cardGap,
  heroHeight: 260,
  cardRadius: layout.cardRadius,
  panelRadius: layout.heroRadius,
  motionLevel: 'M1',
  maxAnimatedElements: 1,
});

export const ritualsSpec: ScreenVisualSpec = assertScreenSpec({
  screenId: 'rituals',
  backgroundHex: chrome.background,
  surfaceHex: chrome.surface,
  accentHex: celestial.gold,
  visualPanelHex: panels.ritual,
  horizontalPadding: layout.screenPadding,
  topPadding: layout.topPadding,
  sectionGap: 24,
  cardGap: layout.cardGap,
  heroHeight: 280,
  cardRadius: layout.cardRadius,
  panelRadius: layout.heroRadius,
  motionLevel: 'M3',
  maxAnimatedElements: 2,
});

/** Ana tab spec'leri — 15 §2 dört sabit tab (`home|explore|garden|chat`). */
export const mainTabSpecs = { homeSpec, exploreSpec, gardenSpec, chatSpec } as const;

/** Alt ekran spec'leri (15 §8). */
export const subScreenSpecs = {
  moodSpec,
  cycleSpec,
  skinCareSpec,
  journalSpec,
  plantsSpec,
  astrologySpec,
  ritualsSpec,
} as const;

export const allScreenSpecs = { ...mainTabSpecs, ...subScreenSpecs } as const;
