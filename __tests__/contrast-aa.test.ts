/**
 * Kontrast kapısı (15 §10 · 12 §B): ekranda gerçekten kullanılan renk
 * çiftleri WCAG AA eşiklerini geçmeli. Phase 4 krom taşımasının (color.light →
 * color.chrome) kalıcı bekçisi — palet değişirse burada patlar.
 *
 * Not: metin/zemin çiftleri normal metin eşiğine (4.5:1) tabidir. Accent zemin
 * üstü metin rengi elle seçilmez; semantic katman theme/contrast ile hesaplar.
 */

import { AA_LARGE, AA_NORMAL, contrastRatio } from '@/design-system/theme/contrast';
import { buildSemanticColors, type TimeOfDay } from '@/design-system/theme/semantic';
import { primitive } from '@/design-system/tokens/primitive.generated';
import { allScreenSpecs, homeSpec } from '@/design-system/tokens/screen-specs';

const TIMES = Object.keys(primitive.color.ambient) as TimeOfDay[];

function ratio(a: string, b: string): number {
  return Number(contrastRatio(a, b).toFixed(2));
}

describe('kontrast — gövde metni (15 §10: normal metin ≥ 4.5:1)', () => {
  it.each(TIMES)('%s ambient diliminde birincil metin tüm yüzeylerde AA', (time) => {
    const { text, surface } = buildSemanticColors(time);
    for (const ground of [
      surface.canvas,
      surface.base,
      surface.card,
      surface.powder,
      surface.parchment,
    ]) {
      expect(ratio(text.primary, ground)).toBeGreaterThanOrEqual(AA_NORMAL);
    }
  });

  it.each(TIMES)('%s ambient diliminde ikincil metin tüm yüzeylerde AA', (time) => {
    const { text, surface } = buildSemanticColors(time);
    for (const ground of [
      surface.canvas,
      surface.base,
      surface.card,
      surface.powder,
      surface.parchment,
    ]) {
      expect(ratio(text.secondary, ground)).toBeGreaterThanOrEqual(AA_NORMAL);
    }
  });

  it('navigasyon aktif/pasif etiketleri nav zemininde AA', () => {
    const { navigation } = buildSemanticColors('day');
    expect(ratio(navigation.active, navigation.background)).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(ratio(navigation.inactive, navigation.background)).toBeGreaterThanOrEqual(AA_NORMAL);
  });
});

describe('kontrast — hero bağlam şeridi (çip görselden bağımsız)', () => {
  /**
   * Tarih ve ay çipi görsele göre DEĞİŞMEZ (ürün sahibi kuralı): sabit
   * koyu-altın metin, aynı tonda hairline, açık-altın yüzey. Yüzey olmadan
   * koyu-altın metin fotoğraf üstünde 2.6:1'de kalıyordu; yüzey deterministik
   * kontrast verir. Hero METNİNİN (beyaz ad + bilimsel ad) emniyeti ayrı
   * testtedir: hero-text-contrast.
   */
  const chip = primitive.material.heroChip;

  function opaque(rgbaValue: string): string {
    const parts = rgbaValue.replace(/rgba?\(|\)/g, '').split(',').map(Number);
    return `#${parts
      .slice(0, 3)
      .map((v) => Math.round(v).toString(16).padStart(2, '0'))
      .join('')}`;
  }

  it('koyu-altın metin, açık-altın çip yüzeyinde AA', () => {
    expect(ratio(chip.text, opaque(chip.backing))).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('çip yüzeyi beyaz DEĞİL (ürün sahibi kuralı)', () => {
    expect(opaque(chip.backing).toUpperCase()).not.toBe('#FFFFFF');
  });

  it('hairline metinle aynı tondan türer', () => {
    const [r, g, b] = chip.hairline.replace(/rgba?\(|\)/g, '').split(',').map(Number);
    const text = chip.text.replace('#', '');
    expect([r, g, b]).toEqual([0, 2, 4].map((i) => parseInt(text.slice(i, i + 2), 16)));
  });
});

describe('kontrast — accent zemin üstü metin (15 §6 accentHex × §10)', () => {
  it('Ana Sayfa accent’i (adaçayı) normal metin eşiğini geçer', () => {
    const { action } = buildSemanticColors('day', homeSpec.accentHex);
    expect(ratio(action.onPrimary, action.primary)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it.each(Object.values(allScreenSpecs).map((s) => [s.screenId, s.accentHex] as const))(
    '%s accent’i en az büyük-metin eşiğini geçer',
    (_screenId, accentHex) => {
      const { action } = buildSemanticColors('day', accentHex);
      // KANON BOŞLUĞU (raporlandı): celestial.violet hiçbir krom metniyle 4.5:1'e
      // ulaşmıyor (en iyi ~4.35). Bu yüzden genel kapı büyük-metin eşiğinde;
      // dolgulu accent butonu normal metinle kullanılacaksa ürün sahibi kararı gerekir.
      expect(ratio(action.onPrimary, action.primary)).toBeGreaterThanOrEqual(AA_LARGE);
    },
  );

  it('yıkıcı eylem metni kendi zemininde AA', () => {
    const { action } = buildSemanticColors('day');
    expect(ratio(action.onDestructive, action.destructive)).toBeGreaterThanOrEqual(AA_NORMAL);
  });
});
