/**
 * Test 7 — reduced motion resolver (15 §9): açıkken TÜM ambient durur;
 * içerik/işlev kaybolmaz (statik değerler döner, undefined değil).
 */

import {
  getAtmospherePhase,
  resolveAmbientMotion,
  resolvePanelBackground,
} from '@/design-system/theme/atmosphere-provider';
import { primitive } from '@/design-system/tokens/primitive.generated';

describe('reduced motion resolver (15 §9)', () => {
  test('reduced=true → ambient tamamen durur, ölçekler nötr', () => {
    const r = resolveAmbientMotion(true);
    expect(r.ambientEnabled).toBe(false);
    expect(r.maxScale).toBe(1);
    expect(r.pressScale).toBe(1);
  });

  test('reduced=false → 15 §9 limitleri', () => {
    const r = resolveAmbientMotion(false);
    expect(r.ambientEnabled).toBe(true);
    expect(r.maxScale).toBe(primitive.motionLimits.maxScale);
    expect(r.pressScale).toBe(primitive.motionLimits.pressScale);
  });

  test('atmosfer evreleri saat tablosu', () => {
    expect(getAtmospherePhase(new Date(2026, 6, 21, 10))).toBe('day');
    expect(getAtmospherePhase(new Date(2026, 6, 21, 18))).toBe('dusk');
    expect(getAtmospherePhase(new Date(2026, 6, 21, 23))).toBe('night');
    expect(getAtmospherePhase(new Date(2026, 6, 21, 3))).toBe('night');
  });

  test('fixedLight tercihi panelleri de aydınlık tutar (koyulaşma tamamen kapalı)', () => {
    expect(resolvePanelBackground('ritual', 'night', true)).toBe(
      primitive.color.chrome.surfaceTint,
    );
    expect(resolvePanelBackground('ritual', 'day', false)).toBe(
      primitive.color.chrome.surfaceTint,
    );
    expect(resolvePanelBackground('ritual', 'night', false)).toBe(
      primitive.color.visualPanels.ritual,
    );
  });
});
