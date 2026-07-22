/**
 * PlanetGlyph — ada göre gezegen glyph dispatcher'ı (05 §6).
 *
 * Renk verilmezse 02 §6 planet.* token'ından gelir; gezegen rengi içerik
 * boyunca tutarlı kalır, tek mor set YASAK. Gerçek astrolojik veriye bağlı
 * kullanım label + derece ile desteklenir (glyph tek başına anlam taşımaz).
 */

import type { ComponentType } from 'react';

import type { GlyphSvgProps } from './base';
import { primitive } from '../tokens/primitive.generated';
import type { PlanetGlyphName } from './types';
import { SunGlyph } from './planets/SunGlyph';
import { MoonGlyph } from './planets/MoonGlyph';
import { MercuryGlyph } from './planets/MercuryGlyph';
import { VenusGlyph } from './planets/VenusGlyph';
import { MarsGlyph } from './planets/MarsGlyph';
import { JupiterGlyph } from './planets/JupiterGlyph';
import { SaturnGlyph } from './planets/SaturnGlyph';
import { UranusGlyph } from './planets/UranusGlyph';
import { NeptuneGlyph } from './planets/NeptuneGlyph';
import { PlutoGlyph } from './planets/PlutoGlyph';

const PLANET_COMPONENTS: Record<PlanetGlyphName, ComponentType<GlyphSvgProps>> = {
  sun: SunGlyph,
  moon: MoonGlyph,
  mercury: MercuryGlyph,
  venus: VenusGlyph,
  mars: MarsGlyph,
  jupiter: JupiterGlyph,
  saturn: SaturnGlyph,
  uranus: UranusGlyph,
  neptune: NeptuneGlyph,
  pluto: PlutoGlyph,
};

export type PlanetGlyphProps = GlyphSvgProps & { planet: PlanetGlyphName };

export function PlanetGlyph({ planet, color, ...rest }: PlanetGlyphProps) {
  const Component = PLANET_COMPONENTS[planet];
  return <Component color={color ?? primitive.color.planet[planet]} {...rest} />;
}
