/**
 * GERÇEK react-native-svg JS katmanı sanity testi — global mock bu dosyada
 * DEVRE DIŞI. Amaç: glyph prop'larının (d path'leri, fill="none",
 * currentColor, strokeLinecap…) gerçek paketin extractor/prop-işleme
 * katmanından hatasız geçtiğini doğrulamak. (dev-gallery çökme dersinin test
 * boşluğu: host-component mock'u bu katmanı bypass ediyordu. Native
 * ViewManager KAYDI ise jest'te doğrulanamaz — o boşluk dev-gallery'deki
 * GlyphSectionGuard runtime kontrolüyle kapatıldı.)
 *
 * Yalnız RNSVG TurboModule'leri cerrahi stub'lanır; RN çekirdeği gerçektir.
 */

jest.unmock('react-native-svg');
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => {
  const actual = jest.requireActual('react-native/Libraries/TurboModule/TurboModuleRegistry');
  const rnsvgStub = new Proxy({}, { get: () => jest.fn() });
  return {
    ...actual,
    get: (name: string) => (name.startsWith('RNSVG') ? rnsvgStub : actual.get(name)),
    getEnforcing: (name: string) =>
      name.startsWith('RNSVG') ? rnsvgStub : actual.getEnforcing(name),
  };
});

import TestRenderer, { act } from 'react-test-renderer';

import {
  MOON_PHASE_GLYPH_NAMES,
  MoonPhaseDataGlyph,
  PLANET_GLYPH_NAMES,
  PlanetGlyph,
  ZODIAC_GLYPH_NAMES,
  ZodiacGlyph,
} from '@/design-system/glyphs';

function renderWithRealSvg(element: React.ReactElement) {
  let renderer!: TestRenderer.ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(element);
  });
  return renderer;
}

describe('gerçek react-native-svg JS katmanı (30/30 hatasız render)', () => {
  test.each(PLANET_GLYPH_NAMES)('planet: %s', (planet) => {
    expect(() => renderWithRealSvg(<PlanetGlyph planet={planet} decorative />)).not.toThrow();
  });

  test.each(ZODIAC_GLYPH_NAMES)('zodiac: %s (üç mod)', (sign) => {
    expect(() => renderWithRealSvg(<ZodiacGlyph sign={sign} decorative />)).not.toThrow();
    expect(() =>
      renderWithRealSvg(<ZodiacGlyph sign={sign} mode="element" decorative />),
    ).not.toThrow();
    expect(() =>
      renderWithRealSvg(<ZodiacGlyph sign={sign} mode="profile" profileRole="rising" decorative />),
    ).not.toThrow();
  });

  test.each(MOON_PHASE_GLYPH_NAMES)('moon-phase: %s', (phase) => {
    expect(() => renderWithRealSvg(<MoonPhaseDataGlyph phase={phase} decorative />)).not.toThrow();
  });

  it('gerçek paket RNSVG host bileşenlerine çözümlenir (mock değil)', () => {
    const tree = renderWithRealSvg(<PlanetGlyph planet="sun" decorative />).toJSON();
    // Gerçek react-native-svg render ağacı RNSVG* host adları üretir; bizim
    // manuel mock'umuz 'Svg'/'Circle' üretirdi — bu test gerçek paketi kanıtlar.
    expect(JSON.stringify(tree)).toContain('RNSVG');
  });
});
