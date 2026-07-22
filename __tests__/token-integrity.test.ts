/**
 * Test 1 — token integrity: üretilmiş token çıktısı 15 §4/§6'nın KESİN
 * değerleriyle birebir mi? (Kaynak tokens.json → primitive.generated.ts hattı.)
 */

import { primitive } from '@/design-system/tokens/primitive.generated';

describe('token integrity (15 §4 kesin HEX kilidi)', () => {
  test('chrome sözlüğü 15 §4 ile birebir', () => {
    expect(primitive.color.chrome).toEqual({
      background: '#F8F2EC',
      backgroundAlt: '#FCF8F4',
      surface: '#FFFDFC',
      surfaceTint: '#F5ECE7',
      powder: '#EFD9DD',
      parchment: '#F6EEE4',
      stone: '#E7E0D8',
      border: '#D8CEC5',
      textPrimary: '#2E2926',
      textSecondary: '#625954',
      textMuted: '#827771',
    });
  });

  test('visualPanels (panel-only dark) 15 §4 ile birebir', () => {
    expect(primitive.color.visualPanels).toEqual({
      dusk: '#3F4A5D',
      night: '#222B38',
      ritual: '#31303D',
      astrology: '#293346',
      gardenNight: '#26392F',
    });
  });

  test('botanical + celestial aileleri 15 §4 örneklemi', () => {
    expect(primitive.color.botanical.sage).toBe('#879A7A');
    expect(primitive.color.botanical.terracotta).toBe('#A45F48');
    expect(Object.keys(primitive.color.botanical)).toHaveLength(11);
    expect(primitive.color.celestial.gold).toBe('#C5A260');
    expect(primitive.color.celestial.indigo).toBe('#4B5374');
    expect(Object.keys(primitive.color.celestial)).toHaveLength(8);
  });

  test('layout sözlüğü 15 §6 ile birebir', () => {
    expect(primitive.layout).toEqual({
      screenPadding: 20,
      compactScreenPadding: 16,
      topPadding: 16,
      sectionGap: 28,
      denseSectionGap: 20,
      cardGap: 12,
      largeCardGap: 16,
      inlineGap: 8,
      heroRadius: 24,
      cardRadius: 16,
      compactRadius: 12,
      buttonHeight: 48,
      touchTarget: 44,
    });
  });

  test('genel dark theme seti YOK (color.dark kaldırıldı — 15 §3)', () => {
    expect((primitive.color as Record<string, unknown>).dark).toBeUndefined();
  });
});
