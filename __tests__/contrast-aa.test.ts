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

describe('kontrast — hero scrim üstü metin (15 EK-A · §10)', () => {
  /**
   * Scrim'in alt durağı görselin ÜSTÜNE alfa ile biner. En kötü hâl: altta
   * bembeyaz bir görsel — scrim ne kadar açılırsa metin o kadar zorlanır.
   * Bu bileşim AA'yı geçiyorsa gerçek botanik fotoğrafların hepsinde geçer.
   */
  function compositeOverWhite(rgbaValue: string): string {
    const parts = rgbaValue.replace(/rgba?\(|\)/g, '').split(',').map(Number);
    const [r, g, b, a] = parts;
    const mix = (channel: number) => Math.round(channel * a + 255 * (1 - a));
    return `#${[mix(r), mix(g), mix(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  }

  const worstCase = compositeOverWhite(primitive.material.heroAtmosphere.bottom);

  it('yaygın ad (onPanel) en kötü hâlde bile AA', () => {
    const { text } = buildSemanticColors('day');
    expect(ratio(text.onPanel, worstCase)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('bilimsel ad (açık lila) en kötü hâlde bile AA', () => {
    const { text } = buildSemanticColors('day');
    expect(ratio(text.onPanelAccent, worstCase)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('bağlam şeridi metni (onPanelSecondary) en az büyük-metin eşiğini geçer', () => {
    const { text } = buildSemanticColors('day');
    expect(ratio(text.onPanelSecondary, worstCase)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('scrim alt durağı yeterince opak — metin bandı görselden bağımsız', () => {
    const alpha = Number(
      primitive.material.heroAtmosphere.bottom.replace(/rgba?\(|\)/g, '').split(',')[3],
    );
    expect(alpha).toBeGreaterThanOrEqual(0.85);
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
