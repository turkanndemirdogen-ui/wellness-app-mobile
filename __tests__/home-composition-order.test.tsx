/**
 * Home kompozisyon sırası — Phase 4 retrofit kilidi (15 §7 / 08 §3).
 *
 * Blok sırası ürün kararıdır ve D2-D4 dilimlerinde DEĞİŞEMEZ:
 *   tarih+ay çipi → günün bitkisi (HERO) → check-in → gökyüzü satırı →
 *   [B6 slot: render yok] → günün sözü + kaydet/paylaş.
 *
 * Test sırayı görünür metin akışından okur (stil/snapshot yok — retrofit ile
 * çatışır); yalnız "hangi metin hangisinden önce geliyor" iddiası taşır.
 */

import TestRenderer, { act } from 'react-test-renderer';

import type { DailyTransit } from '@/lib/astro';
import type { HomeDaily } from '@/lib/home';

jest.mock('@/lib/supabase', () => ({
  get isSupabaseConfigured() {
    return true;
  },
  get supabase() {
    return null;
  },
}));

const TRANSIT: DailyTransit = {
  date: '2026-09-01',
  moonSign: 'koc',
  moonPhase: 'dolunay',
  events: [],
  themes: [],
};

jest.mock('@/lib/astro', () => ({
  astro: {
    getNatalChart: async () => ({}),
    getDailyTransit: async () => TRANSIT,
  },
}));

const SKY_LINE = 'Gün, yavaşlamaya alan açıyor.';
const QUOTE = 'Sessizlik de bir cevaptır.';

/**
 * Fixture'lar TEMBEL kurulur: jest.mock çağrıları dosyanın başına hoist edilir,
 * ALL_CAPS sabitler ise babel-plugin-jest-hoist tarafından "sabit" varsayılıp
 * geçirilir — modül-init sırasında henüz atanmamış olabilirler (sessizce
 * undefined). `mock` önekli fonksiyon render anında çalışır → sıra güvenli.
 */
function mockBuildDaily(): HomeDaily {
  return {
  herbs: [
    {
      herb_id: 'lavanta',
      name_tr: 'Lavanta',
      gezegen_birincil: 'merkur',
      app_safe: true,
      guven_tier: null,
      image_path: null,
      image_version: null,
      data: {
        tek_satir: 'Geleneksel olarak dinginlik anlarıyla anılır.',
        names: { la: 'Lavandula angustifolia' },
      },
    },
  ],
  rules: [
    {
      rule_id: 'r1',
      aspect_quality: null,
      natal_target: null,
      priority: 1,
      user_text_variants: [SKY_LINE],
    },
  ],
  quotes: [{ soz_id: 's1', text_tr: QUOTE }],
  } as unknown as HomeDaily;
}

jest.mock('@/lib/query', () => ({
  useAsyncResource: () => ({
    data: mockBuildDaily(),
    phase: 'success',
    stale: false,
    error: null,
    refresh: async () => undefined,
  }),
}));

jest.mock('@/lib/checkin', () => ({
  readCheckin: async () => null,
  saveCheckin: async () => true,
}));
jest.mock('@/lib/favorites', () => ({
  readFavoriteQuoteIds: async () => [],
  toggleFavoriteQuote: async () => [],
}));
jest.mock('@/lib/haptics', () => ({
  hapticSelection: () => undefined,
  hapticCompletion: () => undefined,
}));
jest.mock('expo-router', () => ({
  useRouter: () => ({ navigate: jest.fn(), push: jest.fn() }),
}));

import AnaSayfaScreen from '@/app/(tabs)/index';
import { homeCopy, MONTHS_TR, MOON_PHASE_TR, WEEKDAYS_TR } from '@/content/home-copy';

type Node =
  | { type: string; props: Record<string, unknown>; children: (Node | string)[] | null }
  | string
  | null;

function visibleText(node: Node | Node[]): string {
  if (node == null) return '';
  if (Array.isArray(node)) return node.map(visibleText).join(' ');
  if (typeof node === 'string') return node;
  return (node.children ?? []).map(visibleText).join(' ');
}

async function renderScreen(): Promise<string> {
  let r!: TestRenderer.ReactTestRenderer;
  await act(async () => {
    r = TestRenderer.create(<AnaSayfaScreen />);
  });
  return visibleText(r.toJSON() as unknown as Node);
}

/** Metin akışındaki konum; bulunamazsa testi anlamlı biçimde düşürür. */
function at(text: string, needle: string): number {
  const i = text.indexOf(needle);
  expect(i).toBeGreaterThanOrEqual(0);
  return i;
}

describe('Home blok sırası (15 §7 / 08 §3)', () => {
  it('bağlam şeridi → hero → check-in → gökyüzü → söz sırasıyla akar', async () => {
    const text = await renderScreen();
    const today = new Date();
    const date = `${today.getDate()} ${MONTHS_TR[today.getMonth()]}, ${WEEKDAYS_TR[today.getDay()]}`;

    const order = [
      at(text, date),
      at(text, 'Lavanta'),
      at(text, homeCopy.checkin.sectionTitle),
      at(text, SKY_LINE),
      at(text, QUOTE),
    ];
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it('ay çipi bağlam şeridinde, hero adından ÖNCE gelir', async () => {
    const text = await renderScreen();
    expect(at(text, MOON_PHASE_TR[TRANSIT.moonPhase])).toBeLessThan(at(text, 'Lavanta'));
  });

  it('bilimsel ad hero adının hemen ardında görünür (07 §6 / 12 §F)', async () => {
    const text = await renderScreen();
    expect(at(text, 'Lavandula angustifolia')).toBeGreaterThan(at(text, 'Lavanta'));
    expect(at(text, 'Lavandula angustifolia')).toBeLessThan(
      at(text, homeCopy.checkin.sectionTitle),
    );
  });

  it('kaydet/paylaş mikro-eylemleri en sonda (15 §7 sıra #7)', async () => {
    const text = await renderScreen();
    expect(at(text, homeCopy.quote.save)).toBeGreaterThan(at(text, SKY_LINE));
    expect(at(text, homeCopy.quote.share)).toBeGreaterThan(at(text, SKY_LINE));
  });
});
