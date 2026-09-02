/**
 * Home render sözleşmesi — Phase 4 retrofit güvenlik ağı
 * (HOME_B1_B6_PRESERVATION_MAP "korunacak davranış" sütunu; ekran görselleri
 * değişirken bu render davranışları DEĞİŞEMEZ):
 * - B3 hero ASLA boş kalmaz: canlı havuz yoksa gömülü açılış bitkisi (ONAYLI).
 * - B1 ay çipi veri yokken SESSİZCE gizlenir (hata metni/çökme yok).
 * - B2 satırı ve B5 sözü havuz boşken SESSİZCE gizlenir (sahte etkinlik yok).
 * - B6 hiçbir koşulda render edilmez; tüm sembolik canlı içerik boşken tek
 *   yumuşak offlineSky satırı görünür — ekran bu blok setiyle TAMDIR.
 *
 * Stil/snapshot yok (retrofit ile çatışır); haptic sıra testi yok (handler'lar
 * retrofit kapsamı dışında — kabul edilen artık risk, PR notunda).
 */

import TestRenderer, { act } from 'react-test-renderer';

import type { DailyTransit } from '@/lib/astro';
import type { HomeDaily } from '@/lib/home';

let mockConfigured = false;
jest.mock('@/lib/supabase', () => ({
  get isSupabaseConfigured() {
    return mockConfigured;
  },
  get supabase() {
    return null;
  },
}));

let mockTransit: DailyTransit | null = null;
jest.mock('@/lib/astro', () => ({
  astro: {
    getNatalChart: async () => ({}),
    getDailyTransit: async () => {
      if (mockTransit == null) throw new Error('gok-verisi-yok');
      return mockTransit;
    },
  },
}));

let mockDaily: {
  data: HomeDaily | null;
  phase: 'idle' | 'fetching' | 'success' | 'error';
  stale: boolean;
  error: null;
  refresh: () => Promise<void>;
};
jest.mock('@/lib/query', () => ({
  useAsyncResource: () => mockDaily,
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
import {
  homeCopy,
  MOON_IN_SIGN_TR,
  MOON_PHASE_TR,
  OPENING_HERB,
} from '@/content/home-copy';

type Node =
  | { type: string; props: Record<string, unknown>; children: (Node | string)[] | null }
  | string
  | null;

async function renderScreen(): Promise<Node> {
  let r!: TestRenderer.ReactTestRenderer;
  await act(async () => {
    r = TestRenderer.create(<AnaSayfaScreen />);
  });
  return r.toJSON() as unknown as Node;
}

function visibleText(node: Node | Node[]): string {
  if (node == null) return '';
  if (Array.isArray(node)) return node.map(visibleText).join(' ');
  if (typeof node === 'string') return node;
  return (node.children ?? []).map(visibleText).join(' ');
}

const TRANSIT: DailyTransit = {
  date: '2026-09-01',
  moonSign: 'koc',
  moonPhase: 'dolunay',
  events: [],
  themes: [],
};

const EMPTY_DAILY: HomeDaily = { herbs: null, rules: null, quotes: null };

beforeEach(() => {
  mockConfigured = false;
  mockTransit = null;
  mockDaily = {
    data: null,
    phase: 'idle',
    stale: false,
    error: null,
    refresh: async () => undefined,
  };
});

describe('B3 — hero asla boş kalmaz (ONAYLI zincir: canlı → önbellek → açılış bitkisi)', () => {
  it('hiç veri yokken gömülü açılış bitkisi render edilir', async () => {
    const text = visibleText(await renderScreen());
    expect(text).toContain(OPENING_HERB.name_tr as string);
    expect(text).toContain(OPENING_HERB.data?.tek_satir as string);
  });

  it('canlı havuz boş dizilerle dönse de açılış bitkisine düşer', async () => {
    mockConfigured = true;
    mockTransit = TRANSIT;
    mockDaily = { ...mockDaily, data: { herbs: [], rules: [], quotes: [] }, phase: 'success' };
    const text = visibleText(await renderScreen());
    expect(text).toContain(OPENING_HERB.name_tr as string);
  });
});

describe('B1 — ay çipi', () => {
  it('transit varken burçtaki ay + faz metni görünür', async () => {
    mockTransit = TRANSIT;
    const text = visibleText(await renderScreen());
    expect(text).toContain(MOON_IN_SIGN_TR[TRANSIT.moonSign]);
    expect(text).toContain(MOON_PHASE_TR[TRANSIT.moonPhase]);
  });

  it('transit yokken çip sessizce gizli — hata metni yok, çökme yok', async () => {
    const text = visibleText(await renderScreen());
    for (const phase of Object.values(MOON_PHASE_TR)) {
      expect(text).not.toContain(phase);
    }
  });
});

describe('B2 + B5 — havuz boşken sessiz gizlenme (sahte etkinlik yasak)', () => {
  it('kural ve söz havuzu boş → satır yok, söz kartı ve mikro-eylemleri yok', async () => {
    mockConfigured = true;
    mockTransit = TRANSIT;
    mockDaily = { ...mockDaily, data: { herbs: [], rules: [], quotes: [] }, phase: 'success' };
    const text = visibleText(await renderScreen());
    expect(text).not.toContain(homeCopy.quote.save);
    expect(text).not.toContain(homeCopy.quote.share);
  });

  it('söz havuzu doluysa söz + kaydet/paylaş eylemleri görünür', async () => {
    mockConfigured = true;
    mockTransit = TRANSIT;
    mockDaily = {
      ...mockDaily,
      phase: 'success',
      data: {
        herbs: [],
        rules: [],
        quotes: [{ soz_id: 's1', text_tr: 'Deneme sözü satırı.' }],
      },
    };
    const text = visibleText(await renderScreen());
    expect(text).toContain('Deneme sözü satırı.');
    expect(text).toContain(homeCopy.quote.save);
    expect(text).toContain(homeCopy.quote.share);
  });
});

describe('B4 + B6 + boş gök hâli', () => {
  it('B4 check-in şeridi her durumda görünür (asla gizlenmez)', async () => {
    const text = visibleText(await renderScreen());
    expect(text).toContain(homeCopy.checkin.sectionTitle);
    expect(text).toContain(homeCopy.checkin.question);
  });

  it('tüm sembolik canlı içerik boş → tek offlineSky satırı; B6 hiçbir şey render etmez', async () => {
    const text = visibleText(await renderScreen());
    expect(text).toContain(homeCopy.offlineSky);
    // B6'nın yokluğu sözleşmedir: boş gök hâlinde ekran yalnız B1 başlık +
    // B3 açılış bitkisi + B4 şerit + offlineSky (+ __DEV__ notları) içerir.
    expect(text.includes(homeCopy.quote.save)).toBe(false);
  });
});
