/**
 * HerbImage sözleşmesi (10 §10-§11 + 15 §10):
 * - path+version → botanicals public URL, cache anahtarı `?v=<version>` (TAM
 *   URL saklanmaz; Storage SDK üretir).
 * - path yok / Supabase yapılandırılmamış → yer tutucu: bilimsel ad + bekliyor
 *   etiketi GÖRÜNÜR metinde (durum yalnız renkle bildirilmez).
 * - accessibilityLabel verilmezse dekoratif: a11y ağacından gizlenir (adlar
 *   kartın kendi label'ında taşınır — 07 §6).
 */

import TestRenderer, { act } from 'react-test-renderer';

let mockConfigured = true;
const mockGetPublicUrl = jest.fn((path: string) => ({
  data: { publicUrl: `https://cdn.test/storage/v1/object/public/botanicals/${path}` },
}));

jest.mock('@/lib/supabase', () => ({
  get supabase() {
    return mockConfigured
      ? { storage: { from: () => ({ getPublicUrl: mockGetPublicUrl }) } }
      : null;
  },
}));

import { HerbImage, herbImagePublicUrl, HERB_IMAGE_BUCKET } from '@/domain-ui';

type Node =
  | { type: string; props: Record<string, unknown>; children: (Node | string)[] | null }
  | string
  | null;

function render(element: React.ReactElement): Exclude<Node, string | null> {
  let r!: TestRenderer.ReactTestRenderer;
  act(() => {
    r = TestRenderer.create(element);
  });
  return r.toJSON() as unknown as Exclude<Node, string | null>;
}

function visibleText(node: Node): string {
  if (node == null || typeof node === 'string') return typeof node === 'string' ? node : '';
  if (!node.children) return '';
  return node.children.map(visibleText).join(' ');
}

function findImageUri(node: Node): string | null {
  if (node == null || typeof node === 'string') return null;
  const raw = node.props?.source ?? node.props?.src;
  const source = (Array.isArray(raw) ? raw[0] : raw) as { uri?: string } | string | undefined;
  if (typeof source === 'string') return source;
  if (source?.uri) return source.uri;
  for (const child of node.children ?? []) {
    const found = findImageUri(child);
    if (found) return found;
  }
  return null;
}

const SCI = 'Taraxacum officinale';

beforeEach(() => {
  mockConfigured = true;
  mockGetPublicUrl.mockClear();
});

describe('herbImagePublicUrl — URL kuralı (10 §10)', () => {
  it('path + version → public URL + ?v= cache anahtarı', () => {
    const url = herbImagePublicUrl('karahindiba/card-01.webp', 1);
    expect(url).toBe(
      'https://cdn.test/storage/v1/object/public/botanicals/karahindiba/card-01.webp?v=1',
    );
    expect(mockGetPublicUrl).toHaveBeenCalledWith('karahindiba/card-01.webp');
  });

  it('path/version eksikse null (yarım kayıt görsel üretmez — 0007 pair kuralı)', () => {
    expect(herbImagePublicUrl(null, 1)).toBeNull();
    expect(herbImagePublicUrl('x/card-01.webp', null)).toBeNull();
    expect(herbImagePublicUrl('x/card-01.webp', 0)).toBeNull();
  });

  it('Supabase yapılandırılmamışsa null', () => {
    mockConfigured = false;
    expect(herbImagePublicUrl('x/card-01.webp', 1)).toBeNull();
  });

  it('bucket adı sabit botanicals (yol içinde bucket geçmez)', () => {
    expect(HERB_IMAGE_BUCKET).toBe('botanicals');
  });
});

describe('HerbImage — görsel modu', () => {
  it('geçerli path+version ile görsel URL’i ?v= anahtarıyla render eder', () => {
    const tree = render(
      <HerbImage
        imagePath="karahindiba/card-01.webp"
        imageVersion={2}
        accessibilityLabel="Karahindiba kart görseli"
      />,
    );
    expect(findImageUri(tree)).toContain('karahindiba/card-01.webp?v=2');
  });

  it('accessibilityLabel verilmezse dekoratif (a11y ağacından gizli)', () => {
    const tree = render(<HerbImage imagePath="nane/card-01.webp" imageVersion={1} />);
    expect(tree.props.accessibilityElementsHidden).toBe(true);
    expect(tree.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});

describe('HerbImage — yer tutucu (10 §11 + 15 §10)', () => {
  it('path yoksa bilimsel ad + bekliyor etiketi GÖRÜNÜR metinde', () => {
    const tree = render(
      <HerbImage imagePath={null} imageVersion={null} scientificName={SCI} />,
    );
    const text = visibleText(tree);
    expect(text).toContain(SCI);
    expect(text).toContain('bekliyor');
    expect(findImageUri(tree)).toBeNull();
  });

  it('Supabase yapılandırılmamışsa path dolu olsa da yer tutucuya düşer', () => {
    mockConfigured = false;
    const tree = render(
      <HerbImage imagePath="nane/card-01.webp" imageVersion={1} scientificName={SCI} />,
    );
    expect(findImageUri(tree)).toBeNull();
    expect(visibleText(tree)).toContain('bekliyor');
  });

  it('accessibilityLabel verilirse yer tutucu label’ı bekliyor durumunu da taşır', () => {
    const tree = render(
      <HerbImage
        imagePath={null}
        imageVersion={null}
        scientificName={SCI}
        accessibilityLabel="Karahindiba kart görseli"
      />,
    );
    const label = String(tree.props.accessibilityLabel);
    expect(label).toContain('Karahindiba kart görseli');
    expect(label).toContain('bekliyor');
  });
});
