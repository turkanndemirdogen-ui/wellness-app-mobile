/**
 * DailyHerbHero sözleşmesi (08 §13 Home hero V2 · 04 §13.1 image + scrim).
 *
 * Kilitler:
 * - Bilimsel ad hero'da GÖRÜNÜR metinde (07 §6 · 12 §F) — görsel gelse de gelmese de.
 * - Erişilebilirlik etiketi iki adı da taşır; panel TEK basılabilir yüzeydir
 *   (§25: küçük hassas iç hedef yok).
 * - Storage görseli yokken panel çökmez: nötr yer tutucu + durum metni (10 §11).
 * - Panel ekran sözleşmesinin hero yüksekliğini kullanır (15 §7).
 */

import TestRenderer, { act } from 'react-test-renderer';

import { DailyHerbHero } from '@/domain-ui';
import { HOME_HERO_HEIGHT } from '@/design-system/tokens/screen-specs';

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

function visibleText(node: Node | Node[]): string {
  if (node == null) return '';
  if (Array.isArray(node)) return node.map(visibleText).join(' ');
  if (typeof node === 'string') return node;
  return (node.children ?? []).map(visibleText).join(' ');
}

const COMMON = 'Lavanta';
const SCI = 'Lavandula angustifolia';
const LABEL = `Günün bitkisi: ${COMMON}, ${SCI}`;

function hero(imagePath: string | null) {
  return (
    <DailyHerbHero
      herbId="lavanta"
      commonName={COMMON}
      scientificName={SCI}
      imagePath={imagePath}
      imageVersion={imagePath ? 1 : null}
      height={HOME_HERO_HEIGHT}
      accessibilityLabel={LABEL}
      onPress={() => {}}
      testID="hero"
    />
  );
}

describe('DailyHerbHero', () => {
  it('görsel varken de yokken de yaygın + bilimsel ad görünür', () => {
    for (const path of ['lavanta/card-01.webp', null]) {
      const text = visibleText(render(hero(path)));
      expect(text).toContain(COMMON);
      expect(text).toContain(SCI);
    }
  });

  it('panel tek basılabilir yüzey ve iki adı da taşıyan etiketi var', () => {
    const tree = render(hero(null));
    expect(tree.props.accessibilityRole).toBe('button');
    expect(String(tree.props.accessibilityLabel)).toContain(COMMON);
    expect(String(tree.props.accessibilityLabel)).toContain(SCI);
  });

  it('görsel yokken durum metni görünür — sessiz boş kutu değil (10 §11)', () => {
    expect(visibleText(render(hero(null)))).toContain('bekliyor');
  });

  it('panel yüksekliği ekran sözleşmesinden gelir (15 §7)', () => {
    const tree = render(hero(null));
    const flat = ([] as unknown[]).concat(tree.props.style as unknown[]).flat(3);
    const heights = flat
      .filter((s): s is { height?: number } => typeof s === 'object' && s !== null)
      .map((s) => s.height)
      .filter((h) => typeof h === 'number');
    expect(heights).toContain(HOME_HERO_HEIGHT);
  });
});
