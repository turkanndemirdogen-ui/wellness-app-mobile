/**
 * Test 11 — Home B1-B6 preservation characterization
 * (HOME_B1_B6_PRESERVATION_MAP sözleşmesinin saf-fonksiyon katmanı).
 *
 * Kilitler: deterministik günlük seçim (FNV-1a; aynı gün aynı sonuç, fetch
 * sırasından bağımsız) · B3 havuzu yalnız app_safe + uyarı çipsiz · B2 yalnız
 * transit-only kurallar (natal sızmaz — free sınırı) · boş havuz → null
 * (sessiz gizlenme). Bu davranışlar Phase 4 retrofit'inde DEĞİŞEMEZ.
 */

import type { Herb, Quote } from '@/lib/content';
import {
  hashDateKey,
  pickDailyHerb,
  pickDailyQuote,
  pickThemeLine,
  todayKey,
  transitOnlyEvents,
  type ThemeRule,
} from '@/lib/home';

const herb = (id: string, appSafe: boolean, uyari?: string): Herb =>
  ({
    herb_id: id,
    app_safe: appSafe,
    data: uyari ? { guvenlik: { uyari_chip: uyari } } : {},
  }) as unknown as Herb;

const HERBS: Herb[] = [
  herb('papatya', true),
  herb('lavanta', true),
  herb('adacayi', true),
  herb('kantaron', true, 'T2'), // uyarı çipli → günün kartına giremez
  herb('gizli', false), // app_safe değil → giremez
];

const RULES: ThemeRule[] = [
  {
    rule_id: 'r-transit',
    aspect_quality: null,
    natal_target: null,
    priority: 5,
    user_text_variants: ['a', 'b', 'c'],
  },
  {
    rule_id: 'r-natal',
    aspect_quality: 'trine',
    natal_target: 'moon',
    priority: 99, // en yüksek öncelik AMA natal → free yüzeye SIZAMAZ
    user_text_variants: ['natal-metin'],
  },
];

const QUOTES = [
  { soz_id: 'q1', text_tr: 'bir' },
  { soz_id: 'q2', text_tr: 'iki' },
  { soz_id: 'q3', text_tr: '' }, // boş metin havuza girmez
] as unknown as Quote[];

describe('Home B1-B6 karakterizasyonu (preservation map)', () => {
  test('todayKey YYYY-MM-DD (yerel)', () => {
    expect(todayKey(new Date(2026, 6, 21))).toBe('2026-07-21');
    expect(todayKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  test('hashDateKey deterministik ve kararlı (FNV-1a)', () => {
    expect(hashDateKey('2026-07-21')).toBe(hashDateKey('2026-07-21'));
    expect(hashDateKey('2026-07-21')).not.toBe(hashDateKey('2026-07-22'));
  });

  test('B3: aynı gün aynı bitki; fetch sırasından bağımsız; filtreler kilitli', () => {
    const first = pickDailyHerb(HERBS, '2026-07-21');
    const again = pickDailyHerb([...HERBS].reverse(), '2026-07-21');
    expect(first).not.toBeNull();
    expect(again?.herb_id).toBe(first?.herb_id);
    // uyarı çipli ve app_safe olmayan türler havuza asla giremez:
    expect(['kantaron', 'gizli']).not.toContain(first?.herb_id);
    // boş/uygunsuz havuz → null (hero fallback zinciri üst katmanda):
    expect(pickDailyHerb([], '2026-07-21')).toBeNull();
    expect(pickDailyHerb([herb('x', false)], '2026-07-21')).toBeNull();
  });

  test('B2: yalnız transit-only kural seçilir — natal free yüzeye sızmaz', () => {
    const line = pickThemeLine(RULES, '2026-07-21');
    expect(['a', 'b', 'c']).toContain(line);
    expect(line).not.toBe('natal-metin');
    // deterministik: aynı gün aynı varyant
    expect(pickThemeLine(RULES, '2026-07-21')).toBe(line);
    // kural yoksa satır sessizce gizlenir:
    expect(pickThemeLine(null, '2026-07-21')).toBeNull();
    expect(pickThemeLine([RULES[1]], '2026-07-21')).toBeNull();
  });

  test('transitOnlyEvents natal imalı olayları süzer', () => {
    const events = [
      { aspect_quality: null, natal_target: null },
      { aspect_quality: 'square', natal_target: null },
      { aspect_quality: null, natal_target: 'sun' },
    ] as Parameters<typeof transitOnlyEvents>[0];
    expect(transitOnlyEvents(events)).toHaveLength(1);
  });

  test('B5: global günlük deterministik söz; boş havuz → null (sahte aktivasyon yok)', () => {
    const q = pickDailyQuote(QUOTES, '2026-07-21');
    expect(q).not.toBeNull();
    expect(q?.soz_id).not.toBe('q3');
    expect(pickDailyQuote(QUOTES, '2026-07-21')?.soz_id).toBe(q?.soz_id);
    expect(pickDailyQuote([], '2026-07-21')).toBeNull();
    expect(pickDailyQuote(null, '2026-07-21')).toBeNull();
  });
});
