/**
 * Materyal token bütünlüğü (04 SURFACE/GLASS/GLOW · 2026-09-02 eklemesi).
 *
 * Kaynak sıradüzeni kilidi: 04 materyal SİSTEMİNİ tanımlar, 15 §4 renk
 * DEĞERLERİNİ. Çelişkide 15 kazanır — cam tint'i chrome.surface'ten, kenar ve
 * gölge mürekkebi chrome.textPrimary'den, glow renkleri botanical/celestial/
 * planet ailelerinden türer. Bu test o türetmeyi ve 04'ün sayısal kurallarını
 * bağlar; palet kayarsa burada patlar.
 */

import { primitive } from '@/design-system/tokens/primitive.generated';

const m = primitive.material;

/** 'rgba(r,g,b,a)' → [r,g,b,a]. */
function rgba(value: string): [number, number, number, number] {
  const parts = value.replace(/rgba?\(|\)/g, '').split(',');
  return [Number(parts[0]), Number(parts[1]), Number(parts[2]), Number(parts[3] ?? 1)];
}

function hexRgb(hex: string): [number, number, number] {
  const raw = hex.replace('#', '');
  return [
    parseInt(raw.slice(0, 2), 16),
    parseInt(raw.slice(2, 4), 16),
    parseInt(raw.slice(4, 6), 16),
  ];
}

describe('cam seviyeleri (04 §5)', () => {
  test('dört seviye ve kanonik blur değerleri', () => {
    expect(Object.keys(m.glass)).toEqual(['none', 'mist', 'frost', 'deepFrost']);
    expect(m.glass.none.blur).toBe(0);
    expect(m.glass.mist.blur).toBe(8);
    expect(m.glass.frost.blur).toBe(16);
    expect(m.glass.deepFrost.blur).toBe(24);
  });

  test('cam tint’i 15 §4 krom yüzeyinden türer (04’ün ham #FCFBF8 değeri DEĞİL)', () => {
    const surface = hexRgb(primitive.color.chrome.surface);
    for (const level of ['mist', 'frost'] as const) {
      expect(rgba(m.glass[level].tint).slice(0, 3)).toEqual(surface);
    }
    // deepFrost daha sıcak zemine oturur: chrome.parchment
    expect(rgba(m.glass.deepFrost.tint).slice(0, 3)).toEqual(
      hexRgb(primitive.color.chrome.parchment),
    );
    expect(m.glass.none.tint).toBe(primitive.color.chrome.surface);
  });

  test('gövde metni taşıyan camın opaklığı ≥ 0.78 (04 §5.1)', () => {
    for (const level of ['mist', 'frost', 'deepFrost'] as const) {
      const alpha = rgba(m.glass[level].tint)[3];
      expect(alpha).toBeGreaterThanOrEqual(0.72);
    }
    // frost ve mist metin yüzeyidir → sert sınır 0.78
    expect(rgba(m.glass.frost.tint)[3]).toBeGreaterThanOrEqual(0.78);
    expect(rgba(m.glass.mist.tint)[3]).toBeGreaterThanOrEqual(0.78);
  });
});

describe('kenar ve iç ışık (04 §7.1, §11.1)', () => {
  test('mürekkep kenarları chrome.textPrimary’den türer, alfa ölçeği artan', () => {
    const ink = hexRgb(primitive.color.chrome.textPrimary);
    const alphas: number[] = [];
    for (const tone of ['hairline', 'soft', 'medium'] as const) {
      const [r, g, b, a] = rgba(m.borderTone[tone]);
      expect([r, g, b]).toEqual(ink);
      alphas.push(a);
    }
    expect(alphas).toEqual([...alphas].sort((a, b) => a - b));
  });

  test('cam kenarı beyaz ışık çizgisidir ve derinleştikçe güçlenir', () => {
    const order = [m.glassBorder.mist, m.glassBorder.frost, m.glassBorder.deep].map(
      (v) => rgba(v)[3],
    );
    expect(order).toEqual([...order].sort((a, b) => a - b));
    for (const value of Object.values(m.glassBorder)) {
      expect(rgba(value).slice(0, 3)).toEqual([255, 255, 255]);
    }
  });

  test('iç ışık parlak plastik olmaz — hiçbir değer tam opak değil', () => {
    for (const value of Object.values(m.innerHighlight)) {
      expect(rgba(value)[3]).toBeLessThan(0.6);
    }
  });
});

describe('glow (04 §10)', () => {
  test('taksonomi eksiksiz ve renkler 15 §4 ailelerinden', () => {
    expect(Object.keys(m.glow)).toEqual([
      'ambientWarm',
      'ambientCool',
      'botanical',
      'selection',
      'celestial',
      'ceremonial',
    ]);
    const expected: Record<string, string> = {
      ambientWarm: primitive.color.planet.sun,
      ambientCool: primitive.color.celestial.sky,
      botanical: primitive.color.botanical.sage,
      selection: primitive.color.botanical.eucalyptus,
      celestial: primitive.color.celestial.violet,
      ceremonial: primitive.color.celestial.gold,
    };
    for (const [name, hex] of Object.entries(expected)) {
      const glow = m.glow[name as keyof typeof m.glow];
      expect(rgba(glow.color).slice(0, 3)).toEqual(hexRgb(hex));
    }
  });

  test('glow düşük opaklıkta kalır — neon yasağı (04 §10.3)', () => {
    for (const glow of Object.values(m.glow)) {
      expect(rgba(glow.color)[3]).toBeLessThanOrEqual(0.28);
      expect(glow.radius).toBeGreaterThan(0);
    }
  });
});

describe('gölge (04 §9)', () => {
  test('üç seviye; renk krom mürekkebi; opaklık %14’ü aşmaz (04 §9.3)', () => {
    expect(Object.keys(m.shadow)).toEqual(['soft', 'card', 'elevated']);
    for (const shadow of Object.values(m.shadow)) {
      expect(shadow.color).toBe(primitive.color.chrome.textPrimary);
      expect(shadow.opacity).toBeLessThanOrEqual(0.14);
    }
  });

  test('seviyeler monoton derinleşir', () => {
    const opacities = [m.shadow.soft.opacity, m.shadow.card.opacity, m.shadow.elevated.opacity];
    const radii = [m.shadow.soft.radius, m.shadow.card.radius, m.shadow.elevated.radius];
    expect(opacities).toEqual([...opacities].sort((a, b) => a - b));
    expect(radii).toEqual([...radii].sort((a, b) => a - b));
  });
});

describe('scrim (02 §14)', () => {
  test('hero mürekkep scrim ölçeği saf siyah değil ve artan', () => {
    const scale = [
      primitive.color.scrim.inkSoft,
      primitive.color.scrim.inkMedium,
      primitive.color.scrim.inkStrong,
    ];
    const alphas = scale.map((v) => rgba(v)[3]);
    expect(alphas).toEqual([...alphas].sort((a, b) => a - b));
    for (const value of scale) {
      expect(rgba(value).slice(0, 3)).not.toEqual([0, 0, 0]);
    }
  });
});
