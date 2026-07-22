/**
 * MoonPhaseDataGlyph — faza göre VERİ glyphi dispatcher'ı (05 §8).
 *
 * Veri glyphi: düz, tek renkli, fazı DOĞRU temsil eder, bağlamda label ile
 * kullanılır. Dekoratif ay (hero/ambient illüstrasyonu) AYRI katmandır ve bu
 * bileşenle karıştırılmaz — o iş sanat-yönü kilidini bekler.
 */

import type { ComponentType } from 'react';

import type { GlyphSvgProps } from './base';
import type { MoonPhaseGlyphName } from './types';
import { NewMoon } from './moon-phases/NewMoon';
import { WaxingCrescent } from './moon-phases/WaxingCrescent';
import { FirstQuarter } from './moon-phases/FirstQuarter';
import { WaxingGibbous } from './moon-phases/WaxingGibbous';
import { FullMoon } from './moon-phases/FullMoon';
import { WaningGibbous } from './moon-phases/WaningGibbous';
import { LastQuarter } from './moon-phases/LastQuarter';
import { WaningCrescent } from './moon-phases/WaningCrescent';

const MOON_PHASE_COMPONENTS: Record<MoonPhaseGlyphName, ComponentType<GlyphSvgProps>> = {
  new: NewMoon,
  waxingCrescent: WaxingCrescent,
  firstQuarter: FirstQuarter,
  waxingGibbous: WaxingGibbous,
  full: FullMoon,
  waningGibbous: WaningGibbous,
  lastQuarter: LastQuarter,
  waningCrescent: WaningCrescent,
};

export type MoonPhaseDataGlyphProps = GlyphSvgProps & { phase: MoonPhaseGlyphName };

export function MoonPhaseDataGlyph({ phase, ...rest }: MoonPhaseDataGlyphProps) {
  const Component = MOON_PHASE_COMPONENTS[phase];
  return <Component {...rest} />;
}
