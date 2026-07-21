/**
 * Test 3 — panel dark colors not usable as screen backgrounds (15 §4):
 * koyu panel renkleri hiçbir spec'te zemin/yüzey olamaz; doğrulayıcı reddeder.
 */

import { primitive } from '@/design-system/tokens/primitive.generated';
import {
  allScreenSpecs,
  assertScreenSpec,
  homeSpec,
  PANEL_DARK_HEXES,
} from '@/design-system/tokens/screen-specs';

describe('panel-only dark yasağı (15 §4)', () => {
  test('PANEL_DARK_HEXES 5 koyu paneli kapsar', () => {
    expect(PANEL_DARK_HEXES).toHaveLength(5);
    expect(PANEL_DARK_HEXES).toEqual(Object.values(primitive.color.visualPanels));
  });

  test('hiçbir spec koyu paneli background/surface olarak kullanmaz', () => {
    for (const spec of Object.values(allScreenSpecs)) {
      expect(PANEL_DARK_HEXES).not.toContain(spec.backgroundHex);
      expect(PANEL_DARK_HEXES).not.toContain(spec.surfaceHex);
    }
  });

  test('assertScreenSpec koyu background önerisini reddeder', () => {
    expect(() =>
      assertScreenSpec({ ...homeSpec, backgroundHex: primitive.color.visualPanels.night }),
    ).toThrow(/screen background olamaz/);
    expect(() =>
      assertScreenSpec({ ...homeSpec, surfaceHex: primitive.color.visualPanels.ritual }),
    ).toThrow(/surface olamaz/);
  });

  test('proTeaser lockedPanel de panel-dark havuzundadır (image-backed alan kuralı)', () => {
    expect(PANEL_DARK_HEXES).toContain(primitive.proTeaser.lockedPanel);
  });
});
