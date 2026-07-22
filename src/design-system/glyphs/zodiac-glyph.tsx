/**
 * ZodiacGlyph — ada göre burç glyph dispatcher'ı (05 §7, 02 §7).
 *
 * Üç renk modu: default (tek sakin ton; dark varyantı YALNIZ koyu visual
 * panel üstü) · element (fire/earth/air/water) · profile (sun/moon/rising —
 * sun/moon planet token'ına, rising 02 metal.copper.500'e gider).
 * Gökkuşağı-neon set YASAK; explicit `color` her modu geçersiz kılar.
 */

import type { ComponentType } from 'react';

import type { GlyphSvgProps } from './base';
import { primitive } from '../tokens/primitive.generated';
import type { ZodiacGlyphName } from './types';
import { AriesGlyph } from './zodiac/AriesGlyph';
import { TaurusGlyph } from './zodiac/TaurusGlyph';
import { GeminiGlyph } from './zodiac/GeminiGlyph';
import { CancerGlyph } from './zodiac/CancerGlyph';
import { LeoGlyph } from './zodiac/LeoGlyph';
import { VirgoGlyph } from './zodiac/VirgoGlyph';
import { LibraGlyph } from './zodiac/LibraGlyph';
import { ScorpioGlyph } from './zodiac/ScorpioGlyph';
import { SagittariusGlyph } from './zodiac/SagittariusGlyph';
import { CapricornGlyph } from './zodiac/CapricornGlyph';
import { AquariusGlyph } from './zodiac/AquariusGlyph';
import { PiscesGlyph } from './zodiac/PiscesGlyph';

const ZODIAC_COMPONENTS: Record<ZodiacGlyphName, ComponentType<GlyphSvgProps>> = {
  aries: AriesGlyph,
  taurus: TaurusGlyph,
  gemini: GeminiGlyph,
  cancer: CancerGlyph,
  leo: LeoGlyph,
  virgo: VirgoGlyph,
  libra: LibraGlyph,
  scorpio: ScorpioGlyph,
  sagittarius: SagittariusGlyph,
  capricorn: CapricornGlyph,
  aquarius: AquariusGlyph,
  pisces: PiscesGlyph,
};

export type ZodiacElement = 'fire' | 'earth' | 'air' | 'water';

/** 02 §7 element eşlemesi. */
export const ZODIAC_ELEMENT: Record<ZodiacGlyphName, ZodiacElement> = {
  aries: 'fire',
  leo: 'fire',
  sagittarius: 'fire',
  taurus: 'earth',
  virgo: 'earth',
  capricorn: 'earth',
  gemini: 'air',
  libra: 'air',
  aquarius: 'air',
  cancer: 'water',
  scorpio: 'water',
  pisces: 'water',
};

export type ZodiacMode = 'default' | 'element' | 'profile';
export type ZodiacProfileRole = 'sun' | 'moon' | 'rising';

export type ZodiacGlyphProps = GlyphSvgProps & {
  sign: ZodiacGlyphName;
  /** 05 §7 kullanım modları; varsayılan `default`. */
  mode?: ZodiacMode;
  /** Yalnız mode="profile": rolün rengi (sun/moon/rising). */
  profileRole?: ZodiacProfileRole;
};

function resolveZodiacColor(
  sign: ZodiacGlyphName,
  mode: ZodiacMode,
  profileRole: ZodiacProfileRole,
): string {
  if (mode === 'element') return primitive.color.zodiac.element[ZODIAC_ELEMENT[sign]];
  if (mode === 'profile') return primitive.color.zodiac.profile[profileRole];
  return primitive.color.zodiac.default.light;
}

export function ZodiacGlyph({
  sign,
  mode = 'default',
  profileRole = 'sun',
  color,
  ...rest
}: ZodiacGlyphProps) {
  const Component = ZODIAC_COMPONENTS[sign];
  return <Component color={color ?? resolveZodiacColor(sign, mode, profileRole)} {...rest} />;
}
