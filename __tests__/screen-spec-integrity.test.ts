/**
 * Test 2 — screen spec integrity: 11 spec, ScreenVisualSpec şekli ve 15 §7-8
 * kesin değerleri.
 */

import {
  allScreenSpecs,
  assertScreenSpec,
  chatSpec,
  exploreSpec,
  gardenSpec,
  homeSpec,
  mainTabSpecs,
  subScreenSpecs,
} from '@/design-system/tokens/screen-specs';

describe('screen spec integrity (15 §6-8)', () => {
  test('4 ana tab + 7 alt ekran = 11 spec tanımlı', () => {
    expect(Object.keys(mainTabSpecs)).toHaveLength(4);
    expect(Object.keys(subScreenSpecs)).toHaveLength(7);
    expect(Object.keys(allScreenSpecs)).toHaveLength(11);
  });

  test('ana tab kimlikleri 15 §2 dört sabit tab (home|explore|garden|chat)', () => {
    expect(Object.values(mainTabSpecs).map((s) => s.screenId)).toEqual([
      'home',
      'explore',
      'garden',
      'chat',
    ]);
  });

  test('homeSpec 15 §7 ile birebir', () => {
    expect(homeSpec).toEqual({
      screenId: 'home',
      backgroundHex: '#F8F2EC',
      surfaceHex: '#FFFDFC',
      accentHex: '#879A7A',
      visualPanelHex: '#3F4A5D',
      horizontalPadding: 20,
      topPadding: 16,
      sectionGap: 28,
      cardGap: 12,
      heroHeight: 280,
      cardRadius: 16,
      panelRadius: 24,
      motionLevel: 'M1',
      maxAnimatedElements: 2,
    });
  });

  test('explore/garden/chat 15 §7 anahtar değerleri', () => {
    expect(exploreSpec.backgroundHex).toBe('#FCF8F4');
    expect(exploreSpec.accentHex).toBe('#7C9DB3');
    expect(exploreSpec.visualPanelHex).toBe('#293346');
    expect(exploreSpec.sectionGap).toBe(32);
    expect(exploreSpec.maxAnimatedElements).toBe(1);

    expect(gardenSpec.backgroundHex).toBe('#F6EEE4');
    expect(gardenSpec.accentHex).toBe('#687655');
    expect(gardenSpec.visualPanelHex).toBe('#26392F');
    expect(gardenSpec.horizontalPadding).toBe(16);
    expect(gardenSpec.heroHeight).toBe(360);

    expect(chatSpec.accentHex).toBe('#827394');
    expect(chatSpec.visualPanelHex).toBe('#31303D');
    expect(chatSpec.motionLevel).toBe('M0');
    expect(chatSpec.maxAnimatedElements).toBe(0);
    expect(chatSpec.cardGap).toBe(10);
    expect(chatSpec.panelRadius).toBe(20);
  });

  test('alt ekran spec örneklemi 15 §8 değerleri', () => {
    expect(allScreenSpecs.cycleSpec.accentHex).toBe('#A45F48');
    expect(allScreenSpecs.cycleSpec.visualPanelHex).toBe('#4B5374');
    expect(allScreenSpecs.journalSpec.backgroundHex).toBe('#F6EEE4');
    expect(allScreenSpecs.journalSpec.motionLevel).toBe('M0');
    expect(allScreenSpecs.ritualsSpec.accentHex).toBe('#C5A260');
    expect(allScreenSpecs.ritualsSpec.motionLevel).toBe('M3');
    expect(allScreenSpecs.moodSpec.motionLevel).toBe('M2');
    expect(allScreenSpecs.skinCareSpec.maxAnimatedElements).toBe(0);
  });

  test('her spec doğrulayıcıdan geçer', () => {
    for (const spec of Object.values(allScreenSpecs)) {
      expect(() => assertScreenSpec(spec)).not.toThrow();
      expect(spec.surfaceHex).toBe('#FFFDFC');
    }
  });
});
