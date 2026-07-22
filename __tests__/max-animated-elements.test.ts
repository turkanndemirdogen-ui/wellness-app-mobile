/**
 * Test 8 — max animated elements constraint (15 §9): ekran başına 1-2
 * animasyonlu öğe; M0 ekranda 0; doğrulayıcı aşımı reddeder.
 */

import { primitive } from '@/design-system/tokens/primitive.generated';
import {
  allScreenSpecs,
  assertScreenSpec,
  chatSpec,
  homeSpec,
} from '@/design-system/tokens/screen-specs';

describe('motion limitleri (15 §9)', () => {
  test('motionLimits kilit değerleri', () => {
    expect(primitive.motionLimits.maxScale).toBe(1.02);
    expect(primitive.motionLimits.pressScale).toBe(0.98);
    expect(primitive.motionLimits.maxAnimatedElementsPerScreen).toBe(2);
    expect(primitive.motionLimits.ambientMinMs).toBe(8000);
    expect(primitive.motionLimits.ambientMaxMs).toBe(16000);
    expect(primitive.motionLimits.responsiveMinMs).toBe(160);
    expect(primitive.motionLimits.responsiveMaxMs).toBe(300);
  });

  test('her spec ekran başına animasyon bütçesine uyar', () => {
    for (const spec of Object.values(allScreenSpecs)) {
      expect(spec.maxAnimatedElements).toBeLessThanOrEqual(
        primitive.motionLimits.maxAnimatedElementsPerScreen,
      );
      if (spec.motionLevel === 'M0') expect(spec.maxAnimatedElements).toBe(0);
    }
  });

  test('doğrulayıcı bütçe aşımını ve M0 çelişkisini reddeder', () => {
    expect(() =>
      assertScreenSpec({ ...homeSpec, maxAnimatedElements: 3 as unknown as 2 }),
    ).toThrow(/maxAnimatedElements/);
    expect(() => assertScreenSpec({ ...chatSpec, maxAnimatedElements: 1 })).toThrow(/M0/);
  });
});
