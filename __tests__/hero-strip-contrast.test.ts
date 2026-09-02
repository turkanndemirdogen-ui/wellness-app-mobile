/**
 * Hero künye şeridi — metin/zemin kontrastı (15 §10, kabul kriteri yerine geçen kapı).
 *
 * Hero katmansız hale gelince (2026-09-02) metin fotoğrafın üstünden çıktı ve
 * görselin ALTINDAKİ opak krem şeride indi. Zemin artık SABİT bir token
 * olduğu için kontrast piksel ölçümü gerektirmiyor — token seviyesinde
 * kesin olarak doğrulanabiliyor. Piksel ölçümüne dayalı eski kapı
 * (`hero-text-contrast`) bu yüzden uykuda; yerini bu test aldı.
 *
 * Bağladıkları:
 *  · bitki adı, bilimsel ad ve çip metni krem şeritte AA'yı geçer,
 *  · şerit zemini KOYU DEĞİLDİR (15 §3: koyuluk yalnız VisualPanel'de),
 *  · çip yüzeyi beyaz bir hap değildir (ürün sahibi kuralı),
 *  · hero'da artık koyu atmosfer katmanı tüketilmiyor.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { AA_NORMAL, contrastRatio, relativeLuminance } from '@/design-system/theme/contrast';
import { primitive } from '@/design-system/tokens/primitive.generated';

const STRIP = primitive.material.heroStrip;
const CHIP = primitive.material.heroChip;

function ratio(a: string, b: string): number {
  return Number(contrastRatio(a, b).toFixed(2));
}

describe('hero künye şeridi — kontrast', () => {
  it('bitki adı (koyu patlıcan) krem şeritte AA', () => {
    expect(ratio(STRIP.plantName, STRIP.background)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('bilimsel ad (açık mor) krem şeritte AA', () => {
    expect(ratio(STRIP.scientific, STRIP.background)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('çip metni (koyu altın) krem şeritte AA', () => {
    expect(ratio(CHIP.text, STRIP.background)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('bitki adı bilimsel addan daha baskın — hiyerarşi renkte de var', () => {
    expect(ratio(STRIP.plantName, STRIP.background)).toBeGreaterThan(
      ratio(STRIP.scientific, STRIP.background),
    );
  });
});

describe('hero künye şeridi — krom sınırı (15 §3)', () => {
  it('şerit zemini AÇIK yüzeydir, koyu değil', () => {
    // Açık krom eşiği: parlaklık 0.6 üstü (krem/pudra ailesi).
    expect(relativeLuminance(STRIP.background)).toBeGreaterThan(0.6);
  });

  it('şerit zemini panel-only dark token’larından biri DEĞİL', () => {
    const panelDark = Object.values(primitive.color.visualPanels).map((v) => v.toUpperCase());
    expect(panelDark).not.toContain(STRIP.background.toUpperCase());
  });

  it('çip yüzeyi beyaz hap değil (ürün sahibi kuralı) — şeffaf', () => {
    const alpha = Number(CHIP.backing.replace(/rgba?\(|\)/g, '').split(',')[3]);
    expect(alpha).toBe(0);
  });

  it('çip hairline metinle aynı tondan türer', () => {
    const [r, g, b] = CHIP.hairline.replace(/rgba?\(|\)/g, '').split(',').map(Number);
    const text = CHIP.text.replace('#', '');
    expect([r, g, b]).toEqual([0, 2, 4].map((i) => parseInt(text.slice(i, i + 2), 16)));
  });
});

describe('hero katmansız — kaldırılan katmanlar geri sızmasın', () => {
  const source = String(
    readFileSync(join(__dirname, '..', 'src', 'domain-ui', 'daily-herb-hero.tsx')),
  );

  const REMOVED: [string, string][] = [
    ['vinyet', 'heroVignette'],
    ['adaptif bulut', 'heroCloud'],
    ['altın ışık huzmesi', 'heroGoldShaft'],
    ['lila sis', 'lilacMist'],
    ['metin gölgesi', 'textShadow'],
  ];

  it.each(REMOVED)('hero bileşeninde %s yok', (_ad, needle) => {
    expect(source).not.toContain(needle);
  });

  it('hero uyuyan atmosfer/emniyet token gruplarını okumuyor', () => {
    expect(source).not.toContain('heroAtmosphere');
    expect(source).not.toContain('heroTextSafety');
  });
});
