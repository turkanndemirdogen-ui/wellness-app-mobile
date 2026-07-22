/**
 * Glyph snapshot testleri (13 Phase 2 "Snapshot tests") — 30 glyph geometrisi
 * sabitlenir: "aynı glyphin farklı ekranlarda farklı geometriyle görünmesi"
 * yasağının (05 §13) otomasyonu. Geometri değişikliği BİLİNÇLİ olmalı
 * (snapshot güncellemesi PR'da görünür).
 */

import TestRenderer, { act } from 'react-test-renderer';

import {
  MOON_PHASE_GLYPH_NAMES,
  MoonPhaseDataGlyph,
  PLANET_GLYPH_NAMES,
  PlanetGlyph,
  ZODIAC_GLYPH_NAMES,
  ZodiacGlyph,
} from '@/design-system/glyphs';

function renderJson(element: React.ReactElement) {
  let renderer!: TestRenderer.ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(element);
  });
  return renderer.toJSON();
}

describe('glyph snapshots — 30/30', () => {
  test.each(PLANET_GLYPH_NAMES)('planet: %s', (planet) => {
    expect(renderJson(<PlanetGlyph planet={planet} decorative />)).toMatchSnapshot();
  });

  test.each(ZODIAC_GLYPH_NAMES)('zodiac: %s', (sign) => {
    expect(renderJson(<ZodiacGlyph sign={sign} decorative />)).toMatchSnapshot();
  });

  test.each(MOON_PHASE_GLYPH_NAMES)('moon-phase: %s', (phase) => {
    expect(renderJson(<MoonPhaseDataGlyph phase={phase} decorative />)).toMatchSnapshot();
  });
});
